document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    // 导航点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 滚动监听函数
    function updateActiveSection() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        // 更新导航栏激活状态
        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 添加滚动事件监听
    window.addEventListener('scroll', updateActiveSection);
    // 初始化时也要调用一次
    updateActiveSection();

    // 打字效果
    const roles = ['动漫(不一定)', '龙珠', '睡觉'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedElement = document.querySelector('.typed');
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typedElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, newTextDelay);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(type, isDeleting ? erasingDelay : typingDelay);
        }
    }

    // 启动打字效果
    setTimeout(type, newTextDelay);

    // 获取博客文章
    async function fetchBlogPosts() {
        try {
            const response = await fetch('/hq.json');
            const result = await response.json();
            
            const blogGrid = document.getElementById('blogPosts');
            blogGrid.innerHTML = ''; // 清除加载动画
            
            if (!result.success) {
                throw new Error(result.message || '获取数据失败');
            }
            
            if (!result.data || result.data.length === 0) {
                blogGrid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-info-circle"></i>
                        暂无博客文章
                    </div>
                `;
                return;
            }
            
            // 只获取最新的9篇文章
            const recentPosts = result.data
                .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
                .slice(0, 9);
            
            recentPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'blog-post';
                
                // 修复链接中的转义字符
                const link = post.link.replace(/\\\//g, '/');
                
                const date = new Date(post.pubDate);
                const formattedDate = date.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <div class="post-meta">
                        <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="far fa-user"></i> ${post.author}</span>
                    </div>
                    <p class="post-description">${post.description}</p>
                    <a href="${link}" target="_blank" class="read-more">
                        阅读全文 <i class="fas fa-arrow-right"></i>
                    </a>
                `;
                
                blogGrid.appendChild(postElement);
            });
        } catch (error) {
            console.error('获取博客文章失败:', error);
            const blogGrid = document.getElementById('blogPosts');
            blogGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    ${error.message || '加载博客文章失败，请稍后重试'}
                </div>
            `;
        }
    }

    // 在页面加载完成后获取博客文章
    fetchBlogPosts();

    // 汉堡菜单交互
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const mobileNavLinks = document.querySelectorAll('nav ul li a');
    
    // 点击汉堡菜单图标切换导航菜单显示
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // 点击导航链接关闭菜单
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(event) {
        const isMenuToggle = event.target.closest('.menu-toggle');
        const isNavMenu = event.target.closest('nav ul');
        
        if (!isMenuToggle && !isNavMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
}); 