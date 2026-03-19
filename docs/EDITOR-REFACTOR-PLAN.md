# 🎮 游戏编辑器重构计划

> **目标**: 创建稳定、可靠、易用的可视化编辑器  
> **版本**: v36 (重构版)  
> **日期**: 2026-03-18

---

## 🐛 当前问题分析

### 问题 1: 数值修改错乱
**原因**: 
- 正则表达式太宽泛，匹配到不该替换的地方
- 没有区分变量声明和使用
- 多次替换导致冲突

**示例**:
```javascript
// 原始代码
const speed = 300;
const playerSpeed = speed * 2;  // ← 这里也被替换了！

// 用户修改 speed: 300 → 500
// 错误替换结果：
const speed = 500;
const playerSpeed = 500 * 2;  // ❌ 错了！应该是 speed * 2
```

### 问题 2: 属性解析不准确
**原因**:
- 硬编码的对象列表，不从实际代码解析
- 无法识别复杂的游戏结构
- 变量名不匹配就找不到

### 问题 3: 实时更新失败
**原因**:
- 游戏代码没有监听 postMessage
- 修改后没有正确重新渲染
- 状态管理混乱

---

## ✅ 重构方案

### 方案 A: 基于 AST 的精确修改（推荐）

使用 JavaScript 解析器（如 Acorn、Esprima）来**精确修改代码**：

```javascript
// 1. 解析代码为 AST
const ast = acorn.parse(code, { ecmaVersion: 2020 });

// 2. 找到目标变量声明
walk.simple(ast, {
    VariableDeclarator(node) {
        if (node.id.name === 'speed') {
            // 3. 精确修改值
            node.init.value = 500;
        }
    }
});

// 4. 生成新代码
const newCode = escodegen.generate(ast);
```

**优点**:
- ✅ 100% 精确，不会误替换
- ✅ 能处理复杂表达式
- ✅ 保持代码格式和注释

**缺点**:
- ⚠️ 需要额外依赖（acorn, escodegen）
- ⚠️ 代码量较大

---

### 方案 B: 改进的正则 + 作用域限制（快速方案）

使用**更精确的正则**，只匹配变量声明：

```javascript
// 精确匹配变量声明（不匹配使用）
const regex = /^(?:const|let|var)\s+(speed|color|size)\s*=\s*([^;]+);/gm;

// 替换时检查完整匹配
code = code.replace(regex, (match, name, value) => {
    if (name === 'speed') {
        return `const ${name} = ${newValue};`;
    }
    return match;
});
```

**优点**:
- ✅ 无需额外依赖
- ✅ 实现简单快速
- ✅ 比当前方案准确

**缺点**:
- ⚠️ 仍然可能误匹配
- ⚠️ 无法处理复杂情况

---

### 方案 C: 元数据驱动（最佳实践）

在 AI 生成游戏时，**同时生成元数据**：

```javascript
// AI 生成的代码包含元数据注释
// @GameMetadata:
//   - id: player
//     type: CharacterBody2D
//     properties:
//       speed: { line: 15, value: 300 }
//       color: { line: 16, value: "#ff0000" }
//       size: { line: 17, value: 32 }

const speed = 300;  // @prop: player.speed
const color = "#ff0000";  // @prop: player.color
const size = 32;  // @prop: player.size
```

**编辑器读取元数据**:
```javascript
// 解析元数据
const metadata = parseMetadata(code);

// 生成属性面板
metadata.properties.forEach(prop => {
    renderPropertyPanel(prop);
});

// 修改时精确定位
function updateProperty(propId, newValue) {
    const prop = metadata.properties.find(p => p.id === propId);
    const line = code.split('\n')[prop.line - 1];
    const newLine = line.replace(/=\s*[^;]+/, `= ${newValue}`);
    // 替换指定行
}
```

**优点**:
- ✅ 100% 准确
- ✅ 支持任意属性
- ✅ 易于扩展
- ✅ 编辑器和游戏解耦

**缺点**:
- ⚠️ 需要修改 AI 生成逻辑
- ⚠️ 需要 AI 理解元数据格式

---

## 🎯 推荐实施方案

### 阶段 1: 快速修复（方案 B）- 1 小时

**目标**: 立即修复数值错乱问题

**步骤**:
1. 改进正则表达式，只匹配变量声明
2. 添加作用域检查，避免误替换
3. 添加修改确认对话框
4. 添加撤销功能

**预期效果**:
- ✅ 数值修改准确率提升到 90%
- ✅ 用户可以撤销错误修改
- ✅ 基本功能可用

---

### 阶段 2: 元数据支持（方案 C）- 2 小时

**目标**: 实现精确的属性编辑

**步骤**:
1. 修改 AI 提示词，生成元数据注释
2. 实现元数据解析器
3. 基于元数据生成属性面板
4. 实现精确的代码修改

**预期效果**:
- ✅ 100% 准确的属性修改
- ✅ 支持任意属性类型
- ✅ 编辑器体验接近专业工具

---

### 阶段 3: AST 支持（方案 A）- 4 小时

**目标**: 专业级代码编辑能力

**步骤**:
1. 集成 Acorn 解析器
2. 实现 AST 遍历和修改
3. 代码生成和格式化
4. 添加代码压缩/美化

**预期效果**:
- ✅ 专业级代码编辑
- ✅ 支持复杂重构
- ✅ 保持代码风格

---

## 🔧 阶段 1 实现细节

### 1. 改进正则表达式

```javascript
/**
 * 精确匹配变量声明（不匹配使用）
 * 只匹配行首的 const/let/var 声明
 */
function createSafeRegex(propertyName) {
    // 匹配：const speed = 300; 但不匹配 playerSpeed 或 speed * 2
    return new RegExp(
        `^(\\s*)(const|let|var)\\s+${propertyName}\\s*=\\s*([^;]+);`,
        'gm'
    );
}

// 使用示例
const speedRegex = createSafeRegex('speed');
const matches = [...code.matchAll(speedRegex)];
console.log(`找到 ${matches.length} 个 speed 声明`);
```

