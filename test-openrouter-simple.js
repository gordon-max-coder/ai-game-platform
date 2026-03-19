const https = require('https');

const API_KEY = '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';

const data = {
    model: 'openrouter/hunter-alpha',
    messages: [
        {
            role: 'user',
            content: 'Hello! Just testing the API. Please respond with "OK".'
        }
    ],
    max_tokens: 100
};

const dataString = JSON.stringify(data);

const options = {
    hostname: 'openrouter.ai',
    port: 443,
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(dataString),
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Game Generator Test'
    }
};

console.log('🔗 Testing OpenRouter API...\n');

const req = https.request(options, (res) => {
    console.log(`📥 Status: ${res.statusCode}`);
    
    let body = '';
    
    res.on('data', chunk => body += chunk);
    
    res.on('end', () => {
        if (res.statusCode === 200) {
            const response = JSON.parse(body);
            console.log('✅ Success!');
            console.log('🤖 Model:', response.model);
            console.log('💬 Response:', response.choices?.[0]?.message?.content);
        } else {
            console.log('❌ Error:', body);
        }
    });
});

req.on('error', (e) => console.error('❌ Error:', e.message));
req.write(dataString);
req.end();
