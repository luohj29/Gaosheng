# Nginx 部署配置指南

## 基本配置

### 1. 配置文件位置
- 配置文件已创建：`nginx.conf`
- 根目录设置为：`/root/Gaosheng/out`

### 2. 部署步骤

#### 方法一：使用独立的配置文件
```bash
# 1. 构建项目
npm run build

# 2. 测试 nginx 配置
sudo nginx -t -c /root/Gaosheng/nginx.conf

# 3. 启动 nginx（使用自定义配置）
sudo nginx -c /root/Gaosheng/nginx.conf
```

#### 方法二：集成到系统 nginx 配置
```bash
# 1. 复制配置到 nginx 配置目录
sudo cp /root/Gaosheng/nginx.conf /etc/nginx/sites-available/gaosheng

# 2. 创建符号链接
sudo ln -s /etc/nginx/sites-available/gaosheng /etc/nginx/sites-enabled/

# 3. 测试配置
sudo nginx -t

# 4. 重载 nginx
sudo systemctl reload nginx
```

### 3. 配置说明

#### 多语言路由处理
- `/fr/` → `/fr/index.html`
- `/en/` → `/en/index.html`
- `/zh/` → `/zh/index.html`
- 其他语言类似

#### 根路径重定向
- `/` → `/en/` (默认语言)

#### 静态资源缓存
- 图片、CSS、JS 等静态资源缓存 1 年
- 减少服务器负载

## 生产环境配置（HTTPS）

如果需要 HTTPS 支持，可以使用以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL 证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # 其他配置与 nginx.conf 相同
    root /root/Gaosheng/out;
    index index.html;
    
    # ... 其余配置 ...
}
```

## 自定义配置

### 修改根目录
编辑 `nginx.conf`，修改 `root` 指令：
```nginx
root /your/custom/path/to/out;
```

### 修改默认语言
如果希望默认语言是中文，修改重定向：
```nginx
location = / {
    return 301 /zh/;
}
```

### 修改端口
```nginx
listen 8080;  # 或其他端口
```

## 验证部署

1. 访问 `http://your-domain.com/fr/` - 应该显示法语首页
2. 访问 `http://your-domain.com/en/` - 应该显示英语首页
3. 检查浏览器开发者工具的网络标签，确认资源加载正常
4. 检查文件路径，确认访问的是 `/fr/index.html` 而不是 `fr.html`

## 常见问题

### 问题：404 错误
- 检查 `out` 目录是否存在
- 检查文件权限：`sudo chown -R www-data:www-data /root/Gaosheng/out`
- 检查 nginx 错误日志：`sudo tail -f /var/log/nginx/error.log`

### 问题：权限错误
```bash
# 设置正确的权限
sudo chmod -R 755 /root/Gaosheng/out
```

### 问题：配置不生效
```bash
# 重新加载 nginx
sudo systemctl reload nginx
# 或
sudo nginx -s reload
```








