/**
 * 测试 jiekou.ai Gemini 3.1 Flash Lite Preview API
 * 非交互式版本 - 适合自动化执行
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 加载 .env 文件
function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const eqIndex = trimmed.indexOf('=');
                if (eqIndex > 0) {
                    const key = trimmed.substring(0, eqIndex).trim();
                    const value = trimmed.substring(eqIndex + 1).trim();
                    process.env[key] = value;
                }
            }
        });
    }
}

loadEnv();

const API_KEY = process.env.API_KEY;
const MODEL = process.env.MODEL || 'gemini-3.1-flash-lite-preview';

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║         🧪 测试 jiekou.ai Gemini API                         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log('');

console.log('📋 测试配置:');
console.log(`  API Key: ${API_KEY ? API_KEY.substring(0, 15) + '...' : '未配置'}`);
console.log(`  模型：${MODEL}`);
console.log(`  端点：api.jiekou.ai/openai/chat/completions`);
console.log('');

if (!API_KEY) {
    console.error('❌ 错误：API_KEY 未配置！');
    console.log('   请在 .env 文件中设置 API_KEY');
    process.exit(1);
}

const requestData = {
    model: MODEL,
    messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, please respond with just "Hi!"' }
    ],
    max_tokens: 100,
    temperature: 0.7
};

const requestBody = JSON.stringify(requestData);

const options = {
    hostname: 'api.jiekou.ai',
    port: 443,
    path: '/openai/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': requestBody.length
    }
};

console.log('🚀 发送测试请求...');
console.log('');

const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log(`📥 响应状态：${res.statusCode}`);
        console.log('');
        
        let exitCode = 0;
        
        if (res.statusCode === 200) {
            console.log('✅ API 调用成功！');
            console.log('');
            
            try {
                const response = JSON.parse(data);
                const content = response.choices?.[0]?.message?.content;
                const usage = response.usage;
                
                console.log('📝 响应内容:');
                console.log(`   ${content}`);
                console.log('');
                
                if (usage) {
                    console.log('📊 Token 使用:');
                    console.log(`   输入：${usage.prompt_tokens || 0} tokens`);
                    console.log(`   输出：${usage.completion_tokens || 0} tokens`);
                    console.log(`   总计：${usage.total_tokens || 0} tokens`);
                }
                
                console.log('');
                console.log('🎉 测试完成！API 配置正确，可以开始使用。');
                
            } catch (error) {
                console.error('❌ 解析响应失败:', error.message);
                exitCode = 1;
            }
            
        } else {
            console.error('❌ API 调用失败！');
            exitCode = 1;
            console.log('');
            console.log('错误信息:');
            console.log(data);
            console.log('');
            
            if (res.statusCode === 401) {
                console.log('💡 可能原因:');
                console.log('   1. API Key 无效或已过期');
                console.log('   2. API Key 格式不正确');
                console.log('   3. 账号余额不足');
                console.log('');
                console.log('📋 解决方法:');
                console.log('   1. 访问 https://jiekou.ai/');
                console.log('   2. 登录账号检查 API Key');
                console.log('   3. 确认账号余额充足');
            } else if (res.statusCode === 404) {
                console.log('💡 可能原因:');
                console.log('   模型名称错误或不可用');
            }
        }
        
        // 非交互式退出
        process.exit(exitCode);
    });
});

// 设置请求超时
req.setTimeout(30000, () => {
    console.error('❌ 请求超时 (30 秒)');
    req.destroy();
    process.exit(1);
});

req.on('error', (error) => {
    console.error('❌ 请求失败:', error.message);
    console.log('');
    console.log('💡 检查网络连接或 API 端点是否正确');
    process.exit(1);
});

req.write(requestBody);
req.end();
