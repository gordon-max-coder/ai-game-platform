/**
 * Godot Web Editor 集成模块
 * 在游戏预览页面点击编辑按钮时打开 Godot 编辑器
 */

window.GodotEditorIntegration = (function() {
    let editorWindow = null;
    let currentGameCode = null;
    let editorServerUrl = 'http://localhost:3000';

    /**
     * 打开 Godot 编辑器
     * @param {Object} gameData - 游戏数据对象
     */
    function openEditor(gameData) {
        if (!gameData || !gameData.code) {
            alert('❌ 游戏数据无效');
            return;
        }

        currentGameCode = gameData.code;

        // 检查编辑器服务器是否运行
        checkEditorServer()
            .then(isRunning => {
                if (!isRunning) {
                    alert('⚠️ Godot 编辑器服务器未启动！\n\n请先运行：\ncd godot-web-editor\nnpm start');
                    return;
                }

                // 打开编辑器窗口
                openEditorWindow(gameData);
            })
            .catch(error => {
                console.error('检查编辑器服务器失败:', error);
                alert('❌ 无法连接到编辑器服务器');
            });
    }

    /**
     * 检查编辑器服务器是否运行
     */
    async function checkEditorServer() {
        try {
            const response = await fetch(`${editorServerUrl}/api/health`, {
                method: 'GET',
                mode: 'cors'
            });
            return response.ok;
        } catch (error) {
            console.warn('编辑器服务器未运行:', error.message);
            return false;
        }
    }

    /**
     * 打开编辑器窗口
     */
    function openEditorWindow(gameData) {
        // 如果已有编辑器窗口，聚焦它
        if (editorWindow && !editorWindow.closed) {
            editorWindow.focus();
            // 发送游戏数据到编辑器
            sendGameDataToEditor(gameData);
            return;
        }

        // 打开新窗口
        editorWindow = window.open(
            `${editorServerUrl}/editor.html`,
            'GodotWebEditor',
            'width=1400,height=900,resizable=yes,scrollbars=yes'
        );

        if (!editorWindow) {
            alert('❌ 无法打开编辑器窗口，请检查浏览器弹窗设置');
            return;
        }

        // 等待编辑器加载完成后发送游戏数据
        editorWindow.addEventListener('load', () => {
            sendGameDataToEditor(gameData);
        });

        // 监听编辑器窗口关闭
        const checkClosed = setInterval(() => {
            if (editorWindow && editorWindow.closed) {
                clearInterval(checkClosed);
                editorWindow = null;
                console.log('🎮 编辑器已关闭');
            }
        }, 1000);

        console.log('🎮 Godot 编辑器已打开');
    }

    /**
     * 发送游戏数据到编辑器
     */
    function sendGameDataToEditor(gameData) {
        if (!editorWindow || editorWindow.closed) return;

        // 使用 postMessage 发送数据
        editorWindow.postMessage({
            type: 'LOAD_GAME',
            data: {
                id: gameData.id,
                code: gameData.code,
                title: gameData.title,
                version: gameData.version
            }
        }, editorServerUrl);

        console.log('📤 发送游戏数据到编辑器:', gameData.title);
    }

    /**
     * 从编辑器接收数据
     */
    function receiveFromEditor(event) {
        // 验证来源
        if (event.origin !== editorServerUrl) {
            console.warn('⚠️ 忽略来自未知来源的消息:', event.origin);
            return;
        }

        const message = event.data;

        switch (message.type) {
            case 'GAME_UPDATED':
                // 游戏已更新，保存新代码
                handleGameUpdated(message.data);
                break;

            case 'EDITOR_READY':
                // 编辑器已就绪
                console.log('✅ 编辑器已就绪');
                break;

            case 'EXPORT_REQUEST':
                // 导出请求
                handleExportRequest(message.data);
                break;

            default:
                console.log('📨 收到编辑器消息:', message.type);
        }
    }

    /**
     * 处理游戏更新
     */
    function handleGameUpdated(data) {
        console.log('💾 游戏已更新:', data);

        // 保存到 localStorage 或触发父页面更新
        if (window.GameStorage && data.id) {
            try {
                const games = window.GameStorage.getAllGames();
                const game = games.find(g => g.id === data.id);
                
                if (game) {
                    game.code = data.code;
                    game.version = (game.version || 1) + 1;
                    
                    window.GameStorage.saveGame(game);
                    
                    // 通知父页面刷新
                    if (window.location.href.includes('create.html')) {
                        // 在当前页面，直接更新预览
                        updatePreview(game.code);
                    } else {
                        // 在其他页面，提示用户
                        alert('✅ 游戏已更新！版本：v' + game.version + '.0');
                    }
                    
                    console.log('✅ 游戏已保存');
                }
            } catch (error) {
                console.error('❌ 保存游戏失败:', error);
            }
        }
    }

    /**
     * 处理导出请求
     */
    function handleExportRequest(data) {
        console.log('📦 导出请求:', data);

        if (data.format === 'godot') {
            // 导出为 Godot 项目
            exportToGodot(data.gameData);
        } else if (data.format === 'html') {
            // 导出为 HTML 文件
            exportToHtml(data.gameData);
        }
    }

    /**
     * 导出为 Godot 项目
     */
    async function exportToGodot(gameData) {
        try {
            const response = await fetch(`${editorServerUrl}/api/godot/export`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    htmlCode: gameData.code,
                    projectName: gameData.title || 'MyGame'
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${gameData.title || 'game'}_godot.zip`;
                a.click();
                window.URL.revokeObjectURL(url);
                console.log('✅ Godot 项目已导出');
            } else {
                throw new Error('导出失败');
            }
        } catch (error) {
            console.error('❌ 导出 Godot 项目失败:', error);
            alert('❌ 导出失败：' + error.message);
        }
    }

    /**
     * 导出为 HTML 文件
     */
    function exportToHtml(gameData) {
        const blob = new Blob([gameData.code], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${gameData.title || 'game'}.html`;
        a.click();
        window.URL.revokeObjectURL(url);
        console.log('✅ HTML 文件已导出');
    }

    /**
     * 更新预览（用于 create.html 页面）
     */
    function updatePreview(code) {
        const iframe = document.getElementById('gameFrame');
        if (iframe) {
            iframe.srcdoc = code;
            iframe.style.display = 'block';
            
            // 隐藏占位符
            const placeholder = document.querySelector('.preview-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // 显示操作按钮
            const actions = document.getElementById('previewActions');
            if (actions) {
                actions.style.display = 'flex';
            }
        }
    }

    /**
     * 绑定到编辑按钮
     */
    function bindToEditButton() {
        // 等待页面加载
        setTimeout(() => {
            // 在 create.html 页面绑定
            const editorBtn = document.getElementById('editorBtn');
            if (editorBtn) {
                editorBtn.addEventListener('click', () => {
                    const currentGame = getCurrentGameFromPage();
                    if (currentGame) {
                        openEditor(currentGame);
                    } else {
                        alert('⚠️ 请先加载一个游戏');
                    }
                });
                console.log('✅ Godot 编辑器按钮已绑定');
            }

            // 在 games.html / my-games.html 页面绑定
            document.addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('btn-edit-card')) {
                    const card = e.target.closest('.game-card');
                    if (card) {
                        const gameId = card.dataset.gameId;
                        const game = window.GameStorage.getGameById(gameId);
                        if (game) {
                            openEditor(game);
                        }
                    }
                }
            });
        }, 500);
    }

    /**
     * 从页面获取当前游戏数据
     */
    function getCurrentGameFromPage() {
        // 尝试从不同位置获取游戏数据
        let gameData = null;

        // 1. 从全局变量获取
        if (window.currentGame) {
            gameData = window.currentGame;
        }
        // 2. 从 sessionStorage 获取
        else if (sessionStorage.getItem('currentGame')) {
            gameData = JSON.parse(sessionStorage.getItem('currentGame'));
        }
        // 3. 从编辑状态获取
        else if (sessionStorage.getItem('editingGame')) {
            gameData = JSON.parse(sessionStorage.getItem('editingGame'));
        }

        return gameData;
    }

    /**
     * 初始化集成
     */
    function init() {
        console.log('🎮 Godot 编辑器集成模块已加载');
        
        // 监听来自编辑器的消息
        window.addEventListener('message', receiveFromEditor);
        
        // 绑定编辑按钮
        bindToEditButton();

        // 导出公共方法
        window.openGodotEditor = openEditor;
    }

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        openEditor,
        checkEditorServer,
        init
    };
})();

console.log('✅ GodotEditorIntegration 模块已加载');
