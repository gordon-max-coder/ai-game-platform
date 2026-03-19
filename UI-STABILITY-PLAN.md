# 🎯 游戏生成器 UI 稳定性方案

## 问题分析

### 当前实现（每次重写）
```
用户：创建贪食蛇
  ↓
[完整生成 HTML + CSS + JS]
  ↓
结果：完整游戏，但 UI 随机

用户：加个 AI 对手
  ↓
[重新生成完整 HTML + CSS + JS]
  ↓
结果：UI 可能变了，功能可能丢了
```

### 竞品实现（分层累加）
```
用户：创建贪食蛇
  ↓
[固定 UI 框架] + [游戏逻辑层：贪食蛇]
  ↓
结果：UI 统一，功能正确

用户：加个 AI 对手
  ↓
[固定 UI 框架] + [游戏逻辑层：贪食蛇 + AI 对手]
  ↓
结果：UI 不变，功能累加
```

---

## 🏗️ 技术方案

### 方案 A：固定模板 + 代码注入（推荐）

#### 1. 创建固定游戏模板

**文件**: `game-template.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{GAME_TITLE}}</title>
<style>
  /* ========== 固定 UI 样式（永不改变） ========== */
  html, body {
    margin: 0;
    padding: 0;
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    overflow: hidden;
    user-select: none;
  }
  
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .game-header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 16px 32px;
    margin-bottom: 20px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .game-title {
    color: #fff;
    font-size: 28px;
    font-weight: bold;
    margin: 0 0 12px 0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .game-stats {
    display: flex;
    gap: 24px;
    justify-content: center;
  }
  
  .stat-item {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
  }
  
  .stat-value {
    color: #4fd1c5;
    font-weight: bold;
    font-size: 20px;
  }
  
  canvas {
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.1);
    background: #0f0f23;
  }
  
  .game-controls {
    margin-top: 20px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    text-align: center;
  }
</style>
</head>
<body>
<div class="game-container">
  <div class="game-header">
    <h1 class="game-title">{{GAME_TITLE}}</h1>
    <div class="game-stats">
      <div class="stat-item">得分：<span class="stat-value" id="score">0</span></div>
      <div class="stat-item">最高：<span class="stat-value" id="highScore">0</span></div>
      <div class="stat-item">关卡：<span class="stat-value" id="level">1</span></div>
    </div>
  </div>
  
  <canvas id="gameCanvas" width="360" height="640"></canvas>
  
  <div class="game-controls">
    {{GAME_CONTROLS}}
  </div>
</div>

<script>
// ========== 固定游戏框架（永不改变） ==========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const levelEl = document.getElementById('level');

let score = 0;
let highScore = localStorage.getItem('{{GAME_ID}}_highscore') || 0;
let level = 1;
let gameState = 'menu'; // menu, playing, paused, gameover
let lastTime = 0;

// 游戏循环
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  update(deltaTime);
  render();
  
  requestAnimationFrame(gameLoop);
}

// 更新函数（由游戏逻辑实现）
function update(deltaTime) {
  // {{GAME_UPDATE}}
}

// 渲染函数（由游戏逻辑实现）
function render() {
  // {{GAME_RENDER}}
}

// 输入处理
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key] = true;
  handleInput(e.key, true);
});
window.addEventListener('keyup', e => {
  keys[e.key] = false;
  handleInput(e.key, false);
});

function handleInput(key, pressed) {
  // {{GAME_INPUT}}
}

// 工具函数
function updateScore(points) {
  score += points;
  scoreEl.textContent = score;
  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = highScore;
    localStorage.setItem('{{GAME_ID}}_highscore', highScore);
  }
}

function setLevel(newLevel) {
  level = newLevel;
  levelEl.textContent = level;
}

// 启动游戏
highScoreEl.textContent = highScore;
requestAnimationFrame(gameLoop);

// ========== 游戏逻辑注入区 ==========
// {{GAME_LOGIC}}
</script>
</body>
</html>
```

---

#### 2. 修改 server.js 支持分层生成

**修改点**: 在 `/api/generate` 中添加 `baseTemplate` 参数

```javascript
// 新增：游戏模板管理
const GAME_TEMPLATES = {
  default: 'game-template.html',
  snake: 'game-template-snake.html',
  platformer: 'game-template-platformer.html'
};

// 在请求处理中
if (req.url === '/api/generate' && req.method === 'POST') {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const requestData = JSON.parse(body);
    
    // 新增：支持传入游戏 ID（累加修改）
    const gameId = requestData.gameId;
    const isModification = !!gameId;
    
    // 新增：加载历史上下文
    let conversationHistory = [];
    if (isModification) {
      const historyFile = path.join(__dirname, 'game-history', `${gameId}.json`);
      if (fs.existsSync(historyFile)) {
        const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
        conversationHistory = history.messages || [];
      }
    }
    
    // 构建提示词（关键！）
    const systemPrompt = `你是专业的游戏开发 AI 助手。

重要规则：
1. 保持 UI 风格一致 - 使用提供的模板，不要修改 CSS
2. 累加功能 - 在现有代码基础上添加新功能，不要重写
3. 保持代码结构 - 遵循模板中的函数签名
4. 只返回游戏逻辑代码，不要返回完整 HTML`;

    const userPrompt = isModification 
      ? `在现有游戏基础上修改：${requestData.prompt}

现有游戏描述：${requestData.gameDescription}
需要添加/修改的功能：${requestData.prompt}

请只返回需要修改的游戏逻辑代码片段。`
      : `创建新游戏：${requestData.prompt}

请使用提供的游戏模板，实现以下游戏：
${requestData.prompt}

