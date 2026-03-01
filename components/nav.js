/**
 * ============================================
 * 人生剧本导航组件交互 - 哈利波特风格
 * 文件: components/nav.js
 * 版本: 2.4.2
 * 描述: 导航交互逻辑实现
 * ============================================
 */

(function() {
  'use strict';

  // ============================================
  // Navigation Module
  // ============================================
  const Navigation = {
    // DOM Elements
    elements: {},
    
    // State
    state: {
      isDrawerOpen: false,
      activeDropdown: null,
      currentPath: window.location.pathname
    },

    /**
     * Initialize navigation
     */
    init() {
      this.cacheElements();
      this.bindEvents();
      this.highlightCurrentPage();
      this.initDropdowns();
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
      this.elements = {
        hamburger: document.querySelector('.nav-hamburger'),
        drawer: document.getElementById('nav-drawer'),
        drawerOverlay: document.getElementById('nav-drawer-overlay'),
        drawerClose: document.querySelector('.nav-drawer-close'),
        dropdownToggles: document.querySelectorAll('.nav-dropdown-toggle'),
        dropdownMenus: document.querySelectorAll('.nav-dropdown-menu'),
        drawerSubmenuToggles: document.querySelectorAll('.nav-drawer-submenu-toggle'),
        drawerSubmenus: document.querySelectorAll('.nav-drawer-submenu'),
        menuItems: document.querySelectorAll('.nav-menu-item'),
        drawerItems: document.querySelectorAll('.nav-drawer-item'),
        searchInput: document.querySelector('.nav-search-input'),
        searchBtn: document.querySelector('.nav-search-btn')
      };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
      const { elements } = this;

      if (elements.hamburger) {
        elements.hamburger.addEventListener('click', () => this.toggleDrawer());
      }

      if (elements.drawerClose) {
        elements.drawerClose.addEventListener('click', () => this.closeDrawer());
      }

      if (elements.drawerOverlay) {
        elements.drawerOverlay.addEventListener('click', () => this.closeDrawer());
      }

      elements.drawerSubmenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => this.toggleDrawerSubmenu(e));
      });

      document.addEventListener('keydown', (e) => this.handleKeyboard(e));
      document.addEventListener('click', (e) => this.handleOutsideClick(e));

      if (elements.searchInput) {
        elements.searchInput.addEventListener('keypress', (e) => this.handleSearch(e));
      }
      if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', () => this.performSearch());
      }

      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => this.handleResize(), 250);
      });

      elements.dropdownToggles.forEach(toggle => {
        toggle.addEventListener('keydown', (e) => this.handleDropdownKeydown(e));
      });
    },

    /**
     * Initialize dropdown menus
     */
    initDropdowns() {
      const { dropdownToggles } = this.elements;
      
      dropdownToggles.forEach(toggle => {
        const parent = toggle.closest('.nav-has-dropdown');
        
        if (parent) {
          parent.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
              toggle.setAttribute('aria-expanded', 'true');
            }
          });
          
          parent.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
              toggle.setAttribute('aria-expanded', 'false');
            }
          });

          toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
              e.preventDefault();
              const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
              this.closeAllDropdowns();
              toggle.setAttribute('aria-expanded', !isExpanded);
            }
          });
        }
      });
    },

    /**
     * Toggle mobile drawer
     */
    toggleDrawer() {
      if (this.state.isDrawerOpen) {
        this.closeDrawer();
      } else {
        this.openDrawer();
      }
    },

    /**
     * Open mobile drawer
     */
    openDrawer() {
      const { drawer, drawerOverlay, hamburger } = this.elements;
      
      if (drawer && drawerOverlay) {
        drawer.classList.add('active');
        drawerOverlay.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        drawerOverlay.setAttribute('aria-hidden', 'false');
        
        if (hamburger) {
          hamburger.setAttribute('aria-expanded', 'true');
        }
        
        document.body.style.overflow = 'hidden';
        this.state.isDrawerOpen = true;
        
        const firstLink = drawer.querySelector('.nav-drawer-link');
        if (firstLink) {
          setTimeout(() => firstLink.focus(), 100);
        }
      }
    },

    /**
     * Close mobile drawer
     */
    closeDrawer() {
      const { drawer, drawerOverlay, hamburger } = this.elements;
      
      if (drawer && drawerOverlay) {
        drawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
        drawerOverlay.setAttribute('aria-hidden', 'true');
        
        if (hamburger) {
          hamburger.setAttribute('aria-expanded', 'false');
        }
        
        document.body.style.overflow = '';
        this.state.isDrawerOpen = false;
        this.closeAllDrawerSubmenus();
      }
    },

    /**
     * Toggle drawer submenu
     */
    toggleDrawerSubmenu(event) {
      const toggle = event.currentTarget;
      const submenuId = toggle.getAttribute('aria-controls');
      const submenu = document.getElementById(submenuId);
      
      if (submenu) {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        this.closeAllDrawerSubmenus();
        
        if (!isExpanded) {
          toggle.setAttribute('aria-expanded', 'true');
          submenu.classList.add('active');
        }
      }
    },

    /**
     * Close all drawer submenus
     */
    closeAllDrawerSubmenus() {
      const { drawerSubmenuToggles, drawerSubmenus } = this.elements;
      
      drawerSubmenuToggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
      
      drawerSubmenus.forEach(submenu => {
        submenu.classList.remove('active');
      });
    },

    /**
     * Close all dropdowns
     */
    closeAllDropdowns() {
      const { dropdownToggles } = this.elements;
      
      dropdownToggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    },

    /**
     * Handle keyboard navigation
     */
    handleKeyboard(event) {
      if (event.key === 'Escape') {
        if (this.state.isDrawerOpen) {
          this.closeDrawer();
        } else {
          this.closeAllDropdowns();
        }
      }
    },

    /**
     * Handle dropdown keyboard navigation
     */
    handleDropdownKeydown(event) {
      const toggle = event.currentTarget;
      const parent = toggle.closest('.nav-has-dropdown');
      const dropdown = parent ? parent.querySelector('.nav-dropdown-menu') : null;
      
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', !isExpanded);
          if (!isExpanded && dropdown) {
            const firstLink = dropdown.querySelector('.nav-dropdown-link');
            if (firstLink) setTimeout(() => firstLink.focus(), 50);
          }
          break;
          
        case 'ArrowDown':
          if (toggle.getAttribute('aria-expanded') === 'true' && dropdown) {
            event.preventDefault();
            const firstLink = dropdown.querySelector('.nav-dropdown-link');
            if (firstLink) firstLink.focus();
          }
          break;
          
        case 'Escape':
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
          break;
      }
    },

    /**
     * Handle clicks outside dropdowns
     */
    handleOutsideClick(event) {
      const { dropdownToggles } = this.elements;
      
      dropdownToggles.forEach(toggle => {
        const parent = toggle.closest('.nav-has-dropdown');
        if (parent && !parent.contains(event.target)) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    },

    /**
     * Handle search input
     */
    handleSearch(event) {
      if (event.key === 'Enter') {
        this.performSearch();
      }
    },

    /**
     * Perform search
     */
    performSearch() {
      const { searchInput } = this.elements;
      if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
          console.log('Search:', query);
          // Implement actual search logic here
          alert('搜索功能开发中: ' + query);
        }
      }
    },

    /**
     * Handle window resize
     */
    handleResize() {
      if (window.innerWidth > 768 && this.state.isDrawerOpen) {
        this.closeDrawer();
      }
      this.closeAllDropdowns();
    },

    /**
     * Highlight current page in navigation
     */
    highlightCurrentPage() {
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;
      
      // Highlight desktop menu items
      document.querySelectorAll('.nav-menu-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const linkPath = href.split('#')[0];
          const linkHash = href.includes('#') ? '#' + href.split('#')[1] : '';
          
          if (currentPath.includes(linkPath) || 
              (linkPath === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
            if (!href.includes('#') || currentHash === linkHash) {
              link.closest('.nav-menu-item')?.classList.add('active');
            }
          }
        }
      });
      
      // Highlight drawer items
      document.querySelectorAll('.nav-drawer-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const linkPath = href.split('#')[0];
          const linkHash = href.includes('#') ? '#' + href.split('#')[1] : '';
          
          if (currentPath.includes(linkPath) || 
              (linkPath === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
            if (!href.includes('#') || currentHash === linkHash) {
              link.closest('.nav-drawer-item')?.classList.add('active');
            }
          }
        }
      });
    }
  };

  // ============================================
  // Initialize when DOM is ready
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
  } else {
    Navigation.init();
  }

  // Expose to global scope for debugging
  window.Navigation = Navigation;

})();