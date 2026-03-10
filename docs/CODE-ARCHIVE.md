# 🏛️ GameAI 功能代码档案库

## 📋 功能清单

**最后更新**: 2025-01-XX  
**状态**: ✅ 活跃维护

---

## ✅ 已实现功能列表

### 1. 灵感生成器 (Inspiration Generator)
**状态**: ✅ 已完成  
**文件**: `js/inspiration.js`  
**UI**: `create.html`  
**样式**: `css/create-layout.css`  

**功能描述**:
- 3 轮*3 项交互式选择
- 9 种游戏类型 × 9 种玩法 × 9 种风格 = 729 种组合
- 自动生成详细提示词
- 打字动画填充

**核心代码位置**:
```
ai-game-platform/
├── js/
│   └── inspiration.js          # 主逻辑 (30KB)
├── css/
│   └── create-layout.css       # 按钮样式 (+50 行)
└── create.html                 # UI 集成
```

**关键函数**:
```javascript
InspirationGenerator.init()           // 初始化
InspirationGenerator.openModal()      // 打开模态框
InspirationGenerator.generatePrompt() // 生成提示词
InspirationGenerator.typeWithAnimation() // 打字动画
```

**文档**:
- `docs/inspiration-guide.md` - 使用指南
- `docs/CHANGELOG-v1.1.0.md` - 更新日志

**⚠️ 注意事项**:
- 修改 create.html 时必须保留 `btn-inspire` 按钮
- 必须引入 `js/inspiration.js`
- 必须包含 `js/show-code.js` (代码查看)

---

### 2. 代码查看功能 (Code View)
**状态**: ✅ 已完成  
**文件**: `js/show-code.js`  
**UI**: `create.html`  
**样式**: `css/create-layout.css`  

**功能描述**:
- 游戏预览区顶部代码按钮
- 模态框显示完整代码
- 一键复制
- 下载为 HTML

**核心代码位置**:
```
ai-game-platform/
├── js/
│   └── show-code.js            # 模态框逻辑 (1.5KB)
├── css/
│   └── create-layout.css       # 模态框样式 (+200 行)
└── create.html                 # 按钮 + 模态框 HTML
```

**关键函数**:
```javascript
showCode()                      // 显示代码
copyCode()                      // 复制功能
downloadCode()                  // 下载功能
```

**⚠️ 注意事项**:
- 修改 create.html 时必须保留 `codeBtn` 按钮（仅 1 个）
- 必须引入 `js/show-code.js`
- 必须设置 `currentGameCode` 变量

---

### 3. 游戏参数分析 (Game Analyzer)
**状态**: ✅ 已完成  
**文件**: `js/game-analyzer.js`  

**功能描述**:
- 自动提取游戏代码中的参数
- 右侧参数面板显示
- 支持滑动调整

**核心代码位置**:
```
ai-game-platform/
├── js/
│   └── game-analyzer.js        # 参数分析 (10KB)
└── create.html                 # 右侧面板 UI
```

---

### 4. API 响应日志 (API Logger)
**状态**: ✅ 已完成  
**文件**: `api-logger.js`  
**服务器**: `server.js`  

**功能描述**:
- 自动保存 API 请求和响应
- 保存 HTML 游戏代码
- 错误日志记录

**核心代码位置**:
```
ai-game-platform/
├── api-logger.js               # 日志模块 (1.8KB)
├── server.js                   # 集成日志
└── api-responses/              # 日志目录
```

---

### 5. 编码保护系统 (Encoding Protection)
**状态**: ✅ 已完成  
**配置**: `.gitattributes`, `.vscode/settings.json`  
**工具**: 多个批处理脚本  

**功能描述**:
- 强制 UTF-8 编码
- 防止中文乱码
- 检查和修复工具

**核心文件**:
```
ai-game-platform/
├── .gitattributes              # Git 编码配置
├── .vscode/settings.json       # VS Code 配置
├── check-encoding.bat          # 检查工具
├── fix-encoding.bat            # 修复工具
└── safe-edit.bat               # 安全编辑
```

---

### 6. 后台运行系统 (Background Server)
**状态**: ✅ 已完成  

**核心文件**:
```
ai-game-platform/
├── start-server.bat            # 后台启动
├── stop-server.bat             # 停止服务器
└── setup-autostart.bat         # 开机自启动配置
```

---

## 🔄 代码复用指南

### 修改文件前的检查清单

#### 修改 create.html 前
```bash
# 1. 检查现有功能
findstr /C:"btn-inspire" create.html      # 灵感按钮
findstr /C:"codeBtn" create.html          # 代码按钮
findstr /C:"inspiration.js" create.html   # 脚本引入
findstr /C:"show-code.js" create.html     # 脚本引入

# 2. 备份原文件
copy create.html create.html.backup

# 3. 使用安全编辑工具
safe-edit.bat create.html
```

#### 修改 CSS 前
```bash
# 检查现有样式
findstr /C:"btn-inspire" css/create-layout.css
findstr /C:"code-modal" css/create-layout.css
```

