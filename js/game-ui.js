/**
 * GameAI - 游戏 UI 渲染模块
 * 负责游戏列表、卡片的渲染和交互
 */

const GameUI = (function() {
    // 格式化文件大小
    function formatSize(bytes) {
        if (bytes < 1000) return bytes + ' B';
        if (bytes < 1000000) return (bytes / 1000).toFixed(1) + ' KB';
        return (bytes / 1000000).toFixed(1) + ' MB';
    }

    // 格式化日期
    function formatDate(dateStr) {
        if (!dateStr) return '未知';
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // HTML 转义
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 创建游戏卡片
    function createGameCard(game) {
        if (!game || !game.id) {
            console.error('❌ 无效的游戏数据');
            return null;
        }

        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.gameId = game.id;

        const version = game.version || 1;
        const codeLength = game.codeLength || (game.code ? game.code.length : 0);
        const gameTitle = game.title || '未命名游戏';

        // 创建预览 iframe，加载完整游戏代码
        card.innerHTML = `
            <div class="game-preview">
                <iframe class="game-preview-frame" loading="lazy"></iframe>
                <div class="game-overlay">
                    <button class="btn-play-card" data-action="play">▶️ 开始游戏</button>
                    <button class="btn-edit-card" data-action="edit">✏️ 修改</button>
                </div>
            </div>
            <div class="game-info">
                <h3 title="${escapeHtml(gameTitle)}">${escapeHtml(gameTitle)}</h3>
                <div class="game-meta">
                    <span class="game-version">v${version}.0</span>
                    <span class="game-size">${formatSize(codeLength)}</span>
                </div>
                <p class="game-description">${escapeHtml(game.description || '暂无描述')}</p>
                <div class="game-tags">
                    <span class="tag">${escapeHtml(game.type || '未知')}</span>
                    <span class="tag">${escapeHtml(game.style || '未知')}</span>
                    <span class="tag">${formatDate(game.createdAt)}</span>
                </div>
                <div class="game-actions-card">
                    <button class="btn-rename" data-action="rename">✏️ 重命名</button>
                    <button class="btn-delete" data-action="delete">🗑️ 删除</button>
                </div>
            </div>
        `;

        // 加载游戏到 iframe
        if (game.code) {
            const iframe = card.querySelector('.game-preview-frame');
            if (iframe) {
                // 延迟加载，避免一次性加载太多
                setTimeout(() => {
                    iframe.srcdoc = game.code;
                }, 100);
            }
        }

        // 绑定事件
        bindCardEvents(card, game);

        return card;
    }

    // 绑定卡片事件
    function bindCardEvents(card, game) {
        const buttons = card.querySelectorAll('button[data-action]');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = button.dataset.action;
                
                switch (action) {
                    case 'play':
                        handlePlayGame(game);
                        break;
                    case 'edit':
                        handleEditGame(game);
                        break;
                    case 'delete':
                        handleDeleteGame(game, card);
                        break;
                    case 'rename':
                        handleRenameGame(game, card);
                        break;
                }
            });
        });
    }

    // 播放游戏
    function handlePlayGame(game) {
        if (!game || !game.code) {
            alert('❌ 游戏数据无效');
            return;
        }

        try {
            const win = window.open('', '_blank', 'width=1024,height=768');
            if (!win) {
                alert('❌ 无法打开新窗口，请检查浏览器弹窗设置');
                return;
            }
            
            win.document.open();
            win.document.write(game.code);
            win.document.close();
            win.document.title = game.title || 'AI 游戏';
            
            console.log('▶️ 开始游戏:', game.title);
        } catch (error) {
            console.error('❌ 打开游戏失败:', error);
            alert('❌ 打开游戏失败：' + error.message);
        }
    }

    // 编辑游戏
    function handleEditGame(game) {
        if (!game || !game.id) {
            alert('❌ 游戏数据无效');
            return;
        }

        try {
            // 保存编辑状态到 sessionStorage
            sessionStorage.setItem('editingGame', JSON.stringify({
                id: game.id,
                code: game.code,
                version: game.version,
                title: game.title,
                description: game.description,
                type: game.type,
                style: game.style,
                prompt: game.prompt
            }));

            // 跳转到创建页面
            window.location.href = 'create.html?edit=' + encodeURIComponent(game.id);
            
            console.log('✏️ 编辑游戏:', game.title);
        } catch (error) {
            console.error('❌ 准备编辑失败:', error);
            alert('❌ 打开编辑页面失败：' + error.message);
        }
    }

    // 删除游戏
    function handleDeleteGame(game, cardElement) {
        if (!game || !game.id) {
            alert('❌ 游戏数据无效');
            return;
        }

        if (!confirm('⚠️ 确定要删除游戏 "' + (game.title || '未命名') + '" 吗？\n此操作无法撤销！')) {
            return;
        }

        try {
            const success = GameStorage.deleteGame(game.id);
            
            if (success) {
                // 从 UI 中移除
                if (cardElement && cardElement.parentNode) {
                    cardElement.style.opacity = '0';
                    cardElement.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        cardElement.remove();
                        // 检查是否为空
                        checkEmptyState();
                        // 更新统计
                        if (window.updateStats) {
                            window.updateStats();
                        }
                    }, 300);
                }
                
                console.log('🗑️ 游戏已删除:', game.id);
            } else {
                alert('❌ 删除失败，请重试');
            }
        } catch (error) {
            console.error('❌ 删除游戏失败:', error);
            alert('❌ 删除失败：' + error.message);
        }
    }

    // 重命名游戏
    function handleRenameGame(game, cardElement) {
        if (!game || !game.id) {
            alert('❌ 游戏数据无效');
            return;
        }

        const newTitle = prompt('请输入新的游戏名称：', game.title || '未命名游戏');
        
        if (!newTitle || newTitle.trim() === '') {
            return; // 用户取消或输入为空
        }

        try {
            const success = GameStorage.renameGame(game.id, newTitle.trim());
            
            if (success) {
                // 更新 UI
                const titleEl = cardElement.querySelector('h3');
                if (titleEl) {
                    titleEl.textContent = newTitle.trim();
                    titleEl.title = newTitle.trim();
                }
                
                console.log('✏️ 游戏已重命名:', newTitle);
                alert('✅ 游戏名称已更新为：' + newTitle);
                
                // 重新渲染列表以更新统计
                if (window.updateStats) {
                    window.updateStats();
                }
            } else {
                alert('❌ 重命名失败，请重试');
            }
        } catch (error) {
            console.error('❌ 重命名游戏失败:', error);
            alert('❌ 重命名失败：' + error.message);
        }
    }

    // 检查空状态
    function checkEmptyState() {
        const games = GameStorage.getAllGames();
        const grid = document.getElementById('gamesGrid');
        const emptyState = document.getElementById('emptyState');

        if (!grid || !emptyState) return;

        if (games.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            grid.style.display = 'grid';
            emptyState.style.display = 'none';
        }
    }

    // 渲染游戏列表
    function renderGamesList(containerId) {
        const container = document.getElementById(containerId || 'gamesGrid');
        
        if (!container) {
            console.error('❌ 容器元素不存在:', containerId);
            return;
        }

        try {
            const games = GameStorage.getAllGames();
            container.innerHTML = '';

            if (games.length === 0) {
                checkEmptyState();
                return;
            }

            games.forEach(game => {
                const card = createGameCard(game);
                if (card) {
                    container.appendChild(card);
                }
            });

            checkEmptyState();
            console.log('✅ 渲染了', games.length, '个游戏（已合并相同游戏的不同版本）');
        } catch (error) {
            console.error('❌ 渲染游戏列表失败:', error);
            container.innerHTML = '<p class="error">加载失败，请刷新页面重试</p>';
        }
    }

    // 更新统计信息
    function updateStats() {
        try {
            const stats = GameStorage.getStats();
            
            const totalGamesEl = document.getElementById('totalGames');
            const totalVersionsEl = document.getElementById('totalVersions');
            const totalSizeEl = document.getElementById('totalSize');

            if (totalGamesEl) totalGamesEl.textContent = stats.totalGames;
            if (totalVersionsEl) totalVersionsEl.textContent = stats.totalVersions;
            if (totalSizeEl) totalSizeEl.textContent = formatSize(stats.totalSize);

        } catch (error) {
            console.error('❌ 更新统计失败:', error);
        }
    }

    // 公开方法
    return {
        renderGamesList: renderGamesList,
        updateStats: updateStats,
        createGameCard: createGameCard,
        formatSize: formatSize,
        formatDate: formatDate,
        escapeHtml: escapeHtml
    };
})();

// 导出到全局
window.GameUI = GameUI;
console.log('✅ GameUI 模块已加载');