### 2. 安全替换函数

```javascript
/**
 * 安全替换属性值
 * @param {string} code - 原始代码
 * @param {string} propertyName - 属性名（如 speed）
 * @param {number|string} newValue - 新值
 * @returns {object} { success: boolean, newCode: string, replaced: number }
 */
function safeReplaceProperty(code, propertyName, newValue) {
    const regex = createSafeRegex(propertyName);
    const matches = [...code.matchAll(regex)];
    
    if (matches.length === 0) {
        return {
            success: false,
            error: `未找到属性 "${propertyName}" 的声明`,
            newCode: code,
            replaced: 0
        };
    }
    
    if (matches.length > 1) {
        return {
            success: false,
            error: `找到 ${matches.length} 个 "${propertyName}" 声明，无法确定修改哪个`,
            newCode: code,
            replaced: 0
        };
    }
    
    // 精确替换
    let replaced = 0;
    const newCode = code.replace(regex, (match, indent, keyword, oldValue) => {
        replaced++;
        return `${indent}${keyword} ${propertyName} = ${newValue};`;
    });
    
    return {
        success: true,
        newCode: newCode,
        replaced: replaced,
        oldValue: matches[0][3].trim(),
        newValue: newValue
    };
}
```

### 3. 添加撤销功能

```javascript
// 修改历史栈
const editHistory = [];
const MAX_HISTORY = 20;

function recordEdit(propertyName, oldValue, newValue, codeBefore) {
    editHistory.push({
        timestamp: Date.now(),
        property: propertyName,
        oldValue: oldValue,
        newValue: newValue,
        codeBefore: codeBefore,
        codeAfter: state.currentGame
    });
    
    // 限制历史记录数量
    if (editHistory.length > MAX_HISTORY) {
        editHistory.shift();
    }
}

function undoLastEdit() {
    if (editHistory.length === 0) {
        showToast('⚠️ 没有可撤销的修改');
        return null;
    }
    
    const lastEdit = editHistory.pop();
    state.currentGame = lastEdit.codeBefore;
    
    console.log('↩️ 已撤销:', lastEdit.property, lastEdit.oldValue, '←', lastEdit.newValue);
    showToast(`↩️ 已撤销 ${lastEdit.property} 的修改`);
    
    return lastEdit;
}
```

### 4. 添加修改确认

```javascript
function updateProperty(objectId, property, value, field) {
    const obj = state.gameObjects.find(o => o.id === objectId);
    if (!obj) return;
    
    // 更新内存
    if (field && typeof obj.properties[property] === 'object') {
        obj.properties[property][field] = parseFloat(value);
    } else if (typeof obj.properties[property] === 'number') {
        obj.properties[property] = parseFloat(value);
    } else {
        obj.properties[property] = value;
    }
    
    // 安全替换代码
    const result = safeReplaceProperty(state.currentGame, property, obj.properties[property]);
    
    if (result.success) {
        // 记录修改历史
        recordEdit(property, result.oldValue, result.newValue, state.currentGame);
        
        // 更新代码
        state.currentGame = result.newCode;
        
        // 更新代码编辑器
        const codeEditor = document.getElementById('codeEditor');
        if (codeEditor) {
            codeEditor.value = result.newCode;
        }
        
        console.log(`✅ 已修改 ${property}: ${result.oldValue} → ${result.newValue}`);
        showToast(`✅ 已修改 ${property}`);
    } else {
        console.error('❌ 修改失败:', result.error);
        showToast('❌ ' + result.error);
        
        // 恢复内存中的值
        obj.properties[property] = result.oldValue ? parseFloat(result.oldValue) : obj.properties[property];
    }
}
```

---

## 📊 测试计划

### 测试用例 1: 单一变量修改
```javascript
// 原始代码
const speed = 300;

// 修改 speed: 300 → 500
// 预期结果
const speed = 500;

// 验证
✅ 只修改了声明处
✅ 没有误替换其他使用
```

### 测试用例 2: 相似变量名
```javascript
// 原始代码
const speed = 300;
const playerSpeed = speed * 2;
const maxSpeed = 600;

// 修改 speed: 300 → 500
// 预期结果
const speed = 500;
const playerSpeed = speed * 2;  // ← 不变
const maxSpeed = 600;  // ← 不变

// 验证
✅ 只修改了 speed
✅ playerSpeed 和 maxSpeed 不变
```

### 测试用例 3: 多个相同声明
```javascript
// 原始代码
const speed = 300;
// ... 其他代码 ...
const speed = 400;  // 重复声明

// 修改 speed
// 预期结果
❌ 报错：找到 2 个声明，无法确定修改哪个

// 验证
✅ 检测到冲突
✅ 不执行修改
✅ 提示用户手动处理
```

---

## 🎯 成功标准

### 阶段 1 完成标准
- [ ] 数值修改准确率 > 90%
- [ ] 撤销功能可用
- [ ] 修改冲突检测可用
- [ ] 用户反馈"基本好用"

### 阶段 2 完成标准
- [ ] 属性修改准确率 100%
- [ ] 支持所有属性类型
- [ ] 元数据解析稳定
- [ ] 用户反馈"很好用"

### 阶段 3 完成标准
- [ ] AST 解析稳定
- [ ] 支持复杂重构
- [ ] 性能优秀（<100ms）
- [ ] 用户反馈"专业级"

---

## 🚀 立即开始

**建议从阶段 1 开始**，快速修复当前问题，然后逐步完善。

需要我帮你实现阶段 1 的代码吗？
