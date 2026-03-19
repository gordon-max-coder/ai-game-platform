# Godot Web Editor 集成指南

## 📁 已添加的文件

1. **`js/godot-editor-integration.js`** - 编辑器集成模块
2. **`editor.html`** - Godot Web 编辑器页面

## 🚀 使用方法

### 1. 启动 Godot 编辑器后端

```bash
cd C:\Users\jiangym\.openclaw\workspace\godot-web-editor
npm start
```

后端将在 http://localhost:3000 启动

### 2. 在 AI Game Platform 中打开编辑器

#### 在 create.html 页面：
1. 生成一个游戏
2. 点击预览区上方的 **🎮 编辑器** 按钮
3. 将打开 Godot Web 编辑器窗口

#### 在 games.html / my-games.html 页面：
1. 找到任意游戏卡片
2. 点击 **✏️ 修改** 按钮
3. 将打开 Godot Web 编辑器窗口

## 🔧 集成说明

### 自动绑定的按钮

- `create.html` 页面的 `#editorBtn` 按钮
- `games.html` 页面的 `.btn-edit-card` 按钮
- `my-games.html` 页面的 `.btn-edit-card` 按钮

### 消息通信

编辑器通过 `postMessage` 与主页面通信：

**发送到编辑器：**
```javascript
{
    type: 'LOAD_GAME',
    data: {
        id: 'game_id',
        code: '<html>...</html>',
        title: '游戏名称',
        version: 1
    }
}
```

**从编辑器接收：**
```javascript
{
    type: 'GAME_UPDATED',
    data: {
        id: 'game_id',
        code: '<html>...</html>',
        title: '游戏名称',
        version: 2
    }
}
```

## 📊 编辑器功能

- 📋 场景对象树
- 🔧 属性检查器
- 🎨 2D 预览画布
- ▶️ 运行/停止游戏
- 💾 保存并返回
- 📂 导入/导出游戏

## ⚠️ 注意事项

1. **必须先启动后端服务** - 编辑器依赖 `godot-web-editor` 的 Node.js 后端
2. **跨域问题** - 确保两个页面在同一域或使用 CORS
3. **弹窗拦截** - 浏览器可能拦截编辑器窗口，需要允许弹窗

## 🔍 调试

打开浏览器控制台查看日志：
- `✅` 成功操作
- `❌` 错误信息
- `⚠️` 警告信息

## 📝 后续改进

1. 添加实时同步功能
2. 支持更多游戏对象类型
3. 添加动画编辑器
4. 支持 Godot 项目导出
