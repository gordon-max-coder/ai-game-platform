// 创建游戏页面专用脚本 - 直接调用 API 版本

// API 配置
const API_CONFIG = {
    baseUrl: 'http://localhost:3000/proxy',  // 使用本地代理
    apiKey: 'sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8',
    model: API_CONFIG.model
};

// 系统提示
const SYSTEM_PROMPT = `你是一个专业的游戏开发 AI 助手。你的任务是根据用户的描述生成完整的 HTML5 游戏代码。

要求：
1. 生成单个 HTML 文件，包含所有 CSS 和 JavaScript
2. 使用 Canvas API 或 DOM 操作来渲染游戏
3. 游戏必须可以立即运行，无需外部依赖
4. 包含完整的游戏逻辑：玩家控制、敌人 AI、碰撞检测、得分系统等
5. 添加精美的视觉效果和动画
6. 确保游戏有趣且可玩
7. 代码要有良好的结构和注释

请只返回纯 HTML 代码，不要有任何解释或其他文字。代码应该以 <!DOCTYPE html> 开头，以 </html> 结尾。`;

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

    const gameType = document.getElementById('gameType')?.value || '';
    const artStyle = document.getElementById('artStyle')?.value || '';
    const difficulty = document.getElementById('difficulty')?.value || 'medium';

    if (examplePrompts) {
        examplePrompts.style.display = 'none';
    }

    document.querySelector('.create-form').style.display = 'none';
    progressSection.style.display = 'block';

    updateProgress(10, '正在分析你的游戏想法...');
    document.getElementById('step1')?.classList.add('active');

    try {
        let fullPrompt = `请创建一个完整的 HTML5 游戏。\n\n游戏描述：${prompt}`;
        
        if (gameType) fullPrompt += `\n游戏类型：${gameType}`;
        if (artStyle) fullPrompt += `\n美术风格：${artStyle}`;
        if (difficulty) fullPrompt += `\n难度等级：${difficulty}`;
        
        fullPrompt += `\n\n请生成一个完整的、可立即运行的 HTML5 游戏。要求：
1. 单个 HTML 文件，包含所有 CSS 和 JavaScript
2. 使用 Canvas API 渲染
3. 包含完整的游戏循环、玩家控制、碰撞检测
4. 有得分系统和游戏结束判定
5. 添加精美的视觉效果和动画
6. 确保游戏有趣且可玩

只返回纯 HTML 代码，不要有任何解释。`;

        updateProgress(30, '正在调用 AI 模型生成游戏代码...');
        document.getElementById('step2')?.classList.add('active');

        console.log('正在调用 API:', `${API_CONFIG.baseUrl}/chat/completions`);
        console.log('模型:', API_CONFIG.model);

        const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: fullPrompt
                    }
                ],
                max_tokens: 8000,
                temperature: 0.7
            })
        });

        console.log('API 响应状态:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 错误响应:', errorText);
            throw new Error(`API 请求失败 (${response.status}): ${errorText.substring(0, 200)}`);
        }

        updateProgress(60, '正在处理生成的代码...');
        document.getElementById('step3')?.classList.add('active');

        const result = await response.json();
        console.log('API 响应成功:', result);
        
        let gameCode = result.choices?.[0]?.message?.content;
        
        if (!gameCode) {
            throw new Error('API 返回的数据格式不正确');
        }

        gameCode = extractHtmlCode(gameCode);

        updateProgress(80, '正在准备游戏预览...');
        document.getElementById('step4')?.classList.add('active');

        updateProgress(100, '游戏生成完成！');
        document.getElementById('step5')?.classList.add('active');

        setTimeout(() => {
            progressSection.style.display = 'none';
            resultSection.style.display = 'block';
            showGameResult(prompt, gameCode);
        }, 800);

    } catch (error) {
        console.error('生成游戏失败:', error);
        progressSection.style.display = 'none';
        
        const errorMsg = `生成游戏失败：${error.message}\n\n可能原因：
1. API 密钥无效或已过期
2. 网络连接问题
3. API 服务暂时不可用
4. 请求超时

请检查网络连接后重试。`;
        
        alert(errorMsg);
        
        document.querySelector('.create-form').style.display = 'block';
        resetProgress();
    }
}

function updateProgress(percent, status) {
    if (progressFill) {
        progressFill.style.width = percent + '%';
    }
    if (progressStatus) {
        progressStatus.textContent = status;
    }
}

