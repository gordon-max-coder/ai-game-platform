/**
 * GameAI - 创建页面核心功能模块
 * 包含：游戏生成、修改、保存功能
 */

// 全局变量
const API_URL = 'http://localhost:3000/api/generate';
let currentGameCode = null;
let currentVersion = 1;
let currentGameId = null;

// DOM 元素
const elements = {};

// 初始化
function init() {
    console.log('?? 初始化创建页面...');
    
    // 缓存 DOM 元素
    elements.prompt = document.getElementById('prompt');
    elements.generateBtn = document.getElementById('generateBtn');
    elements.progressSection = document.getElementById('progressSection');
    elements.resultSection = document.getElementById('resultSection');
    elements.modifySection = document.getElementById('modifySection');
    elements.examplePrompts = document.getElementById('examplePrompts');
    elements.progressFill = document.getElementById('progressFill');
    elements.progressStatus = document.getElementById('progressStatus');
    elements.gameFrame = document.getElementById('gameFrame');
    elements.gameTitle = document.getElementById('gameTitle');
    elements.gameDescription = document.getElementById('gameDescription');
    elements.versionText = document.getElementById('versionText');
    elements.gameStats = document.getElementById('gameStats');
    elements.modifyPrompt = document.getElementById('modifyPrompt');
    
    // 绑定事件
    bindEvents();
    
    // 检查编辑状态并加载对话历史
    const editingGame = checkEditState();
    
    // 初始化对话历史组件
    if (window.ConversationUI) {
        // 延迟初始化，等待游戏 ID 确定
        setTimeout(() => {
            if (currentGameId) {
                ConversationUI.init(currentGameId);
            }
        }, 500);
    }
    
    console.log('? 初始化完成');
}

// 绑定事件
function bindEvents() {
    // 灵感按钮
    document.getElementById('inspireBtn')?.addEventListener('click', showInspiration);
    
    // 输入框
    elements.prompt?.addEventListener('input', handlePromptInput);
    
    // 生成按钮
    elements.generateBtn?.addEventListener('click', generateGame);
    
    // 修改按钮
    document.getElementById('modifyBtn')?.addEventListener('click', enterModifyMode);
    document.getElementById('modifySubmitBtn')?.addEventListener('click', modifyGame);
    document.getElementById('modifyCancelBtn')?.addEventListener('click', cancelModify);
    
    // 新游戏按钮
    document.getElementById('newGameBtn')?.addEventListener('click', createNewGame);
    
    // 游玩按钮
    document.getElementById('playBtn')?.addEventListener('click', playGame);
    
    // 示例提示
    document.querySelectorAll('.prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (elements.prompt) {
                elements.prompt.value = prompt;
                handlePromptInput();
            }
        });
    });
}

// 显示灵感
function showInspiration() {
    const prompts = [
        '创建一个太空射击游戏，玩家控制飞船躲避陨石并消灭敌人',
        '创建一个合并养成游戏，通过合并生物来进化',
        '创建一个平台跳跃游戏，有各种机关和敌人',
        '创建一个农场模拟游戏，种植作物和养殖动物'
    ];
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    if (elements.prompt) {
        elements.prompt.value = random;
        handlePromptInput();
    }
}

// 处理输入
function handlePromptInput() {
    const hasContent = elements.prompt?.value.trim().length > 0;
    if (elements.generateBtn) {
        elements.generateBtn.disabled = !hasContent;
    }
}

// 更新进度
function updateProgress(percent, text) {
    if (elements.progressFill) {
        elements.progressFill.style.width = percent + '%';
    }
    if (elements.progressStatus) {
        elements.progressStatus.textContent = text;
    }
}

