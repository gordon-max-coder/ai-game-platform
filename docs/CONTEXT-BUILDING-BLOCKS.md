# 🧱 搭积木式上下文记忆系统 - 完整设计

**创建时间:** 2026-03-16  
**核心理念:** 像搭积木一样积累需求，每次修改都保留所有之前的功能

---

## 🎯 用户需求

> "我需要的是像搭积木一样积累，不能做了后面需求忘记了前面的需求。"

### 场景示例

```
第 1 轮：创建一个贪食蛇游戏
        └─> 🧱 积木 1：基础贪食蛇

第 2 轮：加一个 AI 对手
        └─> 🧱 积木 2：AI 对手（保留积木 1）

第 3 轮：修复移动 Bug
        └─> 🧱 积木 3：Bug 修复（保留积木 1+2）

第 4 轮：增加双人模式
        └─> 🧱 积木 4：双人模式（保留积木 1+2+3）

最终：🧱🧱🧱🧱 = 完整游戏（所有功能都保留）
```

---

## ❌ 当前问题

### 问题 1: 没有维护对话历史

**当前代码:**
```javascript
// ❌ 没有 conversationHistory 变量
// ❌ 没有记录之前的对话
```

### 问题 2: 修改时只发送当前请求

**当前 `modifyGame()`:**
```javascript
messages: [
    {role: 'system', content: '你是专业的游戏开发 AI 助手...'},
    {role: 'user', content: `请修改以下游戏代码。修改要求：${modifyText}。
当前游戏代码：${currentGameCode}`}
    // ❌ 没有之前的对话历史
    // ❌ AI 看不到之前添加了什么功能
]
```

### 问题 3: AI"失忆"

**结果:**
```
第 1 轮：创建贪食蛇 → ✅ 有贪食蛇
第 2 轮：加 AI 对手 → ✅ 有 AI 对手
第 3 轮：修复 Bug → ❌ AI 忘记了 AI 对手！
```

---

## ✅ 完整解决方案

### 1. 添加对话历史管理

```javascript
// 全局变量
let conversationHistory = [];  // 对话历史（积木堆）
const MAX_HISTORY = 40;        // 最多保留 40 条（避免 token 超限）
```

### 2. 修改 `addConversation()` - 记录每块"积木"

```javascript
function addConversation(role, content) {
    // 添加到内存中的对话历史
    conversationHistory.push({
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    });
    
    // 限制对话历史长度（保留最近 40 条）
    if (conversationHistory.length > MAX_HISTORY) {
        conversationHistory = conversationHistory.slice(-MAX_HISTORY);
        console.log('📚 对话历史过长，已截断为最近', MAX_HISTORY, '条');
    }
    
    // 保存到本地存储（页面刷新后恢复）
    if (currentGameId && window.GameStorage) {
        GameStorage.addConversation(currentGameId, {
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
    }
    
    console.log('🧱 已添加对话积木，当前总数:', conversationHistory.length);
}
```

### 3. 修改 `modifyGame()` - 发送完整积木堆

```javascript
async function modifyGame() {
    const modifyText = elements.modifyInput?.value.trim();
    if (!modifyText || !currentGameCode || !currentGameId) return;
    
    const selectedModel = elements.modelSelect?.value || 'gemini-2.5-flash';
    
    addConversation('user', '修改：' + modifyText);
    elements.modifyInput.value = '';
    showLoading();
    
    try {
        console.log('🔧 开始修改游戏，使用模型:', selectedModel);
        console.log('📚 当前对话历史:', conversationHistory.length, '条');
        
        // 构建完整的对话历史（搭积木）
        const messages = [
            {role: 'system', content: `你是专业的游戏开发 AI 助手，擅长修改和优化游戏代码。
