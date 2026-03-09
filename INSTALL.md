# 🚀 完整安装和运行指南

## 📋 前提条件

1. **Python 3.8+** - [下载地址](https://www.python.org/downloads/)
2. **现代浏览器** - Chrome、Edge、Firefox 等

---

## 🔧 安装步骤

### 步骤 1: 安装 Python 依赖

打开命令提示符（CMD）或 PowerShell，运行：

```bash
cd C:\Users\jiangym\.copaw\ai-game-platform\backend
pip install -r requirements.txt
```

或者双击运行 `backend/start.bat` 自动安装。

### 步骤 2: 启动后端服务

**方法 A: 使用批处理文件（推荐）**

双击 `backend/start.bat`

**方法 B: 手动启动**

```bash
cd C:\Users\jiangym\.copaw\ai-game-platform\backend
python server.py
```

你会看到类似输出：
```
==================================================
🎮 AI 游戏生成后端服务
==================================================
模型：claude-opus-4-6
API 地址：https://jiekou.ai/api
==================================================
🚀 服务启动中...
==================================================
 * Serving Flask app 'server'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

### 步骤 3: 打开前端页面

在浏览器中打开：`C:\Users\jiangym\.copaw\ai-game-platform\index.html`

或者直接双击 `index.html` 文件。

---

## 🎮 使用流程

### 1. 确保后端服务正在运行

检查浏览器访问 http://localhost:5000 是否能看到服务页面。

### 2. 创建游戏

1. 访问 `create.html` 页面
2. 点击"给我灵感！"获取随机创意，或输入你的游戏描述
3. （可选）展开"高级选项"选择游戏类型、美术风格、难度
4. 点击"生成游戏"按钮
5. 等待 AI 生成（约 10-30 秒）
6. 预览和试玩生成的游戏

### 3. 示例游戏提示

```
创建一个太空射击游戏，玩家控制飞船在星空中穿梭，躲避陨石并消灭外星敌人

创建一个合并养成游戏，通过合并相同的生物来进化和成长

创建一个平台跳跃游戏，玩家需要灵活躲避机关和敌人，收集星星到达终点

创建一个农场模拟游戏，种植各种作物、养殖动物，把小农场发展成农业帝国

创建一个益智解谜游戏，通过滑动和旋转方块来解开精心设计的谜题
```

---

## 🔍 故障排除

### 问题 1: 后端服务无法启动

**症状**: 运行 `python server.py` 时出错

**解决方案**:
```bash
# 重新安装依赖
pip uninstall flask flask-cors requests
pip install -r requirements.txt
```

### 问题 2: 生成游戏时提示"网络错误"

**症状**: 点击"生成游戏"后显示错误

**解决方案**:
1. 确保后端服务正在运行（访问 http://localhost:5000 确认）
2. 检查 API 密钥是否正确（在 `backend/config.py` 中）
3. 检查网络连接，确保能访问 https://jiekou.ai

### 问题 3: CORS 错误

**症状**: 浏览器控制台显示 CORS 相关错误

**解决方案**:
- 确保 Flask-CORS 已正确安装
- 后端服务已启动并运行在 5000 端口

### 问题 4: 生成的游戏无法运行

**症状**: 游戏预览空白或报错

**解决方案**:
- 这可能是 AI 生成的代码有问题
- 尝试重新生成或修改提示词
- 查看浏览器控制台的错误信息

---

## 📁 项目结构

```
ai-game-platform/
├── index.html              # 首页
├── create.html             # 创建游戏页面 ⭐
├── games.html              # 游戏库
├── learn.html              # 学习中心
├── about.html              # 关于页面
├── css/
│   ├── style.css           # 主样式
│   └── pages.css           # 页面样式
├── js/
│   ├── main.js             # 主脚本
│   ├── create.js           # 游戏生成逻辑（已集成 API）
│   ├── games.js            # 游戏库功能
│   └── learn.js            # 学习中心功能
├── images/                 # 图片资源
├── README.md               # 项目说明
├── START.md                # 快速启动指南
└── backend/                # 后端服务 ⭐
    ├── server.py           # Flask 后端主程序
    ├── config.py           # API 配置
    ├── requirements.txt    # Python 依赖
    └── start.bat           # Windows 启动脚本
```

---

## 🔑 API 配置

当前配置（在 `backend/config.py` 中）:

- **API 服务商**: https://jiekou.ai/
- **模型**: claude-opus-4-6
- **API 密钥**: sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8

如需修改，编辑 `backend/config.py` 文件。

---

## 🌐 API 端点

### POST /api/generate

生成游戏

**请求体**:
```json
{
  "prompt": "创建一个太空射击游戏",
  "gameType": "action",
  "artStyle": "pixel",
  "difficulty": "medium"
}
```

**响应**:
```json
{
  "success": true,
  "gameCode": "<!DOCTYPE html>...",
  "prompt": "创建一个太空射击游戏",
  "metadata": {
    "gameType": "action",
    "artStyle": "pixel",
    "difficulty": "medium"
  }
}
```

### GET /api/health

健康检查

**响应**:
```json
{
  "status": "ok",
  "service": "AI Game Generator",
  "model": "claude-opus-4-6"
}
```

---

## 💡 提示词技巧

### 好的提示词特征：

1. **清晰描述核心玩法**
   - ✅ "创建一个玩家控制飞船射击敌人的太空游戏"
   - ❌ "做一个好玩的游戏"

2. **指定游戏类型**
   - ✅ "创建一个平台跳跃游戏，有双重跳跃和冲刺能力"
   - ❌ "创建一个有跳跃的游戏"

3. **描述视觉风格**
   - ✅ "像素风格，复古街机感觉"
   - ❌ "好看一点"

4. **包含游戏目标**
   - ✅ "收集所有星星，躲避敌人，到达终点"
   - ❌ "随便玩玩"

### 提示词模板：

```
创建一个 [游戏类型] 游戏，玩家 [核心玩法]，目标是 [游戏目标]。
美术风格：[风格描述]
难度：[简单/中等/困难]
特殊功能：[额外功能]
```

---

## 🎯 下一步开发

1. **保存游戏历史** - 添加数据库存储生成的游戏
2. **游戏编辑功能** - 允许用户修改生成的游戏
3. **用户账户系统** - 登录、收藏、分享
4. **游戏发布平台** - 让其他玩家可以游玩和评分
5. **更多 AI 模型** - 支持多种模型选择
6. **资源优化** - 使用 CDN 加载外部资源

---

## 📞 技术支持

如有问题，请检查：
1. 后端服务是否运行
2. 浏览器控制台是否有错误
3. API 密钥是否正确
4. 网络连接是否正常

祝游戏创作愉快！🎮✨
