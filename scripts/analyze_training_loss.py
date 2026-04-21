"""
Phân tích và trực quan hóa các đường cong loss từ log huấn luyện AnimeGANv3 Hayao.

Script này đọc file log huấn luyện, trích xuất các giá trị loss ở cả hai giai đoạn:
  1. Pre-training (Epoch 0-4): chỉ có Pre_train_G_loss
  2. Adversarial training (Epoch 5-73): G_loss, D_loss, và các thành phần loss phụ

Đầu ra: 4 biểu đồ PNG lưu vào figChap3/ để nhúng trực tiếp vào LaTeX.
"""

import re
import os
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator

# ============================================================
# Cấu hình đường dẫn
# ============================================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
LOG_FILE = os.path.join(PROJECT_DIR, 'logs', 'AnimeGANv3_Hayao_train.log')
OUTPUT_DIR = os.path.join(PROJECT_DIR, 'figChap3')

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# Cấu hình style biểu đồ chuyên nghiệp cho luận văn
# ============================================================
plt.rcParams.update({
    'font.family': 'serif',
    'font.serif': ['Times New Roman', 'DejaVu Serif'],
    'font.size': 11,
    'axes.labelsize': 12,
    'axes.titlesize': 13,
    'legend.fontsize': 10,
    'xtick.labelsize': 10,
    'ytick.labelsize': 10,
    'figure.dpi': 300,
    'savefig.dpi': 300,
    'savefig.bbox': 'tight',
    'axes.grid': True,
    'grid.alpha': 0.3,
    'grid.linestyle': '--',
    'axes.spines.top': False,
    'axes.spines.right': False,
})

# ============================================================
# Đọc và phân tích log
# ============================================================
print(f"Đang đọc log từ: {LOG_FILE}")

# Dữ liệu phase 1: Pre-training
pretrain_epochs = []
pretrain_steps = []
pretrain_g_loss = []
pretrain_global_step = []

# Dữ liệu phase 2: Adversarial
adv_epochs = []
adv_steps = []
adv_global_step = []
adv_d_loss = []
adv_g_loss = []
adv_con_loss = []
adv_sty_loss = []
adv_color_loss = []
adv_rs_loss = []
adv_tv_loss = []
adv_g_s_loss = []  # G_support adversarial
adv_g_m_loss = []  # G_main adversarial

# Regex patterns
pretrain_pattern = re.compile(
    r'Epoch:\s*(\d+),\s*Step:\s*(\d+)\s*/\s*(\d+),.*Pre_train_G_loss:\s*([\d.]+)'
)
adv_pattern = re.compile(
    r'Epoch:\s*(\d+),\s*Step:\s*(\d+)\s*/\s*(\d+),.*'
    r'D_loss:([\d.]+)\s*~\s*G_loss:\s*([\d.]+)\s*\|\|.*'
    r'con_loss:\s*([\d.]+),\s*rs_loss:\s*([\d.]+),\s*sty_loss:\s*([\d.]+).*'
    r'color_loss:\s*([\d.]+),\s*tv_loss:\s*([\d.]+).*'
    r'g_m_loss:\s*([\d.]+)'
)

# Đếm số step mỗi epoch cho pre-train
STEPS_PER_EPOCH = 416
pretrain_step_counter = 0
adv_step_counter = 0

with open(LOG_FILE, 'r') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue

        # Thử match pre-training
        m = pretrain_pattern.match(line)
        if m:
            epoch = int(m.group(1))
            step = int(m.group(2))
            loss = float(m.group(4))
            pretrain_epochs.append(epoch)
            pretrain_steps.append(step)
            pretrain_g_loss.append(loss)
            pretrain_global_step.append(epoch * STEPS_PER_EPOCH + step)
            pretrain_step_counter += 1
            continue

        # Thử match adversarial
        m = adv_pattern.search(line)
        if m:
            epoch = int(m.group(1))
            step = int(m.group(2))
            d_loss = float(m.group(4))
            g_loss = float(m.group(5))
            con_loss = float(m.group(6))
            rs_loss = float(m.group(7))
            sty_loss = float(m.group(8))
            color_loss = float(m.group(9))
            tv_loss = float(m.group(10))
            g_m_loss = float(m.group(11))

            adv_epochs.append(epoch)
            adv_steps.append(step)
            adv_global_step.append((epoch - 5) * STEPS_PER_EPOCH + step)
            adv_d_loss.append(d_loss)
            adv_g_loss.append(g_loss)
            adv_con_loss.append(con_loss)
            adv_sty_loss.append(sty_loss)
            adv_color_loss.append(color_loss)
            adv_rs_loss.append(rs_loss)
            adv_tv_loss.append(tv_loss)
            adv_g_m_loss.append(g_m_loss)
            adv_step_counter += 1

