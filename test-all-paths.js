const https = require('https');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';

// 测试不同的 API 路径
const paths = [
    '/api/chat/completions',
    '/v1/chat/completions',
    '/chat/completions',
    '/api/v1/chat/completions'
];

async function testPath(path) {
    return new Promise((resolve) => {
        console.log(`\n🔍 测试路径：${path}`);
        
        const postData = JSON.stringify({
            model: 'claude-opus-4-6',
            messages: [{role: 'user', content: 'Hi'}],
            max_tokens: 50
        });

        const options = {
            hostname: 'jiekou.ai',
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ 成功！状态码：${res.statusCode}`);
                    resolve(true);
                } else {
                    console.log(`❌ 失败！状态码：${res.statusCode}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`❌ 错误：${e.message}`);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

async function testAll() {
    console.log('🚀 开始测试 Jiekou AI API 路径...\n');
    console.log('=' .repeat(50));
    
    for (const path of paths) {
        const success = await testPath(path);
        if (success) {
            console.log('\n' + '='.repeat(50));
            console.log(`🎉 找到正确的 API 路径：${path}`);
            console.log('='.repeat(50));
            return path;
        }
        await new Promise(r => setTimeout(r, 500));
    }
    
    console.log('\n❌ 所有路径都失败了，请检查：');
    console.log('1. API 密钥是否正确');
    console.log('2. 网络连接是否正常');
    console.log('3. API 服务商地址是否正确');
}

testAll();
