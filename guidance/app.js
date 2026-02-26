// 行动指导系统主逻辑

(function() {
    'use strict';

    // 初始化
    function init() {
        renderArchetypeGrid();
        loadPlanStatus();
        bindEvents();
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
    }

    // 显示原型详情
    function showArchetypeDetail(archetypeKey) {
        const data = window.GuidanceData?.archetypes?.[archetypeKey];
        if (!data) return;

        // 保存选择
        localStorage.setItem('lsq_selected_archetype', archetypeKey);

        // 跳转到详情页（或显示模态框）
        alert(`选择了：${data.name}\n\n核心挑战：${data.challenge}\n\n改变策略：\n${data.strategy.map(s => '• ' + s).join('\n')}`);
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
