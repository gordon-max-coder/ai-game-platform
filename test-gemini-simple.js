const https = require('https');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const MODEL = 'gemini-3.1-flash-lite-preview';

console.log(`Testing ${MODEL}\n`);

const data = JSON.stringify({
    model: MODEL,
    messages: [
        { role: 'user', content: 'Say hello in one word' }
    ],
    max_tokens: 50,
    temperature: 0.7
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
    console.log(`Status: ${res.statusCode}`);
    
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log(`Response:\n${body}\n`);
        
        if (res.statusCode === 200) {
            try {
                const response = JSON.parse(body);
                console.log('Parsed:');
                console.log(JSON.stringify(response, null, 2));
            } catch (e) {
                console.log('Parse error:', e.message);
            }
        }
        process.exit(0);
    });
});

req.on('error', (e) => {
    console.error('Error:', e.message);
    process.exit(1);
});

req.setTimeout(20000, () => {
    console.error('Timeout!');
    req.destroy();
    process.exit(1);
});

req.write(data);
req.end();
