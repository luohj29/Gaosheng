#!/usr/bin/env python3
"""
下载 Markdown 文件中的网络图片到本地

用法:
    python download_images.py <md_file_path> <save_path> [--update-md]

参数:
    md_file_path: Markdown 文件路径
    save_path: 图片保存目录路径
    --update-md: 可选，是否更新 Markdown 文件中的图片路径为本地路径
"""

import re
import os
import sys
import argparse
import urllib.request
import urllib.parse
from pathlib import Path
from typing import List, Tuple


def extract_image_urls(md_content: str) -> List[Tuple[str, str, str]]:
    """
    从 Markdown 内容中提取所有图片 URL
    
    返回: [(alt_text, url, full_match), ...]
    """
    # 匹配 Markdown 图片语法: ![alt](url)
    pattern = r'!\[([^\]]*)\]\(([^)]+)\)'
    matches = re.findall(pattern, md_content)
    
    results = []
    for alt, url in matches:
        # 只处理网络 URL (http:// 或 https://)
        if url.startswith('http://') or url.startswith('https://'):
            full_match = f'![{alt}]({url})'
            results.append((alt, url, full_match))
    
    return results


def download_image(url: str, save_path: str, filename: str = None) -> str:
    """
    下载图片到指定路径
    
    返回: 保存的文件路径
    """
    if filename is None:
        # 从 URL 中提取文件名
        parsed_url = urllib.parse.urlparse(url)
        filename = os.path.basename(parsed_url.path)
        
        # 如果没有扩展名，尝试从 Content-Type 获取
        if not filename or '.' not in filename:
            try:
                req = urllib.request.Request(url)
                req.add_header('User-Agent', 'Mozilla/5.0')
                with urllib.request.urlopen(req) as response:
                    content_type = response.headers.get('Content-Type', '')
                    if 'image/jpeg' in content_type:
                        filename = 'image.jpg'
                    elif 'image/png' in content_type:
                        filename = 'image.png'
                    elif 'image/gif' in content_type:
                        filename = 'image.gif'
                    else:
                        filename = 'image.jpg'  # 默认
            except:
                filename = 'image.jpg'
    
    # 确保保存目录存在
    os.makedirs(save_path, exist_ok=True)
    
    # 完整文件路径
    file_path = os.path.join(save_path, filename)
    
    # 如果文件已存在，添加数字后缀
    base_name, ext = os.path.splitext(filename)
    counter = 1
    while os.path.exists(file_path):
        new_filename = f"{base_name}_{counter}{ext}"
        file_path = os.path.join(save_path, new_filename)
        counter += 1
    
    # 下载图片
    try:
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        with urllib.request.urlopen(req) as response:
            with open(file_path, 'wb') as f:
                f.write(response.read())
        
        print(f"✓ 下载成功: {file_path}")
        return file_path
    except Exception as e:
        print(f"✗ 下载失败 {url}: {e}")
        return None


def resolve_path(path: str, script_dir: str) -> str:
    """
    智能解析路径，支持从脚本目录或父目录查找
    
    参数:
        path: 输入的路径（相对或绝对）
        script_dir: 脚本所在目录
    
    返回: 解析后的绝对路径
    """
    # 如果是绝对路径，直接返回
    if os.path.isabs(path):
        return path
    
    # 先尝试从当前工作目录解析
    if os.path.exists(path):
        return os.path.abspath(path)
    
    # 尝试从脚本所在目录解析
    script_path = os.path.join(script_dir, path)
    if os.path.exists(script_path):
        return os.path.abspath(script_path)
    
    # 尝试从脚本所在目录的父目录解析（兼容从项目根目录运行的情况）
    parent_dir = os.path.dirname(script_dir)
    parent_path = os.path.join(parent_dir, path)
    if os.path.exists(parent_path):
        return os.path.abspath(parent_path)
    
    # 如果都不存在，返回从脚本目录解析的路径（用于创建新目录）
    return os.path.abspath(script_path)


