// 游戏库页面脚本

// 筛选功能
const filterBtns = document.querySelectorAll('.filter-btn');
const gameCards = document.querySelectorAll('.game-card, .game-card-large');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有 active 类
        filterBtns.forEach(b => b.classList.remove('active'));
        // 添加 active 到当前按钮
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        
        gameCards.forEach(card => {
            if (filter === 'all' || filter === 'trending') {
                card.style.display = 'block';
            } else {
                // 这里可以根据游戏的实际分类进行筛选
                // 目前作为演示，全部显示
                card.style.display = 'block';
            }
        });
    });
});

// 搜索功能
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

function searchGames() {
    const query = searchInput.value.toLowerCase().trim();
    
    gameCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('.game-desc')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || desc.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', searchGames);
}

if (searchBtn) {
    searchBtn.addEventListener('click', searchGames);
}

// 加载更多
const loadMoreBtn = document.querySelector('.btn-load-more');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // 模拟加载更多游戏
        const gamesGrid = document.querySelector('.games-grid');
        for (let i = 0; i < 6; i++) {
            const newCard = document.createElement('div');
            newCard.className = 'game-card';
            newCard.innerHTML = `
                <img src="https://picsum.photos/seed/game${Date.now() + i}/300/200" alt="游戏封面">
                <div class="game-overlay">
                    <button class="play-button">▶️</button>
                </div>
                <div class="game-info">
                    <h3>新游戏 ${i + 1}</h3>
                    <div class="game-meta">
                        <span class="plays">${Math.floor(Math.random() * 900) + 100}K</span>
                    </div>
                </div>
            `;
            gamesGrid.appendChild(newCard);
        }
        
        loadMoreBtn.textContent = '加载更多...';
        setTimeout(() => {
            loadMoreBtn.textContent = '加载更多游戏';
        }, 500);
    });
}

// 游戏卡片悬停效果
gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.zIndex = '1';
    });
});

console.log('Games library loaded!');
