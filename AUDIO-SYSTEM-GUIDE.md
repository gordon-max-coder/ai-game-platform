# 🎵 游戏音效系统使用指南

## 📅 添加时间
2026-03-17 13:49 GMT+8

---

## 🎯 功能特性

### 已实现
- ✅ **合成音效** - 无需外部文件，使用 Web Audio API 生成
- ✅ **BGM 播放** - 支持外部音乐文件
- ✅ **音量控制** - 主音量、BGM 音量、音效音量独立控制
- ✅ **静音功能** - 一键静音/取消静音
- ✅ **音效类型** - 射击、爆炸、击中、道具、开始、游戏结束

---

## 📦 文件结构

```
ai-game-platform/
├── js/
│   └── audio-system.js      # 音频系统核心模块
├── css/
│   └── audio-controls.css   # 音频控制面板样式
└── AUDIO-SYSTEM-GUIDE.md    # 本文档
```

---

## 🚀 快速开始

### 1. 在 HTML 中引入

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>我的游戏</title>
    
    <!-- 引入音频系统样式 -->
    <link rel="stylesheet" href="css/audio-controls.css">
</head>
<body>
    <!-- 游戏画布 -->
    <canvas id="gameCanvas"></canvas>
    
    <!-- 音频控制面板 -->
    <div class="audio-controls" id="audioControls">
        <div class="audio-header">
            <span class="audio-title">🔊 音频设置</span>
            <button class="audio-toggle" onclick="toggleAudioPanel()">✖</button>
        </div>
        
        <div class="volume-slider">
            <span class="volume-label">主音量</span>
            <input type="range" min="0" max="100" value="50" 
                   onchange="AudioSystem.setMasterVolume(this.value/100)">
        </div>
        
        <div class="volume-slider">
            <span class="volume-label">BGM</span>
            <input type="range" min="0" max="100" value="30" 
                   onchange="AudioSystem.setBgmVolume(this.value/100)">
        </div>
        
        <div class="volume-slider">
            <span class="volume-label">音效</span>
            <input type="range" min="0" max="100" value="50" 
                   onchange="AudioSystem.setSfxVolume(this.value/100)">
        </div>
        
        <button class="mute-btn" onclick="toggleMute()">🔊 静音</button>
    </div>
    
    <!-- 引入音频系统 -->
    <script src="js/audio-system.js"></script>
    <script>
        // 游戏代码...
    </script>
</body>
</html>
```

---

### 2. 初始化音频系统

```javascript
// 游戏初始化时
function initGame() {
    // 初始化音频系统
    AudioSystem.init();
    
    // 恢复音频上下文（用户首次交互时调用）
    document.addEventListener('click', () => {
        AudioSystem.resumeAudioContext();
    }, { once: true });
    
    // 开始 BGM（可选）
    // AudioSystem.playBgm('audio/bgm.mp3');
    
    console.log('🎮 游戏已启动，音频系统就绪');
}
```

---

### 3. 播放音效

```javascript
// 射击
function shoot() {
    AudioSystem.playSfx('shoot');
    // 发射子弹逻辑...
}

// 爆炸
function explode() {
    AudioSystem.playSfx('explosion');
    // 爆炸效果...
}

// 击中敌人
function hitEnemy() {
    AudioSystem.playSfx('hit');
    // 扣血逻辑...
}

// 吃到道具
function collectPowerup() {
    AudioSystem.playSfx('powerup');
    // 获得能力...
}

// 游戏开始
function startGame() {
    AudioSystem.playSfx('start');
    AudioSystem.playBgm('audio/bgm-loop.mp3');
    // 开始游戏逻辑...
}

// 游戏结束
function gameOver() {
    AudioSystem.playSfx('gameover');
    AudioSystem.stopBgm();
    // 游戏结束逻辑...
}
```

---

## 🎹 内置音效类型

| 音效类型 | 描述 | 使用场景 |
|---------|------|---------|
| `shoot` | 射击音效 | 玩家/敌人开火 |
| `explosion` | 爆炸音效 | 敌人被击毁、炸弹爆炸 |
| `hit` | 击中音效 | 玩家受伤、击中目标 |
| `powerup` | 道具音效 | 吃到道具、升级 |
| `gameover` | 结束音效 | 游戏结束、失败 |
| `start` | 开始音效 | 游戏开始、关卡开始 |

---

## 🎼 添加自定义音效

### 方法 1：使用外部音频文件

```javascript
// 预加载音效
AudioSystem.loadSfx('laser', 'audio/laser.wav');
AudioSystem.loadSfx('coin', 'audio/coin.mp3');
AudioSystem.loadSfx('jump', 'audio/jump.wav');

