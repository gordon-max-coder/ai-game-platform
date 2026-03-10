// Check and restore inspiration button
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'create.html');

console.log('Reading create.html...');
let content = fs.readFileSync(filePath, 'utf8');

// Check for inspiration button
if (content.includes('btn-inspire') || content.includes('灵感')) {
    console.log('✅ Inspiration button exists');
} else {
    console.log('❌ Inspiration button NOT found - need to restore');
    
    // Find the input-tips div and add button after it
    const inputTipsPattern = '<div class="input-tips">';
    const inspirationButton = `
                        <button class="btn-inspire" id="inspireBtn">🎲 灵感</button>
                        `;
    
    if (content.includes(inputTipsPattern)) {
        // Add button before input-tips
        const newContent = content.replace(
            inputTipsPattern,
            inspirationButton + inputTipsPattern
        );
        
        content = newContent;
        console.log('✅ Inspiration button restored');
    } else {
        console.log('❌ Could not find input-tips section');
    }
    
    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ File saved');
}

console.log('Done!');
