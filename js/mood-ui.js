/**
 * 情绪追踪UI组件
 * 情绪选择器、趋势图表、打卡组件
 */

(function() {
    'use strict';

    // 渲染情绪选择器（5级量表）
    function renderMoodSelector(container, options = {}) {
        const selectedLevel = options.selectedLevel || null;
        const onSelect = options.onSelect || (() => {});

        let html = '<div class="mood-selector">';
        html += '<div class="mood-selector-title">今天感觉如何？</div>';
        html += '<div class="mood-levels">';

        MoodService.MOOD_LEVELS.forEach(mood => {
            const isSelected = selectedLevel === mood.level;
            html += `
                <div class="mood-level-option ${isSelected ? 'selected' : ''}" 
                     data-level="${mood.level}"
                     style="--mood-color: ${mood.color}">
                    <div class="mood-emoji">${mood.emoji}</div>
                    <div class="mood-name">${mood.name}</div>
                    <div class="mood-desc">${mood.desc}</div>
                </div>
            `;
        });

        html += '</div></div>';
        container.innerHTML = html;

        // 绑定选择事件
        container.querySelectorAll('.mood-level-option').forEach(option => {
            option.addEventListener('click', () => {
                const level = parseInt(option.dataset.level);
                container.querySelectorAll('.mood-level-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                onSelect(level);
            });
        });
    }

    // 渲染触发点选择器
    function renderTriggerSelector(container, options = {}) {
        const selectedTriggers = options.selectedTriggers || [];
        const onChange = options.onChange || (() => {});

        let html = '<div class="trigger-selector">';
        html += '<div class="trigger-selector-title">是什么影响了你的情绪？（可多选）</div>';
        html += '<div class="trigger-options">';

        MoodService.TRIGGER_OPTIONS.forEach(trigger => {
            const isSelected = selectedTriggers.includes(trigger.id);
            html += `
                <label class="trigger-option ${isSelected ? 'selected' : ''}" data-id="${trigger.id}">
                    <input type="checkbox" value="${trigger.id}" ${isSelected ? 'checked' : ''} hidden>
                    <span class="trigger-icon">${trigger.icon}</span>
                    <span class="trigger-name">${trigger.name}</span>
                </label>
            `;
        });

        html += '</div></div>';
        container.innerHTML = html;

        // 绑定选择事件
        container.querySelectorAll('.trigger-option').forEach(option => {
            option.addEventListener('click', () => {
                const checkbox = option.querySelector('input');
                checkbox.checked = !checkbox.checked;
                option.classList.toggle('selected', checkbox.checked);
                
                const selected = Array.from(container.querySelectorAll('input:checked'))
                    .map(cb => cb.value);
                onChange(selected);
            });
        });
    }

    // 渲染情绪打卡表单
    function renderMoodCheckinForm(container, options = {}) {
        const existingCheckin = options.existingCheckin || null;
        const onSave = options.onSave || (() => {});
        const onCancel = options.onCancel || (() => {});

        let formData = {
            level: existingCheckin ? existingCheckin.level : null,
            triggers: existingCheckin ? existingCheckin.triggers : [],
            note: existingCheckin ? existingCheckin.note : ''
        };

        container.innerHTML = `
            <div class="mood-checkin-form">
                <div class="mood-checkin-header">
                    <h3>${existingCheckin ? '更新情绪打卡' : '情绪打卡'}</h3>
                    <span class="mood-checkin-date">${MoodService.formatDate(new Date())}</span>
                </div>
                
                <div class="mood-selector-container"></div>
                <div class="trigger-selector-container"></div>
                
                <div class="form-group">
                    <label class="form-label">想记录点什么？（可选）</label>
                    <textarea class="form-textarea mood-note-input" 
                        placeholder="记录当下的感受、想法..."
                        rows="3">${formData.note}</textarea>
                </div>
                
                <div class="mood-checkin-actions">
                    <button type="button" class="btn-secondary mood-cancel-btn">取消</button>
                    <button type="button" class="btn-primary mood-save-btn" disabled>保存打卡</button>
                </div>
            </div>
        `;

        const moodSelectorContainer = container.querySelector('.mood-selector-container');
        const triggerSelectorContainer = container.querySelector('.trigger-selector-container');
        const saveBtn = container.querySelector('.mood-save-btn');
        const noteInput = container.querySelector('.mood-note-input');

        // 渲染情绪选择器
        renderMoodSelector(moodSelectorContainer, {
            selectedLevel: formData.level,
            onSelect: (level) => {
                formData.level = level;
                saveBtn.disabled = !formData.level;
            }
        });

        // 渲染触发点选择器
        renderTriggerSelector(triggerSelectorContainer, {
            selectedTriggers: formData.triggers,
            onChange: (triggers) => {
                formData.triggers = triggers;
            }
        });

        // 绑定按钮事件
        container.querySelector('.mood-cancel-btn').addEventListener('click', onCancel);
        
        saveBtn.addEventListener('click', () => {
            formData.note = noteInput.value.trim();
            if (formData.level) {
                onSave(formData);
            }
        });
    }

    // 渲染情绪趋势图表（7天/30天）
    function renderMoodTrendChart(container, options = {}) {
        const days = options.days || 7;
        const trendData = MoodService.getMoodTrend(days);
        
        const width = options.width || container.clientWidth || 300;
        const height = options.height || 150;
        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // 创建SVG
        let svg = `<svg width="${width}" height="${height}" class="mood-trend-chart">`;
        
        // 绘制网格线
        for (let i = 1; i <= 5; i++) {
            const y = padding.top + chartHeight - (i / 5) * chartHeight;
            svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
                         stroke="rgba(255,255,255,0.1)" stroke-dasharray="3,3"/>`;
            svg += `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" 
                         fill="#6a6a6a" font-size="10">${i}</text>`;
        }

        // 计算点坐标
        const points = trendData.map((item, index) => {
            const x = padding.left + (index / (trendData.length - 1 || 1)) * chartWidth;
            const y = item.level 
                ? padding.top + chartHeight - (item.level / 5) * chartHeight
                : null;
            return { x, y, ...item };
        });

        // 绘制折线（只连接有数据的点）
        let pathData = '';
        let lastPoint = null;
        
        points.forEach((point, index) => {
            if (point.y !== null) {
                if (lastPoint) {
                    pathData += ` L ${point.x} ${point.y}`;
                } else {
                    pathData += `M ${point.x} ${point.y}`;
                }
                lastPoint = point;
            }
        });

        if (pathData) {
            svg += `<path d="${pathData}" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
        }

        // 绘制数据点
        points.forEach((point, index) => {
            const date = new Date(point.date);
            const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`;
            
            // X轴标签
            const showLabel = days === 7 || index % 5 === 0 || index === points.length - 1;
            if (showLabel) {
                svg += `<text x="${point.x}" y="${height - 10}" text-anchor="middle" 
                             fill="#6a6a6a" font-size="10">${dayLabel}</text>`;
            }
            
            if (point.y !== null) {
                const mood = MoodService.MOOD_LEVELS.find(m => m.level === point.level);
                
                // 外圈
                svg += `<circle cx="${point.x}" cy="${point.y}" r="6" 
                               fill="${mood.color}" opacity="0.3"/>`;
                // 内圈
                svg += `<circle cx="${point.x}" cy="${point.y}" r="4" 
                               fill="${mood.color}" stroke="#1a1a2e" stroke-width="2"/>`;
                // 表情
                svg += `<text x="${point.x}" y="${point.y - 12}" text-anchor="middle" 
                               font-size="12">${mood.emoji}</text>`;
            } else {
                // 未打卡标记
                svg += `<circle cx="${point.x}" cy="${padding.top + chartHeight / 2}" r="3" 
                               fill="rgba(255,255,255,0.1)"/>`;
            }
        });

        svg += '</svg>';

        // 添加切换按钮
        const headerHtml = `
            <div class="mood-chart-header">
                <span class="mood-chart-title">情绪趋势</span>
                <div class="mood-chart-tabs">
                    <button class="chart-tab ${days === 7 ? 'active' : ''}" data-days="7">7天</button>
                    <button class="chart-tab ${days === 30 ? 'active' : ''}" data-days="30">30天</button>
                </div>
            </div>
        `;

        container.innerHTML = headerHtml + svg;

        // 绑定切换事件
        container.querySelectorAll('.chart-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const newDays = parseInt(tab.dataset.days);
                if (options.onDaysChange) {
                    options.onDaysChange(newDays);
                }
            });
        });
    }

    // 渲染情绪统计卡片
    function renderMoodStats(container) {
        const stats = MoodService.getMoodStats();
        
        const mostCommonMood = stats.mostCommonLevel 
            ? MoodService.MOOD_LEVELS.find(m => m.level === stats.mostCommonLevel)
            : null;
        
        const mostCommonTrigger = stats.mostCommonTrigger
            ? MoodService.TRIGGER_OPTIONS.find(t => t.id === stats.mostCommonTrigger)
            : null;

        container.innerHTML = `
            <div class="mood-stats-grid">
                <div class="mood-stat-card">
                    <div class="mood-stat-value">${stats.total}</div>
                    <div class="mood-stat-label">打卡天数</div>
                </div>
                <div class="mood-stat-card">
                    <div class="mood-stat-value">${stats.average || '-'}</div>
                    <div class="mood-stat-label">平均情绪</div>
                </div>
                <div class="mood-stat-card">
                    <div class="mood-stat-value">${stats.streak}</div>
                    <div class="mood-stat-label">连续打卡</div>
                </div>
                <div class="mood-stat-card">
                    <div class="mood-stat-value">${mostCommonMood ? mostCommonMood.emoji : '-'}</div>
                    <div class="mood-stat-label">最常情绪</div>
                </div>
            </div>
            ${mostCommonTrigger ? `
                <div class="mood-trigger-insight">
                    <span class="insight-label">最常影响你的因素：</span>
                    <span class="insight-value">${mostCommonTrigger.icon} ${mostCommonTrigger.name}</span>
                </div>
            ` : ''}
        `;
    }

    // 渲染快速打卡组件（用于首页/日记页嵌入）
    function renderQuickCheckin(container, options = {}) {
        const todayCheckin = MoodService.getTodayCheckin();
        const onCheckin = options.onCheckin || (() => {});

        if (todayCheckin) {
            // 今天已打卡，显示今日情绪
            const mood = MoodService.MOOD_LEVELS.find(m => m.level === todayCheckin.level);
            const triggersHtml = todayCheckin.triggers.map(tId => {
                const trigger = MoodService.TRIGGER_OPTIONS.find(t => t.id === tId);
                return trigger ? `<span class="quick-trigger-tag">${trigger.icon} ${trigger.name}</span>` : '';
            }).join('');

            container.innerHTML = `
                <div class="quick-checkin completed">
                    <div class="quick-checkin-header">
                        <span class="quick-checkin-title">今日情绪打卡</span>
                        <span class="checkin-status">✓ 已打卡</span>
                    </div>
                    <div class="today-mood-display">
                        <span class="today-mood-emoji" style="background: ${mood.color}20; color: ${mood.color};">
                            ${mood.emoji}
                        </span>
                        <div class="today-mood-info">
                            <div class="today-mood-name" style="color: ${mood.color};">${mood.name}</div>
                            ${todayCheckin.note ? `<div class="today-mood-note">${todayCheckin.note}</div>` : ''}
                        </div>
                    </div>
                    ${triggersHtml ? `<div class="today-triggers">${triggersHtml}</div>` : ''}
                    <button class="btn-secondary update-checkin-btn" style="margin-top: 12px; width: 100%;">
                        更新打卡
                    </button>
                </div>
            `;

            container.querySelector('.update-checkin-btn').addEventListener('click', () => {
                onCheckin(todayCheckin);
            });
        } else {
            // 今天未打卡，显示快速打卡入口
            container.innerHTML = `
                <div class="quick-checkin not-completed">
                    <div class="quick-checkin-header">
                        <span class="quick-checkin-title">今日情绪打卡</span>
                    </div>
                    <p class="quick-checkin-hint">花10秒记录当下的情绪状态</p>
                    <div class="quick-mood-options">
                        ${MoodService.MOOD_LEVELS.map(mood => `
                            <button class="quick-mood-btn" data-level="${mood.level}" 
                                    style="--mood-color: ${mood.color}" title="${mood.name}">
                                ${mood.emoji}
                            </button>
                        `).join('')}
                    </div>
                    <button class="btn-primary full-checkin-btn" style="margin-top: 12px; width: 100%;">
                        完整打卡
                    </button>
                </div>
            `;

            // 绑定快速选择事件
            container.querySelectorAll('.quick-mood-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const level = parseInt(btn.dataset.level);
                    onCheckin({ level });
                });
            });

            // 绑定完整打卡按钮
            container.querySelector('.full-checkin-btn').addEventListener('click', () => {
                onCheckin(null);
            });
        }
    }

    // 渲染情绪历史列表
    function renderMoodHistory(container, options = {}) {
        const checkins = MoodService.getAllCheckins().slice(0, options.limit || 30);
        
        if (checkins.length === 0) {
            container.innerHTML = `
                <div class="mood-history-empty">
                    <div class="empty-icon">📊</div>
                    <p>还没有情绪打卡记录</p>
                    <p class="empty-hint">开始记录，了解你的情绪模式</p>
                </div>
            `;
            return;
        }

        const html = checkins.map(checkin => {
            const mood = MoodService.MOOD_LEVELS.find(m => m.level === checkin.level);
            const date = new Date(checkin.date);
            const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
            
            const triggersHtml = checkin.triggers.slice(0, 2).map(tId => {
                const trigger = MoodService.TRIGGER_OPTIONS.find(t => t.id === tId);
                return trigger ? `<span class="history-trigger">${trigger.icon}</span>` : '';
            }).join('');

            return `
                <div class="mood-history-item" data-id="${checkin.id}">
                    <div class="history-date">${dateStr}</div>
                    <div class="history-mood" style="color: ${mood.color};">
                        <span class="history-emoji">${mood.emoji}</span>
                        <span class="history-mood-name">${mood.name}</span>
                    </div>
                    <div class="history-triggers">${triggersHtml}</div>
                    <div class="history-level">${checkin.level}/5</div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="mood-history-list">${html}</div>`;
    }

    // 公开API
    window.MoodUI = {
        renderMoodSelector,
        renderTriggerSelector,
        renderMoodCheckinForm,
        renderMoodTrendChart,
        renderMoodStats,
        renderQuickCheckin,
        renderMoodHistory
    };
})();