返回完整的游戏逻辑代码。`;

    // 构建消息历史（累加上下文）
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userPrompt }
    ];
    
    // ... 发送 API 请求 ...
  });
}
```

---

#### 3. 前端修改：create-new.js

**修改点**: 支持游戏 ID 和累加修改

```javascript
// 新增：当前游戏状态
let currentGameId = null;
let currentGameCode = null;
let modificationCount = 0;

// 修改：生成游戏函数
async function generateGame(prompt, isModification = false) {
  const modelSelect = document.getElementById('modelSelect');
  const selectedModel = modelSelect.value;
  
  const requestData = {
    model: selectedModel,
    messages: [{
      role: 'user',
      content: isModification 
        ? `修改游戏：${prompt}`
        : `创建游戏：${prompt}`
    }],
    max_tokens: 8000,
    temperature: 0.7
  };
  
  // 新增：如果是修改，带上游戏 ID
  if (isModification && currentGameId) {
    requestData.gameId = currentGameId;
    requestData.isModification = true;
  }
  
  const response = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // 新增：保存游戏历史
    if (!currentGameId) {
      currentGameId = generateGameId();
      modificationCount = 0;
    } else {
      modificationCount++;
    }
    
    saveGameHistory(currentGameId, {
      prompt: prompt,
      code: data.choices[0].message.content,
      timestamp: new Date().toISOString(),
      modificationCount: modificationCount
    });
    
    // 渲染游戏
    renderGame(data.choices[0].message.content);
  }
}

// 新增：保存游戏历史
function saveGameHistory(gameId, data) {
  const historyDir = 'game-history';
  const historyFile = path.join(historyDir, `${gameId}.json`);
  
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }
  
  let history = {
    gameId: gameId,
    createdAt: new Date().toISOString(),
    messages: []
  };
  
  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  }
  
  history.messages.push({
    role: 'user',
    content: data.prompt
  });
  
  history.messages.push({
    role: 'assistant',
    content: data.code
  });
  
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}
```

---

### 方案 B：提示词工程（快速实现）

如果不想改架构，可以通过**优化提示词**来稳定 UI：

#### 修改 server.js 的提示词

```javascript
const systemPrompt = `你是专业的游戏开发 AI 助手。

**固定 UI 规范（必须遵守）**：
1. Canvas 尺寸：360x640 像素（9:16 竖屏）
2. 背景色：linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)
3. 字体：PingFang SC, Microsoft YaHei
4. 圆角：12px
5. 阴影：0 8px 32px rgba(0, 0, 0, 0.4)
6. 得分显示：顶部居中，白色文字，青色数值

**代码结构规范**：
1. 必须有 update() 函数
2. 必须有 render() 函数
3. 必须有 handleInput() 函数
4. 使用 requestAnimationFrame 游戏循环
5. 得分系统使用 localStorage 保存

**累加修改规则**：
1. 保留所有现有功能
2. 只添加新功能，不删除旧功能
3. 保持变量命名一致
4. 保持代码风格一致`;

const userPrompt = `${requestData.prompt}

请创建一个符合上述 UI 规范的游戏。
只返回完整的 HTML 代码，不要其他说明。`;
```

---

## 📊 方案对比

| 维度 | 方案 A：分层架构 | 方案 B：提示词工程 |
|------|----------------|------------------|
| **UI 稳定性** | ⭐⭐⭐⭐⭐ 100% 固定 | ⭐⭐⭐⭐ 80% 稳定 |
| **功能累加** | ⭐⭐⭐⭐⭐ 完美支持 | ⭐⭐⭐ 依赖模型 |
| **实现难度** | 中（需改架构） | 低（只改提示词） |
| **开发时间** | 2-3 天 | 2-3 小时 |
| **长期维护** | 容易 | 需要持续优化 |

---

## 🎯 推荐实施路径

### 第一阶段（今天）：提示词优化
1. 修改 server.js 的 system prompt
2. 添加固定 UI 规范
3. 测试生成稳定性

### 第二阶段（本周）：历史记录
1. 创建 game-history 目录
2. 保存每次对话历史
3. 修改时带上上下文

### 第三阶段（下周）：分层架构
1. 创建固定游戏模板
2. 修改 API 支持代码注入
3. 前端支持游戏 ID

---

## 💡 立即可做的优化

### 1. 修改 server.js 添加固定规范

在 `server.js` 的 `systemPrompt` 中添加：

```javascript
const systemPrompt = `你是专业的游戏开发 AI 助手。

**重要 UI 规范**：
- Canvas: 360x640 像素
- 背景：深色渐变 (#1a1a2e → #16213e)
- 字体：PingFang SC
- 圆角：12px
- 阴影：0 8px 32px rgba(0,0,0,0.4)

**重要代码规范**：
- 必须有 update() 和 render() 函数
- 使用 requestAnimationFrame
- localStorage 保存最高分

**累加修改规则**：
- 保留所有现有功能
- 只添加，不删除
- 保持变量命名一致`;
```

### 2. 创建游戏历史目录

```bash
cd C:\Users\jiangym\.copaw\ai-game-platform
mkdir game-history
```

### 3. 修改 create-new.js 保存历史

在 `generateGame` 函数中添加历史记录保存逻辑。

---

## 📝 总结

竞品做到 UI 稳定的核心秘密：
1. **固定模板**：UI 框架永不改变
2. **分层注入**：只修改游戏逻辑层
3. **历史上下文**：每次修改都带完整历史
4. **配置化**：通过参数调整而非重写

你的当前问题：
- ❌ 每次都完整重写
- ❌ 没有历史记录
- ❌ 提示词没有 UI 规范

解决方向：
- ✅ 短期：优化提示词（今天）
- ✅ 中期：添加历史记录（本周）
- ✅ 长期：分层架构（下周）
