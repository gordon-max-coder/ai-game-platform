/**
 * GameAI - 创作页面逻辑（游戏 ID 核心架构）
 * 所有操作都基于 currentGameId
 */

const API_URL = '/api/generate';

// 核心状态 - 所有操作都基于 currentGameId
let currentGameId = null;      // 当前游戏 ID（创建时生成，编辑时加载）
let currentGameCode = null;    // 当前游戏代码
let currentVersion = 1;        // 当前版本

// 🧱 搭积木式上下文记忆系统
let conversationHistory = [];  // 对话历史（积木堆）
const MAX_HISTORY = 40;        // 最多保留 40 条

// 🏗️ 游戏构建历史 - 完整记录每次修改的代码和描述
let gameBuildHistory = [];     // 游戏构建历史 [{userReq, aiCode, timestamp}]
let originalGameType = null;   // 原始游戏类型（如"贪食蛇"）- 永不改变

// DOM 元素
const elements = {};

// ==================== 工具函数 ====================

/**
 * 🍞 显示 Toast 提示
 */
function showToast(message, duration = 3000) {
    // 移除已存在的 Toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新的 Toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

/**
 * 🎮 从用户提示词中提取游戏类型
 * 用于搭积木系统 - 确保游戏类型在多次修改后不会改变
 */
function extractGameType(prompt) {
    const gameKeywords = {
        '贪食蛇': ['贪食蛇', '贪吃蛇', '蛇', 'snake'],
        '打砖块': ['打砖块', '砖块', '打方块', 'breakout', 'brick'],
        '飞机大战': ['飞机大战', '飞机', '射击', 'shooter', 'airplane', '飞行'],
        '俄罗斯方块': ['俄罗斯方块', '方块', 'tetris', '俄罗'],
        '弹球': ['弹球', '弹珠', 'pinball'],
        '扫雷': ['扫雷', 'mine', '扫雷'],
        '五子棋': ['五子棋', '围棋', 'gomoku', '五子'],
        '跑酷': ['跑酷', 'run', '跑'],
        '迷宫': ['迷宫', 'maze'],
        '连连看': ['连连看', '连连', 'match'],
        '打地鼠': ['打地鼠', '地鼠', 'whack'],
        '2048': ['2048', '数字方块'],
        '跳一跳': ['跳一跳', '跳跃', 'jump'],
        '消消乐': ['消消乐', '消除', 'candy', '三消'],
        '井字棋': ['井字棋', 'tic', '井字'],
    };
    
    const promptLower = prompt.toLowerCase();
    
    for (const [typeName, keywords] of Object.entries(gameKeywords)) {
        for (const keyword of keywords) {
            if (promptLower.includes(keyword.toLowerCase())) {
                return typeName;
            }
        }
    }
    
    return null;  // 未识别到特定游戏类型
}

/**
 * 🧱 从游戏代码中提取已实现的功能清单
 * 用于搭积木式上下文记忆 - 让 AI 知道之前实现了什么
 */
function extractImplementedFeatures(code) {
    if (!code) return '（无代码）';
    
    const features = [];
    
    // 检测常见游戏功能
    const featureChecks = [
        // 游戏模式
        { pattern: /two.?player|双人|p2|player2|player.?2/i, name: '双人模式' },
        { pattern: /ai.?opponent|ai.?对手|computer|机器人|bot|人工智能/i, name: 'AI 对手' },
        { pattern: /single.?player|单人/i, name: '单人模式' },
        
        // 游戏机制
        { pattern: /power.?up|道具|技能|bonus/i, name: '道具/技能系统' },
        { pattern: /level|关卡|stage|wave/i, name: '关卡系统' },
        { pattern: /health|生命|hp|血量|lives/i, name: '生命值系统' },
        { pattern: /combo|连击/i, name: '连击系统' },
        { pattern: /timer|计时|时间|countdown|倒计时/i, name: '计时系统' },
        
        // 视觉效果
        { pattern: /particle|粒子|特效|effect/i, name: '粒子特效' },
        { pattern: /animation|动画|animate/i, name: '动画效果' },
        { pattern: /shake|震动|screen.?shake/i, name: '屏幕震动' },
        { pattern: /flash|闪烁|blink/i, name: '闪烁效果' },
        
        // 音效
        { pattern: /sound|音频|音效|audio|sfx|music|背景音乐/i, name: '音效/音乐' },
        { pattern: /oscillator|AudioContext|playSound/i, name: '程序化音效' },
        
        // 控制
        { pattern: /touch|触摸|mobile|手机|gesture|手势/i, name: '触屏控制' },
        { pattern: /keyboard|键盘|keydown|keyup/i, name: '键盘控制' },
        { pattern: /joystick|摇杆|虚拟摇杆/i, name: '虚拟摇杆' },
        
        // UI
        { pattern: /leaderboard|排行榜|高分榜/i, name: '排行榜' },
        { pattern: /pause|暂停/i, name: '暂停功能' },
        { pattern: /restart|重新开始/i, name: '重新开始' },
        { pattern: /start.?screen|开始界面|主菜单|menu/i, name: '开始界面' },
        { pattern: /game.?over|结束|gameover/i, name: '游戏结束界面' },
        
        // 特殊功能
        { pattern: /save|存档|localStorage/i, name: '存档功能' },
        { pattern: /difficulty|难度/i, name: '难度选择' },
        { pattern: /obstacle|障碍|barrier/i, name: '障碍物系统' },
        { pattern: /enemy|敌人|monster|怪/i, name: '敌人系统' },
        { pattern: /weapon|武器|gun|枪|bullet|子弹|射击/i, name: '武器/射击系统' },
    ];
    
    featureChecks.forEach(({ pattern, name }) => {
        if (pattern.test(code)) {
            features.push(name);
        }
    });
    
    if (features.length === 0) {
        features.push('基础游戏功能');
    }
    
    return features.join('、');
}

// 加载默认模型
function loadDefaultModel() {
    // 1. 优先使用用户上次选择的
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel && elements.modelSelect) {
        const options = Array.from(elements.modelSelect.options);
        const exists = options.some(opt => opt.value === savedModel);
        if (exists) {
            elements.modelSelect.value = savedModel;
            console.log('🤖 使用上次选择的模型:', savedModel);
            return;
        }
    }
    
    // 2. 使用 API 配置中的默认模型
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG.model) {
        const configModel = API_CONFIG.model;
        if (elements.modelSelect) {
            const options = Array.from(elements.modelSelect.options);
            const exists = options.some(opt => opt.value === configModel);
            if (exists) {
                elements.modelSelect.value = configModel;
                console.log('🤖 从 API 配置加载默认模型:', configModel);
                return;
            }
        }
    }
    
    // 3. 默认使用 gemini-2.5-flash
    if (elements.modelSelect) {
        elements.modelSelect.value = 'gemini-2.5-flash';
        console.log('🤖 使用默认模型：gemini-2.5-flash');
    }
}

