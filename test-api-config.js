/**
 * 测试 API 配置
 * 验证 .env 文件和服务端配置是否正确
 */

const fs = require('fs');
const path = require('path');

console.log('');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║        ✅ 检查 API 配置                                    ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

// 检查 .env 文件
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ 错误：未找到 .env 文件');
    process.exit(1);
}

console.log('✅ .env 文件存在');
console.log('');

// 读取并解析 .env
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
            const key = trimmed.substring(0, eqIndex).trim();
            const value = trimmed.substring(eqIndex + 1).trim();
            envVars[key] = value;
        }
    }
});

// 显示配置
console.log('当前配置:');
console.log('────────────────────────────────────────');
console.log(`API_PROVIDER: ${envVars.API_PROVIDER || 'jiekou (默认)'}`);
console.log(`MODEL: ${envVars.MODEL || 'claude-sonnet-3-5 (默认)'}`);
console.log(`PORT: ${envVars.PORT || '3000 (默认)'}`);
console.log(`API_TIMEOUT: ${envVars.API_TIMEOUT || '120000 (默认)'}`);
console.log('────────────────────────────────────────');
console.log('');

// 检查 API Key
if (!envVars.API_KEY) {
    console.error('❌ 错误：API_KEY 未配置');
    process.exit(1);
}

if (!envVars.API_KEY.startsWith('sk-')) {
    console.error('❌ 错误：API_KEY 格式不正确 (应该以 sk- 开头)');
    process.exit(1);
}

console.log('✅ API_KEY 已配置');

// 检查阿里云 API Key
if (envVars.API_KEY_ALIYUN) {
    console.log('✅ API_KEY_ALIYUN 已配置');
} else {
    console.log('⚠️  API_KEY_ALIYUN 未配置 (使用阿里云时需要)');
}

console.log('');

// 显示支持的厂商和模型
console.log('支持的 API 厂商:');
console.log('────────────────────────────────────────');
console.log('1. jiekou.ai');
console.log('   - claude-sonnet-3-5 (推荐，$0.02-0.08/game)');
console.log('   - claude-opus-4-6 (最高质量，$0.10-0.39/game)');
console.log('   - deepseek-chat (最便宜，$0.01/game)');
console.log('');
console.log('2. 阿里云百炼');
console.log('   - qwen-max (最高质量，¥0.04/1K tokens)');
console.log('   - qwen-plus (中等质量，¥0.02/1K tokens)');
console.log('   - qwen-turbo (快速响应，¥0.008/1K tokens)');
console.log('────────────────────────────────────────');
console.log('');

// 验证当前配置
const provider = envVars.API_PROVIDER || 'jiekou';
const model = envVars.MODEL || 'claude-sonnet-3-5';

console.log('当前选择:');
console.log(`  厂商：${provider}`);
console.log(`  模型：${model}`);
console.log('');

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║        ✅ 配置检查完成                                    ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');
console.log('启动服务器：start-server.bat');
console.log('切换厂商：switch-api-provider.bat');
console.log('');
