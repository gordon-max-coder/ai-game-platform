// ==UserScript==
// @name         Jiekou AI CORS Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 Jiekou AI API 添加 CORS 头
// @author       You
// @match        file:///*
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @grant        GM_xmlhttpRequest
// @connect      jiekou.ai
// ==/UserScript==

(function() {
    'use strict';

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.includes('jiekou.ai')) {
            console.log('[CORS Bypass] 拦截请求:', url);
            return GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                data: options.body || null,
                responseType: 'json'
            }).then(response => {
                console.log('[CORS Bypass] 响应:', response.status);
                return {
                    ok: response.status >= 200 && response.status < 300,
                    status: response.status,
                    json: () => Promise.resolve(response.response),
                    text: () => Promise.resolve(response.responseText)
                };
            });
        }
        return originalFetch.apply(this, arguments);
    };

    console.log('[CORS Bypass] 已加载 - Jiekou AI API 跨域请求已启用');
})();
