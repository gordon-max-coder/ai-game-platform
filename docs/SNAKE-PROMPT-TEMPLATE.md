# 🐍 贪食蛇游戏 - 超级提示词模板

> 专为 Gemini Flash Lite 优化，生成接近 Claude 质量的代码

---

## 🎯 完整提示词 (直接复制使用)

```
请创建一个完整的贪食蛇游戏，使用 HTML5 Canvas 和原生 JavaScript。

【技术要求】
- 单文件 HTML，包含所有 CSS 和 JavaScript
- 使用 Canvas API 渲染
- 响应式设计，支持桌面和移动端
- 代码结构清晰，有详细注释

【游戏核心功能】

1. 蛇的移动系统
   - 使用箭头键控制方向 (上下左右)
   - 蛇身由多个方块组成，跟随头部移动
   - 移动速度：初始 8 格/秒
   - 不能直接掉头 (例如向右时不能直接向左)
   - 蛇头颜色：深绿色 (#2ecc71)
   - 蛇身颜色：渐变绿色 (从头部 #2ecc71 到尾部 #27ae60)

2. 食物系统
   - 红色圆形食物 (#e74c3c)
   - 随机出现在网格上 (不在蛇身上)
   - 被吃后：分数 +10，蛇身 +1 节，重新生成
   - 食物有轻微脉动动画

3. 计分系统
   - 当前分数：左上角显示
   - 最高分：使用 localStorage 保存
   - 字体：白色，20px，加粗
   - 背景：半透明黑色

4. 碰撞检测
   - 撞墙：游戏结束
   - 撞自己：游戏结束
   - 检测要精确到像素级别

5. 游戏状态管理
   - 开始界面：显示标题、说明、"按空格键开始"
   - 游戏进行中：正常游戏画面
   - 游戏结束：显示最终分数、最高分、"按 R 键重新开始"
   - 暂停功能：按 P 键暂停/继续

【视觉效果要求】

1. 画布背景
   - 深色背景：#1a1a2e
   - 网格线：淡灰色细线 (#333355)，间距 20px
   - 画布尺寸：600x600 像素

2. 蛇的渲染
   - 蛇头：稍大的方块 (22x22)，圆角
   - 蛇身：20x20 方块，圆角半径 5px
   - 每节之间有 2px 间隙
   - 蛇头添加眼睛效果 (两个小白点)

3. 特效
   - 吃到食物时：粒子爆炸效果 (5-8 个小圆点散开)
   - 游戏结束时：屏幕闪烁红色 3 次
   - 蛇移动时有轻微拖尾效果

4. UI 元素
   - 分数板：半透明黑色背景，圆角
   - 按钮：渐变背景，悬停效果
   - 文字：白色，清晰可读

【难度系统】

- 初始速度：8 格/秒
- 每吃 5 个食物：速度 +1 格/秒
- 最高速度：15 格/秒
- 速度提升时显示"加速!"提示

【移动端支持】

- 添加虚拟方向键 (上、下、左、右)
- 支持触摸滑动控制方向
- 按钮尺寸：至少 60x60 像素
- 防止触摸时页面滚动

【代码质量要求】

1. 结构组织
   - 使用 IIFE 或模块模式避免全局污染
   - 清晰的函数划分：init(), gameLoop(), draw(), update()
   - 常量定义：GRID_SIZE, CANVAS_SIZE, COLORS 等

2. 性能优化
   - 使用 requestAnimationFrame 而非 setInterval
   - 只重绘变化的部分
   - 避免内存泄漏

3. 代码注释
   - 每个主要函数都有说明
   - 关键算法有注释
   - 魔法数字要解释

【额外加分项】

- 添加音效 (使用 Web Audio API 生成简单音效)
  - 吃到食物：高音"叮"
  - 撞墙：低音"砰"
  - 游戏开始：上升音阶
- 添加难度选择 (简单、中等、困难)
- 添加特殊食物 (金色食物，50 分，稀有出现)

【输出格式】

请提供完整的、可直接运行的 HTML 文件。
不要分段提供，一次性输出完整代码。
代码长度预计 400-600 行。

开始生成：
```

---

## 📊 提示词结构分析

### 为什么这个提示词有效？

