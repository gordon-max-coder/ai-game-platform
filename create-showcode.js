// Create show-code.js with UTF-8 encoding
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'show-code.js');

const code = `// 显示游戏代码
function showCode() {
    if (!currentGameCode) {
        alert('暂无游戏代码');
        return;
    }
    
    const modal = document.getElementById('codeModal');
    const codeContent = document.getElementById('codeContent');
    const copyBtn = document.getElementById('copyCodeBtn');
    const downloadBtn = document.getElementById('downloadCodeBtn');
    const closeBtn = document.getElementById('closeCodeBtn');
    
    // 设置代码内容
    codeContent.textContent = currentGameCode;
    
    // 显示模态框
    modal.style.display = 'flex';
    
    // 复制按钮
    copyBtn.onclick = async () => {
        try {
            await navigator.clipboard.writeText(currentGameCode);
            copyBtn.textContent = '✅ 已复制';
            setTimeout(() => {
                copyBtn.textContent = '📋 复制';
            }, 2000);
        } catch (e) {
            alert('复制失败：' + e.message);
        }
    };
    
    // 下载按钮
    downloadBtn.onclick = () => {
        const blob = new Blob([currentGameCode], {type: 'text/html'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game-' + new Date().getTime() + '.html';
        a.click();
        URL.revokeObjectURL(url);
    };
    
    // 关闭按钮
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
    
    // 点击遮罩关闭
    modal.querySelector('.code-overlay').onclick = () => {
        modal.style.display = 'none';
    };
}
`;

fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ show-code.js created with UTF-8 encoding');
console.log('File size:', code.length, 'bytes');
