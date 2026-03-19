const https = require('https');

// 测试 Godot 导出 API
const testData = {
    htmlCode: `<!DOCTYPE html>
<html>
<head>
    <title>Test Game</title>
</head>
<body>
    <canvas id="gameCanvas" width="360" height="640"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // 简单的游戏循环
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'red';
            ctx.fillRect(180, 320, 20, 20);
            requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
    </script>
</body>
</html>`,
    gameTitle: '测试游戏',
    gameId: 'test_' + Date.now()
};

const dataString = JSON.stringify(testData);

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/export-godot',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
    }
};

console.log('🛠️ 测试 Godot 导出 API...\n');

const req = https.request(options, (res) => {
    console.log(`📥 响应状态：${res.statusCode}`);
    
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const response = JSON.parse(body);
            console.log('✅ 导出成功!\n');
            console.log('📦 响应数据:');
            console.log('   成功:', response.success);
            console.log('   消息:', response.message);
            console.log('   ZIP URL:', response.zipUrl);
            console.log('   文件列表:', response.files?.join(', '));
            console.log('\n✅ Godot 导出功能正常！');
        } else {
            console.log('❌ 导出失败:', body);
        }
    });
});

req.on('error', (e) => {
    console.error('❌ 请求失败:', e.message);
    console.log('\n💡 提示：确保服务器已启动 (node server.js)');
});

req.write(dataString);
req.end();
