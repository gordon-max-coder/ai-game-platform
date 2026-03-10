// 学习中心页面脚本

// FAQ 折叠功能
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // 关闭所有其他项
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-toggle').textContent = '+';
            }
        });
        
        // 切换当前项
        item.classList.toggle('active');
        const toggle = item.querySelector('.faq-toggle');
        toggle.textContent = isActive ? '+' : '-';
    });
});

// 复制示例提示
const copyBtns = document.querySelectorAll('.copy-btn');

copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-text');
        
        try {
            await navigator.clipboard.writeText(text);
            btn.textContent = '✅ 已复制';
            setTimeout(() => {
                btn.textContent = '📋 复制';
            }, 2000);
        } catch (err) {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            btn.textContent = '✅ 已复制';
            setTimeout(() => {
                btn.textContent = '📋 复制';
            }, 2000);
        }
    });
});

// 教程卡片动画
const tutorialCards = document.querySelectorAll('.tutorial-card');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

tutorialCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// 提示卡片悬停效果
const tipCards = document.querySelectorAll('.tip-card');

tipCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

console.log('Learn page loaded!');
