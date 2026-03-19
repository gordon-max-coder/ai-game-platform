/**
 * 🎮 AI Game Editor - 轻量级游戏编辑器
 * 类似 Godot 的简化版，完全在浏览器中运行
 */

// ✅ 直接定义到全局，避免 IIFE 问题
window.GameEditor = (function() {
    // 编辑器状态
    let state = {
        currentGame: null,      // 当前游戏代码
        gameObjects: [],        // 游戏对象列表
        selectedObject: null,   // 选中的对象
        isPlaying: false,       // 是否在运行
        autoSave: true,         // 自动保存
        editHistory: [],        // 修改历史（用于撤销）
        maxHistory: 20,         // 最多保留 20 条历史记录
        backups: [],            // 代码备份（用于恢复）
        maxBackups: 5           // 最多保留 5 个备份
    };

    // DOM 元素
    let elements = {};
    
    // 添加撤销按钮引用
    let undoBtn = null;

    /**
     * 初始化编辑器
     */
    function init(gameCode) {
        console.log('🎮 初始化游戏编辑器...');
        
        state.currentGame = gameCode;
        
        // 等待 DOM 准备好再缓存元素
        setTimeout(() => {
            cacheElements();
            parseGameObjects();
            renderComponentTree();
            bindEvents();
            console.log('✅ 编辑器初始化完成');
        }, 100);
    }

    /**
     * 缓存 DOM 元素
     */
    function cacheElements() {
        elements = {
            componentTree: document.getElementById('componentTree'),
            propertyPanel: document.getElementById('propertyPanel'),
            canvasPreview: document.getElementById('canvasPreview'),
            codeEditor: document.getElementById('codeEditor'),
            runBtn: document.getElementById('runBtn'),
            stopBtn: document.getElementById('stopBtn'),
            saveBtn: document.getElementById('saveBtn'),
            exportBtn: document.getElementById('exportBtn'),
            applyCodeBtn: document.getElementById('applyCodeBtn'),
            undoBtn: document.getElementById('undoBtn')
        };
        
        console.log('📦 缓存 DOM 元素:', Object.keys(elements));
    }

    /**
     * 解析游戏对象
     */
    function parseGameObjects() {
        if (!state.currentGame) return;
        
        // 智能解析 HTML5 代码中的游戏对象
        const code = state.currentGame;
        
        // 尝试从代码中提取常见游戏对象
        state.gameObjects = [];
        
        // 1. 解析 Canvas 元素
        const canvasMatch = code.match(/<canvas[^>]*id=["']([^"']+)["'][^>]*>/i);
        if (canvasMatch) {
            state.gameObjects.push({
                id: 'canvas',
                name: 'Canvas',
                type: 'Canvas',
                properties: {
                    width: 360,
                    height: 640
                }
            });
        }
        
        // 2. 解析常见游戏变量（速度、颜色、大小等）
        const speedMatch = code.match(/(?:speed|velocity|速度)\s*[:=]\s*(\d+)/i);
        const colorMatch = code.match(/(?:color|fillStyle|颜色)\s*[:=]\s*["']?([^"'\s;]+)/i);
        const sizeMatch = code.match(/(?:size|radius|width|height|大小)\s*[:=]\s*(\d+)/i);
        
        // 3. 添加 Player 对象（如果找到相关代码）
        if (code.match(/player|玩家 | 蛇 | 飞机/i)) {
            state.gameObjects.push({
                id: 'player',
                name: 'Player',
                type: 'CharacterBody2D',
                properties: {
                    position: { x: 180, y: 320 },
                    speed: speedMatch ? parseInt(speedMatch[1]) : 300,
                    color: colorMatch ? colorMatch[1] : '#ff0000',
                    size: sizeMatch ? parseInt(sizeMatch[1]) : 32
                }
            });
        }
        
        // 4. 添加 Enemy 对象（如果找到相关代码）
        if (code.match(/enemy|敌人 | 砖块|food/i)) {
            state.gameObjects.push({
                id: 'enemy',
                name: 'Enemy',
                type: 'CharacterBody2D',
                properties: {
                    position: { x: 200, y: 100 },
                    speed: 150,
                    color: '#00ff00',
                    size: 24
                }
            });
        }
        
        // 如果没有解析到任何对象，添加默认对象
        if (state.gameObjects.length === 0) {
            state.gameObjects = [
                {
                    id: 'main',
                    name: 'Main',
                    type: 'Node2D',
                    properties: {
                        width: 360,
                        height: 640
                    }
                },
                {
                    id: 'player',
                    name: 'Player',
                    type: 'CharacterBody2D',
                    properties: {
                        position: { x: 180, y: 320 },
                        speed: 300,
                        color: '#ff0000',
                        size: 32
                    }
                }
            ];
        }
        
        console.log('📦 解析游戏对象:', state.gameObjects.length);
        state.gameObjects.forEach(obj => {
            console.log(`  - ${obj.name} (${obj.type}):`, obj.properties);
        });
    }

    /**
     * 渲染组件树
     */
    function renderComponentTree() {
        if (!elements.componentTree) return;
        
        let html = '<div class="component-tree-root">';
        
        state.gameObjects.forEach(obj => {
            html += `
                <div class="component-tree-item ${state.selectedObject === obj.id ? 'selected' : ''}" 
                     data-id="${obj.id}">
                    <span class="component-icon">${getIconForType(obj.type)}</span>
                    <span class="component-name">${obj.name}</span>
                    <span class="component-type">${obj.type}</span>
                </div>
            `;
        });
        
        html += '</div>';
        elements.componentTree.innerHTML = html;
    }

    /**
     * 获取类型对应的图标
     */
    function getIconForType(type) {
        const icons = {
            'Node2D': '📁',
            'CharacterBody2D': '👤',
            'Sprite2D': '🖼️',
            'CollisionShape2D': '⬜',
            'Camera2D': '📷',
            'Label': '📝',
            'Button': '🔘',
            'AudioStreamPlayer': '🔊'
        };
        return icons[type] || '📦';
    }

    /**
     * 渲染属性面板
     */
    function renderPropertyPanel(objectId) {
        if (!elements.propertyPanel) return;
        
        const obj = state.gameObjects.find(o => o.id === objectId);
        if (!obj) {
            elements.propertyPanel.innerHTML = '<div class="property-empty">未选择对象</div>';
            return;
        }
        
        state.selectedObject = objectId;
        
        let html = `
            <div class="property-header">
                <h3>${obj.name}</h3>
                <span class="property-type">${obj.type}</span>
            </div>
            <div class="property-content">
        `;
        
        // 渲染属性
        for (const [key, value] of Object.entries(obj.properties)) {
            if (typeof value === 'object' && value !== null) {
                // 复合属性（如 position）
                html += `
                    <div class="property-group">
                        <label>${capitalize(key)}</label>
                        <div class="property-vector">
                            <div class="property-field">
                                <span class="field-label">X</span>
                                <input type="number" value="${value.x}" 
                                       data-object="${obj.id}" 
                                       data-property="${key}" 
                                       data-field="x">
                            </div>
                            <div class="property-field">
                                <span class="field-label">Y</span>
                                <input type="number" value="${value.y}" 
                                       data-object="${obj.id}" 
                                       data-property="${key}" 
                                       data-field="y">
                            </div>
                        </div>
                    </div>
                `;
            } else if (typeof value === 'number') {
                // 数值属性
                html += `
                    <div class="property-group">
                        <label>${capitalize(key)}</label>
                        <div class="property-slider">
                            <input type="range" min="0" max="1000" value="${value}" 
                                   data-object="${obj.id}" 
                                   data-property="${key}">
                            <input type="number" value="${value}" 
                                   class="property-number"
                                   data-object="${obj.id}" 
                                   data-property="${key}">
                        </div>
                    </div>
                `;
            } else if (typeof value === 'string' && value.startsWith('#')) {
                // 颜色属性
                html += `
                    <div class="property-group">
                        <label>${capitalize(key)}</label>
                        <div class="property-color">
                            <input type="color" value="${value}" 
                                   data-object="${obj.id}" 
                                   data-property="${key}">
                            <input type="text" value="${value}" 
                                   class="property-color-text"
                                   data-object="${obj.id}" 
                                   data-property="${key}">
                        </div>
                    </div>
                `;
            }
        }
        
        html += '</div>';
        elements.propertyPanel.innerHTML = html;
    }

    /**
     * 绑定事件
     */
    function bindEvents() {
        console.log('🔗 绑定事件监听器...');
        
        // 组件树点击 - 使用事件委托
        if (elements.componentTree) {
            elements.componentTree.addEventListener('click', (e) => {
                const item = e.target.closest('.component-tree-item');
                if (item) {
                    console.log('📦 点击组件:', item.dataset.id);
                    const id = item.dataset.id;
                    renderPropertyPanel(id);
                    
                    // 更新选中状态
                    document.querySelectorAll('.component-tree-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                }
            });
        }
        
        // 属性面板输入变化 - 使用事件委托
        if (elements.propertyPanel) {
            elements.propertyPanel.addEventListener('input', (e) => {
                const input = e.target;
                if (input.dataset.object && input.dataset.property) {
                    console.log('✏️ 属性变化:', input.dataset.object, input.dataset.property, input.value);
                    updateProperty(
                        input.dataset.object,
                        input.dataset.property,
                        input.value,
                        input.dataset.field
                    );
                }
            });
        }
        
        // 运行按钮
        if (elements.runBtn) {
            elements.runBtn.addEventListener('click', () => {
                console.log('▶️ 点击运行');
                runGame();
            });
        }
        
        // 停止按钮
        if (elements.stopBtn) {
            elements.stopBtn.addEventListener('click', () => {
                console.log('⏹️ 点击停止');
                stopGame();
            });
        }
        
        // 保存按钮
        if (elements.saveBtn) {
            elements.saveBtn.addEventListener('click', () => {
                console.log('💾 点击保存');
                saveGame();
            });
        }
        
        // 导出按钮
        if (elements.exportBtn) {
            elements.exportBtn.addEventListener('click', () => {
                console.log('📦 点击导出');
                exportGame();
            });
        }
        
        // 应用代码按钮
        if (elements.applyCodeBtn) {
            elements.applyCodeBtn.addEventListener('click', () => {
                console.log('✅ 点击应用代码');
                applyCodeChanges();
            });
        }
        
        // 撤销按钮
        undoBtn = document.getElementById('undoBtn');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                console.log('↩️ 点击撤销');
                undoLastEdit();
            });
            updateUndoButton();
        }
        
        console.log('✅ 事件绑定完成');
    }

    /**
     * 更新属性
     */
    function updateProperty(objectId, property, value, field) {
        const obj = state.gameObjects.find(o => o.id === objectId);
        if (!obj) return;
        
        // 更新内存中的属性
        if (field && typeof obj.properties[property] === 'object') {
            obj.properties[property][field] = parseFloat(value);
        } else if (typeof obj.properties[property] === 'number') {
            obj.properties[property] = parseFloat(value);
        } else {
            obj.properties[property] = value;
        }
        
        console.log('✏️ 属性已更新:', objectId, property, obj.properties[property]);
        
        // ✅ 使用 CodeModifier 安全修改代码
        if (window.CodeModifier) {
            const result = CodeModifier.safeReplace(
                state.currentGame,
                property,
                obj.properties[property]
            );
            
            if (result.success) {
                console.log(`✅ 代码已修改：${property} = ${result.oldValue} → ${result.newValue}`);
                
                // 记录修改历史（用于撤销）
                recordEdit(property, result.oldValue, result.newValue, state.currentGame);
                
                // 更新当前游戏代码
                state.currentGame = result.newCode;
                
                // 更新代码编辑器
                const codeEditor = document.getElementById('codeEditor');
                if (codeEditor) {
                    codeEditor.value = result.newCode;
                }
                
                showToast(`✅ 已修改 ${property}: ${result.oldValue} → ${result.newValue}`);
            } else {
                console.error('❌ 代码修改失败:', result.error);
                showToast('❌ ' + result.error);
                
                // 恢复内存中的值
                if (result.oldValue) {
                    obj.properties[property] = parseFloat(result.oldValue) || result.oldValue;
                }
            }
        } else {
            console.error('❌ CodeModifier 未加载');
            showToast('❌ 代码修改工具未加载');
        }
        
        // 自动保存
        if (state.autoSave) {
            debounceSave();
        }
    }

    /**
     * 同步属性到代码（改进版 - 精确匹配）
     */
    function syncPropertyToCode(property, value) {
        let code = state.currentGame;
        
        console.log('🔧 同步属性到代码:', property, '=', value);
        
        // 使用更精确的正则 - 使用 \b 单词边界，避免匹配 playerSpeed、enemySpeed 等
        // 匹配模式：const/let/var 变量名 = 值 或 变量名 = 值（行首）
        
        // 1. 替换速度值 - 精确匹配独立的 speed 变量
        if (property === 'speed') {
            // \b 确保只匹配独立的 speed，不匹配 playerSpeed、enemySpeed
            const speedRegex = /\b(?:const|let|var)?\s*speed\s*[:=]\s*\d+\b/gi;
            const matches = code.match(speedRegex);
            if (matches && matches.length > 0) {
                code = code.replace(speedRegex, `speed = ${value}`);
                console.log('✅ 已更新速度:', value, '(匹配', matches.length, '处)');
            } else {
                // 尝试匹配其他速度相关变量
                const altSpeedRegex = /\b(?:playerSpeed|PLAYER_SPEED|snakeSpeed)\s*[:=]\s*\d+\b/gi;
                const altMatches = code.match(altSpeedRegex);
                if (altMatches) {
                    code = code.replace(altSpeedRegex, `speed = ${value}`);
                    console.log('✅ 已更新速度变量:', value);
                }
            }
        }
        
        // 2. 替换颜色值 - 精确匹配
        if (property === 'color') {
            const colorRegex = /\b(?:const|let|var)?\s*color\s*[:=]\s*["']?#[0-9a-fA-F]{6}["']?\b/gi;
            const matches = code.match(colorRegex);
            if (matches && matches.length > 0) {
                code = code.replace(colorRegex, `color = "${value}"`);
                console.log('✅ 已更新颜色:', value, '(匹配', matches.length, '处)');
            } else {
                const altColorRegex = /\b(?:playerColor|snakeColor|fillColor)\s*[:=]\s*["']?#[0-9a-fA-F]{6}["']?\b/gi;
                const altMatches = code.match(altColorRegex);
                if (altMatches) {
                    code = code.replace(altColorRegex, `color = "${value}"`);
                    console.log('✅ 已更新颜色变量:', value);
                }
            }
        }
        
        // 3. 替换大小值 - 精确匹配
        if (property === 'size') {
            const sizeRegex = /\b(?:const|let|var)?\s*size\s*[:=]\s*\d+\b/gi;
            const matches = code.match(sizeRegex);
            if (matches && matches.length > 0) {
                code = code.replace(sizeRegex, `size = ${value}`);
                console.log('✅ 已更新大小:', value, '(匹配', matches.length, '处)');
            } else {
                const altSizeRegex = /\b(?:playerSize|snakeSize|radius|ballSize)\s*[:=]\s*\d+\b/gi;
                const altMatches = code.match(altSizeRegex);
                if (altMatches) {
                    code = code.replace(altSizeRegex, `size = ${value}`);
                    console.log('✅ 已更新大小变量:', value);
                }
            }
        }
        
        // 4. 替换位置（需要分别处理 x 和 y）- 精确匹配
        if (property === 'position') {
            const posX = value.x !== undefined ? value.x : 180;
            const posY = value.y !== undefined ? value.y : 320;
            
            // 只匹配独立的 x/y 变量声明（使用 \b 单词边界）
            const posXRegex = /\b(?:const|let|var)?\s*x\s*[:=]\s*\d+\b/gi;
            const posYRegex = /\b(?:const|let|var)?\s*y\s*[:=]\s*\d+\b/gi;
            
            const xMatches = code.match(posXRegex);
            const yMatches = code.match(posYRegex);
            
            if (xMatches && xMatches.length > 0) {
                code = code.replace(posXRegex, `x = ${posX}`);
                console.log('✅ 已更新 X 位置:', posX);
            }
            
            if (yMatches && yMatches.length > 0) {
                code = code.replace(posYRegex, `y = ${posY}`);
                console.log('✅ 已更新 Y 位置:', posY);
            }
        }
        
        return code;
    }

    /**
     * 应用属性到游戏
     */
    function applyPropertyToGame(objectId, property, value) {
        // 通过 postMessage 发送到游戏 iframe
        if (elements.canvasPreview) {
            const iframe = elements.canvasPreview.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                console.log('📨 发送 postMessage:', property, value);
                iframe.contentWindow.postMessage({
                    type: 'UPDATE_PROPERTY',
                    objectId: objectId,
                    property: property,
                    value: value
                }, '*');
            }
        }
    }

    /**
     * 记录修改历史
     */
    function recordEdit(propertyName, oldValue, newValue, codeBefore) {
        state.editHistory.push({
            timestamp: Date.now(),
            property: propertyName,
            oldValue: oldValue,
            newValue: newValue,
            codeBefore: codeBefore,
            codeAfter: state.currentGame
        });
        
        // 限制历史记录数量
        if (state.editHistory.length > state.maxHistory) {
            state.editHistory.shift();
        }
        
        // 更新撤销按钮状态
        updateUndoButton();
        
        console.log('📝 修改历史已记录:', propertyName, oldValue, '→', newValue);
    }

    /**
     * 撤销上一次修改
     */
    function undoLastEdit() {
        if (state.editHistory.length === 0) {
            showToast('⚠️ 没有可撤销的修改');
            return null;
        }
        
        const lastEdit = state.editHistory.pop();
        state.currentGame = lastEdit.codeBefore;
        
        // 更新代码编辑器
        const codeEditor = document.getElementById('codeEditor');
        if (codeEditor) {
            codeEditor.value = state.currentGame;
        }
        
        // 重新解析对象
        parseGameObjects();
        renderComponentTree();
        
        // 更新撤销按钮
        updateUndoButton();
        
        console.log('↩️ 已撤销:', lastEdit.property, lastEdit.oldValue, '←', lastEdit.newValue);
        showToast(`↩️ 已撤销 ${lastEdit.property} 的修改`);
        
        return lastEdit;
    }

    /**
     * 更新撤销按钮状态
     */
    function updateUndoButton() {
        if (undoBtn) {
            undoBtn.disabled = state.editHistory.length === 0;
            undoBtn.textContent = state.editHistory.length > 0 
                ? `↩️ 撤销 (${state.editHistory.length})` 
                : '↩️ 撤销';
        }
    }

    /**
     * 运行游戏
     */
    function runGame() {
        console.log('▶️ 运行游戏');
        state.isPlaying = true;
        
        if (elements.runBtn) {
            elements.runBtn.disabled = true;
            elements.runBtn.textContent = '▶️ 运行中...';
        }
        if (elements.stopBtn) {
            elements.stopBtn.disabled = false;
        }
        
        // 重新加载游戏预览
        if (state.currentGame && elements.canvasPreview) {
            const iframe = elements.canvasPreview.querySelector('iframe');
            if (iframe) {
                console.log('🎮 加载游戏到 iframe...');
                iframe.srcdoc = state.currentGame;
                
                // 监听 iframe 加载完成
                iframe.onload = () => {
                    console.log('✅ 游戏加载完成');
                };
            } else {
                console.error('❌ 找不到 iframe');
            }
        } else {
            console.error('❌ 没有游戏代码或画布预览');
        }
    }

    /**
     * 停止游戏
     */
    function stopGame() {
        console.log('⏹️ 停止游戏');
        state.isPlaying = false;
        
        if (elements.runBtn) {
            elements.runBtn.disabled = false;
            elements.runBtn.textContent = '▶️ 运行';
        }
        if (elements.stopBtn) {
            elements.stopBtn.disabled = true;
        }
        
        // 清空 iframe
        if (elements.canvasPreview) {
            const iframe = elements.canvasPreview.querySelector('iframe');
            if (iframe) {
                iframe.srcdoc = '<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#1e1e1e;color:#fff;"><h2>⏹️ 游戏已停止</h2></body></html>';
            }
        }
    }

    /**
     * 保存游戏
     */
    function saveGame() {
        console.log('💾 保存游戏');
        
        // 同步属性到代码
        const updatedCode = syncPropertiesToCode();
        state.currentGame = updatedCode;
        
        // 触发外部保存
        if (window.onEditorSave) {
            window.onEditorSave(updatedCode);
            console.log('✅ 已通知外部保存');
        }
        
        // 显示成功提示（使用 Toast 而不是 alert）
        showToast('✅ 游戏已保存');
    }

    /**
     * 导出游戏
     */
    function exportGame() {
        console.log('📦 导出游戏');
        
        if (!state.currentGame) {
            showToast('❌ 没有可导出的游戏');
            return;
        }
        
        try {
            const blob = new Blob([state.currentGame], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `game-${Date.now()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('✅ 游戏已导出');
            showToast('✅ 游戏已导出');
        } catch (error) {
            console.error('❌ 导出失败:', error);
            showToast('❌ 导出失败：' + error.message);
        }
    }

    /**
     * 显示 Toast 提示
     */
    function showToast(message) {
        // 检查是否已存在 Toast
        let toast = document.querySelector('.editor-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'editor-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 10000;
                animation: fadeIn 0.3s;
            `;
            document.body.appendChild(toast);
            
            // 3 秒后自动消失
            setTimeout(() => {
                if (toast && toast.parentNode) {
                    toast.style.opacity = '0';
                    toast.style.transition = 'opacity 0.3s';
                    setTimeout(() => {
                        toast.remove();
                    }, 300);
                }
            }, 3000);
        }
        
        toast.textContent = message;
    }

    /**
     * 同步属性到代码
     */
    function syncPropertiesToCode() {
        // TODO: 实现属性到代码的同步
        return state.currentGame;
    }

    /**
     * 防抖保存
     */
    let saveTimer = null;
    function debounceSave() {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(saveGame, 1000);
    }

    /**
     * 工具函数：首字母大写
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // 公开 API
    return {
        init,
        runGame,
        stopGame,
        saveGame,
        exportGame,
        getState: () => state,
        setCurrentGame: (code) => { state.currentGame = code; }
    };
})();

// ✅ 确认 GameEditor 已定义
console.log('🎮 GameEditor 已加载:', typeof window.GameEditor);
console.log('🎮 GameEditor 方法:', Object.keys(window.GameEditor));
