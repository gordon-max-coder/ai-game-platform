const https = require('https');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';

console.log('🔍 测试 Jiekou AI API 连接...\n');

const postData = JSON.stringify({
    model: 'claude-opus-4-6',
    messages: [
        {
            role: 'user',
            content: 'Hello'
        }
    ],
    max_tokens: 100
});

const options = {
    hostname: 'jiekou.ai',
    port: 443,
    path: '/api/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('📤 发送请求到：https://jiekou.ai/api/chat/completions');
console.log('📝 请求内容:', postData.substring(0, 100) + '...\n');

const req = https.request(options, (res) => {
    console.log(`📥 响应状态：${res.statusCode}`);
    console.log('📋 响应头:', JSON.stringify(res.headers, null, 2));
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('\n📄 响应内容:');
        console.log(data.substring(0, 500));
        
        if (res.statusCode === 200) {
            console.log('\n✅ API 调用成功！');
        } else {
            console.log('\n❌ API 调用失败！');
        }
    });
});

req.on('error', (e) => {
    console.error('\n❌ 请求错误:', e.message);
});

req.write(postData);
req.end();
