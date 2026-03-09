/**
 * GameAI - 顶部导航栏逻辑
 */

const Navbar = (function() {
    let currentUser = null;

    function init() {
        // 等待 Auth 模块初始化
        if (window.Auth) {
            Auth.init().then(() => {
                currentUser = Auth.getCurrentUser();
                updateUI();
            });
        }

        // 监听认证事件
        window.addEventListener('auth:login', (event) => {
            currentUser = event.detail;
            updateUI();
        });

        window.addEventListener('auth:logout', () => {
            currentUser = null;
            updateUI();
        });

        // 高亮当前页面
        highlightCurrentPage();
    }

    function updateUI() {
        const container = document.getElementById('navbarUserContainer');
        if (!container) return;

        if (currentUser) {
            // 已登录 - 显示用户信息
            container.innerHTML = `
                <div class="navbar-user" onclick="Navbar.goToProfile()" title="个人中心">
                    <div class="user-avatar-small">${currentUser.username.charAt(0).toUpperCase()}</div>
                    <span class="user-name-small">${escapeHtml(currentUser.username)}</span>
                </div>
            `;
        } else {
            // 未登录 - 显示登录注册按钮
            container.innerHTML = `
                <div class="navbar-auth">
                    <a href="auth.html" class="btn-navbar-login">登录</a>
                    <a href="auth.html?register=1" class="btn-navbar-signup">注册</a>
                </div>
            `;
        }
    }

    function highlightCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        // 移除所有高亮
        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.classList.remove('active');
        });

        // 添加当前页面高亮
        const activeLink = document.getElementById('nav-' + page.replace('.html', '').replace('-', ''));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function goToProfile() {
        window.location.href = 'profile.html';
    }

    function logout() {
        if (confirm('确定要登出吗？')) {
            if (window.Auth) {
                Auth.logout();
            }
        }
    }

    return {
        init: init,
        goToProfile: goToProfile,
        logout: logout
    };
})();

// 页面加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navbar.init());
} else {
    Navbar.init();
}

console.log('✅ Navbar 模块已加载');
