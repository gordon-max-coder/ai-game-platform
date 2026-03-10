// Restore inspiration button CSS styles
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'create-layout.css');

console.log('Reading create-layout.css...');
let content = fs.readFileSync(cssPath, 'utf8');

// Check if styles already exist
if (content.includes('.btn-inspire')) {
    console.log('✅ Inspiration button styles already exist');
} else {
    console.log('❌ Inspiration button CSS NOT found - restoring...');
    
    const styles = `
/* ==================== 灵感按钮样式 ==================== */
.btn-inspire {
    margin-top: 0.8rem;
    padding: 0.8rem 1.5rem;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #333;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
    width: 100%;
    justify-content: center;
}

.btn-inspire:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 165, 0, 0.5);
    background: linear-gradient(135deg, #FFC700 0%, #FF9500 100%);
}

.btn-inspire:active {
    transform: translateY(0);
}
`;
    
    // Add at the end
    content = content.trimEnd() + '\n' + styles;
    console.log('✅ Inspiration button CSS restored');
    
    // Write back
    fs.writeFileSync(cssPath, content, 'utf8');
    console.log('✅ File saved');
}

console.log('Done!');
