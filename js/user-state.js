/**
 * GameAI - 用户状态管理
 * 在所有页面显示用户登录状态
 */

const UserState = (function() {
    let currentUser = null;

    function init() {
        // 等待 Auth 模块初始化
        if (window.Auth) {
            Auth.init().then(() => {
                updateUI();
            });
        }

        // 监听认证事件
        window.addEventListener('auth:login', () => {
            updateUI();
        });

        window.addEventListener('auth:logout', () => {
            updateUI();
        });
    }

    function updateUI() {
        currentUser = Auth.getCurrentUser();
        
        const userContainer = document.getElementById('sidebarUserContainer');
        if (!userContainer) return;

        if (currentUser) {
            // 已登录 - 显示用户信息
            userContainer.innerHTML = `
                <div class="sidebar-user">
                    <div class="user-info">
                        <div class="user-avatar">${currentUser.username.charAt(0).toUpperCase()}</div>
                        <span class="user-name">${escapeHtml(currentUser.username)}</span>
                    </div>
                    <div class="user-actions">
                        <button class="btn-profile" onclick="UserState.goToProfile()">👤 个人中心</button>
                        <button class="btn-logout" onclick="UserState.logout()">🚪 登出</button>
                    </div>
                </div>
            `;
        } else {
            // 未登录 - 侧边栏不显示任何内容（登录注册只在顶部导航栏显示）
            userContainer.innerHTML = '';
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function logout() {
        if (confirm('确定要登出吗？')) {
            Auth.logout();
        }
    }

    function goToProfile() {
        window.location.href = 'profile.html';
    }

    return {
        init: init,
        logout: logout,
        goToProfile: goToProfile,
        getCurrentUser: function() {
            return currentUser;
        }
    };
})();

// 页面加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UserState.init());
} else {
    UserState.init();
}

console.log('✅ UserState 模块已加载');
