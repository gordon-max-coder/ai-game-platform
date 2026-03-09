// 简单的 HTTP 代理服务器 - 解决 CORS 问题
const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = 3000;
const API_BASE = 'https://jiekou.ai';

console.log('🚀 代理服务器启动中...');
console.log(`📡 监听端口：${PORT}`);
console.log(`🌐 API 地址：${API_BASE}`);
console.log('');
console.log('使用方法：');
console.log('1. 保持此窗口运行');
console.log('2. 在浏览器中打开 create.html');
console.log('3. API 请求会自动通过代理转发');
console.log('');
console.log('按 Ctrl+C 停止服务器');

const server = http.createServer((req, res) => {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 处理根路径测试
    if (req.url === '/' || req.url === '/test') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('✅ 代理服务器运行正常\n\nAPI 端点：/proxy/chat/completions');
        return;
    }

    // 只处理 /proxy 路径
    if (!req.url.startsWith('/proxy')) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found\n\n使用：/proxy/chat/completions');
        return;
    }

    // 提取目标 URL
    const targetPath = req.url.replace('/proxy', '');
    
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${API_BASE}${targetPath}`);

    // 构建请求选项
    const options = {
        hostname: 'jiekou.ai',
        port: 443,
        path: '/api' + targetPath,  // 添加 /api 前缀
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
        }
    };

    // 转发 Authorization 头
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        options.headers['Authorization'] = authHeader;
    }

    console.log(`[${new Date().toLocaleTimeString()}] 转发到：https://jiekou.ai${options.path}`);

    // 发送请求到目标 API
    const proxyReq = https.request(options, (proxyRes) => {
        console.log(`[${new Date().toLocaleTimeString()}] API 响应：${proxyRes.statusCode}`);
        
        // 转发响应头
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        
        // 转发响应数据
        proxyRes.on('data', (chunk) => {
            res.write(chunk);
        });
        
        proxyRes.on('end', () => {
            res.end();
        });
    });

    proxyReq.on('error', (error) => {
        console.error(`[${new Date().toLocaleTimeString()}] 代理错误:`, error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: 'Proxy error',
            message: error.message
        }));
    });

    // 转发请求体
    if (req.method === 'POST' || req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            if (body) {
                console.log(`[${new Date().toLocaleTimeString()}] 请求体长度：${body.length} 字节`);
                proxyReq.write(body);
            }
            proxyReq.end();
        });
    } else {
        proxyReq.end();
    }
});

server.listen(PORT, () => {
    console.log('✅ 服务器已启动');
    console.log(`🔗 本地地址：http://localhost:${PORT}`);
    console.log(`🔗 代理端点：http://localhost:${PORT}/proxy/chat/completions`);
});