// 播放自定义音效
AudioSystem.playSfx('laser');
AudioSystem.playSfx('coin');
```

### 方法 2：使用 Base64 编码（推荐）

```javascript
// 将音频文件转换为 Base64
const laserSfx = 'data:audio/wav;base64,UklGR...';
const coinSfx = 'data:audio/mp3;base64,SUQzB...';

// 加载
AudioSystem.loadSfx('laser', laserSfx);
AudioSystem.loadSfx('coin', coinSfx);
```

---

## 🎚️ 音量控制

### 代码控制

```javascript
// 设置主音量 (0-1)
AudioSystem.setMasterVolume(0.8);

// 设置 BGM 音量 (0-1)
AudioSystem.setBgmVolume(0.3);

// 设置音效音量 (0-1)
AudioSystem.setSfxVolume(0.5);

// 静音/取消静音
const isMuted = AudioSystem.toggleMute();

// 获取当前状态
const status = AudioSystem.getStatus();
console.log(status);
// { isMuted: false, isBgmPlaying: true, masterVolume: 0.8, ... }
```

### UI 控制

```html
<!-- 音量滑块 -->
<input type="range" min="0" max="100" value="50" 
       onchange="AudioSystem.setMasterVolume(this.value/100)">

<!-- 静音按钮 -->
<button onclick="toggleMute()">🔊 静音</button>

<script>
function toggleMute() {
    const isMuted = AudioSystem.toggleMute();
    this.textContent = isMuted ? '🔇 取消静音' : '🔊 静音';
    this.classList.toggle('muted', isMuted);
}
</script>
```

---

## 🎮 完整示例：飞机大战

```javascript
// 飞机大战游戏音频集成示例

const Game = {
    player: { hp: 5 },
    isPlaying: false,
    
    init() {
        // 初始化音频
        AudioSystem.init();
        
        // 绑定用户交互（恢复音频上下文）
        document.addEventListener('click', () => {
            AudioSystem.resumeAudioContext();
        }, { once: true });
        
        console.log('🎮 游戏初始化完成');
    },
    
    start() {
        this.isPlaying = true;
        
        // 播放开始音效
        AudioSystem.playSfx('start');
        
        // 播放 BGM
        AudioSystem.playBgm('audio/space-bgm.mp3');
        
        console.log('🚀 游戏开始');
    },
    
    shoot() {
        if (!this.isPlaying) return;
        
        // 播放射击音效
        AudioSystem.playSfx('shoot');
        
        // 发射子弹逻辑...
        console.log('💥 射击');
    },
    
    hitEnemy() {
        if (!this.isPlaying) return;
        
        // 播放击中音效
        AudioSystem.playSfx('hit');
        
        // 敌人爆炸逻辑...
        console.log('💣 击中敌人');
    },
    
    enemyExplode() {
        if (!this.isPlaying) return;
        
        // 播放爆炸音效
        AudioSystem.playSfx('explosion');
        
        console.log('🔥 敌人爆炸');
    },
    
    collectPowerup() {
        if (!this.isPlaying) return;
        
        // 播放道具音效
        AudioSystem.playSfx('powerup');
        
        console.log('⭐ 获得道具');
    },
    
    playerHit() {
        if (!this.isPlaying) return;
        
        // 播放击中音效
        AudioSystem.playSfx('hit');
        
        this.player.hp--;
        console.log('❤️ 玩家受伤，剩余 HP:', this.player.hp);
        
        if (this.player.hp <= 0) {
            this.gameOver();
        }
    },
    
    gameOver() {
        this.isPlaying = false;
        
        // 播放结束音效
        AudioSystem.playSfx('gameover');
        
        // 停止 BGM
        AudioSystem.stopBgm();
        
        console.log('💀 游戏结束');
    }
};

