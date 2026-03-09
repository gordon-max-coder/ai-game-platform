/**
 * GameAI - 游戏参数分析模块（精简版）
 * 智能提取最关键的游戏参数（最多 5 个）
 */

const GameAnalyzer = (function() {
    let currentGameCode = null;
    let currentGameId = null;
    let properties = {};

    // 关键参数优先级（按重要性排序）
    const priorityCategories = [
        'speed',        // 速度 - 最核心的游戏参数
        'lives',        // 生命/血量 - 影响游戏难度
        'score',        // 分数 - 游戏目标
        'size',         // 大小 - 影响视觉和碰撞
        'spawnRate'     // 生成率 - 影响游戏节奏
    ];

    // 精简的参数模式（只匹配最明确的）
    const propertyPatterns = {
        // 速度类 - 只匹配明确的玩家/球/敌人速度
        speed: [
            /(?:player|ship|ball|enemy|paddle)\.speed\s*=\s*(\d+(?:\.\d+)?)/gi,
            /const\s+(?:player|ship|ball|enemy|paddle)Speed\s*=\s*(\d+(?:\.\d+)?)/gi
        ],
        // 生命类 - 只匹配 lives/hp/health
        lives: [
            /(?:lives|playerLives)\s*=\s*(\d+)/gi,
            /(?:player)?(?:hp|health)\s*=\s*(\d+(?:\.\d+)?)/gi,
            /const\s+(?:max)?(?:Lives|HP|Health)\s*=\s*(\d+(?:\.\d+)?)/gi
        ],
        // 分数类 - 只匹配明确的分数
        score: [
            /score\s*=\s*(\d+)/gi,
            /const\s+(?:winScore|maxScore|targetScore)\s*=\s*(\d+)/gi
        ],
        // 大小类 - 只匹配玩家/球/砖块的大小
        size: [
            /(?:player|ball|paddle|brick)\.(?:width|height|radius|size)\s*=\s*(\d+(?:\.\d+)?)/gi,
            /const\s+(?:player|ball|paddle|brick)(?:Width|Height|Size|Radius)\s*=\s*(\d+(?:\.\d+)?)/gi
        ],
        // 生成率 - 只匹配明确的生成间隔
        spawnRate: [
            /(?:spawnRate|spawnInterval|enemySpawnRate)\s*=\s*(\d+)/gi,
            /const\s+(?:spawn|enemy)Interval\s*=\s*(\d+)/gi
        ]
    };

    // 分析游戏代码（智能精简）
    function analyze(code, gameId) {
        currentGameCode = code;
        currentGameId = gameId;
        properties = {};

        const allFound = {};

        // 1. 提取所有匹配的参数
        for (const [category, patterns] of Object.entries(propertyPatterns)) {
            const found = [];
            
            patterns.forEach(pattern => {
                let match;
                pattern.lastIndex = 0;
                
                while ((match = pattern.exec(code)) !== null) {
                    const value = parseFloat(match[1]);
                    if (!isNaN(value)) {
                        found.push({
                            value: value,
                            index: match.index,
                            fullMatch: match[0],
                            context: getCodeContext(code, match.index)
                        });
                    }
                }
            });

            if (found.length > 0) {
                // 去重，保留最有代表性的值
                const uniqueValues = [...new Set(found.map(f => f.value))].sort((a, b) => a - b);
                allFound[category] = {
                    values: uniqueValues,
                    details: found,
                    priority: priorityCategories.indexOf(category)
                };
            }
        }

        // 2. 智能筛选：最多保留 5 个关键参数
        properties = smartSelect(allFound, 5);

        console.log('🔍 游戏分析完成:', Object.keys(properties).length, '个关键参数');
        return properties;
    }

    // 智能筛选关键参数
    function smartSelect(allFound, maxCount) {
        const result = {};
        
        // 按优先级排序
        const sortedCategories = Object.entries(allFound)
            .sort((a, b) => a[1].priority - b[1].priority);

        let count = 0;
        
        for (const [category, data] of sortedCategories) {
            if (count >= maxCount) break;

            // 每个类别最多保留 2 个最有代表性的值
            const selectedValues = selectRepresentativeValues(data.values, 2);
            
            if (selectedValues.length > 0) {
                // 找到对应的 details
                const selectedDetails = data.details.filter(d => 
                    selectedValues.includes(d.value)
                );

                result[category] = {
                    values: selectedValues,
                    details: selectedDetails,
                    priority: data.priority
                };
                count++;
            }
        }

        return result;
    }

    // 选择最有代表性的值
    function selectRepresentativeValues(values, maxCount) {
        if (values.length <= maxCount) {
            return values;
        }

        // 如果值太多，选择最小、最大和中间值
        const selected = [];
        const step = Math.floor(values.length / maxCount);
        
        for (let i = 0; i < maxCount; i++) {
            const index = Math.min(i * step, values.length - 1);
            if (!selected.includes(values[index])) {
                selected.push(values[index]);
            }
        }

        return selected.sort((a, b) => a - b);
    }

    // 获取代码上下文（用于调试）
    function getCodeContext(code, index) {
        const start = Math.max(0, index - 30);
        const end = Math.min(code.length, index + 50);
        return code.substring(start, end).replace(/\n/g, ' ');
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
                            <span class="property-name">${categoryName}</span>
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
            lives: '❤️ 生命',
            spawnRate: '🔄 生成速度'
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

        if (currentGameCode && properties[category]) {
            const details = properties[category].details;
            let newCode = currentGameCode;
            let changed = false;

            details.forEach(detail => {
                if (detail.value === originalValue) {
                    const oldValue = detail.fullMatch;
                    const newValueStr = oldValue.replace(String(originalValue), String(newValue));
                    newCode = replaceAt(newCode, detail.index, oldValue.length, newValueStr);
                    changed = true;
                }
            });

            if (changed) {
                currentGameCode = newCode;
                console.log('✅ 代码已更新');
                updatePreview(newCode);
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
console.log('✅ GameAnalyzer 模块已加载（精简版 - 最多 5 个关键参数）');
