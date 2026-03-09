const http = require('http');
const fs = require('fs');
const axios = require('axios');

const PORT = 3000;
const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const API_URL = 'https://api.jiekou.ai/openai/chat/completions';
const MODEL = 'claude-opus-4-6';

console.log('\n🚀 启动服务器 (使用 axios)...\n');

// 创建 axios 实例
const apiClient = axios.create({
    baseURL: 'https://api.jiekou.ai/openai',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

http.createServer(async (req, res) => {
    const startTime = Date.now();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`\n[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

    // API 代理
    if (req.url === '/api/generate' && req.method === 'POST') {
        console.log(`  ⏱️ T+0ms - 接收请求`);
        
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            console.log(`  ⏱️ T+${Date.now() - startTime}ms - 请求接收完成`);
            
            try {
                const data = JSON.parse(body);
                const requestData = {
                    model: data.model || MODEL,
                    messages: data.messages,
                    max_tokens: data.max_tokens || 8000,
                    temperature: data.temperature || 0.7
                };

                console.log(`  ⏱️ T+${Date.now() - startTime}ms - 发送到 API...`);
                console.log(`  📊 请求大小：${JSON.stringify(requestData).length} bytes`);

                const apiStartTime = Date.now();
                
                const response = await apiClient.post('/chat/completions', requestData);
                
                console.log(`  ⏱️ T+${Date.now() - startTime}ms - API 响应：${response.status} (${Date.now() - apiStartTime}ms)`);
                console.log(`  ✅ 成功！`);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(response.data));

            } catch (error) {
                console.error(`  ❌ T+${Date.now() - startTime}ms - 错误：${error.message}`);
                if (error.response) {
                    console.error(`  状态码：${error.response.status}`);
                    console.error(`  响应：`, JSON.stringify(error.response.data).substring(0, 200));
                } else if (error.request) {
                    console.error(`  无响应 - 请求已发送但未收到响应`);
                }
                
                res.writeHead(error.response?.status || 500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    error: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                }));
            }
        });
        return;
    }

    // 健康检查
    if (req.url === '/api/health') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            status: 'ok',
            service: 'AI Game Generator (axios)',
            api: 'api.jiekou.ai/openai',
            model: MODEL
        }));
        return;
    }

    // 静态文件
    let filePath = req.url === '/' ? 'simple-generator.html' : req.url.split('?')[0];
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found: ' + filePath);
        } else {
            const ext = filePath.split('.').pop().toLowerCase();
            const mimeTypes = {
                'html': 'text/html',
                'css': 'text/css',
                'js': 'application/javascript',
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'svg': 'image/svg+xml'
            };
            res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
            res.end(content);
        }
    });

}).listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║        ✅ 服务器已启动 (使用 axios)                      ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  🌐 http://localhost:${PORT}/simple-generator.html`.padEnd(60) + '║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('\n📖 保持窗口打开，按 Ctrl+C 停止\n');
});
