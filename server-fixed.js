const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const MODEL = 'claude-opus-4-6';

console.log('');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║        🎮 AI 游戏生成器 - 本地服务器                     ║');
console.log('╠══════════════════════════════════════════════════════════╣');
console.log(`║  地址：http://localhost:${PORT}                           ║`);
console.log('║  API: api.jiekou.ai/openai                              ║');
console.log('║  模型：claude-opus-4-6                                  ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

http.createServer((req, res) => {
    const time = new Date().toLocaleTimeString();
    
    // CORS - 必须在最前面设置
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`[${time}] ${req.method} ${req.url}`);

    // API 代理 - 生成游戏
    if (req.url === '/api/generate' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk;
        });
        
        req.on('end', () => {
            console.log(`  📝 收到请求 (${body.length} bytes)`);
            
            try {
                const requestData = JSON.parse(body);
                
                // 构建 API 请求体
                const apiRequestBody = JSON.stringify({
                    model: requestData.model || MODEL,
                    messages: requestData.messages,
                    max_tokens: requestData.max_tokens || 8000,
                    temperature: requestData.temperature || 0.7
                });

                console.log(`  📤 准备发送到 API...`);
                console.log(`  模型：${requestData.model || MODEL}`);
                console.log(`  请求体大小：${apiRequestBody.length} bytes`);

                // 创建 API 请求
                const apiReq = https.request({
                    hostname: 'api.jiekou.ai',
                    port: 443,
                    path: '/openai/chat/completions',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Length': Buffer.byteLength(apiRequestBody)
                    },
                    timeout: 90000,
                    rejectUnauthorized: false  // 忽略 SSL 证书问题
                }, (apiRes) => {
                    console.log(`  📥 API 响应状态：${apiRes.statusCode}`);
                    
                    let apiResponse = '';
                    apiRes.on('data', chunk => {
                        apiResponse += chunk;
                    });
                    
                    apiRes.on('end', () => {
                        console.log(`  ✅ 响应接收完成 (${apiResponse.length} bytes)`);
                        res.writeHead(apiRes.statusCode, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(apiResponse);
                    });
                });

                apiReq.on('error', (e) => {
                    console.error(`  ❌ API 请求错误：${e.message}`);
                    console.error(`  错误代码：${e.code}`);
                    res.writeHead(502, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({
                        error: 'API 请求失败',
                        message: e.message,
                        code: e.code
                    }));
                });

                apiReq.on('timeout', () => {
                    console.error(`  ⏱️ API 请求超时`);
                    apiReq.destroy();
                    res.writeHead(504, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({
                        error: 'API 请求超时',
                        message: '90 秒内未收到响应'
                    }));
                });

                // 发送请求体
                apiReq.write(apiRequestBody);
                apiReq.end();
                
                console.log(`  → 请求已发送到 API`);
                
            } catch (e) {
                console.error(`  ❌ 解析错误：${e.message}`);
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({error: e.message}));
            }
        });
        return;
    }

    // 健康检查
    if (req.url === '/api/health') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            status: 'ok',
            service: 'AI Game Generator',
            api: 'api.jiekou.ai/openai',
            model: MODEL,
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // 静态文件服务
    let filePath = req.url === '/' ? '/simple-generator.html' : req.url;
    filePath = path.join(__dirname, filePath.split('?')[0]);

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('File not found: ' + filePath);
        } else {
            res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
            res.end(content);
        }
    });
}).listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ 服务器已启动`);
    console.log(`🌐 打开：http://localhost:${PORT}/simple-generator.html`);
    console.log(`🔍 测试：http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('📖 保持此窗口打开，按 Ctrl+C 停止');
    console.log('');
});
