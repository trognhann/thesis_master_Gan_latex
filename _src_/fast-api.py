"""
AnimeGANv3 FastAPI Server
- Xác thực người dùng qua AWS Cognito (JWT / access token)
- Chuyển đổi ảnh / video sang phong cách anime bằng ONNX model
"""

import os
import io
import time
import base64
import logging
import traceback
import tempfile
import uuid
import shutil
from typing import Optional

import numpy as np
import cv2
import onnxruntime
from PIL import Image, ImageFilter, ImageDraw

from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from pydantic import BaseModel, Field

import httpx
from jose import jwt, JWTError, jwk
from jose.utils import base64url_decode
from dotenv import load_dotenv

import boto3
from botocore import UNSIGNED
from botocore.config import Config

# Load environment variables from .env file
load_dotenv()

# ─────────────────────────────────────────────────────────
#  Logging
# ─────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s – %(message)s",
)
logger = logging.getLogger("animegan-api")

# ─────────────────────────────────────────────────────────
#  Cognito configuration
# ─────────────────────────────────────────────────────────
COGNITO_REGION      = os.environ.get("COGNITO_REGION",      "ap-southeast-1")
COGNITO_USER_POOL_ID = os.environ.get("COGNITO_USER_POOL_ID")
COGNITO_APP_CLIENT_ID = os.environ.get("COGNITO_APP_CLIENT_ID")

if not COGNITO_USER_POOL_ID or not COGNITO_APP_CLIENT_ID:
    logger.warning("COGNITO_USER_POOL_ID or COGNITO_APP_CLIENT_ID is not set in .env file!")

COGNITO_JWKS_URL = (
    f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com"
    f"/{COGNITO_USER_POOL_ID}/.well-known/jwks.json"
)
COGNITO_ISSUER = (
    f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}"
)

# Cache JWKS để tránh gọi lại liên tục
_jwks_cache: dict = {}


async def get_jwks() -> dict:
    """Lấy JWKS từ Cognito (có cache đơn giản)."""
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    async with httpx.AsyncClient() as client:
        resp = await client.get(COGNITO_JWKS_URL, timeout=10)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        logger.info("JWKS loaded from Cognito: %d keys", len(_jwks_cache.get("keys", [])))
    return _jwks_cache


def _find_rsa_key(jwks: dict, unverified_header: dict) -> Optional[dict]:
    """Tìm key khớp với 'kid' trong header của token."""
    for key in jwks.get("keys", []):
        if key["kid"] == unverified_header.get("kid"):
            return key
    return None


