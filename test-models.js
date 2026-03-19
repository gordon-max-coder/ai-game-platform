const https = require('https');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';

async function testModel(modelName) {
    return new Promise((resolve) => {
        console.log(`\nTesting: ${modelName}`);
        
        const data = JSON.stringify({
            model: modelName,
            messages: [{ role: 'user', content: 'Hi' }],
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
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`  Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    const response = JSON.parse(body);
                    console.log(`  ✅ Success: ${response.choices[0].message.content.substring(0, 50)}`);
                    resolve(true);
                } else {
                    console.log(`  ❌ Error: ${body}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`  ❌ Network error: ${e.message}`);
            resolve(false);
        });

        req.setTimeout(10000, () => {
            console.log('  ⏱️ Timeout');
            req.destroy();
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('═══════════════════════════════════════════');
    console.log('  Testing jiekou.ai Models');
    console.log('═══════════════════════════════════════════');

    const models = [
        'claude-opus-4-6',
        'claude-sonnet-3-5',
        'gemini-3.1-flash-lite-preview',
        'gemini-2.5-flash',
        'gemini-2.0-flash-exp'
    ];

    for (const model of models) {
        await testModel(model);
    }

    console.log('\n═══════════════════════════════════════════');
    console.log('  Test Complete');
    console.log('═══════════════════════════════════════════');
}

main();