// 生成游戏
async function generateGame() {
    const prompt = elements.prompt?.value.trim();
    if (!prompt) return;
    
    // UI 更新
    if (elements.createForm) elements.createForm.style.display = 'none';
    if (elements.examplePrompts) elements.examplePrompts.style.display = 'none';
    if (elements.progressSection) elements.progressSection.style.display = 'block';
    if (elements.resultSection) elements.resultSection.style.display = 'none';
    
    updateProgress(10, '正在分析你的游戏想法...');
    
    const fullPrompt = `请创建一个完整的 HTML5 游戏。游戏描述：${prompt}。要求：1.单个 HTML 文件 2.使用 Canvas API 3.包含完整游戏循环 4.有得分系统 5.确保有趣可玩。只返回 HTML 代码。`;
    
    try {
        updateProgress(30, '正在调用 AI 模型...');
        
        // 保存用户对话
        if (window.ConversationUI && currentGameId) {
            ConversationUI.addMessage('user', prompt);
        }
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: [
                    {role: 'system', content: '你是专业的游戏开发 AI 助手。'},
                    {role: 'user', content: fullPrompt}
                ],
                max_tokens: 16000,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error('API 错误：' + response.status);
        }
        
        updateProgress(60, '正在处理生成的代码...');
        
        const result = await response.json();
        let gameCode = result.choices?.[0]?.message?.content;
        
        if (!gameCode) {
            throw new Error('API 返回数据为空');
        }
        
        // 保存 AI 对话
        if (window.ConversationUI && currentGameId) {
            ConversationUI.addMessage('assistant', '游戏已生成！代码长度：' + gameCode.length + ' 字符');
        }
        
        // 清理代码
        gameCode = extractHtmlCode(gameCode);
        currentGameCode = gameCode;
        currentVersion = 1;
        
        updateProgress(100, '游戏生成完成！');
        
        setTimeout(() => {
            if (elements.progressSection) elements.progressSection.style.display = 'none';
            if (elements.resultSection) elements.resultSection.style.display = 'block';
            
            showGameResult(prompt, gameCode);
            
            // 保存到"我的游戏"
            saveToMyGames(gameCode, prompt);
        }, 500);
        
    } catch (error) {
        console.error('生成失败:', error);
        updateProgress(0, '生成失败');
        
        // 保存错误对话
        if (window.ConversationUI && currentGameId) {
            ConversationUI.addMessage('system', '生成失败：' + error.message);
        }
        
        alert('生成失败：' + error.message);
        if (elements.progressSection) elements.progressSection.style.display = 'none';
        if (elements.createForm) elements.createForm.style.display = 'block';
    }
}

// 提取 HTML 代码
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
        return '<!DOCTYPE html>\\n<html>\\n' + trimmed + '\\n</html>';
    }
    
    return text;
}

// 显示游戏结果
function showGameResult(prompt, gameCode) {
    const gameInfo = analyzePrompt(prompt);
    
    if (elements.gameTitle) elements.gameTitle.textContent = gameInfo.title;
    if (elements.gameDescription) elements.gameDescription.textContent = gameInfo.description;
    if (elements.versionText) elements.versionText.textContent = '版本 ' + currentVersion + '.0';
    if (elements.gameStats) elements.gameStats.textContent = gameCode.length + ' 字符';
    
    // 加载游戏到 iframe
    if (elements.gameFrame) {
        elements.gameFrame.srcdoc = gameCode;
    }
}

// 分析提示
function analyzePrompt(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('射击') || p.includes('太空')) {
        return {title: '星际战士', description: '太空射击游戏', type: '动作', style: '科幻'};
    } else if (p.includes('合并') || p.includes('进化')) {
        return {title: '进化合并', description: '合并养成游戏', type: '休闲', style: '可爱'};
    } else if (p.includes('平台') || p.includes('跳跃')) {
        return {title: '跳跃勇士', description: '平台跳跃游戏', type: '冒险', style: '像素'};
    } else if (p.includes('农场')) {
        return {title: '欢乐农场', description: '农场模拟游戏', type: '模拟', style: '卡通'};
    }
    return {title: '奇幻冒险', description: '冒险游戏', type: '冒险', style: '卡通'};
}

