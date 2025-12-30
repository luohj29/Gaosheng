#!/bin/bash

echo "=== SSL 证书诊断工具 ==="
echo ""

# 证书路径
CERT_PATH="/www/server/panel/vhost/cert/gaoshenghk.com/fullchain.pem"
KEY_PATH="/www/server/panel/vhost/cert/gaoshenghk.com/privkey.pem"

echo "1. 检查证书文件是否存在..."
if [ -f "$CERT_PATH" ]; then
    echo "   ✓ 证书文件存在: $CERT_PATH"
else
    echo "   ✗ 证书文件不存在: $CERT_PATH"
    exit 1
fi

if [ -f "$KEY_PATH" ]; then
    echo "   ✓ 私钥文件存在: $KEY_PATH"
else
    echo "   ✗ 私钥文件不存在: $KEY_PATH"
    exit 1
fi

echo ""
echo "2. 检查证书文件权限..."
CERT_PERM=$(stat -c "%a" "$CERT_PATH" 2>/dev/null || stat -f "%OLp" "$CERT_PATH" 2>/dev/null)
KEY_PERM=$(stat -c "%a" "$KEY_PATH" 2>/dev/null || stat -f "%OLp" "$KEY_PATH" 2>/dev/null)
echo "   证书权限: $CERT_PERM"
echo "   私钥权限: $KEY_PERM"

if [ "$KEY_PERM" != "600" ] && [ "$KEY_PERM" != "400" ]; then
    echo "   ⚠ 警告: 私钥权限应该为 600 或 400，当前为 $KEY_PERM"
    echo "   建议执行: chmod 600 $KEY_PATH"
fi

echo ""
echo "3. 检查证书有效期..."
openssl x509 -in "$CERT_PATH" -noout -dates 2>/dev/null
if [ $? -ne 0 ]; then
    echo "   ✗ 无法读取证书信息，证书可能已损坏"
    exit 1
fi

echo ""
echo "4. 检查证书域名..."
openssl x509 -in "$CERT_PATH" -noout -text | grep -A 2 "Subject Alternative Name" | head -3
echo ""

echo "5. 检查证书和私钥是否匹配..."
CERT_MD5=$(openssl x509 -noout -modulus -in "$CERT_PATH" 2>/dev/null | openssl md5)
KEY_MD5=$(openssl rsa -noout -modulus -in "$KEY_PATH" 2>/dev/null | openssl md5)

if [ "$CERT_MD5" = "$KEY_MD5" ]; then
    echo "   ✓ 证书和私钥匹配"
else
    echo "   ✗ 证书和私钥不匹配！"
    exit 1
fi

echo ""
echo "6. 测试 SSL 连接..."
echo "   正在测试 https://gaoshenghk.com ..."
echo | openssl s_client -connect gaoshenghk.com:443 -servername gaoshenghk.com 2>/dev/null | grep -E "(Verify return code|subject=|issuer=)" | head -3

echo ""
echo "7. 检查 nginx 配置语法..."
if command -v nginx &> /dev/null; then
    nginx -t 2>&1 | tail -2
else
    echo "   nginx 命令未找到，跳过配置检查"
fi

echo ""
echo "=== 诊断完成 ==="
echo ""
echo "如果证书有问题，请检查："
echo "1. 证书是否已过期"
echo "2. 证书域名是否匹配（应包含 gaoshenghk.com 和 www.gaoshenghk.com）"
echo "3. 证书文件是否完整"
echo "4. nginx 配置是否正确加载了证书"








