# 🔧 修复：create.html 布局问题 - 首次创作只显示左侧

**版本:** v25  
**日期:** 2026-03-16  
**问题:** 首次访问 create.html 时显示三栏布局，应该只显示左侧创作板块

---

## 📋 问题描述

### 预期行为
- **首次访问** `create.html` → 只显示左侧对话区（创建模式）
- **从"我的游戏"编辑** → 显示三栏布局（编辑模式）
- **创建游戏后刷新** → 保持创建模式（不显示 URL 参数）

### 实际行为（v24 及之前）
- **创建游戏后** → URL 变成 `create.html?edit=game_xxx`
- **刷新页面** → 进入编辑模式（三栏布局）❌
- **再次访问** → 总是显示三栏布局 ❌

---

## 🔍 根本原因

### 问题代码（v24）

```javascript
// create.html 加载后
function init() {
    // 1. 从 URL 加载
    let loaded = loadGameFromURL();  // ← 检查 ?edit=xxx
    
    // 2. 从 sessionStorage 恢复
    if (!loaded) {
        loaded = recoverFromSessionStorage();
    }
    
    // 3. 根据 loaded 决定布局
    if (loaded) {
        setLayoutMode('edit');  // 三栏
    } else {
        setLayoutMode('create');  // 单栏
    }
}

// 创建游戏后
function generateGame() {
    // ... 生成游戏
    saveGame(prompt);
    
    // ❌ 问题：更新 URL，添加 ?edit=xxx
    updateURLWithGameId(currentGameId);
}

// 更新 URL
function updateURLWithGameId(gameId) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('edit', gameId);  // ← 添加 ?edit=xxx
    window.history.replaceState({ gameId }, '', newUrl.toString());
}
```

### 问题流程

```
1. 首次访问 create.html
   → URL: create.html
   → loaded = false
   → setLayoutMode('create') ✅ 正确

2. 创建游戏
   → generateGame()
   → updateURLWithGameId(currentGameId)
   → URL: create.html?edit=game_123 ❌

3. 刷新页面
   → URL: create.html?edit=game_123
   → loadGameFromURL() 读取 ?edit=game_123
   → loaded = true
   → setLayoutMode('edit') ❌ 错误！应该还是创建模式

4. 下次访问 create.html
   → 浏览器可能保留 URL 参数
   → 总是显示三栏布局 ❌
```

---

## ✅ 修复方案

### 核心思路

**区分两种场景：**
1. **从"我的游戏"进入编辑** → 使用 URL 参数 `?edit=xxx` → 三栏布局
2. **首次创作/创建游戏后** → 使用 sessionStorage → 单栏布局

### 修复代码（v25）

#### 1. 修改 `updateURLWithGameId` 函数

```javascript
// 更新 URL 中的游戏 ID（只在从"我的游戏"进入时使用）
function updateURLWithGameId(gameId, force = false) {
    // 如果是 force=true（从我的游戏进入），才更新 URL
    // 否则只保存到 sessionStorage（页面刷新用）
    if (force) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('edit', gameId);
        window.history.replaceState({ gameId: gameId }, '', newUrl.toString());
        console.log('🔗 URL 已更新（编辑模式）:', newUrl.toString());
    } else {
        // 保存到 sessionStorage，用于页面刷新恢复
        sessionStorage.setItem('currentGameId', gameId);
        console.log('💾 已保存到 sessionStorage:', gameId);
    }
}
```

#### 2. 修改 `generateGame` 函数

```javascript
// 创建游戏后
function generateGame() {
    // ... 生成游戏
    saveGame(prompt);
    
    // ✅ 保存到 sessionStorage（用于页面刷新恢复），但不更新 URL
    if (currentGameId) {
        updateURLWithGameId(currentGameId, false);  // false = 不更新 URL
    }
}
```

#### 3. 修改 `loadGameFromURL` 函数