def update_markdown_images(md_content: str, image_mappings: List[Tuple[str, str]], save_path: str, md_file_path: str, use_public_path: bool = False) -> str:
    """
    更新 Markdown 内容中的图片路径为本地路径
    
    image_mappings: [(original_url, local_filename), ...]
    """
    updated_content = md_content
    
    save_abs = os.path.abspath(save_path)
    save_abs_normalized = save_abs.replace('\\', '/')
    
    # 检测是否为 Next.js public 目录结构
    # 如果保存路径包含 public/images 或使用 --public-path 选项，使用 /images/... 格式
    if use_public_path or 'public/images' in save_abs_normalized:
        # 提取 public/images 之后的部分
        parts = save_abs_normalized.split('public/images')
        if len(parts) > 1:
            sub_path = parts[1].strip('/')
            for original_url, local_filename in image_mappings:
                # 构建 Next.js 标准路径格式: /images/...
                if sub_path:
                    new_path = f"/images/{sub_path}/{local_filename}".replace('//', '/')
                else:
                    new_path = f"/images/{local_filename}"
                
                # 替换所有匹配的图片引用
                pattern = r'!\[([^\]]*)\]\(' + re.escape(original_url) + r'\)'
                replacement = r'![\1](' + new_path + r')'
                updated_content = re.sub(pattern, replacement, updated_content)
        else:
            # 回退到相对路径
            md_dir = os.path.dirname(os.path.abspath(md_file_path))
            try:
                rel_path = os.path.relpath(save_abs, md_dir).replace('\\', '/')
                if not rel_path.startswith('.'):
                    rel_path = './' + rel_path
            except:
                rel_path = save_abs_normalized
            
            for original_url, local_filename in image_mappings:
                new_path = f"{rel_path}/{local_filename}".replace('//', '/')
                pattern = r'!\[([^\]]*)\]\(' + re.escape(original_url) + r'\)'
                replacement = r'![\1](' + new_path + r')'
                updated_content = re.sub(pattern, replacement, updated_content)
    else:
        # 使用相对路径
        md_dir = os.path.dirname(os.path.abspath(md_file_path))
        try:
            rel_path = os.path.relpath(save_abs, md_dir).replace('\\', '/')
            if not rel_path.startswith('.'):
                rel_path = './' + rel_path
        except:
            rel_path = save_abs_normalized
        
        for original_url, local_filename in image_mappings:
            new_path = f"{rel_path}/{local_filename}".replace('//', '/')
            pattern = r'!\[([^\]]*)\]\(' + re.escape(original_url) + r'\)'
            replacement = r'![\1](' + new_path + r')'
            updated_content = re.sub(pattern, replacement, updated_content)
    
    return updated_content


def main():
    parser = argparse.ArgumentParser(
        description='下载 Markdown 文件中的网络图片到本地',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 只下载图片，不更新 Markdown
  python download_images.py products_md/en/G1830.md public/images/G1830
  
  # 下载并更新为 Next.js public 路径格式 (/images/...)
  python download_images.py products_md/en/G1830.md public/images/G1830 --update-md --public-path
  
  # 下载并更新为相对路径
  python download_images.py products_md/en/G1830.md public/images/G1830 --update-md
        """
    )
    
    parser.add_argument('md_file', help='Markdown 文件路径')
    parser.add_argument('save_path', help='图片保存目录路径')
    parser.add_argument('--update-md', action='store_true', 
                       help='更新 Markdown 文件中的图片路径为本地路径')
    parser.add_argument('--public-path', action='store_true',
                       help='使用 Next.js public 路径格式 (/images/...) 而不是相对路径')
    
    args = parser.parse_args()
    
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 智能解析路径
    md_file_resolved = resolve_path(args.md_file, script_dir)
    save_path_resolved = resolve_path(args.save_path, script_dir)
    
    # 检查 Markdown 文件是否存在
    if not os.path.exists(md_file_resolved):
        print(f"错误: Markdown 文件不存在: {args.md_file}")
        print(f"尝试过的路径: {md_file_resolved}")
        sys.exit(1)
    
    # 读取 Markdown 文件
    try:
        with open(md_file_resolved, 'r', encoding='utf-8') as f:
            md_content = f.read()
    except Exception as e:
        print(f"错误: 无法读取 Markdown 文件: {e}")
        sys.exit(1)
    
    # 提取图片 URL
    image_urls = extract_image_urls(md_content)
    
    if not image_urls:
        print("未找到网络图片 URL")
        return
    
    print(f"找到 {len(image_urls)} 个网络图片")
    print("-" * 50)
    
    # 下载图片并记录映射关系
    image_mappings = []
    for alt, url, _ in image_urls:
        print(f"正在下载: {url}")
        # 从 URL 提取原始文件名
        parsed_url = urllib.parse.urlparse(url)
        original_filename = os.path.basename(parsed_url.path)
        
        # 下载图片
        saved_path = download_image(url, save_path_resolved, original_filename)
        
        if saved_path:
            local_filename = os.path.basename(saved_path)
            image_mappings.append((url, local_filename))
    
    print("-" * 50)
    print(f"成功下载 {len(image_mappings)} 张图片到: {save_path_resolved}")
    
    # 如果需要更新 Markdown 文件
    if args.update_md:
        updated_content = update_markdown_images(md_content, image_mappings, save_path_resolved, md_file_resolved, args.public_path)
        
        # 备份原文件
        backup_path = md_file_resolved + '.bak'
        try:
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(md_content)
            print(f"原文件已备份到: {backup_path}")
        except Exception as e:
            print(f"警告: 无法创建备份文件: {e}")
        
        # 写入更新后的内容
        try:
            with open(md_file_resolved, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"✓ Markdown 文件已更新: {md_file_resolved}")
        except Exception as e:
            print(f"错误: 无法更新 Markdown 文件: {e}")
            sys.exit(1)
    else:
        print("\n提示: 使用 --update-md 参数可以自动更新 Markdown 文件中的图片路径")


if __name__ == '__main__':
    main()

