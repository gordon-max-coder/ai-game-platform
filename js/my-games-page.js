/**
 * GameAI - 我的游戏页面逻辑
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 我的游戏页面已加载');
    
    // 自动清理重复游戏
    cleanupDuplicateGames();
    
    // 渲染游戏列表
    GameUI.renderGamesList('gamesGrid');
    
    // 更新统计
    GameUI.updateStats();
    
    // 检查是否有编辑中的游戏
    checkEditGame();
});

// 清理重复游戏
function cleanupDuplicateGames() {
    const games = GameStorage.getAllGames();
    const allGames = JSON.parse(localStorage.getItem('gameai_my_games') || '[]');
    
    if (allGames.length === games.length) {
        return; // 没有重复
    }
    
    console.log('🧹 发现重复游戏，正在清理...');
    console.log('清理前:', allGames.length, '个');
    console.log('清理后:', games.length, '个');
    
    // 保存清理后的数据
    localStorage.setItem('gameai_my_games', JSON.stringify(games));
    
    console.log('✅ 清理完成！');
}

// 更新统计（暴露到全局）
window.updateStats = function() {
    GameUI.updateStats();
};

// 导出数据
window.handleExport = function() {
    try {
        const data = GameStorage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gameai-games-export-' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ 数据已导出');
        alert('✅ 游戏数据已导出到下载文件夹');
    } catch (error) {
        console.error('❌ 导出失败:', error);
        alert('❌ 导出失败：' + error.message);
    }
};

// 导入数据
window.handleImport = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const success = GameStorage.importData(event.target.result);
                
                if (success) {
                    alert('✅ 游戏数据导入成功！');
                    // 重新加载列表
                    GameUI.renderGamesList('gamesGrid');
                    GameUI.updateStats();
                } else {
                    alert('❌ 导入失败，请检查文件格式');
                }
            } catch (error) {
                console.error('❌ 导入失败:', error);
                alert('❌ 导入失败：' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};

// 检查是否有编辑中的游戏
function checkEditGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        const editingData = sessionStorage.getItem('editingGame');
        if (editingData) {
            console.log('ℹ️ 检测到编辑中的游戏:', editId);
            // 可以在这里显示提示或自动跳转
        }
    }
}