#### 修改 JavaScript 前
```bash
# 检查现有功能
findstr /C:"InspirationGenerator" js/*.js
findstr /C:"showCode" js/*.js
findstr /C:"currentGameCode" js/*.js
```

---

## 📦 代码片段库

### 灵感按钮 HTML (必须保留)
```html
<!-- 灵感按钮 - 在输入框下方 -->
<button class="btn-inspire" id="inspireBtn">🎲 灵感</button>

<!-- 脚本引入 - 在 create.html 底部 -->
<script src="js/inspiration.js"></script>
<script src="js/show-code.js"></script>
```

### 代码按钮 HTML (必须保留)
```html
<!-- 代码按钮 - 在 preview-actions 内 -->
<div class="preview-actions" id="previewActions" style="display: none;">
    <button class="btn-action" id="playBtn">▶️ 试玩</button>
    <button class="btn-action" id="modifyBtn">✏️ 修改</button>
    <button class="btn-action" id="codeBtn">📄 代码</button>
</div>

<!-- 代码模态框 - 在</body>前 -->
<div id="codeModal" class="code-modal" style="display: none;">
    <div class="code-overlay"></div>
    <div class="code-content">
        <div class="code-header">
            <h3>📄 游戏代码</h3>
            <div class="code-actions">
                <button class="btn-code-action" id="copyCodeBtn">📋 复制</button>
                <button class="btn-code-action" id="downloadCodeBtn">💾 下载</button>
                <button class="btn-close" id="closeCodeBtn">&times;</button>
            </div>
        </div>
        <div class="code-body">
            <pre><code id="codeContent"></code></pre>
        </div>
    </div>
</div>
```

### CSS 样式 (必须保留)
```css
/* 灵感按钮样式 */
.btn-inspire {
    margin-top: 0.8rem;
    padding: 0.8rem 1.5rem;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    /* ... 更多样式 */
}

/* 代码模态框样式 */
.code-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    /* ... 更多样式 */
}
```

---

## 🛠️ 安全修改流程

### 标准流程

1. **检查现有功能**
   ```bash
   check-inspire.bat
   check-code-btn.bat
   ```

2. **备份文件**
   ```bash
   copy create.html create.html.backup
   copy css/create-layout.css css/create-layout.css.backup
   ```

3. **使用安全工具修改**
   ```bash
   safe-edit.bat create.html
   ```

4. **验证功能**
   ```bash
   check-inspire.bat      # 检查灵感按钮
   check-code-btn.bat     # 检查代码按钮
   check-script-order.bat # 检查脚本引入
   ```

5. **测试功能**
   - 打开浏览器测试
   - 点击所有按钮
   - 确认功能正常

6. **提交 Git**
   ```bash
   git add -A
   git commit -m "描述修改"
   ```

---

## 📊 功能依赖关系

```
create.html
├── 依赖 js/inspiration.js (灵感功能)
├── 依赖 js/show-code.js (代码查看)
├── 依赖 js/game-analyzer.js (参数分析)
├── 依赖 js/create-new.js (主逻辑)
├── 依赖 css/create-layout.css (样式)
└── 依赖 js/game-storage.js (存储)

server.js
├── 依赖 api-logger.js (日志记录)
└── 依赖 .env (配置)
```

---

## ⚠️ 常见错误和避免方法

### 错误 1: 修改后功能丢失
**原因**: 直接覆盖文件，未保留原有代码  
**避免**: 修改前检查功能清单，使用备份

### 错误 2: 重复添加功能
**原因**: 不知道功能已存在  
**避免**: 查阅本档案，检查现有代码

### 错误 3: 编码问题导致乱码
**原因**: 未使用 UTF-8 编码  
**避免**: 使用 safe-edit.bat 或 fix-encoding.bat

### 错误 4: 脚本顺序错误
**原因**: 依赖的脚本未正确引入  
**避免**: 检查 script 标签顺序

---

## 🎯 下次实现新功能时

### 步骤 1: 创建功能档案
在本文档中添加新功能条目

### 步骤 2: 编写可复用代码
- 模块化设计
- 清晰注释
- 独立文件

### 步骤 3: 编写使用文档
- 功能描述
- 使用方法
- 依赖关系

### 步骤 4: 添加到检查清单
更新修改前的检查清单

---

## 📝 维护记录

| 日期 | 操作 | 说明 |
|------|------|------|
| 2025-01-XX | 创建档案 | 建立代码沉淀系统 |
| 2025-01-XX | 添加灵感功能 | 记录完整实现 |
| 2025-01-XX | 添加代码查看 | 记录完整实现 |

---

**重要提醒**: 
- ⚠️ 修改任何文件前**必须**查阅此档案
- ⚠️ 确保不破坏已实现的功能
- ⚠️ 使用安全工具进行修改
- ⚠️ 修改后验证所有功能

---

**档案维护者**: GameAI Agent  
**最后更新**: 2025-01-XX  
**下次审查**: 每次实现新功能后