// ==================== 初始化 ====================

function init() {
    console.log('🎮 初始化创作页面...');
    cacheElements();
    bindEvents();
    
    // 1. 先尝试从 URL 加载
    let loaded = loadGameFromURL();
    
    // 2. 如果 URL 没有，尝试从 sessionStorage 恢复（页面刷新场景）
    if (!loaded) {
        loaded = recoverFromSessionStorage();
    }
    
    // 3. 根据是否有游戏切换布局模式
    if (loaded) {
        // 编辑模式：显示三栏布局
        setLayoutMode('edit');
        updateNavActive('edit');
    } else {
        // 创建模式：只显示左侧对话区，全屏
        setLayoutMode('create');
        updateNavActive('create');
        showWelcomeMessage();
    }
    
    console.log('✅ 初始化完成，currentGameId:', currentGameId, '布局模式:', loaded ? '编辑' : '创建');
}

// 设置布局模式
function setLayoutMode(mode) {
    const workspace = document.querySelector('.create-workspace');
    if (!workspace) return;
    
    if (mode === 'edit') {
        // 编辑模式：显示三栏布局
        workspace.classList.remove('create-mode');
        workspace.classList.add('edit-mode');
        
        // 显示预览区和参数区
        const previewSection = document.querySelector('.preview-section');
        const propertiesSection = document.querySelector('.properties-section');
        if (previewSection) previewSection.style.display = 'flex';
        if (propertiesSection) propertiesSection.style.display = 'flex';
        
        console.log('📐 布局模式：编辑模式 (三栏)');
    } else {
        // 创建模式：只显示左侧，全屏
        workspace.classList.remove('edit-mode');
        workspace.classList.add('create-mode');
        
        // 隐藏预览区和参数区
        const previewSection = document.querySelector('.preview-section');
        const propertiesSection = document.querySelector('.properties-section');
        if (previewSection) previewSection.style.display = 'none';
        if (propertiesSection) propertiesSection.style.display = 'none';
        
        console.log('📐 布局模式：创建模式 (全屏对话)');
    }
}

// 从 sessionStorage 恢复状态（页面刷新）
function recoverFromSessionStorage() {
    const savedGameId = sessionStorage.getItem('currentGameId');
    const savedGameCode = sessionStorage.getItem('currentGameCode');
    const savedVersion = sessionStorage.getItem('currentVersion');
    const savedBuildHistory = sessionStorage.getItem('gameBuildHistory');  // 🆕
    const savedOriginalGameType = sessionStorage.getItem('originalGameType');  // 🆕
    
    if (!savedGameId || !savedGameCode) {
        return false;
    }
    
    console.log('🔄 从 sessionStorage 恢复:', savedGameId);
    
    currentGameId = savedGameId;
    currentGameCode = savedGameCode;
    currentVersion = parseInt(savedVersion) || 1;
    
    // 🆕 恢复构建历史和游戏类型
    if (savedBuildHistory) {
        gameBuildHistory = JSON.parse(savedBuildHistory);
        console.log('🏗️ 恢复构建历史:', gameBuildHistory.length, '条');
    }
    if (savedOriginalGameType) {
        originalGameType = savedOriginalGameType;
        console.log('🎮 恢复游戏类型:', originalGameType);
    }
    
    // 显示游戏
    showGamePreview(currentGameCode);
    
    // 加载对话历史
    loadConversationHistory(currentGameId);
    
    // 分析游戏参数
    if (window.GameAnalyzer) {
        GameAnalyzer.analyze(currentGameCode, currentGameId);
        GameAnalyzer.render('propertiesContent');
    }
    
    // 页面刷新恢复，不更新 URL
    // updateURLWithGameId(currentGameId);  // 不需要
    
    return true;
}

function cacheElements() {
    elements.promptInput = document.getElementById('promptInput');
    elements.sendBtn = document.getElementById('sendBtn');
    elements.conversationMessages = document.getElementById('conversationMessages');
    elements.gameFrame = document.getElementById('gameFrame');
    elements.previewContent = document.getElementById('previewContent');
    elements.previewActions = document.getElementById('previewActions');
    elements.modifyInputSection = document.getElementById('modifyInputSection');
    elements.modifyInput = document.getElementById('modifyInput');
    elements.modifySendBtn = document.getElementById('modifySendBtn');
    elements.cancelModifyBtn = document.getElementById('cancelModifyBtn');
    elements.playBtn = document.getElementById('playBtn');
    elements.modelSelect = document.getElementById('modelSelect');
    
    console.log('✅ DOM 元素缓存完成');
}

