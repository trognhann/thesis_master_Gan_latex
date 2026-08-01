import argparse
import os
import numpy as np
import onnxruntime
from PIL import Image, ImageFilter, ImageDraw
import face_det

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

def run_hybrid_inference(img_path: str, output_path: str, onnx_path: str):
    print(f"Loading ONNX model: {onnx_path}")
    sess_options = onnxruntime.SessionOptions()
    ort_session = onnxruntime.InferenceSession(onnx_path, sess_options=sess_options)
    
    print(f"Loading input image: {img_path}")
    img = Image.open(img_path).convert("RGB")
    original_size = img.size
    img_limit = _limit_size(img)
    
    print("Detecting face...")
    bboxes, points = face_det.detect_face(np.array(img_limit))
    
    if bboxes is None or len(bboxes) == 0:
        print("No face detected for hybrid mode. Running landscape mode.")
        inp = _preprocess(img_limit, False, onnx_path)
        ort_outs = ort_session.run(None, {ort_session.get_inputs()[0].name: inp})[0]
        res_img = _postprocess(ort_outs, original_size, False)
        res_img.save(output_path)
        print(f"Saved result to {output_path}")
        return

    print(f"Face detected for hybrid mode: {len(bboxes)} faces")
    
    # --- DEBUG: Tạo ảnh vẽ box và landmarks ---
    debug_img = img_limit.copy()
    debug_draw = ImageDraw.Draw(debug_img)
    
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
        
    for i in range(len(bboxes)):
        box = bboxes[i]
        landmarks = points[i] if points is not None else None
        
        # Box mới (dịch chuyển theo hướng mặt)
        margin_box = face_det.margin_face(box, np.array(img_limit).shape[:2], margin=0.5, landmarks=landmarks)
        x1, y1, x2, y2 = margin_box
        
        # Box cũ (mở rộng đều, bỏ qua landmarks)
        old_margin_box = face_det.margin_face(box, np.array(img_limit).shape[:2], margin=0.5, landmarks=None)
        ox1, oy1, ox2, oy2 = old_margin_box
        
        # --- DEBUG: Vẽ lên ảnh ---
        # Vẽ khung viền gốc (màu xanh lá)
        debug_draw.rectangle([box[0], box[1], box[2], box[3]], outline="green", width=3)
        # Vẽ khung viền THEO THUẬT TOÁN CŨ (màu xanh dương)
        debug_draw.rectangle([ox1, oy1, ox2, oy2], outline="blue", width=3)
        # Vẽ khung viền THEO THUẬT TOÁN MỚI (màu đỏ)
        debug_draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
        # Vẽ landmarks (màu vàng)
        if landmarks is not None:
            for pt in landmarks:
                px, py = pt
                debug_draw.ellipse([px-3, py-3, px+3, py+3], fill="yellow")
        
        # Crop khuôn mặt từ ảnh đã giới hạn kích thước
        face_np = np.array(img_limit)[y1:y2, x1:x2]
        face_img = Image.fromarray(face_np)
        
        # Chạy inference khuôn mặt (Face)
        inp_face = _preprocess(face_img, True, onnx_path)
        out_face = ort_session.run(None, {ort_session.get_inputs()[0].name: inp_face})[0]
        face_result_img = _postprocess(out_face, original_size, True) # Ảnh 256x256
        
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
        
    bg_result_img.save(output_path)
    print(f"Saved hybrid result to {output_path}")
    
    debug_path = output_path.replace(".png", "_debug.png")
    debug_img.save(debug_path)
    print(f"Saved debug image to {debug_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="AnimeGAN Hybrid Mode Inference")
    parser.add_argument('--input', type=str, default='/Users/trognhann/thesis_master_Gan_latex/figures_form/source/a2.png', help='Input image path')
    parser.add_argument('--output', type=str, default='imgs/output_hybrid.png', help='Output image path')
    parser.add_argument('--model', type=str, default='onnx_model/AnimeGANv3_large_Ghibli_c1_e299.onnx', help='ONNX model path')
    
    args = parser.parse_args()
    if not os.path.exists(args.model):
        print(f"Warning: Model path {args.model} might not exist. Please check your model path.")
    
    run_hybrid_inference(args.input, args.output, args.model)