function resetProgress() {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    updateProgress(0, '准备中...');
}

function extractHtmlCode(text) {
    if (text.includes('```html')) {
        const start = text.indexOf('```html') + 7;
        const end = text.indexOf('```', start);
        if (end !== -1) {
            text = text.substring(start, end).trim();
        }
    } else if (text.includes('```')) {
        const start = text.indexOf('```') + 3;
        const end = text.indexOf('```', start);
        if (end !== -1) {
            text = text.substring(start, end).trim();
        }
    }
    
    const trimmed = text.trim();
    if (!trimmed.startsWith('<!DOCTYPE') && !trimmed.toLowerCase().startsWith('<html')) {
        const htmlIndex = trimmed.toLowerCase().indexOf('<html');
        if (htmlIndex !== -1) {
            return '<!DOCTYPE html>\n' + trimmed.substring(htmlIndex);
        }
        return '<!DOCTYPE html>\n<html>\n' + trimmed + '\n</html>';
    }
    
    return text;
}

function showGameResult(prompt, gameCode = null) {
    const gameTitle = document.getElementById('gameTitle');
    const gameDescription = document.getElementById('gameDescription');
    const gameTypeTag = document.getElementById('gameTypeTag');
    const styleTag = document.getElementById('styleTag');

    const gameInfo = analyzePrompt(prompt);
    gameTitle.textContent = gameInfo.title;
    gameDescription.textContent = gameInfo.description;
    gameTypeTag.textContent = gameInfo.type;
    styleTag.textContent = gameInfo.style;

    if (gameCode) {
        loadGeneratedGame(gameCode);
    } else {
        initGameCanvas();
    }
}

function loadGeneratedGame(gameCode) {
    const previewCanvas = document.querySelector('.preview-canvas');
    if (!previewCanvas) return;

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = 'var(--radius-md)';
    
    previewCanvas.innerHTML = '';
    previewCanvas.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(gameCode);
    iframeDoc.close();

    window.currentGameCode = gameCode;
    
    console.log('游戏加载成功！');
}

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

function initGameCanvas() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = canvas.width * 9 / 16;

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballDX = 3;
    let ballDY = 3;
    const ballRadius = 20;

    function draw() {
        ctx.fillStyle = '#0f0f1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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

        const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, ballRadius);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#8b5cf6');
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

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

const playBtn = document.getElementById('playBtn');
const editBtn = document.getElementById('editBtn');
const publishBtn = document.getElementById('publishBtn');
const newGameBtn = document.getElementById('newGameBtn');

if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (window.currentGameCode) {
            const gameWindow = window.open('', '_blank');
            if (gameWindow) {
                gameWindow.document.open();
                gameWindow.document.write(window.currentGameCode);
                gameWindow.document.close();
                gameWindow.document.title = window.gameTitle?.textContent || '生成的游戏';
            }
        } else {
            alert('请先创建一个游戏！');
        }
    });
}

if (editBtn) {
    editBtn.addEventListener('click', () => {
        alert('编辑功能开发中！即将推出...\n\n未来版本将允许你直接修改生成的游戏代码。');
    });
}

if (publishBtn) {
    publishBtn.addEventListener('click', () => {
        if (window.currentGameCode) {
            const gameName = prompt('请输入游戏名称:', window.gameTitle?.textContent || '我的游戏');
            if (gameName) {
                const gameType = document.getElementById('gameType')?.value || '';
                const artStyle = document.getElementById('artStyle')?.value || '';
                
                const game = GameStorage.saveGame(gameName, window.currentGameCode, {
                    gameType: gameType,
                    artStyle: artStyle,
                    prompt: gamePrompt.value
                });
                
                if (game) {
                    alert(`? 游戏"${gameName}"已保存！\n\n你可以在"我的游戏"中查看和管理所有保存的游戏。`);
                    
                    const managerContainer = document.getElementById('myGamesContainer');
                    if (managerContainer) {
                        GameManager.init('myGamesContainer');
                    }
                } else {
                    alert('保存失败，请重试。');
                }
            }
        } else {
            alert('请先创建一个游戏！');
        }
    });
}

if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
        if (confirm('确定要创建新游戏吗？当前进度将会丢失。')) {
            location.reload();
        }
    });
}

console.log('? GameAI Create Page 已加载 - 直接 API 调用模式');
console.log('API 配置:', API_CONFIG.baseUrl);
console.log('模型:', API_CONFIG.model);
