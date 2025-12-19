#!/bin/bash

PAGE_URL="$1"

if [ -z "$PAGE_URL" ]; then
    echo "使用方法: $0 <page_url>"
    exit 1
fi

echo "[INFO] Fetching: $PAGE_URL"

# 下载网页 HTML
html=$(curl -s "$PAGE_URL")

# 提取所有 URL
links=$(echo "$html" |
    grep -Eo '(src|href)="[^"]+"' |
    cut -d'"' -f2 |
    grep -v '^#' |
    grep -v '^javascript:' |
    uniq)

echo "[INFO] Found links:"
echo "$links"
echo

# 循环下载文件
for link in $links; do

    # 判断是否为绝对 URL
    if [[ "$link" =~ ^https?:// ]]; then
        target="$link"
    else
        # 转换为绝对 URL
        target="${PAGE_URL%/}/$link"
    fi

    # 提取文件名
    filename=$(basename "$link")

    # 若为空，跳过
    if [ -z "$filename" ]; then

