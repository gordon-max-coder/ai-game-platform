const https = require('https');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const MODEL = 'gemini-3.1-flash-lite-preview';

console.log(`Testing ${MODEL} with different parameters...\n`);

const tests = [
    { name: 'Default', max_tokens: 100, temperature: 0.7 },
    { name: 'High tokens', max_tokens: 1000, temperature: 0.7 },
    { name: 'Low temp', max_tokens: 100, temperature: 0.1 },
    { name: 'High temp', max_tokens: 100, temperature: 1.0 },
];

async function test(params) {
    return new Promise((resolve) => {
        console.log(`Test: ${params.name}`);
        console.log(`  max_tokens: ${params.max_tokens}, temperature: ${params.temperature}`);
        
        const data = JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Please say hello and tell me what model you are.' }
            ],
            max_tokens: params.max_tokens,
            temperature: params.temperature
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

        const startTime = Date.now();
        
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                const duration = Date.now() - startTime;
                console.log(`  Status: ${res.statusCode} (${duration}ms)`);
                
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(body);
                        const content = response.choices[0].message.content;
                        const usage = response.usage;
                        
                        if (content && content.trim()) {
                            console.log(`  ✅ Response: "${content.substring(0, 100)}"`);
                        } else {
                            console.log(`  ⚠️  Empty response`);
                        }
                        
                        if (usage) {
                            console.log(`  Tokens: ${usage.total_tokens}`);
                        }
                    } catch (e) {
                        console.log(`  ❌ Parse error: ${e.message}`);
                    }
                } else {
                    console.log(`  ❌ Error: ${body}`);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.log(`  ❌ Network error: ${e.message}`);
            resolve();
        });

        req.setTimeout(15000, () => {
            console.log('  ⏱️ Timeout');
            req.destroy();
            resolve();
        });

        req.write(data);
        req.end();
    });
}

async function main() {
    for (const test of tests) {
        await test(test);
        console.log('');
    }
}

main();
