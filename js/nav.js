/* ========================================
   人生剧本测试系统 v2.4 - 导航交互逻辑
   Life Script Quiz Navigation JavaScript
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // 导航状态管理
    // ========================================
    const NavState = {
        isDrawerOpen: false,
        activeDropdown: null,
        currentPage: null,

        init() {
            this.currentPage = this.detectCurrentPage();
            this.bindEvents();
            this.highlightCurrentPage();
            this.addBodyClass();
        },

        // 检测当前页面
        detectCurrentPage() {
            const path = window.location.pathname;
            const hash = window.location.hash;
            
            // 首页
            if (path.endsWith('index.html') || path.endsWith('/') || path === '') {
                return hash === '#start' ? 'quiz' : 'home';
            }
            
            // 子目录页面
            if (path.includes('/collection/')) return 'collection';
            if (path.includes('/achievements/')) return 'achievements';
            if (path.includes('/diary/')) return 'diary';
            if (path.includes('/mood/')) return 'mood';
            if (path.includes('/journey/')) return 'journey';
            if (path.includes('/guide/')) return 'guide';
            if (path.includes('/emergency/')) return 'emergency';
            if (path.includes('/resources/')) return 'resources';
            if (path.includes('/profile/')) return 'profile';
            
            return null;
        },

        // 绑定事件
        bindEvents() {
            // 汉堡按钮
            const hamburger = document.getElementById('nav-hamburger');
            if (hamburger) {
                hamburger.addEventListener('click', () => this.toggleDrawer());
            }

            // 关闭抽屉按钮
            const drawerClose = document.getElementById('drawer-close');
            if (drawerClose) {
                drawerClose.addEventListener('click', () => this.closeDrawer());
            }

            // 遮罩层点击
            const overlay = document.getElementById('nav-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => this.closeDrawer());
            }

            // 下拉菜单
            const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
            dropdownToggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => this.handleDropdownClick(e, toggle));
            });

            // 点击外部关闭下拉菜单
            document.addEventListener('click', (e) => this.handleOutsideClick(e));

            // ESC键关闭
            document.addEventListener('keydown', (e) => this.handleKeydown(e));

            // 窗口大小改变时重置状态
            window.addEventListener('resize', () => this.handleResize());

            // 抽屉链接点击后关闭抽屉
            const drawerLinks = document.querySelectorAll('.drawer-link');
            drawerLinks.forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(() => this.closeDrawer(), 100);
                });
            });
        },

        // 切换抽屉菜单
        toggleDrawer() {
            if (this.isDrawerOpen) {
                this.closeDrawer();
            } else {
                this.openDrawer();
            }
        },

        // 打开抽屉菜单
        openDrawer() {
            this.isDrawerOpen = true;
            
            const hamburger = document.getElementById('nav-hamburger');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('nav-overlay');
            
            if (hamburger) hamburger.classList.add('active');
            if (drawer) drawer.classList.add('active');
            if (overlay) overlay.classList.add('active');
            
            document.body.style.overflow = 'hidden';
            this.emitEvent('nav:drawerOpen');
        },

        // 关闭抽屉菜单
        closeDrawer() {
            this.isDrawerOpen = false;
            
            const hamburger = document.getElementById('nav-hamburger');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('nav-overlay');
            
            if (hamburger) hamburger.classList.remove('active');
            if (drawer) drawer.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            
            document.body.style.overflow = '';
            this.emitEvent('nav:drawerClose');
        },

        // 处理下拉菜单点击
        handleDropdownClick(e, toggle) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = toggle.closest('.nav-dropdown');
            
            if (this.activeDropdown === dropdown) {
                this.closeAllDropdowns();
                return;
            }
            
            this.closeAllDropdowns();
            
            this.activeDropdown = dropdown;
            dropdown.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
        },

        // 关闭所有下拉菜单
        closeAllDropdowns() {
            const dropdowns = document.querySelectorAll('.nav-dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.nav-dropdown-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
            this.activeDropdown = null;
        },

        // 处理外部点击
        handleOutsideClick(e) {
            if (!e.target.closest('.nav-dropdown')) {
                this.closeAllDropdowns();
            }
        },

        // 处理键盘事件
        handleKeydown(e) {
            if (e.key === 'Escape') {
                if (this.isDrawerOpen) {
                    this.closeDrawer();
                } else if (this.activeDropdown) {
                    this.closeAllDropdowns();
                }
            }
        },

        // 处理窗口大小改变
        handleResize() {
            if (window.innerWidth > 1024 && this.isDrawerOpen) {
                this.closeDrawer();
            }
        },

        // 高亮当前页面
        highlightCurrentPage() {
            if (!this.currentPage) return;
            
            const navLinks = document.querySelectorAll('.nav-link[data-page], .dropdown-link[data-page]');
            navLinks.forEach(link => {
                if (link.dataset.page === this.currentPage) {
                    link.classList.add('active');
                    
                    const dropdown = link.closest('.nav-dropdown');
                    if (dropdown) {
                        const parentLink = dropdown.querySelector('.nav-dropdown-toggle');
                        if (parentLink) {
                            parentLink.classList.add('active');
                        }
                    }
                }
            });
            
            const drawerLinks = document.querySelectorAll('.drawer-link[data-page]');
            drawerLinks.forEach(link => {
                if (link.dataset.page === this.currentPage) {
                    link.classList.add('active');
                }
            });
        },

        // 添加body类
        addBodyClass() {
            document.body.classList.add('has-nav');
        },

        // 触发自定义事件
        emitEvent(eventName, detail) {
            const event = new CustomEvent(eventName, { detail: detail || {} });
            document.dispatchEvent(event);
        }
    };

    // ========================================
    // 初始化
    // ========================================
    function initNav() {
        NavState.init();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNav);
    } else {
        // 如果DOM已加载，延迟执行以确保导航HTML已插入
        setTimeout(initNav, 0);
    }
    
    // 监听导航加载事件（用于动态加载导航组件后初始化）
    document.addEventListener('nav:loaded', () => {
        setTimeout(initNav, 0);
    });

    // 暴露全局API
    window.LifeScriptNav = {
        openDrawer: () => NavState.openDrawer(),
        closeDrawer: () => NavState.closeDrawer(),
        toggleDrawer: () => NavState.toggleDrawer(),
        closeAllDropdowns: () => NavState.closeAllDropdowns()
    };

})();
