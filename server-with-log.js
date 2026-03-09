const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const MODEL = 'claude-opus-4-6';

// 日志文件
const LOG_FILE = path.join(__dirname, 'server.log');

function log(message) {
    const time = new Date().toISOString();
    const logLine = `[${time}] ${message}\n`;
    console.log(logLine);
    fs.appendFileSync(LOG_FILE, logLine);
}

// 全局错误处理
process.on('uncaughtException', (err) => {
    log(`❌ 未捕获异常：${err.message}`);
    log(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`❌ 未处理的 Promise 拒绝：${reason}`);
});

log('\n🚀 启动服务器...\n');

const server = http.createServer();

server.on('request', (req, res) => {
    const startTime = Date.now();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    log(`${req.method} ${req.url}`);

    if (req.url === '/api/generate' && req.method === 'POST') {
        handleGenerate(req, res, startTime);
        return;
    }

    if (req.url === '/api/health') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'ok', time: Date.now() - startTime + 'ms'}));
        return;
    }

    serveStatic(req, res);
});

function handleGenerate(req, res, startTime) {
    log(`⏱️ T+${Date.now() - startTime}ms - 开始接收请求`);
    
    let body = '';
    let requestReceived = false;
    
    req.on('data', chunk => {
        body += chunk;
        if (!requestReceived) {
            log(`⏱️ T+${Date.now() - startTime}ms - 接收数据中... (${body.length} bytes)`);
            requestReceived = true;
        }
    });
    
    req.on('end', () => {
        log(`⏱️ T+${Date.now() - startTime}ms - 请求接收完成 (${body.length} bytes)`);
        
        try {
            const data = JSON.parse(body);
            const apiBody = JSON.stringify({
                model: data.model || MODEL,
                messages: data.messages,
                max_tokens: data.max_tokens || 8000,
                temperature: data.temperature || 0.7
            });

            log(`⏱️ T+${Date.now() - startTime}ms - 开始发送 API 请求`);
            log(`📊 API 请求体大小：${apiBody.length} bytes`);

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
                log(`⏱️ T+${Date.now() - startTime}ms - API 响应：${apiRes.statusCode}`);
                
                let apiData = '';
                apiRes.on('data', chunk => {
                    apiData += chunk;
                });
                
                apiRes.on('end', () => {
                    log(`⏱️ T+${Date.now() - startTime}ms - API 响应完成 (${apiData.length} bytes)`);
                    log(`✅ 总耗时：${Date.now() - startTime}ms`);
                    
                    res.writeHead(apiRes.statusCode, {'Content-Type': 'application/json'});
                    res.end(apiData);
                });
            });

            apiReq.on('error', (e) => {
                log(`❌ T+${Date.now() - startTime}ms - API 错误：${e.message} (${e.code})`);
                res.writeHead(502, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: e.message, code: e.code}));
            });

            apiReq.on('timeout', () => {
                log(`⏱️ T+${Date.now() - startTime}ms - API 超时`);
                apiReq.destroy();
                res.writeHead(504, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'API timeout', duration: Date.now() - startTime}));
            });

            log(`⏱️ T+${Date.now() - startTime}ms - 发送 API 请求`);
            apiReq.write(apiBody);
            apiReq.end();
            
        } catch (e) {
            log(`❌ 解析错误：${e.message}`);
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: e.message}));
        }
    });
    
    req.on('error', (e) => {
        log(`❌ 请求错误：${e.message}`);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: e.message}));
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
    log('╔══════════════════════════════════════════════════════════╗');
    log('║           ✅ 服务器已启动                                ║');
    log('╠══════════════════════════════════════════════════════════╣');
    log(`║  🌐 http://localhost:${PORT}/simple-generator.html`.padEnd(60) + '║');
    log(`║  📄 日志文件：server.log`.padEnd(60) + '║');
    log('╚══════════════════════════════════════════════════════════╝');
    log('\n📖 保持此窗口打开\n');
});