function bindEvents() {
    elements.promptInput?.addEventListener('input', () => {
        elements.sendBtn.disabled = !elements.promptInput.value.trim();
    });
    
    elements.promptInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!elements.sendBtn.disabled) generateGame();
        }
    });
    
    elements.sendBtn?.addEventListener('click', generateGame);
    elements.playBtn?.addEventListener('click', playGame);
    document.getElementById('codeBtn')?.addEventListener('click', showCode);
    document.getElementById('editorBtn')?.addEventListener('click', openEditor);
    document.getElementById('godotBtn')?.addEventListener('click', exportToGodot);
    document.getElementById('modifyBtn')?.addEventListener('click', enterModifyMode);
    
    elements.modifyInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!elements.modifySendBtn.disabled) modifyGame();
        }
    });
    
    elements.modifySendBtn?.addEventListener('click', modifyGame);
    elements.cancelModifyBtn?.addEventListener('click', cancelModify);
    
    // 模型选择变化时保存
    if (elements.modelSelect) {
        elements.modelSelect.addEventListener('change', () => {
            const model = elements.modelSelect.value;
            localStorage.setItem('selectedModel', model);
            
            // ✅ 自动判断并切换 API 厂商
            let provider = 'jiekou';  // 默认 jiekou
            if (model.includes('xiaomi/mimo-v2-pro') || model.includes('openrouter/')) {
                provider = 'openrouter';
            }
            localStorage.setItem('selectedProvider', provider);
            
            console.log(`🤖 模型已切换：${model} (${provider})`);
        });
    }
    
    // 监听页面刷新/关闭，保存状态
    window.addEventListener('beforeunload', savePageState);
    
    // 监听浏览器的后退/前进按钮
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.gameId) {
            loadGameFromURL();
            setLayoutMode('edit');
        } else {
            currentGameId = null;
            currentGameCode = null;
            setLayoutMode('create');
            showWelcomeMessage();
        }
    });
    
    // 加载默认模型
    loadDefaultModel();
    
    console.log('✅ 事件绑定完成');
}

// ==================== 游戏加载 ====================

function loadGameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('edit');
    
    console.log('🔍 检查 URL 参数 edit:', gameId);
    
    if (!gameId || !window.GameStorage) {
        console.log('❌ 没有 gameId 或 GameStorage 不可用');
        return false;
    }
    
    const games = GameStorage.getAllGames();
    console.log('📚 所有游戏:', games.length);
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        console.warn('⚠️ 游戏不存在:', gameId);
        return false;
    }
    
    currentGameId = game.id;
    currentGameCode = game.code;
    currentVersion = game.version || 1;
    
    // 🏗️ 恢复构建历史和原始游戏类型 - 关键修复！
    gameBuildHistory = game.buildHistory || [];
    originalGameType = game.originalGameType || extractGameType(game.prompt || '');
    
    console.log('✅ 加载游戏:', { 
        id: currentGameId, 
        title: game.title, 
        version: currentVersion, 
        codeLength: game.code?.length,
        buildHistory: gameBuildHistory.length,
        originalGameType: originalGameType
    });
    
    // 1. 先显示游戏预览
    showGamePreview(game.code);
    showGameTitle(game.title);
    
    // 2. 加载对话历史到内存和 UI
    loadConversationHistory(currentGameId);
    
    // 3. 分析游戏参数
    if (window.GameAnalyzer) {
        GameAnalyzer.analyze(game.code, currentGameId);
        GameAnalyzer.render('propertiesContent');
    }
    
    // 4. 更新 URL（确保刷新后仍然保留）- 从"我的游戏"进入，使用 force=true
    updateURLWithGameId(currentGameId, true);  // true = 更新 URL
    
    return true;
}

// 更新 URL 中的游戏 ID（只在从"我的游戏"进入时使用）
function updateURLWithGameId(gameId, force = false) {
    // 如果是 force=true（从我的游戏进入），才更新 URL
    // 否则只保存到 sessionStorage（页面刷新用）
    if (force) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('edit', gameId);
        window.history.replaceState({ gameId: gameId }, '', newUrl.toString());
        console.log('🔗 URL 已更新（编辑模式）:', newUrl.toString());
    } else {
        // 保存到 sessionStorage，用于页面刷新恢复
        sessionStorage.setItem('currentGameId', gameId);
        console.log('💾 已保存到 sessionStorage:', gameId);
    }
}

function loadConversationHistory(gameId) {
    console.log('📚 开始加载对话历史，gameId:', gameId);
    console.log('🔍 检查 elements.conversationMessages:', !!elements.conversationMessages);
    
    if (!elements.conversationMessages) {
        console.error('❌ conversationMessages 元素不存在！');
        return;
    }
    
    if (!window.GameStorage) {
        console.error('❌ GameStorage 不可用！');
        return;
    }
    
    const history = GameStorage.getConversationHistory(gameId);
    console.log('💾 从存储获取的历史记录:', history?.length || 0, '条');
    
    if (!history || history.length === 0) {
        console.log('💡 无历史对话');
        return;
    }
    
    // 🧱 恢复内存中的对话历史
    conversationHistory = [];
    elements.conversationMessages.innerHTML = '';
    
    history.forEach((item, index) => {
        console.log(`🧱 加载积木 ${index + 1}/${history.length}:`, item.role);
        addMessageToUI(item.role, item.content, item.timestamp);
        conversationHistory.push(item);
    });
    
    console.log('📚 已加载对话历史:', conversationHistory.length, '条');
    console.log('🧱 积木堆恢复完成，内存中的历史:', conversationHistory.length);
}

// ==================== 游戏创建 ====================

