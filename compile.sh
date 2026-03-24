#!/bin/bash
echo "=== Compile luận văn UET ==="
xelatex -interaction=nonstopmode main.tex
biber main
xelatex -interaction=nonstopmode main.tex
xelatex -interaction=nonstopmode main.tex
echo "Hoàn tất! Kiểm tra main.pdf"