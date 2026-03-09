const http = require('http');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const PORT = 3000;
const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const MODEL = 'claude-opus-4-6';

// 保存 API 响应的目录
const RESPONSES_DIR = path.join(__dirname, 'api-responses');
if (!fs.existsSync(RESPONSES_DIR)) {
    fs.mkdirSync(RESPONSES_DIR, { recursive: true });
}

console.log('\n🚀 启动服务器 (带响应保存)...\n');
console.log(`📁 响应保存目录：${RESPONSES_DIR}`);

const apiClient = axios.create({
    baseURL: 'https://api.jiekou.ai/openai',
    timeout: 300000,  // 增加到 5 分钟
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
                    max_tokens: 16000,  // 增加到 16000
                    temperature: data.temperature || 0.7
                };

                console.log(`  ⏱️ T+${Date.now() - startTime}ms - 发送到 API...`);

                const apiStartTime = Date.now();
                const response = await apiClient.post('/chat/completions', requestData);
                const duration = Date.now() - apiStartTime;
                
                console.log(`  ⏱️ T+${Date.now() - startTime}ms - API 响应：${response.status} (${duration}ms)`);
                console.log(`  ✅ 成功！`);

                // 保存响应到文件
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `response-${timestamp}.json`;
                const filepath = path.join(RESPONSES_DIR, filename);
                
                const gameCode = response.data.choices?.[0]?.message?.content || '';
                const prompt = data.messages?.[1]?.content || 'No prompt';
                
                const saveData = {
                    timestamp: new Date().toISOString(),
                    prompt: prompt,
                    gameCode: gameCode,
                    rawResponse: response.data,
                    duration: duration
                };
                
                fs.writeFileSync(filepath, JSON.stringify(saveData, null, 2), 'utf8');
                console.log(`  💾 响应已保存：${filename}`);
                
                // 同时保存为 HTML 文件方便查看
                let htmlCode = gameCode;
                if (gameCode.includes('```html')) {
                    const start = gameCode.indexOf('```html') + 7;
                    const end = gameCode.indexOf('```', start);
                    if (end !== -1) htmlCode = gameCode.substring(start, end).trim();
                }
                if (!htmlCode.startsWith('<!DOCTYPE')) {
                    const htmlIndex = htmlCode.toLowerCase().indexOf('<html');
                    if (htmlIndex !== -1) {
                        htmlCode = '<!DOCTYPE html>\n' + htmlCode.substring(htmlIndex);
                    }
                }
                
                const htmlFilename = `game-${timestamp}.html`;
                const htmlFilepath = path.join(RESPONSES_DIR, htmlFilename);
                fs.writeFileSync(htmlFilepath, htmlCode, 'utf8');
                console.log(`  🎮 游戏已保存：${htmlFilename}`);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(response.data));

            } catch (error) {
                console.error(`  ❌ T+${Date.now() - startTime}ms - 错误：${error.message}`);
                if (error.response) {
                    console.error(`  状态码：${error.response.status}`);
                }
                
                res.writeHead(error.response?.status || 500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: error.message}));
            }
        });
        return;
    }

    // 获取最后保存的游戏
    if (req.url === '/api/last-saved') {
        try {
            const files = fs.readdirSync(RESPONSES_DIR)
                .filter(f => f.startsWith('game-') && f.endsWith('.html'))
                .sort()
                .reverse();
            
            if (files.length > 0) {
                const lastFile = files[0];
                const gameCode = fs.readFileSync(path.join(RESPONSES_DIR, lastFile), 'utf8');
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({gameCode: gameCode, filename: lastFile}));
            } else {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'No saved games'}));
            }
        } catch (e) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: e.message}));
        }
        return;
    }

    // 健康检查
    if (req.url === '/api/health') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            status: 'ok',
            service: 'AI Game Generator (with save)',
            responsesDir: RESPONSES_DIR
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
    console.log('║        ✅ 服务器已启动 (带响应保存)                      ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  🌐 http://localhost:${PORT}/simple-generator.html`.padEnd(60) + '║');
    console.log(`║  📁 响应保存：${RESPONSES_DIR}`.padEnd(60) + '║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('\n📖 保持窗口打开，按 Ctrl+C 停止\n');
});
