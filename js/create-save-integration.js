/**
 * 在 create.html 底部添加此脚本引用
 * 在 </body> 标签前添加：
 * <script src="js/game-storage.js"></script>
 * <script src="js/create-save-integration.js"></script>
 */

// 全局变量
let currentGameId = null;

// 在 generateGame 函数成功后调用
function onSaveGameSuccess(gameCode, prompt) {
    const gameInfo = analyzePrompt(prompt);
    gameInfo.prompt = prompt;
    
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
    
    if (window.GameStorage) {
        const result = GameStorage.saveGame(gameData);
        if (result) {
            console.log('💾 游戏已保存到"我的游戏":', currentGameId);
            console.log('🎮 游戏标题:', gameInfo.title);
            console.log('📊 版本:', currentVersion);
            if (typeof log === 'function') {
                log('💾 游戏已保存到"我的游戏"');
            }
        }
    }
}

// 在 modifyGame 函数成功后调用
function onUpdateGameSuccess(gameCode) {
    if (!currentGameId || !window.GameStorage) return;
    
    const gameInfo = {
        code: gameCode,
        codeLength: gameCode.length,
        version: currentVersion
    };
    
    const result = GameStorage.updateGame(currentGameId, gameInfo);
    if (result) {
        console.log('💾 游戏已更新到"我的游戏":', currentGameId);
        if (typeof log === 'function') {
            log('💾 游戏已更新到"我的游戏"');
        }
    }
}

// 检查编辑状态
function checkEditState() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        const editingData = sessionStorage.getItem('editingGame');
        if (editingData) {
            try {
                const data = JSON.parse(editingData);
                if (data.id === editId) {
                    currentGameId = data.id;
                    console.log('✅ 加载编辑中的游戏:', currentGameId);
                    return true;
                }
            } catch (e) {
                console.error('❌ 解析编辑数据失败:', e);
            }
        }
    }
    return false;
}

// 页面加载时检查
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkEditState);
} else {
    checkEditState();
}

console.log('✅ 游戏保存集成模块已加载');