async function generateGame() {
    const prompt = elements.promptInput?.value.trim();
    if (!prompt) return;
    
    // 使用用户选择的模型
    const selectedModel = elements.modelSelect?.value || 'gemini-2.5-flash';
    
    // 🆕 如果是新游戏（没有 currentGameId），立即生成 ID 并清空对话历史
    if (!currentGameId) {
        // 🔒 强制检查：第一次创建必须指定游戏类型
        const detectedGameType = extractGameType(prompt);
        if (!detectedGameType) {
            hideLoading();
            alert('⚠️ 请指定游戏类型！\n\n例如：\n- "创建一个贪食蛇游戏"\n- "创建一个打砖块游戏"\n- "创建一个飞机大战"\n\n当前提示词未识别到游戏类型，AI 无法确定要创建什么游戏。');
            elements.sendBtn.disabled = false;
            return;
        }
        
        // 立即生成游戏 ID，确保对话能保存
        currentGameId = 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        currentVersion = 1;
        conversationHistory = [];
        console.log('🆕 新游戏，已生成 ID:', currentGameId);
        console.log('🆕 新游戏，已清空对话历史');
        console.log('🎮 检测到游戏类型:', detectedGameType);
        
        if (elements.conversationMessages) {
            elements.conversationMessages.innerHTML = '';
        }
    }
    
    addConversation('user', prompt);
    elements.promptInput.value = '';
    elements.sendBtn.disabled = true;
    showLoading();
    
    try {
        // 根据模型判断厂商
        const provider = selectedModel.includes('openrouter') || selectedModel.includes('xiaomi/mimo-v2-pro') ? 'openrouter' : 
                        (selectedModel.includes('qwen') ? 'aliyun' : 'jiekou');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                provider: provider,  // 指定 API 厂商
                model: selectedModel,
                messages: [
                    {role: 'system', content: `你是专业的游戏开发 AI 助手。

🔒 游戏类型锁定：
- 用户要求创建的游戏类型是：【${extractGameType(prompt) || '由用户提示词推断'}】
- 请严格按照游戏类型的经典规则实现
- 例如贪食蛇：蛇吃食物变长、撞墙/撞自己死亡

📐 技术要求：
- Canvas 尺寸：360x640 像素（9:16 竖屏）
- 单个 HTML 文件，包含完整 CSS 和 JavaScript
- 使用 Canvas API 绘制游戏`},
                    {role: 'user', content: `请创建一个完整的 HTML5 游戏。游戏描述：${prompt}。
                    
重要技术要求：
1. 单个 HTML 文件
2. 使用 Canvas API
3. Canvas 尺寸必须为 360x640 像素（9:16 竖屏比例）
4. 在 JavaScript 中设置：canvas.width = 360; canvas.height = 640;
5. 在 CSS 中设置：canvas { max-width: 100%; height: auto; display: block; margin: 0 auto; }
6. 包含完整游戏循环
7. 有得分系统
8. 确保有趣可玩

只返回 HTML 代码，不要其他说明。`}
                ],
                max_tokens: 16000,
                temperature: 0.7,
                gameId: currentGameId,  // 🆕 添加游戏 ID
                isModification: false    // 🆕 标记为新创建
            })
        });
        
        if (!response.ok) throw new Error('API 错误：' + response.status);
        
        const result = await response.json();
        let gameCode = result.choices?.[0]?.message?.content;
        
        if (!gameCode) throw new Error('API 返回数据为空');
        
        console.log('🤖 使用模型:', selectedModel);
        
        hideLoading();
        addConversation('assistant', `游戏生成成功！使用模型：${selectedModel}\n代码长度：${gameCode.length} 字符`);
        
        gameCode = extractHtmlCode(gameCode);
        currentGameCode = gameCode;
        currentVersion = 1;
        
        // 🏗️ 记录构建历史 - 关键修复！
        const gameType = extractGameType(prompt);  // 提取游戏类型（如"贪食蛇"）
        originalGameType = gameType;  // 保存原始游戏类型
        gameBuildHistory.push({
            userReq: `创建游戏：${prompt}`,
            aiCode: gameCode,
            gameType: gameType,
            timestamp: new Date().toISOString()
        });
        console.log('🏗️ 已记录构建历史 #1，游戏类型:', gameType);
        console.log('🏗️ 构建历史条目:', gameBuildHistory.length);
        
        // 💾 保存到 sessionStorage（页面刷新后恢复）
        sessionStorage.setItem('gameBuildHistory', JSON.stringify(gameBuildHistory));
        sessionStorage.setItem('originalGameType', originalGameType);
        console.log('💾 已保存构建历史到 sessionStorage');
        
        showGamePreview(gameCode);
        
        if (window.GameAnalyzer) {
            GameAnalyzer.analyze(gameCode, currentGameId);
            GameAnalyzer.render('propertiesContent');
        }
        
        // 🏗️ 保存游戏时包含构建历史和原始游戏类型
        saveGameWithBuildHistory(prompt);
        
        // 保存到 sessionStorage（用于页面刷新恢复），但不更新 URL
        if (currentGameId) {
            updateURLWithGameId(currentGameId, false);  // false = 不更新 URL
        }
    } catch (error) {
        console.error('生成失败:', error);
        hideLoading();
        addConversation('system', '生成失败：' + error.message);
        elements.sendBtn.disabled = false;
    }
}

/**
 * 🏗️ 保存游戏时包含构建历史和原始游戏类型
 * 用于搭积木系统 - 确保页面刷新后不会丢失游戏类型
 */
function saveGameWithBuildHistory(prompt) {
    if (!window.GameStorage) return;
    
    const gameTitle = extractGameTitle(prompt);
    const gameData = {
        id: currentGameId,
        code: currentGameCode,
        codeLength: currentGameCode.length,
        title: gameTitle,
        description: prompt,
        prompt: prompt,
        version: currentVersion,
        updatedAt: new Date().toISOString(),
        // 🏗️ 关键：保存构建历史和原始游戏类型
        buildHistory: gameBuildHistory,
        originalGameType: originalGameType
    };
    
    const games = GameStorage.getAllGames();
    const existing = games.find(g => g.id === currentGameId);
    
    if (existing) {
        GameStorage.updateGame(currentGameId, gameData);
        console.log('💾 游戏已更新:', gameTitle, 'v' + currentVersion);
        console.log('🏗️ 构建历史已保存，条目数:', gameBuildHistory.length);
    } else {
        gameData.createdAt = new Date().toISOString();
        GameStorage.saveGame(gameData);
        console.log('💾 游戏已创建:', gameTitle, 'ID:', currentGameId);
        console.log('🏗️ 构建历史已保存，条目数:', gameBuildHistory.length);
    }
    
    showGameTitle(gameTitle);
}