重要：你必须保留之前所有的功能和需求，像搭积木一样积累。
每次修改都要保留之前的所有功能，只根据最新要求添加或修改。`}
        ];
        
        // 🧱 积木 1：添加原始创建请求
        const firstRequest = conversationHistory.find(msg => 
            msg.role === 'user' && !msg.content.startsWith('修改：')
        );
        if (firstRequest) {
            messages.push({
                role: 'user',
                content: `请创建一个完整的 HTML5 游戏。游戏描述：${firstRequest.content}。
                    
重要技术要求：
1. 单个 HTML 文件
2. 使用 Canvas API
3. Canvas 尺寸必须为 360x640 像素（9:16 竖屏比例）
4. 在 JavaScript 中设置：canvas.width = 360; canvas.height = 640;
5. 在 CSS 中设置：canvas { max-width: 100%; height: auto; display: block; margin: 0 auto; }
6. 包含完整游戏循环
7. 有得分系统
8. 确保有趣可玩

只返回 HTML 代码，不要其他说明。`
            });
            
            // 添加对应的 AI 响应
            const firstResponse = conversationHistory.find(msg => 
                msg.role === 'assistant' && msg.content.includes('游戏生成成功')
            );
            if (firstResponse) {
                messages.push({role: 'assistant', content: firstResponse.content});
            }
        }
        
        // 🧱 积木 2-N：添加所有中间修改历史
        const modifyRequests = conversationHistory.filter(msg => 
            msg.role === 'user' && msg.content.startsWith('修改：') && 
            msg.content !== '修改：' + modifyText  // 排除当前请求
        );
        
        for (let i = 0; i < modifyRequests.length; i++) {
            const req = modifyRequests[i];
            messages.push({role: 'user', content: req.content});
            
            // 添加对应的 AI 响应
            const reqIndex = conversationHistory.indexOf(req);
            if (reqIndex < conversationHistory.length - 1) {
                const nextMsg = conversationHistory[reqIndex + 1];
                if (nextMsg && nextMsg.role === 'assistant') {
                    messages.push({role: 'assistant', content: nextMsg.content});
                }
            }
        }
        
        // 🧱 最后一块积木：当前修改请求 + 完整代码
        messages.push({
            role: 'user',
            content: `当前游戏代码：
