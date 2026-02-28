/**
 * 改变轨迹UI组件
 * 时间轴渲染、里程碑展示、报告导出
 */

(function() {
    'use strict';

    // ==================== 时间轴渲染 ====================

    // 渲染时间轴
    function renderTimeline(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const events = window.JourneyService?.getTimelineEvents() || [];
        const { filter = 'all', limit = 50 } = options;
        
        // 过滤事件
        let filteredEvents = events;
        if (filter !== 'all') {
            filteredEvents = events.filter(e => e.type === filter || e.milestone);
        }
        
        // 限制数量
        filteredEvents = filteredEvents.slice(0, limit);

        if (filteredEvents.length === 0) {
            container.innerHTML = renderEmptyState();
            return;
        }

        // 按月份分组
        const groupedEvents = groupEventsByMonth(filteredEvents);
        
        let html = '<div class="journey-timeline">';
        
        Object.entries(groupedEvents).forEach(([monthKey, monthEvents]) => {
            const [year, month] = monthKey.split('-');
            const monthName = `${year}年${parseInt(month)}月`;
            
            html += `
                <div class="timeline-month">
                    <div class="timeline-month-header">
                        <span class="month-label">${monthName}</span>
                        <span class="month-count">${monthEvents.length} 个事件</span>
                    </div>
                    <div class="timeline-events">
                        ${monthEvents.map(event => renderEventCard(event)).join('')}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    // 渲染事件卡片
    function renderEventCard(event) {
        const date = new Date(event.date);
        const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
        const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        const milestoneClass = event.milestone ? 'milestone' : '';
        const typeClass = `type-${event.type}`;
        
        return `
            <div class="timeline-event ${milestoneClass} ${typeClass}" data-event-id="${event.id}">
                <div class="event-marker" style="background-color: ${event.color}">
                    <span class="event-icon">${event.icon}</span>
                </div>
                <div class="event-content">
                    <div class="event-header">
                        <span class="event-title">${event.title}</span>
                        <span class="event-date">${dateStr}</span>
                    </div>
                    <p class="event-description">${event.description}</p>
                    ${renderEventMeta(event)}
                </div>
            </div>
        `;
    }

    // 渲染事件元信息
    function renderEventMeta(event) {
        let meta = '';
        
        switch (event.type) {
            case 'test':
                if (event.data?.matchPercentage) {
                    meta = `<span class="event-meta">匹配度 ${event.data.matchPercentage}%</span>`;
                }
                break;
            case 'role':
                if (event.data?.matchPercentage) {
                    meta = `<span class="event-meta">匹配度 ${event.data.matchPercentage}%</span>`;
                }
                break;
            case 'badge':
                meta = `<span class="event-meta">+${event.data?.points || 0} 积分</span>`;
                break;
            case 'mood':
                if (event.data?.level) {
                    const moodEmojis = ['', '😢', '😕', '😐', '😊', '🤩'];
                    meta = `<span class="event-meta">情绪 ${moodEmojis[event.data.level] || ''}</span>`;
                }
                break;
            case 'plan':
                meta = `<span class="event-meta">第 ${event.data?.days || 0} 天</span>`;
                break;
        }
        
        return meta ? `<div class="event-meta-row">${meta}</div>` : '';
    }

    // 按月份分组事件
    function groupEventsByMonth(events) {
        const grouped = {};
        
        events.forEach(event => {
            const date = new Date(event.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(event);
        });
        
        return grouped;
    }

    // 渲染空状态
    function renderEmptyState() {
        return `
            <div class="journey-empty">
                <div class="empty-icon">🌱</div>
                <h3>你的改变之旅即将开始</h3>
                <p>完成首次测试，开启自我探索之旅</p>
                <a href="../index.html" class="btn-primary">开始测试</a>
            </div>
        `;
    }

    // ==================== 里程碑渲染 ====================

    // 渲染里程碑
    function renderMilestones(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const events = window.JourneyService?.getTimelineEvents() || [];
        const milestones = events.filter(e => e.milestone).slice(0, 6);

        if (milestones.length === 0) {
            container.innerHTML = '<p class="no-milestones">还没有里程碑，继续加油！</p>';
            return;
        }

        const html = milestones.map((milestone, index) => {
            const date = new Date(milestone.date);
            const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
            
            return `
                <div class="milestone-card" style="animation-delay: ${index * 0.1}s">
                    <div class="milestone-icon" style="background-color: ${milestone.color}">
                        ${milestone.icon}
                    </div>
                    <div class="milestone-info">
                        <h4>${milestone.title}</h4>
                        <p>${milestone.description}</p>
                        <span class="milestone-date">${dateStr}</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    // ==================== 统计面板渲染 ====================

    // 渲染统计面板
    function renderStatsPanel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const stats = window.JourneyService?.getJourneyStats() || {
            totalEvents: 0,
            milestones: 0,
            journeyDays: 0,
            tests: 0,
            diaries: 0,
            badges: 0
        };

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-value">${stats.journeyDays}</span>
                    <span class="stat-label">探索天数</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${stats.totalEvents}</span>
                    <span class="stat-label">记录事件</span>
                </div>
                <div class="stat-card highlight">
                    <span class="stat-value">${stats.milestones}</span>
                    <span class="stat-label">里程碑</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${stats.tests}</span>
                    <span class="stat-label">测试次数</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${stats.diaries}</span>
                    <span class="stat-label">日记篇数</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${stats.badges}</span>
                    <span class="stat-label">获得徽章</span>
                </div>
            </div>
        `;
    }

    // ==================== 报告导出 ====================

    // 导出改变报告为图片
    function exportReportAsImage() {
        const reportElement = document.getElementById('journey-report');
        if (!reportElement) {
            showToast('报告元素不存在');
            return;
        }

        showToast('正在生成报告图片...');

        // 使用html2canvas或类似库
        if (typeof html2canvas !== 'undefined') {
            html2canvas(reportElement, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `人生剧本改变报告_${new Date().toLocaleDateString()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                showToast('报告已保存');
            }).catch(err => {
                console.error('生成图片失败:', err);
                showToast('生成图片失败，请重试');
            });
        } else {
            // 简单的替代方案：使用SVG
            generateSimpleImage(reportElement);
        }
    }

    // 生成简单图片（使用SVG）
    function generateSimpleImage(element) {
        const stats = window.JourneyService?.getJourneyStats() || {};
        const events = window.JourneyService?.getTimelineEvents() || [];
        const milestones = events.filter(e => e.milestone).slice(0, 5);

        // 创建SVG
        const svgWidth = 800;
        const svgHeight = 1000;
        
        let svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
                <defs>
                    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea"/>
                        <stop offset="100%" style="stop-color:#764ba2"/>
                    </linearGradient>
                </defs>
                
                <!-- 背景 -->
                <rect width="100%" height="100%" fill="#f8f9fa"/>
                
                <!-- 头部 -->
                <rect width="100%" height="200" fill="url(#headerGrad)"/>
                <text x="400" y="80" text-anchor="middle" fill="white" font-size="36" font-weight="bold">人生剧本改变报告</text>
                <text x="400" y="130" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="18">探索 ${stats.journeyDays || 0} 天 · ${stats.totalEvents || 0} 个成长记录</text>
                <text x="400" y="170" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="14">生成于 ${new Date().toLocaleDateString()}</text>
                
                <!-- 统计 -->
                <rect x="50" y="230" width="200" height="100" rx="10" fill="white" stroke="#e0e0e0"/>
                <text x="150" y="280" text-anchor="middle" fill="#667eea" font-size="36" font-weight="bold">${stats.milestones || 0}</text>
                <text x="150" y="310" text-anchor="middle" fill="#666" font-size="14">里程碑</text>
                
                <rect x="300" y="230" width="200" height="100" rx="10" fill="white" stroke="#e0e0e0"/>
                <text x="400" y="280" text-anchor="middle" fill="#667eea" font-size="36" font-weight="bold">${stats.diaries || 0}</text>
                <text x="400" y="310" text-anchor="middle" fill="#666" font-size="14">日记篇数</text>
                
                <rect x="550" y="230" width="200" height="100" rx="10" fill="white" stroke="#e0e0e0"/>
                <text x="650" y="280" text-anchor="middle" fill="#667eea" font-size="36" font-weight="bold">${stats.badges || 0}</text>
                <text x="650" y="310" text-anchor="middle" fill="#666" font-size="14">获得徽章</text>
                
                <!-- 里程碑 -->
                <text x="50" y="400" fill="#333" font-size="20" font-weight="bold">🏆 重要里程碑</text>
        `;

        // 添加里程碑
        let yPos = 440;
        milestones.forEach((m, i) => {
            const date = new Date(m.date);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            
            svgContent += `
                <rect x="50" y="${yPos}" width="700" height="60" rx="8" fill="white" stroke="#e0e0e0"/>
                <circle cx="90" cy="${yPos + 30}" r="20" fill="${m.color}"/>
                <text x="90" y="${yPos + 36}" text-anchor="middle" fill="white" font-size="20">${m.icon}</text>
                <text x="130" y="${yPos + 25}" fill="#333" font-size="16" font-weight="bold">${m.title}</text>
                <text x="130" y="${yPos + 45}" fill="#666" font-size="12">${m.description}</text>
                <text x="700" y="${yPos + 36}" text-anchor="end" fill="#999" font-size="12">${dateStr}</text>
            `;
            yPos += 80;
        });

        // 底部
        svgContent += `
            <text x="400" y="${svgHeight - 40}" text-anchor="middle" fill="#999" font-size="12">人生剧本测试 - 发现真实的自己</text>
            </svg>
        `;

        // 转换为图片并下载
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = svgWidth;
            canvas.height = svgHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const link = document.createElement('a');
            link.download = `人生剧本改变报告_${new Date().toLocaleDateString()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            URL.revokeObjectURL(url);
            showToast('报告已保存');
        };
        img.src = url;
    }

    // 导出改变报告为PDF（简化版，使用打印）
    function exportReportAsPDF() {
        showToast('准备PDF导出...');
        
        // 创建打印样式
        const printStyles = `
            <style>
                @media print {
                    body * { visibility: hidden; }
                    #journey-report, #journey-report * { visibility: visible; }
                    #journey-report { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                }
            </style>
        `;
        
        // 临时添加打印样式
        let styleEl = document.getElementById('print-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'print-styles';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = printStyles.replace(/<style>|<\/style>/g, '');
        
        // 延迟打印
        setTimeout(() => {
            window.print();
            showToast('请使用浏览器的"另存为PDF"功能保存');
        }, 500);
    }

    // 分享报告
    function shareReport() {
        const stats = window.JourneyService?.getJourneyStats() || {};
        
        const shareText = `我在人生剧本测试中已探索 ${stats.journeyDays || 0} 天，记录了 ${stats.totalEvents || 0} 个成长时刻，达成了 ${stats.milestones || 0} 个里程碑！来发现你的人生剧本吧~`;
        
        if (navigator.share) {
            navigator.share({
                title: '我的改变轨迹 - 人生剧本测试',
                text: shareText,
                url: window.location.origin
            }).catch(err => console.log('分享取消'));
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(shareText).then(() => {
                showToast('分享文案已复制到剪贴板');
            }).catch(() => {
                showToast('复制失败，请手动复制');
            });
        }
    }

    // ==================== 工具函数 ====================

    // 显示提示
    function showToast(message) {
        const existing = document.querySelector('.journey-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'journey-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // 设置过滤器
    function setupFilters(containerId, timelineContainerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const filters = [
            { id: 'all', label: '全部', icon: '📋' },
            { id: 'milestone', label: '里程碑', icon: '🏆' },
            { id: 'test', label: '测试', icon: '📝' },
            { id: 'diary', label: '日记', icon: '📔' },
            { id: 'mood', label: '情绪', icon: '😊' },
            { id: 'badge', label: '徽章', icon: '🏅' }
        ];

        container.innerHTML = filters.map(f => `
            <button class="filter-btn ${f.id === 'all' ? 'active' : ''}" data-filter="${f.id}">
                <span>${f.icon}</span>
                <span>${f.label}</span>
            </button>
        `).join('');

        // 绑定点击事件
        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                renderTimeline(timelineContainerId, { filter });
            });
        });
    }

    // ==================== 导出 ====================

    window.JourneyUI = {
        renderTimeline,
        renderMilestones,
        renderStatsPanel,
        setupFilters,
        exportReportAsImage,
        exportReportAsPDF,
        shareReport,
        showToast
    };

})();