| 要素 | 作用 | Gemini 响应 |
|------|------|------------|
| **明确技术栈** | 避免模型选择不确定的技术 | ✅ 使用 Canvas + 原生 JS |
| **具体数值** | 减少模型猜测 | ✅ 精确的速度、颜色、尺寸 |
| **视觉细节** | 提升美观度 | ✅ 渐变、圆角、粒子效果 |
| **状态管理** | 完整用户体验 | ✅ 开始/进行/结束/暂停 |
| **代码要求** | 保证代码质量 | ✅ 模块化、注释、优化 |
| **额外功能** | 超出预期 | ✅ 音效、难度选择 |

---

## 🎨 关键优化点

### 1. 具体化所有参数

**❌ 模糊**:
```
"蛇移动流畅"
```

**✅ 具体**:
```
"移动速度：初始 8 格/秒，每吃 5 个食物 +1，最高 15 格/秒"
```

### 2. 定义视觉规范

**❌ 模糊**:
```
"好看的视觉效果"
```

**✅ 具体**:
```
"蛇头：深绿色 #2ecc71，蛇身：渐变到 #27ae60，圆角 5px"
"背景：深色 #1a1a2e，网格线：淡灰 #333355"
```

### 3. 指定代码结构

**❌ 模糊**:
```
"代码要整洁"
```

**✅ 具体**:
```
"使用 IIFE 模式，函数划分：init(), gameLoop(), draw(), update()"
"常量定义：GRID_SIZE, CANVAS_SIZE, COLORS"
"使用 requestAnimationFrame 而非 setInterval"
```

### 4. 添加边界情况处理

**❌ 忽略**:
```
(没有提到碰撞检测细节)
```

**✅ 明确**:
```
"撞墙：游戏结束，撞自己：游戏结束"
"不能直接掉头 (向右时不能直接向左)"
"食物随机出现在不在蛇身上的位置"
```

### 5. 要求完整用户体验

**❌ 只有游戏**:
```
"做一个贪食蛇游戏"
```

**✅ 完整流程**:
```
"开始界面 → 游戏进行 → 游戏结束 → 重新开始"
"暂停功能 (P 键)，最高分保存 (localStorage)"
```

---

## 🔧 针对不同需求的变体

### 极简版 (快速原型)

```
创建一个简单的贪食蛇游戏：
- HTML5 Canvas，单文件
- 箭头键控制，吃红色食物变长
- 撞墙或撞自己游戏结束
- 显示当前分数
- 深色背景，绿色蛇，红色食物
- 代码简洁，有注释

直接输出完整 HTML 代码。
```

### 标准版 (日常使用)

```
创建一个完整的贪食蛇游戏，HTML5 Canvas 实现。

【核心功能】
- 箭头键控制方向，不能直接掉头
- 吃红色食物变长，分数 +10
- 撞墙或撞自己游戏结束
- 显示当前分和最高分 (localStorage)
- 开始界面和游戏结束界面

【视觉效果】
- 画布 600x600，深色背景 #1a1a2e
- 蛇：绿色渐变，圆角方块
- 食物：红色圆形，脉动动画
- 网格线：淡灰色

【代码要求】
- 单文件 HTML
- 使用 requestAnimationFrame
- 清晰的函数划分和注释

输出完整可运行代码。
```

### 豪华版 (商业级)

```
(使用上面的完整超级提示词)
```

---

## 💡 使用技巧

### 1. 分步生成策略

如果一次性生成效果不好，可以分步：

**第 1 步 - 基础框架**:
```
先创建贪食蛇的基础框架：
- HTML 结构和 Canvas 设置
- 蛇的数据结构和移动逻辑
- 基本的 draw() 和 update() 函数
- 能运行但先不加食物和计分

输出完整代码。
```

**第 2 步 - 添加功能**:
```
在现有代码基础上添加：
- 食物系统 (随机位置，被吃后重生)
- 计分系统 (当前分 + 最高分)
- 碰撞检测 (撞墙 + 撞自己)
- 游戏结束界面

输出完整更新后的代码。
```

**第 3 步 - 优化效果**:
```
优化视觉效果：
- 蛇身渐变颜色
- 食物脉动动画
- 粒子爆炸效果
- 网格背景和 UI 美化

输出最终完整代码。
```

### 2. 提供示例代码

