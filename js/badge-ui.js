/**
 * 成就徽章系统 - UI组件
 * v2.4 成就徽章系统
 */

(function() {
    'use strict';

    // 徽章展示组件
    const BadgeUI = {
        // ==================== 徽章卡片渲染 ====================
        
        /**
         * 渲染单个徽章卡片
         */
        renderBadgeCard(achievement, unlocked = false, unlockDate = null) {
            const { id, name, description, icon, points } = achievement;
            
            return `
                <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}" data-badge-id="${id}">
                    <div class="badge-icon-wrapper">
                        <span class="badge-icon">${icon}</span>
                        ${unlocked ? '<div class="badge-shine"></div>' : '<div class="badge-lock">🔒</div>'}
                    </div>
                    <div class="badge-info">
                        <h4 class="badge-name">${name}</h4>
                        <p class="badge-description">${description}</p>
                        <div class="badge-meta">
                            <span class="badge-points">+${points} 积分</span>
                            ${unlockDate ? `<span class="badge-date">${this.formatDate(unlockDate)}</span>` : ''}
                        </div>
                    </div>
                    ${unlocked ? '<div class="badge-glow"></div>' : ''}
                </div>
            `;
        },

        /**
         * 渲染徽章分类区块
         */
        renderCategorySection(categoryKey, categoryData, unlockedIds, unlockedDates) {
            const { name, description, icon, achievements } = categoryData;
            const unlockedCount = achievements.filter(a => unlockedIds.includes(a.id)).length;
            const totalCount = achievements.length;
            const progress = Math.round((unlockedCount / totalCount) * 100);
            
            return `
                <div class="badge-category" data-category="${categoryKey}">
                    <div class="category-header">
                        <div class="category-title-wrapper">
                            <span class="category-icon">${icon}</span>
                            <div class="category-title-info">
                                <h3 class="category-name">${name}</h3>
                                <p class="category-description">${description}</p>
                            </div>
                        </div>
                        <div class="category-progress">
                            <span class="progress-text">${unlockedCount}/${totalCount}</span>
                            <div class="progress-ring">
                                <svg viewBox="0 0 36 36">
                                    <path class="progress-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                    <path class="progress-ring-fill" stroke-dasharray="${progress}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="badges-grid">
                        ${achievements.map(a => this.renderBadgeCard(
                            a, 
                            unlockedIds.includes(a.id),
                            unlockedDates[a.id]
                        )).join('')}
                    </div>
                </div>
            `;
        },

        /**
         * 渲染完整成就页面
         */
        renderAchievementsPage() {
            const achievements = AchievementService.getAllAchievements();
            const unlocked = AchievementService.getUnlockedAchievements();
            const stats = AchievementService.getStats();
            
            const container = document.getElementById('achievements-container');
            if (!container) return;

            container.innerHTML = `
                <div class="achievements-header">
                    <div class="achievements-title-section">
                        <h1>🏅 我的成就</h1>
                        <p class="achievements-subtitle">完成目标，解锁徽章，记录成长</p>
                    </div>
                    <div class="achievements-stats">
                        <div class="stat-card">
                            <span class="stat-value">${stats.unlocked}</span>
                            <span class="stat-label">已解锁</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">${stats.total}</span>
                            <span class="stat-label">总徽章</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">${stats.earnedPoints}</span>
                            <span class="stat-label">总积分</span>
                        </div>
                        <div class="stat-card highlight">
                            <span class="stat-value">${stats.progress}%</span>
                            <span class="stat-label">完成度</span>
                        </div>
                    </div>
                    <div class="achievements-progress-bar">
                        <div class="progress-track">
                            <div class="progress-fill" style="width: ${stats.progress}%"></div>
                        </div>
                        <span class="progress-percent">${stats.progress}%</span>
                    </div>
                </div>
                <div class="achievements-content">
                    ${Object.keys(achievements).map(key => 
                        this.renderCategorySection(
                            key, 
                            achievements[key], 
                            unlocked.unlocked,
                            unlocked.unlockedAt
                        )
                    ).join('')}
                </div>
            `;
        },

        /**
         * 渲染结果页徽章展示
         */
        renderResultBadges(newlyUnlocked = []) {
            const stats = AchievementService.getStats();
            const recentlyUnlocked = AchievementService.getUnlockedAchievements();
            const achievements = AchievementService.getAllAchievements();
            
            // 获取最近解锁的3个徽章
            const recentBadges = recentlyUnlocked.unlocked
                .slice(-3)
                .map(id => {
                    for (const cat of Object.values(achievements)) {
                        const found = cat.achievements.find(a => a.id === id);
                        if (found) return found;
                    }
                    return null;
                })
                .filter(Boolean);

            return `
                <div class="result-badges-section">
                    <div class="result-badges-header">
                        <h3>🏅 成就徽章</h3>
                        <a href="achievements/index.html" class="view-all-link">查看全部 →</a>
                    </div>
                    <div class="result-badges-grid">
                        ${recentBadges.length > 0 ? recentBadges.map(badge => `
                            <div class="result-badge-item unlocked">
                                <span class="result-badge-icon">${badge.icon}</span>
                                <span class="result-badge-name">${badge.name}</span>
                            </div>
                        `).join('') : `
                            <div class="result-badges-empty">
                                <p>完成测试，解锁你的第一个徽章！</p>
                            </div>
                        `}
                    </div>
                    <div class="result-badges-progress">
                        <span>已解锁 ${stats.unlocked}/${stats.total} 个徽章</span>
                        <div class="mini-progress">
                            <div class="mini-progress-fill" style="width: ${stats.progress}%"></div>
                        </div>
                    </div>
                    ${newlyUnlocked.length > 0 ? `
                        <div class="new-badges-notice">
                            <span class="new-badge">✨ 新获得 ${newlyUnlocked.length} 个徽章！</span>
                        </div>
                    ` : ''}
                </div>
            `;
        },

        // ==================== 徽章解锁动画 ====================
        
        /**
         * 显示徽章解锁动画（带confetti效果）
         */
        showUnlockAnimation(achievements) {
            if (!achievements || achievements.length === 0) return;

            // 创建动画容器
            let container = document.getElementById('badge-unlock-overlay');
            if (!container) {
                container = document.createElement('div');
                container.id = 'badge-unlock-overlay';
                container.className = 'badge-unlock-overlay';
                document.body.appendChild(container);
            }

            // 显示第一个徽章的解锁动画
            const achievement = achievements[0];
            container.innerHTML = `
                <div class="badge-unlock-modal">
                    <div class="confetti-container" id="confetti-container"></div>
                    <div class="badge-unlock-content">
                        <div class="unlock-title">🎉 成就解锁！</div>
                        <div class="badge-showcase">
                            <div class="badge-icon-large">${achievement.icon}</div>
                            <div class="badge-rays"></div>
                        </div>
                        <h3 class="badge-unlock-name">${achievement.name}</h3>
                        <p class="badge-unlock-description">${achievement.description}</p>
                        <div class="badge-unlock-points">+${achievement.points} 积分</div>
                        ${achievements.length > 1 ? `<p class="more-badges">还有 ${achievements.length - 1} 个徽章解锁</p>` : ''}
                        <button class="btn-primary unlock-confirm-btn" onclick="BadgeUI.closeUnlockAnimation()">
                            太棒了！
                        </button>
                    </div>
                </div>
            `;

            container.classList.add('active');
            
            // 触发confetti效果
            this.triggerConfetti();

            // 如果有多个徽章，延迟显示下一个
            if (achievements.length > 1) {
                setTimeout(() => {
                    this.showUnlockAnimation(achievements.slice(1));
                }, 3000);
            }
        },

        /**
         * 关闭解锁动画
         */
        closeUnlockAnimation() {
            const container = document.getElementById('badge-unlock-overlay');
            if (container) {
                container.classList.remove('active');
                setTimeout(() => container.remove(), 300);
            }
        },

        /**
         * 触发confetti效果
         */
        triggerConfetti() {
            const container = document.getElementById('confetti-container');
            if (!container) return;

            const colors = ['#d4af37', '#e8c547', '#f0d878', '#ff6b6b', '#4ecdc4', '#45b7d1'];
            const confettiCount = 100;

            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 10 + 5}px;
                    height: ${Math.random() * 10 + 5}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: 50%;
                    top: 50%;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    transform: translate(-50%, -50%);
                    animation: confetti-fall ${Math.random() * 2 + 2}s ease-out forwards;
                    animation-delay: ${Math.random() * 0.5}s;
                `;
                
                // 随机方向
                const angle = (Math.PI * 2 * i) / confettiCount;
                const velocity = Math.random() * 200 + 100;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity - 200;
                
                confetti.style.setProperty('--tx', `${tx}px`);
                confetti.style.setProperty('--ty', `${ty}px`);
                confetti.style.setProperty('--rot', `${Math.random() * 720}deg`);
                
                container.appendChild(confetti);
            }

            // 清理confetti
            setTimeout(() => {
                container.innerHTML = '';
            }, 4000);
        },

        // ==================== 工具方法 ====================
        
        /**
         * 格式化日期
         */
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            
            // 小于24小时显示"今天"或"昨天"
            if (diff < 86400000) {
                if (date.getDate() === now.getDate()) return '今天';
                return '昨天';
            }
            
            // 小于7天显示天数
            if (diff < 604800000) {
                return `${Math.floor(diff / 86400000)}天前`;
            }
            
            // 否则显示日期
            return `${date.getMonth() + 1}月${date.getDate()}日`;
        },

        /**
         * 初始化徽章页面
         */
        initAchievementsPage() {
            this.renderAchievementsPage();
            this.bindEvents();
        },

        /**
         * 绑定事件
         */
        bindEvents() {
            // 监听成就解锁事件
            window.addEventListener('achievementUnlocked', (e) => {
                const { achievements } = e.detail;
                this.showUnlockAnimation(achievements);
            });

            // 徽章卡片点击事件
            document.addEventListener('click', (e) => {
                const card = e.target.closest('.badge-card');
                if (card) {
                    const badgeId = card.dataset.badgeId;
                    this.showBadgeDetail(badgeId);
                }
            });
        },

        /**
         * 显示徽章详情
         */
        showBadgeDetail(badgeId) {
            const achievements = AchievementService.getAllAchievements();
            let achievement = null;
            
            for (const cat of Object.values(achievements)) {
                achievement = cat.achievements.find(a => a.id === badgeId);
                if (achievement) break;
            }
            
            if (!achievement) return;

            const unlocked = AchievementService.getUnlockedAchievements();
            const isUnlocked = unlocked.unlocked.includes(badgeId);
            const unlockDate = unlocked.unlockedAt[badgeId];

            // 创建详情弹窗
            let modal = document.getElementById('badge-detail-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'badge-detail-modal';
                modal.className = 'badge-detail-modal';
                document.body.appendChild(modal);
            }

            modal.innerHTML = `
                <div class="badge-detail-content">
                    <button class="close-btn" onclick="BadgeUI.closeBadgeDetail()">&times;</button>
                    <div class="badge-detail-icon ${isUnlocked ? 'unlocked' : 'locked'}">
                        <span>${achievement.icon}</span>
                        ${isUnlocked ? '' : '<div class="lock-overlay">🔒</div>'}
                    </div>
                    <h3>${achievement.name}</h3>
                    <p class="badge-detail-description">${achievement.description}</p>
                    <div class="badge-detail-meta">
                        <span class="points">+${achievement.points} 积分</span>
                        ${unlockDate ? `<span class="unlock-date">解锁于 ${this.formatDate(unlockDate)}</span>` : ''}
                    </div>
                    ${!isUnlocked ? `
                        <div class="unlock-hint">
                            <p>💡 提示：${this.getUnlockHint(achievement)}</p>
                        </div>
                    ` : ''}
                </div>
            `;

            modal.classList.add('active');
        },

        /**
         * 关闭徽章详情
         */
        closeBadgeDetail() {
            const modal = document.getElementById('badge-detail-modal');
            if (modal) {
                modal.classList.remove('active');
            }
        },

        /**
         * 获取解锁提示
         */
        getUnlockHint(achievement) {
            const hints = {
                'first_test': '完成一次人生剧本测试即可解锁',
                'view_result_detail': '在结果页查看完整分析报告',
                'view_archetypes': '浏览角色图鉴，了解不同原型',
                'view_characters': '点击角色卡片查看详细档案',
                'enter_guidance': '从结果页进入"改变剧本"页面',
                'start_plan': '启动21天改变计划',
                'plan_progress': '坚持完成21天计划',
                'checkin_streak': '每天进行觉察打卡',
                'monthly_checkin': '一个月内打卡15天以上',
                'daily_checkin': '完成首次每日觉察打卡',
                'mood_tracking': '连续记录情绪状态',
                'view_timeline': '查看你的成长轨迹',
                'use_tool': '使用情境应对工具',
                'use_emergency_tool': '在紧急情况下使用平复工具',
                'share_result': '分享你的测试结果',
                'share_achievement': '分享你的成就徽章'
            };
            return hints[achievement.condition.type] || '继续探索，完成目标即可解锁';
        }
    };

    // 导出到全局
    window.BadgeUI = BadgeUI;

})();
