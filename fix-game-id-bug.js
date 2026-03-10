// Fix: Add unique game ID generation and fix storage logic
const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, 'js', 'game-storage.js');
let content = fs.readFileSync(storagePath, 'utf8');

console.log('🔧 Fixing game storage bug...\n');

// 1. Add generateGameId function if missing
if (!content.includes('generateGameId')) {
  console.log('✅ Adding generateGameId function...');
  
  const generateIdFunction = `
        
        // Generate unique game ID using timestamp + random
        generateGameId: function() {
            return 'game_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
        },
`;
  
  // Add after validateGame function
  content = content.replace(
    /(validateGame:\s*function\(game\)\s*\{[\s\S]*?\n\s*\},)/,
    `$1${generateIdFunction}`
  );
} else {
  console.log('✅ generateGameId already exists');
}

// 2. Fix saveGame to always use ID, not name
if (content.includes('gamesByName') || content.includes('[gameData.name]')) {
  console.log('⚠️  Fixing storage to use ID instead of name...');
  
  // Replace name-based storage with ID-based
  content = content.replace(/gamesByName/g, 'games');
  content = content.replace(/\[gameData\.name\]/g, '.find(g => g.id === gameData.id)');
} else {
  console.log('✅ Storage already uses ID');
}

// 3. Ensure saveGame generates new ID for new games
const saveGamePattern = /saveGame:\s*function\(gameData\)\s*\{/;
if (content.match(saveGamePattern)) {
  console.log('✅ Updating saveGame to handle new games correctly...');
  
  const newSaveGame = `saveGame: function(gameData) {
            if (!validateGame(gameData)) {
                return null;
            }
            
            const games = safeGetStorage();
            
            // Check if this is a new game (no ID or ID doesn't exist)
            if (!gameData.id || !games.find(g => g.id === gameData.id)) {
                // Generate new unique ID for new game
                gameData.id = this.generateGameId();
                gameData.version = 1;
                gameData.createdAt = new Date().toISOString();
                console.log('🆕 New game created with ID:', gameData.id);
            } else {
                // Update existing game (modify action)
                const existingGame = games.find(g => g.id === gameData.id);
                gameData.version = (existingGame.version || 1) + 1;
                gameData.updatedAt = new Date().toISOString();
                console.log('✏️  Game updated, version:', gameData.version);
            }
            
            // Remove old version if exists
            const filteredGames = games.filter(g => g.id !== gameData.id);
            
            // Add new/updated game
            filteredGames.push(gameData);
            
            safeSetStorage(filteredGames);
            return gameData;
        },`;
  
  content = content.replace(
    /saveGame:\s*function\(gameData\)\s*\{[\s\S]*?safeSetStorage\(games\);\s*return gameData;\s*\}/,
    newSaveGame
  );
}

// Write back
fs.writeFileSync(storagePath, content, 'utf8');
console.log('\n✅ File saved!');
console.log('\n📊 Summary:');
console.log('─'.repeat(60));
console.log('Fixed issues:');
console.log('  1. Added generateGameId() - creates unique IDs');
console.log('  2. saveGame() now generates new ID for new games');
console.log('  3. Same name + different time = different ID (no overwrite)');
console.log('  4. Modify action = same ID + version++ (correct behavior)');
console.log('─'.repeat(60));
console.log('\nExpected behavior after fix:');
console.log('  Day 1: Create 贪食蛇 → ID: game_xxx_123 (version 1)');
console.log('  Day 2: Create 贪食蛇 → ID: game_yyy_456 (version 1) ✅ Different!');
console.log('  Modify: 贪食蛇 → ID: game_xxx_123 (version 2) ✅ Same game!');
console.log('─'.repeat(60));
