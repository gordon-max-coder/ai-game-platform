/**
 * GameAI - 创作页面逻辑（游戏 ID 核心架构）
 * 所有操作都基于 currentGameId
 */

const API_URL = 'http://localhost:3000/api/generate';

// 核心状态 - 所有操作都基于 currentGameId
let currentGameId = null;      // 当前游戏 ID（创建时生成，编辑时加载）
let currentGameCode = null;    // 当前游戏代码
let currentVersion = 1;        // 当前版本

// DOM 元素
const elements = {};

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
    
    // 3. 如果都没有，显示欢迎界面
    if (!loaded) {
        showWelcomeMessage();
    }
    
    console.log('✅ 初始化完成，currentGameId:', currentGameId);
}

// 从 sessionStorage 恢复状态（页面刷新）
function recoverFromSessionStorage() {
    const savedGameId = sessionStorage.getItem('currentGameId');
    const savedGameCode = sessionStorage.getItem('currentGameCode');
    const savedVersion = sessionStorage.getItem('currentVersion');
    
    if (!savedGameId || !savedGameCode) {
        return false;
    }
    
    console.log('🔄 从 sessionStorage 恢复:', savedGameId);
    
    currentGameId = savedGameId;
    currentGameCode = savedGameCode;
    currentVersion = parseInt(savedVersion) || 1;
    
    // 显示游戏
    showGamePreview(currentGameCode);
    
    // 加载对话历史
    loadConversationHistory(currentGameId);
    
    // 分析游戏参数
    if (window.GameAnalyzer) {
        GameAnalyzer.analyze(currentGameCode, currentGameId);
        GameAnalyzer.render('propertiesContent');
    }
    
    // 更新 URL
    updateURLWithGameId(currentGameId);
    
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
    document.getElementById('modifyBtn')?.addEventListener('click', enterModifyMode);
    
    elements.modifyInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!elements.modifySendBtn.disabled) modifyGame();
        }
    });
    
    elements.modifySendBtn?.addEventListener('click', modifyGame);
    elements.cancelModifyBtn?.addEventListener('click', cancelModify);
    
    // 监听页面刷新/关闭，保存状态
    window.addEventListener('beforeunload', savePageState);
}

// ==================== 游戏加载 ====================

function loadGameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('edit');
    
    if (!gameId || !window.GameStorage) return false;
    
    const games = GameStorage.getAllGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        console.warn('⚠️ 游戏不存在:', gameId);
        return false;
    }
    
    currentGameId = game.id;
    currentGameCode = game.code;
    currentVersion = game.version || 1;
    
    console.log('✅ 加载游戏:', { id: currentGameId, title: game.title, version: currentVersion });
    
    showGamePreview(game.code);
    showGameTitle(game.title);
    loadConversationHistory(currentGameId);
    
    // 分析游戏参数
    if (window.GameAnalyzer) {
        GameAnalyzer.analyze(game.code, currentGameId);
        GameAnalyzer.render('propertiesContent');
    }
    
    // 更新 URL（确保刷新后仍然保留）
    updateURLWithGameId(currentGameId);
    
    return true;
}

// 更新 URL 中的游戏 ID
function updateURLWithGameId(gameId) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('edit', gameId);
    window.history.replaceState({ gameId: gameId }, '', newUrl.toString());
    console.log('🔗 URL 已更新:', newUrl.toString());
}

function loadConversationHistory(gameId) {
    if (!elements.conversationMessages) return;
    
    const history = GameStorage.getConversationHistory(gameId);
    if (!history || history.length === 0) {
        console.log('💡 无历史对话');
        return;
    }
    
    elements.conversationMessages.innerHTML = '';
    history.forEach(item => addMessageToUI(item.role, item.content, item.timestamp));
    console.log('💡 加载了', history.length, '条对话记录');
}

// ==================== 游戏创建 ====================