async def verify_cognito_token(token: str) -> dict:
    """
    Xác thực JWT token do AWS Cognito phát hành.
    Trả về payload nếu hợp lệ, ném HTTPException nếu không hợp lệ.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # 1. Decode header không verify để lấy kid
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        logger.warning("Invalid token header")
        raise credentials_exception

    try:
        jwks = await get_jwks()
    except Exception as exc:
        logger.error("Cannot fetch JWKS: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to fetch authentication keys",
        )

    rsa_key = _find_rsa_key(jwks, unverified_header)
    if rsa_key is None:
        logger.warning("No matching RSA key found for kid=%s", unverified_header.get("kid"))
        raise credentials_exception

    try:
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=COGNITO_APP_CLIENT_ID,
            issuer=COGNITO_ISSUER,
        )
    except JWTError as exc:
        logger.warning("Token validation failed: %s", exc)
        raise credentials_exception

    # Cognito phát access token thì không có "aud" claim → bỏ kiểm audience
    # nếu dùng access token thay id token, decode lại không kiểm audience:
    if payload.get("token_use") == "access":
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                issuer=COGNITO_ISSUER,
                options={"verify_aud": False},
            )
        except JWTError as exc:
            logger.warning("Access token validation failed: %s", exc)
            raise credentials_exception

    return payload


# ─────────────────────────────────────────────────────────
#  FastAPI security scheme
# ─────────────────────────────────────────────────────────
bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """Dependency – trả về Cognito payload của user hiện tại."""
    return await verify_cognito_token(credentials.credentials)


# ─────────────────────────────────────────────────────────
#  ONNX session manager (singleton per process)
# ─────────────────────────────────────────────────────────
_ort_sessions: dict[str, onnxruntime.InferenceSession] = {}

ort_sess_options = onnxruntime.SessionOptions()
ort_sess_options.intra_op_num_threads = int(os.environ.get("ORT_INTRA_OP_NUM_THREADS", 0))


def load_ort_session(onnx_path: str) -> onnxruntime.InferenceSession:
    if onnx_path not in _ort_sessions:
        if not os.path.isfile(onnx_path):
            raise FileNotFoundError(f"ONNX file not found: {onnx_path}")
        _ort_sessions[onnx_path] = onnxruntime.InferenceSession(
            onnx_path, sess_options=ort_sess_options
        )
        logger.info("Loaded ONNX model: %s", onnx_path)
    return _ort_sessions[onnx_path]


import face_det

# ─────────────────────────────────────────────────────────
#  Image processing helpers  (ported từ photo_page.py)
# ─────────────────────────────────────────────────────────
MAX_EDGE = 1280

def _limit_size(img: Image.Image) -> Image.Image:
    """Giới hạn kích thước tối đa để tránh lỗi khi detect khuôn mặt."""
    w, h = img.size
    max_edge = max(w, h)
    if max_edge > MAX_EDGE:
        scale = MAX_EDGE / max_edge
        img = img.resize((int(round(w * scale)), int(round(h * scale))), Image.LANCZOS)
    return img

def _preprocess(img: Image.Image, face_mode: bool, onnx_path: str) -> np.ndarray:
    """Resize + normalize."""
    if face_mode:
        img = img.resize((512, 512), Image.LANCZOS)
    else:
        h, w = np.array(img).shape[:2]

        def to_8s(x: int) -> int:
            return 256 if x < 256 else x - x % 8

        def to_16s(x: int) -> int:
            return 256 if x < 256 else x - x % 16

        if "_tiny_" in onnx_path:
            img = img.resize((to_16s(w), to_16s(h)), Image.LANCZOS)
        else:
            img = img.resize((to_8s(w), to_8s(h)), Image.LANCZOS)

    arr = np.array(img).astype(np.float32) / 127.5 - 1.0
    return np.expand_dims(arr, axis=0)


def _postprocess(ort_outs: np.ndarray, original_size: tuple, face_mode: bool) -> Image.Image:
    """Chuyển output tensor → PIL Image."""
    images = (ort_outs + 1.0) / 2 * 255
    images = np.clip(images, 0, 255).astype(np.uint8)

    if face_mode:
        result = images[0]  # shape (H, W, C)
    else:
        # Ghép các frame theo chiều ngang (giống save_images)
        result = np.concatenate([x for x in images], axis=1)

    pil_img = Image.fromarray(result)
    if not face_mode:
        pil_img = pil_img.resize(original_size, Image.LANCZOS)
    return pil_img


def run_inference(
    img: Image.Image,
    ort_session: onnxruntime.InferenceSession,
    face_mode: bool,
    onnx_path: str,
    hybrid_mode: bool = False,
) -> tuple[Image.Image, bool]:

    original_size = img.size  # (w, h)
    img_limit = _limit_size(img)
    
    face_detected = False

    if hybrid_mode:
        bboxes, points = face_det.detect_face(np.array(img_limit))
        if bboxes is None or len(bboxes) == 0:
            print("No face detected for hybrid mode")
            inp = _preprocess(img_limit, False, onnx_path)
            ort_outs = ort_session.run(None, {ort_session.get_inputs()[0].name: inp})[0]
            return _postprocess(ort_outs, original_size, False), False
            
        face_detected = True
        print(f"Face detected for hybrid mode: {len(bboxes)} faces")
        
        # Chạy inference nền (Landscape)
        inp_bg = _preprocess(img_limit, False, onnx_path)
        out_bg = ort_session.run(None, {ort_session.get_inputs()[0].name: inp_bg})[0]
        bg_result_img = _postprocess(out_bg, original_size, False)
        
        # Tính toán tỷ lệ để map tọa độ về kích thước gốc
        w, h = original_size
        max_edge = max(w, h)
        scale = 1.0
        if max_edge > MAX_EDGE:
            scale = MAX_EDGE / max_edge
            
        for box in bboxes:
            margin_box = face_det.margin_face(box, np.array(img_limit).shape[:2])
            x1, y1, x2, y2 = margin_box
            
            # Crop khuôn mặt từ ảnh đã giới hạn kích thước
            face_np = np.array(img_limit)[y1:y2, x1:x2]
            face_img = Image.fromarray(face_np)
            
            # Chạy inference khuôn mặt (Face)
            inp_face = _preprocess(face_img, True, onnx_path)
            out_face = ort_session.run(None, {ort_session.get_inputs()[0].name: inp_face})[0]
            face_result_img = _postprocess(out_face, original_size, True) # Ảnh 512x512
            
            orig_x1 = int(round(x1 / scale))
            orig_y1 = int(round(y1 / scale))
            orig_x2 = int(round(x2 / scale))
            orig_y2 = int(round(y2 / scale))
            
            face_w = max(1, orig_x2 - orig_x1)
            face_h = max(1, orig_y2 - orig_y1)
            
            face_result_resized = face_result_img.resize((face_w, face_h), Image.LANCZOS)
            
            # Tạo mask viền mờ (feather) để ghép mượt mà
            mask = Image.new("L", (face_w, face_h), 0)
            draw = ImageDraw.Draw(mask)
            margin = int(min(face_w, face_h) * 0.08)
            draw.rectangle([margin, margin, face_w - margin, face_h - margin], fill=255)
            mask = mask.filter(ImageFilter.GaussianBlur(radius=margin))
            
            # Ghép mặt chất lượng cao vào nền
            bg_result_img.paste(face_result_resized, (orig_x1, orig_y1), mask)
            
        return bg_result_img, face_detected

    else:
        actual_mode = face_mode
        if face_mode:
            bboxes, points = face_det.detect_face(np.array(img_limit))
            if bboxes is None or len(bboxes) == 0:
                actual_mode = False
                print("No face detected")
            else:
                face_detected = True
                print("Face detected")
                margin_box = face_det.margin_face(bboxes[0], np.array(img_limit).shape[:2])
                img_np = np.array(img_limit)[margin_box[1]:margin_box[3], margin_box[0]:margin_box[2]]
                img_limit = Image.fromarray(img_np)
                
        inp = _preprocess(img_limit, actual_mode, onnx_path)
        ort_inputs = {ort_session.get_inputs()[0].name: inp}
        ort_outs = ort_session.run(None, ort_inputs)[0]
        return _postprocess(ort_outs, original_size, actual_mode), face_detected


# ─────────────────────────────────────────────────────────
#  Pydantic schemas
# ─────────────────────────────────────────────────────────
class ConvertBase64Request(BaseModel):
    image_base64: str = Field(..., description="Ảnh đầu vào encode dạng base64")
    model_type: str   = Field("hayao", description="Tên model (ví dụ: hayao, shinkai)")
    face_mode: bool   = Field(True,  description="True = crop/resize khuôn mặt 512×512")
    hybrid_mode: bool = Field(False, description="True = kết hợp Face Mode và Landscape")
    output_format: str = Field("JPEG", description="Định dạng ảnh đầu ra: JPEG hoặc PNG")


class ConvertResponse(BaseModel):
    result_base64: str
    elapsed_ms: float
    output_format: str
    face_detected: bool = Field(False, description="True nếu tìm thấy khuôn mặt, False nếu không tìm thấy (và chuyển về convert bình thường)")
    message: str = Field("", description="Thông báo kết quả xử lý")


class HealthResponse(BaseModel):
    status: str
    version: str


# ─────────────────────────────────────────────────────────
#  App
# ─────────────────────────────────────────────────────────
app = FastAPI(
    title="AnimeGANv3 API",
    description=(
        "REST API để chuyển đổi ảnh sang phong cách anime sử dụng AnimeGANv3.\n\n"
        "**Xác thực**: Bearer token do AWS Cognito phát hành (ID token hoặc Access token)."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS – điều chỉnh origins cho phù hợp môi trường của bạn
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Thư mục chứa các model ONNX
ONNX_MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "onnx_model")

def get_onnx_path(model_type: str) -> str:
    """Trả về file path dựa theo loại model."""
    # Nếu user cung cấp đuôi .onnx rồi thì bỏ qua, nếu không thì tự thêm
    filename = model_type if model_type.endswith(".onnx") else f"{model_type}.onnx"
    return os.path.join(ONNX_MODEL_DIR, filename)

# ─────────────────────────────────────────────────────────
#  Routes – Public
# ─────────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Kiểm tra server còn sống."""
    return HealthResponse(status="ok", version="1.0.0")


