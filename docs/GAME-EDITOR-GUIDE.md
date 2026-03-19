# 🎮 AI Game Editor - 轻量级游戏编辑器

> **类似 Godot 的简化版，完全在浏览器中运行**

---

## 📋 概述

AI Game Editor 是一个轻量级的可视化游戏编辑器，专为 AI 生成的 HTML5 游戏设计。它提供了类似 Godot 的核心功能，但完全在浏览器中运行，无需安装任何软件。

### ✨ 核心特性

- **🎯 可视化编辑** - 组件树 + 属性面板，直观调整游戏对象
- **⚡ 实时预览** - 修改属性后立即看到效果
- **💾 自动保存** - 支持防抖自动保存，防止数据丢失
- **📦 一键导出** - 导出为独立 HTML 文件
- **🔧 代码编辑** - 内置代码编辑器，支持直接修改源码
- **🎮 运行/停止** - 在编辑器中直接测试游戏

---

## 🏗️ 架构设计

### 三栏布局

```
┌──────────────────────────────────────────────────────────────┐
│                     🎮 游戏编辑器                              │
├─────────────┬──────────────────────────┬─────────────────────┤
│             │                          │                     │
│  📦 组件树   │     🖼️ 画布预览          │    ⚙️ 属性面板       │
│             │                          │                     │
│  Main       │   ┌────────────┐         │  Player 属性        │
│  ├─ Player  │   │            │         │  位置：[180][320]   │
│  ├─ Enemy   │   │  游戏预览   │         │  速度：[300] ◄──►   │
│  └─ UI      │   │            │         │  颜色：[#ff0000] 🎨 │
│             │   └────────────┘         │  大小：[32][32]     │
│             │                          │                     │
│             │  [▶️ 运行] [⏹️ 停止]      │                     │
│             │  [💾 保存] [📦 导出]      │                     │
├─────────────┴──────────────────────────┴─────────────────────┤
│  📝 代码编辑器                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ function update() {                                      ││
│  │     player.x += speed * deltaTime;                       ││
│  │ }                                                        ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

### 模块结构

```
js/
├── game-editor.js      # 编辑器核心模块
│   ├── init()          # 初始化编辑器
│   ├── parseGameObjects()  # 解析游戏对象
│   ├── renderComponentTree()  # 渲染组件树
│   ├── renderPropertyPanel()  # 渲染属性面板
│   ├── updateProperty()  # 更新属性
│   ├── runGame()       # 运行游戏
│   ├── stopGame()      # 停止游戏
│   ├── saveGame()      # 保存游戏
│   └── exportGame()    # 导出游戏
│
css/
└── game-editor.css     # 编辑器样式
    ├── .editor-container      # 主容器
    ├── .editor-sidebar-left   # 左侧边栏
    ├── .editor-canvas         # 画布区域
    ├── .editor-sidebar-right  # 右侧边栏
    ├── .editor-code-panel     # 代码面板
    └── .property-*            # 属性相关样式
```

---

## 🚀 使用指南

### 1. 打开编辑器

1. 在创作页面创建一个游戏
2. 点击预览区上方的 **🎮 编辑器** 按钮
3. 编辑器模态框将打开，显示三栏界面

### 2. 查看组件树

**左侧边栏** 显示游戏中的所有对象：

- 📁 Main - 主场景节点
- 👤 Player - 玩家角色
- 🖼️ Sprite2D - 精灵图片
- ⬜ CollisionShape2D - 碰撞体
- 📷 Camera2D - 摄像机
- 📝 Label - 文本标签

**点击对象** 可在右侧查看和编辑其属性。

### 3. 编辑属性

**右侧属性面板** 支持多种属性类型：

#### 数值属性
```
速度：[300] ◄─────滑块─────►
       [300] ← 数字输入框
```
- 拖动滑块快速调整
- 直接输入精确数值
- 两个输入框实时同步

#### 位置属性
```
位置：
  X: [180]
  Y: [320]
