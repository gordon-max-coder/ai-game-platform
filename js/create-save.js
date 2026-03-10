/**
 * GameAI - 创建页面游戏保存逻辑
 * 在 create.html 页面底部引入此脚本
 */

// 当前游戏 ID
let currentGameId = null;

/**
 * 保存游戏到"我的游戏"
 */
function saveGameToStorage(gameCode, gameInfo) {
    try {
        currentGameId = 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const gameData = {
            id: currentGameId,
            code: gameCode,
            codeLength: gameCode.length,
            title: gameInfo.title || '未命名游戏',
            description: gameInfo.description || '暂无描述',
            type: gameInfo.type || '未知',
            style: gameInfo.style || '未知',
            prompt: gameInfo.prompt || '',
            version: currentVersion || 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const result = GameStorage.saveGame(gameData);
        
        if (result) {
            console.log('💾 游戏已保存到"我的游戏":', currentGameId);
            return currentGameId;
        } else {
            console.error('❌ 保存游戏失败');
            return null;
        }
    } catch (error) {
        console.error('❌ 保存游戏异常:', error);
        return null;
    }
}

/**
 * 更新游戏到"我的游戏"
 */
function updateGameInStorage(gameCode, gameInfo) {
    if (!currentGameId) {
        console.warn('⚠️ 没有当前游戏 ID，执行保存操作');
        return saveGameToStorage(gameCode, gameInfo);
    }

    try {
        const updates = {
            code: gameCode,
            codeLength: gameCode.length,
            version: currentVersion || 1,
            title: gameInfo.title,
            description: gameInfo.description,
            type: gameInfo.type,
            style: gameInfo.style
        };

        const result = GameStorage.updateGame(currentGameId, updates);
        
        if (result) {
            console.log('💾 游戏已更新到"我的游戏":', currentGameId);
            return true;
        } else {
            console.error('❌ 更新游戏失败');
            return false;
        }
    } catch (error) {
        console.error('❌ 更新游戏异常:', error);
        return false;
    }
}

/**
 * 检查是否有编辑中的游戏
 */
function checkEditingGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        const editingData = sessionStorage.getItem('editingGame');
        
        if (editingData) {
            try {
                const data = JSON.parse(editingData);
                
                if (data.id === editId && data.code) {
                    console.log('✅ 加载编辑中的游戏:', editId);
                    
                    // 设置当前游戏
                    currentGameId = data.id;
                    currentGameCode = data.code;
                    currentVersion = data.version || 1;
                    
                    // 填充表单
                    if (data.prompt && document.getElementById('prompt')) {
                        document.getElementById('prompt').value = data.prompt;
                    }
                    
                    // 显示提示
                    showEditNotice(data);
                    
                    return true;
                }
            } catch (error) {
                console.error('❌ 解析编辑数据失败:', error);
            }
        }
    }
    
    return false;
}

/**
 * 显示编辑提示
 */
function showEditNotice(data) {
    const notice = document.createElement('div');
    notice.style.cssText = `
        background: linear-gradient(135deg, var(--bg-light) 0%, var(--bg-card) 100%);
        border: 2px solid var(--primary-color);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    notice.innerHTML = `
        <span style="font-size: 2rem;">✏️</span>
        <div style="flex: 1;">
            <h3 style="margin-bottom: 0.5rem;">正在编辑：${escapeHtml(data.title || '未命名游戏')}</h3>
            <p style="color: var(--text-secondary);">
                当前版本：v${data.version || 1}.0 | 
                代码大小：${(data.code.length / 1000).toFixed(1)} KB
            </p>
        </div>
        <button onclick="this.parentElement.remove()" style="
            padding: 0.5rem 1rem;
            background: var(--bg-light);
            border: none;
            border-radius: var(--radius-sm);
            color: var(--text-secondary);
            cursor: pointer;
        ">✕</button>
    `;
    
    const createForm = document.getElementById('createForm');
    if (createForm) {
        createForm.parentNode.insertBefore(notice, createForm);
    }
}

/**
 * HTML 转义
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 页面加载时检查编辑状态
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkEditingGame);
} else {
    checkEditingGame();
}

console.log('✅ 游戏保存模块已加载');
