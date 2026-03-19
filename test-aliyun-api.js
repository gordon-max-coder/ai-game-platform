/**
 * 测试阿里云百炼 API
 */

const https = require('https');

// 从 .env 读取 API Key
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let apiKey = '';
envContent.split('\n').forEach(line => {
    if (line.startsWith('API_KEY=')) {
        apiKey = line.split('=')[1].trim();
    }
});

console.log('');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║        🧪 测试阿里云百炼 API                              ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

console.log('📋 测试配置:');
console.log(`  API Key: ${apiKey.substring(0, 15)}...`);
console.log(`  端点：dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`);
console.log(`  模型：qwen-plus`);
console.log('');

const testData = JSON.stringify({
    model: 'qwen-plus',
    messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: 'Hello, say hi!'}
    ],
    max_tokens: 50,
    temperature: 0.7,
    stream: false
});

const options = {
    hostname: 'dashscope.aliyuncs.com',
    port: 443,
    path: '/compatible-mode/v1/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(testData)
    }
};

console.log('📤 发送测试请求...');
console.log('');

const req = https.request(options, (res) => {
    console.log(`📥 响应状态：${res.statusCode}`);
    console.log('');
    
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => {
        try {
            const response = JSON.parse(responseData);
            
            if (res.statusCode === 200) {
                console.log('✅ API 调用成功！');
                console.log('');
                console.log('响应内容:');
                console.log(response.choices?.[0]?.message?.content || '无内容');
                console.log('');
                console.log('Usage:');
                console.log(JSON.stringify(response.usage, null, 2));
            } else {
                console.log('❌ API 调用失败！');
                console.log('');
                console.log('错误信息:');
                console.log(JSON.stringify(response, null, 2));
                console.log('');
                
                if (res.statusCode === 401) {
                    console.log('💡 可能原因:');
                    console.log('  1. API Key 无效或已过期');
                    console.log('  2. API Key 格式不正确');
                    console.log('  3. 账号余额不足');
                    console.log('  4. 需要开通百炼服务');
                    console.log('');
                    console.log('📖 解决方法:');
                    console.log('  1. 访问 https://dashscope.console.aliyun.com/');
                    console.log('  2. 检查 API Key 是否正确');
                    console.log('  3. 确认已开通百炼服务');
                }
            }
        } catch (e) {
            console.log('❌ 解析响应失败！');
            console.log('');
            console.log('原始响应:');
            console.log(responseData);
        }
        
        console.log('');
        console.log('按任意键退出...');
    });
});

req.on('error', (e) => {
    console.log('❌ 请求失败！');
    console.log('');
    console.log(`错误：${e.message}`);
    console.log(`代码：${e.code}`);
    console.log('');
    console.log('按任意键退出...');
});

req.write(testData);
req.end();