```javascript
// 从 URL 加载游戏（从"我的游戏"进入）
function loadGameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('edit');
    
    console.log('🔍 检查 URL 参数 edit:', gameId);
    
    if (!gameId || !window.GameStorage) {
        console.log('❌ 没有 gameId 或 GameStorage 不可用');
        return false;
    }
    
    const games = GameStorage.getAllGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        console.warn('⚠️ 游戏不存在:', gameId);
        return false;
    }
    
    currentGameId = game.id;
    currentGameCode = game.code;
    currentVersion = game.version || 1;
    
    console.log('✅ 加载游戏:', { id: currentGameId, title: game.title, version: currentVersion });
    
    // 显示游戏预览
    showGamePreview(game.code);
    showGameTitle(game.title);
    
    // 加载对话历史
    loadConversationHistory(currentGameId);
    
    // 分析游戏参数
    if (window.GameAnalyzer) {
        GameAnalyzer.analyze(game.code, currentGameId);
        GameAnalyzer.render('propertiesContent');
    }
    
    // ✅ 更新 URL（确保刷新后仍然保留）- 从"我的游戏"进入，使用 force=true
    updateURLWithGameId(currentGameId, true);  // true = 更新 URL
    
    return true;
}
```

#### 4. 修改 `recoverFromSessionStorage` 函数

```javascript
// 从 sessionStorage 恢复状态（页面刷新）
function recoverFromSessionStorage() {
    const savedGameId = sessionStorage.getItem('currentGameId');
    const savedGameCode = sessionStorage.getItem('currentGameCode');
    const savedVersion = sessionStorage.getItem('currentVersion');
    
    if (!savedGameId || !savedGameCode) {
        return false;
    }
    
    console.log('🔄 从 sessionStorage 恢复:', savedGameId);
    
    currentGameId = savedGameId;
    currentGameCode = savedGameCode;
    currentVersion = parseInt(savedVersion) || 1;
    
    // 显示游戏
    showGamePreview(currentGameCode);
    
    // 加载对话历史
    loadConversationHistory(currentGameId);
    
    // 分析游戏参数
    if (window.GameAnalyzer) {
        GameAnalyzer.analyze(currentGameCode, currentGameId);
        GameAnalyzer.render('propertiesContent');
    }
    
    // ✅ 页面刷新恢复，不更新 URL
    // updateURLWithGameId(currentGameId);  // 不需要
    
    return true;
}
```

---

## 📊 修复后的流程

### 场景 1: 首次访问 create.html

```
1. URL: create.html
2. loadGameFromURL() → gameId = null → return false
3. recoverFromSessionStorage() → sessionStorage 为空 → return false
4. loaded = false
5. setLayoutMode('create') ✅ 单栏布局
```

### 场景 2: 创建新游戏

```
1. 用户输入："创建一个贪食蛇游戏"
2. generateGame()
   - 生成 currentGameId = 'game_123'
   - 保存游戏
   - updateURLWithGameId(currentGameId, false)
   - sessionStorage.currentGameId = 'game_123'
   - URL 不变：create.html ✅
3. 显示游戏预览（三栏）
4. 刷新页面：
   - loadGameFromURL() → false（URL 没有 ?edit）
   - recoverFromSessionStorage() → true（sessionStorage 有值）
   - loaded = true
   - setLayoutMode('edit') → 三栏布局 ✅（恢复编辑状态）
```

### 场景 3: 从"我的游戏"进入编辑

```
1. 点击"编辑"按钮
2. URL: create.html?edit=game_123
3. loadGameFromURL()
   - gameId = 'game_123' ✅
   - 加载游戏数据
   - updateURLWithGameId(currentGameId, true) → 更新 URL
4. loaded = true
5. setLayoutMode('edit') ✅ 三栏布局
6. 刷新页面：
   - URL: create.html?edit=game_123
   - loadGameFromURL() → true
   - 保持三栏布局 ✅
```

### 场景 4: 关闭后重新打开 create.html

```
1. 关闭标签页
2. 重新打开：create.html
3. sessionStorage 已清空
4. loadGameFromURL() → false
5. recoverFromSessionStorage() → false
6. loaded = false
7. setLayoutMode('create') ✅ 单栏布局
```

---

## 📝 修改的文件

| 文件 | 修改内容 | 版本 |
|------|---------|------|
| `js/create-new.js` | `updateURLWithGameId` 添加 force 参数 | v25 |
| `js/create-new.js` | `generateGame` 使用 `force=false` | v25 |
| `js/create-new.js` | `loadGameFromURL` 使用 `force=true` | v25 |
| `js/create-new.js` | `recoverFromSessionStorage` 不更新 URL | v25 |
| `create.html` | 更新 JS 版本号 v24→v25 | v25 |
| `docs/FIX-LAYOUT-MODE-v25.md` | 修复文档（新建） | - |

---

## 🧪 测试步骤

