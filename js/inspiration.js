/**
 * GameAI Inspiration Generator
 * 3 轮*3 项选择，帮助用户构建游戏创意
 * 版本：v1.0
 */

const InspirationGenerator = {
    // 游戏类型选项
    gameTypes: [
        { id: 'arcade', name: '🕹️ 街机', description: '经典街机风格' },
        { id: 'puzzle', name: '🧩 益智', description: '解谜烧脑游戏' },
        { id: 'action', name: '⚔️ 动作', description: '刺激动作冒险' },
        { id: 'strategy', name: '🎯 策略', description: '策略规划对战' },
        { id: 'shooter', name: '🔫 射击', description: '射击战斗游戏' },
        { id: 'racing', name: '🏎️ 竞速', description: '速度竞赛游戏' },
        { id: 'sports', name: '⚽ 体育', description: '体育运动模拟' },
        { id: 'simulation', name: '🏗️ 模拟', description: '生活经营模拟' },
        { id: 'adventure', name: '🗺️ 冒险', description: '探索冒险故事' }
    ],

    // 核心玩法选项
    gameplayMechanics: {
        arcade: [
            { id: 'collector', name: '收集物品', description: '控制角色收集道具得分' },
            { id: 'dodger', name: '躲避障碍', description: '避开移动的障碍物' },
            { id: 'breaker', name: '击碎目标', description: '击打/击碎屏幕上的目标' },
            { id: 'jumper', name: '跳跃闯关', description: '精准跳跃通过关卡' },
            { id: 'matcher', name: '消除匹配', description: '匹配相同元素消除' },
            { id: 'stacker', name: '堆叠挑战', description: '堆叠物品保持平衡' },
            { id: 'runner', name: '无尽奔跑', description: '自动奔跑躲避障碍' },
            { id: 'catcher', name: '接取物品', description: '控制篮子接住掉落物' },
            { id: 'shooter_fixed', name: '固定射击', description: '固定位置射击目标' }
        ],
        puzzle: [
            { id: 'logic', name: '逻辑推理', description: '运用逻辑解决谜题' },
            { id: 'physics', name: '物理谜题', description: '利用物理原理闯关' },
            { id: 'pattern', name: '图案识别', description: '识别并完成图案规律' },
            { id: 'memory', name: '记忆挑战', description: '记忆并复现序列' },
            { id: 'word', name: '文字游戏', description: '拼词/填字等文字谜题' },
            { id: 'number', name: '数字谜题', description: '数学相关的谜题' },
            { id: 'spatial', name: '空间想象', description: '旋转/组合空间图形' },
            { id: 'sequence', name: '序列排序', description: '按正确顺序排列' },
            { id: 'maze', name: '迷宫解谜', description: '找出迷宫正确路径' }
        ],
        action: [
            { id: 'combat', name: '格斗对战', description: '近身格斗击败敌人' },
            { id: 'platformer', name: '平台跳跃', description: '跳跃平台收集道具' },
            { id: 'survival', name: '生存挑战', description: '在危险中尽可能存活' },
            { id: 'hack_slash', name: '砍杀冒险', description: '挥舞武器消灭敌人' },
            { id: 'stealth', name: '潜行暗杀', description: '隐蔽行动完成任务' },
            { id: 'beat_em_up', name: '清版过关', description: '一路击败所有敌人' },
            { id: 'metroidvania', name: '探索升级', description: '探索地图获取能力' },
            { id: 'rhythm', name: '节奏动作', description: '跟随节奏执行动作' },
            { id: 'bullet_hell', name: '弹幕躲避', description: '在密集弹幕中生存' }
        ],
        strategy: [
            { id: 'tower_defense', name: '塔防', description: '建造防御塔阻挡敌人' },
            { id: 'rts', name: '即时战略', description: '实时指挥部队作战' },
            { id: 'turn_based', name: '回合策略', description: '回合制策略对战' },
            { id: 'card', name: '卡牌对战', description: '使用卡牌组合战斗' },
            { id: 'chess_like', name: '棋类对战', description: '类似棋类的策略' },
            { id: 'resource', name: '资源管理', description: '合理分配资源发展' },
            { id: 'auto_battler', name: '自走棋', description: '自动战斗排兵布阵' },
            { id: 'puzzle_strategy', name: '策略解谜', description: '策略性解谜游戏' },
            { id: 'kingdom', name: '王国建设', description: '建设并保卫王国' }
        ],
        shooter: [
            { id: 'fps', name: '第一人称射击', description: '第一人称视角射击' },
            { id: 'tps', name: '第三人称射击', description: '第三人称视角射击' },
            { id: 'top_down', name: '俯视射击', description: '俯视角度射击' },
            { id: 'space_shooter', name: '太空射击', description: '太空飞船射击' },
            { id: 'gallery', name: '打靶射击', description: '固定位置打靶' },
            { id: 'run_gun', name: '跑动射击', description: '移动中射击敌人' },
            { id: 'sniper', name: '狙击手', description: '精准狙击目标' },
            { id: 'twin_stick', name: '双摇杆射击', description: '移动和射击分离控制' },
            { id: 'bullet_heaven', name: '弹幕射击', description: '发射密集弹幕消灭敌人' }
        ],
        racing: [
            { id: 'circuit', name: '赛道竞速', description: '在赛道上竞速' },
            { id: 'offroad', name: '越野竞速', description: '复杂地形越野' },
            { id: 'kart', name: '卡丁车', description: '道具卡丁车竞速' },
            { id: 'motorcycle', name: '摩托竞速', description: '摩托车比赛' },
            { id: 'boat', name: '船只竞速', description: '水上船只比赛' },
            { id: 'space_racing', name: '太空竞速', description: '太空飞船竞速' },
            { id: 'endless', name: '无尽竞速', description: '无尽赛道竞速' },
            { id: 'drag', name: '直线加速', description: '直线加速比赛' },
            { id: 'parkour', name: '特技竞速', description: '特技动作竞速' }
        ],
        sports: [
            { id: 'soccer', name: '足球', description: '足球比赛' },
            { id: 'basketball', name: '篮球', description: '篮球投篮/比赛' },
            { id: 'tennis', name: '网球', description: '网球对战' },
            { id: 'golf', name: '高尔夫', description: '高尔夫击球' },
            { id: 'baseball', name: '棒球', description: '棒球击打' },
            { id: 'volleyball', name: '排球', description: '排球对战' },
            { id: 'hockey', name: '冰球/曲棍球', description: '冰球或曲棍球' },
            { id: 'archery', name: '射箭', description: '射箭瞄准' },
            { id: 'skateboard', name: '滑板', description: '滑板特技' }
        ],
        simulation: [
            { id: 'farming', name: '农场经营', description: '种植养殖经营' },
            { id: 'city_builder', name: '城市建设', description: '规划建造城市' },
            { id: 'tycoon', name: '商业大亨', description: '经营商业帝国' },
            { id: 'life_sim', name: '生活模拟', description: '模拟日常生活' },
            { id: 'vehicle_sim', name: '载具模拟', description: '驾驶载具模拟' },
            { id: 'god_game', name: '上帝模拟', description: '扮演上帝创造世界' },
            { id: 'restaurant', name: '餐厅经营', description: '经营餐厅' },
            { id: 'hospital', name: '医院经营', description: '经营医院' },
            { id: 'zoo', name: '动物园', description: '经营动物园' }
        ],
        adventure: [
            { id: 'exploration', name: '探索发现', description: '探索未知世界' },
            { id: 'story_rich', name: '剧情驱动', description: '丰富剧情故事' },
            { id: 'point_click', name: '点击冒险', description: '点击式解谜冒险' },
            { id: 'treasure_hunt', name: '寻宝探险', description: '寻找宝藏冒险' },
            { id: 'survival_adv', name: '生存冒险', description: '荒野求生冒险' },
            { id: 'mystery', name: '悬疑推理', description: '解开悬疑谜题' },
            { id: 'fantasy', name: '奇幻冒险', description: '奇幻世界冒险' },
            { id: 'sci_fi', name: '科幻冒险', description: '科幻世界冒险' },
            { id: 'historical', name: '历史冒险', description: '历史背景冒险' }
        ]
    },

    // 游戏风格/主题选项
    gameThemes: [
        { id: 'retro', name: '👾 复古像素', description: '8 位/16 位复古风格', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'] },
        { id: 'minimalist', name: '⚪ 极简主义', description: '简洁几何图形', colors: ['#2C3E50', '#ECF0F1', '#E74C3C'] },
        { id: 'neon', name: '🌈 霓虹赛博', description: '荧光色赛博朋克', colors: ['#FF00FF', '#00FFFF', '#FFFF00'] },
        { id: 'cartoon', name: '🎨 卡通可爱', description: 'Q 版卡通风格', colors: ['#FFB6C1', '#87CEEB', '#98FB98'] },
        { id: 'realistic', name: '📸 写实风格', description: '逼真写实画面', colors: ['#8B4513', '#228B22', '#4169E1'] },
        { id: 'dark', name: '🌑 黑暗哥特', description: '暗黑哥特风格', colors: ['#2C0000', '#4A0000', '#8B0000'] },
        { id: 'fantasy', name: '🧙 奇幻魔法', description: '魔法奇幻世界', colors: ['#9370DB', '#FFD700', '#FF69B4'] },
        { id: 'scifi', name: '🚀 科幻未来', description: '未来科技世界', colors: ['#C0C0C0', '#00CED1', '#FF4500'] },
        { id: 'nature', name: '🌿 自然清新', description: '自然田园风格', colors: ['#228B22', '#87CEEB', '#DEB887'] }
    ],

    // 当前选择状态
    currentSelection: { type: null, mechanic: null, theme: null },
    currentRound: 0,

    // 初始化
    init() {
        this.createInspirationModal();
        this.attachEventListeners();
    },

    // 创建灵感选择模态框
    createInspirationModal() {
        const modalHTML = `
            <div id="inspirationModal" class="inspiration-modal" style="display: none;">
                <div class="inspiration-overlay"></div>
                <div class="inspiration-content">
                    <div class="inspiration-header">
                        <h2>🎲 灵感生成器</h2>
                        <button class="inspiration-close" id="closeInspirationBtn">&times;</button>
                    </div>
                    
                    <div class="inspiration-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill" style="width: 33.33%"></div>
                        </div>
                        <div class="progress-steps">
                            <span class="step active" id="step1">1️⃣ 类型</span>
                            <span class="step" id="step2">2️⃣ 玩法</span>
                            <span class="step" id="step3">3️⃣ 风格</span>
                        </div>
                    </div>

                    <div class="inspiration-body">
                        <div class="selection-round" id="round1">
                            <h3 class="round-title">选择游戏类型</h3>
                            <div class="options-grid" id="typeOptions"></div>
                        </div>

                        <div class="selection-round" id="round2" style="display: none;">
                            <h3 class="round-title">选择核心玩法</h3>
                            <div class="options-grid" id="mechanicOptions"></div>
                        </div>

                        <div class="selection-round" id="round3" style="display: none;">
                            <h3 class="round-title">选择视觉风格</h3>
                            <div class="options-grid" id="themeOptions"></div>
                        </div>
                    </div>

                    <div class="inspiration-footer">
                        <button class="btn-inspire-generate" id="generateInspirationBtn" disabled>
                            ✨ 生成游戏创意
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addInspirationStyles();
    },

    // 添加样式
    addInspirationStyles() {
        const styles = `
            <style>
                .inspiration-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .inspiration-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                }
                .inspiration-content {
                    position: relative;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    padding: 30px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .inspiration-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .inspiration-header h2 {
                    color: white;
                    font-size: 28px;
                    margin: 0;
                }
                .inspiration-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 32px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .inspiration-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }
                .inspiration-progress { margin-bottom: 30px; }
                .progress-bar {
                    background: rgba(255, 255, 255, 0.2);
                    height: 8px;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 10px;
                }
                .progress-fill {
                    background: linear-gradient(90deg, #FFD700, #FFA500);
                    height: 100%;
                    transition: width 0.3s ease;
                }
                .progress-steps {
                    display: flex;
                    justify-content: space-between;
                }
                .progress-steps .step {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 14px;
                    transition: all 0.3s;
                }
                .progress-steps .step.active {
                    color: white;
                    font-weight: bold;
                    transform: scale(1.1);
                }
                .inspiration-body {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 20px;
                    min-height: 400px;
                }
                .round-title {
                    color: white;
                    font-size: 20px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                }
                @media (max-width: 768px) {
                    .options-grid { grid-template-columns: repeat(2, 1fr); }
                }
                .option-card {
                    background: rgba(255, 255, 255, 0.15);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 12px;
                    padding: 20px 15px;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-align: center;
                }
                .option-card:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                }
                .option-card.selected {
                    background: rgba(255, 215, 0, 0.3);
                    border-color: #FFD700;
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                }
                .option-card .option-icon { font-size: 32px; margin-bottom: 10px; }
                .option-card .option-name { color: white; font-size: 16px; font-weight: bold; margin-bottom: 5px; }
                .option-card .option-desc { color: rgba(255, 255, 255, 0.8); font-size: 12px; line-height: 1.4; }
                .inspiration-footer { text-align: center; }
                .btn-inspire-generate {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    border: none;
                    color: #333;
                    padding: 15px 40px;
                    font-size: 18px;
                    font-weight: bold;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 5px 15px rgba(255, 165, 0, 0.4);
                }
                .btn-inspire-generate:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(255, 165, 0, 0.6);
                }
                .btn-inspire-generate:disabled { opacity: 0.5; cursor: not-allowed; }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    },

    // 绑定事件监听器
    attachEventListeners() {
        const inspireBtn = document.getElementById('inspireBtn');
        if (inspireBtn) {
            inspireBtn.onclick = () => this.openModal();
            console.log('✅ Inspiration button event bound');
        } else {
            console.error('❌ Inspiration button not found');
        }

        document.getElementById('closeInspirationBtn').onclick = () => this.closeModal();
        document.querySelector('.inspiration-overlay').onclick = () => this.closeModal();
        document.getElementById('generateInspirationBtn').onclick = () => this.generatePrompt();
    },

    // 打开模态框
    openModal() {
        document.getElementById('inspirationModal').style.display = 'flex';
        this.currentRound = 0;
        this.currentSelection = { type: null, mechanic: null, theme: null };
        this.showRound(1);
    },

    // 关闭模态框
    closeModal() {
        document.getElementById('inspirationModal').style.display = 'none';
    },

    // 显示指定轮次
    showRound(round) {
        for (let i = 1; i <= 3; i++) {
            document.getElementById(`round${i}`).style.display = 'none';
            document.getElementById(`step${i}`).classList.remove('active');
        }

        document.getElementById(`round${round}`).style.display = 'block';
        document.getElementById(`step${round}`).classList.add('active');

        const progress = (round / 3) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;

        if (round === 1) this.renderTypeOptions();
        else if (round === 2) this.renderMechanicOptions();
        else if (round === 3) this.renderThemeOptions();
    },

    // 渲染类型选项
    renderTypeOptions() {
        const container = document.getElementById('typeOptions');
        container.innerHTML = '';

        this.gameTypes.forEach(type => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.dataset.type = type.id;
            card.innerHTML = `
                <div class="option-icon">${type.name.split(' ')[0]}</div>
                <div class="option-name">${type.name.split(' ').slice(1).join(' ')}</div>
                <div class="option-desc">${type.description}</div>
            `;
            card.onclick = () => this.selectType(type, card);
            container.appendChild(card);
        });
    },

    // 选择类型
    selectType(type, cardElement) {
        document.querySelectorAll('#typeOptions .option-card').forEach(c => c.classList.remove('selected'));
        cardElement.classList.add('selected');
        this.currentSelection.type = type;

        setTimeout(() => {
            cardElement.classList.add('confirmed');
            setTimeout(() => {
                this.currentRound = 1;
                this.showRound(2);
            }, 300);
        }, 200);
    },

    // 渲染玩法选项
    renderMechanicOptions() {
        const container = document.getElementById('mechanicOptions');
        container.innerHTML = '';

        const typeId = this.currentSelection.type.id;
        const mechanics = this.gameplayMechanics[typeId] || this.gameplayMechanics['arcade'];

        mechanics.forEach(mechanic => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.dataset.mechanic = mechanic.id;
            card.innerHTML = `
                <div class="option-icon">🎯</div>
                <div class="option-name">${mechanic.name}</div>
                <div class="option-desc">${mechanic.description}</div>
            `;
            card.onclick = () => this.selectMechanic(mechanic, card);
            container.appendChild(card);
        });
    },

    // 选择玩法
    selectMechanic(mechanic, cardElement) {
        document.querySelectorAll('#mechanicOptions .option-card').forEach(c => c.classList.remove('selected'));
        cardElement.classList.add('selected');
        this.currentSelection.mechanic = mechanic;

        setTimeout(() => {
            cardElement.classList.add('confirmed');
            setTimeout(() => {
                this.currentRound = 2;
                this.showRound(3);
            }, 300);
        }, 200);
    },

    // 渲染主题选项
    renderThemeOptions() {
        const container = document.getElementById('themeOptions');
        container.innerHTML = '';

        this.gameThemes.forEach(theme => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.dataset.theme = theme.id;
            card.style.background = `linear-gradient(135deg, ${theme.colors[0]}40, ${theme.colors[1]}40)`;
            card.innerHTML = `
                <div class="option-icon">${theme.name.split(' ')[0]}</div>
                <div class="option-name">${theme.name.split(' ').slice(1).join(' ')}</div>
                <div class="option-desc">${theme.description}</div>
            `;
            card.onclick = () => this.selectTheme(theme, card);
            container.appendChild(card);
        });
    },

    // 选择主题
    selectTheme(theme, cardElement) {
        document.querySelectorAll('#themeOptions .option-card').forEach(c => c.classList.remove('selected'));
        cardElement.classList.add('selected');
        this.currentSelection.theme = theme;

        setTimeout(() => {
            cardElement.classList.add('confirmed');
            setTimeout(() => {
                document.getElementById('generateInspirationBtn').disabled = false;
            }, 300);
        }, 200);
    },

    // 生成提示词
    generatePrompt() {
        const { type, mechanic, theme } = this.currentSelection;

        const promptTemplates = [
            `创建一个${type.name.split(' ').slice(1).join(' ')}游戏，核心玩法是${mechanic.name}，${mechanic.description}。采用${theme.name.split(' ').slice(1).join(' ')}风格，${theme.description}。`,
            `我想玩一个${theme.name.split(' ').slice(1).join(' ')}风格的${type.name.split(' ').slice(1).join(' ')}游戏。游戏的主要玩法是${mechanic.name}：${mechanic.description}。请确保游戏画面精美，操作流畅。`,
            `设计一个创新的${type.name.split(' ').slice(1).join(' ')}游戏，融合${mechanic.name}机制。${mechanic.description}。视觉上使用${theme.name.split(' ').slice(1).join(' ')}，${theme.description}。添加得分系统和关卡设计。`
        ];

        const selectedTemplate = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];

        const promptInput = document.getElementById('promptInput');
        if (promptInput) {
            this.typeWithAnimation(promptInput, selectedTemplate);
        }

        setTimeout(() => {
            this.closeModal();
            window.dispatchEvent(new CustomEvent('inspirationGenerated', {
                detail: { type, mechanic, theme, prompt: selectedTemplate }
            }));
        }, 500);
    },

    // 动画打字效果
    typeWithAnimation(element, text) {
        element.value = '';
        element.focus();
        
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.value += text.charAt(index);
                index++;
                element.scrollTop = element.scrollHeight;
            } else {
                clearInterval(typeInterval);
                element.dispatchEvent(new Event('input'));
            }
        }, 30);
    },

    // 获取随机灵感
    getRandomInspiration() {
        const randomType = this.gameTypes[Math.floor(Math.random() * this.gameTypes.length)];
        const mechanics = this.gameplayMechanics[randomType.id];
        const randomMechanic = mechanics[Math.floor(Math.random() * mechanics.length)];
        const randomTheme = this.gameThemes[Math.floor(Math.random() * this.gameThemes.length)];

        return {
            type: randomType,
            mechanic: randomMechanic,
            theme: randomTheme,
            prompt: `创建一个${randomType.name.split(' ').slice(1).join(' ')}游戏，玩法是${randomMechanic.name}，${randomMechanic.description}。采用${randomTheme.name.split(' ').slice(1).join(' ')}风格。`
        };
    }
};

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InspirationGenerator.init());
} else {
    InspirationGenerator.init();
}

console.log('🎲 InspirationGenerator loaded');