print(f"Pre-training steps: {pretrain_step_counter}")
print(f"Adversarial steps:  {adv_step_counter}")
print(f"Pre-training epochs: 0-{max(pretrain_epochs) if pretrain_epochs else 'N/A'}")
print(f"Adversarial epochs:  {min(adv_epochs) if adv_epochs else 'N/A'}-{max(adv_epochs) if adv_epochs else 'N/A'}")

# Chuyển sang numpy
pretrain_global_step = np.array(pretrain_global_step)
pretrain_g_loss = np.array(pretrain_g_loss)
adv_global_step = np.array(adv_global_step)
adv_d_loss = np.array(adv_d_loss)
adv_g_loss = np.array(adv_g_loss)
adv_con_loss = np.array(adv_con_loss)
adv_sty_loss = np.array(adv_sty_loss)
adv_color_loss = np.array(adv_color_loss)
adv_rs_loss = np.array(adv_rs_loss)

# ============================================================
# Hàm smooth bằng moving average
# ============================================================
def smooth(data, window=50):
    """Exponential moving average smoothing."""
    if len(data) < window:
        return data
    kernel = np.ones(window) / window
    return np.convolve(data, kernel, mode='valid')


def smooth_step(steps, window=50):
    """Trim steps to match smoothed data length."""
    if len(steps) < window:
        return steps
    return steps[window - 1:]


# ============================================================
# Biểu đồ 1: Pre-train G_loss
# ============================================================
print("\n[1/4] Tạo biểu đồ Pre-train G_loss...")

fig, ax = plt.subplots(figsize=(8, 4.5))
window = 80  # smooth window

# Vẽ raw data mờ
ax.plot(pretrain_global_step, pretrain_g_loss, alpha=0.15, color='#2196F3', linewidth=0.5)
# Vẽ smoothed
sm_loss = smooth(pretrain_g_loss, window)
sm_step = smooth_step(pretrain_global_step, window)
ax.plot(sm_step, sm_loss, color='#1565C0', linewidth=1.8, label='Pre-train G_loss (smoothed)')

ax.set_xlabel('Training Step')
ax.set_ylabel('Pre-train G_loss')
ax.set_title('Đường cong hội tụ Pre-train G_loss (5 epoch)')
ax.legend(loc='upper right')

# Đánh dấu epoch boundaries
for e in range(1, 5):
    ax.axvline(x=e * STEPS_PER_EPOCH, color='gray', linestyle=':', alpha=0.5, linewidth=0.8)
    ax.text(e * STEPS_PER_EPOCH, ax.get_ylim()[1] * 0.95, f'Epoch {e}',
            ha='center', va='top', fontsize=8, color='gray')

ax.set_xlim(0, 5 * STEPS_PER_EPOCH)
ax.set_ylim(bottom=0)
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'preTrainGLoss.png'))
plt.close()
print(f"  -> Saved: figChap3/preTrainGLoss.png")
print(f"  -> Loss range: {pretrain_g_loss[0]:.3f} -> {pretrain_g_loss[-1]:.3f}")
print(f"  -> Min loss: {pretrain_g_loss.min():.4f} at step {pretrain_global_step[np.argmin(pretrain_g_loss)]}")

# ============================================================
# Biểu đồ 2: G_loss và D_loss (adversarial)
# ============================================================
print("\n[2/4] Tạo biểu đồ G_loss và D_loss...")

fig, ax1 = plt.subplots(figsize=(10, 5))
window_adv = 200

# G_loss trên trục trái
ax1.plot(adv_global_step, adv_g_loss, alpha=0.08, color='#2196F3', linewidth=0.3)
sm_g = smooth(adv_g_loss, window_adv)
sm_s = smooth_step(adv_global_step, window_adv)
ax1.plot(sm_s, sm_g, color='#1565C0', linewidth=1.8, label='G_loss (smoothed)')
ax1.set_xlabel('Training Step (Adversarial Phase)')
ax1.set_ylabel('G_loss', color='#1565C0')
ax1.tick_params(axis='y', labelcolor='#1565C0')

# D_loss trên trục phải
ax2 = ax1.twinx()
ax2.plot(adv_global_step, adv_d_loss, alpha=0.08, color='#FF9800', linewidth=0.3)
sm_d = smooth(adv_d_loss, window_adv)
ax2.plot(sm_s, sm_d, color='#E65100', linewidth=1.8, label='D_loss (smoothed)')
ax2.set_ylabel('D_loss', color='#E65100')
ax2.tick_params(axis='y', labelcolor='#E65100')
ax2.spines['right'].set_visible(True)

