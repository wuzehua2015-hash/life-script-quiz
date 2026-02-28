/**
 * ========================================
 * 人生剧本测试系统 v2.4 - 导航组件交互
 * Life Script Quiz - Navigation Component
 * ========================================
 */

(function() {
    'use strict';

    // ========================================
    // 配置
    // ========================================
    const CONFIG = {
        drawerWidth: 280,
        breakpoint: 768,
        animationDuration: 300
    };

    // ========================================
    // DOM 元素缓存
    // ========================================
    let elements = {};

    // ========================================
    // 初始化
    // ========================================
    function init() {
        cacheElements();
        bindEvents();
        highlightCurrentPage();
        initDropdowns();
        initAccordions();
    }

    // ========================================
    // 缓存 DOM 元素
    // ========================================
    function cacheElements() {
        elements = {
            nav: document.getElementById('main-nav'),
            hamburger: document.getElementById('nav-hamburger'),
            drawer: document.getElementById('nav-drawer'),
            overlay: document.getElementById('nav-overlay'),
            drawerClose: document.getElementById('nav-drawer-close'),
            dropdownToggles: document.querySelectorAll('.nav-dropdown-toggle'),
            accordionToggles: document.querySelectorAll('.nav-drawer-accordion-toggle'),
            navLinks: document.querySelectorAll('.nav-link[data-page], .nav-dropdown-link[data-page], .nav-drawer-link[data-page], .nav-drawer-sublink[data-page]')
        };
    }

    // ========================================
    // 绑定事件
    // ========================================
    function bindEvents() {
        // 汉堡菜单按钮
        if (elements.hamburger) {
            elements.hamburger.addEventListener('click', toggleDrawer);
        }

        // 抽屉关闭按钮
        if (elements.drawerClose) {
            elements.drawerClose.addEventListener('click', closeDrawer);
        }

        // 遮罩层点击
        if (elements.overlay) {
            elements.overlay.addEventListener('click', closeDrawer);
        }

        // ESC 键关闭抽屉
        document.addEventListener('keydown', handleKeyDown);

        // 窗口大小改变
        window.addEventListener('resize', handleResize);

        // 导航链接点击（手机端关闭抽屉）
        document.querySelectorAll('.nav-drawer-link, .nav-drawer-sublink').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < CONFIG.breakpoint) {
                    closeDrawer();
                }
            });
        });
    }

    // ========================================
    // 抽屉菜单控制
    // ========================================
    function toggleDrawer() {
        const isOpen = elements.drawer.getAttribute('aria-hidden') === 'false';
        if (isOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    }

    function openDrawer() {
        if (!elements.drawer || !elements.overlay || !elements.hamburger) return;

        elements.drawer.setAttribute('aria-hidden', 'false');
        elements.overlay.classList.add('active');
        elements.hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        // 聚焦到抽屉第一个可聚焦元素
        setTimeout(() => {
            const firstFocusable = elements.drawer.querySelector('button, a');
            if (firstFocusable) firstFocusable.focus();
        }, CONFIG.animationDuration);
    }

    function closeDrawer() {
        if (!elements.drawer || !elements.overlay || !elements.hamburger) return;

        elements.drawer.setAttribute('aria-hidden', 'true');
        elements.overlay.classList.remove('active');
        elements.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        // 返回焦点到汉堡按钮
        elements.hamburger.focus();
    }

    // ========================================
    // 下拉菜单控制 (PC端)
    // ========================================
    function initDropdowns() {
        elements.dropdownToggles.forEach(toggle => {
            // 点击事件（移动端/键盘导航）
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth < CONFIG.breakpoint) return;
                
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // 关闭其他下拉菜单
                elements.dropdownToggles.forEach(other => {
                    if (other !== this) {
                        other.setAttribute('aria-expanded', 'false');
                    }
                });
                
                this.setAttribute('aria-expanded', !isExpanded);
                e.stopPropagation();
            });

            // 键盘导航支持
            toggle.addEventListener('keydown', function(e) {
                const menu = this.nextElementSibling;
                const items = menu ? menu.querySelectorAll('.nav-dropdown-link') : [];
                
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        this.setAttribute('aria-expanded', 'true');
                        if (items.length > 0) items[0].focus();
                        break;
                    case 'Escape':
                        this.setAttribute('aria-expanded', 'false');
                        this.focus();
                        break;
                }
            });
        });

        // 点击外部关闭下拉菜单
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-dropdown')) {
                elements.dropdownToggles.forEach(toggle => {
                    toggle.setAttribute('aria-expanded', 'false');
                });
            }
        });

        // 下拉菜单项键盘导航
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            const items = menu.querySelectorAll('.nav-dropdown-link');
            
            items.forEach((item, index) => {
                item.addEventListener('keydown', function(e) {
                    switch(e.key) {
                        case 'ArrowDown':
                            e.preventDefault();
                            if (index < items.length - 1) items[index + 1].focus();
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            if (index > 0) items[index - 1].focus();
                            else menu.previousElementSibling.focus();
                            break;
                        case 'Escape':
                            menu.previousElementSibling.setAttribute('aria-expanded', 'false');
                            menu.previousElementSibling.focus();
                            break;
                    }
                });
            });
        });
    }

    // ========================================
    // 手风琴控制 (手机端抽屉)
    // ========================================
    function initAccordions() {
        elements.accordionToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const parent = this.closest('.nav-drawer-accordion');
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // 可选：关闭其他手风琴
                // elements.accordionToggles.forEach(other => {
                //     if (other !== this) {
                //         other.setAttribute('aria-expanded', 'false');
                //         other.closest('.nav-drawer-accordion').setAttribute('aria-expanded', 'false');
                //     }
                // });
                
                this.setAttribute('aria-expanded', !isExpanded);
                parent.setAttribute('aria-expanded', !isExpanded);
            });
        });
    }

    // ========================================
    // 当前页面高亮
    // ========================================
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const pageName = getPageName(currentPath);

        // 清除所有高亮
        document.querySelectorAll('.nav-link, .nav-dropdown-link, .nav-drawer-link, .nav-drawer-sublink').forEach(link => {
            link.classList.remove('active');
        });

        // 高亮当前页面
        elements.navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            const linkHref = link.getAttribute('href');
            
            // 首页特殊处理
            if (linkPage === 'index' && (pageName === 'index' || pageName === '')) {
                // 如果有hash，检查是否是测试区域
                if (currentHash === '#test' && linkHref.includes('#test')) {
                    link.classList.add('active');
                } else if (!currentHash && !linkHref.includes('#')) {
                    link.classList.add('active');
                }
            }
            // 其他页面
            else if (linkPage === pageName) {
                link.classList.add('active');
            }
        });
    }

    // ========================================
    // 获取页面名称
    // ========================================
    function getPageName(path) {
        // 移除开头的斜杠和结尾的 index.html
        let cleanPath = path.replace(/^\//, '').replace(/\/index\.html$/, '').replace(/\.html$/, '');
        
        // 获取最后一部分作为页面名
        const parts = cleanPath.split('/');
        return parts[parts.length - 1] || 'index';
    }

    // ========================================
    // 键盘事件处理
    // ========================================
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            // 关闭抽屉
            if (elements.drawer && elements.drawer.getAttribute('aria-hidden') === 'false') {
                closeDrawer();
            }
            // 关闭下拉菜单
            elements.dropdownToggles.forEach(toggle => {
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    }

    // ========================================
    // 窗口大小改变处理
    // ========================================
    function handleResize() {
        // 如果从手机切换到PC，关闭抽屉
        if (window.innerWidth >= CONFIG.breakpoint) {
            if (elements.drawer && elements.drawer.getAttribute('aria-hidden') === 'false') {
                closeDrawer();
            }
        }
    }

    // ========================================
    // 公共 API
    // ========================================
    window.LifeScriptNav = {
        openDrawer,
        closeDrawer,
        toggleDrawer,
        highlightCurrentPage,
        refresh: init
    };

    // ========================================
    // DOM 就绪后初始化
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
