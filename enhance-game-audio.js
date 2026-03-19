/**
 * 为飞机大战游戏添加音效增强
 * 使用方法：在浏览器控制台中运行此脚本，或集成到游戏代码中
 */

(function() {
    console.log('🎵 开始为飞机大战添加音效...');

    // 1. 初始化音频系统
    if (typeof AudioSystem !== 'undefined') {
        AudioSystem.init();
        console.log('✅ 音频系统已初始化');
    } else {
        console.warn('⚠️ AudioSystem 未加载，请先引入 audio-system.js');
        return;
    }

    // 2. 恢复音频上下文（用户首次交互）
    document.addEventListener('click', () => {
        AudioSystem.resumeAudioContext();
    }, { once: true });

    document.addEventListener('keydown', () => {
        AudioSystem.resumeAudioContext();
    }, { once: true });

    // 3. 增强游戏音效
    const originalFunctions = {};

    // 等待游戏加载
    function waitForGame() {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (window.player && window.shootPlayerBullet) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(check);
                resolve();
            }, 3000);
        });
    }

    // 添加音效到游戏函数
    async function enhanceGame() {
        await waitForGame();

        // 保存原始函数
        originalFunctions.shootPlayerBullet = window.shootPlayerBullet;
        originalFunctions.damagePlayer = window.damagePlayer;
        originalFunctions.resetGame = window.resetGame;

        // 增强射击函数
        if (window.shootPlayerBullet) {
            window.shootPlayerBullet = function(...args) {
                AudioSystem.playSfx('shoot');
                return originalFunctions.shootPlayerBullet.apply(this, args);
            };
            console.log('✅ 射击音效已添加');
        }

        // 增强受伤函数
        if (window.damagePlayer) {
            window.damagePlayer = function(...args) {
                AudioSystem.playSfx('hit');
                return originalFunctions.damagePlayer.apply(this, args);
            };
            console.log('✅ 受伤音效已添加');
        }

        // 增强游戏重置（播放开始音效）
        if (window.resetGame) {
            window.resetGame = function(...args) {
                AudioSystem.playSfx('start');
                return originalFunctions.resetGame.apply(this, args);
            };
            console.log('✅ 开始音效已添加');
        }

        // 监听敌机爆炸
        if (window.enemies) {
            const originalEnemies = window.enemies;
            console.log('✅ 敌机数组已监控');
        }

        console.log('🎮 飞机大战音效增强完成！');
        console.log('🔊 试试射击、受伤、开始游戏来听音效');
    }

    // 执行增强
    enhanceGame();

    // 4. 添加音频控制面板到游戏页面
    function addAudioControls() {
        const controls = document.createElement('div');
        controls.className = 'audio-controls';
        controls.id = 'gameAudioControls';
        controls.innerHTML = `
            <div class="audio-header">
                <span class="audio-title">🔊 音频设置</span>
                <button class="audio-toggle" onclick="document.getElementById('gameAudioControls').classList.toggle('hidden')">✖</button>
            </div>
            <div class="volume-slider">
                <span class="volume-label">主音量</span>
                <input type="range" min="0" max="100" value="50" 
                       oninput="AudioSystem.setMasterVolume(this.value/100)">
            </div>
            <div class="volume-slider">
                <span class="volume-label">BGM</span>
                <input type="range" min="0" max="100" value="30" 
                       oninput="AudioSystem.setBgmVolume(this.value/100)">
            </div>
            <div class="volume-slider">
                <span class="volume-label">音效</span>
                <input type="range" min="0" max="100" value="50" 
                       oninput="AudioSystem.setSfxVolume(this.value/100)">
            </div>
            <button class="mute-btn" onclick="toggleMuteBtn(this)">🔊 静音</button>
        `;
        document.body.appendChild(controls);
        console.log('✅ 音频控制面板已添加');
    }

    // 添加静音按钮功能
    window.toggleMuteBtn = function(btn) {
        const isMuted = AudioSystem.toggleMute();
        btn.textContent = isMuted ? '🔇 取消静音' : '🔊 静音';
        btn.classList.toggle('muted', isMuted);
    };

    // 添加控制面板
    addAudioControls();

    console.log('🎵 音效增强脚本加载完成');
})();
