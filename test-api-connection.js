const https = require('https');

console.log('🔍 测试 Jiekou AI API 连接\n');
console.log('=' .repeat(50));

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';

const postData = JSON.stringify({
    model: 'claude-opus-4-6',
    messages: [{role: 'user', content: 'Hello, test'}],
    max_tokens: 100
});

const options = {
    hostname: 'api.jiekou.ai',
    port: 443,
    path: '/openai/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 30000
};

console.log('📤 发送请求到：https://api.jiekou.ai/openai/chat/completions');
console.log('📝 模型：claude-opus-4-6');
console.log('📝 请求内容:', postData.substring(0, 100) + '...\n');

const startTime = Date.now();

const req = https.request(options, (res) => {
    const duration = Date.now() - startTime;
    console.log(`📥 响应时间：${duration}ms`);
    console.log(`📊 响应状态：${res.statusCode}`);
    console.log('📋 响应头:', JSON.stringify(res.headers, null, 2));
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('\n📄 响应内容:');
        console.log(data);
        
        if (res.statusCode === 200) {
            console.log('\n✅ API 调用成功！');
        } else if (res.statusCode === 401) {
            console.log('\n❌ 401 错误：API 密钥无效或格式错误');
        } else if (res.statusCode === 403) {
            console.log('\n❌ 403 错误：账户可能没有权限或余额不足');
        } else if (res.statusCode === 404) {
            console.log('\n❌ 404 错误：API 端点不存在');
        } else if (res.statusCode === 429) {
            console.log('\n❌ 429 错误：请求速率限制');
        } else {
            console.log(`\n❌ 其他错误：${res.statusCode}`);
        }
    });
});

req.on('error', (e) => {
    console.error('\n❌ 请求错误:', e.message);
    console.error('错误代码:', e.code);
    console.error('错误类型:', e.errno);
    
    if (e.code === 'ENOTFOUND') {
        console.log('\n💡 域名无法解析，请检查：');
        console.log('1. 网络连接是否正常');
        console.log('2. 域名 api.jiekou.ai 是否正确');
        console.log('3. DNS 设置');
    } else if (e.code === 'ETIMEDOUT') {
        console.log('\n💡 请求超时，请检查：');
        console.log('1. 网络连接是否正常');
        console.log('2. 是否需要代理/翻墙');
        console.log('3. 防火墙设置');
    } else if (e.code === 'ECONNREFUSED') {
        console.log('\n💡 连接被拒绝，请检查：');
        console.log('1. 目标服务器是否运行');
        console.log('2. 防火墙是否阻止');
    }
});

req.on('timeout', () => {
    console.error('\n⏱️ 请求超时（30 秒）');
    req.destroy();
    console.log('\n💡 超时可能原因：');
    console.log('1. 网络连接问题');
    console.log('2. 需要代理才能访问');
    console.log('3. 服务器响应慢');
});

req.write(postData);
req.end();

console.log('⏳ 等待响应中...（最多 30 秒）');