function saveGame(prompt) {
    if (!window.GameStorage) return;
    
    if (!currentGameId) {
        currentGameId = 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        currentVersion = 1;
    }
    
    const gameTitle = extractGameTitle(prompt);
    const gameData = {
        id: currentGameId,
        code: currentGameCode,
        codeLength: currentGameCode.length,
        title: gameTitle,
        description: prompt,
        prompt: prompt,
        version: currentVersion,
        updatedAt: new Date().toISOString()
    };
    
    const games = GameStorage.getAllGames();
    const existing = games.find(g => g.id === currentGameId);
    
    if (existing) {
        GameStorage.updateGame(currentGameId, gameData);
        console.log('💾 游戏已更新:', gameTitle, 'v' + currentVersion);
    } else {
        gameData.createdAt = new Date().toISOString();
        GameStorage.saveGame(gameData);
        console.log('💾 游戏已创建:', gameTitle, 'ID:', currentGameId);
    }
    
    showGameTitle(gameTitle);
}

// ==================== 游戏修改 ====================

function enterModifyMode() {
    if (!currentGameId) {
        alert('请先创建或加载一个游戏');
        return;
    }
    elements.modifyInputSection.style.display = 'block';
    elements.modifyInput.focus();
}

function cancelModify() {
    elements.modifyInputSection.style.display = 'none';
    elements.modifyInput.value = '';
}

