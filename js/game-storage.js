/**
 * GameAI - 游戏存储管理模块
 * 负责游戏的保存、加载、更新、删除等操作
 */

const GameStorage = (function() {
    const STORAGE_KEY = 'gameai_my_games';
    const VERSION = '1.0';

    // 数据验证
    function validateGame(game) {
        if (!game || typeof game !== 'object') {
            console.error('❌ 游戏数据无效');
            return false;
        }
        if (!game.id || typeof game.id !== 'string') {
            console.error('❌ 游戏 ID 无效');
            return false;
        }
        if (!game.code || typeof game.code !== 'string') {
            console.error('❌ 游戏代码无效');
            return false;
        }
        return true;
    }

    // 生成唯一 ID
    function generateId() {
        return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 安全地读取 localStorage
    function safeGetStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];
            
            const parsed = JSON.parse(data);
            if (!Array.isArray(parsed)) {
                console.warn('⚠️ 存储数据格式错误，重置为空数组');
                return [];
            }
            return parsed;
        } catch (error) {
            console.error('❌ 读取存储失败:', error);
            return [];
        }
    }

    // 安全地写入 localStorage
    function safeSetStorage(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('❌ 写入存储失败:', error);
            if (error.name === 'QuotaExceededError') {
                alert('⚠️ 存储空间已满！请删除一些旧游戏。');
            }
            return false;
        }
    }

    // 公开方法
    return {
        /**
         * 保存新游戏
         * @param {Object} gameData - 游戏数据
         * @returns {Object|null} 保存的游戏数据，失败返回 null
         */
        saveGame: function(gameData) {
            if (!validateGame(gameData)) {
                return null;
            }

            try {
                const games = safeGetStorage();
                
                // 检查是否已存在
                const existingIndex = games.findIndex(g => g.id === gameData.id);
                
                if (existingIndex !== -1) {
                    console.warn('⚠️ 游戏已存在，执行更新操作');
                    return this.updateGame(gameData.id, gameData);
                }

                // 添加新游戏（放到最前面）
                games.unshift({
                    ...gameData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    storageVersion: VERSION
                });

                if (safeSetStorage(games)) {
                    console.log('✅ 游戏已保存:', gameData.id);
                    return gameData;
                }
                return null;
            } catch (error) {
                console.error('❌ 保存游戏失败:', error);
                return null;
            }
        },

        /**
         * 更新游戏到"我的游戏"
         * @param {string} gameId - 游戏 ID
         * @param {Object} updates - 更新的数据
         * @returns {Object|null} 更新后的游戏数据，失败返回 null
         */
        updateGame: function(gameId, updates) {
            if (!gameId || typeof gameId !== 'string') {
                console.error('❌ 游戏 ID 无效');
                return null;
            }

            try {
                const games = safeGetStorage();
                const index = games.findIndex(g => g.id === gameId);

                if (index === -1) {
                    console.error('❌ 游戏不存在:', gameId);
                    return null;
                }

                // 保留原有数据，更新指定字段
                games[index] = {
                    ...games[index],
                    ...updates,
                    updatedAt: new Date().toISOString(),
                    storageVersion: VERSION
                };

                if (safeSetStorage(games)) {
                    console.log('✅ 游戏已更新:', gameId);
                    return games[index];
                }
                return null;
            } catch (error) {
                console.error('❌ 更新游戏失败:', error);
                return null;
            }
        },

        /**
         * 重命名游戏
         * @param {string} gameId - 游戏 ID
         * @param {string} newTitle - 新标题
         * @returns {boolean} 是否成功
         */
        renameGame: function(gameId, newTitle) {
            if (!gameId || !newTitle) return false;
            
            return this.updateGame(gameId, { title: newTitle }) !== null;
        },

        /**
         * 删除游戏
         * @param {string} gameId - 游戏 ID
         * @returns {boolean} 是否删除成功
         */
        deleteGame: function(gameId) {
            if (!gameId || typeof gameId !== 'string') {
                console.error('❌ 游戏 ID 无效');
                return false;
            }

            try {
                const games = safeGetStorage();
                const filtered = games.filter(g => g.id !== gameId);

                if (filtered.length === games.length) {
                    console.warn('⚠️ 游戏不存在:', gameId);
                    return false;
                }

                if (safeSetStorage(filtered)) {
                    console.log('✅ 游戏已删除:', gameId);
                    return true;
                }
                return false;
            } catch (error) {
                console.error('❌ 删除游戏失败:', error);
                return false;
            }
        },

        /**
         * 获取单个游戏
         * @param {string} gameId - 游戏 ID
         * @returns {Object|null} 游戏数据，不存在返回 null
         */
        getGame: function(gameId) {
            if (!gameId) return null;

            const games = safeGetStorage();
            return games.find(g => g.id === gameId) || null;
        },

        /**
         * 获取所有游戏（按游戏标题分组，只显示最新版本）
         * @returns {Array} 游戏数组（每个游戏只显示最新版本的入口）
         */
        getAllGames: function() {
            const games = safeGetStorage();
            
            // 按游戏标题分组，保留最新版本
            const gameMap = new Map();
            
            games.forEach(game => {
                // 使用标题作为游戏唯一标识（如果没有标题则用 prompt）
                const gameKey = (game.title || game.prompt || game.id).trim().toLowerCase();
                
                const existing = gameMap.get(gameKey);
                
                // 如果是新游戏，或者版本更新，则替换
                if (!existing || (game.version || 1) > (existing.version || 1)) {
                    gameMap.set(gameKey, game);
                }
            });
            
            // 转换回数组并按创建时间排序
            return Array.from(gameMap.values())
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        },

        /**
         * 保存游戏（自动删除旧版本）
         * @param {Object} gameData - 游戏数据
         * @returns {Object|null} 保存的游戏数据，失败返回 null
         */
        saveGame: function(gameData) {
            if (!validateGame(gameData)) {
                return null;
            }

            try {
                const games = safeGetStorage();
                
                // 找到同一游戏的其他版本
                const gameKey = (gameData.title || gameData.prompt || gameData.id).trim().toLowerCase();
                const oldVersions = games.filter(g => 
                    (g.title || g.prompt || g.id).trim().toLowerCase() === gameKey && 
                    g.id !== gameData.id
                );
                
                // 合并对话历史
                if (oldVersions.length > 0 && gameData.conversationHistory) {
                    // 从旧版本收集对话历史
                    const allHistory = [];
                    oldVersions.forEach(oldGame => {
                        if (oldGame.conversationHistory) {
                            allHistory.push(...oldGame.conversationHistory);
                        }
                    });
                    // 添加新对话
                    allHistory.push(...gameData.conversationHistory);
                    // 去重（按时间戳）
                    gameData.conversationHistory = allHistory.filter((item, index, self) =>
                        index === self.findIndex(t => t.timestamp === item.timestamp)
                    );
                }
                
                // 删除旧版本
                if (oldVersions.length > 0) {
                    oldVersions.forEach(oldGame => {
                        games.splice(games.indexOf(oldGame), 1);
                        console.log('🗑️ 删除旧版本:', oldGame.title, 'v' + (oldGame.version || 1));
                    });
                }
                
                // 添加新版本到最前面
                games.unshift({
                    ...gameData,
                    createdAt: gameData.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    storageVersion: VERSION
                });

                if (safeSetStorage(games)) {
                    console.log('✅ 游戏已保存:', gameData.id, 'v' + (gameData.version || 1));
                    console.log('💬 对话历史:', gameData.conversationHistory?.length || 0, '条');
                    return gameData;
                }
                return null;
            } catch (error) {
                console.error('❌ 保存游戏失败:', error);
                return null;
            }
        },

        /**
         * 添加对话记录到游戏
         * @param {string} gameId - 游戏 ID
         * @param {Object} conversation - 对话记录 {role, content, timestamp}
         * @returns {boolean} 是否成功
         */
        addConversation: function(gameId, conversation) {
            if (!gameId || !conversation) {
                return false;
            }

            try {
                const games = safeGetStorage();
                const index = games.findIndex(g => g.id === gameId);
                
                if (index === -1) {
                    console.error('❌ 游戏不存在:', gameId);
                    return false;
                }

                // 初始化对话历史
                if (!games[index].conversationHistory) {
                    games[index].conversationHistory = [];
                }

                // 添加新对话
                const newConversation = {
                    ...conversation,
                    timestamp: conversation.timestamp || new Date().toISOString()
                };
                games[index].conversationHistory.push(newConversation);
                games[index].updatedAt = new Date().toISOString();

                if (safeSetStorage(games)) {
                    console.log('💬 对话已保存:', conversation.role);
                    return true;
                }
                return false;
            } catch (error) {
                console.error('❌ 保存对话失败:', error);
                return false;
            }
        },

        /**
         * 获取游戏的对话历史
         * @param {string} gameId - 游戏 ID
         * @returns {Array} 对话历史数组
         */
        getConversationHistory: function(gameId) {
            const games = safeGetStorage();
            const game = games.find(g => g.id === gameId);
            return game?.conversationHistory || [];
        },

        /**
         * 获取游戏数量
         * @returns {number} 游戏数量
         */
        getCount: function() {
            return safeGetStorage().length;
        },

        /**
         * 获取统计信息
         * @returns {Object} 统计数据
         */
        getStats: function() {
            const games = safeGetStorage();
            const totalGames = games.length;
            const totalVersions = games.reduce((sum, g) => sum + (g.version || 1), 0);
            const totalSize = games.reduce((sum, g) => sum + (g.codeLength || (g.code ? g.code.length : 0)), 0);
            
            // 最近创建的游戏
            const sorted = [...games].sort((a, b) => {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });
            const latestGame = sorted[0] || null;

            return {
                totalGames,
                totalVersions,
                totalSize,
                latestGame,
                games: games
            };
        },

        /**
         * 清空所有游戏
         * @returns {boolean} 是否清空成功
         */
        clearAll: function() {
            if (!confirm('⚠️ 确定要删除所有游戏吗？此操作无法撤销！')) {
                return false;
            }

            try {
                localStorage.removeItem(STORAGE_KEY);
                console.log('✅ 已清空所有游戏');
                return true;
            } catch (error) {
                console.error('❌ 清空游戏失败:', error);
                return false;
            }
        },

        /**
         * 导出游戏数据
         * @returns {string} JSON 格式的导出数据
         */
        exportData: function() {
            const data = {
                version: VERSION,
                exportDate: new Date().toISOString(),
                games: safeGetStorage()
            };
            return JSON.stringify(data, null, 2);
        },

        /**
         * 导入游戏数据
         * @param {string} jsonData - JSON 格式的导入数据
         * @returns {boolean} 是否导入成功
         */
        importData: function(jsonData) {
            try {
                const data = JSON.parse(jsonData);
                if (!data.games || !Array.isArray(data.games)) {
                    throw new Error('无效的导入数据格式');
                }

                const currentGames = safeGetStorage();
                const merged = [...data.games, ...currentGames];
                
                // 去重（保留最新的）
                const uniqueGames = merged.reduce((acc, game) => {
                    const existing = acc.find(g => g.id === game.id);
                    if (!existing) {
                        acc.push(game);
                    } else if (new Date(game.updatedAt || 0) > new Date(existing.updatedAt || 0)) {
                        acc[acc.indexOf(existing)] = game;
                    }
                    return acc;
                }, []);

                if (safeSetStorage(uniqueGames)) {
                    console.log('✅ 导入了', data.games.length, '个游戏');
                    return true;
                }
                return false;
            } catch (error) {
                console.error('❌ 导入数据失败:', error);
                return false;
            }
        },

        /**
         * 获取存储版本
         * @returns {string} 版本号
         */
        getVersion: function() {
            return VERSION;
        }
    };
})();

// 导出到全局
window.GameStorage = GameStorage;
console.log('✅ GameStorage 模块已加载 v' + GameStorage.getVersion());