// 保存到"我的游戏"
function saveToMyGames(gameCode, prompt) {
    if (!window.GameStorage) {
        console.warn('?? GameStorage 模块未加载');
        return;
    }
    
    const gameInfo = analyzePrompt(prompt);
    currentGameId = 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const gameData = {
        id: currentGameId,
        code: gameCode,
        codeLength: gameCode.length,
        title: gameInfo.title,
        description: gameInfo.description,
        type: gameInfo.type,
        style: gameInfo.style,
        prompt: prompt,
        version: currentVersion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const result = GameStorage.saveGame(gameData);
    if (result) {
        console.log('?? 游戏已保存到"我的游戏":', currentGameId);
    }
}

// 进入修改模式
function enterModifyMode() {
    if (elements.resultSection) elements.resultSection.style.display = 'none';
    if (elements.modifySection) elements.modifySection.style.display = 'block';
    if (elements.modifyPrompt) elements.modifyPrompt.value = '';
    if (elements.modifyPrompt) elements.modifyPrompt.focus();
}

// 取消修改
function cancelModify() {
    if (elements.modifySection) elements.modifySection.style.display = 'none';
    if (elements.resultSection) elements.resultSection.style.display = 'block';
}

// 修改游戏
async function modifyGame() {
    const modifyText = elements.modifyPrompt?.value.trim();
    if (!modifyText || !currentGameCode) return;
    
    if (elements.modifySection) elements.modifySection.style.display = 'none';
    if (elements.progressSection) elements.progressSection.style.display = 'block';
    
    updateProgress(10, '正在分析修改需求...');
    
    // 保存用户对话
    if (window.ConversationUI && currentGameId) {
        ConversationUI.addMessage('user', '修改要求：' + modifyText);
    }
    
    const modifyPromptText = `请修改以下游戏代码。修改要求：${modifyText}。原游戏代码：${currentGameCode.substring(0, 10000)}。返回完整的 HTML 代码。`;
    
    try {
        updateProgress(30, '正在调用 AI 模型...');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: [
                    {role: 'system', content: '你是专业的游戏开发 AI 助手，擅长修改和优化游戏代码。'},
                    {role: 'user', content: modifyPromptText}
                ],
                max_tokens: 16000,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error('API 错误：' + response.status);
        }
        
        updateProgress(60, '正在处理修改后的代码...');
        
        const result = await response.json();
        let gameCode = result.choices?.[0]?.message?.content;
        
        if (!gameCode) {
            throw new Error('API 返回数据为空');
        }
        
        // 保存 AI 对话
        if (window.ConversationUI && currentGameId) {
            ConversationUI.addMessage('assistant', '修改完成！新代码长度：' + gameCode.length + ' 字符');
        }
        
        gameCode = extractHtmlCode(gameCode);
        currentGameCode = gameCode;
        currentVersion++;
        
        updateProgress(100, '修改完成！');
        
        setTimeout(() => {
            if (elements.progressSection) elements.progressSection.style.display = 'none';
            if (elements.resultSection) elements.resultSection.style.display = 'block';
            
            if (elements.versionText) elements.versionText.textContent = '版本 ' + currentVersion + '.0';
            if (elements.gameStats) elements.gameStats.textContent = gameCode.length + ' 字符';
            
            if (elements.gameFrame) {
                elements.gameFrame.srcdoc = gameCode;
            }
            
            // 更新"我的游戏"
            updateMyGames(gameCode);
        }, 500);
        
    } catch (error) {
        console.error('修改失败:', error);
        
        // 保存错误对话
        if (window.ConversationUI && currentGameId) {
            ConversationUI.addMessage('system', '修改失败：' + error.message);
        }
        
        alert('修改失败：' + error.message);
        if (elements.progressSection) elements.progressSection.style.display = 'none';
        if (elements.modifySection) elements.modifySection.style.display = 'block';
    }
}

// 更新"我的游戏"
function updateMyGames(gameCode) {
    if (!currentGameId || !window.GameStorage) return;
    
    const result = GameStorage.updateGame(currentGameId, {
        code: gameCode,
        codeLength: gameCode.length,
        version: currentVersion,
        updatedAt: new Date().toISOString()
    });
    
    if (result) {
        console.log('?? 游戏已更新到"我的游戏"');
    }
}

// 创建新游戏
function createNewGame() {
    if (!confirm('确定要创建新游戏吗？')) return;
    
    currentGameCode = null;
    currentVersion = 1;
    currentGameId = null;
    
    if (elements.prompt) elements.prompt.value = '';
    if (elements.modifyPrompt) elements.modifyPrompt.value = '';
    if (elements.createForm) elements.createForm.style.display = 'block';
    if (elements.examplePrompts) elements.examplePrompts.style.display = 'block';
    if (elements.resultSection) elements.resultSection.style.display = 'none';
    if (elements.modifySection) elements.modifySection.style.display = 'none';
    
    handlePromptInput();
}

// 播放游戏
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

// 检查编辑状态
function checkEditState() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    
    if (editId) {
        const data = sessionStorage.getItem('editingGame');
        if (data) {
            try {
                const game = JSON.parse(data);
                if (game.id === editId && game.code) {
                    currentGameId = game.id;
                    currentGameCode = game.code;
                    currentVersion = game.version || 1;
                    console.log('? 加载编辑中的游戏:', currentGameId);
                }
            } catch (e) {
                console.error('? 解析编辑数据失败:', e);
            }
        }
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('? create-core.js 已加载');