### 测试 1: 首次访问 create.html
1. 打开新标签页
2. 访问 `http://localhost:3000/create.html`
3. 验证：
   - ✅ 只显示左侧对话区（创建模式）
   - ✅ 没有预览区和参数区
   - ✅ URL 没有 `?edit=` 参数

### 测试 2: 创建新游戏
1. 输入："创建一个贪食蛇游戏"
2. 等待游戏生成
3. 验证：
   - ✅ 显示三栏布局（编辑模式）
   - ✅ URL 仍然没有 `?edit=` 参数
   - ✅ 游戏预览正常显示

### 测试 3: 创建游戏后刷新
1. 按 F5 刷新页面
2. 验证：
   - ✅ 显示三栏布局（恢复编辑状态）
   - ✅ 游戏和对话历史都恢复
   - ✅ URL 仍然没有 `?edit=` 参数

### 测试 4: 从"我的游戏"进入编辑
1. 打开 `http://localhost:3000/my-games.html`
2. 点击任意游戏的"编辑"按钮
3. 验证：
   - ✅ 显示三栏布局
   - ✅ URL 有 `?edit=game_xxx` 参数
   - ✅ 游戏和对话历史正确加载

### 测试 5: 从"我的游戏"编辑后刷新
1. 在编辑页面按 F5 刷新
2. 验证：
   - ✅ 显示三栏布局
   - ✅ URL 保持 `?edit=game_xxx` 参数
   - ✅ 游戏和对话历史正确恢复

### 测试 6: 关闭后重新打开
1. 关闭 create.html 标签页
2. 重新打开 `http://localhost:3000/create.html`
3. 验证：
   - ✅ 只显示左侧对话区（创建模式）
   - ✅ sessionStorage 已清空
   - ✅ 可以创建新游戏

---

## 🎯 预期效果

### 修复前 ❌
```
首次访问 create.html:
  ✅ 单栏布局

创建游戏后:
  ❌ URL: create.html?edit=game_123

刷新页面:
  ❌ 三栏布局（错误！）

关闭后重新打开:
  ❌ 三栏布局（错误！）
```

### 修复后 ✅
```
首次访问 create.html:
  ✅ 单栏布局

创建游戏后:
  ✅ URL: create.html（不变）

刷新页面:
  ✅ 三栏布局（正确恢复）

关闭后重新打开:
  ✅ 单栏布局（正确！）

从"我的游戏"进入:
  ✅ URL: create.html?edit=game_123
  ✅ 三栏布局

从"我的游戏"编辑后刷新:
  ✅ URL: create.html?edit=game_123
  ✅ 三栏布局
```

---

## 🔧 技术细节

### URL vs sessionStorage

| 特性 | URL 参数 | sessionStorage |
|------|---------|----------------|
| **持久性** | 保留在 URL 中 | 标签页关闭后清空 |
| **用途** | 从"我的游戏"进入编辑 | 页面刷新恢复 |
| **可见性** | 用户可见 | 用户不可见 |
| **分享** | 可以分享链接 | 不能分享 |

### 布局模式判断逻辑

```javascript
function init() {
    // 1. 优先从 URL 加载（从"我的游戏"进入）
    let loaded = loadGameFromURL();  // 检查 ?edit=xxx
    
    // 2. 其次从 sessionStorage 恢复（页面刷新）
    if (!loaded) {
        loaded = recoverFromSessionStorage();
    }
    
    // 3. 根据 loaded 决定布局
    if (loaded) {
        // 有游戏加载 → 编辑模式（三栏）
        setLayoutMode('edit');
    } else {
        // 没有游戏 → 创建模式（单栏）
        setLayoutMode('create');
        showWelcomeMessage();
    }
}
```

---

## 🎉 核心成果

**问题:** 创建游戏后 URL 被修改，导致总是显示三栏布局  
**原因:** `updateURLWithGameId` 总是更新 URL  
**解决:** 
- 添加 `force` 参数区分场景
- 创建游戏：只保存到 sessionStorage
- 从"我的游戏"进入：更新 URL

**效果:**
- ✅ 首次访问：单栏布局
- ✅ 创建游戏后：三栏布局（URL 不变）
- ✅ 刷新页面：正确恢复
- ✅ 关闭重开：单栏布局
- ✅ 从"我的游戏"进入：三栏布局（URL 有参数）

---

**修复状态:** ✅ 完成  
**版本:** v25  
**测试:** 请验证所有场景
