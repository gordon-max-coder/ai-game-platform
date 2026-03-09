/**
 * GameAI - 对话历史组件
 * 显示和管理游戏创作的对话历史
 */

const ConversationUI = (function() {
    let currentGameId = null;
    let conversationList = null;
    let toggleButton = null;
    let isExpanded = false;

    function init(gameId) {
        currentGameId = gameId;
        
        // 创建对话列表容器
        createConversationPanel();
        
        // 加载对话历史
        loadConversationHistory();
    }

    function createConversationPanel() {
        // 检查是否已存在
        if (document.getElementById('conversationPanel')) {
            return;
        }

        // 创建侧边面板
        const panel = document.createElement('div');
        panel.id = 'conversationPanel';
        panel.className = 'conversation-panel';
        panel.innerHTML = `
            <div class="conversation-header">
                <h3>💬 对话历史</h3>
                <button class="btn-toggle" onclick="ConversationUI.toggle()">
                    <span class="toggle-icon">◀</span>
                </button>
            </div>
            <div class="conversation-list" id="conversationList">
                <div class="conversation-empty">暂无对话记录</div>
            </div>
        `;

        // 添加到页面
        const mainContent = document.querySelector('.main-content') || document.querySelector('main');
        if (mainContent) {
            mainContent.appendChild(panel);
        }

        conversationList = document.getElementById('conversationList');
        toggleButton = panel.querySelector('.btn-toggle');
    }

    function loadConversationHistory() {
        if (!currentGameId || !window.GameStorage) {
            return;
        }

        const history = GameStorage.getConversationHistory(currentGameId);
        
        if (!history || history.length === 0) {
            if (conversationList) {
                conversationList.innerHTML = '<div class="conversation-empty">暂无对话记录</div>';
            }
            return;
        }

        renderConversation(history);
    }

    function renderConversation(history) {
        if (!conversationList) return;

        conversationList.innerHTML = '';

        history.forEach((item, index) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `conversation-message ${item.role}`;
            
            const time = new Date(item.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const icon = item.role === 'user' ? '👤' : (item.role === 'assistant' ? '🤖' : '💬');
            const roleText = item.role === 'user' ? '你' : (item.role === 'assistant' ? 'AI' : '系统');

            // 截断过长的内容
            let content = item.content;
            if (content.length > 200) {
                content = content.substring(0, 200) + '...';
            }

            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-icon">${icon}</span>
                    <span class="message-role">${roleText}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-content">${escapeHtml(content)}</div>
            `;

            conversationList.appendChild(messageDiv);
        });

        // 滚动到底部
        conversationList.scrollTop = conversationList.scrollHeight;
    }

    function addMessage(role, content) {
        if (!currentGameId || !window.GameStorage) {
            return;
        }

        // 保存到存储
        GameStorage.addConversation(currentGameId, {
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });

        // 更新 UI
        loadConversationHistory();
    }

    function toggle() {
        const panel = document.getElementById('conversationPanel');
        if (!panel) return;

        isExpanded = !isExpanded;
        
        if (isExpanded) {
            panel.classList.add('expanded');
            if (toggleButton) {
                toggleButton.querySelector('.toggle-icon').textContent = '▶';
            }
        } else {
            panel.classList.remove('expanded');
            if (toggleButton) {
                toggleButton.querySelector('.toggle-icon').textContent = '◀';
            }
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function clear() {
        currentGameId = null;
        if (conversationList) {
            conversationList.innerHTML = '<div class="conversation-empty">暂无对话记录</div>';
        }
    }

    return {
        init: init,
        loadConversationHistory: loadConversationHistory,
        addMessage: addMessage,
        toggle: toggle,
        clear: clear
    };
})();

// 导出到全局
window.ConversationUI = ConversationUI;
console.log('✅ ConversationUI 模块已加载');
