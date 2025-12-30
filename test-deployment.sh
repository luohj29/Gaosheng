#!/bin/bash

echo "=== 部署测试脚本 ==="
echo ""

echo "1. 检查 Nginx 服务状态..."
sudo systemctl is-active nginx && echo "✓ Nginx 运行中" || echo "✗ Nginx 未运行"

echo ""
echo "2. 检查配置文件..."
sudo nginx -t && echo "✓ 配置正确" || echo "✗ 配置有误"

echo ""
echo "3. 检查端口监听..."
sudo ss -tlnp | grep :80 > /dev/null && echo "✓ 端口 80 已监听" || echo "✗ 端口 80 未监听"

echo ""
echo "4. 检查网站文件..."
[ -f /var/www/html/index.html ] && echo "✓ index.html 存在" || echo "✗ index.html 不存在"

echo ""
echo "5. 测试 HTTP 响应..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ HTTP 200 响应正常"
else
    echo "✗ HTTP 响应异常: $HTTP_CODE"
fi

echo ""
echo "6. 测试页面内容..."
CONTENT=$(curl -s http://localhost 2>/dev/null | head -1)
if [[ $CONTENT == *"<!DOCTYPE"* ]] || [[ $CONTENT == *"<html"* ]]; then
    echo "✓ 页面内容正常"
else
    echo "✗ 页面内容异常"
fi

echo ""
echo "7. 检查防火墙..."
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --list-services | grep -q http && echo "✓ HTTP 服务已开放" || echo "✗ HTTP 服务未开放"
fi

echo ""
echo "测试完成！"