# Đánh dấu epoch boundaries mỗi 10 epoch
for e in range(10, 74, 10):
    step_pos = (e - 5) * STEPS_PER_EPOCH
    ax1.axvline(x=step_pos, color='gray', linestyle=':', alpha=0.4, linewidth=0.6)
    ax1.text(step_pos, ax1.get_ylim()[1] * 0.98, f'Ep {e}',
             ha='center', va='top', fontsize=7, color='gray')

ax1.set_title('Đường cong G_loss và D_loss trong giai đoạn huấn luyện đầy đủ (Epoch 5-73)')

# Legend gộp
lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper right')

plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'Dloss_Gloss.png'))
plt.close()
print(f"  -> Saved: figChap3/Dloss_Gloss.png")
print(f"  -> G_loss final avg: {adv_g_loss[-500:].mean():.3f}")
print(f"  -> D_loss final avg: {adv_d_loss[-500:].mean():.4f}")

# ============================================================
# Biểu đồ 3: Các thành phần loss phụ
# ============================================================
print("\n[3/4] Tạo biểu đồ các thành phần loss phụ...")

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# color_loss
ax = axes[0, 0]
ax.plot(adv_global_step, adv_color_loss, alpha=0.08, color='#2196F3', linewidth=0.3)
sm = smooth(adv_color_loss, window_adv)
ax.plot(sm_s, sm, color='#1565C0', linewidth=1.5)
ax.set_title('Color Loss (Lab)')
ax.set_ylabel('Loss')

# con_loss (Content Loss)
ax = axes[0, 1]
ax.plot(adv_global_step, adv_con_loss, alpha=0.08, color='#FF9800', linewidth=0.3)
sm = smooth(adv_con_loss, window_adv)
ax.plot(sm_s, sm, color='#E65100', linewidth=1.5)
ax.set_title('Content Loss (VGG)')
ax.set_ylabel('Loss')

# sty_loss (Style Loss)
ax = axes[1, 0]
ax.plot(adv_global_step, adv_sty_loss, alpha=0.08, color='#4CAF50', linewidth=0.3)
sm = smooth(adv_sty_loss, window_adv)
ax.plot(sm_s, sm, color='#2E7D32', linewidth=1.5)
ax.set_title('Style Loss (Gram)')
ax.set_xlabel('Training Step')
ax.set_ylabel('Loss')

# rs_loss (Region Smoothing Loss)
ax = axes[1, 1]
ax.plot(adv_global_step, adv_rs_loss, alpha=0.08, color='#9C27B0', linewidth=0.3)
sm = smooth(adv_rs_loss, window_adv)
ax.plot(sm_s, sm, color='#6A1B9A', linewidth=1.5)
ax.set_title('Region Smoothing Loss')
ax.set_xlabel('Training Step')
ax.set_ylabel('Loss')

fig.suptitle('Các thành phần Loss phụ trong giai đoạn Adversarial Training', fontsize=14, y=1.01)
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'component_losses.png'))
plt.close()
print(f"  -> Saved: figChap3/component_losses.png")

# In thống kê
print(f"  -> color_loss:  {adv_color_loss.mean():.4f} ± {adv_color_loss.std():.4f}")
print(f"  -> con_loss:    {adv_con_loss.mean():.4f} ± {adv_con_loss.std():.4f}")
print(f"  -> sty_loss:    {adv_sty_loss.mean():.4f} ± {adv_sty_loss.std():.4f}")
print(f"  -> rs_loss:     {adv_rs_loss.mean():.4f} ± {adv_rs_loss.std():.4f}")

# ============================================================
# Biểu đồ 4: Loss trung bình theo epoch
# ============================================================
print("\n[4/4] Tạo biểu đồ Loss trung bình theo epoch...")

# Tính trung bình theo epoch cho pre-training
pretrain_epoch_nums = sorted(set(pretrain_epochs))
pretrain_epoch_mean = []
for e in pretrain_epoch_nums:
    mask = np.array(pretrain_epochs) == e
    pretrain_epoch_mean.append(np.array(pretrain_g_loss)[mask].mean())

# Tính trung bình theo epoch cho adversarial
adv_epoch_nums = sorted(set(adv_epochs))
adv_epoch_g_mean = []
adv_epoch_d_mean = []
adv_epoch_con_mean = []
adv_epoch_sty_mean = []
adv_epoch_color_mean = []

