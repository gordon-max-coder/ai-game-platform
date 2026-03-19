const https = require('https');

const API_KEY = 'sk-sp-1f8c74b136034be19241c679ed6fcd1d';
const MODEL = 'gemini-3.1-flash-lite-preview';

console.log('Testing jiekou.ai API...');
console.log('Model:', MODEL);

const data = JSON.stringify({
    model: MODEL,
    messages: [
        { role: 'user', content: 'Say hi' }
    ],
    max_tokens: 50
});

const options = {
    hostname: 'api.jiekou.ai',
    port: 443,
    path: '/openai/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let body = '';
    console.log('Status:', res.statusCode);
    
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('Response:', body);
        process.exit(0);
    });
});

req.on('error', (e) => {
    console.error('Error:', e.message);
    process.exit(1);
});

req.setTimeout(15000, () => {
    console.error('Timeout!');
    req.destroy();
    process.exit(1);
});

req.write(data);
req.end();
