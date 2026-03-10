// Add code modal styles to create-layout.css
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'css', 'create-layout.css');

console.log('Reading create-layout.css...');
let content = fs.readFileSync(filePath, 'utf8');

// Check if styles already exist
if (content.includes('.code-modal')) {
    console.log('✅ Code modal styles already exist');
} else {
    console.log('Adding code modal styles...');
    
    const styles = `
/* ==================== 代码查看模态框 ==================== */
.code-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.code-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
}

.code-content {
    position: relative;
    background: #1a1a2e;
    border-radius: 12px;
    width: 90%;
    max-width: 1200px;
    height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #2d2d44;
    background: #0f0f1a;
    border-radius: 12px 12px 0 0;
}

.code-header h3 {
    color: white;
    font-size: 1.2rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.code-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.btn-code-action {
    padding: 0.5rem 1rem;
    background: #252542;
    border: 1px solid #2d2d44;
    border-radius: 8px;
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.btn-code-action:hover {
    background: #6366f1;
    border-color: #6366f1;
    transform: translateY(-2px);
}

.btn-close {
    background: transparent;
    border: none;
    color: #a0a0b0;
    font-size: 28px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-close:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    transform: rotate(90deg);
}

.code-body {
    flex: 1;
    overflow: auto;
    background: #0f0f1a;
    border-radius: 0 0 12px 12px;
}

.code-body pre {
    margin: 0;
    padding: 1.5rem;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.code-body code {
    color: #e0e0e0;
    display: block;
}

/* 滚动条样式 */
.code-body::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.code-body::-webkit-scrollbar-track {
    background: #0f0f1a;
}

.code-body::-webkit-scrollbar-thumb {
    background: #2d2d44;
    border-radius: 5px;
}

.code-body::-webkit-scrollbar-thumb:hover {
    background: #3d3d54;
}

/* 响应式 */
@media (max-width: 768px) {
    .code-content {
        width: 95%;
        height: 90vh;
    }
    
    .code-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .code-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
`;

    // Add at the end of the file
    content = content.trimEnd() + '\n' + styles;
    console.log('✅ Styles added');
}

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ File saved');
console.log('Done!');
