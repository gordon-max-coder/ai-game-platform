// Remove duplicate codeBtn from create.html
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'create.html');

console.log('Reading create.html...');
let content = fs.readFileSync(filePath, 'utf8');

// Count occurrences
const codeBtnCount = (content.match(/id="codeBtn"/g) || []).length;
console.log(`Found ${codeBtnCount} codeBtn buttons`);

if (codeBtnCount > 1) {
    console.log('Removing duplicate button...');
    
    // Find the preview-actions section and ensure only one codeBtn
    const previewActionsStart = content.indexOf('<div class="preview-actions" id="previewActions"');
    const previewActionsEnd = content.indexOf('</div>', previewActionsStart);
    
    if (previewActionsStart !== -1 && previewActionsEnd !== -1) {
        const previewActionsSection = content.substring(previewActionsStart, previewActionsEnd);
        
        // Count buttons in this section
        const buttonsInSection = (previewActionsSection.match(/<button class="btn-action"/g) || []).length;
        console.log(`Buttons in preview-actions: ${buttonsInSection}`);
        
        // Remove duplicate codeBtn (keep only the first one)
        let firstCodeBtnFound = false;
        const lines = content.split('\n');
        const newLines = [];
        
        for (let line of lines) {
            if (line.includes('id="codeBtn"')) {
                if (!firstCodeBtnFound) {
                    firstCodeBtnFound = true;
                    newLines.push(line);
                    console.log('✅ Kept first codeBtn');
                } else {
                    console.log('❌ Removed duplicate codeBtn');
                    // Skip this line (don't add to newLines)
                }
            } else {
                newLines.push(line);
            }
        }
        
        content = newLines.join('\n');
    }
    
    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ File saved');
    
    // Verify
    const finalCount = (content.match(/id="codeBtn"/g) || []).length;
    console.log(`Final codeBtn count: ${finalCount}`);
    
    if (finalCount === 1) {
        console.log('✅ Successfully removed duplicate button!');
    } else {
        console.log('⚠️  Still have duplicates, please check manually');
    }
} else {
    console.log('✅ No duplicates found');
}

console.log('Done!');