\`\`\`html
${currentGameCode.substring(0, 50000)}  // 限制 50K 字符
\`\`\`

修改要求：${modifyText}

重要：
1. 🧱 保留之前所有的功能和需求（像搭积木一样积累）
2. 🧱 只根据最新要求修改代码，不要删除之前的功能
3. 🧱 如果之前添加了 AI 对手、双人模式等功能，必须保留
4. 保持 Canvas 尺寸为 360x640 像素（9:16 竖屏比例）
5. 返回完整的 HTML 代码（不是片段）`}
        });
        
        console.log('📦 发送完整对话历史，消息数:', messages.length);
        console.log('📦 对话历史结构:');
        console.log('  - 系统提示词：1 条');
        console.log('  - 原始创建：1 条');
        console.log('  - 中间修改：', modifyRequests.length, '条');
        console.log('  - 当前修改：1 条');
        console.log('  - 总计：', messages.length, '条');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: selectedModel,
                messages: messages,
                max_tokens: 16000,
                temperature: 0.7
            })
        });
        
        // ... 后续处理相同
        
    } catch (error) {
        console.error('❌ 修改失败:', error);
        hideLoading();
        addConversation('system', '❌ 修改失败：' + error.message);
        elements.modifyInput.value = modifyText;
    }
}
```

### 4. 修改 `generateGame()` - 新游戏清空积木堆

```javascript
async function generateGame() {
    const prompt = elements.createInput?.value.trim();
    if (!prompt) return;
    
    // 如果是新游戏，清空对话历史（开始新的积木堆）
    if (!currentGameId) {
        conversationHistory = [];
        console.log('🆕 新游戏，已清空对话历史');
        
        if (elements.conversationMessages) {
            elements.conversationMessages.innerHTML = '';
        }
    }
    
    addConversation('user', prompt);
    elements.createInput.value = '';
    showLoading();
    
    // ... 后续处理相同
}
```

### 5. 修改 `loadConversationHistory()` - 加载积木堆

```javascript
function loadConversationHistory(gameId) {
    if (!window.GameStorage) {
        console.warn('⚠️ GameStorage 未初始化');
        return;
    }
    
    const history = GameStorage.getConversationHistory(gameId);
    
    // 恢复内存中的对话历史
    conversationHistory = [];
    history.forEach(item => {
        addMessageToUI(item.role, item.content, item.timestamp);
        conversationHistory.push(item);
    });
    
    console.log('📚 已加载对话历史:', conversationHistory.length, '条');
    console.log('🧱 积木堆恢复完成');
}
```

---

## 📊 对话历史结构

### 示例：4 轮对话后的积木堆

```javascript
conversationHistory = [
    // 🧱 积木 1：创建
    {
        role: 'user',
        content: '创建一个贪食蛇游戏',
        timestamp: '2026-03-16T10:00:00.000Z'
    },
    {
        role: 'assistant',
        content: '✅ 游戏生成成功！代码长度：12345 字符',
        timestamp: '2026-03-16T10:00:05.000Z'
    },
    
    // 🧱 积木 2：加 AI 对手
    {
        role: 'user',
        content: '修改：加一个 AI 对手',
        timestamp: '2026-03-16T10:05:00.000Z'
    },
    {
        role: 'assistant',
        content: '✅ 修改完成！已添加 AI 对手，新代码长度：15678 字符',
        timestamp: '2026-03-16T10:05:08.000Z'
    },
    
    // 🧱 积木 3：修复 Bug
    {
        role: 'user',
        content: '修改：修复移动 Bug',
        timestamp: '2026-03-16T10:10:00.000Z'
    },
    {
        role: 'assistant',
        content: '✅ 修改完成！已修复移动 Bug，新代码长度：15890 字符',
        timestamp: '2026-03-16T10:10:06.000Z'
    },
    
    // 🧱 积木 4：双人模式
    {
        role: 'user',
        content: '修改：增加双人模式',
        timestamp: '2026-03-16T10:15:00.000Z'
    },
    {
        role: 'assistant',
        content: '✅ 修改完成！已添加双人模式，新代码长度：18900 字符',
        timestamp: '2026-03-16T10:15:10.000Z'
    }
]
```

---

## 🎯 发送给 AI 的完整上下文

### 第 4 轮修改时发送给 AI 的消息：

```javascript
messages = [
    // 系统提示词
    {
        role: 'system',
        content: `你是专业的游戏开发 AI 助手，擅长修改和优化游戏代码。
重要：你必须保留之前所有的功能和需求，像搭积木一样积累。
每次修改都要保留之前的所有功能，只根据最新要求添加或修改。`
    },
    
    // 🧱 积木 1：原始创建
    {
        role: 'user',
        content: '请创建一个完整的 HTML5 游戏。游戏描述：创建一个贪食蛇游戏。...'
    },
    {
        role: 'assistant',
        content: '✅ 游戏生成成功！代码长度：12345 字符'
    },
    
    // 🧱 积木 2：加 AI 对手
    {
        role: 'user',
        content: '修改：加一个 AI 对手'
    },
    {
        role: 'assistant',
        content: '✅ 修改完成！已添加 AI 对手，新代码长度：15678 字符'
    },
    
    // 🧱 积木 3：修复 Bug
    {
        role: 'user',
        content: '修改：修复移动 Bug'
    },
    {
        role: 'assistant',
        content: '✅ 修改完成！已修复移动 Bug，新代码长度：15890 字符'
    },
    
    // 🧱 积木 4：当前修改（双人模式）
    {
        role: 'user',
        content: `当前游戏代码：
<完整代码，包含 AI 对手和 Bug 修复>

修改要求：增加双人模式

重要：
1. 🧱 保留之前所有的功能和需求（像搭积木一样积累）
2. 🧱 只根据最新要求修改代码，不要删除之前的功能
3. 🧱 如果之前添加了 AI 对手、Bug 修复等功能，必须保留
4. 保持 Canvas 尺寸为 360x640 像素
5. 返回完整的 HTML 代码`
    }
]
```

**结果:** ✅ AI 看到完整的积木堆，知道要保留 AI 对手和 Bug 修复！

---

## 🔧 Token 优化策略

### 1. 限制对话历史长度

```javascript
const MAX_HISTORY = 40;  // 最多 40 条

