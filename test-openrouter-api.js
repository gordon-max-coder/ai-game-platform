const https = require('https');

const API_KEY = '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';
const MODEL = 'openrouter/hunter-alpha';

const data = {
    model: MODEL,
    messages: [
        {
            role: 'user',
            content: '创建一个简单的贪食蛇游戏，只需要返回 HTML 代码'
        }
    ],
    max_tokens: 8000
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

console.log('🔗 正在测试 OpenRouter Hunter Alpha API...');
console.log('📍 端点：https://openrouter.ai/api/v1/chat/completions');
console.log('🤖 模型:', MODEL);
console.log('');

const req = https.request(options, (res) => {
    console.log(`📥 响应状态：${res.statusCode}`);
    console.log('📋 响应头:', res.headers);
    console.log('');
    
    let body = '';
    
    res.on('data', chunk => {
        body += chunk;
    });
    
    res.on('end', () => {
        console.log('✅ 响应接收完成');
        console.log(`📊 响应大小：${body.length} bytes`);
        console.log('');
        
        if (res.statusCode === 200) {
            try {
                const response = JSON.parse(body);
                console.log('✅ 解析成功！');
                console.log('🤖 模型:', response.model);
                console.log('📝 使用 tokens:', response.usage?.total_tokens || 'N/A');
                console.log('');
                
                const content = response.choices?.[0]?.message?.content;
                if (content) {
                    console.log('💬 响应预览:');
                    console.log('---');
                    console.log(content.substring(0, 500) + '...');
                    console.log('---');
                    console.log('');
                    console.log('✅ API 测试成功！');
                } else {
                    console.log('❌ 响应内容为空');
                    console.log('完整响应:', JSON.stringify(response, null, 2));
                }
            } catch (error) {
                console.error('❌ 解析 JSON 失败:', error.message);
                console.log('原始响应:', body.substring(0, 500));
            }
        } else {
            console.log('❌ API 返回错误');
            console.log('响应内容:', body);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ 请求失败:', error.message);
});

req.on('timeout', () => {
    console.error('⏱️ 请求超时');
    req.destroy();
});

req.write(dataString);
req.end();
