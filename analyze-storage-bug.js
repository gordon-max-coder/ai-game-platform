// Analyze game-storage.js to find the bug
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'game-storage.js');
const content = fs.readFileSync(filePath, 'utf8');

console.log('🔍 Analyzing game storage logic...\n');

// Check saveGame function
if (content.includes('saveGame: function(gameData)')) {
  console.log('✅ Found saveGame function');
  
  // Extract saveGame function
  const saveGameMatch = content.match(/saveGame:\s*function\(gameData\)\s*\{[\s\S]*?\n\s*\}/);
  if (saveGameMatch) {
    console.log('\n📄 Current saveGame logic:');
    console.log('─'.repeat(60));
    console.log(saveGameMatch[0].substring(0, 500) + '...');
    console.log('─'.repeat(60));
  }
}

// Check if games are stored by name
if (content.includes('gamesByName') || content.includes('[gameData.name]')) {
  console.log('\n⚠️  WARNING: Games might be stored by NAME!');
  console.log('This causes the bug where same-name games overwrite each other.');
} else {
  console.log('\n✅ Games appear to be stored by ID (good)');
}

// Check generateGameId function
if (content.includes('generateGameId')) {
  console.log('\n✅ Found generateGameId function');
} else {
  console.log('\n❌ Missing generateGameId function');
}

// Check how games are retrieved
const getGameMatch = content.match(/getGame:\s*function\(gameId\)\s*\{[\s\S]*?\n\s*\}/);
if (getGameMatch) {
  console.log('\n📄 Current getGame logic:');
  console.log('─'.repeat(60));
  console.log(getGameMatch[0].substring(0, 300) + '...');
  console.log('─'.repeat(60));
}

console.log('\n🎯 Bug Analysis:');
console.log('─'.repeat(60));
console.log('Expected behavior:');
console.log('  1. Each new creation → NEW unique PID');
console.log('  2. Same name (贪食蛇) but different PID → Different games');
console.log('  3. Only modify action → Same PID, new version');
console.log('');
console.log('Current bug:');
console.log('  Games with same name are overwriting each other');
console.log('  Storage key might be using game name instead of PID');
console.log('─'.repeat(60));
