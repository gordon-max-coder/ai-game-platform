const https = require('https');

const API_KEY = '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';

// 获取 OpenRouter 支持的模型列表
const options = {
    hostname: 'openrouter.ai',
    port: 443,
    path: '/api/v1/models',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Game Generator'
    }
};

console.log('🔍 检查 OpenRouter 支持的模型...\n');

const req = https.request(options, (res) => {
    console.log(`📥 状态：${res.statusCode}\n`);
    
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const response = JSON.parse(body);
            const models = response.data || [];
            
            console.log(`✅ 找到 ${models.length} 个模型\n`);
            
            // 查找 hunter-alpha
            const hunterAlpha = models.find(m => m.id.includes('hunter') || m.id.includes('alpha'));
            
            if (hunterAlpha) {
                console.log('✅ Hunter Alpha 可用!');
                console.log(`   ID: ${hunterAlpha.id}`);
                console.log(`   名称：${hunterAlpha.name}`);
                console.log(`   上下文：${hunterAlpha.context_length || 'N/A'} tokens`);
                console.log(`   定价：$${hunterAlpha.pricing?.prompt?.amount || 'N/A'}/1K input, $${hunterAlpha.pricing?.completion?.amount || 'N/A'}/1K output`);
            } else {
                console.log('❌ Hunter Alpha 不可用');
                console.log('\n可用的模型:');
                models.slice(0, 20).forEach(m => {
                    console.log(`   - ${m.id}`);
                });
            }
        } else {
            console.log('❌ 获取模型列表失败:', body.substring(0, 200));
        }
    });
});

req.on('error', (e) => console.error('❌ 错误:', e.message));
req.on('timeout', () => {
    console.error('⏱️ 请求超时');
    req.destroy();
});
req.end();
