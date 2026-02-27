// 行动指导系统主逻辑

(function() {
    'use strict';

    // 初始化
    function init() {
        // 首先检查是否有测试结果中的原型
        const testResult = localStorage.getItem('lsq_testResult');
        const savedArchetype = localStorage.getItem('lsq_selected_archetype');
        
        if (testResult) {
            try {
                const result = JSON.parse(testResult);
                if (result.archetype) {
                    // 有测试结果，自动选中该原型
                    localStorage.setItem('lsq_selected_archetype', result.archetype);
                    // 隐藏21天计划部分（预选时不需要显示）
                    hidePlanSection();
                    // 显示预选提示
                    showPreselectedArchetype(result.archetype);
                    // 绑定返回测试事件
                    bindBackLinkEvent();
                    return;
                }
            } catch (e) {
                console.error('解析测试结果失败:', e);
            }
        }
        
        // 没有测试结果，正常渲染选择界面
        renderArchetypeGrid();
        loadPlanStatus();
        bindEvents();
    }
    
    // 隐藏21天计划部分
    function hidePlanSection() {
        const planSection = document.querySelector('.plan-section');
        if (planSection) {
            planSection.style.display = 'none';
        }
    }
    
    // 绑定返回测试链接事件（单独提取，供预选场景使用）
    function bindBackLinkEvent() {
        const backLink = document.getElementById('back-link');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                const testResult = localStorage.getItem('lsq_testResult');
                if (testResult) {
                    e.preventDefault();
                    // 有测试结果，回到结果页
                    window.location.href = '../index.html#result';
                }
                // 没有结果，正常跳转到测试首页
            });
        }
    }
    
    // 显示预选中的原型
    function showPreselectedArchetype(archetypeKey) {
        const container = document.getElementById('archetype-grid')?.parentNode;
        if (!container || !window.GuidanceData) return;
        
        const archetypeData = GuidanceData.archetypes[archetypeKey];
        if (!archetypeData) {
            renderArchetypeGrid();
            return;
        }
        
        // 保存原始HTML以便恢复
        const originalHTML = container.innerHTML;
        
        // 显示预选提示和确认按钮
        container.innerHTML = `
            <div class="preselected-archetype" style="text-align: center; padding: 40px 20px;">
                <h3 style="color: #d4af37; margin-bottom: 20px;">🎯 你的专属人生剧本</h3>
                <div class="archetype-preview" style="background: rgba(212, 175, 55, 0.1); border-radius: 16px; padding: 30px; margin: 20px 0; border: 1px solid rgba(212, 175, 55, 0.3);">
                    <div style="font-size: 48px; margin-bottom: 15px;">${archetypeData.icon}</div>
                    <h2 style="color: #d4af37; margin-bottom: 10px;">${archetypeData.name}</h2>
                    <p style="color: #a0a0a0; margin-bottom: 20px;">${archetypeData.shortDesc}</p>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
                        <p style="color: #f5f5f5; margin: 0; font-size: 14px;"><strong>核心挑战：</strong>${archetypeData.challenge}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 30px;">
                    <button id="confirm-archetype-btn" class="btn-primary" style="padding: 12px 30px; font-size: 16px;">开始改变计划</button>
                    <button id="change-archetype-btn" class="btn-secondary" style="padding: 12px 30px; font-size: 16px; background: transparent; border: 1px solid #6a6a6a; color: #6a6a6a;">选择其他原型</button>
                </div>
            </div>
        `;
        
        // 绑定事件
        document.getElementById('confirm-archetype-btn')?.addEventListener('click', () => {
            window.location.href = 'detail.html';
        });
        
        document.getElementById('change-archetype-btn')?.addEventListener('click', () => {
            // 清除预选，恢复原始HTML并显示全部原型
            localStorage.removeItem('lsq_selected_archetype');
            container.innerHTML = originalHTML;
            // 恢复21天计划部分的显示
            const planSection = document.querySelector('.plan-section');
            if (planSection) {
                planSection.style.display = '';
            }
            renderArchetypeGrid();
            loadPlanStatus();
            bindEvents();
        });
    }

    // 渲染原型网格
    function renderArchetypeGrid() {
        const grid = document.getElementById('archetype-grid');
        if (!grid || !window.GuidanceData) return;

        const archetypes = GuidanceData.archetypes;
        
        grid.innerHTML = Object.entries(archetypes).map(([key, data]) => `
            <div class="archetype-card" data-archetype="${key}">
                <div class="icon">${data.icon}</div>
                <div class="name">${data.name}</div>
                <div class="desc">${data.shortDesc}</div>
            </div>
        `).join('');
    }

    // 加载计划状态
    function loadPlanStatus() {
        const statusEl = document.getElementById('plan-status');
        if (!statusEl) return;

        // 从localStorage读取
        const saved = localStorage.getItem('lsq_plan');
        if (saved) {
            const plan = JSON.parse(saved);
            const completed = plan.days.filter(d => d.completed).length;
            const total = plan.days.length;
            
            statusEl.innerHTML = `
                <p>📊 当前进度: ${completed}/${total} 天</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(completed/total*100)}%"></div>
                </div>
                <p style="margin-top: 10px; font-size: 14px;">
                    ${completed >= total ? '🎉 恭喜完成21天计划！' : '继续加油，改变正在发生'}
                </p>
            `;
        } else {
            statusEl.innerHTML = '<p style="color: #6a6a6a;">还没有开始21天计划</p>';
        }
    }

    // 绑定事件
    function bindEvents() {
        // 原型卡片点击
        const grid = document.getElementById('archetype-grid');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const card = e.target.closest('.archetype-card');
                if (card) {
                    const archetype = card.dataset.archetype;
                    showArchetypeDetail(archetype);
                }
            });
        }

        // 开始计划按钮
        const startBtn = document.getElementById('start-plan-btn');
        if (startBtn) {
            startBtn.addEventListener('click', start21DayPlan);
        }
        
        // 返回测试链接
        bindBackLinkEvent();
    }

    // 显示原型详情
    function showArchetypeDetail(archetypeKey) {
        // 保存选择并跳转到详情页
        localStorage.setItem('lsq_selected_archetype', archetypeKey);
        window.location.href = 'detail.html';
    }

    // 开始21天计划
    function start21DayPlan() {
        const archetype = localStorage.getItem('lsq_selected_archetype');
        if (!archetype) {
            alert('请先选择你的人生剧本原型');
            return;
        }

        // 创建计划
        const plan = {
            archetype: archetype,
            startDate: new Date().toISOString(),
            days: Array.from({length: 21}, (_, i) => ({
                day: i + 1,
                completed: false,
                date: null
            }))
        };

        localStorage.setItem('lsq_plan', JSON.stringify(plan));
        
        alert('21天计划已创建！\n\n每天完成一个小任务，逐步改变你的人生剧本。');
        loadPlanStatus();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
