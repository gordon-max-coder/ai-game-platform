// Find where games are created in create-new.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'create-new.js');
const content = fs.readFileSync(filePath, 'utf8');

console.log('🔍 Finding game creation logic...\n');

// Look for where game is saved after generation
const patterns = [
  /saveGame\(\{[\s\S]*?id:\s*([^\,}]+)/,
  /currentGameId\s*=\s*([^\n]+)/,
  /game\.id\s*=\s*([^\n]+)/
];

patterns.forEach((pattern, index) => {
  const match = content.match(pattern);
  if (match) {
    console.log(`Pattern ${index + 1}: Found!`);
    console.log('─'.repeat(60));
    console.log(match[0].substring(0, 200));
    console.log('─'.repeat(60));
    console.log();
  }
});

// Check if there's a UUID or timestamp based ID generation
if (content.includes('Date.now()') || content.includes('UUID') || content.includes('generateId')) {
  console.log('✅ Found ID generation using timestamp or UUID');
} else {
  console.log('❌ No unique ID generation found - this is the bug!');
  console.log('Games might be using name as ID, causing overwrites.');
}
