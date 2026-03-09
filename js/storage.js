// 游戏保存和管理功能

const GameStorage = {
    // 保存游戏
    saveGame: function(name, code, metadata = {}) {
        const game = {
            id: this.generateId(),
            name: name,
            code: code,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                playCount: 0,
                ...metadata
            }
        };

        try {
            const games = this.getAllGames();
            games.push(game);
            localStorage.setItem('gameai_games', JSON.stringify(games));
            console.log('游戏已保存:', name);
            return game;
        } catch (error) {
            console.error('保存游戏失败:', error);
            return null;
        }
    },

    // 获取所有游戏
    getAllGames: function() {
        try {
            const data = localStorage.getItem('gameai_games');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('读取游戏列表失败:', error);
            return [];
        }
    },

    // 获取单个游戏
    getGame: function(id) {
        const games = this.getAllGames();
        return games.find(g => g.id === id);
    },

    // 更新游戏
    updateGame: function(id, updates) {
        const games = this.getAllGames();
        const index = games.findIndex(g => g.id === id);
        
        if (index === -1) {
            console.error('游戏不存在:', id);
            return null;
        }

        games[index] = {
            ...games[index],
            ...updates,
            metadata: {
                ...games[index].metadata,
                updatedAt: new Date().toISOString(),
                ...updates.metadata
            }
        };

        localStorage.setItem('gameai_games', JSON.stringify(games));
        return games[index];
    },

    // 删除游戏
    deleteGame: function(id) {
        const games = this.getAllGames();
        const filtered = games.filter(g => g.id !== id);
        
        if (filtered.length === games.length) {
            return false; // 游戏不存在
        }

        localStorage.setItem('gameai_games', JSON.stringify(filtered));
        return true;
    },

    // 增加游玩次数
    incrementPlayCount: function(id) {
        const game = this.getGame(id);
        if (game) {
            this.updateGame(id, {
                metadata: {
                    playCount: (game.metadata.playCount || 0) + 1
                }
            });
        }
    },

    // 导出游戏为 HTML 文件
    exportGame: function(id) {
        const game = this.getGame(id);
        if (!game) {
            alert('游戏不存在！');
            return;
        }

        const blob = new Blob([game.code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.sanitizeFilename(game.name)}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // 导入游戏
    importGame: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const code = e.target.result;
                
                // 尝试从代码中提取游戏名称
                let name = '导入的游戏';
                const titleMatch = code.match(/<title>(.*?)<\/title>/i);
                if (titleMatch) {
                    name = titleMatch[1].trim();
                }

                const game = this.saveGame(name, code, {
                    imported: true
                });

                if (game) {
                    resolve(game);
                } else {
                    reject(new Error('保存失败'));
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    // 生成唯一 ID
    generateId: function() {
        return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // 清理文件名
    sanitizeFilename: function(name) {
        return name.replace(/[^a-z0-9\u4e00-\u9fa5\-_]/gi, '_');
    },

    // 统计信息
    getStats: function() {
        const games = this.getAllGames();
        const totalPlays = games.reduce((sum, g) => sum + (g.metadata.playCount || 0), 0);
        
        return {
            totalGames: games.length,
            totalPlays: totalPlays,
            oldestGame: games.length > 0 ? games[0].metadata.createdAt : null,
            newestGame: games.length > 0 ? games[games.length - 1].metadata.createdAt : null
        };
    },

    // 清空所有游戏
    clearAll: function() {
        if (confirm('确定要删除所有保存的游戏吗？此操作不可恢复！')) {
            localStorage.removeItem('gameai_games');
            console.log('已清空所有游戏');
            return true;
        }
        return false;
    }
};

// 游戏管理器 UI
const GameManager = {
    container: null,

    init: function(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('容器不存在:', containerId);
            return;
        }
        this.render();
    },

    render: function() {
        const games = GameStorage.getAllGames();
        const stats = GameStorage.getStats();

        let html = `
            <div class="game-manager">
                <div class="manager-header">
                    <h2>🎮 我的游戏</h2>
                    <div class="manager-stats">
                        <span>游戏数：${stats.totalGames}</span>
                        <span>总游玩：${stats.totalPlays}</span>
                    </div>
                </div>
                
                ${games.length === 0 ? `
                    <div class="empty-state">
                        <p>还没有保存的游戏</p>
                        <p style="color: #6b6b7b; font-size: 0.9rem;">创建游戏后点击"发布"按钮保存</p>
                    </div>
                ` : `
                    <div class="games-list">
                        ${games.map(game => `
                            <div class="game-item" data-id="${game.id}">
                                <div class="game-info">
                                    <h3>${this.escapeHtml(game.name)}</h3>
                                    <div class="game-meta">
                                        <span>📅 ${this.formatDate(game.metadata.createdAt)}</span>
                                        <span>▶️ ${game.metadata.playCount || 0} 次</span>
                                        ${game.metadata.imported ? '<span>📥 已导入</span>' : ''}
                                    </div>
                                </div>
                                <div class="game-actions">
                                    <button class="btn-play" onclick="GameManager.playGame('${game.id}')">
                                        ▶️ 游玩
                                    </button>
                                    <button class="btn-export" onclick="GameStorage.exportGame('${game.id}')">
                                        📤 导出
                                    </button>
                                    <button class="btn-delete" onclick="GameManager.deleteGame('${game.id}')">
                                        🗑️ 删除
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
                
                <div class="manager-actions">
                    <label class="btn-import">
                        📥 导入游戏
                        <input type="file" accept=".html" onchange="GameManager.importGame(this)" style="display: none;">
                    </label>
                    ${games.length > 0 ? `
                        <button class="btn-clear" onclick="GameStorage.clearAll()">
                            🗑️ 清空所有
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    },

    playGame: function(id) {
        const game = GameStorage.getGame(id);
        if (!game) {
            alert('游戏不存在！');
            return;
        }

        // 增加游玩次数
        GameStorage.incrementPlayCount(id);

        // 在新窗口打开游戏
        const gameWindow = window.open('', '_blank');
        if (gameWindow) {
            gameWindow.document.open();
            gameWindow.document.write(game.code);
            gameWindow.document.close();
            gameWindow.document.title = game.name;
        }

        // 重新渲染以更新统计
        setTimeout(() => this.render(), 500);
    },

    deleteGame: function(id) {
        if (confirm('确定要删除这个游戏吗？')) {
            GameStorage.deleteGame(id);
            this.render();
        }
    },

    importGame: function(input) {
        const file = input.files[0];
        if (!file) return;

        GameStorage.importGame(file)
            .then(() => {
                alert('游戏导入成功！');
                this.render();
            })
            .catch(err => {
                alert('导入失败：' + err.message);
            });

        // 清空 input
        input.value = '';
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    formatDate: function(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes} 分钟前`;
        if (hours < 24) return `${hours} 小时前`;
        if (days < 7) return `${days} 天前`;
        
        return date.toLocaleDateString('zh-CN');
    }
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .game-manager {
        background: #1a1a2e;
        border: 1px solid #2d2d44;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
    }

    .manager-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .manager-header h2 {
        font-size: 1.5rem;
        margin: 0;
    }

    .manager-stats {
        display: flex;
        gap: 1.5rem;
        color: #a0a0b0;
        font-size: 0.9rem;
    }

    .games-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .game-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #252542;
        border-radius: 8px;
        padding: 1rem;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .game-info h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
    }

    .game-meta {
        display: flex;
        gap: 1rem;
        color: #6b6b7b;
        font-size: 0.85rem;
    }

    .game-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .game-actions button,
    .btn-import {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    }

    .btn-play {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
    }

    .btn-export {
        background: #2d2d44;
        color: #a0a0b0;
    }

    .btn-delete {
        background: #ef4444;
        color: white;
    }

    .btn-import {
        background: #10b981;
        color: white;
    }

    .btn-clear {
        background: #ef4444;
        color: white;
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .manager-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #2d2d44;
    }

    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #6b6b7b;
    }

    @media (max-width: 768px) {
        .game-item {
            flex-direction: column;
            align-items: stretch;
        }

        .game-actions {
            justify-content: stretch;
        }

        .game-actions button {
            flex: 1;
            justify-content: center;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ 游戏存储和管理功能已加载');
