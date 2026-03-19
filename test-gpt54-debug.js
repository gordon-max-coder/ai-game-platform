const https = require('https');
const fs = require('fs');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const model = 'gpt-5.4';

const prompt = `请创建一个完整的 HTML5 游戏。游戏描述：创建一个贪食蛇游戏。
                    
重要技术要求：
1. 单个 HTML 文件
2. 使用 Canvas API
3. Canvas 尺寸必须为 360x640 像素（9:16 竖屏比例）
4. 在 JavaScript 中设置：canvas.width = 360; canvas.height = 640;
5. 包含完整游戏循环
6. 有得分系统

只返回 HTML 代码，不要其他说明。`;

const messages = [
    { 
        role: 'system', 
        content: '你是专业的游戏开发 AI 助手，擅长创建 HTML5 游戏。' 
    },
    { 
        role: 'user', 
        content: prompt 
    }
];

const apiData = {
    model: model,
    messages: messages,
    max_tokens: 16000,
    temperature: 0.7
};

const data = JSON.stringify(apiData);

console.log('🚀 测试 GPT-5.4 游戏生成');
console.log('========================');
console.log(`模型：${model}`);
console.log(`请求数据长度：${data.length} 字节`);
console.log('\n📝 请求内容:');
console.log(data.substring(0, 500) + '...\n');

// 保存到文件以便检查
fs.writeFileSync('test-request.json', data);
console.log('💾 请求已保存到：test-request.json\n');

const startTime = Date.now();

const options = {
    hostname: 'api.jiekou.ai',
    port: 443,
    path: '/openai/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = https.request(options, (res) => {
    let responseData = '';
    
    console.log(`⏱️  响应时间：${Date.now() - startTime}ms`);
    console.log(`📊 状态码：${res.statusCode}`);
    console.log(`📋 响应头：${JSON.stringify(res.headers, null, 2)}\n`);
    
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    
    res.on('end', () => {
        console.log('📥 响应内容:');
        console.log(responseData);
        
        try {
            const response = JSON.parse(responseData);
            if (response.error) {
                console.log(`\n❌ 错误：${response.error.message}`);
            }
        } catch (e) {
            console.log('\n⚠️  无法解析为 JSON');
        }
    });
});

req.on('error', (error) => {
    console.error('\n❌ 请求失败:', error.message);
});

req.write(data);
req.end();
