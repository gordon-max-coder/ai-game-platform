// 创建游戏页面专用脚本

// API 配置
const API_BASE_URL = 'http://localhost:5000/api';

// 灵感提示库
const inspirationPrompts = [
    "创建一个太空射击游戏，玩家控制飞船在星空中穿梭，躲避陨石并消灭外星敌人",
    "创建一个合并养成游戏，通过合并相同的生物来进化和成长，最终创造传奇生物",
    "创建一个平台跳跃游戏，玩家需要灵活躲避机关和敌人，收集星星到达终点",
    "创建一个农场模拟游戏，种植各种作物、养殖动物，把小农场发展成农业帝国",
    "创建一个益智解谜游戏，通过滑动和旋转方块来解开精心设计的谜题",
    "创建一个赛车游戏，在多种风格的赛道上与其他赛车手展开激烈竞速",
    "创建一个塔防游戏，建造和升级防御塔来抵御一波波敌人的进攻",
    "创建一个 RPG 冒险游戏，探索神秘世界，收集装备，击败强大的 Boss",
    "创建一个音乐节奏游戏，跟随音乐节拍点击屏幕，完成各种挑战",
    "创建一个生存游戏，在荒岛上收集资源、建造庇护所，努力生存下去"
];

// DOM 元素
const inspireBtn = document.getElementById('inspireBtn');
const gamePrompt = document.getElementById('gamePrompt');
const generateBtn = document.getElementById('generateBtn');
const progressSection = document.getElementById('progressSection');
const resultSection = document.getElementById('resultSection');
const examplePrompts = document.getElementById('examplePrompts');
const progressFill = document.getElementById('progressFill');
const progressStatus = document.getElementById('progressStatus');
const promptChips = document.querySelectorAll('.prompt-chip');

// 初始化
if (inspireBtn) {
    inspireBtn.addEventListener('click', showInspiration);
}

if (gamePrompt) {
    gamePrompt.addEventListener('input', handlePromptInput);
}

if (generateBtn) {
    generateBtn.addEventListener('click', generateGame);
}

promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        gamePrompt.value = prompt;
        handlePromptInput();
    });
});

// 显示随机灵感
function showInspiration() {
    const randomPrompt = inspirationPrompts[Math.floor(Math.random() * inspirationPrompts.length)];
    gamePrompt.value = randomPrompt;
    handlePromptInput();
    
    // 添加动画效果
    gamePrompt.style.transform = 'scale(1.02)';
    setTimeout(() => {
        gamePrompt.style.transform = 'scale(1)';
    }, 200);
}

// 处理输入
function handlePromptInput() {
    const hasContent = gamePrompt.value.trim().length > 0;
    generateBtn.disabled = !hasContent;
}

// 生成游戏（调用真实 API）
async function generateGame() {
    const prompt = gamePrompt.value.trim();
    if (!prompt) return;

    // 获取高级选项
    const gameType = document.getElementById('gameType')?.value || '';
    const artStyle = document.getElementById('artStyle')?.value || '';
    const difficulty = document.getElementById('difficulty')?.value || 'medium';

    // 隐藏示例提示
    if (examplePrompts) {
        examplePrompts.style.display = 'none';
    }

    // 显示进度
    document.querySelector('.create-form').style.display = 'none';
    progressSection.style.display = 'block';

    try {
        // 调用后端 API
        const response = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                gameType: gameType,
                artStyle: artStyle,
                difficulty: difficulty
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP 错误：${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            // 更新进度到 100%
            progressFill.style.width = '100%';
            progressStatus.textContent = '游戏生成完成！';
            
            // 显示结果
            setTimeout(() => {
                progressSection.style.display = 'none';
                resultSection.style.display = 'block';
                showGameResult(prompt, result.gameCode);
            }, 500);
        } else {
            throw new Error(result.error || '生成失败');
        }

    } catch (error) {
        console.error('生成游戏失败:', error);
        progressSection.style.display = 'none';
        
        // 显示错误信息
        alert(`生成游戏失败：${error.message}\n\n请确保后端服务正在运行（python backend/server.py）`);
        
        // 恢复表单
        document.querySelector('.create-form').style.display = 'block';
    }
}

// 模拟单个步骤
function simulateStep(step) {
    return new Promise(resolve => {
        // 更新步骤状态
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        const currentStep = document.getElementById(step.id);
        if (currentStep) {
            currentStep.classList.add('active');
        }

        // 更新进度条
        progressFill.style.width = step.progress + '%';
        progressStatus.textContent = step.text;

        // 模拟耗时
        setTimeout(resolve, 800 + Math.random() * 400);
    });
}

