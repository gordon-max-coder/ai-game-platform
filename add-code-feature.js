// Add code view button and modal to create.html
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'create.html');

console.log('Reading create.html...');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add code button
const buttonHtml = '<button class="btn-action" id="codeBtn">📄 代码</button>';
const previewActionsPattern = '<div class="preview-actions" id="previewActions" style="display: none;">';
const newPreviewActions = previewActionsPattern + '\n                            ' + buttonHtml;

content = content.replace(previewActionsPattern, newPreviewActions);
console.log('✅ Added code button');

// 2. Add modal HTML before </body>
const modalHtml = `
    <!-- Code View Modal -->
    <div id="codeModal" class="code-modal" style="display: none;">
        <div class="code-overlay"></div>
        <div class="code-content">
            <div class="code-header">
                <h3>📄 游戏代码</h3>
                <div class="code-actions">
                    <button class="btn-code-action" id="copyCodeBtn">📋 复制</button>
                    <button class="btn-code-action" id="downloadCodeBtn">💾 下载</button>
                    <button class="btn-close" id="closeCodeBtn">&times;</button>
                </div>
            </div>
            <div class="code-body">
                <pre><code id="codeContent"></code></pre>
            </div>
        </div>
    </div>
`;

content = content.replace('</body>', modalHtml + '</body>');
console.log('✅ Added code modal');

// 3. Add show-code.js script reference
const scriptRef = '    <script src="js/show-code.js"></script>';
const createNewScript = '<script src="js/create-new.js"></script>';
const newScripts = scriptRef + '\n    ' + createNewScript;

content = content.replace(createNewScript, newScripts);
console.log('✅ Added show-code.js reference');

// Write back with UTF-8
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ File saved with UTF-8 encoding');
console.log('Done!');
