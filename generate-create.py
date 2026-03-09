# -*- coding: utf-8 -*-
"""
生成完整的 create.html 文件
包含所有功能：游戏创建、修改、保存到"我的游戏"
"""

html_content = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 游戏生成器</title>
    <link rel="stylesheet" href="css/create.css">
</head>
<body>
    <div class="create-container">
        <aside class="sidebar">
            <a href="index.html" class="sidebar-logo">
                <img src="images/logo.svg" alt="Logo" onerror="this.style.display='none'">
                <span>GameAI</span>
            </a>
            <nav class="sidebar-nav">
                <a href="create.html" class="active"><span>✨</span><span>创建</span></a>
                <a href="index.html"><span>🏠</span><span>首页</span></a>
                <a href="games.html"><span>🎮</span><span>游戏库</span></a>
                <a href="my-games.html"><span>🎯</span><span>我的游戏</span></a>
                <a href="learn.html"><span>📚</span><span>学习</span></a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="page-header">
                <h1>你想创建什么游戏？</h1>
                <p>描述你的想法，AI 会帮你生成完整的游戏</p>
            </header>

            <div class="create-form" id="createForm">
                <div class="inspire-section">
                    <button class="btn-inspire" id="inspireBtn">🎲 给我灵感！</button>
                    <span class="divider">或</span>
                </div>
                <textarea id="prompt" class="prompt-input" placeholder="描述你的游戏想法..."></textarea>
                <button class="btn-generate" id="generateBtn" disabled>✨ 生成游戏</button>
            </div>

            <div class="generation-progress" id="progressSection" style="display:none;">
                <h2>正在生成你的游戏...</h2>
                <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
                <p class="progress-status" id="progressStatus">正在处理...</p>
            </div>

            <div class="generation-result" id="resultSection" style="display:none;">
                <h2>🎉 游戏生成完成！</h2>
                <div class="game-preview">
                    <div class="preview-canvas">
                        <iframe class="game-frame" id="gameFrame"></iframe>
                    </div>
                    <div class="game-details">
                        <h3 id="gameTitle">游戏标题</h3>
                        <p id="gameDescription">游戏描述</p>
                        <div class="version-info">
                            <span id="versionText">版本 1.0</span>
                            <span id="gameStats"></span>
                        </div>
                        <div class="game-actions">
                            <button class="btn-play" id="playBtn">▶️ 开始游戏</button>
                            <button class="btn-modify" id="modifyBtn">✏️ 修改游戏</button>
                            <button class="btn-new" id="newGameBtn">➕ 创建新游戏</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modify-section" id="modifySection" style="display:none;">
                <h3>🔧 修改游戏</h3>
                <textarea id="modifyPrompt" class="modify-input" placeholder="描述你想要修改的内容..."></textarea>
                <button class="btn-modify-submit" id="modifySubmitBtn">🚀 生成修改版本</button>
                <button class="btn-cancel" id="modifyCancelBtn">❌ 取消修改</button>
            </div>

            <div class="example-prompts" id="examplePrompts">
                <h3>试试这些想法：</h3>
                <div class="prompts-grid">
                    <button class="prompt-chip" data-prompt="创建一个太空射击游戏">🚀 太空射击</button>
                    <button class="prompt-chip" data-prompt="创建一个合并养成游戏">🧬 进化合并</button>
                    <button class="prompt-chip" data-prompt="创建一个平台跳跃游戏">🏃 平台冒险</button>
                    <button class="prompt-chip" data-prompt="创建一个农场模拟游戏">🌾 农场经营</button>
                </div>
            </div>
        </main>
    </div>

    <!-- 核心模块 -->
    <script src="js/game-storage.js"></script>
    <script src="js/create-core.js"></script>
</body>
</html>
'''

# 写入文件
with open('create.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('✅ create.html 已生成！')
print(f'文件大小：{len(html_content)} 字节')