// 显示游戏结果
function showGameResult(prompt, gameCode = null) {
    const gameTitle = document.getElementById('gameTitle');
    const gameDescription = document.getElementById('gameDescription');
    const gameTypeTag = document.getElementById('gameTypeTag');
    const styleTag = document.getElementById('styleTag');

    // 根据提示生成标题和描述
    const gameInfo = analyzePrompt(prompt);
    gameTitle.textContent = gameInfo.title;
    gameDescription.textContent = gameInfo.description;
    gameTypeTag.textContent = gameInfo.type;
    styleTag.textContent = gameInfo.style;

    // 如果有真实的游戏代码，加载它
    if (gameCode) {
        loadGeneratedGame(gameCode);
    } else {
        // 否则使用示例 canvas
        initGameCanvas();
    }
}

// 加载生成的游戏
function loadGeneratedGame(gameCode) {
    const previewCanvas = document.querySelector('.preview-canvas');
    if (!previewCanvas) return;

    // 创建 iframe 来运行游戏
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = 'var(--radius-md)';
    
    previewCanvas.innerHTML = '';
    previewCanvas.appendChild(iframe);

    // 将游戏代码写入 iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(gameCode);
    iframeDoc.close();

    // 保存游戏代码供播放时使用
    window.currentGameCode = gameCode;
}

// 分析提示生成游戏信息
function analyzePrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    let type = '冒险';
    let style = '卡通';
    let title = '奇幻冒险';
    let description = '一个精彩的游戏等待你探索！';

    if (lowerPrompt.includes('射击') || lowerPrompt.includes('太空')) {
        type = '动作';
        title = '星际战士';
        description = '在浩瀚宇宙中战斗，消灭外星敌人，成为星际英雄！';
        style = '科幻';
    } else if (lowerPrompt.includes('合并') || lowerPrompt.includes('进化')) {
        type = '休闲';
        title = '进化合并';
        description = '合并相同的生物，不断进化，创造最强大的传奇生物！';
        style = '可爱';
    } else if (lowerPrompt.includes('平台') || lowerPrompt.includes('跳跃')) {
        type = '冒险';
        title = '跳跃勇士';
        description = '穿越各种机关和障碍，收集星星，到达终点！';
        style = '像素';
    } else if (lowerPrompt.includes('农场') || lowerPrompt.includes('种植')) {
        type = '模拟';
        title = '欢乐农场';
        description = '种植作物、养殖动物，打造你的梦想农场！';
        style = '卡通';
    } else if (lowerPrompt.includes('谜题') || lowerPrompt.includes('益智')) {
        type = '益智';
        title = '智慧挑战';
        description = '运用你的智慧，解开精心设计的谜题！';
        style = '极简';
    } else if (lowerPrompt.includes('赛车') || lowerPrompt.includes('竞速')) {
        type = '竞速';
        title = '极速狂飙';
        description = '在多种赛道上飞驰，超越对手，成为冠军！';
        style = '写实';
    } else if (lowerPrompt.includes('塔防')) {
        type = '策略';
        title = '塔防大战';
        description = '建造防御塔，制定策略，抵御敌人进攻！';
        style = '卡通';
    } else if (lowerPrompt.includes('RPG') || lowerPrompt.includes('角色')) {
        type = '角色扮演';
        title = '勇者传说';
        description = '踏上冒险之旅，收集装备，击败强大的 Boss！';
        style = '像素';
    }

    return { title, description, type, style };
}

// 初始化示例游戏 Canvas
function initGameCanvas() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 设置 canvas 尺寸
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = canvas.width * 9 / 16;

    // 简单的动画示例
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballDX = 3;
    let ballDY = 3;
    const ballRadius = 20;

    function draw() {
        // 清空画布
        ctx.fillStyle = '#0f0f1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制背景网格
        ctx.strokeStyle = '#2d2d44';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // 绘制球
        const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, ballRadius);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#8b5cf6');
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 更新位置
        if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
            ballDX = -ballDX;
        }
        if (ballY + ballDY > canvas.height - ballRadius || ballY + ballDY < ballRadius) {
            ballDY = -ballDY;
        }

        ballX += ballDX;
        ballY += ballDY;

        requestAnimationFrame(draw);
    }

    draw();
}

// 绑定按钮事件
const playBtn = document.getElementById('playBtn');
const editBtn = document.getElementById('editBtn');
const publishBtn = document.getElementById('publishBtn');
const newGameBtn = document.getElementById('newGameBtn');

if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (window.currentGameCode) {
            // 在新窗口中打开游戏
            const gameWindow = window.open('', '_blank');
            if (gameWindow) {
                gameWindow.document.open();
                gameWindow.document.write(window.currentGameCode);
                gameWindow.document.close();
            }
        } else {
            alert('请先创建一个游戏！');
        }
    });
}

if (editBtn) {
    editBtn.addEventListener('click', () => {
        alert('编辑功能即将推出！');
    });
}

if (publishBtn) {
    publishBtn.addEventListener('click', () => {
        alert('发布功能即将推出！');
    });
}

if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
        location.reload();
    });
}

console.log('Create game page loaded!');
