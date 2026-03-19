const https = require('https');

const API_KEY = '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';

// 测试 1: 简单请求
const testData = {
    model: 'openrouter/hunter-alpha',
    messages: [{ role: 'user', content: 'Hi' }],
    max_tokens: 50
};

console.log('🔍 测试 1: 简单请求...\n');
testAPI(testData, '简单请求');

// 测试 2: 游戏生成请求（模拟真实场景）
const gameData = {
    model: 'openrouter/hunter-alpha',
    messages: [
        { 
            role: 'system', 
            content: '你是专业的游戏开发 AI 助手。只返回 HTML 代码。' 
        },
        { 
            role: 'user', 
            content: '创建一个贪食蛇游戏，Canvas 360x640' 
        }
    ],
    max_tokens: 8000,
    temperature: 0.7
};

setTimeout(() => {
    console.log('\n🔍 测试 2: 游戏生成请求...\n');
    testAPI(gameData, '游戏生成');
}, 2000);

function testAPI(data, testName) {
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
            'X-Title': 'AI Game Generator'
        },
        timeout: 60000  // 60 秒超时
    };
    
    const startTime = Date.now();
    
    const req = https.request(options, (res) => {
        const duration = Date.now() - startTime;
        console.log(`📥 ${testName} - 状态：${res.statusCode} (${duration}ms)`);
        
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                const response = JSON.parse(body);
                console.log(`✅ ${testName} 成功!`);
                console.log(`   模型：${response.model}`);
                console.log(`   Tokens: ${response.usage?.total_tokens || 'N/A'}`);
                if (response.choices?.[0]?.message?.content) {
                    const content = response.choices[0].message.content;
                    console.log(`   响应长度：${content.length} 字符`);
                    console.log(`   预览：${content.substring(0, 100)}...`);
                }
            } else {
                console.log(`❌ ${testName} 失败:`, body.substring(0, 200));
            }
        });
    });
    
    req.on('error', (e) => {
        console.error(`❌ ${testName} 错误:`, e.message);
    });
    
    req.on('timeout', () => {
        console.error(`⏱️ ${testName} 超时`);
        req.destroy();
    });
    
    req.write(dataString);
    req.end();
}
