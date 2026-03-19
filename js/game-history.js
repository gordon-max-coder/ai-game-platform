/**
 * 游戏历史管理模块
 * 支持搭积木式的多轮对话和累加修改
 */

const GAME_HISTORY_API = 'http://localhost:3000/api/game-history/';

// 游戏历史管理器
const GameHistoryManager = {
    // 当前游戏历史
    currentHistory: null,
    
    /**
     * 加载游戏历史
     * @param {string} gameId - 游戏 ID
     * @returns {Promise<Object>} 游戏历史对象
     */
    async load(gameId) {
        try {
            const response = await fetch(`${GAME_HISTORY_API}${gameId}`);
            if (response.ok) {
                this.currentHistory = await response.json();
                console.log('📜 加载游戏历史:', gameId, '修改次数:', this.currentHistory.modifications?.length || 0);
                return this.currentHistory;
            }
        } catch (error) {
            console.error('❌ 加载游戏历史失败:', error);
        }
        return null;
    },
    
    /**
     * 获取对话历史（用于发送给 API）
     * @param {number} limit - 限制条数（默认最近 20 条，即 10 轮对话）
     * @returns {Array} 对话历史数组
     */
    getConversationHistory(limit = 20) {
        if (!this.currentHistory || !this.currentHistory.messages) {
            return [];
        }
        
        // 返回最近的对话
        return this.currentHistory.messages.slice(-limit);
    },
    
    /**
     * 获取所有修改记录
     * @returns {Array} 修改记录数组
     */
    getModifications() {
        return this.currentHistory?.modifications || [];
    },
    
    /**
     * 获取当前游戏上下文摘要
     * @returns {string} 上下文摘要
     */
    getContextSummary() {
        if (!this.currentHistory) {
            return '新游戏';
        }
        
        const modCount = this.currentHistory.modifications?.length || 0;
        const lastMod = this.currentHistory.modifications?.[modCount - 1];
        
        if (modCount === 0) {
            return '新游戏';
        }
        
        return `第${modCount + 1}次修改 - 上次：${lastMod?.prompt?.substring(0, 30) || '未知'}`;
    },
    
    /**
     * 清空当前历史
     */
    clear() {
        this.currentHistory = null;
        console.log('🗑️ 已清空游戏历史');
    }
};

// 搭积木式上下文管理器
const ConversationContextManager = {
    // 对话积木堆
    blocks: [],
    maxBlocks: 20, // 最多 20 块积木
    
    /**
     * 添加对话积木
     * @param {string} role - 角色（user/assistant）
     * @param {string} content - 内容
     */
    addBlock(role, content) {
        this.blocks.push({
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        // 保持积木堆大小
        if (this.blocks.length > this.maxBlocks) {
            this.blocks = this.blocks.slice(-this.maxBlocks);
        }
        
        console.log(`🧱 添加对话积木 [${role}]: ${content.substring(0, 50)}...`);
    },
    
    /**
     * 获取所有积木（用于发送给 API）
     * @returns {Array} 对话积木数组
     */
    getBlocks() {
        return this.blocks.map(block => ({
            role: block.role,
            content: block.content
        }));
    },
    
    /**
     * 清空积木堆
     */
    clear() {
        this.blocks = [];
        console.log('🗑️ 已清空对话积木堆');
    },
    
    /**
     * 获取积木堆状态
     * @returns {Object} 状态信息
     */
    getStatus() {
        return {
            count: this.blocks.length,
            max: this.maxBlocks,
            utilization: (this.blocks.length / this.maxBlocks * 100).toFixed(1) + '%'
        };
    }
};

// 导出到全局
window.GameHistoryManager = GameHistoryManager;
window.ConversationContextManager = ConversationContextManager;

console.log('✅ 游戏历史管理模块已加载');
