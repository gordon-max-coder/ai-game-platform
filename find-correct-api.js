const https = require('https');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';

// 可能的 API 基础 URL
const baseUrls = [
    'https://api.jiekou.ai',
    'https://jiekou.ai',
    'https://api.jiekouai.com',
    'https://jiekouai.com'
];

// 可能的 API 路径
const paths = [
    '/v1/chat/completions',
    '/api/v1/chat/completions',
    '/chat/completions',
    '/api/chat/completions'
];

// 可能的模型名称
const models = [
    'claude-3-opus-20240229',
    'claude-3-5-sonnet-20241022',
    'claude-sonnet-4-20250514',
    'claude-opus-4-6',
    'claude-3-opus'
];

async function testConfig(baseUrl, path, model) {
    return new Promise((resolve) => {
        const url = new URL(path, baseUrl);
        
        const postData = JSON.stringify({
            model: model,
            messages: [{role: 'user', content: 'Hi'}],
            max_tokens: 50
        });

        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname,
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
                resolve({
                    success: res.statusCode === 200,
                    statusCode: res.statusCode,
                    url: url.href,
                    model: model,
                    response: data.substring(0, 200)
                });
            });
        });

        req.on('error', (e) => {
            resolve({
                success: false,
                statusCode: 0,
                url: url.href,
                model: model,
                error: e.message
            });
        });

        req.setTimeout(5000, () => {
            req.destroy();
            resolve({
                success: false,
                statusCode: 0,
                url: url.href,
                model: model,
                error: 'Timeout'
            });
        });

        req.write(postData);
        req.end();
    });
}

async function testAll() {
    console.log('🚀 测试 Jiekou AI API 配置...\n');
    console.log('=' .repeat(70));
    
    let found = false;
    
    for (const baseUrl of baseUrls) {
        for (const path of paths) {
            for (const model of models) {
                const result = await testConfig(baseUrl, path, model);
                
                if (result.success) {
                    console.log('\n' + '='.repeat(70));
                    console.log('🎉 找到正确的配置！');
                    console.log('='.repeat(70));
                    console.log(`✅ Base URL: ${baseUrl}`);
                    console.log(`✅ Path: ${path}`);
                    console.log(`✅ Model: ${model}`);
                    console.log(`✅ 状态码：${result.statusCode}`);
                    console.log('='.repeat(70));
                    found = true;
                    return;
                } else {
                    const status = result.statusCode === 401 ? '🔑 401(密钥问题)' : 
                                   result.statusCode === 404 ? '❌ 404(路径错误)' :
                                   result.statusCode === 0 ? '⏱️ 超时/网络错误' :
                                   `❌ ${result.statusCode}`;
                    console.log(`${status} ${baseUrl}${path} - ${model}`);
                }
                
                // 短暂延迟避免请求过快
                await new Promise(r => setTimeout(r, 200));
            }
        }
    }
    
    if (!found) {
        console.log('\n' + '='.repeat(70));
        console.log('❌ 所有配置都失败了！');
        console.log('='.repeat(70));
        console.log('\n请检查：');
        console.log('1. API 密钥是否正确：sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8');
        console.log('2. 访问 https://docs.jiekou.ai/docs/ 查看正确的 API 端点');
        console.log('3. 确认 API 密钥是否有足够的余额');
        console.log('4. 检查网络连接是否正常');
        console.log('\n可能的原因：');
        console.log('- API 密钥无效或已过期');
        console.log('- API 端点地址不正确');
        console.log('- 模型名称不正确');
        console.log('- 需要先在官网充值或激活');
    }
}

testAll();