// 启动游戏
Game.init();
```

---

## 🎼 推荐的 BGM 资源

### 免费音乐网站
1. **OpenGameArt** - https://opengameart.org/
2. **Incompetech** - https://incompetech.com/
3. **Bensound** - https://www.bensound.com/
4. **Free Music Archive** - https://freemusicarchive.org/

### 音效资源
1. **Freesound** - https://freesound.org/
2. **ZapSplat** - https://www.zapsplat.com/
3. **SoundBible** - http://soundbible.com/

---

## ⚠️ 注意事项

### 浏览器限制
- 🔒 **自动播放限制**：浏览器禁止自动播放音频，需要用户交互后才能播放
- ✅ **解决方案**：在用户首次点击/触摸后调用 `AudioSystem.resumeAudioContext()`

### 性能优化
- 📦 **预加载音效**：游戏开始前加载所有音效
- 🔁 **音效池**：频繁播放的音效使用对象池
- 🎵 **BGM 压缩**：使用 MP3 格式，比特率 128kbps 以下

### 移动端优化
- 📱 **触控支持**：确保音频控制按钮足够大（最小 44x44px）
- 🔇 **默认静音**：移动端建议默认静音，由用户手动开启
- 📶 **流量考虑**：BGM 文件不要太大（建议 < 2MB）

---

## 🎯 最佳实践

### 1. 音量平衡
```javascript
// 推荐的初始音量设置
AudioSystem.setMasterVolume(0.5);  // 主音量 50%
AudioSystem.setBgmVolume(0.3);     // BGM 30%（不要太大）
AudioSystem.setSfxVolume(0.5);     // 音效 50%
```

### 2. 音效使用时机
```javascript
// ✅ 好的做法
shoot() {
    AudioSystem.playSfx('shoot');  // 先播放音效
    fireBullet();                   // 再执行动作
}

// ❌ 不好的做法
shoot() {
    fireBullet();
    // 延迟太久才播放音效
    setTimeout(() => AudioSystem.playSfx('shoot'), 100);
}
```

### 3. 避免音效重叠
```javascript
// 限制同一音效的播放频率
let lastShootTime = 0;
function shoot() {
    const now = Date.now();
    if (now - lastShootTime < 100) return;  // 100ms 内不重复播放
    lastShootTime = now;
    AudioSystem.playSfx('shoot');
}
```

---

## 📊 效果展示

### 音频控制面板
```
┌─────────────────────────┐
│ 🔊 音频设置       ✖    │
├─────────────────────────┤
│ 主音量  [━━━━━●━━━━━] │
│ BGM     [━━━●━━━━━━━] │
│ 音效    [━━━━━●━━━━━] │
├─────────────────────────┤
│ [🔊 静音]               │
└─────────────────────────┘
```

### 游戏内小面板
```
┌──────────────┐
│ [🔊] [🎵]    │
└──────────────┘
```

---

## 🐛 故障排查

### BGM 不播放
```javascript
// 检查 1：是否调用了 init()
AudioSystem.init();

// 检查 2：是否有用户交互
document.addEventListener('click', () => {
    AudioSystem.resumeAudioContext();
}, { once: true });

// 检查 3：BGM 文件路径是否正确
AudioSystem.playBgm('audio/bgm.mp3');  // 确认文件存在
```

### 音效不播放
```javascript
// 检查 1：是否静音
const status = AudioSystem.getStatus();
console.log('是否静音:', status.isMuted);

// 检查 2：音量是否设置为 0
console.log('音效音量:', status.sfxVolume);

// 检查 3：音频系统是否初始化
AudioSystem.init();
```

---

## 📝 总结

**音频系统提供了**：
- ✅ 6 种内置合成音效（无需外部文件）
- ✅ BGM 播放控制
- ✅ 完整的音量管理
- ✅ 静音功能
- ✅ 简单易用的 API

**使用步骤**：
1. 引入 `audio-system.js`
2. 调用 `AudioSystem.init()`
3. 在游戏事件中调用 `AudioSystem.playSfx()`
4. 添加音频控制面板（可选）

**效果**：
- 🎮 游戏体验更沉浸
- 🎵 音效反馈更及时
- 🎚️ 音量控制更灵活

---

**创建时间**: 2026-03-17 13:49 GMT+8  
**状态**: ✅ 可以使用