async function generateGame() {
    const prompt = elements.promptInput?.value.trim();
    if (!prompt) return;
    
    addConversation('user', prompt);
    elements.promptInput.value = '';
    elements.sendBtn.disabled = true;
    showLoading();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: 'claude-opus-4-6',
                messages: [
                    {role: 'system', content: '你是专业的游戏开发 AI 助手。'},
                    {role: 'user', content: `请创建一个完整的 HTML5 游戏。游戏描述：${prompt}。要求：1.单个 HTML 文件 2.使用 Canvas API 3.包含完整游戏循环 4.有得分系统 5.确保有趣可玩。只返回 HTML 代码。`}
                ],
                max_tokens: 16000,
                temperature: 0.7
            })
        });
        
        if (!response.ok) throw new Error('API 错误：' + response.status);
        
        const result = await response.json();
        let gameCode = result.choices?.[0]?.message?.content;
        
        if (!gameCode) throw new Error('API 返回数据为空');
        
        hideLoading();
        addConversation('assistant', '游戏生成成功！代码长度：' + gameCode.length + ' 字符');
        
        gameCode = extractHtmlCode(gameCode);
        currentGameCode = gameCode;
        currentVersion = 1;
        
        showGamePreview(gameCode);
        
        if (window.GameAnalyzer) {
            GameAnalyzer.analyze(gameCode, currentGameId);
            GameAnalyzer.render('propertiesContent');
        }
        
        saveGame(prompt);
        
        // 更新 URL
        if (currentGameId) {
            updateURLWithGameId(currentGameId);
        }
    } catch (error) {
        console.error('生成失败:', error);
        hideLoading();
        addConversation('system', '生成失败：' + error.message);
        elements.sendBtn.disabled = false;
    }
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
    
    addConversation('user', '修改：' + modifyText);
    elements.modifyInput.value = '';
    showLoading();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: 'claude-opus-4-6',
                messages: [
                    {role: 'system', content: '你是专业的游戏开发 AI 助手，擅长修改和优化游戏代码。'},
                    {role: 'user', content: `请修改以下游戏代码。修改要求：${modifyText}。返回完整的 HTML 代码。`}
                ],
                max_tokens: 16000,
                temperature: 0.7
            })
        });
        
        if (!response.ok) throw new Error('API 错误：' + response.status);
        
        const result = await response.json();
        let gameCode = result.choices?.[0]?.message?.content;
        
        if (!gameCode) throw new Error('API 返回数据为空');
        
        hideLoading();
        addConversation('assistant', '修改完成！新代码长度：' + gameCode.length + ' 字符');
        
        gameCode = extractHtmlCode(gameCode);
        currentGameCode = gameCode;
        currentVersion++;
        
        showGamePreview(gameCode);
        
        if (window.GameAnalyzer) {
            GameAnalyzer.analyze(gameCode, currentGameId);
            GameAnalyzer.render('propertiesContent');
        }
        
        saveGame('修改：' + modifyText);
        cancelModify();
    } catch (error) {
        console.error('修改失败:', error);
        hideLoading();
        addConversation('system', '修改失败：' + error.message);
    }
}

// ==================== 对话管理 ====================

function addConversation(role, content) {
    if (!elements.conversationMessages) return;
    addMessageToUI(role, content);
    
    if (currentGameId && window.GameStorage) {
        GameStorage.addConversation(currentGameId, {
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
        console.log('💡 对话已保存:', role, '→ ID:', currentGameId);
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
    if (!elements.gameFrame || !elements.previewContent) return;
    
    elements.gameFrame.style.display = 'block';
    elements.gameFrame.srcdoc = gameCode;
    
    const placeholder = elements.previewContent.querySelector('.preview-placeholder');
    if (placeholder) placeholder.style.display = 'none';
    
    if (elements.previewActions) elements.previewActions.style.display = 'flex';
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

// ==================== 启动 ====================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('✅ 创作页面已加载 - 游戏 ID 核心架构');
