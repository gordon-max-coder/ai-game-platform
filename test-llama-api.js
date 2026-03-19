const https = require('https');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const MODEL = 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8';

const data = JSON.stringify({
    model: MODEL,
    messages: [
        {role: 'user', content: 'Hello'}
    ],
    max_tokens: 10
});

const options = {
    hostname: 'api.jiekou.ai',
    port: 443,
    path: '/openai/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(data)
    }
};

console.log('Testing model:', MODEL);
console.log('');

const req = https.request(options, (res) => {
    let body = '';
    console.log('Status:', res.statusCode);
    
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        try {
            const response = JSON.parse(body);
            console.log('');
            console.log('Response model:', response.model);
            console.log('Choices:', response.choices?.[0]?.message?.content?.substring(0, 100));
            console.log('');
            if (response.error) {
                console.log('❌ Error:', JSON.stringify(response.error, null, 2));
            } else {
                console.log('✅ Success! Model returned:', response.model);
            }
        } catch (e) {
            console.log('Raw response:', body.substring(0, 500));
        }
    });
});

req.on('error', (e) => {
    console.error('❌ Request error:', e.message);
});

req.write(data);
req.end();
