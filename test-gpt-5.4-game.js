const https = require('https');

const API_KEY = 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8';
const model = 'gpt-5.4';

const prompt = `请创建一个完整的 HTML5 游戏。游戏描述：创建一个贪食蛇游戏。
                    
重要技术要求：
1. 单个 HTML 文件
2. 使用 Canvas API
3. Canvas 尺寸必须为 360x640 像素（9:16 竖屏比例）
4. 在 JavaScript 中设置：canvas.width = 360; canvas.height = 640;
5. 在 CSS 中设置：canvas { max-width: 100%; height: auto; display: block; margin: 0 auto; }
6. 包含完整游戏循环
7. 有得分系统
8. 确保有趣可玩

只返回 HTML 代码，不要其他说明。`;

const data = JSON.stringify({
    model: model,
    messages: [
        { 
            role: 'system', 
            content: '你是专业的游戏开发 AI 助手，擅长创建 HTML5 游戏。' 
        },
        { 
            role: 'user', 
            content: prompt 
        }
    ],
    max_tokens: 16000,
    temperature: 0.7
});

console.log('🚀 测试 GPT-5.4 游戏生成');
console.log('========================');
console.log(`模型：${model}`);
console.log(`时间：${new Date().toISOString()}`);
console.log('发送请求...\n');

const startTime = Date.now();

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

const req = https.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    
    res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`⏱️  响应时间：${duration}ms`);
        console.log(`📊 状态码：${res.statusCode}`);
        
        try {
            const response = JSON.parse(responseData);
            
            if (response.error) {
                console.log(`\n❌ 错误：${response.error.message}`);
                console.log(`   类型：${response.error.type}`);
                console.log(`   代码：${response.error.code}`);
                process.exit(1);
            }
            
            if (response.choices && response.choices[0]) {
                const content = response.choices[0].message.content;
                const usage = response.usage;
                
                console.log('\n✅ 测试成功！');
                console.log('========================');
                console.log(`📝 响应长度：${content.length} 字符`);
                console.log(`📊 Token 使用:`);
                console.log(`   - 输入：${usage.prompt_tokens} tokens`);
                console.log(`   - 输出：${usage.completion_tokens} tokens`);
                console.log(`   - 总计：${usage.total_tokens} tokens`);
                
                // 估算成本 (假设 $0.015/1K input, $0.06/1K output)
                const inputCost = (usage.prompt_tokens / 1000) * 0.015;
                const outputCost = (usage.completion_tokens / 1000) * 0.06;
                const totalCost = inputCost + outputCost;
                
                console.log(`💰 估算成本:`);
                console.log(`   - 输入：$${inputCost.toFixed(6)}`);
                console.log(`   - 输出：$${outputCost.toFixed(6)}`);
                console.log(`   - 总计：$${totalCost.toFixed(6)}`);
                
                // 检查代码质量
                const hasHtml = content.includes('<html') || content.includes('<!DOCTYPE');
                const hasCanvas = content.includes('<canvas');
                const hasScript = content.includes('<script');
                
                console.log('\n🔍 代码检查:');
                console.log(`   - HTML 结构：${hasHtml ? '✅' : '❌'}`);
                console.log(`   - Canvas 元素：${hasCanvas ? '✅' : '❌'}`);
                console.log(`   - JavaScript：${hasScript ? '✅' : '❌'}`);
                
                // 提取 HTML（去除 markdown）
                let htmlCode = content;
                if (content.includes('```html')) {
                    const start = content.indexOf('```html') + 7;
                    const end = content.indexOf('```', start);
                    if (end !== -1) {
                        htmlCode = content.substring(start, end).trim();
                        console.log(`\n📄 提取后代码长度：${htmlCode.length} 字符`);
                    }
                }
                
                // 保存代码到文件
                const fs = require('fs');
                const filename = `test-gpt54-game-${new Date().toISOString().replace(/[:.]/g, '-')}.html`;
                fs.writeFileSync(filename, htmlCode);
                console.log(`💾 代码已保存到：${filename}`);
                
                console.log('\n📝 代码预览 (前 200 字符):');
                console.log('---');
                console.log(htmlCode.substring(0, 200));
                console.log('---\n');
                
            } else {
                console.log('\n❌ 响应格式异常:');
                console.log(JSON.stringify(response, null, 2));
                process.exit(1);
            }
        } catch (e) {
            console.log('\n❌ 解析响应失败:', e.message);
            console.log('原始响应:', responseData.substring(0, 500));
            process.exit(1);
        }
    });
});

req.on('error', (error) => {
    console.error('\n❌ 请求失败:', error.message);
    process.exit(1);
});

req.write(data);
req.end();
