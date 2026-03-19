/**
 * API 配置管理
 * 支持多 API 厂商快速切换（jiekou.ai + 阿里云百炼）
 */

// API 厂商配置
const API_PROVIDERS = {
    jiekou: {
        name: 'jiekou.ai',
        baseUrl: 'https://api.jiekou.ai/openai',
        models: {
            'claude-sonnet-3-5': { name: 'Claude Sonnet 3.5', cost: '$0.02-0.08/game', quality: 'high' },
            'claude-opus-4-6': { name: 'Claude Opus 4.6', cost: '$0.10-0.39/game', quality: 'highest' },
            'claude-sonnet-4-6': { name: 'Claude Sonnet 4.6', cost: '$0.02-0.08/game', quality: 'high' },
            'gpt-5.4': { name: 'GPT-5.4', cost: '$0.015/1K input, $0.06/1K output', quality: 'highest' },
            'gpt-5-mini': { name: 'GPT-5 Mini', cost: '$0.225/1M input, $1.8/1M output', quality: 'high' },
            'gemini-3.1-flash-lite-preview': { name: 'Gemini 3.1 Flash Lite', cost: '$0.25/1M input, $1.5/1M output', quality: 'medium' },
            'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', cost: '$0.27/1M input, $2.25/1M output', quality: 'high' },
            'xiaomi/mimo-v2-flash': { name: 'MiMo V2 Flash ⚡', cost: '$0.10/1M input, $0.50/1M output', quality: 'medium', speed: 'fast' }
        },
        defaultModel: 'gemini-2.5-flash'
    },
    aliyun: {
        name: '阿里云百炼',
        baseUrl: 'https://coding.dashscope.aliyuncs.com/v1',
        models: {
            'qwen-max': { name: 'Qwen Max', cost: '¥0.04/1K tokens', quality: 'high' },
            'qwen-plus': { name: 'Qwen3.5-Plus', cost: '¥0.02/1K tokens', quality: 'high' },
            'qwen-turbo': { name: 'Qwen Turbo', cost: '¥0.008/1K tokens', quality: 'basic' },
            'qwen-3.5-plus': { name: 'Qwen3.5-Plus', cost: '¥0.02/1K tokens', quality: 'high' }
        },
        defaultModel: 'qwen-plus'
    },
    openrouter: {
        name: 'OpenRouter',
        baseUrl: 'https://openrouter.ai/api/v1',
        models: {
            'xiaomi/mimo-v2-pro': { name: 'MiMo V2 Pro 🚀', cost: '$0.50/1M input, $2.00/1M output', quality: 'high' },
            'openrouter/hunter-alpha': { name: 'Hunter Alpha (已下架)', cost: 'N/A', quality: 'deprecated', deprecated: true }
        },
        defaultModel: 'xiaomi/mimo-v2-pro'
    }
};

// 当前配置（从服务器获取）
const API_CONFIG = {
    provider: 'jiekou',  // 当前厂商：jiekou | aliyun
    model: 'claude-sonnet-3-5',
    maxTokens: 8000,
    temperature: 0.7,
    timeout: 300000
};

// 获取当前厂商配置
function getCurrentProvider() {
    return API_PROVIDERS[API_CONFIG.provider];
}

// 获取当前模型信息
function getCurrentModelInfo() {
    const provider = getCurrentProvider();
    return provider.models[API_CONFIG.model] || { name: API_CONFIG.model, cost: 'unknown', quality: 'unknown' };
}

// 切换 API 厂商
function switchProvider(providerName) {
    if (!API_PROVIDERS[providerName]) {
        console.error(`❌ 不支持的 API 厂商：${providerName}`);
        return false;
    }
    
    const oldProvider = API_CONFIG.provider;
    API_CONFIG.provider = providerName;
    API_CONFIG.model = API_PROVIDERS[providerName].defaultModel;
    
    console.log(`🔄 已切换 API 厂商：${oldProvider} → ${providerName}`);
    console.log(`   当前模型：${API_CONFIG.model}`);
    
    return true;
}

// 切换模型
function switchModel(modelName) {
    const provider = getCurrentProvider();
    if (!provider.models[modelName]) {
        console.error(`❌ 不支持的模型：${modelName}`);
        return false;
    }
    
    const oldModel = API_CONFIG.model;
    API_CONFIG.model = modelName;
    
    console.log(`🔄 已切换模型：${oldModel} → ${modelName}`);
    console.log(`   成本：${provider.models[modelName].cost}`);
    
    return true;
}

// 从服务器获取最新配置
async function fetchAPIConfig() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (data.model) {
            API_CONFIG.model = data.model;
        }
        if (data.provider) {
            API_CONFIG.provider = data.provider;
        }
        
        const modelInfo = getCurrentModelInfo();
        console.log('✅ API 配置已加载:');
        console.log(`   厂商：${getCurrentProvider().name}`);
        console.log(`   模型：${modelInfo.name}`);
        console.log(`   成本：${modelInfo.cost}`);
        console.log(`   质量：${modelInfo.quality}`);
    } catch (error) {
        console.warn('⚠️ 无法获取 API 配置，使用默认值');
    }
}

// 页面加载时获取配置
fetchAPIConfig();

// 导出到全局
window.API_CONFIG = API_CONFIG;
window.API_PROVIDERS = API_PROVIDERS;
window.switchProvider = switchProvider;
window.switchModel = switchModel;
window.getCurrentProvider = getCurrentProvider;
window.getCurrentModelInfo = getCurrentModelInfo;

console.log('✅ API 配置版本：v14 (新增 MiMo V2 Flash - 超快速低成本)');
