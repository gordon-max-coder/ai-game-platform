/**
 * GameAI - 认证页面逻辑
 */

// 初始化认证系统
Auth.init().then(() => {
    console.log('✅ 认证系统已初始化');
    
    // 检查是否已登录
    if (Auth.isLoggedIn()) {
        // 已登录，重定向到首页
        window.location.href = 'index.html';
    }
}).catch(err => {
    console.error('❌ 认证系统初始化失败:', err);
});

// 显示登录表单
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    hideAlerts();
}

// 显示注册表单
function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    hideAlerts();
}

// 隐藏所有提示
function hideAlerts() {
    document.getElementById('loginAlert').style.display = 'none';
    document.getElementById('registerAlert').style.display = 'none';
}

// 显示提示
function showAlert(formId, message, type = 'error') {
    const alert = document.getElementById(formId + 'Alert');
    alert.textContent = message;
    alert.className = 'alert alert-' + type;
    alert.style.display = 'block';
    
    // 3 秒后自动隐藏
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

// 处理登录
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
        const result = await Auth.login(email, password);
        
        if (result.success) {
            showAlert('login', '登录成功！正在跳转...', 'success');
            
            // 保存登录状态
            if (rememberMe) {
                localStorage.setItem('gameai_remember', 'true');
            }
            
            // 延迟跳转
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    } catch (error) {
        showAlert('login', error.message || '登录失败，请重试');
    }
}

// 处理注册
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    
    // 验证密码
    if (password !== confirm) {
        showAlert('register', '两次输入的密码不一致');
        return;
    }
    
    try {
        const result = await Auth.register({
            username: username,
            email: email,
            password: password
        });
        
        if (result.success) {
            showAlert('register', '注册成功！正在跳转到登录...', 'success');
            
            // 自动登录
            setTimeout(async () => {
                try {
                    await Auth.login(email, password);
                    window.location.href = 'index.html';
                } catch (err) {
                    window.location.href = 'auth.html?login=1';
                }
            }, 1000);
        }
    } catch (error) {
        showAlert('register', error.message || '注册失败，请重试');
    }
}

// 页面加载时检查 URL 参数
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('login') === '1') {
    showLogin();
} else if (urlParams.get('register') === '1') {
    showRegister();
}

// 监听认证事件
window.addEventListener('auth:login', (event) => {
    console.log('用户已登录:', event.detail);
});

window.addEventListener('auth:logout', () => {
    console.log('用户已登出');
});
