const http = require('http');
const https = require('https');
const fs = require('fs');

console.log('Starting server on port 3000...');

http.createServer((req, res) => {
    console.log('Request:', req.method, req.url);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.url === '/api/generate' && req.method === 'POST') {
        console.log('Got generate request');
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            console.log('Request body received, sending to API...');
            
            const apiReq = https.request({
                hostname: 'api.jiekou.ai',
                port: 443,
                path: '/openai/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8',
                    'Content-Length': Buffer.byteLength(body)
                }
            }, apiRes => {
                console.log('API response:', apiRes.statusCode);
                let apiData = '';
                apiRes.on('data', chunk => apiData += chunk);
                apiRes.on('end', () => {
                    res.writeHead(apiRes.statusCode, {'Content-Type': 'application/json'});
                    res.end(apiData);
                });
            });
            
            apiReq.on('error', e => {
                console.error('API error:', e.message);
                res.writeHead(502, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: e.message}));
            });
            
            apiReq.write(body);
            apiReq.end();
        });
        return;
    }
    
    // Serve static files
    let file = req.url === '/' ? 'simple-generator.html' : req.url.replace('?', '&').split('&')[0];
    fs.readFile(file, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found: ' + file);
        } else {
            res.writeHead(200);
            res.end(data);
        }
    });
    
}).listen(3000, () => {
    console.log('');
    console.log('========================================');
    console.log('Server running!');
    console.log('Open: http://localhost:3000/simple-generator.html');
    console.log('Press Ctrl+C to stop');
    console.log('========================================');
    console.log('');
});
