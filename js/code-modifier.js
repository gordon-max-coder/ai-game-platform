/**
 * 🛡️ 安全代码修改工具
 * 精确修改代码，避免误替换
 */

const CodeModifier = (function() {
    'use strict';

    /**
     * 创建安全的正则表达式（只匹配变量声明）
     */
    function createSafeRegex(propertyName) {
        // 转义属性名中的特殊字符
        const escapedName = propertyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // 匹配：const/let/var 变量名 = 值;
        // 不匹配：函数参数、对象属性、数组元素等
        return new RegExp(
            `^([ \\t]*)(const|let|var)\\s+${escapedName}\\s*=\\s*([^;]+);`,
            'gm'
        );
    }

    /**
     * 安全替换属性值
     * @param {string} code - 原始代码
     * @param {string} propertyName - 属性名
     * @param {number|string} newValue - 新值
     * @returns {object} { success, error, newCode, replaced, oldValue }
     */
    function safeReplace(code, propertyName, newValue) {
        try {
            const regex = createSafeRegex(propertyName);
            const matches = [...code.matchAll(regex)];
            
            if (matches.length === 0) {
                return {
                    success: false,
                    error: `未找到变量 "${propertyName}" 的声明`,
                    newCode: code,
                    replaced: 0,
                    oldValue: null
                };
            }
            
            if (matches.length > 1) {
                return {
                    success: false,
                    error: `找到 ${matches.length} 个 "${propertyName}" 声明，无法确定修改哪个`,
                    newCode: code,
                    replaced: 0,
                    oldValue: null
                };
            }
            
            const match = matches[0];
            const indent = match[1];
            const keyword = match[2];
            const oldValue = match[3].trim();
            
            // 精确替换
            let replacedCount = 0;
            const newCode = code.replace(regex, (m, ind, key, oldVal) => {
                replacedCount++;
                return `${ind}${key} ${propertyName} = ${newValue};`;
            });
            
            return {
                success: true,
                newCode: newCode,
                replaced: replacedCount,
                oldValue: oldValue,
                newValue: newValue
            };
        } catch (error) {
            return {
                success: false,
                error: `替换失败：${error.message}`,
                newCode: code,
                replaced: 0,
                oldValue: null
            };
        }
    }

    /**
     * 批量安全替换
     */
    function safeReplaceBatch(code, replacements) {
        let result = {
            success: true,
            newCode: code,
            replaced: 0,
            errors: [],
            changes: []
        };
        
        for (const [propName, newValue] of Object.entries(replacements)) {
            const replaceResult = safeReplace(result.newCode, propName, newValue);
            
            if (replaceResult.success) {
                result.newCode = replaceResult.newCode;
                result.replaced += replaceResult.replaced;
                result.changes.push({
                    property: propName,
                    oldValue: replaceResult.oldValue,
                    newValue: newValue
                });
            } else {
                result.errors.push({
                    property: propName,
                    error: replaceResult.error
                });
            }
        }
        
        // 如果有任何错误，标记为部分成功
        if (result.errors.length > 0) {
            result.success = result.changes.length > 0;
            result.partialSuccess = true;
        }
        
        return result;
    }

    /**
     * 验证代码完整性
     */
    function validateCode(code) {
        const issues = [];
        
        // 检查基本语法
        const openBraces = (code.match(/{/g) || []).length;
        const closeBraces = (code.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
            issues.push(`括号不匹配：{ ${openBraces} 个，} ${closeBraces} 个`);
        }
        
        const openParens = (code.match(/\(/g) || []).length;
        const closeParens = (code.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            issues.push(`圆括号不匹配：( ${openParens} 个，) ${closeParens} 个`);
        }
        
        // 检查是否有明显的语法错误
        if (/const\s+const/.test(code)) {
            issues.push('发现重复的 const 关键字');
        }
        
        if (/=\s*=/.test(code)) {
            issues.push('发现连续的等号');
        }
        
        return {
            valid: issues.length === 0,
            issues: issues
        };
    }

    /**
     * 格式化代码（简单的缩进整理）
     */
    function formatCode(code) {
        // 这里可以集成 Prettier 或其他格式化工具
        // 目前只做最简单的处理
        return code
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n');
    }

    // 公开 API
    return {
        safeReplace,
        safeReplaceBatch,
        validateCode,
        formatCode,
        createSafeRegex
    };
})();

// 导出到全局
window.CodeModifier = CodeModifier;
console.log('🛡️ CodeModifier 已加载');
