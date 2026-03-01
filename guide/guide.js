/**
 * 情境化应对指南 - 主逻辑
 * 从知道到做到的桥梁
 */

(function() {
    'use strict';

    // 当前状态
    let currentState = {
        archetype: null,
        scenario: null
    };

    // 初始化
    function init() {
        console.log('[Guide] 初始化开始...');
        
        // 延迟检查 GuideData，确保数据文件已加载
        if (!window.GuideData) {
            console.log('[Guide] GuideData 未立即加载，等待100ms后重试...');
            setTimeout(() => {
                if (!window.GuideData) {
                    console.error('[Guide] GuideData 加载失败');
                    showDataError();
                    return;
                }
                console.log('[Guide] GuideData 延迟加载成功');
                continueInit();
            }, 100);
            return;
        }
        
        console.log('[Guide] GuideData 立即加载成功');
        continueInit();
    }
    
    // 继续初始化
    function continueInit() {
        console.log('[Guide] GuideData 可用，继续初始化', Object.keys(window.GuideData));

        // 检查是否有测试结果中的原型
        const testResult = localStorage.getItem('lsq_testResult');
        
        if (testResult) {
            try {
                const result = JSON.parse(testResult);
                if (result.archetype) {
                    currentState.archetype = result.archetype;
                    console.log('[Guide] 从测试结果获取原型:', result.archetype);
                }
            } catch (e) {
                console.error('[Guide] 解析测试结果失败:', e);
            }
        }

        // 检查URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const archetypeParam = urlParams.get('archetype');
        const scenarioParam = urlParams.get('scenario');
        
        if (archetypeParam) {
            currentState.archetype = archetypeParam;
            console.log('[Guide] 从URL参数获取原型:', archetypeParam);
        }
        if (scenarioParam) {
            currentState.scenario = scenarioParam;
        }

        // 检查 localStorage 中是否有选中的原型
        const savedArchetype = localStorage.getItem('lsq_selected_archetype');
        if (savedArchetype && !currentState.archetype) {
            currentState.archetype = savedArchetype;
            console.log('[Guide] 从localStorage获取原型:', savedArchetype);
        }

        // 验证原型数据是否存在
        if (currentState.archetype && !window.GuideData.archetypes[currentState.archetype]) {
            console.error('[Guide] 原型数据不存在:', currentState.archetype);
            currentState.archetype = null;
            localStorage.removeItem('lsq_selected_archetype');
        }

        // 根据状态渲染页面
        if (currentState.archetype && currentState.scenario) {
            // 直接显示策略
            showStrategy(currentState.archetype, currentState.scenario);
        } else if (currentState.archetype) {
            // 显示场景选择
            console.log('[Guide] 显示场景选择，原型:', currentState.archetype);
            showScenarioSelection(currentState.archetype);
        } else {
            // 显示原型选择
            console.log('[Guide] 显示原型选择');
            renderArchetypeGrid();
        }

        // 加载收藏
        loadFavorites();

        // 绑定事件
        bindEvents();
        
        console.log('[Guide] 初始化完成');
    }
    
    // 显示数据加载错误
    function showDataError() {
        const container = document.querySelector('.guide-main .container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                    <h2 style="color: #d4af37; margin-bottom: 15px;">数据加载失败</h2>
                    <p style="color: #6a6a6a; margin-bottom: 30px;">无法加载应对指南数据，请刷新页面重试</p>
                    <button onclick="location.reload()" class="btn-primary">刷新页面</button>
                </div>
            `;
        }
    }

    // 渲染原型网格
    function renderArchetypeGrid() {
        const grid = document.getElementById('archetype-grid');
        if (!grid || !window.GuideData) return;

        const archetypes = window.GuideData.archetypes;
        
        grid.innerHTML = Object.entries(archetypes).map(([key, data]) => `
            <div class="archetype-card" data-archetype="${key}">
                <div class="archetype-icon">${data.icon}</div>
                <div class="archetype-name">${data.name}</div>
                <div class="archetype-desc">${data.shortDesc}</div>
                <div class="archetype-pattern">
                    <span class="pattern-label">核心模式：</span>
                    <span class="pattern-text">${data.corePattern}</span>
                </div>
            </div>
        `).join('');

        // 绑定点击事件
        grid.querySelectorAll('.archetype-card').forEach(card => {
            card.addEventListener('click', () => {
                const archetype = card.dataset.archetype;
                showScenarioSelection(archetype);
            });
        });
    }

    // 显示场景选择
    function showScenarioSelection(archetypeKey) {
        console.log('[Guide] 显示场景选择:', archetypeKey);
        currentState.archetype = archetypeKey;
        
        // 保存到 localStorage
        localStorage.setItem('lsq_selected_archetype', archetypeKey);
        
        const archetypeSection = document.getElementById('archetype-section');
        const scenarioSection = document.getElementById('scenario-section');
        const strategySection = document.getElementById('strategy-section');
        
        if (archetypeSection) archetypeSection.style.display = 'none';
        if (strategySection) strategySection.style.display = 'none';
        if (scenarioSection) scenarioSection.style.display = 'block';

        // 显示已选中原型
        const selectedArchetypeEl = document.getElementById('selected-archetype');
        
        if (!window.GuideData || !window.GuideData.archetypes) {
            console.error('[Guide] GuideData 未加载，无法显示原型信息');
            showDataError();
            return;
        }
        
        const archetypeData = window.GuideData.archetypes[archetypeKey];
        
        if (!archetypeData) {
            console.error('[Guide] 原型数据不存在:', archetypeKey);
            // 回退到原型选择
            if (archetypeSection) archetypeSection.style.display = 'block';
            if (scenarioSection) scenarioSection.style.display = 'none';
            renderArchetypeGrid();
            return;
        }
        
        if (selectedArchetypeEl) {
            selectedArchetypeEl.innerHTML = `
                <div class="selected-info">
                    <span class="selected-icon">${archetypeData.icon}</span>
                    <div class="selected-text">
                        <span class="selected-label">已选择：</span>
                        <span class="selected-name">${archetypeData.name}</span>
                    </div>
                    <button class="btn-change" id="change-archetype-btn">更换</button>
                </div>
            `;
            
            // 绑定更换按钮
            document.getElementById('change-archetype-btn')?.addEventListener('click', () => {
                currentState.archetype = null;
                currentState.scenario = null;
                localStorage.removeItem('lsq_selected_archetype');
                archetypeSection.style.display = 'block';
                scenarioSection.style.display = 'none';
                renderArchetypeGrid();
            });
        }

        // 渲染场景网格
        renderScenarioGrid();
        
        // 滚动到场景区域
        scenarioSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 渲染场景网格
    function renderScenarioGrid() {
        console.log('[Guide] 渲染场景网格');
        const grid = document.getElementById('scenario-grid');
        if (!grid) {
            console.error('[Guide] 找不到 scenario-grid 元素');
            return;
        }
        
        if (!window.GuideData || !window.GuideData.scenarios) {
            console.error('[Guide] GuideData.scenarios 未加载');
            grid.innerHTML = '<div style="text-align: center; padding: 40px; color: #ff6b6b;">场景数据加载失败，请刷新页面重试</div>';
            return;
        }

        const scenarios = window.GuideData.scenarios;
        console.log('[Guide] 场景数据:', Object.keys(scenarios));
        
        try {
            const html = Object.entries(scenarios).map(([key, data]) => `
                <div class="scenario-card" data-scenario="${key}" style="--scenario-color: ${data.color}">
                    <div class="scenario-icon" style="background: ${data.color}20; color: ${data.color}">
                        ${data.icon}
                    </div>
                    <div class="scenario-name">${data.name}</div>
                    <div class="scenario-desc">${data.desc}</div>
                    <div class="scenario-examples">
                        ${data.examples.map(ex => `<span class="example-tag">${ex}</span>`).join('')}
                    </div>
                </div>
            `).join('');
            
            grid.innerHTML = html;
            console.log('[Guide] 场景网格渲染完成，共', Object.keys(scenarios).length, '个场景');

            // 绑定点击事件
            grid.querySelectorAll('.scenario-card').forEach(card => {
                card.addEventListener('click', () => {
                    const scenario = card.dataset.scenario;
                    console.log('[Guide] 选择场景:', scenario);
                    showStrategy(currentState.archetype, scenario);
                });
            });
        } catch (e) {
            console.error('[Guide] 渲染场景网格失败:', e);
            grid.innerHTML = '<div style="text-align: center; padding: 40px; color: #ff6b6b;">场景渲染失败，请刷新页面重试</div>';
        }
    }

    // 显示应对策略
    function showStrategy(archetypeKey, scenarioKey) {
        currentState.archetype = archetypeKey;
        currentState.scenario = scenarioKey;
        
        const scenarioSection = document.getElementById('scenario-section');
        const strategySection = document.getElementById('strategy-section');
        
        if (scenarioSection) scenarioSection.style.display = 'none';
        if (strategySection) strategySection.style.display = 'block';

        const strategyData = window.GuideData.strategies[archetypeKey]?.[scenarioKey];
        const archetypeData = window.GuideData.archetypes[archetypeKey];
        const scenarioData = window.GuideData.scenarios[scenarioKey];
        
        if (!strategyData || !archetypeData || !scenarioData) {
            showToast('数据加载失败，请刷新重试');
            return;
        }

        // 渲染策略头部
        const headerEl = document.getElementById('strategy-header');
        if (headerEl) {
            headerEl.innerHTML = `
                <div class="strategy-breadcrumb">
                    <span class="breadcrumb-item" data-action="back-archetype">${archetypeData.name}</span>
                    <span class="breadcrumb-separator">/</span>
                    <span class="breadcrumb-item" data-action="back-scenario">${scenarioData.name}</span>
                </div>
                <h2 class="strategy-title" style="color: ${scenarioData.color}">${strategyData.title}</h2>
                
                <div class="strategy-danger">
                    <span class="danger-icon">⚠️</span>
                    <span class="danger-text">${strategyData.danger}</span>
                </div>
            `;
            
            // 绑定面包屑导航
            headerEl.querySelector('[data-action="back-archetype"]')?.addEventListener('click', () => {
                currentState.archetype = null;
                currentState.scenario = null;
                document.getElementById('archetype-section').style.display = 'block';
                strategySection.style.display = 'none';
                renderArchetypeGrid();
            });
            
            headerEl.querySelector('[data-action="back-scenario"]')?.addEventListener('click', () => {
                currentState.scenario = null;
                scenarioSection.style.display = 'block';
                strategySection.style.display = 'none';
            });
        }

        // 渲染策略内容
        const contentEl = document.getElementById('strategy-content');
        if (contentEl) {
            contentEl.innerHTML = `
                <!-- 核心原则 -->
                <div class="strategy-principles">
                    <h3>🎯 核心原则</h3>
                    <ul>
                        ${strategyData.principles.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
                
                <!-- 应对步骤 -->
                <div class="strategy-steps">
                    <h3>📋 应对步骤</h3>
                    <div class="steps-list">
                        ${strategyData.steps.map((step, index) => `
                            <div class="step-card" style="--step-color: ${scenarioData.color}">
                                <div class="step-number" style="background: ${scenarioData.color}">${step.step}</div>
                                <div class="step-content">
                                    <h4>${step.title}</h4>
                                    <p class="step-desc">${step.desc}</p>
                                    <div class="step-action">
                                        <span class="action-label">💡 行动建议：</span>
                                        <span class="action-text">${step.action}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 肯定语句 -->
                <div class="strategy-affirmations">
                    <h3>✨ 每日肯定</h3>
                    <div class="affirmations-list">
                        ${strategyData.affirmations.map(a => `
                            <div class="affirmation-card" style="background: ${scenarioData.color}15; border-left-color: ${scenarioData.color}">
                                <span class="affirmation-icon">💫</span>
                                <span class="affirmation-text">${a}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 紧急提醒 -->
                <div class="strategy-emergency" style="background: ${scenarioData.color}10; border-color: ${scenarioData.color}40">
                    <span class="emergency-icon">🆘</span>
                    <div class="emergency-content">
                        <strong>紧急提醒</strong>
                        <p>${strategyData.emergency}</p>
                    </div>
                </div>
            `;
        }

        // 更新收藏按钮状态
        updateFavoriteButton();
        
        // 滚动到策略区域
        strategySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 绑定事件
    function bindEvents() {
        // 返回场景选择按钮
        document.getElementById('back-scenario-btn')?.addEventListener('click', () => {
            currentState.scenario = null;
            document.getElementById('scenario-section').style.display = 'block';
            document.getElementById('strategy-section').style.display = 'none';
        });

        // 收藏按钮
        document.getElementById('favorite-btn')?.addEventListener('click', toggleFavorite);

        // 分享按钮
        document.getElementById('share-strategy-btn')?.addEventListener('click', shareStrategy);
        
        // 重置选择按钮 - 使用 querySelectorAll 绑定所有重置按钮
        document.querySelectorAll('#reset-selection-btn').forEach(btn => {
            btn.addEventListener('click', resetSelection);
        });
    }
    
    // 重置选择
    function resetSelection() {
        console.log('[Guide] 重置选择');
        currentState.archetype = null;
        currentState.scenario = null;
        localStorage.removeItem('lsq_selected_archetype');
        
        // 显示原型选择，隐藏其他部分
        const archetypeSection = document.getElementById('archetype-section');
        const scenarioSection = document.getElementById('scenario-section');
        const strategySection = document.getElementById('strategy-section');
        
        if (archetypeSection) archetypeSection.style.display = 'block';
        if (scenarioSection) scenarioSection.style.display = 'none';
        if (strategySection) strategySection.style.display = 'none';
        
        renderArchetypeGrid();
        showToast('已重置选择');
    }

    // 切换收藏
    function toggleFavorite() {
        if (!currentState.archetype || !currentState.scenario) return;
        
        const favorites = getFavorites();
        const key = `${currentState.archetype}-${currentState.scenario}`;
        const index = favorites.findIndex(f => f.key === key);
        
        if (index > -1) {
            // 取消收藏
            favorites.splice(index, 1);
            saveFavorites(favorites);
            updateFavoriteButton();
            showToast('已取消收藏');
        } else {
            // 添加收藏
            const archetypeData = window.GuideData.archetypes[currentState.archetype];
            const scenarioData = window.GuideData.scenarios[currentState.scenario];
            const strategyData = window.GuideData.strategies[currentState.archetype][currentState.scenario];
            
            favorites.push({
                key: key,
                archetype: currentState.archetype,
                scenario: currentState.scenario,
                archetypeName: archetypeData.name,
                scenarioName: scenarioData.name,
                title: strategyData.title,
                danger: strategyData.danger,
                addedAt: new Date().toISOString()
            });
            
            saveFavorites(favorites);
            updateFavoriteButton();
            loadFavorites();
            showToast('已收藏到"我的收藏"');
        }
    }

    // 更新收藏按钮状态
    function updateFavoriteButton() {
        const btn = document.getElementById('favorite-btn');
        if (!btn || !currentState.archetype || !currentState.scenario) return;
        
        const favorites = getFavorites();
        const key = `${currentState.archetype}-${currentState.scenario}`;
        const isFavorited = favorites.some(f => f.key === key);
        
        btn.innerHTML = `
            <span class="favorite-icon">${isFavorited ? '❤️' : '🤍'}</span>
            <span class="favorite-text">${isFavorited ? '已收藏' : '收藏此建议'}</span>
        `;
        btn.classList.toggle('favorited', isFavorited);
    }

    // 获取收藏列表
    function getFavorites() {
        try {
            const data = localStorage.getItem('lsq_guideFavorites');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // 保存收藏列表
    function saveFavorites(favorites) {
        localStorage.setItem('lsq_guideFavorites', JSON.stringify(favorites));
    }

    // 加载收藏
    function loadFavorites() {
        const container = document.getElementById('favorites-list');
        if (!container) return;
        
        const favorites = getFavorites();
        
        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-favorites">
                    <span class="empty-icon">📭</span>
                    <p>还没有收藏任何建议</p>
                    <p class="empty-hint">浏览应对策略时，点击收藏按钮保存有用的建议</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = favorites.map(fav => {
            const scenarioData = window.GuideData.scenarios[fav.scenario];
            return `
                <div class="favorite-item" data-key="${fav.key}" style="--fav-color: ${scenarioData?.color || '#d4af37'}">
                    <div class="favorite-header">
                        <span class="fav-archetype">${fav.archetypeName}</span>
                        <span class="fav-scenario" style="background: ${scenarioData?.color || '#d4af37'}20; color: ${scenarioData?.color || '#d4af37'}">${fav.scenarioName}</span>
                    </div>
                    <h4 class="fav-title">${fav.title}</h4>
                    <p class="fav-danger">⚠️ ${fav.danger}</p>
                    
                    <div class="fav-actions">
                        <button class="btn-view" data-archetype="${fav.archetype}" data-scenario="${fav.scenario}">查看</button>
                        <button class="btn-remove" data-key="${fav.key}">删除</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // 绑定收藏项事件
        container.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const archetype = btn.dataset.archetype;
                const scenario = btn.dataset.scenario;
                showStrategy(archetype, scenario);
            });
        });
        
        container.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                removeFavorite(key);
            });
        });
    }

    // 删除收藏
    function removeFavorite(key) {
        const favorites = getFavorites();
        const index = favorites.findIndex(f => f.key === key);
        
        if (index > -1) {
            favorites.splice(index, 1);
            saveFavorites(favorites);
            loadFavorites();
            updateFavoriteButton();
            showToast('已删除收藏');
        }
    }

    // 分享策略
    function shareStrategy() {
        if (!currentState.archetype || !currentState.scenario) return;
        
        const archetypeData = window.GuideData.archetypes[currentState.archetype];
        const scenarioData = window.GuideData.scenarios[currentState.scenario];
        const strategyData = window.GuideData.strategies[currentState.archetype][currentState.scenario];
        
        const shareText = `【${strategyData.title}】\n\n` +
            `📍 适用场景：${scenarioData.name}\n` +
            `👤 针对原型：${archetypeData.name}\n\n` +
            `🎯 核心原则：\n${strategyData.principles.map(p => `• ${p}`).join('\n')}\n\n` +
            `⚠️ 特别提醒：${strategyData.danger}\n\n` +
            `来自：人生剧本测试 - 情境化应对指南`;
        
        if (navigator.share) {
            navigator.share({
                title: strategyData.title,
                text: shareText,
                url: window.location.href
            }).catch(() => {
                // 用户取消分享
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(shareText).then(() => {
                showToast('分享内容已复制到剪贴板');
            }).catch(() => {
                showToast('复制失败，请手动复制');
            });
        }
    }

    // 显示提示消息
    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