async function modifyGame() {
    const modifyText = elements.modifyInput?.value.trim();
    if (!modifyText || !currentGameCode || !currentGameId) return;
    
    // 使用用户选择的模型
    const selectedModel = elements.modelSelect?.value || 'gemini-2.5-flash';
    
    addConversation('user', '修改：' + modifyText);
    elements.modifyInput.value = '';
    showLoading();
    
    try {
        // 根据模型判断厂商
        const provider = selectedModel.includes('openrouter') || selectedModel.includes('xiaomi/mimo-v2-pro') ? 'openrouter' : 
                        (selectedModel.includes('qwen') ? 'aliyun' : 'jiekou');
        
        console.log('🔧 开始修改游戏，使用模型:', selectedModel);
        console.log('📚 构建历史条数:', gameBuildHistory.length);
        console.log('🎮 原始游戏类型:', originalGameType);
        console.log('🌐 使用厂商:', provider);
        
        // 🏗️ 完全重写的搭积木系统 - 确保游戏类型不会改变
        
        // 构建系统提示词 - 强调游戏类型锁定
        const systemPrompt = `你是专业的游戏开发 AI 助手，擅长修改和优化游戏代码。

🔒 游戏类型锁定规则（绝对遵守）：
- 这个游戏的类型是【${originalGameType || '未知类型'}】
- 无论用户要求什么修改，游戏类型【绝对不能改变】
- 贪食蛇永远是贪食蛇，不能变成其他游戏

🚨 搭积木式修改规则（绝对遵守）：
1. 【绝对保留】之前所有已实现的功能、特性、游戏机制，一个都不能少
2. 【只能添加/修改】只根据最新要求添加新功能或修改现有功能
3. 【禁止删除】绝对不能删除或简化任何已经实现的功能
4. 【完整输出】每次必须输出完整的 HTML 代码，包含所有功能

📐 技术要求：
- Canvas 尺寸：360x640 像素（9:16 竖屏）
- 单个 HTML 文件，包含完整 CSS 和 JavaScript
- 使用 Canvas API 绘制游戏

⚠️ 重要示例：
如果游戏原本是"贪食蛇"，用户要求"添加AI对手"，输出必须是"有AI对手的贪食蛇"
如果游戏原本是"贪食蛇"，用户要求"加音效"，输出必须是"有音效的贪食蛇"
永远不能因为添加新功能而改变游戏类型！`;

        // 构建消息数组
        const messages = [{ role: 'system', content: systemPrompt }];
        
        // 🧱 使用构建历史来构建上下文
        if (gameBuildHistory.length > 0) {
            // 积木 1：原始创建请求
            const firstBuild = gameBuildHistory[0];
            messages.push({
                role: 'user',
                content: `【原始需求】请创建一个【${originalGameType}】游戏：${firstBuild.userReq.replace('创建游戏：', '')}`
            });
            
            // 积木 1：AI 响应（包含实际代码）
            messages.push({
                role: 'assistant',
                content: `✅ 已创建【${originalGameType}】游戏。\n\n\`\`\`html\n${firstBuild.aiCode}\n\`\`\``
            });
            
            // 积木 2-N：中间修改历史（跳过第一个）
            for (let i = 1; i < gameBuildHistory.length; i++) {
                const build = gameBuildHistory[i];
                messages.push({
                    role: 'user',
                    content: `【修改要求】${build.userReq}`
                });
                messages.push({
                    role: 'assistant',
                    content: `✅ 修改完成，游戏仍然是【${build.gameType || originalGameType}】。\n\n\`\`\`html\n${build.aiCode}\n\`\`\``
                });
            }
        }
        
        // 最后一块积木：当前修改请求
        messages.push({
            role: 'user',
            content: `【当前游戏代码】
\`\`\`html
${currentGameCode.substring(0, 50000)}
\`\`\`

【本次修改要求】${modifyText}

🚨 请严格遵守：
1. 游戏类型【绝对不能改变】，必须是【${originalGameType || '保持原类型'}】
2. 保留上方代码中【所有已实现的功能】
3. 只添加/修改本次要求的功能
4. 返回完整的 HTML 代码`
        });
        
        console.log('📦 构建上下文消息，总条数:', messages.length);
        console.log('📦 构建历史:');
        gameBuildHistory.forEach((b, i) => {
            console.log(`  [${i}] ${b.userReq.substring(0, 30)}...`);
        });
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                provider: provider,  // 指定 API 厂商
                model: selectedModel,
                messages: messages,
                max_tokens: 16000,
                temperature: 0.7,
                gameId: currentGameId,  // 🆕 添加游戏 ID
                isModification: true     // 🆕 标记为修改
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API 响应错误:', response.status, errorText);
            throw new Error(`API 错误 ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('📥 API 响应:', result);
        
        let gameCode = result.choices?.[0]?.message?.content;
        
        if (!gameCode) {
            console.error('❌ API 返回空内容:', result);
            throw new Error('API 返回数据为空');
        }
        
        console.log('📝 原始响应长度:', gameCode.length);
        
        // 提取 HTML 代码
        gameCode = extractHtmlCode(gameCode);
        
        console.log('✅ 提取后代码长度:', gameCode.length);
        console.log('🔍 代码开头:', gameCode.substring(0, 50));
        
        // 验证代码有效性
        if (!gameCode.includes('<html') || !gameCode.includes('</html>')) {
            console.warn('⚠️ 代码可能不完整，尝试修复...');
            if (!gameCode.includes('<html')) {
                gameCode = '<html>\n' + gameCode;
            }
            if (!gameCode.includes('</html>')) {
                gameCode = gameCode + '\n</html>';
            }
        }
        
        hideLoading();
        addConversation('assistant', `✅ 修改完成！使用模型：${selectedModel}\n新代码长度：${gameCode.length} 字符`);
        
        // 更新当前代码
        currentGameCode = gameCode;
        currentVersion++;
        
        // 🏗️ 记录构建历史 - 关键！保存实际代码
        const gameType = extractGameType(modifyText);
        gameBuildHistory.push({
            userReq: `修改：${modifyText}`,
            aiCode: gameCode,
            gameType: gameType || originalGameType,
            timestamp: new Date().toISOString()
        });
        console.log('🏗️ 已记录构建历史 #' + gameBuildHistory.length, '游戏类型:', gameType || originalGameType);
        
        // 💾 保存到 sessionStorage（页面刷新后恢复）
        sessionStorage.setItem('gameBuildHistory', JSON.stringify(gameBuildHistory));
        sessionStorage.setItem('originalGameType', originalGameType);
        console.log('💾 已保存构建历史到 sessionStorage');
        
        // 重新渲染游戏
        console.log('🔄 重新渲染游戏...');
        showGamePreview(gameCode);
        
        // 分析游戏参数
        if (window.GameAnalyzer) {
            GameAnalyzer.analyze(gameCode, currentGameId);
            GameAnalyzer.render('propertiesContent');
        }
        
        // 🏗️ 保存游戏时包含构建历史
        saveGameWithBuildHistory('修改：' + modifyText);
        cancelModify();
        
        console.log('✅ 修改完成，版本:', currentVersion);
        
    } catch (error) {
        console.error('❌ 修改失败:', error);
        hideLoading();
        addConversation('system', '❌ 修改失败：' + error.message);
        elements.modifyInput.value = modifyText;  // 恢复修改内容
    }
}

// ==================== 对话管理 ====================

function addConversation(role, content) {
    if (!elements.conversationMessages) return;
    
    // 🧱 添加到对话历史（积木堆）
    const conversationItem = {
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    };
    
    conversationHistory.push(conversationItem);
    
    // 限制对话历史长度（保留最近 MAX_HISTORY 条）
    if (conversationHistory.length > MAX_HISTORY) {
        conversationHistory = conversationHistory.slice(-MAX_HISTORY);
        console.log('📚 对话历史过长，已截断为最近', MAX_HISTORY, '条');
    }
    
    console.log('🧱 已添加对话积木:', role, '| 当前总数:', conversationHistory.length);
    
    // 添加到 UI
    addMessageToUI(role, content, conversationItem.timestamp);
    
    // 保存到本地存储（页面刷新后恢复）
    if (currentGameId && window.GameStorage) {
        GameStorage.addConversation(currentGameId, conversationItem);
        console.log('💡 对话已保存到存储:', role, '→ ID:', currentGameId);
    }
}

function addMessageToUI(role, content, timestamp) {
    if (!elements.conversationMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const time = timestamp 
        ? new Date(timestamp).toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})
        : new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
    
    const icon = role === 'user' ? '👤' : (role === 'assistant' ? '🤖' : '💡');
    const roleText = role === 'user' ? '你' : (role === 'assistant' ? 'AI' : '系统');
    
    messageDiv.innerHTML = `
        <div class="message-meta">
            <span class="message-icon">${icon}</span>
            <span class="message-role">${roleText}</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-content">${escapeHtml(content)}</div>
    `;
    
    elements.conversationMessages.appendChild(messageDiv);
    
    const container = document.getElementById('conversationHistory');
    if (container) container.scrollTop = container.scrollHeight;
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant loading-message';
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = `
        <div class="loading-dots"><span></span><span></span><span></span></div>
        <span>正在生成游戏...</span>
    `;
    elements.conversationMessages?.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) loadingMessage.remove();
}

function showWelcomeMessage() {
    if (!elements.conversationMessages) return;
    
    elements.conversationMessages.innerHTML = `
        <div class="welcome-message">
            <h2>🎮 开始创建你的游戏</h2>
            <p>描述你想要的游戏，AI 会帮你实现</p>
            <div class="example-prompts">
                <button class="prompt-chip" data-prompt="创建一个太空射击游戏">🚀 太空射击</button>
                <button class="prompt-chip" data-prompt="创建一个贪食蛇游戏">🐍 贪食蛇</button>
                <button class="prompt-chip" data-prompt="创建一个平台跳跃游戏">🏃 平台跳跃</button>
                <button class="prompt-chip" data-prompt="创建一个打砖块游戏">🏐 打砖块</button>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            elements.promptInput.value = chip.getAttribute('data-prompt');
            elements.sendBtn.disabled = false;
            generateGame();
        });
    });
}

// ==================== 工具函数 ====================

