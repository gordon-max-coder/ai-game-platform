const https = require('https');

const data = JSON.stringify({
    model: 'gpt-5.4',
    messages: [{ role: 'user', content: 'Hi' }],
    max_tokens: 10
});

const req = https.request({
    hostname: 'api.jiekou.ai',
    port: 443,
    path: '/openai/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8',
        'Content-Length': data.length
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const json = JSON.parse(body);
            if (json.choices) {
                console.log('✅ Success:', json.choices[0].message.content);
            } else if (json.error) {
                console.log('❌ Error:', json.error.message);
            }
        } catch(e) {
            console.log('Response:', body);
        }
        process.exit(0);
    });
});

req.on('error', (e) => {
    console.error('❌ Request error:', e.message);
    process.exit(1);
});

req.write(data);
req.end();

// 设置超时
setTimeout(() => {
    console.log('⏱️ Timeout');
    process.exit(1);
}, 10000);
