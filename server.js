const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 加载环境变量
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
                    console.log(`  ${key} = ${value}`);
                }
            }
        });
        console.log('✅ 环境变量已加载');
    } else {
        console.warn('⚠️ 警告：未找到 .env 文件，使用默认配置');
    }
}

loadEnv();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const API_KEY_ALIYUN = process.env.API_KEY_ALIYUN;  // 阿里云 API Key
const API_KEY_OPENROUTER = process.env.API_KEY_OPENROUTER;  // OpenRouter API Key
const MODEL = process.env.MODEL || 'claude-sonnet-3-5';
const API_PROVIDER = process.env.API_PROVIDER || 'jiekou';  // jiekou | aliyun | openrouter
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT) || 120000;

if (!API_KEY && !API_KEY_OPENROUTER) {
    console.error('❌ 错误：API_KEY 或 API_KEY_OPENROUTER 未配置！请在 .env 文件中设置');
    process.exit(1);
}

// API 厂商配置
const API_PROVIDERS = {
    jiekou: {
        name: 'jiekou.ai',
        hostname: 'api.jiekou.ai',
        port: 443,
        path: '/openai/chat/completions',
        apiKey: API_KEY
    },
    aliyun: {
        name: '阿里云百炼',
        hostname: 'dashscope.aliyuncs.com',
        port: 443,
        path: '/compatible-mode/v1/chat/completions',
        apiKey: API_KEY_ALIYUN || API_KEY  //  fallback 到主 API Key
    },
    openrouter: {
        name: 'OpenRouter',
        hostname: 'openrouter.ai',
        port: 443,
        path: '/api/v1/chat/completions',
        apiKey: API_KEY_OPENROUTER || API_KEY  //  fallback 到主 API Key
    }
};

// 游戏历史管理
const GAME_HISTORY_DIR = path.join(__dirname, 'game-history');
if (!fs.existsSync(GAME_HISTORY_DIR)) {
    fs.mkdirSync(GAME_HISTORY_DIR, { recursive: true });
    console.log(`📁 创建游戏历史目录：game-history`);
}

function loadGameHistory(gameId) {
    const historyFile = path.join(GAME_HISTORY_DIR, `${gameId}.json`);
    if (fs.existsSync(historyFile)) {
        const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
        return history;
    }
    return null;
}

function saveGameHistory(gameId, data) {
    const historyFile = path.join(GAME_HISTORY_DIR, `${gameId}.json`);
    let history = {
        gameId: gameId,
        createdAt: new Date().toISOString(),
        messages: [],
        modifications: []
    };
    
    if (fs.existsSync(historyFile)) {
        history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    }
    
    history.messages.push({
        role: 'user',
        content: data.prompt,
        timestamp: new Date().toISOString()
    });
    
    history.messages.push({
        role: 'assistant',
        content: data.summary || '游戏代码已生成',
        timestamp: new Date().toISOString()
    });
    
    history.modifications.push({
        prompt: data.prompt,
        code: data.code,
        timestamp: new Date().toISOString(),
        model: data.model
    });
    
    // 保留最近 20 次修改
    if (history.modifications.length > 20) {
        history.modifications = history.modifications.slice(-20);
    }
    
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf8');
    return historyFile;
}