```
参考这个代码风格和结构：

[粘贴一段你喜欢的代码示例，约 50-100 行]

请用类似的代码风格、命名规范、注释方式
来实现贪食蛇游戏。
```

### 3. 指定"不要什么"

```
【避免的问题】
- 不要使用外部库 (纯原生 JS)
- 不要使用 setInterval (用 requestAnimationFrame)
- 不要全局变量污染 (用 IIFE 或模块模式)
- 不要硬编码魔法数字 (定义常量)
- 不要省略注释
```

### 4. 强调代码长度

```
代码长度预计 400-600 行。
请确保代码完整，不要省略任何部分。
如果接近输出限制，请优先保证核心功能完整。
```

---

## 📈 提示词迭代记录

### V1.0 - 基础版
```
创建一个贪食蛇游戏，HTML5 Canvas，箭头键控制，
吃食物变长，撞墙游戏结束，显示分数。
```
**问题**: 太简单，生成质量不稳定

### V2.0 - 添加细节
```
创建贪食蛇游戏：
- 600x600 Canvas，深色背景
- 绿色蛇，红色食物
- 计分和最高分
- 开始和结束界面
```
**改进**: 质量提升，但代码结构混乱

### V3.0 - 结构化 (当前)
```
(完整的超级提示词)
```
**效果**: 接近 Claude 质量，代码结构清晰

---

## 🎯 预期输出质量

使用超级提示词后，Gemini 应该生成：

✅ **完整功能**: 所有核心功能都实现  
✅ **代码结构**: 模块化，有注释，无全局污染  
✅ **视觉效果**: 渐变、动画、粒子效果  
✅ **用户体验**: 开始/结束界面，暂停功能  
✅ **性能优化**: requestAnimationFrame，无内存泄漏  
✅ **代码行数**: 400-600 行完整代码  

---

## 🚀 快速复制模板

### 中文完整版
见上方"完整提示词"部分

### 英文版 (有时效果更好)
```
Create a complete Snake game using HTML5 Canvas and vanilla JavaScript.

[Technical Requirements]
- Single HTML file with embedded CSS and JS
- Canvas API for rendering
- Responsive design for desktop and mobile
- Clean code structure with detailed comments

[Core Features]

1. Snake Movement
   - Arrow keys control direction
   - Snake body follows head
   - Initial speed: 8 cells/second
   - Cannot reverse direction directly
   - Head color: #2ecc71, Body: gradient to #27ae60

2. Food System
   - Red circular food (#e74c3c)
   - Random position (not on snake)
   - Score +10, grow +1 segment on eat
   - Subtle pulsing animation

3. Scoring
   - Current score (top-left)
   - High score (localStorage)
   - White text, 20px, bold

4. Collision Detection
   - Wall collision: game over
   - Self collision: game over
   - Pixel-perfect detection

5. Game States
   - Start screen: title, instructions, "Press SPACE to start"
   - Playing: normal gameplay
   - Game over: final score, high score, "Press R to restart"
   - Pause: Press P to pause/resume

[Visual Effects]

1. Canvas: #1a1a2e background, #333355 grid lines (20px spacing)
2. Snake: 22x22 head, 20x20 body, 5px border-radius, 2px gap
3. Effects: particle explosion on eat, screen flash on game over
4. UI: Semi-transparent backgrounds, rounded corners, hover effects

[Difficulty System]
- Start: 8 cells/sec
- Every 5 foods: +1 speed
- Max: 15 cells/sec
- Show "Speed Up!" on increase

[Mobile Support]
- Virtual D-pad buttons (60x60px min)
- Touch swipe controls
- Prevent page scroll on touch

[Code Quality]
- IIFE/module pattern (no global pollution)
- Clear functions: init(), gameLoop(), draw(), update()
- Constants: GRID_SIZE, CANVAS_SIZE, COLORS
- requestAnimationFrame (not setInterval)
- Detailed comments for all major functions

[Bonus Features]
- Sound effects (Web Audio API)
- Difficulty selection (Easy/Medium/Hard)
- Special golden food (50 points, rare)

[Output Format]
Provide complete, runnable HTML file in one go.
Expected length: 400-600 lines of code.

Start generating:
```

---

*最后更新：2025-01-15*  
*适用模型：Gemini Flash Lite, Gemini 2.5 Flash*
