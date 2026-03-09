const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 加载环境变量
function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
        console.log('✅ 环境变量已加载');
    } else {
        console.warn('⚠️ 警告：未找到 .env 文件，使用默认配置');
    }
}

loadEnv();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const MODEL = process.env.MODEL || 'claude-opus-4-6';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT) || 120000;

if (!API_KEY) {
    console.error('❌ 错误：API_KEY 未配置！请在 .env 文件中设置 API_KEY');
    process.exit(1);
}

console.log('');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║        🎮 AI 游戏生成器 - 本地服务器                     ║');
console.log('╠══════════════════════════════════════════════════════════╣');
console.log(`║  地址：http://localhost:${PORT}                           ║`);
console.log('║  API: api.jiekou.ai/openai                              ║');
console.log(`║  模型：${MODEL.padEnd(30)}║`);
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

http.createServer((req, res) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${req.method} ${req.url}`);

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API 代理 - 生成游戏
    if (req.url === '/api/generate' && req.method === 'POST') {
        let body = '';
        let responseSent = false;
        
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            console.log(`  📝 收到请求 (${body.length} bytes)`);
            
            try {
                const requestData = JSON.parse(body);
                const apiData = JSON.stringify({
                    model: requestData.model || MODEL,
                    messages: requestData.messages,
                    max_tokens: requestData.max_tokens || 8000,
                    temperature: requestData.temperature || 0.7
                });

                console.log(`  📤 发送请求到 API...`);
                console.log(`  模型：${requestData.model || MODEL}`);
                console.log(`  消息数：${requestData.messages?.length || 0}`);

                const options = {
                    hostname: 'api.jiekou.ai',
                    port: 443,
                    path: '/openai/chat/completions',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Length': Buffer.byteLength(apiData)
                    },
                    timeout: API_TIMEOUT
                };

                const startTime = Date.now();
                const proxyReq = https.request(options, (proxyRes) => {
                    const duration = Date.now() - startTime;
                    console.log(`  📥 API 响应：${proxyRes.statusCode} (${duration}ms)`);
                    
                    let apiResponse = '';
                    proxyRes.on('data', chunk => apiResponse += chunk);
                    proxyRes.on('end', () => {
                        if (responseSent) return;
                        responseSent = true;
                        
                        if (proxyRes.statusCode === 200) {
                            console.log(`  ✅ 成功！响应大小：${apiResponse.length} bytes`);
                        } else {
                            console.log(`  ❌ 失败：${proxyRes.statusCode}`);
                            console.log(`  响应：${apiResponse.substring(0, 200)}`);
                        }
                        
                        res.writeHead(proxyRes.statusCode, {'Content-Type': 'application/json'});
                        res.end(apiResponse);
                    });
                });

                proxyReq.on('error', (e) => {
                    if (responseSent) return;
                    responseSent = true;
                    
                    console.error(`  ❌ 代理错误：${e.message} (${e.code})`);
                    res.writeHead(502, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        error: 'API 请求失败',
                        message: e.message,
                        code: e.code
                    }));
                });

                proxyReq.on('timeout', () => {
                    if (responseSent) return;
                    responseSent = true;
                    
                    console.error(`  ⏱️ 请求超时 (${Date.now() - startTime}ms)`);
                    proxyReq.destroy();
                    res.writeHead(504, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        error: 'API 请求超时',
                        message: '服务器响应时间过长，请重试或检查网络连接',
                        duration: Date.now() - startTime
                    }));
                });

                proxyReq.write(apiData);
                proxyReq.end();
                console.log(`  → 请求已发送`);
                
            } catch (e) {
                if (responseSent) return;
                responseSent = true;
                
                console.error(`  ❌ 解析错误：${e.message}`);
                res.writeHead(400, {'Content-Type': 'application/json'});
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

    // 静态文件
    let filePath = req.url === '/' ? '/create.html' : req.url;
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
            res.writeHead(404);
            res.end('File not found: ' + filePath);
        } else {
            res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
            res.end(content);
        }
    });
}).listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ 服务器已启动`);
    console.log(`🌐 打开：http://localhost:${PORT}/create.html`);
    console.log(`🔍 测试：http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('📖 使用说明：');
    console.log('1. 保持此窗口打开');
    console.log('2. 访问上述网址开始使用');
    console.log('3. 按 Ctrl+C 停止服务器');
    console.log('');
});
