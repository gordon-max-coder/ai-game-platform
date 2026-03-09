const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const MODEL = 'claude-opus-4-6';

console.log('\n🚀 启动服务器...\n');

const server = http.createServer();

server.on('request', (req, res) => {
    const startTime = Date.now();
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`\n[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

    // API 代理
    if (req.url === '/api/generate' && req.method === 'POST') {
        handleGenerate(req, res, startTime);
        return;
    }

    // 健康检查
    if (req.url === '/api/health') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'ok', time: Date.now() - startTime + 'ms'}));
        return;
    }

    // 静态文件
    serveStatic(req, res);
});

function handleGenerate(req, res, startTime) {
    console.log(`  ⏱️ T+0ms - 开始接收请求`);
    
    let body = '';
    
    req.on('data', chunk => {
        body += chunk;
    });
    
    req.on('end', () => {
        const receivedTime = Date.now() - startTime;
        console.log(`  ⏱️ T+${receivedTime}ms - 请求接收完成 (${body.length} bytes)`);
        
        try {
            const data = JSON.parse(body);
            const apiBody = JSON.stringify({
                model: data.model || MODEL,
                messages: data.messages,
                max_tokens: data.max_tokens || 8000,
                temperature: data.temperature || 0.7
            });

            console.log(`  ⏱️ T+${Date.now() - startTime}ms - 开始发送 API 请求`);
            console.log(`  📊 API 请求体大小：${apiBody.length} bytes`);

            const apiReq = https.request({
                hostname: 'api.jiekou.ai',
                port: 443,
                path: '/openai/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Length': Buffer.byteLength(apiBody)
                },
                timeout: 120000
            }, (apiRes) => {
                console.log(`  ⏱️ T+${Date.now() - startTime}ms - API 响应：${apiRes.statusCode}`);
                
                let apiData = '';
                apiRes.on('data', chunk => {
                    apiData += chunk;
                });
                
                apiRes.on('end', () => {
                    console.log(`  ⏱️ T+${Date.now() - startTime}ms - API 响应完成 (${apiData.length} bytes)`);
                    console.log(`  ✅ 总耗时：${Date.now() - startTime}ms`);
                    
                    res.writeHead(apiRes.statusCode, {'Content-Type': 'application/json'});
                    res.end(apiData);
                });
            });

            apiReq.on('error', (e) => {
                console.error(`  ❌ T+${Date.now() - startTime}ms - API 错误：${e.message}`);
                res.writeHead(502, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: e.message, code: e.code}));
            });

            apiReq.on('timeout', () => {
                console.error(`  ⏱️ T+${Date.now() - startTime}ms - API 超时`);
                apiReq.destroy();
                res.writeHead(504, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'API timeout', duration: Date.now() - startTime}));
            });

            console.log(`  ⏱️ T+${Date.now() - startTime}ms - 发送 API 请求`);
            apiReq.write(apiBody);
            apiReq.end();
            
        } catch (e) {
            console.error(`  ❌ 解析错误：${e.message}`);
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: e.message}));
        }
    });
}

function serveStatic(req, res) {
    let filePath = req.url === '/' ? '/simple-generator.html' : req.url;
    filePath = path.join(__dirname, filePath.split('?')[0]);

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found: ' + filePath);
        } else {
            res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
            res.end(content);
        }
    });
}

server.listen(PORT, '0.0.0.0', () => {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║           ✅ 服务器已启动                                ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  🌐 http://localhost:${PORT}/simple-generator.html`.padEnd(60) + '║');
    console.log(`║  🔍 http://localhost:${PORT}/api/health`.padEnd(60) + '║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('\n📖 保持此窗口打开\n');
});