function showGamePreview(gameCode) {
    console.log('🖼️ 开始渲染游戏预览，代码长度:', gameCode?.length || 0);
    
    // 检查元素是否存在
    if (!elements.gameFrame) {
        console.error('❌ gameFrame 元素不存在，尝试重新获取...');
        elements.gameFrame = document.getElementById('gameFrame');
    }
    
    if (!elements.previewContent) {
        console.error('❌ previewContent 元素不存在，尝试重新获取...');
        elements.previewContent = document.getElementById('previewContent');
    }
    
    if (!elements.gameFrame || !elements.previewContent) {
        console.error('❌ 预览元素不存在，无法渲染');
        console.log('🔍 gameFrame:', !!elements.gameFrame, 'previewContent:', !!elements.previewContent);
        return;
    }
    
    // 切换到编辑模式（显示三栏）
    setLayoutMode('edit');
    
    // 创建 9:16 比例的容器结构
    let gameContainer = elements.previewContent.querySelector('.game-container');
    
    if (!gameContainer) {
        console.log('📦 创建游戏容器...');
        // 创建容器
        gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';
        
        const canvasWrapper = document.createElement('div');
        canvasWrapper.className = 'game-canvas-wrapper';
        
        // 移动 iframe 到新容器中
        elements.gameFrame.style.display = 'block';
        canvasWrapper.appendChild(elements.gameFrame);
        gameContainer.appendChild(canvasWrapper);
        
        // 隐藏 placeholder
        const placeholder = elements.previewContent.querySelector('.preview-placeholder');
        if (placeholder) {
            console.log('👻 隐藏 placeholder');
            placeholder.style.display = 'none';
        }
        
        elements.previewContent.appendChild(gameContainer);
        console.log('✅ 游戏容器创建完成');
    }
    
    // 验证代码有效性
    if (!gameCode || gameCode.length < 50) {
        console.error('❌ 游戏代码无效或太短:', gameCode?.length);
        elements.gameFrame.srcdoc = '<html><body><h1>游戏代码无效</h1></body></html>';
        return;
    }
    
    // 确保是完整的 HTML 文档
    let validCode = gameCode;
    if (!validCode.toLowerCase().includes('<!doctype')) {
        validCode = '<!DOCTYPE html>\n' + validCode;
    }
    
    // 设置游戏代码 - 使用 srcdoc
    console.log('📝 设置 iframe srcdoc，代码长度:', validCode.length);
    elements.gameFrame.srcdoc = validCode;
    
    // 监听 iframe 加载
    elements.gameFrame.onload = function() {
        console.log('✅ iframe 加载完成');
    };
    
    elements.gameFrame.onerror = function() {
        console.error('❌ iframe 加载失败');
    };
    
    // 显示操作按钮
    if (elements.previewActions) {
        elements.previewActions.style.display = 'flex';
        console.log('🎮 显示预览操作按钮');
    }
    
    console.log('✅ 游戏预览已设置 (9:16 比例)');
    
    // 强制刷新 iframe（备用方案）
    setTimeout(() => {
        if (elements.gameFrame && elements.gameFrame.srcdoc !== validCode) {
            console.log('🔄 检测到 iframe 未正确加载，重新设置...');
            elements.gameFrame.srcdoc = validCode;
        } else if (elements.gameFrame) {
            console.log('✅ iframe 已正确加载，srcdoc 长度:', elements.gameFrame.srcdoc?.length);
        }
    }, 1000);
}

function showGameTitle(title) {
    if (!elements.previewActions) return;
    
    let titleSpan = elements.previewActions.querySelector('.game-title-display');
    if (!titleSpan) {
        titleSpan = document.createElement('span');
        titleSpan.className = 'game-title-display';
        titleSpan.style.cssText = 'color: #6366f1; font-weight: 600; font-size: 0.95rem; margin-right: 1rem;';
        elements.previewActions.insertBefore(titleSpan, elements.previewActions.firstChild);
    }
    
    titleSpan.textContent = title || '未命名游戏';
}

function playGame() {
    if (!currentGameCode) return;
    
    const win = window.open('', '_blank', 'width=1024,height=768');
    if (win) {
        win.document.open();
        win.document.write(currentGameCode);
        win.document.close();
        win.document.title = 'AI 游戏 v' + currentVersion;
    }
}

/**
 * 🛠️ 导出为 Godot 项目
 * 将 HTML5 游戏转换为 Godot 4.x 项目结构
 */
async function exportToGodot() {
    if (!currentGameCode || !currentGameId) {
        alert('请先创建或加载一个游戏');
        return;
    }
    
    const gameTitle = extractGameTitle(currentGameId);
    
    console.log('🛠️ 开始导出 Godot 项目:', gameTitle);
    
    try {
        // 调用后端 API 转换为 Godot 项目
        const response = await fetch('http://localhost:3000/api/export-godot', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                htmlCode: currentGameCode,
                gameTitle: gameTitle,
                gameId: currentGameId
            })
        });
        
        if (!response.ok) {
            throw new Error('转换失败：' + response.status);
        }
        
        const result = await response.json();
        
        // 下载 Godot 项目 ZIP
        if (result.zipUrl) {
            const a = document.createElement('a');
            a.href = result.zipUrl;
            a.download = `${gameTitle}_godot.zip`;
            a.click();
            
            console.log('✅ Godot 项目已导出');
            alert(`✅ Godot 项目已生成！\n\n包含：\n- project.godot (项目配置)\n- scenes/main.tscn (主场景)\n- scripts/player.gd (玩家脚本)\n\n解压后用 Godot 4.x 打开即可。`);
        } else {
            throw new Error('未生成 ZIP 文件');
        }
        
    } catch (error) {
        console.error('❌ Godot 导出失败:', error);
        alert('❌ Godot 导出失败：' + error.message + '\n\n请确保服务器已启动并且支持 Godot 导出功能。');
    }
}

function extractHtmlCode(text) {
    if (text.includes('```html')) {
        const start = text.indexOf('```html') + 7;
        const end = text.indexOf('```', start);
        if (end !== -1) text = text.substring(start, end).trim();
    } else if (text.includes('```')) {
        const start = text.indexOf('```') + 3;
        const end = text.indexOf('```', start);
        if (end !== -1) text = text.substring(start, end).trim();
    }
    
    const trimmed = text.trim();
    if (!trimmed.startsWith('<!DOCTYPE') && !trimmed.toLowerCase().startsWith('<html')) {
        return '<!DOCTYPE html>\n<html>\n' + trimmed + '\n</html>';
    }
    
    return text;
}

