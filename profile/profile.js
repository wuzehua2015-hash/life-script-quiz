/**
 * 个人中心页面逻辑
 * 整合用户所有数据：测试结果、角色收集、徽章、21天计划
 */

(function() {
    'use strict';

    // 12种原型定义
    const ARCHETYPES = {
        lone_hero: { name: '孤勇者', icon: '⚔️', color: '#e74c3c' },
        pleaser: { name: '讨好者', icon: '😢', color: '#3498db' },
        hermit: { name: '隐士', icon: '🏔️', color: '#95a5a6' },
        controller: { name: '控制狂', icon: '🎮', color: '#9b59b6' },
        victim: { name: '受害者', icon: '😔', color: '#34495e' },
        performer: { name: '表演者', icon: '🎭', color: '#f39c12' },
        savior: { name: '拯救者', icon: '🦸', color: '#27ae60' },
        wanderer: { name: '漫游者', icon: '🎒', color: '#e67e22' },
        warrior: { name: '战士', icon: '⚔️', color: '#c0392b' },
        healer: { name: '治愈者', icon: '💚', color: '#16a085' },
        observer: { name: '观察者', icon: '🔍', color: '#2980b9' },
        awakened: { name: '觉醒者', icon: '✨', color: '#8e44ad' }
    };

    // 初始化
    function init() {
        renderProfileOverview();
        renderTestHistory();
        renderCollectionPreview();
        renderBadgesPreview();
        renderPlanProgress();
        setupEventListeners();
    }

    // 渲染用户概览
    function renderProfileOverview() {
        const container = document.getElementById('profile-overview');
        if (!container) return;

        // 获取统计数据
        const stats = calculateUserStats();
        
        // 获取最近测试结果
        const lastResult = getLastTestResult();
        const userName = lastResult ? lastResult.character?.name?.charAt(0) || '?' : '?';
        const joinDate = getJoinDate();

        container.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">${userName}</div>
                <div class="user-details">
                    <h2>探索者</h2>
                    <p>加入于 ${joinDate}</p>
                </div>
            </div>
            <div class="stats-overview">
                <div class="stat-item">
                    <span class="stat-value">${stats.testCount}</span>
                    <span class="stat-label">测试次数</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.unlockedRoles}</span>
                    <span class="stat-label">解锁角色</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.achievements}</span>
                    <span class="stat-label">获得徽章</span>
                </div>
            </div>
        `;
    }

    // 计算用户统计数据
    function calculateUserStats() {
        const stats = {
            testCount: 0,
            unlockedRoles: 0,
            achievements: 0
        };

        // 测试次数
        try {
            const tests = localStorage.getItem('lsq_tests');
            if (tests) {
                const testData = JSON.parse(tests);
                stats.testCount = Array.isArray(testData) ? testData.length : 0;
            }
            // 如果没有tests但有testResult，也算一次测试
            if (stats.testCount === 0 && localStorage.getItem('lsq_testResult')) {
                stats.testCount = 1;
            }
        } catch (e) {
            console.error('获取测试次数失败:', e);
        }

        // 解锁角色数
        try {
            const unlockedRoles = localStorage.getItem('lsq_unlockedRoles');
            if (unlockedRoles) {
                const roles = JSON.parse(unlockedRoles);
                stats.unlockedRoles = Array.isArray(roles) ? roles.length : 0;
            }
        } catch (e) {
            console.error('获取解锁角色失败:', e);
        }

        // 获得徽章数
        try {
            const achievements = localStorage.getItem('lsq_achievements');
            if (achievements) {
                const achData = JSON.parse(achievements);
                stats.achievements = achData.unlocked ? achData.unlocked.length : 0;
            }
        } catch (e) {
            console.error('获取徽章数失败:', e);
        }

        return stats;
    }

    // 获取加入日期
    function getJoinDate() {
        try {
            // 尝试从userId获取
            const userId = localStorage.getItem('lsq_userId');
            if (userId) {
                const timestamp = userId.split('_')[1];
                if (timestamp) {
                    const date = new Date(parseInt(timestamp));
                    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
                }
            }
            
            // 从首次测试或解锁记录获取
            const unlockedRoles = localStorage.getItem('lsq_unlockedRoles');
            if (unlockedRoles) {
                const roles = JSON.parse(unlockedRoles);
                if (Array.isArray(roles) && roles.length > 0) {
                    const firstRole = roles[0];
                    if (firstRole.unlockDate) {
                        const date = new Date(firstRole.unlockDate);
                        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
                    }
                }
            }
        } catch (e) {
            console.error('获取加入日期失败:', e);
        }
        return '今天';
    }

    // 获取最近一次测试结果
    function getLastTestResult() {
        try {
            const result = localStorage.getItem('lsq_testResult');
            if (result) {
                return JSON.parse(result);
            }
        } catch (e) {
            console.error('获取测试结果失败:', e);
        }
        return null;
    }

    // 渲染测试历史
    function renderTestHistory() {
        const container = document.getElementById('test-history-container');
        if (!container) return;

        const tests = getTestHistory();
        
        if (tests.length === 0) {
            container.innerHTML = `
                <div class="empty-history">
                    <p>还没有测试记录</p>
                    <a href="../index.html" class="btn-primary" style="display:inline-block;padding:0.75rem 1.5rem;text-decoration:none;">开始首次测试</a>
                </div>
            `;
            return;
        }

        // 显示最近3条记录
        const recentTests = tests.slice(0, 3);
        
        container.innerHTML = `
            <div class="test-history-list">
                ${recentTests.map(test => `
                    <div class="test-history-item" onclick="window.location.href='../index.html#result'">
                        <span class="test-date">${formatDate(test.date)}</span>
                        <div class="test-archetype">
                            <span class="archetype-name">${test.archetypeName || '未知原型'}</span>
                            <span class="character-name">${test.characterName || ''}</span>
                        </div>
                        <span class="test-match">${test.matchPercentage || 0}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 获取测试历史
    function getTestHistory() {
        const tests = [];
        
        try {
            // 从lsq_tests获取
            const testsData = localStorage.getItem('lsq_tests');
            if (testsData) {
                const parsed = JSON.parse(testsData);
                if (Array.isArray(parsed)) {
                    parsed.forEach(test => {
                        tests.push({
                            date: test.date || test.timestamp,
                            archetypeName: test.archetypeName || getArchetypeName(test.archetype),
                            characterName: test.characterName,
                            matchPercentage: test.matchPercentage
                        });
                    });
                }
            }
            
            // 如果没有tests但有testResult，添加当前结果
            if (tests.length === 0) {
                const result = localStorage.getItem('lsq_testResult');
                if (result) {
                    const parsed = JSON.parse(result);
                    tests.push({
                        date: new Date().toISOString(),
                        archetypeName: getArchetypeName(parsed.archetype),
                        characterName: parsed.character?.name,
                        matchPercentage: parsed.matchPercentage
                    });
                }
            }
        } catch (e) {
            console.error('获取测试历史失败:', e);
        }
        
        // 按日期倒序
        return tests.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // 获取原型名称
    function getArchetypeName(archetypeId) {
        return ARCHETYPES[archetypeId]?.name || archetypeId;
    }

    // 格式化日期
    function formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
        } catch (e) {
            return '--/--';
        }
    }

    // 渲染角色收集预览
    function renderCollectionPreview() {
        const container = document.getElementById('collection-preview-container');
        if (!container) return;

        // 获取已解锁角色
        let unlockedIds = [];
        try {
            const unlockedRoles = localStorage.getItem('lsq_unlockedRoles');
            if (unlockedRoles) {
                const roles = JSON.parse(unlockedRoles);
                unlockedIds = roles.map(r => r.archetypeId);
            }
        } catch (e) {
            console.error('获取已解锁角色失败:', e);
        }

        const totalArchetypes = Object.keys(ARCHETYPES).length;
        const unlockedCount = unlockedIds.length;
        const progressPercent = Math.round((unlockedCount / totalArchetypes) * 100);

        // 渲染12个原型卡片
        let html = '<div class="collection-preview">';
        Object.entries(ARCHETYPES).forEach(([id, archetype]) => {
            const isUnlocked = unlockedIds.includes(id);
            html += `
                <div class="collection-item ${isUnlocked ? 'unlocked' : 'locked'}" 
                     onclick="window.location.href='../collection/index.html'"
                     title="${isUnlocked ? archetype.name : '未解锁'}">
                    <span class="role-icon">${isUnlocked ? archetype.icon : '🔒'}</span>
                    <span class="role-name">${archetype.name}</span>
                </div>
            `;
        });
        html += '</div>';

        // 添加进度条
        html += `
            <div class="collection-progress">
                <span class="progress-text">收集进度</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <span class="progress-percent">${progressPercent}%</span>
            </div>
        `;

        container.innerHTML = html;
    }

    // 渲染徽章预览
    function renderBadgesPreview() {
        const container = document.getElementById('badges-preview-container');
        if (!container) return;

        // 获取已解锁徽章
        let unlockedIds = [];
        let totalPoints = 0;
        let earnedPoints = 0;
        
        try {
            const achievements = localStorage.getItem('lsq_achievements');
            if (achievements) {
                const achData = JSON.parse(achievements);
                unlockedIds = achData.unlocked || [];
            }
        } catch (e) {
            console.error('获取徽章失败:', e);
        }

        // 收集所有徽章定义
        const allBadges = [];
        if (window.ACHIEVEMENTS) {
            Object.values(window.ACHIEVEMENTS).forEach(category => {
                if (category.achievements) {
                    category.achievements.forEach(ach => {
                        allBadges.push(ach);
                        totalPoints += ach.points || 0;
                        if (unlockedIds.includes(ach.id)) {
                            earnedPoints += ach.points || 0;
                        }
                    });
                }
            });
        }

        // 显示前6个徽章（优先显示已解锁的）
        const sortedBadges = allBadges.sort((a, b) => {
            const aUnlocked = unlockedIds.includes(a.id);
            const bUnlocked = unlockedIds.includes(b.id);
            return bUnlocked - aUnlocked;
        }).slice(0, 6);

        let html = '<div class="badges-preview">';
        sortedBadges.forEach(badge => {
            const isUnlocked = unlockedIds.includes(badge.id);
            html += `
                <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}" title="${badge.description}">
                    <span class="badge-icon">${badge.icon}</span>
                    <span class="badge-name">${badge.name}</span>
                </div>
            `;
        });
        html += '</div>';

        // 添加汇总信息
        const totalBadges = allBadges.length;
        const unlockedBadges = unlockedIds.length;
        html += `
            <div class="badges-summary">
                <span class="summary-text">已解锁 ${unlockedBadges}/${totalBadges} 个徽章</span>
                <span class="points">${earnedPoints} 积分</span>
            </div>
        `;

        container.innerHTML = html;
    }

    // 渲染21天计划进度
    function renderPlanProgress() {
        const container = document.getElementById('plan-progress-container');
        if (!container) return;

        // 获取计划进度
        let planData = {
            active: false,
            currentDay: 0,
            completedDays: [],
            archetype: null
        };

        try {
            // 从achievementProgress获取计划进度
            const progress = localStorage.getItem('lsq_achievementProgress');
            if (progress) {
                const parsed = JSON.parse(progress);
                if (parsed.persistence && parsed.persistence.planProgress) {
                    const plans = parsed.persistence.planProgress;
                    // 找到进度最大的计划
                    let maxDays = 0;
                    let activeArchetype = null;
                    Object.entries(plans).forEach(([archetype, days]) => {
                        if (days > maxDays) {
                            maxDays = days;
                            activeArchetype = archetype;
                        }
                    });
                    
                    if (maxDays > 0) {
                        planData.active = true;
                        planData.currentDay = maxDays;
                        planData.archetype = activeArchetype;
                        // 模拟已完成的天数（实际应从打卡记录计算）
                        planData.completedDays = Array.from({length: maxDays}, (_, i) => i + 1);
                    }
                }
            }

            // 检查是否有选中的原型
            if (!planData.active) {
                const selectedArchetype = localStorage.getItem('lsq_selected_archetype');
                if (selectedArchetype) {
                    planData.archetype = selectedArchetype;
                }
            }
        } catch (e) {
            console.error('获取计划进度失败:', e);
        }

        // 如果没有计划数据，显示引导
        if (!planData.active && !planData.archetype) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 2rem 1rem;">
                    <div class="empty-state-icon">🎯</div>
                    <h3>开始你的改变之旅</h3>
                    <p>21天行动计划，重塑你的人生剧本</p>
                    <a href="../guidance/index.html" class="btn-primary" style="display:inline-block;padding:0.75rem 1.5rem;text-decoration:none;">启动计划</a>
                </div>
            `;
            return;
        }

        // 渲染计划进度
        const archetypeName = planData.archetype ? getArchetypeName(planData.archetype) : '未知';
        const isCompleted = planData.currentDay >= 21;
        
        let daysHtml = '';
        for (let i = 1; i <= 21; i++) {
            let dayClass = '';
            if (planData.completedDays.includes(i)) {
                dayClass = 'completed';
            } else if (i === planData.currentDay + 1) {
                dayClass = 'current';
            }
            daysHtml += `<div class="plan-day ${dayClass}" title="第${i}天">${i}</div>`;
        }

        container.innerHTML = `
            <div class="plan-progress-card">
                <div class="plan-header">
                    <span class="plan-title">${archetypeName}的改变计划</span>
                    <span class="plan-status ${planData.active ? '' : 'inactive'}">${isCompleted ? '已完成' : (planData.active ? '进行中' : '未开始')}</span>
                </div>
                <div class="plan-days">
                    ${daysHtml}
                </div>
                <div class="plan-stats">
                    <span>已完成 <span class="stat-highlight">${planData.completedDays.length}</span>/21 天</span>
                    <span>进度 <span class="stat-highlight">${Math.round((planData.completedDays.length / 21) * 100)}%</span></span>
                </div>
            </div>
        `;
    }

    // 设置事件监听
    function setupEventListeners() {
        // 事件监听已设置
    }

    // 显示提示
    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);

    // 暴露到全局
    window.ProfilePage = {
        init,
        getUserStats: calculateUserStats,
        getTestHistory
    };

})();
