// Ensure currentGameCode is set in create-new.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'create-new.js');

console.log('Reading create-new.js...');
let content = fs.readFileSync(filePath, 'utf8');

// Check if currentGameCode variable exists
if (content.includes('let currentGameCode')) {
    console.log('✅ currentGameCode variable exists');
} else {
    console.log('Adding currentGameCode variable...');
    // Add after currentGameId
    content = content.replace(
        "let currentGameId = null;",
        "let currentGameId = null;\nlet currentGameCode = null;  // Current game HTML code"
    );
}

// Find showGamePreview function and ensure it sets currentGameCode
const showGamePreviewPattern = "function showGamePreview(gameCode) {";
const setCurrentGameCode = "function showGamePreview(gameCode) {\n    // Save game code\n    currentGameCode = gameCode;";

if (content.includes(showGamePreviewPattern) && !content.includes("currentGameCode = gameCode")) {
    content = content.replace(showGamePreviewPattern, setCurrentGameCode);
    console.log('✅ Added currentGameCode assignment in showGamePreview');
} else if (content.includes("currentGameCode = gameCode")) {
    console.log('✅ currentGameCode already set in showGamePreview');
} else {
    console.log('⚠️  Could not find showGamePreview function');
}

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ File saved');
console.log('Done!');
