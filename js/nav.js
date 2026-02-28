/**
 * ========================================
 * 人生剧本测试系统 v2.4 - 导航组件交互逻辑
 * Life Script Quiz Navigation Component JS
 * ========================================
 */

(function() {
    'use strict';

    // DOM 元素引用
    const elements = {
        hamburger: document.getElementById('nav-hamburger'),
        drawer: document.getElementById('nav-drawer'),
        overlay: document.getElementById('nav-overlay'),
        drawerClose: document.getElementById('drawer-close'),
        dropdowns: document.querySelectorAll('.nav-dropdown'),
        navLinks: document.querySelectorAll('.nav-link[data-page], .drawer-link[data-page]'),
        dropdownToggles: document.querySelectorAll('.nav-dropdown-toggle')
    };

    // 状态管理
    const state = {
        drawerOpen: false,
        activeDropdown: null
    };

    /**
     * 初始化导航组件
     */
    function init() {
        bindEvents();
        highlightCurrentPage();
        addBodyClass();
    }

    /**
     * 绑定事件处理器
     */
    function bindEvents() {
        // 汉堡菜单点击 - 打开抽屉
        if (elements.hamburger) {
            elements.hamburger.addEventListener('click', openDrawer);
        }

        // 抽屉关闭按钮
        if (elements.drawerClose) {
            elements.drawerClose.addEventListener('click', closeDrawer);
        }

        // 遮罩层点击 - 关闭抽屉
        if (elements.overlay) {
            elements.overlay.addEventListener('click', closeAllMenus);
        }

        // 下拉菜单交互
        elements.dropdownToggles.forEach(toggle => {
            // 点击展开/收起
            toggle.addEventListener('click', handleDropdownToggle);
            
            // 悬停展开（仅PC端）
            toggle.addEventListener('mouseenter', handleDropdownHover);
        });

        // 下拉菜单容器悬停保持展开
        elements.dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseleave', handleDropdownLeave);
        });

        // ESC键关闭菜单
        document.addEventListener('keydown', handleKeyDown);

        // 点击页面其他区域关闭菜单
        document.addEventListener('click', handleDocumentClick);

        // 窗口大小改变时重置状态
        window.addEventListener('resize', handleResize);
    }

    /**
     * 打开抽屉菜单
     */
    function openDrawer() {
        state.drawerOpen = true;
        elements.hamburger?.classList.add('active');
        elements.drawer?.classList.add('active');
        elements.overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * 关闭抽屉菜单
     */
    function closeDrawer() {
        state.drawerOpen = false;
        elements.hamburger?.classList.remove('active');
        elements.drawer?.classList.remove('active');
        elements.overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * 关闭所有菜单（抽屉和下拉）
     */
    function closeAllMenus() {
        closeDrawer();
        closeAllDropdowns();
    }

    /**
     * 处理下拉菜单点击切换
     */
    function handleDropdownToggle(e) {
        e.preventDefault();
        e.stopPropagation();

        const dropdown = this.closest('.nav-dropdown');
        const isActive = dropdown.classList.contains('active');

        // 关闭其他下拉菜单
        closeAllDropdowns();

        // 切换当前下拉菜单
        if (!isActive) {
            dropdown.classList.add('active');
            this.setAttribute('aria-expanded', 'true');
            state.activeDropdown = dropdown;
        }
    }

    /**
     * 处理下拉菜单悬停展开（PC端）
     */
    function handleDropdownHover() {
        // 仅在非触摸设备上启用悬停效果
        if (window.matchMedia('(hover: hover)').matches) {
            const dropdown = this.closest('.nav-dropdown');
            closeAllDropdowns();
            dropdown.classList.add('active');
            this.setAttribute('aria-expanded', 'true');
            state.activeDropdown = dropdown;
        }
    }

    /**
     * 处理下拉菜单离开
     */
    function handleDropdownLeave() {
        // 仅在非触摸设备上启用悬停效果
        if (window.matchMedia('(hover: hover)').matches) {
            closeAllDropdowns();
        }
    }

    /**
     * 关闭所有下拉菜单
     */
    function closeAllDropdowns() {
        elements.dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
        state.activeDropdown = null;
    }

    /**
     * 处理键盘事件
     */
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeAllMenus();
        }
    }

    /**
     * 处理文档点击事件（点击外部关闭）
     */
    function handleDocumentClick(e) {
        // 如果点击的不是下拉菜单内部，关闭所有下拉菜单
        const isDropdownClick = e.target.closest('.nav-dropdown');
        if (!isDropdownClick) {
            closeAllDropdowns();
        }
    }

    /**
     * 处理窗口大小改变
     */
    function handleResize() {
        // 如果窗口扩大到桌面尺寸，关闭移动端抽屉
        if (window.innerWidth > 1024 && state.drawerOpen) {
            closeDrawer();
        }
    }

    /**
     * 高亮当前页面导航项
     */
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        // 获取当前页面标识
        const currentPage = getCurrentPageIdentifier(currentPath, currentHash);

        // 高亮导航链接
        elements.navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * 获取当前页面标识符
     */
    function getCurrentPageIdentifier(path, hash) {
        // 首页
        if (path === '/' || path.endsWith('/index.html') || path.endsWith('/')) {
            if (hash === '#start') {
                return 'quiz';
            }
            return 'home';
        }

        // 根据路径判断页面
        const pathMap = {
            '/collection/': 'collection',
            '/achievements/': 'achievements',
            '/diary/': 'diary',
            '/mood/': 'mood',
            '/journey/': 'journey',
            '/guide/': 'guide',
            '/emergency/': 'emergency',
            '/resources/': 'resources',
            '/profile/': 'profile'
        };

        for (const [key, value] of Object.entries(pathMap)) {
            if (path.includes(key)) {
                return value;
            }
        }

        return null;
    }

    /**
     * 为 body 添加导航类
     */
    function addBodyClass() {
        document.body.classList.add('has-nav');
    }

    // 暴露全局 API
    window.NavComponent = {
        openDrawer,
        closeDrawer,
        closeAllMenus,
        closeAllDropdowns,
        refresh: highlightCurrentPage
    };

    // DOM 就绪后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