function generateGameId() {
    return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 固定 UI 规范（确保生成稳定性）
const FIXED_UI_SPEC = `
**固定 UI 规范（必须严格遵守）**：
1. Canvas 尺寸：width=360, height=640（9:16 竖屏）
2. 背景：深色渐变 linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)
3. 字体：PingFang SC, Microsoft YaHei, sans-serif
4. 圆角：12px（canvas 和 UI 元素）
5. 阴影：0 8px 32px rgba(0, 0, 0, 0.4)
6. 得分显示：顶部居中，白色文字，青色数值（#4fd1c5）
7. 整体风格：现代、简洁、深色主题

**固定代码结构（必须遵守）**：
1. 必须有 update(deltaTime) 函数 - 游戏逻辑更新
2. 必须有 render() 函数 - 游戏渲染
3. 必须有 handleInput(key, pressed) 函数 - 输入处理
4. 使用 requestAnimationFrame 游戏循环
5. 得分系统使用 localStorage 保存最高分
6. 游戏状态：menu, playing, paused, gameover

**累加修改规则（多轮对话时必须遵守）**：
1. 保留所有现有功能 - 绝不删除已有代码
2. 只添加新功能，不修改现有逻辑
3. 保持变量命名一致
4. 保持代码风格一致
5. 保持 UI 风格完全一致
6. 如果用户要求修改，先保留核心功能，再调整
`;

const currentProvider = API_PROVIDERS[API_PROVIDER] || API_PROVIDERS.jiekou;

/**
 * 🛠️ 创建 Godot 项目
 * 将 HTML5 游戏代码转换为 Godot 4.x 项目结构
 */
function createGodotProject(htmlCode, gameTitle, gameId) {
    const fs = require('fs');
    const path = require('path');
    
    // 创建临时目录
    const tempDir = path.join(__dirname, 'temp', 'godot-' + gameId);
    const scenesDir = path.join(tempDir, 'scenes');
    const scriptsDir = path.join(tempDir, 'scripts');
    const assetsDir = path.join(tempDir, 'assets');
    
    // 确保目录存在
    [tempDir, scenesDir, scriptsDir, assetsDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    
    // 1. 创建 project.godot
    const projectGodot = `; Engine configuration file.
; It's best edited using the editor UI and not directly,
; since the parameters that go here are not all obvious.
;
; Format:
;   [section] ; section goes between []
;   param=value ; assign values to parameters

config_version=5

[application]

config/name="${gameTitle}"
run/main_scene="res://scenes/main.tscn"
config/features=PackedStringArray("4.2", "Forward Plus")
config/icon="res://icon.svg"

[display]

window/size/viewport_width=360
window/size/viewport_height=640
window/stretch/mode="canvas_items"

[input]

move_up={
"deadzone": 0.5,
"events": [Object(InputEventKey)]
}
move_down={
"deadzone": 0.5,
"events": [Object(InputEventKey)]
}
move_left={
"deadzone": 0.5,
"events": [Object(InputEventKey)]
}
move_right={
"deadzone": 0.5,
"events": [Object(InputEventKey)]
}

[rendering]

renderer/rendering_method="forward_plus"
`;
    fs.writeFileSync(path.join(tempDir, 'project.godot'), projectGodot);
    
    // 2. 创建主场景 main.tscn
    const mainTscn = `[gd_scene load_steps=2 format=3 uid="uid://main"]

[ext_resource type="Script" path="res://scripts/game.gd" id="1_game"]

[node name="Main" type="Node2D"]
script = ExtResource("1_game")

[node name="Player" type="CharacterBody2D" parent="."]
position = Vector2(180, 320)

[node name="CollisionShape2D" type="CollisionShape2D" parent="Player"]

[node name="Sprite2D" type="Sprite2D" parent="Player"]

[node name="Camera2D" type="Camera2D" parent="Player"]
`;
    fs.writeFileSync(path.join(scenesDir, 'main.tscn'), mainTscn);
    
    // 3. 创建游戏脚本 game.gd
    const gameGd = `extends Node2D

# ${gameTitle} - Godot 4.x 版本
# 由 AI Game Platform 自动生成

var score = 0
var game_over = false

func _ready():
\tprint("${gameTitle} 已启动")
\tprint("HTML5 版本已转换为 Godot 版本")
\t
func _process(delta):
\tif game_over:
\t\treturn
\t
\t# 游戏逻辑在这里实现
\t# TODO: 从 HTML5 代码转换游戏逻辑
\t
func start_game():
\tgame_over = false
\tscore = 0
\tprint("游戏开始")
\t
func end_game():
\tgame_over = true
\tprint("游戏结束！得分：", score)
`;
    fs.writeFileSync(path.join(scriptsDir, 'game.gd'), gameGd);
    
    // 4. 创建玩家脚本 player.gd
    const playerGd = `extends CharacterBody2D

# 玩家控制脚本

const SPEED = 300.0

func _physics_process(delta):
\t# 获取输入方向
\tvar direction = Input.get_axis("move_left", "move_right")
\t
\t# 移动
\tvelocity.x = direction * SPEED
\t
\t# 应用移动
\tmove_and_slide()
`;
    fs.writeFileSync(path.join(scriptsDir, 'player.gd'), playerGd);
    
    // 5. 保存原始 HTML 代码（参考用）
    fs.writeFileSync(path.join(tempDir, 'original.html'), htmlCode);
    
    // 6. 创建转换说明
    const readme = `# ${gameTitle} - Godot 版本

## 🎮 游戏说明
此项目由 AI Game Platform 从 HTML5 版本自动转换而来。

## 📁 项目结构
\`\`\`
${gameTitle}_godot/
├── project.godot      # Godot 项目配置
├── scenes/
│   └── main.tscn      # 主场景
├── scripts/
│   ├── game.gd        # 游戏主逻辑
│   └── player.gd      # 玩家控制
├── assets/            # 资源文件（图片、音效等）
└── original.html      # 原始 HTML5 代码（参考）
\`\`\`

## 🚀 如何运行
1. 用 Godot 4.2+ 打开此项目
2. 点击 ▶️ 运行按钮
3. 游戏将在 360x640 窗口中运行

## 📝 下一步
1. 根据 \`original.html\` 中的游戏逻辑完善 \`game.gd\`
2. 添加精灵和动画
3. 添加音效和音乐
4. 完善游戏机制

## 🔗 相关资源
- [Godot 官方文档](https://docs.godotengine.org/)
- [Godot 4 入门教程](https://docs.godotengine.org/zh_CN/stable/getting_started/introduction/index.html)
`;
    fs.writeFileSync(path.join(tempDir, 'README.md'), readme);
    
    // 7. 创建 ZIP 文件
    const archiver = require('archiver');
    const zipPath = path.join(__dirname, 'api-responses', `${gameTitle}_godot_${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    archive.directory(tempDir, false);
    archive.finalize();
    
    // 等待 ZIP 创建完成
    return new Promise((resolve) => {
        output.on('close', () => {
            console.log(`✅ Godot 项目 ZIP 已创建：${zipPath}`);
            resolve({
                zipUrl: `/api-responses/${path.basename(zipPath)}`,
                files: ['project.godot', 'scenes/main.tscn', 'scripts/game.gd', 'scripts/player.gd', 'README.md']
            });
        });
        
        archive.on('error', (err) => {
            console.error('❌ ZIP 创建失败:', err);
            resolve({
                zipUrl: null,
                files: [],
                error: err.message
            });
        });
    });
}

console.log('');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║        🎮 AI 游戏生成器 - 本地服务器                     ║');
console.log('╠══════════════════════════════════════════════════════════╣');
console.log(`║  地址：http://localhost:${PORT}                           ║`);
console.log(`║  API: ${currentProvider.name.padEnd(35)}║`);
console.log(`║  模型：${MODEL.padEnd(30)}║`);
console.log(`║  超时：${(API_TIMEOUT / 1000).toFixed(0)}s                                ║`);
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

http.createServer((req, res) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${req.method} ${req.url}`);

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API 代理 - 生成游戏
    if (req.url === '/api/generate' && req.method === 'POST') {
        let body = '';
        let responseSent = false;
        
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            console.log(`  📝 收到请求 (${body.length} bytes)`);
            
            try {
                const requestData = JSON.parse(body);
                const useProvider = requestData.provider || API_PROVIDER;
                const provider = API_PROVIDERS[useProvider] || API_PROVIDERS.jiekou;
                const useModel = requestData.model || MODEL;
                
                // GPT-5 Mini 有特殊参数限制
                const isGPT5Mini = useModel === 'gpt-5-mini';
                
                // 构建增强的提示词（添加固定 UI 规范和历史记录）
                const isModification = requestData.isModification || false;
                const gameId = requestData.gameId;
                
                // 🆕 优先使用前端传来的完整 messages（搭积木系统）
                // 如果前端已经构建了完整历史，直接使用
                let messages = requestData.messages;
                let gameContext = '';
                let conversationHistory = [];  // 🆕 初始化变量
                
                // 如果前端没传 messages 或 messages 太短，才从文件加载历史
                if (!messages || messages.length < 3) {
                    console.log(`  ⚠️ 前端 messages 不完整 (${messages?.length || 0}条)，从文件加载历史`);
                    if (isModification && gameId) {
                        const history = loadGameHistory(gameId);
                        if (history) {
                            conversationHistory = history.messages.slice(-20);
                            gameContext = `这是第 ${history.modifications ? history.modifications.length + 1 : 2} 次修改。`;
                        }
                    }
                    
                    // 构建系统提示词
                    const systemPrompt = isModification
                        ? `你是专业的游戏开发 AI 助手。${FIXED_UI_SPEC}
                        
当前任务：在现有游戏基础上进行修改。
${gameContext}
重要：保留所有现有功能，只添加/修改用户要求的功能。
保持 UI 风格、代码结构、变量命名完全一致。`
                        : `你是专业的游戏开发 AI 助手。${FIXED_UI_SPEC}
                        
当前任务：创建新游戏。
请严格按照上述规范创建游戏，确保 UI 风格和代码结构符合标准。`;

                    const userMessage = requestData.messages[requestData.messages.length - 1].content;
                    
                    // 合并历史消息
                    messages = [
                        { role: 'system', content: systemPrompt },
                        ...conversationHistory,
                        { role: 'user', content: userMessage }
                    ];
                } else {
                    // ✅ 前端已经构建了完整的搭积木历史，只添加 system prompt
                    console.log(`  ✅ 使用前端传来的完整 messages (${messages.length}条)`);
                    const systemPrompt = isModification
                        ? `你是专业的游戏开发 AI 助手。${FIXED_UI_SPEC}

🔒 游戏类型锁定：
- 这是第 ${gameId ? '多次' : '1'} 次修改
- 绝对保留所有已有功能
- 只添加/修改用户要求的功能

当前任务：在现有游戏基础上进行修改。
重要：保留所有现有功能，只添加/修改用户要求的功能。`
                        : `你是专业的游戏开发 AI 助手。${FIXED_UI_SPEC}

当前任务：创建新游戏。
请严格按照上述规范创建游戏，确保 UI 风格和代码结构符合标准。`;
                    
                    // 替换或添加 system prompt
                    if (messages[0]?.role === 'system') {
                        messages[0].content = systemPrompt;
                    } else {
                        messages.unshift({ role: 'system', content: systemPrompt });
                    }
                }
                
                const apiData = {
                    model: useModel,
                    messages: messages,
                    max_tokens: requestData.max_tokens || 8000
                };
                
                // GPT-5 Mini 不支持自定义 temperature
                if (!isGPT5Mini) {
                    apiData.temperature = requestData.temperature || 0.7;
                }
                
                const apiDataString = JSON.stringify(apiData);

                console.log(`  📤 发送请求到 ${provider.name}...`);
                console.log(`  厂商：${useProvider}`);
                console.log(`  模型：${useModel}`);
                console.log(`  消息数：${requestData.messages?.length || 0}`);
                console.log(`  超时：${API_TIMEOUT / 1000}s`);

                const options = {
                    hostname: provider.hostname,
                    port: provider.port,
                    path: provider.path,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${provider.apiKey}`,
                        'Content-Length': Buffer.byteLength(apiDataString),
                        // OpenRouter 需要额外的头
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'AI Game Generator',
                        ...(useProvider === 'openrouter' ? {
                            'HTTP-Referer': 'http://localhost:3000',
                            'X-Title': 'AI Game Generator'
                        } : {})
                    },
                    timeout: API_TIMEOUT
                };

                // 服务器请求超时保护（防止卡死）
                const serverTimeout = API_TIMEOUT + 30000; // API 超时 +30 秒缓冲

                const startTime = Date.now();
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                
                console.log(`  ⏱️ 开始请求，超时保护：${serverTimeout / 1000}s`);
                
                const proxyReq = https.request(options, (proxyRes) => {
                    const duration = Date.now() - startTime;
                    console.log(`  📥 API 响应：${proxyRes.statusCode} (${duration}ms)`);
                    console.log(`  📋 响应头：`, JSON.stringify(proxyRes.headers, null, 2));
                    
                    let apiResponse = '';
                    proxyRes.on('data', chunk => apiResponse += chunk);
                    proxyRes.on('end', () => {
                        if (responseSent) return;
                        responseSent = true;
                        
                        if (proxyRes.statusCode === 200) {
                            console.log(`  ✅ 成功！响应大小：${apiResponse.length} bytes`);
                            
                            // 保存 API 响应到文件
                            try {
                                const responseDir = path.join(__dirname, 'api-responses');
                                if (!fs.existsSync(responseDir)) {
                                    fs.mkdirSync(responseDir, { recursive: true });
                                    console.log(`  📁 创建目录：api-responses`);
                                }
                                
                                const responseData = JSON.parse(apiResponse);
                                
                                // 提取 HTML 代码（去除 markdown）
                                let rawGameCode = responseData.choices?.[0]?.message?.content || '';
                                let extractedGameCode = rawGameCode;
                                
                                if (rawGameCode.includes('```html')) {
                                    const start = rawGameCode.indexOf('```html') + 7;
                                    const end = rawGameCode.indexOf('```', start);
                                    if (end !== -1) extractedGameCode = rawGameCode.substring(start, end).trim();
                                } else if (rawGameCode.includes('```')) {
                                    const start = rawGameCode.indexOf('```') + 3;
                                    const end = rawGameCode.indexOf('```', start);
                                    if (end !== -1) extractedGameCode = rawGameCode.substring(start, end).trim();
                                }
                                
                                const logData = {
                                    timestamp: new Date().toISOString(),
                                    provider: useProvider,
                                    model: responseData.model || useModel,
                                    messagesCount: messages?.length || 0,
                                    messages: messages || [],  // 记录实际发送的消息
                                    prompt: requestData.messages?.[0]?.content || '',
                                    gameCode: extractedGameCode,  // 保存提取后的 HTML
                                    rawGameCode: rawGameCode,  // 保留原始响应
                                    rawResponse: responseData,
                                    usage: responseData.usage || {},
                                    duration: duration,
                                    isModification: isModification,
                                    gameId: gameId
                                };
                                
                                // 保存 JSON 文件
                                const jsonFile = path.join(responseDir, `response-${timestamp}.json`);
                                fs.writeFileSync(jsonFile, JSON.stringify(logData, null, 2), 'utf8');
                                console.log(`  💾 已保存响应：${jsonFile}`);
                                
                                // 保存游戏历史（如果是新游戏或修改）
                                let currentGameId = gameId;
                                if (!currentGameId) {
                                    currentGameId = generateGameId();
                                    console.log(`  🆕 创建新游戏 ID: ${currentGameId}`);
                                }
                                
                                const historyFile = saveGameHistory(currentGameId, {
                                    prompt: requestData.messages?.[requestData.messages.length - 1]?.content || '',
                                    code: extractedGameCode,
                                    summary: `游戏已${isModification ? '修改' : '创建'}`,
                                    model: useModel
                                });
                                console.log(`  📝 已保存游戏历史：${historyFile}`);
                                
                                // 在响应中返回游戏 ID
                                responseData.gameId = currentGameId;
                                
                                // 保存 HTML 预览文件
                                const htmlCode = logData.gameCode;  // 已经提取过了
                                
                                const htmlFile = path.join(responseDir, `game-${timestamp}.html`);
                                fs.writeFileSync(htmlFile, htmlCode, 'utf8');
                                console.log(`  🎮 已保存游戏：${htmlFile}`);
                            } catch (saveErr) {
                                console.error(`  ⚠️ 保存响应失败：${saveErr.message}`);
                            }
                        } else {
                            console.log(`  ❌ 失败：${proxyRes.statusCode}`);
                            console.log(`  响应：${apiResponse.substring(0, 200)}`);
                        }
                        
                        res.writeHead(proxyRes.statusCode, {'Content-Type': 'application/json'});
                        res.end(apiResponse);
                    });
                });

                proxyReq.on('error', (e) => {
                    if (responseSent) return;
                    responseSent = true;
                    
                    console.error(`  ❌ 代理错误：${e.message} (${e.code})`);
                    res.writeHead(502, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        error: 'API 请求失败',
                        message: e.message,
                        code: e.code,
                        provider: useProvider
                    }));
                });

                proxyReq.on('timeout', () => {
                    if (responseSent) return;
                    responseSent = true;
                    
                    console.error(`  ⏱️ 请求超时 (${Date.now() - startTime}ms)`);
                    proxyReq.destroy();
                    res.writeHead(504, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        error: 'API 请求超时',
                        message: '服务器响应时间过长，请重试或检查网络连接',
                        duration: Date.now() - startTime,
                        provider: useProvider
                    }));
                });

                // 服务器级别超时保护（防止整个服务卡死）
                const serverTimer = setTimeout(() => {
                    if (responseSent) return;
                    responseSent = true;
                    
                    console.error(`  ⚠️ 服务器超时 (${Date.now() - startTime}ms) - 强制终止请求`);
                    proxyReq.destroy();
                    res.writeHead(504, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        error: '服务器超时',
                        message: '请求处理时间过长，已自动终止',
                        duration: Date.now() - startTime,
                        provider: useProvider
                    }));
                }, serverTimeout);

                proxyReq.on('close', () => clearTimeout(serverTimer));
                proxyReq.on('end', () => clearTimeout(serverTimer));

                proxyReq.write(apiDataString);
                proxyReq.end();
                console.log(`  → 请求已发送`);
                
            } catch (e) {
                if (responseSent) return;
                responseSent = true;
                
                console.error(`  ❌ 解析错误：${e.message}`);
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: e.message}));
            }
        });
        return;
    }

    // Godot 导出 API
    if (req.url === '/api/export-godot' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { htmlCode, gameTitle, gameId } = data;
                
                console.log(`\n🛠️ 导出 Godot 项目：${gameTitle}`);
                console.log(`   HTML 代码长度：${htmlCode?.length || 0}`);
                
                // 创建 Godot 项目结构
                const godotProject = createGodotProject(htmlCode, gameTitle, gameId);
                
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    success: true,
                    message: 'Godot 项目已生成',
                    zipUrl: godotProject.zipUrl,
                    files: godotProject.files
                }));
                
            } catch (e) {
                console.error(`❌ Godot 导出失败：${e.message}`);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    error: 'Godot 导出失败',
                    message: e.message
                }));
            }
        });
        return;
    }

    // 健康检查
    if (req.url === '/api/health') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            status: 'ok',
            service: 'AI Game Generator',
            provider: API_PROVIDER,
            providerName: currentProvider.name,
            model: MODEL,
            availableProviders: Object.keys(API_PROVIDERS),
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // 游戏历史查询
    if (req.url.startsWith('/api/game-history/') && req.method === 'GET') {
        const gameId = req.url.split('/').pop();
        if (gameId) {
            const history = loadGameHistory(gameId);
            if (history) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(history));
            } else {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: '游戏历史不存在'}));
            }
        } else {
            // 列出所有游戏历史
            const games = fs.readdirSync(GAME_HISTORY_DIR)
                .filter(f => f.endsWith('.json'))
                .map(f => {
                    const history = JSON.parse(fs.readFileSync(path.join(GAME_HISTORY_DIR, f), 'utf8'));
                    return {
                        gameId: history.gameId,
                        createdAt: history.createdAt,
                        modifications: history.modifications ? history.modifications.length : 0,
                        lastPrompt: history.modifications?.[history.modifications.length - 1]?.prompt || 'N/A'
                    };
                });
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(games));
        }
        return;
    }

    // 静态文件
    let filePath = req.url === '/' ? '/create.html' : req.url;
    filePath = path.join(__dirname, filePath.split('?')[0]);

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found: ' + filePath);
        } else {
            res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
            res.end(content);
        }
    });
}).listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ 服务器已启动`);
    console.log(`🌐 打开：http://localhost:${PORT}/create.html`);
    console.log(`🔍 测试：http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('📖 使用说明：');
    console.log('1. 保持此窗口打开');
    console.log('2. 访问上述网址开始使用');
    console.log('3. 按 Ctrl+C 停止服务器');
    console.log('');
});
