// Restore inspiration.js script reference
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'create.html');

console.log('Reading create.html...');
let content = fs.readFileSync(filePath, 'utf8');

// Check if inspiration.js is already included
if (content.includes('inspiration.js')) {
    console.log('✅ inspiration.js is already included');
} else {
    console.log('❌ inspiration.js reference NOT found - restoring...');
    
    // Find show-code.js and add inspiration.js before it
    const showCodeScript = '<script src="js/show-code.js"></script>';
    const inspirationScript = '    <script src="js/inspiration.js"></script>\n    ' + showCodeScript;
    
    if (content.includes(showCodeScript)) {
        content = content.replace(showCodeScript, inspirationScript);
        console.log('✅ inspiration.js reference restored');
    } else {
        console.log('❌ Could not find show-code.js reference');
    }
    
    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ File saved');
}

console.log('Done!');
