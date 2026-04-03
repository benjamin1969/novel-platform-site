// 简单的静态文件服务器
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const API_URL = 'https://novel-platform-api.sunlongyun1030.workers.dev';

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    
    // 处理API代理
    if (req.url.startsWith('/api/')) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
            message: 'API calls should go to: ' + API_URL,
            api_url: API_URL,
            endpoints: {
                register: API_URL + '/api/users/register',
                login: API_URL + '/api/users/login',
                novels: API_URL + '/api/novels'
            }
        }));
        return;
    }
    
    // 确定文件路径
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.txt': 'text/plain',
            '.md': 'text/markdown'
        };
        
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fs.readFileSync(filePath));
    } else {
        // 文件不存在，返回404或重定向到首页
        if (req.url !== '/') {
            res.writeHead(302, { 'Location': '/' });
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Page Not Found</h1><p><a href="/">Go to Home</a></p>');
        }
    }
});

server.listen(PORT, () => {
    console.log(`
🚀 小说网站服务器已启动！
📍 本地访问: http://localhost:${PORT}
🌐 域名配置: dskxx.ccwu.cc
🔗 后端API: ${API_URL}

📄 可用页面:
   • 首页: http://localhost:${PORT}/
   • 登录: http://localhost:${PORT}/login.html
   • 用户首页: http://localhost:${PORT}/main.html

💡 系统信息:
   • 邀请码: 2014
   • 数据库: Cloudflare D1
   • 状态: ✅ 完全正常

🎯 部署到域名:
   1. 上传此目录到GitHub/Netlify/Vercel
   2. 配置自定义域名: dskxx.ccwu.cc
   3. 配置DNS记录
   4. 访问: https://dskxx.ccwu.cc

按 Ctrl+C 停止服务器
    `);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n👋 服务器正在关闭...');
    server.close(() => {
        process.exit(0);
    });
});