/**
 * 资源推荐库 - UI组件
 * 资源展示、筛选、搜索等功能
 */

// ==================== 资源卡片渲染 ====================
const ResourceCard = {
    // 渲染单个资源卡片
    render(resource, showArchetype = false) {
        const typeInfo = RESOURCE_TYPES[resource.type] || RESOURCE_TYPES.book;
        const typeLabel = `
            <span class="resource-type-badge" style="background: ${typeInfo.color}20; color: ${typeInfo.color}">
                ${typeInfo.icon} ${typeInfo.name}
            </span>
        `;

        const authorLabel = resource.author ? `
            <div class="resource-author">
                <span class="author-label">作者：</span>
                <span class="author-name">${resource.author}</span>
            </div>
        ` : '';

        const sourceLabel = resource.source ? `
            <div class="resource-source">
                <span class="source-label">来源：</span>
                <span class="source-name">${resource.source}</span>
            </div>
        ` : '';

        const platformLabel = resource.platform ? `
            <div class="resource-platform">
                <span class="platform-label">平台：</span>
                <span class="platform-name">${resource.platform}</span>
            </div>
        ` : '';

        const tagsHtml = resource.tags ? `
            <div class="resource-tags">
                ${resource.tags.map(tag => `<span class="resource-tag">${tag}</span>`).join('')}
            </div>
        ` : '';

        const archetypeLabel = showArchetype && resource.archetypeName ? `
            <div class="resource-archetype">
                <span class="archetype-icon">${resource.archetypeIcon || '🔮'}</span>
                <span class="archetype-name">${resource.archetypeName}</span>
            </div>
        ` : '';

        return `
            <div class="resource-card" data-type="${resource.type}" data-id="${resource.id}">
                <div class="resource-header">
                    ${typeLabel}
                    ${archetypeLabel}
                </div>
                <h3 class="resource-title">${resource.title}</h3>
                ${authorLabel}
                ${sourceLabel}
                ${platformLabel}
                <p class="resource-description">${resource.description}</p>
                ${tagsHtml}
                <div class="resource-actions">
                    <a href="${resource.link}" target="_blank" rel="noopener noreferrer" class="btn-resource-link">
                        <span>🔗 查看资源</span>
                    </a>
                    <button class="btn-copy-link" data-link="${resource.link}" title="复制链接">
                        <span>📋</span>
                    </button>
                </div>
            </div>
        `;
    }
};

// ==================== 资源列表渲染 ====================
const ResourceList = {
    // 渲染资源列表
    render(containerId, resources, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (resources.length === 0) {
            container.innerHTML = this.renderEmpty();
            return;
        }

        const html = resources.map(r => ResourceCard.render(r, options.showArchetype)).join('');
        container.innerHTML = `<div class="resource-grid">${html}</div>`;

        // 绑定复制链接事件
        this.bindCopyEvents(container);
    },

    // 渲染空状态
    renderEmpty() {
        return `
            <div class="resource-empty">
                <div class="empty-icon">📭</div>
                <p class="empty-text">没有找到匹配的资源</p>
                <p class="empty-hint">试试其他筛选条件或搜索关键词</p>
            </div>
        `;
    },

    // 绑定复制链接事件
    bindCopyEvents(container) {
        const copyButtons = container.querySelectorAll('.btn-copy-link');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const link = e.currentTarget.dataset.link;
                navigator.clipboard.writeText(link).then(() => {
                    this.showToast('链接已复制到剪贴板');
                }).catch(() => {
                    this.showToast('复制失败，请手动复制');
                });
            });
        });
    },

    // 显示提示
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'resource-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
};

// ==================== 原型选择器 ====================
const ArchetypeSelector = {
    // 渲染原型选择器
    render(containerId, onSelect) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const archetypes = Object.values(ARCHETYPE_RESOURCES);
        
        const html = `
            <div class="archetype-selector">
                <button class="archetype-btn active" data-id="all">
                    <span class="archetype-btn-icon">🔮</span>
                    <span class="archetype-btn-name">全部</span>
                </button>
                ${archetypes.map(a => `
                    <button class="archetype-btn" data-id="${a.archetypeId}">
                        <span class="archetype-btn-icon">${a.archetypeIcon}</span>
                        <span class="archetype-btn-name">${a.archetypeName}</span>
                    </button>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;

        // 绑定点击事件
        const buttons = container.querySelectorAll('.archetype-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const archetypeId = btn.dataset.id;
                onSelect(archetypeId);
            });
        });
    }
};

