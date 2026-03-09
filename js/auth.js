/**
 * GameAI - 用户认证模块
 * 使用 IndexedDB 存储用户数据
 */

const Auth = (function() {
    const DB_NAME = 'GameAI_DB';
    const DB_VERSION = 1;
    const USER_STORE = 'users';
    const SESSION_STORE = 'sessions';
    
    let db = null;
    let currentUser = null;

    // 初始化数据库
    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('❌ 数据库打开失败:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                db = request.result;
                console.log('✅ 数据库已打开');
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                
                // 创建用户存储
                if (!database.objectStoreNames.contains(USER_STORE)) {
                    const userStore = database.createObjectStore(USER_STORE, { keyPath: 'id' });
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('username', 'username', { unique: true });
                    console.log('✅ 用户存储已创建');
                }

                // 创建会话存储
                if (!database.objectStoreNames.contains(SESSION_STORE)) {
                    database.createObjectStore(SESSION_STORE, { keyPath: 'userId' });
                    console.log('✅ 会话存储已创建');
                }
            };
        });
    }

    // 简单密码加密（实际生产环境应使用更安全的加密）
    function hashPassword(password) {
        return btoa(password + '_gameai_salt_2025');
    }

    // 生成用户 ID
    function generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 验证邮箱格式
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 验证用户名
    function isValidUsername(username) {
        return username && username.length >= 3 && username.length <= 20;
    }

    // 验证密码
    function isValidPassword(password) {
        return password && password.length >= 6;
    }

    // 公开方法
    return {
        /**
         * 初始化认证系统
         */
        init: async function() {
            await initDB();
            // 检查是否有已登录的会话
            this.checkSession();
        },

        /**
         * 用户注册
         * @param {Object} userData - 用户数据 {email, username, password}
         * @returns {Object} 注册结果
         */
        register: function(userData) {
            return new Promise((resolve, reject) => {
                // 验证数据
                if (!isValidEmail(userData.email)) {
                    reject({ success: false, message: '邮箱格式不正确' });
                    return;
                }

                if (!isValidUsername(userData.username)) {
                    reject({ success: false, message: '用户名长度必须在 3-20 个字符之间' });
                    return;
                }

                if (!isValidPassword(userData.password)) {
                    reject({ success: false, message: '密码长度必须至少 6 位' });
                    return;
                }

                const transaction = db.transaction([USER_STORE], 'readwrite');
                const store = transaction.objectStore(USER_STORE);
                
                // 检查邮箱是否已存在
                const emailIndex = store.index('email');
                const emailRequest = emailIndex.get(userData.email);

                emailRequest.onsuccess = () => {
                    if (emailRequest.result) {
                        reject({ success: false, message: '该邮箱已被注册' });
                        return;
                    }

                    // 检查用户名是否已存在
                    const usernameIndex = store.index('username');
                    const usernameRequest = usernameIndex.get(userData.username);

                    usernameRequest.onsuccess = () => {
                        if (usernameRequest.result) {
                            reject({ success: false, message: '该用户名已被使用' });
                            return;
                        }

                        // 创建新用户
                        const newUser = {
                            id: generateUserId(),
                            email: userData.email,
                            username: userData.username,
                            password: hashPassword(userData.password),
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            gamesCreated: 0,
                            avatar: null
                        };

                        const addRequest = store.add(newUser);

                        addRequest.onsuccess = () => {
                            console.log('✅ 用户注册成功:', newUser.id);
                            resolve({
                                success: true,
                                message: '注册成功',
                                user: {
                                    id: newUser.id,
                                    email: newUser.email,
                                    username: newUser.username
                                }
                            });
                        };

                        addRequest.onerror = () => {
                            reject({ success: false, message: '注册失败，请稍后重试' });
                        };
                    };
                };
            });
        },

        /**
         * 用户登录
         * @param {string} email - 邮箱
         * @param {string} password - 密码
         * @returns {Object} 登录结果
         */
        login: function(email, password) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([USER_STORE], 'readonly');
                const store = transaction.objectStore(USER_STORE);
                
                const index = store.index('email');
                const request = index.get(email);

                request.onsuccess = () => {
                    const user = request.result;
                    
                    if (!user) {
                        reject({ success: false, message: '邮箱或密码错误' });
                        return;
                    }

                    if (user.password !== hashPassword(password)) {
                        reject({ success: false, message: '邮箱或密码错误' });
                        return;
                    }

                    // 创建会话
                    this.createSession(user);
                    
                    console.log('✅ 用户登录成功:', user.id);
                    resolve({
                        success: true,
                        message: '登录成功',
                        user: {
                            id: user.id,
                            email: user.email,
                            username: user.username
                        }
                    });
                };

                request.onerror = () => {
                    reject({ success: false, message: '登录失败，请稍后重试' });
                };
            });
        },

        /**
         * 登出
         */
        logout: function() {
            if (!currentUser) return;

            const transaction = db.transaction([SESSION_STORE], 'readwrite');
            const store = transaction.objectStore(SESSION_STORE);
            store.delete(currentUser.id);

            currentUser = null;
            localStorage.removeItem('gameai_current_user');
            
            console.log('✅ 用户已登出');
            
            // 触发登出事件
            window.dispatchEvent(new CustomEvent('auth:logout'));
        },

        /**
         * 创建会话
         */
        createSession: function(user) {
            const session = {
                userId: user.id,
                loginTime: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 天
            };

            const transaction = db.transaction([SESSION_STORE], 'readwrite');
            const store = transaction.objectStore(SESSION_STORE);
            store.put(session);

            currentUser = {
                id: user.id,
                email: user.email,
                username: user.username
            };

            localStorage.setItem('gameai_current_user', JSON.stringify(currentUser));
            
            // 触发登录事件
            window.dispatchEvent(new CustomEvent('auth:login', { detail: currentUser }));
        },

        /**
         * 检查会话
         */
        checkSession: function() {
            const stored = localStorage.getItem('gameai_current_user');
            if (!stored) {
                currentUser = null;
                return null;
            }

            currentUser = JSON.parse(stored);
            
            // 验证会话是否过期
            const transaction = db.transaction([SESSION_STORE], 'readonly');
            const store = transaction.objectStore(SESSION_STORE);
            const request = store.get(currentUser.id);

            request.onsuccess = () => {
                const session = request.result;
                
                if (!session || new Date(session.expiresAt) < new Date()) {
                    this.logout();
                    return null;
                }

                return currentUser;
            };

            return currentUser;
        },

        /**
         * 获取当前用户
         */
        getCurrentUser: function() {
            return currentUser;
        },

        /**
         * 检查是否已登录
         */
        isLoggedIn: function() {
            return currentUser !== null;
        },

        /**
         * 更新用户信息
         */
        updateProfile: function(updates) {
            if (!currentUser) {
                return Promise.reject({ success: false, message: '未登录' });
            }

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([USER_STORE], 'readwrite');
                const store = transaction.objectStore(USER_STORE);
                
                const request = store.get(currentUser.id);

                request.onsuccess = () => {
                    const user = request.result;
                    if (!user) {
                        reject({ success: false, message: '用户不存在' });
                        return;
                    }

                    // 更新字段
                    if (updates.username) user.username = updates.username;
                    if (updates.avatar) user.avatar = updates.avatar;
                    user.updatedAt = new Date().toISOString();

                    const putRequest = store.put(user);

                    putRequest.onsuccess = () => {
                        currentUser.username = user.username;
                        localStorage.setItem('gameai_current_user', JSON.stringify(currentUser));
                        
                        console.log('✅ 用户信息已更新');
                        resolve({ success: true, user: currentUser });
                    };

                    putRequest.onerror = () => {
                        reject({ success: false, message: '更新失败' });
                    };
                };
            });
        },

        /**
         * 修改密码
         */
        changePassword: function(oldPassword, newPassword) {
            if (!currentUser) {
                return Promise.reject({ success: false, message: '未登录' });
            }

            if (!isValidPassword(newPassword)) {
                return Promise.reject({ success: false, message: '新密码长度必须至少 6 位' });
            }

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([USER_STORE], 'readwrite');
                const store = transaction.objectStore(USER_STORE);
                
                const request = store.get(currentUser.id);

                request.onsuccess = () => {
                    const user = request.result;
                    
                    if (user.password !== hashPassword(oldPassword)) {
                        reject({ success: false, message: '原密码错误' });
                        return;
                    }

                    user.password = hashPassword(newPassword);
                    user.updatedAt = new Date().toISOString();

                    const putRequest = store.put(user);

                    putRequest.onsuccess = () => {
                        console.log('✅ 密码已修改');
                        resolve({ success: true, message: '密码修改成功' });
                    };

                    putRequest.onerror = () => {
                        reject({ success: false, message: '修改失败' });
                    };
                };
            });
        }
    };
})();

// 导出到全局
window.Auth = Auth;
console.log('✅ Auth 模块已加载');
