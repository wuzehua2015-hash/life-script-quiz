/**
 * 日记UI组件
 * 渲染日记列表、编辑表单、日历等
 */

(function() {
    'use strict';

    // 渲染日记列表
    function renderDiaryList(container, options = {}) {
        const diaries = options.diaries || DiaryService.getRecentDiaries(options.limit || 30);
        
        if (diaries.length === 0) {
            container.innerHTML = `
                <div class="diary-empty">
                    <div class="diary-empty-icon">📝</div>
                    <p>还没有日记记录</p>
                    <p class="diary-empty-hint">开始记录你的觉察之旅吧</p>
                </div>
            `;
            return;
        }

        container.innerHTML = diaries.map(diary => createDiaryCard(diary)).join('');
        
        // 绑定事件
        container.querySelectorAll('.diary-card').forEach(card => {
            card.addEventListener('click', () => {
                const diaryId = card.dataset.id;
                if (options.onEdit) {
                    options.onEdit(diaryId);
                }
            });
        });
        
        container.querySelectorAll('.diary-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const diaryId = btn.dataset.id;
                if (options.onDelete) {
                    options.onDelete(diaryId);
                }
            });
        });
    }

    // 创建日记卡片
    function createDiaryCard(diary) {
        const emotionsHtml = diary.emotions.map(emotionId => {
            const emotion = DiaryService.EMOTION_TAGS.find(e => e.id === emotionId);
            return emotion ? `<span class="diary-emotion-tag" style="background: ${emotion.color}20; color: ${emotion.color}; border-color: ${emotion.color}40;">${emotion.emoji} ${emotion.name}</span>` : '';
        }).join('');
        
        const date = new Date(diary.date);
        const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
        const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
        
        const preview = diary.content ? diary.content.substring(0, 100).replace(/<[^>]*>/g, '') + (diary.content.length > 100 ? '...' : '') : '无内容';
        
        const taskBadge = diary.relatedTaskDay ? `<span class="diary-task-badge">📅 第${diary.relatedTaskDay}天</span>` : '';
        
        return `
            <div class="diary-card" data-id="${diary.id}">
                <div class="diary-card-header">
                    <div class="diary-date">
                        <span class="diary-date-day">${date.getDate()}</span>
                        <span class="diary-date-info">
                            <span class="diary-date-month">${date.getMonth() + 1}月</span>
                            <span class="diary-date-weekday">周${weekday}</span>
                        </span>
                    </div>
                    <div class="diary-actions">
                        ${taskBadge}
                        <button class="diary-delete-btn" data-id="${diary.id}" title="删除">🗑️</button>
                    </div>
                </div>
                <div class="diary-card-content">${preview}</div>
                <div class="diary-card-footer">
                    <div class="diary-emotions">${emotionsHtml}</div>
                </div>
            </div>
        `;
    }

    // 渲染日记编辑表单
    function renderDiaryEditor(container, options = {}) {
        const diary = options.diary || null;
        const isEdit = !!diary;
        
        const todayTask = DiaryService.getTodayTask();
        const archetypes = DiaryService.getArchetypeList();
        
        const dateValue = diary ? diary.date : DiaryService.formatDate(new Date());
        const contentValue = diary ? diary.content : '';
        const selectedEmotions = diary ? diary.emotions : [];
        const selectedArchetype = diary ? diary.archetype : (archetypes[0]?.key || '');
        const selectedTaskDay = diary ? diary.relatedTaskDay : (todayTask?.day || '');
        
        // 情绪选择器
        const emotionSelectorHtml = DiaryService.EMOTION_TAGS.map(e => `
            <label class="emotion-option ${selectedEmotions.includes(e.id) ? 'selected' : ''}" data-id="${e.id}">
                <input type="checkbox" name="emotions" value="${e.id}" ${selectedEmotions.includes(e.id) ? 'checked' : ''} hidden>
                <span class="emotion-emoji">${e.emoji}</span>
                <span class="emotion-name">${e.name}</span>
            </label>
        `).join('');
        
        // 原型选择器
        const archetypeSelectorHtml = archetypes.length > 0 ? `
            <div class="form-group">
                <label class="form-label">关联原型</label>
                <select name="archetype" class="form-select">
                    ${archetypes.map(a => `
                        <option value="${a.key}" ${selectedArchetype === a.key ? 'selected' : ''}>${a.name}</option>
                    `).join('')}
                </select>
            </div>
        ` : '';
        
        // 任务关联选择器
        let taskSelectorHtml = '';
        if (todayTask) {
            const plan = JSON.parse(localStorage.getItem('lsq_plan') || 'null');
            if (plan && plan.days) {
                taskSelectorHtml = `
                    <div class="form-group">
                        <label class="form-label">关联21天任务（可选）</label>
                        <select name="relatedTaskDay" class="form-select">
                            <option value="">不关联</option>
                            ${plan.days.map((d, i) => `
                                <option value="${i + 1}" ${selectedTaskDay === i + 1 ? 'selected' : ''}>
                                    第${i + 1}天: ${d.task.substring(0, 20)}${d.task.length > 20 ? '...' : ''}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                `;
            }
        }
        
        container.innerHTML = `
            <form class="diary-editor" id="diary-form">
                <div class="diary-editor-header">
                    <h3>${isEdit ? '编辑日记' : '写觉察日记'}</h3>
                    ${isEdit ? `<span class="diary-editor-date">${dateValue}</span>` : ''}
                </div>
                
                <div class="form-group">
                    <label class="form-label">日期</label>
                    <input type="date" name="date" class="form-input" value="${dateValue}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">今天感受如何？</label>
                    <div class="emotion-selector">
                        ${emotionSelectorHtml}
                    </div>
                </div>
                
                ${archetypeSelectorHtml}
                ${taskSelectorHtml}
                
                <div class="form-group">
                    <label class="form-label">觉察记录</label>
                    <textarea name="content" class="form-textarea diary-textarea" 
                        placeholder="记录今天的觉察、感受、想法...&#10;&#10;提示：&#10;- 今天有什么触发你的情绪？&#10;- 你觉察到了什么模式？&#10;- 有什么新的领悟？" 
                        rows="8">${contentValue}</textarea>
                </div>
                
                <div class="diary-editor-actions">
                    <button type="button" class="btn-secondary" id="diary-cancel-btn">取消</button>
                    <button type="submit" class="btn-primary">${isEdit ? '保存修改' : '保存日记'}</button>
                </div>
            </form>
        `;
        
        // 绑定情绪选择事件
        container.querySelectorAll('.emotion-option').forEach(option => {
            option.addEventListener('click', () => {
                const checkbox = option.querySelector('input');
                checkbox.checked = !checkbox.checked;
                option.classList.toggle('selected', checkbox.checked);
            });
        });
        
        // 绑定表单提交
        const form = container.querySelector('#diary-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                date: formData.get('date'),
                content: formData.get('content'),
                emotions: formData.getAll('emotions'),
                archetype: formData.get('archetype') || '',
                relatedTaskDay: formData.get('relatedTaskDay') ? parseInt(formData.get('relatedTaskDay')) : null
            };
            
            if (options.onSave) {
                options.onSave(data);
            }
        });
        
        // 绑定取消按钮
        const cancelBtn = container.querySelector('#diary-cancel-btn');
        if (cancelBtn && options.onCancel) {
            cancelBtn.addEventListener('click', options.onCancel);
        }
    }

    // 渲染日历视图
    function renderCalendar(container, options = {}) {
        const year = options.year || new Date().getFullYear();
        const month = options.month || new Date().getMonth();
        const diaries = DiaryService.getDiariesByMonth(year, month);
        
        const diaryMap = {};
        diaries.forEach(d => {
            diaryMap[d.date] = d;
        });
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        
        let calendarHtml = `
            <div class="diary-calendar-header">
                <button class="calendar-nav" data-action="prev">←</button>
                <span class="calendar-title">${year}年 ${monthNames[month]}</span>
                <button class="calendar-nav" data-action="next">→</button>
            </div>
            <div class="diary-calendar-weekdays">
                <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
            </div>
            <div class="diary-calendar-grid">
        `;
        
        // 填充空白
        for (let i = 0; i < startPadding; i++) {
            calendarHtml += '<div class="calendar-day empty"></div>';
        }
        
        // 填充日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const diary = diaryMap[dateStr];
            const isToday = dateStr === DiaryService.formatDate(new Date());
            
            let emotionsHtml = '';
            if (diary && diary.emotions.length > 0) {
                const emotion = DiaryService.EMOTION_TAGS.find(e => e.id === diary.emotions[0]);
                if (emotion) {
                    emotionsHtml = `<span class="calendar-emotion">${emotion.emoji}</span>`;
                }
            }
            
            calendarHtml += `
                <div class="calendar-day ${diary ? 'has-diary' : ''} ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <span class="calendar-day-number">${day}</span>
                    ${emotionsHtml}
                    ${diary ? '<span class="calendar-dot"></span>' : ''}
                </div>
            `;
        }
        
        calendarHtml += '</div>';
        container.innerHTML = calendarHtml;
        
        // 绑定事件
        container.querySelectorAll('.calendar-day[data-date]').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const date = dayEl.dataset.date;
                if (options.onDateClick) {
                    options.onDateClick(date);
                }
            });
        });
        
        container.querySelectorAll('.calendar-nav').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                let newYear = year;
                let newMonth = month;
                
                if (action === 'prev') {
                    newMonth--;
                    if (newMonth < 0) {
                        newMonth = 11;
                        newYear--;
                    }
                } else {
                    newMonth++;
                    if (newMonth > 11) {
                        newMonth = 0;
                        newYear++;
                    }
                }
                
                if (options.onMonthChange) {
                    options.onMonthChange(newYear, newMonth);
                }
            });
        });
    }

    // 渲染统计面板
    function renderStats(container) {
        const stats = DiaryService.getDiaryStats();
        
        // 获取最常见的情绪
        let topEmotion = null;
        let maxCount = 0;
        for (const [emotionId, count] of Object.entries(stats.emotions)) {
            if (count > maxCount) {
                maxCount = count;
                topEmotion = emotionId;
            }
        }
        
        const topEmotionData = topEmotion ? DiaryService.EMOTION_TAGS.find(e => e.id === topEmotion) : null;
        
        container.innerHTML = `
            <div class="diary-stats-grid">
                <div class="diary-stat-card">
                    <div class="diary-stat-value">${stats.total}</div>
                    <div class="diary-stat-label">日记总数</div>
                </div>
                <div class="diary-stat-card">
                    <div class="diary-stat-value">${stats.streak}</div>
                    <div class="diary-stat-label">连续打卡</div>
                </div>
                <div class="diary-stat-card">
                    <div class="diary-stat-value">${topEmotionData ? topEmotionData.emoji : '-'}</div>
                    <div class="diary-stat-label">最常情绪</div>
                </div>
            </div>
        `;
    }

    // 确认删除弹窗
    function confirmDelete(diary, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'diary-modal';
        modal.innerHTML = `
            <div class="diary-modal-overlay"></div>
            <div class="diary-modal-content">
                <h4>确认删除</h4>
                <p>确定要删除 ${diary.date} 的日记吗？</p>
                <p class="diary-modal-hint">此操作不可恢复</p>
                <div class="diary-modal-actions">
                    <button class="btn-secondary" id="modal-cancel">取消</button>
                    <button class="btn-danger" id="modal-confirm">删除</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#modal-cancel').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#modal-confirm').addEventListener('click', () => {
            onConfirm();
            modal.remove();
        });
        
        modal.querySelector('.diary-modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
    }

    // 公开API
    window.DiaryUI = {
        renderDiaryList,
        renderDiaryEditor,
        renderCalendar,
        renderStats,
        confirmDelete
    };
})();
