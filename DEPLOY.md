# 部署指南

您的 Next.js 应用已配置为静态导出，所有静态文件已生成在 `out/` 目录中。

## 部署方式

### 方式 1: Vercel（推荐）

1. **安装 Vercel CLI**（如果还没有）：
```bash
npm i -g vercel
```

2. **部署**：
```bash
vercel --prod
```

或者直接通过 Vercel 网站：
- 访问 [vercel.com](https://vercel.com)
- 导入您的 Git 仓库
- Vercel 会自动检测 Next.js 项目并部署

**注意**：Vercel 会自动识别 `output: 'export'` 配置，无需额外设置。

---

### 方式 2: Netlify

1. **安装 Netlify CLI**：
```bash
npm i -g netlify-cli
```

2. **部署**：
```bash
netlify deploy --prod --dir=out
```

或者通过 Netlify 网站：
- 访问 [netlify.com](https://netlify.com)
- 拖拽 `out/` 文件夹到部署区域
- 或连接 Git 仓库并设置构建命令：`npm run build`，发布目录：`out`

---

### 方式 3: GitHub Pages

1. **安装 gh-pages**：
```bash
npm install --save-dev gh-pages
```

2. **在 package.json 中添加部署脚本**：
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d out"
}
```

3. **部署**：
```bash
npm run deploy
```

4. **在 GitHub 仓库设置中**：
   - 进入 Settings > Pages
   - Source 选择 `gh-pages` 分支
   - 如果使用自定义域名，需要在 `out/` 目录添加 `CNAME` 文件

---

### 方式 4: Nginx（自托管服务器）

#### 在 CentOS/OpenCloudOS 上安装 Nginx

**方法 1：直接安装（推荐，适用于 OpenCloudOS）**

直接尝试安装 Nginx，某些发行版的基础仓库已包含：
```bash
sudo yum install nginx -y
```

如果上述命令失败，尝试以下方法：

**方法 2：安装 EPEL 仓库（适用于 CentOS/RHEL）**

对于标准 CentOS/RHEL 系统：
```bash
sudo yum install epel-release -y
sudo yum install nginx -y
```

**方法 3：使用 Nginx 官方仓库（适用于所有 CentOS 变体，包括 OpenCloudOS）**

如果以上方法都失败，使用 Nginx 官方仓库：
```bash
# 创建仓库配置文件（OpenCloudOS 9 使用 CentOS 8 仓库）
sudo tee /etc/yum.repos.d/nginx.repo > /dev/null <<EOF
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/8/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
EOF

# 如果遇到 "All matches were filtered out by exclude filtering" 错误
# 检查是否有排除规则：grep exclude /etc/yum.conf
# 使用 --disableexcludes 选项安装（OpenCloudOS 常见情况）
sudo yum install nginx -y --disableexcludes=all
```

**注意**：某些系统（如 OpenCloudOS）可能在 `/etc/yum.conf` 中配置了排除规则，需要使用 `--disableexcludes=all` 参数来安装。

**方法 4：使用 dnf（如果系统支持）**

某些较新的 CentOS 变体使用 dnf：
```bash
sudo dnf install nginx -y
```

3. **启动并设置开机自启**：
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

**重要提示**：不要直接运行 `nginx` 命令！应该使用 `systemctl` 来管理服务：
- ✅ 正确：`sudo systemctl start nginx`
- ❌ 错误：`nginx`（会导致端口冲突错误）

如果遇到 "Address already in use" 错误，说明 Nginx 已经在运行：
```bash
# 检查 Nginx 是否运行
sudo systemctl status nginx

# 如果已运行，使用以下命令管理：
sudo systemctl restart nginx  # 重启
sudo systemctl stop nginx     # 停止
sudo systemctl reload nginx    # 重新加载配置（不中断服务）
```

4. **检查 Nginx 状态**：
```bash
sudo systemctl status nginx
```

5. **配置防火墙**（如果启用了 firewalld）：
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

或者如果使用 iptables：
```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
```

6. **验证安装**：
访问 `http://your-server-ip`，应该能看到 Nginx 默认欢迎页面。

---

#### 使用宝塔面板部署（如果已安装宝塔）

如果您已经安装了宝塔面板，有两种方式：

**方式 A：使用宝塔面板的 Nginx（推荐）**

1. **通过宝塔面板安装 Nginx**：
   - 登录宝塔面板（通常访问 `http://your-server-ip:8888`）
   - 进入"软件商店" → 搜索"Nginx" → 安装

2. **创建网站**：
   - 在宝塔面板中点击"网站" → "添加站点"
   - 域名填写：`www.gaoshenghk.com` 和 `gaoshenghk.com`
   - 根目录设置为：`/www/wwwroot/gaoshenghk.com`（或自定义路径）

3. **上传文件**：
   ```bash
   # 将构建好的文件上传到网站目录
   scp -r out/* root@your-server:/www/wwwroot/gaoshenghk.com/
   ```

4. **配置 Nginx**：
   - 在宝塔面板中点击网站 → 选择您的网站 → "设置" → "配置文件"
   - 添加以下配置到 `location /` 块中：
   ```nginx
   location / {
       try_files $uri $uri.html $uri/ /index.html;
   }
   ```

5. **重启 Nginx**：
   - 在宝塔面板中点击"软件商店" → 找到 Nginx → "设置" → "重启"

**方式 B：使用系统 Nginx（当前已安装）**

如果系统 Nginx 已经在运行，需要先停止宝塔的 Nginx（如果有）：
```bash
# 检查是否有宝塔的 Nginx 服务
sudo systemctl stop bt 2>/dev/null  # 仅停止宝塔面板，不影响系统 Nginx
# 或者如果宝塔有独立的 Nginx 服务
/www/server/nginx/sbin/nginx -s stop 2>/dev/null
```

然后按照下面的"部署应用"步骤继续。

---

#### 部署应用

1. **将 `out/` 目录内容复制到服务器**：
```bash
scp -r out/* user@your-server:/var/www/html/
```

2. **Nginx 配置示例**（`/etc/nginx/sites-available/gaosheng`）：
```nginx
server {
    listen 80;
    server_name www.gaoshenghk.com gaoshenghk.com;
    root /var/www/html;
    index index.html;

    # 支持多语言路由
    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

3. **启用配置并重启 Nginx**：

**对于 CentOS/OpenCloudOS（如果 sites-enabled 目录不存在）**：
```bash
# 创建 sites-enabled 目录
sudo mkdir -p /etc/nginx/sites-enabled

# 更新 nginx.conf，在 http 块中添加：
# include /etc/nginx/sites-enabled/*.conf;
# 或者直接执行：
sudo sed -i '/include \/etc\/nginx\/conf.d\/\*.conf;/a\    include /etc/nginx/sites-enabled/*.conf;' /etc/nginx/nginx.conf

# 测试配置
sudo nginx -t
```

**创建符号链接并重启**：
```bash
# 注意：符号链接必须以 .conf 结尾，因为 nginx 只加载 .conf 文件
sudo ln -s /etc/nginx/sites-available/gaosheng /etc/nginx/sites-enabled/gaosheng.conf
sudo nginx -t
sudo systemctl restart nginx
```

**注意**：CentOS/OpenCloudOS 默认使用 `/etc/nginx/conf.d/` 目录。您也可以直接将配置文件放在该目录：
```bash
# 方式 2：直接使用 conf.d 目录（CentOS 标准方式）
sudo cp /etc/nginx/sites-available/gaosheng /etc/nginx/conf.d/gaosheng.conf
sudo nginx -t
sudo systemctl restart nginx
```

---

### 方式 5: Apache

1. **将 `out/` 目录内容复制到服务器**：
```bash
scp -r out/* user@your-server:/var/www/html/
```

2. **创建 `.htaccess` 文件**（在 `out/` 目录）：
```apache
RewriteEngine On
RewriteBase /

# 处理 Next.js 路由
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# 启用 Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# 缓存静态资源
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

---

### 方式 6: 其他静态托管服务

#### Cloudflare Pages
1. 连接 Git 仓库
2. 构建命令：`npm run build`
3. 输出目录：`out`

#### AWS S3 + CloudFront
1. 将 `out/` 目录上传到 S3 存储桶
2. 配置 CloudFront 分发
3. 设置默认根对象为 `index.html`

#### Azure Static Web Apps
1. 连接 Git 仓库
2. 构建命令：`npm run build`
3. 应用位置：`out`

---

## 重要提示

1. **自定义域名**：如果使用自定义域名（如 www.gaoshenghk.com），确保：
   - DNS 记录正确配置
   - SSL 证书已安装（使用 Let's Encrypt 免费证书）

2. **多语言路由**：确保服务器配置支持：
   - `/en/`, `/zh/` 等路由
   - 404 页面重定向到 `index.html`（用于客户端路由）

3. **构建输出**：每次更新内容后，需要重新运行：
```bash
npm run build
```
然后重新部署 `out/` 目录。

4. **环境变量**：静态导出不支持服务端环境变量，所有配置需要在构建时确定。

---

## 快速部署命令总结

```bash
# 构建
npm run build

# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=out

# GitHub Pages
npm run deploy

# 手动上传到服务器
scp -r out/* user@server:/var/www/html/
```

---

## 测试部署是否成功

### 1. 基础检查

**检查 Nginx 服务状态**：
```bash
sudo systemctl status nginx
```

**检查配置文件语法**：
```bash
sudo nginx -t
```

**检查端口监听**：
```bash
sudo netstat -tlnp | grep :80
# 或
sudo ss -tlnp | grep :80
```

**检查网站文件**：
```bash
ls -la /var/www/html/
# 确认 index.html 存在
ls -la /var/www/html/index.html
```

### 2. 本地测试

**使用 curl 测试**：
```bash
# 测试 HTTP 响应
curl -I http://localhost

# 测试完整内容
curl http://localhost | head -20

# 测试特定路由（如果有多语言）
curl http://localhost/zh/
curl http://localhost/en/

# 测试静态资源
curl -I http://localhost/css/app.css
```

**使用 wget 测试**：
```bash
wget -O - http://localhost | head -20
```

**检查 HTTP 状态码和响应时间**：
```bash
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n响应时间: %{time_total}s\n内容类型: %{content_type}\n" http://localhost
```

### 3. 远程测试

**获取服务器 IP 地址**：
```bash
ip addr show | grep "inet.*scope global" | awk '{print $2}' | cut -d/ -f1
# 或
hostname -I
```

**从本地机器测试**（替换为您的服务器 IP）：
```bash
# 测试 HTTP 响应
curl -I http://your-server-ip

# 测试完整内容
curl http://your-server-ip | head -20

# 使用浏览器访问
# http://your-server-ip
```

**测试域名访问**（如果已配置 DNS）：
```bash
curl -I http://www.gaoshenghk.com
curl -I http://gaoshenghk.com
```

### 4. 功能测试清单

- [ ] **首页加载**：访问根路径 `/` 显示正确内容
- [ ] **路由跳转**：测试应用内的页面跳转是否正常
- [ ] **多语言支持**：测试 `/zh/`、`/en/` 等语言路由
- [ ] **静态资源**：CSS、JS、图片等资源正常加载
- [ ] **404 处理**：访问不存在的页面返回自定义 404 页面
- [ ] **Gzip 压缩**：检查响应头是否包含 `Content-Encoding: gzip`
- [ ] **缓存设置**：静态资源响应头包含缓存控制信息

### 5. 性能测试

**使用 curl 测试响应时间**：
```bash
time curl -s http://localhost > /dev/null
```

**测试并发请求**：
```bash
# 安装 Apache Bench（如果未安装）
sudo yum install httpd-tools -y

# 测试并发性能
ab -n 100 -c 10 http://localhost/
```

### 6. 常见问题排查

**问题：返回 502 Bad Gateway**
```bash
# 检查 Nginx 错误日志
sudo tail -50 /var/log/nginx/error.log

# 检查文件权限
ls -la /var/www/html/
sudo chown -R nginx:nginx /var/www/html
sudo chmod -R 755 /var/www/html
```

**问题：返回 403 Forbidden**
```bash
# 检查目录权限和索引文件
sudo chmod 755 /var/www/html
ls -la /var/www/html/index.html
```

**问题：返回 404 Not Found**
```bash
# 检查配置文件中的 root 路径
grep "root" /etc/nginx/sites-available/gaosheng

# 检查文件是否存在
ls -la /var/www/html/index.html
```

**问题：端口无法访问**
```bash
# 检查防火墙
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload

# 检查 SELinux（如果启用）
sudo getenforce
sudo setsebool -P httpd_can_network_connect 1
```

**问题：配置不生效**
```bash
# 重新加载配置
sudo nginx -t
sudo systemctl reload nginx

# 或重启服务
sudo systemctl restart nginx
```

### 7. 浏览器测试

1. **打开浏览器**，访问：
   - `http://your-server-ip`
   - `http://www.gaoshenghk.com`（如果已配置 DNS）

2. **打开开发者工具**（F12），检查：
   - Network 标签：所有资源是否正常加载
   - Console 标签：是否有 JavaScript 错误
   - 响应头：检查缓存和压缩设置

3. **测试不同页面**：
   - 首页
   - 各个语言版本
   - 各个功能页面

### 8. 自动化测试脚本

创建一个测试脚本 `test-deployment.sh`：

```bash
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
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ HTTP 200 响应正常"
else
    echo "✗ HTTP 响应异常: $HTTP_CODE"
fi

echo ""
echo "6. 测试页面内容..."
CONTENT=$(curl -s http://localhost | head -1)
if [[ $CONTENT == *"<!DOCTYPE"* ]] || [[ $CONTENT == *"<html"* ]]; then
    echo "✓ 页面内容正常"
else
    echo "✗ 页面内容异常"
fi

echo ""
echo "测试完成！"
```

使用方法：
```bash
chmod +x test-deployment.sh
sudo ./test-deployment.sh
```

