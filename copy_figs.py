import shutil
import os

src_dir = r'C:\Users\ASUS ZENBOOK\.gemini\antigravity\brain\13256f66-4d27-4ba6-b573-87c0b23595a3'
dst_dir = r'd:\Coding\Graduate_Thesis_master_GAN\figChap1'

files = {
    'image_preprocessing_pipeline_1775666081160.png': 'image_preprocessing_pipeline.png',
    'guided_filter_vs_gaussian_1775666098566.png': 'guided_filter_vs_gaussian.png',
    # 'anchor_prior_box_1775665384050.png': 'anchor_prior_box.png',
}

for src_name, dst_name in files.items():
    src = os.path.join(src_dir, src_name)
    dst = os.path.join(dst_dir, dst_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f'Copied: {dst_name}')
    else:
        print(f'NOT FOUND: {src}')

print('Done!')