for e in adv_epoch_nums:
    mask = np.array(adv_epochs) == e
    adv_epoch_g_mean.append(adv_g_loss[mask].mean())
    adv_epoch_d_mean.append(adv_d_loss[mask].mean())
    adv_epoch_con_mean.append(adv_con_loss[mask].mean())
    adv_epoch_sty_mean.append(adv_sty_loss[mask].mean())
    adv_epoch_color_mean.append(adv_color_loss[mask].mean())

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Panel trái: G_loss và D_loss theo epoch
ax1.plot(adv_epoch_nums, adv_epoch_g_mean, 'o-', color='#1565C0',
         markersize=3, linewidth=1.5, label='G_loss (mean/epoch)')
ax1_r = ax1.twinx()
ax1_r.plot(adv_epoch_nums, adv_epoch_d_mean, 's-', color='#E65100',
           markersize=3, linewidth=1.5, label='D_loss (mean/epoch)')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('G_loss', color='#1565C0')
ax1_r.set_ylabel('D_loss', color='#E65100')
ax1.set_title('G_loss và D_loss trung bình theo Epoch')
ax1_r.spines['right'].set_visible(True)

lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax1_r.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc='center right')

# Panel phải: Component losses theo epoch
ax2.plot(adv_epoch_nums, adv_epoch_con_mean, 'o-', color='#E65100',
         markersize=2, linewidth=1.2, label='con_loss')
ax2.plot(adv_epoch_nums, adv_epoch_color_mean, 's-', color='#1565C0',
         markersize=2, linewidth=1.2, label='color_loss')
ax2.plot(adv_epoch_nums, adv_epoch_sty_mean, '^-', color='#2E7D32',
         markersize=2, linewidth=1.2, label='sty_loss')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Loss')
ax2.set_title('Các thành phần Loss trung bình theo Epoch')
ax2.legend(loc='upper right')

plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'epoch_avg_losses.png'))
plt.close()
print(f"  -> Saved: figChap3/epoch_avg_losses.png")

# ============================================================
# In bảng thống kê tổng hợp
# ============================================================
print("\n" + "=" * 60)
print("THỐNG KÊ TỔNG HỢP HUẤN LUYỆN")
print("=" * 60)
print(f"\n--- Pre-training Phase (Epoch 0-{max(pretrain_epochs)}) ---")
print(f"  Tổng số steps:   {len(pretrain_g_loss)}")
print(f"  Loss ban đầu:    {pretrain_g_loss[0]:.4f}")
print(f"  Loss cuối cùng:  {pretrain_g_loss[-1]:.4f}")
print(f"  Loss thấp nhất:  {pretrain_g_loss.min():.4f}")
print(f"  Loss trung bình (epoch cuối): {pretrain_epoch_mean[-1]:.4f}")

print(f"\n--- Adversarial Phase (Epoch {min(adv_epochs)}-{max(adv_epochs)}) ---")
print(f"  Tổng số steps:   {len(adv_g_loss)}")
print(f"  G_loss ban đầu:  {adv_g_loss[0]:.3f}")
print(f"  G_loss cuối:     {adv_g_loss[-1]:.3f}")
print(f"  G_loss min:      {adv_g_loss.min():.3f}")
print(f"  G_loss mean (epoch cuối): {adv_epoch_g_mean[-1]:.3f}")
print(f"  D_loss ban đầu:  {adv_d_loss[0]:.4f}")
print(f"  D_loss cuối:     {adv_d_loss[-1]:.4f}")
print(f"  D_loss mean (epoch cuối): {adv_epoch_d_mean[-1]:.4f}")

print(f"\n--- Component Losses (Epoch cuối) ---")
last_epoch_mask = np.array(adv_epochs) == max(adv_epochs)
print(f"  con_loss:   {adv_con_loss[last_epoch_mask].mean():.4f} ± {adv_con_loss[last_epoch_mask].std():.4f}")
print(f"  color_loss: {adv_color_loss[last_epoch_mask].mean():.4f} ± {adv_color_loss[last_epoch_mask].std():.4f}")
print(f"  sty_loss:   {adv_sty_loss[last_epoch_mask].mean():.4f} ± {adv_sty_loss[last_epoch_mask].std():.4f}")
print(f"  rs_loss:    {adv_rs_loss[last_epoch_mask].mean():.4f} ± {adv_rs_loss[last_epoch_mask].std():.4f}")

print("\n✅ Hoàn tất! Các biểu đồ đã được lưu vào figChap3/")