# ─────────────────────────────────────────────────────────
#  Routes – Protected (yêu cầu Cognito token)
# ─────────────────────────────────────────────────────────
@app.get("/test-auth", tags=["Auth"], summary="Test authentication")
async def test_auth(current_user: dict = Depends(get_current_user)):
    """Endpoint nhỏ để test xem token JWT gửi lên có hợp lệ hay không."""
    return {
        "message": "Authentication successful!",
        "user_id": current_user.get("sub"),
        "username": current_user.get("cognito:username")
    }

@app.get("/me", tags=["Auth"])
async def get_me(current_user: dict = Depends(get_current_user)):
    """Trả về thông tin user từ Cognito token."""
    return {
        "sub":      current_user.get("sub"),
        "email":    current_user.get("email"),
        "username": current_user.get("cognito:username"),
        "groups":   current_user.get("cognito:groups", []),
        "token_use": current_user.get("token_use"),
    }


@app.post(
    "/convert/base64",
    response_model=ConvertResponse,
    tags=["Conversion"],
    summary="Chuyển đổi ảnh (base64 → base64)",
)
async def convert_base64(
    body: ConvertBase64Request,
    current_user: dict = Depends(get_current_user),
):
    """
    Nhận ảnh dạng **base64**, chạy qua ONNX model, trả về ảnh kết quả dạng **base64**.

    - `model_type`: loại model như `hayao`, `shinkai`, hệ thống sẽ tự map vào `onnx_model/{model_type}.onnx`
    - `face_mode`: `true` → crop & resize 512×512 quanh khuôn mặt; `false` → xử lý toàn bộ ảnh
    """
    t0 = time.perf_counter()

    # Cấu trúc file path
    onnx_path = get_onnx_path(body.model_type)

    # Decode ảnh đầu vào
    try:
        img_bytes = base64.b64decode(body.image_base64)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image base64: {exc}")

    # Tải ONNX session
    try:
        ort_session = load_ort_session(onnx_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.error("Load ONNX error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to load ONNX model: {exc}")

    # Chạy inference
    try:
        result_img, face_detected = run_inference(
            img, ort_session, body.face_mode, onnx_path, body.hybrid_mode
        )
    except Exception as exc:
        logger.error("Inference error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

    # Encode kết quả
    fmt = body.output_format.upper()
    buf = io.BytesIO()
    result_img.save(buf, format=fmt, quality=95)
    result_b64 = base64.b64encode(buf.getvalue()).decode()

    elapsed_ms = (time.perf_counter() - t0) * 1000
    logger.info(
        "convert/base64 user=%s elapsed=%.1fms",
        current_user.get("sub", "?"),
        elapsed_ms,
    )
    
    msg = "Success"
    if body.face_mode and not face_detected:
        msg = "No face detected in the image. Falling back to normal mode."

    return ConvertResponse(
        result_base64=result_b64,
        elapsed_ms=round(elapsed_ms, 2),
        output_format=fmt,
        face_detected=face_detected,
        message=msg,
    )


@app.post(
    "/convert/upload",
    tags=["Conversion"],
    summary="Chuyển đổi ảnh (multipart upload → file tải về)",
)
async def convert_upload(
    file: UploadFile = File(..., description="File ảnh đầu vào (jpg/png/bmp/tiff)"),
    model_type: str  = Form("hayao", description="Tên model (ví dụ: hayao, shinkai)"),
    face_mode: bool  = Form(True),
    hybrid_mode: bool = Form(False),
    output_format: str = Form("JPEG"),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload ảnh dạng **multipart/form-data**, trả về ảnh kết quả trực tiếp
    (Content-Type: image/jpeg hoặc image/png).
    """
    t0 = time.perf_counter()

    onnx_path = get_onnx_path(model_type)

    # Đọc file upload
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Cannot read uploaded image: {exc}")

    # Tải ONNX session
    try:
        ort_session = load_ort_session(onnx_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.error("Load ONNX error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to load ONNX model: {exc}")

    # Chạy inference
    try:
        result_img, face_detected = run_inference(
            img, ort_session, face_mode, onnx_path, hybrid_mode
        )
    except Exception as exc:
        logger.error("Inference error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

    # Trả về ảnh
    fmt = output_format.upper()
    mime = "image/jpeg" if fmt == "JPEG" else "image/png"
    buf = io.BytesIO()
    result_img.save(buf, format=fmt, quality=95)
    buf.seek(0)

    elapsed_ms = (time.perf_counter() - t0) * 1000
    logger.info(
        "convert/upload user=%s file=%s elapsed=%.1fms",
        current_user.get("sub", "?"),
        file.filename,
        elapsed_ms,
    )

    original_stem = os.path.splitext(file.filename or "output")[0]
    ext = "jpg" if fmt == "JPEG" else "png"
    return StreamingResponse(
        buf,
        media_type=mime,
        headers={
            "Content-Disposition": f'attachment; filename="{original_stem}_anime.{ext}"',
            "X-Elapsed-Ms": str(round(elapsed_ms, 2)),
            "X-Face-Detected": str(face_detected).lower(),
        },
    )


@app.post(
    "/convert/test",
    tags=["Test"],
    summary="[TEST] Upload ảnh và convert không cần Auth",
)
async def convert_test(
    file: UploadFile = File(..., description="File ảnh đầu vào (jpg/png)"),
    model_type: str  = Form("hayao", description="Tên model (ví dụ: hayao, shinkai)"),
    face_mode: bool  = Form(True),
    hybrid_mode: bool = Form(False),
):
    """
    Dành riêng cho việc test trên trình duyệt hoặc Postman mà không bị chặn bởi JWT.
    Trả về ảnh trực tiếp. Vui lòng mở http://localhost:8000/docs để dùng giao diện upload test.
    """
    t0 = time.perf_counter()
    onnx_path = get_onnx_path(model_type)

    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Cannot read uploaded image: {exc}")

    try:
        ort_session = load_ort_session(onnx_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load ONNX model: {exc}")

    try:
        result_img, face_detected = run_inference(img, ort_session, face_mode, onnx_path, hybrid_mode)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

    buf = io.BytesIO()
    result_img.save(buf, format="JPEG", quality=95)
    buf.seek(0)
    
    return StreamingResponse(
        buf,
        media_type="image/jpeg",
        headers={
            "Content-Disposition": f'inline; filename="test_anime.jpg"',
            "X-Face-Detected": str(face_detected).lower(),
        },
    )


# ─────────────────────────────────────────────────────────
#  Video processing helpers
# ─────────────────────────────────────────────────────────
VIDEO_EXTENSIONS = {"mp4", "avi", "mov", "mkv", "webm", "flv", "wmv"}
MAX_VIDEO_SIZE_MB = 100  # Giới hạn dung lượng video upload
MAX_VIDEO_FRAMES = 3000  # Giới hạn số frame tối đa


def _get_video_ext(filename: str) -> str:
    """Lấy phần mở rộng của file video."""
    if not filename:
        return "mp4"
    ext = filename.rsplit(".", 1)[-1].lower()
    return ext if ext in VIDEO_EXTENSIONS else "mp4"


def _process_video(
    input_path: str,
    output_path: str,
    ort_session: onnxruntime.InferenceSession,
    face_mode: bool,
    onnx_path: str,
    hybrid_mode: bool = False,
) -> dict:
    """
    Xử lý video frame-by-frame qua ONNX model.
    Trả về dict chứa thông tin: total_frames, fps, width, height, elapsed_ms.
    """
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise ValueError("Cannot open input video file")

    fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    if total_frames > MAX_VIDEO_FRAMES:
        cap.release()
        raise ValueError(
            f"Video has {total_frames} frames, exceeding the limit of {MAX_VIDEO_FRAMES}. "
            f"Please use a shorter video."
        )

    # Codec cho output video
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")

    writer = None
    t0 = time.perf_counter()
    processed = 0
    face_detected_count = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # BGR → RGB → PIL
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(frame_rgb)

            # Chạy inference (dùng chung hàm đã có)
            result_img, face_detected = run_inference(
                pil_img, ort_session, face_mode, onnx_path, hybrid_mode
            )
            if face_detected:
                face_detected_count += 1

            # PIL → numpy → BGR cho OpenCV
            result_np = np.array(result_img)
            result_bgr = cv2.cvtColor(result_np, cv2.COLOR_RGB2BGR)

            # Resize về kích thước gốc nếu cần
            if result_bgr.shape[1] != orig_w or result_bgr.shape[0] != orig_h:
                result_bgr = cv2.resize(
                    result_bgr, (orig_w, orig_h), interpolation=cv2.INTER_LANCZOS4
                )

            # Khởi tạo writer lần đầu (sau khi biết kích thước output)
            if writer is None:
                writer = cv2.VideoWriter(
                    output_path, fourcc, fps, (orig_w, orig_h)
                )
                if not writer.isOpened():
                    raise RuntimeError("Cannot open video writer")

            writer.write(result_bgr)
            processed += 1

            if processed % 50 == 0:
                logger.info(
                    "Video processing: %d/%d frames (%.1f%%)",
                    processed, total_frames, processed / total_frames * 100,
                )
    finally:
        cap.release()
        if writer is not None:
            writer.release()

    elapsed_ms = (time.perf_counter() - t0) * 1000

    return {
        "total_frames": processed,
        "fps": round(fps, 2),
        "width": orig_w,
        "height": orig_h,
        "elapsed_ms": round(elapsed_ms, 2),
        "face_detected_count": face_detected_count,
    }


# ─────────────────────────────────────────────────────────
#  Video Pydantic schemas
# ─────────────────────────────────────────────────────────
class VideoConvertResponse(BaseModel):
    total_frames: int = Field(..., description="Tổng số frame đã xử lý")
    fps: float = Field(..., description="FPS của video")
    width: int = Field(..., description="Chiều rộng video")
    height: int = Field(..., description="Chiều cao video")
    elapsed_ms: float = Field(..., description="Thời gian xử lý (ms)")
    face_detected_count: int = Field(0, description="Số frame phát hiện khuôn mặt")
    message: str = Field("", description="Thông báo kết quả")
    url: str = Field("", description="URL S3 của video kết quả")


# ─────────────────────────────────────────────────────────
#  Routes – Video conversion (Protected)
# ─────────────────────────────────────────────────────────
@app.post(
    "/convert/video",
    response_model=VideoConvertResponse,
    tags=["Video Conversion"],
    summary="Chuyển đổi video sang phong cách anime (upload → S3 url)",
)
async def convert_video(
    file: UploadFile = File(..., description="File video đầu vào (mp4/avi/mov/mkv/webm)"),
    model_type: str = Form("hayao", description="Tên model (ví dụ: hayao, shinkai)"),
    face_mode: bool = Form(False, description="True = crop/detect khuôn mặt trên mỗi frame"),
    hybrid_mode: bool = Form(False, description="True = kết hợp Face và Landscape"),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload video dạng **multipart/form-data**, xử lý từng frame qua ONNX model,
    trả về video kết quả trực tiếp.

    - `model_type`: loại model như `hayao`, `shinkai`
    - `face_mode`: `true` → detect và crop khuôn mặt trên từng frame; `false` → xử lý toàn bộ frame

    ⚠️ Video conversion rất tốn thời gian. Nên sử dụng video ngắn (< 30s).
    """
    # Validate extension
    ext = _get_video_ext(file.filename)
    if ext not in VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported video format: {ext}. Supported: {', '.join(VIDEO_EXTENSIONS)}",
        )

    onnx_path = get_onnx_path(model_type)

    # Load ONNX session
    try:
        ort_session = load_ort_session(onnx_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.error("Load ONNX error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to load ONNX model: {exc}")

    # Tạo thư mục temp
    tmp_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "_tmp_video"
    )
    os.makedirs(tmp_dir, exist_ok=True)
    job_id = uuid.uuid4().hex[:12]
    input_path = os.path.join(tmp_dir, f"{job_id}_input.{ext}")
    output_path = os.path.join(tmp_dir, f"{job_id}_output.mp4")

    try:
        # Ghi file upload ra disk
        contents = await file.read()
        size_mb = len(contents) / (1024 * 1024)
        if size_mb > MAX_VIDEO_SIZE_MB:
            raise HTTPException(
                status_code=400,
                detail=f"Video size {size_mb:.1f}MB exceeds limit of {MAX_VIDEO_SIZE_MB}MB",
            )

        with open(input_path, "wb") as f:
            f.write(contents)

        # Xử lý video
        try:
            info = _process_video(
                input_path, output_path, ort_session, face_mode, onnx_path, hybrid_mode
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        except Exception as exc:
            logger.error("Video processing error: %s", traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Video processing error: {exc}")

        logger.info(
            "convert/video user=%s file=%s frames=%d elapsed=%.1fms",
            current_user.get("sub", "?"),
            file.filename,
            info["total_frames"],
            info["elapsed_ms"],
        )

        # Trả file video thay bằng upload S3
        original_stem = os.path.splitext(file.filename or "output")[0]

        # Upload to S3 (Anonymous upload)
        s3_client = boto3.client(
            "s3",
            region_name=os.environ.get("AWS_REGION", "ap-southeast-1"),
            config=Config(signature_version=UNSIGNED)
        )
        bucket_name = "amazon-s3-anime-style-convert"
        s3_key = f"output/{job_id}_{original_stem}_anime.mp4"

        try:
            s3_client.upload_file(output_path, bucket_name, s3_key)
        except Exception as exc:
            logger.error("S3 upload error: %s", traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Failed to upload video to S3: {exc}")

        s3_url = f"s3://{bucket_name}/{s3_key}"

        # Xoá file tạm
        for p in [input_path, output_path]:
            try:
                os.remove(p)
            except OSError:
                pass

        return VideoConvertResponse(
            total_frames=info["total_frames"],
            fps=info["fps"],
            width=info["width"],
            height=info["height"],
            elapsed_ms=info["elapsed_ms"],
            face_detected_count=info["face_detected_count"],
            message="Success",
            url=s3_url,
        )

    except HTTPException:
        # Cleanup on HTTP errors
        for p in [input_path, output_path]:
            try:
                os.remove(p)
            except OSError:
                pass
        raise


@app.post(
    "/convert/video/test",
    response_model=VideoConvertResponse,
    tags=["Test"],
    summary="[TEST] Upload video và convert không cần Auth",
)
async def convert_video_test(
    file: UploadFile = File(..., description="File video đầu vào (mp4/avi/mov/mkv/webm)"),
    model_type: str = Form("hayao", description="Tên model (ví dụ: hayao, shinkai)"),
    face_mode: bool = Form(False, description="True = detect khuôn mặt trên mỗi frame"),
):
    """
    Dành riêng cho việc test trên trình duyệt hoặc Postman mà không bị chặn bởi JWT.
    Trả về video trực tiếp.

    ⚠️ Video conversion rất tốn thời gian. Nên sử dụng video ngắn (< 10s) để test.
    """
    ext = _get_video_ext(file.filename)
    if ext not in VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported video format: {ext}. Supported: {', '.join(VIDEO_EXTENSIONS)}",
        )

    onnx_path = get_onnx_path(model_type)

    try:
        ort_session = load_ort_session(onnx_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load ONNX model: {exc}")

    tmp_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "_tmp_video"
    )
    os.makedirs(tmp_dir, exist_ok=True)
    job_id = uuid.uuid4().hex[:12]
    input_path = os.path.join(tmp_dir, f"{job_id}_input.{ext}")
    output_path = os.path.join(tmp_dir, f"{job_id}_output.mp4")

    try:
        contents = await file.read()
        size_mb = len(contents) / (1024 * 1024)
        if size_mb > MAX_VIDEO_SIZE_MB:
            raise HTTPException(
                status_code=400,
                detail=f"Video size {size_mb:.1f}MB exceeds limit of {MAX_VIDEO_SIZE_MB}MB",
            )

        with open(input_path, "wb") as f:
            f.write(contents)

        try:
            info = _process_video(
                input_path, output_path, ort_session, face_mode, onnx_path
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        except Exception as exc:
            logger.error("Video processing error: %s", traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Video processing error: {exc}")

        original_stem = os.path.splitext(file.filename or "output")[0]

        # Upload to S3 (Anonymous upload)
        s3_client = boto3.client(
            "s3",
            region_name=os.environ.get("AWS_REGION", "ap-southeast-1"),
            config=Config(signature_version=UNSIGNED)
        )
        bucket_name = "amazon-s3-anime-style-convert"
        s3_key = f"output/{job_id}_{original_stem}_anime.mp4"

        try:
            s3_client.upload_file(output_path, bucket_name, s3_key)
        except Exception as exc:
            logger.error("S3 upload error: %s", traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Failed to upload video to S3: {exc}")

        s3_url = f"s3://{bucket_name}/{s3_key}"

        # Xoá file tạm
        for p in [input_path, output_path]:
            try:
                os.remove(p)
            except OSError:
                pass

        return VideoConvertResponse(
            total_frames=info["total_frames"],
            fps=info["fps"],
            width=info["width"],
            height=info["height"],
            elapsed_ms=info["elapsed_ms"],
            face_detected_count=info["face_detected_count"],
            message="Success",
            url=s3_url,
        )

    except HTTPException:
        for p in [input_path, output_path]:
            try:
                os.remove(p)
            except OSError:
                pass
        raise


# ─────────────────────────────────────────────────────────
#  Exception handler chung
# ─────────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    logger.error("Unhandled exception: %s", traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


# ─────────────────────────────────────────────────────────
#  Entry point
# ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "fast-api:app",
        host=os.environ.get("HOST", "0.0.0.0"),
        port=int(os.environ.get("PORT", 8000)),
        reload=bool(os.environ.get("RELOAD", False)),
        log_level="info",
    )