if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY);
}
```

### 2. 限制代码长度

```javascript
${currentGameCode.substring(0, 50000)}  // 限制 50K 字符
```

### 3. Token 估算

```
系统提示词：~100 tokens
原始创建请求：~500 tokens
原始创建响应：~50 tokens
每次修改请求：~100 tokens
每次修改响应：~50 tokens
当前游戏代码：~10,000 tokens

20 轮对话总计：
100 + 500 + 50 + 20*(100+50) + 10000 = ~13,650 tokens

仍在模型上下文范围内 ✅
```

---

## 📝 实现步骤

### 步骤 1: 添加全局变量

在 `js/create-new.js` 开头添加：
```javascript
let conversationHistory = [];  // 对话历史（积木堆）
const MAX_HISTORY = 40;        // 最多保留 40 条
```

### 步骤 2: 修改 `addConversation()`

添加对话历史记录逻辑

### 步骤 3: 修改 `modifyGame()`

构建完整的对话历史发送给 AI

### 步骤 4: 修改 `generateGame()`

新游戏时清空对话历史

### 步骤 5: 修改 `loadConversationHistory()`

加载游戏时恢复对话历史

### 步骤 6: 更新版本号

`create.html`: v21 → v22

---

## ✅ 测试方法

### 测试场景：搭积木

1. **创建游戏**
   ```
   创建一个贪食蛇游戏
   ```
   - ✅ 基础贪食蛇

2. **加 AI 对手**
   ```
   修改：加一个 AI 对手
   ```
   - ✅ 贪食蛇 + AI 对手

3. **修复 Bug**
   ```
   修改：修复移动 Bug
   ```
   - ✅ 贪食蛇 + AI 对手 + Bug 修复

4. **双人模式**
   ```
   修改：增加双人模式
   ```
   - ✅ 贪食蛇 + AI 对手 + Bug 修复 + 双人模式

5. **验证**
   - 打开控制台查看对话历史
   - 检查游戏是否保留所有功能
   - 确认 AI 没有"失忆"

---

## 🎉 预期效果

### 之前 ❌
```
第 1 轮：创建贪食蛇 → ✅ 有
第 2 轮：加 AI 对手 → ✅ 有
第 3 轮：修复 Bug → ❌ AI 忘记了 AI 对手
```

### 现在 ✅
```
第 1 轮：创建贪食蛇 → 🧱 积木 1
第 2 轮：加 AI 对手 → 🧱🧱 积木 1+2
第 3 轮：修复 Bug → 🧱🧱🧱 积木 1+2+3
第 4 轮：双人模式 → 🧱🧱🧱🧱 积木 1+2+3+4

最终：所有功能都保留！
```

---

## 📚 相关文档

- `docs/CONTEXT-MEMORY-FIX.md` - 之前的修复方案（参考）
- `docs/CONTEXT-BUILDING-BLOCKS.md` - 本文档
- `docs/MODEL-INTEGRATION-SPEC.md` - 模型集成规范

---

**设计理念:** 像搭积木一样积累需求，每轮修改都是在前一轮的基础上添加，而不是替换。

**核心改进:** 维护完整的对话历史，每次修改都发送给 AI，让 AI 看到所有之前的需求。

**预期结果:** AI 不再"失忆"，用户的所有需求都被保留和实现。
