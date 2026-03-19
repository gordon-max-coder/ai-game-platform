/**
 * GameAI - 游戏参数分析模块
 * 分析游戏代码，提取关键数值，支持滑动调整
 */

const GameAnalyzer = (function() {
    let currentGameCode = null;
    let currentGameId = null;
    let properties = {};

    // 常见的游戏参数模式
    const propertyPatterns = {
        // 速度类
        speed: [
            /(?:player|ship|ball|enemy)\.speed\s*=\s*(\d+(?:\.\d+)?)/gi,
            /speed:\s*(\d+(?:\.\d+)?)/gi,
            /const\s+(?:player|ship|ball|enemy)Speed\s*=\s*(\d+(?:\.\d+)?)/gi
        ],
        // 大小类
        size: [
            /(?:width|height|size|radius)\s*[:=]\s*(\d+(?:\.\d+)?)/gi,
            /(?:player|ship|ball|enemy)\.(?:width|height|size)\s*=\s*(\d+(?:\.\d+)?)/gi
        ],
        // 分数类
        score: [
            /score\s*[:=]\s*(\d+)/gi,
            /points\s*[:=]\s*(\d+)/gi,
            /(?:kill|hit|collect)Score\s*[:=]\s*(\d+)/gi
        ],
        // 生命类
        lives: [
            /lives?\s*[:=]\s*(\d+)/gi,
            /hp\s*[:=]\s*(\d+(?:\.\d+)?)/gi,
            /health\s*[:=]\s*(\d+(?:\.\d+)?)/gi
        ],
        // 重力/物理
        gravity: [
            /gravity\s*[:=]\s*(\d+(?:\.\d+)?)/gi,
            /friction\s*[:=]\s*(\d+(?:\.\d+)?)/gi,
            /bounce\s*[:=]\s*(\d+(?:\.\d+)?)/gi
        ],
        // 生成率
        spawnRate: [
            /spawnRate\s*[:=]\s*(\d+)/gi,
            /spawnInterval\s*[:=]\s*(\d+)/gi,
            /enemySpawn\s*[:=]\s*(\d+)/gi
        ],
        // 其他数值
        other: [
            /(?:max|min)[A-Z][a-zA-Z]*\s*[:=]\s*(\d+(?:\.\d+)?)/gi,
            /const\s+[A-Z][a-zA-Z]*\s*=\s*(\d+(?:\.\d+)?)/gi
        ]
    };

    // 分析游戏代码
    function analyze(code, gameId) {
        currentGameCode = code;
        currentGameId = gameId;
        properties = {};

        // 提取各类参数
        for (const [category, patterns] of Object.entries(propertyPatterns)) {
            const found = [];
            
            patterns.forEach(pattern => {
                let match;
                // 重置正则 lastIndex
                pattern.lastIndex = 0;
                
                while ((match = pattern.exec(code)) !== null) {
                    const value = parseFloat(match[1]);
                    if (!isNaN(value)) {
                        found.push({
                            value: value,
                            index: match.index,
                            fullMatch: match[0]
                        });
                    }
                }
            });

            if (found.length > 0) {
                // 去重并排序
                const uniqueValues = [...new Set(found.map(f => f.value))].sort((a, b) => a - b);
                properties[category] = {
                    values: uniqueValues,
                    details: found
                };
            }
        }

        console.log('🔍 游戏分析完成:', Object.keys(properties).length, '类参数');
        return properties;
    }

    // 渲染属性面板
    function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (Object.keys(properties).length === 0) {
            container.innerHTML = `
                <div class="no-properties">
                    <div class="no-properties-icon">🎯</div>
                    <p>生成游戏后<br>关键数值会显示在这里</p>
                </div>
            `;
            return;
        }

        let html = '';

        for (const [category, data] of Object.entries(properties)) {
            const categoryName = getCategoryName(category);
            
            html += `<div class="property-group">
                <h4>${categoryName}</h4>`;

            data.values.forEach((value, index) => {
                const min = Math.max(0, Math.floor(value * 0.1));
                const max = Math.ceil(value * 2);
                const step = value < 1 ? 0.1 : (value < 10 ? 0.5 : 1);

                html += `
                    <div class="property-item">
                        <div class="property-label">
                            <span class="property-name">${categoryName} ${index + 1}</span>
                            <span class="property-value" id="value-${category}-${index}">${value}</span>
                        </div>
                        <input type="range" 
                               class="property-slider" 
                               min="${min}" 
                               max="${max}" 
                               step="${step}" 
                               value="${value}"
                               data-category="${category}"
                               data-index="${index}"
                               data-original="${value}">
                        <div class="property-hint">范围：${min} - ${max}</div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        container.innerHTML = html;

        // 绑定滑块事件
        bindSliderEvents();
    }

    // 获取分类名称（中文）
    function getCategoryName(category) {
        const names = {
            speed: '⚡ 速度',
            size: '📏 大小',
            score: '🏆 分数',
            lives: '❤️ 生命/血量',
            gravity: '🌍 物理',
            spawnRate: '🔄 生成率',
            other: '🔧 其他'
        };
        return names[category] || category;
    }

    // 绑定滑块事件
    function bindSliderEvents() {
        const sliders = document.querySelectorAll('.property-slider');
        
        sliders.forEach(slider => {
            slider.addEventListener('input', handleSliderChange);
            slider.addEventListener('change', handleSliderChangeCommit);
        });
    }

    // 滑块值改变（实时更新）
    function handleSliderChange(e) {
        const slider = e.target;
        const value = parseFloat(slider.value);
        const category = slider.dataset.category;
        const index = slider.dataset.index;

        // 更新显示值
        const valueDisplay = document.getElementById(`value-${category}-${index}`);
        if (valueDisplay) {
            valueDisplay.textContent = value;
        }
    }

    // 滑块值确认（应用到代码）
    function handleSliderChangeCommit(e) {
        const slider = e.target;
        const newValue = parseFloat(slider.value);
        const originalValue = parseFloat(slider.dataset.original);
        const category = slider.dataset.category;

        if (newValue === originalValue) return;

        console.log(`🔧 修改参数：${category} ${originalValue} → ${newValue}`);

        // 更新代码
        if (currentGameCode && properties[category]) {
            const details = properties[category].details;
            let newCode = currentGameCode;
            let changed = false;

            details.forEach(detail => {
                if (detail.value === originalValue) {
                    // 替换代码中的值
                    const oldValue = detail.fullMatch;
                    const newValueStr = oldValue.replace(String(originalValue), String(newValue));
                    newCode = replaceAt(newCode, detail.index, oldValue.length, newValueStr);
                    changed = true;
                }
            });

            if (changed) {
                currentGameCode = newCode;
                console.log('✅ 代码已更新');

                // 更新 iframe 预览
                updatePreview(newCode);

                // 更新 dataset.original
                slider.dataset.original = newValue;
            }
        }
    }

    // 在指定位置替换字符串
    function replaceAt(str, index, length, replacement) {
        return str.substring(0, index) + replacement + str.substring(index + length);
    }

    // 更新预览
    function updatePreview(code) {
        const iframe = document.getElementById('gameFrame');
        if (iframe && iframe.style.display !== 'none') {
            iframe.srcdoc = code;
            console.log('🔄 预览已更新');
        }
    }

    // 获取当前代码
    function getCurrentCode() {
        return currentGameCode;
    }

    // 重置
    function reset() {
        currentGameCode = null;
        currentGameId = null;
        properties = {};
    }

    return {
        analyze: analyze,
        render: render,
        getCurrentCode: getCurrentCode,
        reset: reset
    };
})();

// 导出到全局
window.GameAnalyzer = GameAnalyzer;
console.log('✅ GameAnalyzer 模块已加载');