function extractGameTitle(prompt) {
    if (!prompt) return '新游戏';
    
    const gameTypes = [
        {keywords: ['贪食蛇', '蛇'], title: '贪食蛇'},
        {keywords: ['太空', '射击', '飞船'], title: '太空射击'},
        {keywords: ['平台', '跳跃'], title: '平台跳跃'},
        {keywords: ['打砖块', '砖块', '弹球'], title: '打砖块'},
        {keywords: ['赛车', '竞速'], title: '极速赛车'},
        {keywords: ['塔防', '防御塔'], title: '塔防大战'},
        {keywords: ['合并', '进化'], title: '进化合并'},
        {keywords: ['农场', '种植'], title: '欢乐农场'},
        {keywords: ['解谜', '益智'], title: '益智谜题'}
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    for (const gameType of gameTypes) {
        if (gameType.keywords.some(keyword => lowerPrompt.includes(keyword))) {
            return gameType.title;
        }
    }
    
    return prompt.substring(0, 20).replace(/[^\w\s\u4e00-\u9fa5]/g, '') || '新游戏';
}

// ==================== 游戏编辑器 ====================

/**
 * 🎮 打开游戏编辑器
 */
function openEditor() {
    console.log('🎮 打开游戏编辑器...');
    console.log('📝 currentGameCode:', currentGameCode ? '存在' : '不存在');
    console.log('🔧 GameEditor:', typeof GameEditor);
    
    if (!currentGameCode) {
        showToast('⚠️ 请先创建或加载一个游戏');
        return;
    }
    
    // ✅ 检查 GameEditor 是否定义
    if (typeof window.GameEditor === 'undefined') {
        console.error('❌ GameEditor 未定义！检查 game-editor.js 是否加载');
        showToast('❌ 编辑器模块未加载，请刷新页面');
        return;
    }
    
    // 显示编辑器模态框
    const editorModal = document.getElementById('editorModal');
    if (editorModal) {
        editorModal.style.display = 'flex';
        console.log('✅ 编辑器模态框已显示');
    } else {
        console.error('❌ 找不到编辑器模态框');
        showToast('❌ 编辑器模态框不存在');
        return;
    }
    
    // 设置代码编辑器内容
    const codeEditor = document.getElementById('codeEditor');
    if (codeEditor) {
        codeEditor.value = currentGameCode;
        console.log('📝 代码已设置到编辑器');
    }
    
    // 设置画布预览
    const canvasPreview = document.getElementById('canvasPreview');
    if (canvasPreview) {
        canvasPreview.innerHTML = `<iframe id="editorGameFrame" style="width:360px;height:640px;border:2px solid #3c3c3c;border-radius:4px;" sandbox="allow-scripts allow-same-origin"></iframe>`;
        
        const iframe = document.getElementById('editorGameFrame');
        if (iframe && currentGameCode) {
            iframe.srcdoc = currentGameCode;
            console.log('🎮 游戏已加载到画布预览');
        }
    }
    
    // 初始化编辑器（延迟确保 DOM 准备好）
    setTimeout(() => {
        if (window.GameEditor) {
            console.log('✅ 开始初始化 GameEditor...');
            window.GameEditor.init(currentGameCode);
            console.log('✅ GameEditor 初始化完成');
        } else {
            console.error('❌ GameEditor 未定义');
        }
    }, 200);
}

/**
 * 关闭编辑器
 */
function closeEditor() {
    const editorModal = document.getElementById('editorModal');
    if (editorModal) {
        editorModal.style.display = 'none';
        console.log('❌ 编辑器已关闭');
    }
}

/**
 * 应用代码编辑器的修改
 */
function applyCodeChanges() {
    const codeEditor = document.getElementById('codeEditor');
    if (!codeEditor) {
        console.error('❌ 找不到代码编辑器');
        return;
    }
    
    const newCode = codeEditor.value;
    currentGameCode = newCode;
    
    // 更新预览
    const iframe = document.getElementById('editorGameFrame');
    if (iframe) {
        iframe.srcdoc = newCode;
        console.log('✅ 代码已应用到预览');
        showToast('✅ 代码已应用到预览');
    } else {
        console.error('❌ 找不到预览 iframe');
    }
}

// 全局函数供 HTML 调用
window.openEditor = openEditor;
window.closeEditor = closeEditor;
window.applyCodeChanges = applyCodeChanges;
window.onEditorSave = function(code) {
    currentGameCode = code;
    console.log('💾 编辑器保存游戏代码');
    showToast('💾 游戏已保存');
};

// ==================== 事件监听 ====================

// 关闭编辑器按钮
document.getElementById('closeEditorBtn')?.addEventListener('click', closeEditor);

// 应用代码按钮
document.getElementById('applyCodeBtn')?.addEventListener('click', applyCodeChanges);

// 编辑器模态框点击关闭
document.getElementById('editorModal')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('code-overlay')) {
        closeEditor();
    }
});

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 保存页面状态（用于刷新后恢复）
function savePageState() {
    if (currentGameId) {
        sessionStorage.setItem('currentGameId', currentGameId);
        sessionStorage.setItem('currentGameCode', currentGameCode);
        sessionStorage.setItem('currentVersion', currentVersion);
        console.log('💾 页面状态已保存');
    }
}

// 清除游戏会话（点击"创建"按钮时调用）
window.handleCreateClick = function() {
    // 清除 sessionStorage
    sessionStorage.removeItem('currentGameId');
    sessionStorage.removeItem('currentGameCode');
    sessionStorage.removeItem('currentVersion');
    
    // 重置全局变量
    currentGameId = null;
    currentGameCode = null;
    currentVersion = 1;
    
    // 清除 URL 参数
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('edit');
    window.history.replaceState({}, '', newUrl.toString());
    
    // 清除对话历史 UI
    if (elements.conversationMessages) {
        elements.conversationMessages.innerHTML = '';
    }
    
    // 隐藏预览区和参数区
    setLayoutMode('create');
    
    // 显示欢迎界面
    showWelcomeMessage();
    
    // 更新导航 active 状态
    updateNavActive('create');
    
    console.log('✨ 已切换到创建模式');
};

// 更新导航 active 状态
function updateNavActive(page) {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector('.nav-create');
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// 清除游戏会话（兼容旧版本）
window.clearGameSession = window.handleCreateClick;

// ==================== 启动 ====================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('✅ 创作页面已加载 - 游戏 ID 核心架构');
