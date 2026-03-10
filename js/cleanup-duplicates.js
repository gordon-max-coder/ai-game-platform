/**
 * GameAI - 清理重复游戏数据
 * 运行此脚本可以清理现有的重复游戏版本
 */

function cleanupDuplicateGames() {
    console.log('🧹 开始清理重复游戏...');
    
    const request = indexedDB.open('GameAI_DB', 1);
    
    request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        
        // 获取当前用户
        const currentUser = JSON.parse(localStorage.getItem('gameai_current_user'));
        if (!currentUser) {
            console.error('❌ 未登录');
            return;
        }
        
        const getUserRequest = store.get(currentUser.id);
        
        getUserRequest.onsuccess = () => {
            const user = getUserRequest.result;
            if (!user || !user.games) {
                console.log('✅ 没有游戏数据');
                return;
            }
            
            const games = user.games;
            const gameMap = new Map();
            const duplicates = [];
            
            // 找出重复的游戏
            games.forEach((game, index) => {
                const gameKey = (game.title || game.prompt || game.id).trim().toLowerCase();
                
                if (gameMap.has(gameKey)) {
                    const existing = gameMap.get(gameKey);
                    
                    // 保留版本高的
                    if ((game.version || 1) > (existing.version || 1)) {
                        duplicates.push(existing.index);
                        gameMap.set(gameKey, { game, index });
                    } else {
                        duplicates.push(index);
                    }
                } else {
                    gameMap.set(gameKey, { game, index });
                }
            });
            
            if (duplicates.length === 0) {
                console.log('✅ 没有重复游戏');
                return;
            }
            
            console.log('📊 找到', duplicates.length, '个重复版本');
            
            // 删除重复的
            duplicates.sort((a, b) => b - a); // 从后往前删除
            duplicates.forEach(index => {
                games.splice(index, 1);
            });
            
            // 更新用户数据
            user.games = games;
            user.updatedAt = new Date().toISOString();
            
            const putRequest = store.put(user);
            
            putRequest.onsuccess = () => {
                console.log('✅ 清理完成！');
                console.log('📊 剩余游戏数:', games.length);
                console.log('🗑️ 删除重复数:', duplicates.length);
                
                // 刷新页面
                setTimeout(() => {
                    location.reload();
                }, 2000);
            };
        };
    };
}

// 在控制台运行：cleanupDuplicateGames()
console.log('💡 在控制台运行：cleanupDuplicateGames() 来清理重复游戏');
