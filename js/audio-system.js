/**
 * GameAI - 游戏音效系统
 * 提供音效播放、BGM 控制、音量调节等功能
 */

const AudioSystem = (function() {
    let audioContext = null;
    let bgmAudio = null;
    let sfxPool = {};
    let masterVolume = 0.5;
    let bgmVolume = 0.3;
    let sfxVolume = 0.5;
    let isMuted = false;
    let isBgmPlaying = false;
    let currentBgm = null;

    // 初始化音频系统
    function init() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 音频系统已初始化');
        } catch (e) {
            console.warn('⚠️ 音频系统初始化失败:', e);
        }
    }

    // 创建 BGM 音频元素
    function createBgmElement() {
        if (!bgmAudio) {
            bgmAudio = new Audio();
            bgmAudio.loop = true;
            bgmAudio.volume = bgmVolume;
        }
    }

    // 播放 BGM
    function playBgm(url) {
        if (!bgmAudio || currentBgm !== url) {
            createBgmElement();
            bgmAudio.src = url;
            currentBgm = url;
        }
        
        if (isMuted) return;
        
        bgmAudio.play().then(() => {
            isBgmPlaying = true;
            console.log('🎵 BGM 播放中:', url);
        }).catch(e => {
            console.warn('⚠️ BGM 播放失败:', e);
        });
    }

    // 停止 BGM
    function stopBgm() {
        if (bgmAudio) {
            bgmAudio.pause();
            bgmAudio.currentTime = 0;
            isBgmPlaying = false;
            console.log('⏹️ BGM 已停止');
        }
    }

    // 暂停 BGM
    function pauseBgm() {
        if (bgmAudio && isBgmPlaying) {
            bgmAudio.pause();
            isBgmPlaying = false;
        }
    }

    // 恢复 BGM
    function resumeBgm() {
        if (bgmAudio && !isBgmPlaying && !isMuted) {
            bgmAudio.play();
            isBgmPlaying = true;
        }
    }

    // 生成合成音效（无需外部文件）
    function synthesizeSfx(type) {
        if (!audioContext || isMuted) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const now = audioContext.currentTime;

        switch (type) {
            case 'shoot':
                // 射击音效
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gainNode.gain.setValueAtTime(sfxVolume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'explosion':
                // 爆炸音效
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(100, now);
                oscillator.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);
                gainNode.gain.setValueAtTime(sfxVolume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;

            case 'hit':
                // 击中音效
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(200, now);
                oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.15);
                gainNode.gain.setValueAtTime(sfxVolume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                oscillator.start(now);
                oscillator.stop(now + 0.15);
                break;

            case 'powerup':
                // 道具音效
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400, now);
                oscillator.frequency.linearRampToValueAtTime(800, now + 0.1);
                oscillator.frequency.linearRampToValueAtTime(1200, now + 0.2);
                gainNode.gain.setValueAtTime(sfxVolume, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;

            case 'gameover':
                // 游戏结束音效
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(400, now);
                oscillator.frequency.linearRampToValueAtTime(100, now + 0.5);
                gainNode.gain.setValueAtTime(sfxVolume, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.5);
                oscillator.start(now);
                oscillator.stop(now + 0.5);
                break;

            case 'start':
                // 开始游戏音效
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.setValueAtTime(554, now + 0.1);
                oscillator.frequency.setValueAtTime(659, now + 0.2);
                gainNode.gain.setValueAtTime(sfxVolume, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;
        }
    }

    // 播放音效
    function playSfx(type) {
        if (isMuted) return;
        
        if (sfxPool[type]) {
            // 播放预加载的音效
            const audio = sfxPool[type].cloneNode();
            audio.volume = sfxVolume;
            audio.play().catch(e => console.warn('音效播放失败:', e));
        } else {
            // 播放合成音效
            synthesizeSfx(type);
        }
    }

    // 预加载音效
    function loadSfx(name, url) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        sfxPool[name] = audio;
        console.log('🔊 音效已加载:', name);
    }

    // 设置主音量
    function setMasterVolume(value) {
        masterVolume = Math.max(0, Math.min(1, value));
        updateVolumes();
    }

    // 设置 BGM 音量
    function setBgmVolume(value) {
        bgmVolume = Math.max(0, Math.min(1, value));
        if (bgmAudio) {
            bgmAudio.volume = bgmVolume;
        }
    }

    // 设置音效音量
    function setSfxVolume(value) {
        sfxVolume = Math.max(0, Math.min(1, value));
    }

    // 更新音量
    function updateVolumes() {
        if (isMuted) {
            if (bgmAudio) bgmAudio.volume = 0;
        } else {
            if (bgmAudio) bgmAudio.volume = bgmVolume * masterVolume;
        }
    }

    // 静音/取消静音
    function toggleMute() {
        isMuted = !isMuted;
        updateVolumes();
        console.log(isMuted ? '🔇 已静音' : '🔊 已取消静音');
        return isMuted;
    }

    // 获取状态
    function getStatus() {
        return {
            isMuted: isMuted,
            isBgmPlaying: isBgmPlaying,
            masterVolume: masterVolume,
            bgmVolume: bgmVolume,
            sfxVolume: sfxVolume
        };
    }

    // 恢复音频上下文（用户交互后调用）
    function resumeAudioContext() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    return {
        init: init,
        playBgm: playBgm,
        stopBgm: stopBgm,
        pauseBgm: pauseBgm,
        resumeBgm: resumeBgm,
        playSfx: playSfx,
        loadSfx: loadSfx,
        setMasterVolume: setMasterVolume,
        setBgmVolume: setBgmVolume,
        setSfxVolume: setSfxVolume,
        toggleMute: toggleMute,
        getStatus: getStatus,
        resumeAudioContext: resumeAudioContext
    };
})();

// 导出到全局
window.AudioSystem = AudioSystem;
console.log('✅ 音频系统模块已加载');
