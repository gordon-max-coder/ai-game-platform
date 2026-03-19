const https = require('https');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const model = 'gpt-5.4';

const data = JSON.stringify({
    model: model,
    messages: [
        { role: 'user', content: 'Hello, test message' }
    ],
    max_tokens: 50
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

console.log(`🔍 测试模型：${model}`);
console.log('发送请求...\n');

const req = https.request(options, (res) => {
    let responseData = '';
    
    console.log(`状态码：${res.statusCode}`);
    console.log(`响应头：${JSON.stringify(res.headers, null, 2)}\n`);
    
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    
    res.on('end', () => {
        try {
            const response = JSON.parse(responseData);
            console.log('✅ 响应内容:');
            console.log(JSON.stringify(response, null, 2));
            
            if (response.error) {
                console.log(`\n❌ 错误：${response.error.message}`);
                console.log(`   类型：${response.error.type}`);
                console.log(`   代码：${response.error.code}`);
            } else if (response.choices && response.choices[0]) {
                console.log(`\n✅ 测试成功！`);
                console.log(`   内容：${response.choices[0].message.content}`);
            }
        } catch (e) {
            console.log('原始响应:', responseData);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ 请求失败:', error.message);
});

req.write(data);
req.end();
