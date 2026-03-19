# Godot Skill 集成指南

## 📦 技能说明

**Godot Plugin Skill** - 控制 Godot 4.x 编辑器通过 30+ 工具
- 支持 80+ 节点类型
- 场景管理、节点操作、输入模拟、调试功能

## 🎯 使用场景

### 1. HTML5 → Godot 导出
当用户生成 HTML5 游戏后，可以选择导出为 Godot 项目：
- 生成 `.tscn` 场景文件
- 生成 `.gd` GDScript 代码
- 创建 `project.godot` 配置文件

### 2. Godot 编辑器自动化
使用 `godot_execute` 工具直接操作 Godot 编辑器：
```
godot_execute(tool="scene.create", parameters={rootType: "Node2D", name: "Main"})
godot_execute(tool="node.create", parameters={type: "CharacterBody2D", name: "Player"})
godot_execute(tool="editor.play")
godot_execute(tool="debug.screenshot")
```

## 🚀 快速开始

### 首次安装
```bash
# 从 active_skills/godot-skill 目录
cd active_skills/godot-skill
./scripts/install-extension.sh

# 重启 gateway
openclaw gateway restart
```

### 验证安装
```bash
# 检查工具是否可用
openclaw tools list | findstr godot
```

## 📋 工具列表

### Scene (5 tools)
- `scene.create` - 创建新场景
- `scene.getCurrent` - 获取当前场景
- `scene.list` - 列出所有场景文件
- `scene.open` - 打开场景
- `scene.save` - 保存场景

### Node (6 tools)
- `node.find` - 查找节点
- `node.create` - 创建节点
- `node.delete` - 删除节点
- `node.getData` - 获取节点数据
- `node.getProperty` - 获取属性
- `node.setProperty` - 设置属性

### Transform (3 tools)
- `transform.setPosition` - 设置位置
- `transform.setRotation` - 设置旋转
- `transform.setScale` - 设置缩放

### Editor (4 tools)
- `editor.play` - 播放游戏
- `editor.stop` - 停止播放
- `editor.pause` - 暂停
- `editor.getState` - 获取状态

### Input (7 tools) - 游戏测试
- `input.keyPress` - 按键
- `input.keyDown` - 按住键
- `input.keyUp` - 释放键
- `input.mouseClick` - 鼠标点击
- `input.mouseMove` - 鼠标移动
- `input.actionPress` - 触发动作
- `input.actionRelease` - 释放动作

### Debug (3 tools)
- `debug.screenshot` - 截图
- `debug.tree` - 获取场景树
- `debug.log` - 打印日志

## 🎮 集成到 AI Game Platform

### 前端添加 Godot 导出按钮
在 `create.html` 中添加：
```html
<button id="exportGodotBtn" class="btn-secondary">
  📦 导出为 Godot 项目
</button>
```

### 后端添加 Godot 导出接口
在 `server.js` 中添加：
```javascript
app.post('/api/export-godot', async (req, res) => {
    const { htmlCode, gameTitle } = req.body;
    // 转换为 Godot 项目结构
    const godotProject = convertToGodot(htmlCode, gameTitle);
    res.json(godotProject);
});
```

### 创建 Godot 项目模板
```
my_game/
├── project.godot
├── scenes/
│   └── main.tscn
├── scripts/
│   └── player.gd
└── assets/
    └── sprites/
```

## ⚠️ 注意事项

1. **需要安装 Godot 4.x** - 技能需要 Godot 编辑器运行
2. **本地 HTTP 端点** - 技能会启动本地服务器，确保防火墙允许
3. **备份项目** - 操作前备份 Godot 项目
4. **CORS 配置** - 技能设置 CORS 为 `*`，确保 OpenClaw 绑定到 localhost

## 🔗 相关资源

- [Godot 官方文档](https://docs.godotengine.org/)
- [OpenClaw Godot Skill 源码](https://github.com/TomLeeLive/openclaw-godot-skill)
- [ClawHub 技能页面](https://clawhub.ai/TomLeeLive/openclaw-godot-skill)

## 📝 更新日志

- **v1.2.7** - 当前版本
  - 30+ 工具支持
  - 80+ 节点类型
  - 输入模拟用于游戏测试
