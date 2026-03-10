// Add code button event listener to create-new.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'create-new.js');

console.log('Reading create-new.js...');
let content = fs.readFileSync(filePath, 'utf8');

// Find the line with playBtn event listener and add codeBtn listener after it
const playBtnLine = "elements.playBtn?.addEventListener('click', playGame);";
const codeBtnListener = "\n    document.getElementById('codeBtn')?.addEventListener('click', showCode);";

if (content.includes(playBtnLine)) {
    content = content.replace(playBtnLine, playBtnLine + codeBtnListener);
    console.log('✅ Added codeBtn event listener');
} else {
    console.log('⚠️  playBtn line not found, trying alternative...');
    // Try to find modifyBtn line
    const modifyBtnLine = "document.getElementById('modifyBtn')?.addEventListener('click', enterModifyMode);";
    if (content.includes(modifyBtnLine)) {
        content = content.replace(modifyBtnLine, codeBtnListener + '\n    ' + modifyBtnLine);
        console.log('✅ Added codeBtn event listener (alternative method)');
    } else {
        console.log('❌ Could not find insertion point');
    }
}

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ File saved');
console.log('Done!');