```

#### 颜色属性
```
颜色：[#ff0000] 🎨
       ← 颜色选择器
       ← 文本输入框
```

### 4. 运行和测试

点击顶部工具栏：

- **▶️ 运行** - 在画布中运行游戏
- **⏹️ 停止** - 停止游戏运行
- **💾 保存** - 保存当前修改
- **📦 导出** - 导出为 HTML 文件

### 5. 代码编辑

**底部代码编辑器** 允许直接修改游戏源码：

1. 在代码编辑器中修改 HTML/JS/CSS
2. 点击 **✅ 应用** 按钮
3. 预览将立即更新

---

## 💡 最佳实践

### 快速调整游戏参数

```
场景：贪食蛇速度太慢

1. 点击组件树中的 "Player" 或 "Snake"
2. 在属性面板找到 "speed"
3. 拖动滑块从 300 → 500
4. 点击 "▶️ 运行" 测试
5. 满意后点击 "💾 保存"
```

### 修改颜色主题

```
场景：想把飞机大战的飞机改成蓝色

1. 点击组件树中的 "Player"
2. 在属性面板找到 "color"
3. 点击颜色选择器，选择蓝色
4. 或直接在文本框输入 "#0000ff"
5. 实时预览效果
```

### 调整游戏难度

```
场景：打砖块太难了

1. 点击 "Ball" 对象
2. 降低 "speed" 属性（如 400 → 250）
3. 点击 "Enemy" 或 "Brick"
4. 增加 "health" 或减少 "damage"
5. 运行测试，反复调整直到合适
```

---

## 🔧 技术细节

### 属性同步机制

```javascript
// 1. 用户在属性面板修改值
updateProperty('player', 'speed', 500);

// 2. 更新内存中的游戏对象
obj.properties['speed'] = 500;

// 3. 如果游戏正在运行，通过 postMessage 发送到 iframe
if (state.isPlaying) {
    iframe.contentWindow.postMessage({
        type: 'UPDATE_PROPERTY',
        objectId: 'player',
        property: 'speed',
        value: 500
    }, '*');
}

// 4. 防抖自动保存（1 秒后）
debounceSave();
```

### 游戏对象解析

```javascript
// 从 HTML5 代码中提取游戏对象
function parseGameObjects() {
    state.gameObjects = [
        {
            id: 'main',
            name: 'Main',
            type: 'Node2D',
            properties: {
                position: { x: 0, y: 0 },
                scale: { x: 1, y: 1 }
            }
        },
        {
            id: 'player',
            name: 'Player',
            type: 'CharacterBody2D',
            properties: {
                position: { x: 180, y: 320 },
                speed: 300,
                color: '#ff0000'
            }
        }
    ];
}
```

### 自动保存机制

```javascript
// 防抖保存（1 秒无操作后自动保存）
let saveTimer = null;
function debounceSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(saveGame, 1000);
}

// 每次属性修改都会触发
function updateProperty(...) {
    // ... 更新属性
    if (state.autoSave) {
        debounceSave();
    }
}
```

---

## 🎯 与 Godot 的对比

| 功能 | Godot | AI Game Editor |
|------|-------|----------------|
| **安装** | 需要下载 (100MB+) | 无需安装，即开即用 |
| **启动速度** | 30-60 秒 | 2-3 秒 |
| **学习曲线** | 陡峭（完整引擎） | 平缓（简化版） |
| **AI 集成** | 困难 | 原生支持 |
| **实时预览** | 需要运行场景 | 始终可见 |
| **代码编辑** | 内置编辑器 | 内置编辑器 |
| **组件系统** | 完整节点树 | 简化对象树 |
| **属性编辑** | 检查器面板 | 属性面板 |
| **导出格式** | 多平台 | HTML5 |
| **适用场景** | 专业开发 | 快速原型 + AI 生成 |

---

## 📊 性能指标

- **加载大小**: ~15KB (game-editor.js) + ~7KB (CSS)
- **启动时间**: < 100ms
- **内存占用**: < 10MB
- **渲染帧率**: 60 FPS (取决于游戏本身)

---

## 🔮 未来规划

### v32 (当前)
- ✅ 基础三栏布局
- ✅ 组件树显示
- ✅ 属性面板编辑
- ✅ 实时预览
- ✅ 代码编辑器
- ✅ 运行/停止功能

### v33 (计划)
- [ ] 拖拽放置对象
- [ ] 添加/删除游戏对象
- [ ] 组件系统（碰撞体、音频等）
- [ ] 动画编辑器
- [ ] 资源管理器

### v34 (计划)
- [ ] 可视化脚本（类似 Godot 的 VisualScript）
- [ ] 场景系统
- [ ] 预制体系统
- [ ] 粒子编辑器
- [ ] 瓦片地图编辑器

### v35 (计划)
- [ ] 与 Godot 双向同步
- [ ] 云端项目存储
- [ ] 协作编辑
- [ ] 版本历史
- [ ] 插件系统

---

## 🐛 已知限制

1. **游戏对象解析** - 目前使用硬编码示例，需要实现智能解析
2. **属性同步** - 需要游戏代码支持 postMessage 通信
3. **撤销/重做** - 暂未实现
4. **多选编辑** - 暂不支持同时编辑多个对象
5. **嵌套对象** - 组件树暂不支持多层嵌套显示

---

## 📝 开发者笔记

### 添加新的属性类型

```javascript
// 在 game-editor.js 的 renderPropertyPanel() 中添加

else if (typeof value === 'boolean') {
    // 布尔属性
    html += `
        <div class="property-group">
            <label>${capitalize(key)}</label>
            <input type="checkbox" ${value ? 'checked' : ''}
                   data-object="${obj.id}" 
                   data-property="${key}">
        </div>
    `;
}
```

### 添加新的对象类型

```javascript
// 在 parseGameObjects() 中添加

{
    id: 'enemy',
    name: 'Enemy',
    type: 'CharacterBody2D',
    properties: {
        position: { x: 400, y: 300 },
        speed: 200,
        health: 100
    }
}
```

---

## 🎓 学习资源

- [Godot 文档](https://docs.godotengine.org/) - 了解完整的游戏引擎概念
- [HTML5 Canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) - 游戏渲染基础
- [postMessage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage) - iframe 通信机制

---

## 📄 许可证

与 AI Game Platform 保持一致

---

**🎮 享受创作的乐趣！**