// ==================== 类型筛选器 ====================
const TypeFilter = {
    // 渲染类型筛选器
    render(containerId, onFilter) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const types = Object.values(RESOURCE_TYPES);
        
        const html = `
            <div class="type-filter">
                <button class="type-btn active" data-type="all">
                    <span>全部</span>
                </button>
                ${types.map(t => `
                    <button class="type-btn" data-type="${t.id}" style="--type-color: ${t.color}">
                        <span class="type-icon">${t.icon}</span>
                        <span class="type-name">${t.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;

        // 绑定点击事件
        const buttons = container.querySelectorAll('.type-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const type = btn.dataset.type;
                onFilter(type);
            });
        });
    }
};

// ==================== 搜索组件 ====================
const ResourceSearch = {
    // 渲染搜索框
    render(containerId, onSearch) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const html = `
            <div class="resource-search">
                <input type="text" 
                       class="search-input" 
                       placeholder="搜索资源标题、作者、标签..."
                       id="resource-search-input">
                <button class="search-btn" id="resource-search-btn">
                    <span>🔍</span>
                </button>
            </div>
        `;

        container.innerHTML = html;

        // 绑定搜索事件
        const input = container.querySelector('#resource-search-input');
        const btn = container.querySelector('#resource-search-btn');

        const doSearch = () => {
            const query = input.value.trim();
            onSearch(query);
        };

        btn.addEventListener('click', doSearch);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') doSearch();
        });
        input.addEventListener('input', () => {
            if (input.value.trim() === '') {
                onSearch('');
            }
        });
    }
};

// ==================== 原型资源展示 ====================
const ArchetypeResourceSection = {
    // 渲染原型资源区块
    render(containerId, archetypeData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const resources = archetypeData.resources || [];
        const books = resources.filter(r => r.type === 'book');
        const articles = resources.filter(r => r.type === 'article');
        const videos = resources.filter(r => r.type === 'video');
        const podcasts = resources.filter(r => r.type === 'podcast');

        const renderSection = (title, icon, items) => {
            if (items.length === 0) return '';
            return `
                <div class="resource-section">
                    <h4 class="section-title">${icon} ${title}</h4>
                    <div class="resource-grid">
                        ${items.map(r => ResourceCard.render(r)).join('')}
                    </div>
                </div>
            `;
        };

        const html = `
            <div class="archetype-resource-section">
                <div class="archetype-header">
                    <span class="archetype-icon-large">${archetypeData.archetypeIcon}</span>
                    <div class="archetype-info">
                        <h2 class="archetype-name">${archetypeData.archetypeName}</h2>
                        <p class="growth-theme">${archetypeData.growthTheme}</p>
                    </div>
                </div>
                ${renderSection('推荐书籍', '📚', books)}
                ${renderSection('精选文章', '📝', articles)}
                ${renderSection('优质视频', '🎬', videos)}
                ${renderSection('播客节目', '🎧', podcasts)}
            </div>
        `;

        container.innerHTML = html;
        ResourceList.bindCopyEvents(container);
    }
};

// ==================== 推荐资源组件 ====================
const RecommendedResources = {
    // 渲染推荐资源（用于首页和个人中心）
    render(containerId, limit = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // 获取用户原型
        const testResult = JSON.parse(localStorage.getItem('lsq_testResult') || '{}');
        const userArchetypeId = testResult.archetype;

        let resources = [];
        let title = '推荐资源';
        let subtitle = '为你的成长精心挑选';

        if (userArchetypeId && ARCHETYPE_RESOURCES[userArchetypeId]) {
            const archetypeData = ARCHETYPE_RESOURCES[userArchetypeId];
            title = `${archetypeData.archetypeIcon} ${archetypeData.archetypeName}专属推荐`;
            subtitle = archetypeData.growthTheme;
            resources = archetypeData.resources.slice(0, limit);
        } else {
            resources = GENERAL_RESOURCES.resources.slice(0, limit);
        }

        const html = `
            <div class="recommended-resources">
                <div class="recommended-header">
                    <h3>${title}</h3>
                    <p class="recommended-subtitle">${subtitle}</p>
                </div>
                <div class="resource-grid compact">
                    ${resources.map(r => ResourceCard.render(r)).join('')}
                </div>
                <div class="recommended-footer">
                    <a href="resources/index.html" class="btn-view-all">
                        <span>查看全部资源 →</span>
                    </a>
                </div>
            </div>
        `;

        container.innerHTML = html;
        ResourceList.bindCopyEvents(container);
    }
};

// 导出（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ResourceCard,
        ResourceList,
        ArchetypeSelector,
        TypeFilter,
        ResourceSearch,
        ArchetypeResourceSection,
        RecommendedResources
    };
}
