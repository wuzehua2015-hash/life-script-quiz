/**
 * 改变轨迹时间轴系统
 * 整合测试历史、日记、情绪打卡、徽章、角色收集数据
 * 展示用户成长历程和里程碑事件
 */

(function() {
    'use strict';

    const STORAGE_PREFIX = 'lsq_';

    // ==================== 数据获取 ====================

    // 获取所有时间轴事件
    function getTimelineEvents() {
        const events = [];

        // 1. 测试历史事件
        events.push(...getTestEvents());

        // 2. 角色解锁事件
        events.push(...getRoleUnlockEvents());

        // 3. 徽章获得事件
        events.push(...getBadgeEvents());

        // 4. 日记记录事件
        events.push(...getDiaryEvents());

        // 5. 情绪打卡事件
        events.push(...getMoodEvents());

        // 6. 21天计划里程碑
        events.push(...getPlanMilestoneEvents());

        // 按日期排序（最新的在前）
        return events.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // 获取测试历史事件
    function getTestEvents() {
        const events = [];
        
        try {
            // 从lsq_tests获取
            const testsData = localStorage.getItem(STORAGE_PREFIX + 'tests');
            if (testsData) {
                const tests = JSON.parse(testsData);
                if (Array.isArray(tests)) {
                    tests.forEach((test, index) => {
                        events.push({
                            id: 'test_' + test.id,
                            type: 'test',
                            subtype: index === 0 ? 'first_test' : 'retest',
                            date: test.date || test.timestamp,
                            title: index === 0 ? '完成人生剧本测试' : '重新测试',
                            description: `发现你的原型：${test.archetypeName || getArchetypeName(test.archetype)}`,
                            icon: index === 0 ? '🌟' : '🔄',
                            color: '#FFD700',
                            data: test,
                            milestone: index === 0 // 首次测试是里程碑
                        });
                    });
                }
            }
            
            // 如果没有tests但有testResult，添加当前结果
            if (events.length === 0) {
                const result = localStorage.getItem(STORAGE_PREFIX + 'testResult');
                if (result) {
                    const parsed = JSON.parse(result);
                    events.push({
                        id: 'test_current',
                        type: 'test',
                        subtype: 'first_test',
                        date: new Date().toISOString(),
                        title: '完成人生剧本测试',
                        description: `发现你的原型：${getArchetypeName(parsed.archetype)}`,
                        icon: '🌟',
                        color: '#FFD700',
                        data: parsed,
                        milestone: true
                    });
                }
            }
        } catch (e) {
            console.error('获取测试事件失败:', e);
        }
        
        return events;
    }

    // 获取角色解锁事件
    function getRoleUnlockEvents() {
        const events = [];
        
        try {
            const unlockedRoles = localStorage.getItem(STORAGE_PREFIX + 'unlockedRoles');
            if (unlockedRoles) {
                const roles = JSON.parse(unlockedRoles);
                if (Array.isArray(roles)) {
                    roles.forEach(role => {
                        events.push({
                            id: 'role_' + role.archetypeId,
                            type: 'role',
                            subtype: 'unlock',
                            date: role.unlockDate,
                            title: `解锁角色：${getArchetypeName(role.archetypeId)}`,
                            description: role.characterName ? `${role.characterName} (${role.characterWork})` : '新的角色已解锁',
                            icon: getArchetypeIcon(role.archetypeId),
                            color: getArchetypeColor(role.archetypeId),
                            data: role,
                            milestone: false
                        });
                    });
                }
            }
        } catch (e) {
            console.error('获取角色解锁事件失败:', e);
        }
        
        return events;
    }

    // 获取徽章获得事件
    function getBadgeEvents() {
        const events = [];
        
        try {
            const achievements = localStorage.getItem(STORAGE_PREFIX + 'achievements');
            if (achievements) {
                const achData = JSON.parse(achievements);
                if (achData.unlocked && Array.isArray(achData.unlocked)) {
                    achData.unlocked.forEach(achId => {
                        const badge = findBadgeById(achId);
                        if (badge) {
                            events.push({
                                id: 'badge_' + achId,
                                type: 'badge',
                                subtype: badge.condition.type,
                                date: achData.unlockDates?.[achId] || new Date().toISOString(),
                                title: `获得徽章：${badge.name}`,
                                description: badge.description,
                                icon: badge.icon,
                                color: getBadgeColor(badge.condition.type),
                                data: badge,
                                milestone: isMilestoneBadge(badge)
                            });
                        }
                    });
                }
            }
        } catch (e) {
            console.error('获取徽章事件失败:', e);
        }
        
        return events;
    }

    // 获取日记事件
    function getDiaryEvents() {
        const events = [];
        
        try {
            const diaries = localStorage.getItem(STORAGE_PREFIX + 'diaries');
            if (diaries) {
                const diaryList = JSON.parse(diaries);
                if (Array.isArray(diaryList)) {
                    diaryList.forEach((diary, index) => {
                        // 只显示重要的日记（如第一篇、里程碑日记）
                        const isFirst = index === diaryList.length - 1;
                        const isMilestone = isFirst || diary.content?.length > 100;
                        
                        if (isMilestone || index % 5 === 0) { // 每5篇显示一篇
                            events.push({
                                id: diary.id,
                                type: 'diary',
                                subtype: isFirst ? 'first_diary' : 'daily',
                                date: diary.createdAt,
                                title: isFirst ? '写下第一篇觉察日记' : '觉察日记',
                                description: diary.content?.substring(0, 50) + (diary.content?.length > 50 ? '...' : '') || '记录当下感受',
                                icon: '📝',
                                color: '#90EE90',
                                data: diary,
                                milestone: isFirst
                            });
                        }
                    });
                }
            }
        } catch (e) {
            console.error('获取日记事件失败:', e);
        }
        
        return events;
    }

    // 获取情绪打卡事件
    function getMoodEvents() {
        const events = [];
        
        try {
            const moodCheckins = localStorage.getItem(STORAGE_PREFIX + 'moodCheckins');
            if (moodCheckins) {
                const checkins = JSON.parse(moodCheckins);
                if (Array.isArray(checkins)) {
                    // 获取连续打卡里程碑
                    const streaks = calculateStreakMilestones(checkins);
                    streaks.forEach(streak => {
                        events.push({
                            id: 'mood_streak_' + streak.days,
                            type: 'mood',
                            subtype: 'streak',
                            date: streak.date,
                            title: `连续打卡 ${streak.days} 天`,
                            description: '坚持记录情绪变化',
                            icon: '🔥',
                            color: '#FF6347',
                            data: { days: streak.days },
                            milestone: streak.days >= 7
                        });
                    });

                    // 第一篇情绪记录
                    if (checkins.length > 0) {
                        const firstCheckin = checkins[checkins.length - 1];
                        events.push({
                            id: 'mood_first',
                            type: 'mood',
                            subtype: 'first_checkin',
                            date: firstCheckin.createdAt,
                            title: '开始情绪追踪',
                            description: '记录第一天的情绪状态',
                            icon: '😊',
                            color: '#FFD700',
                            data: firstCheckin,
                            milestone: true
                        });
                    }
                }
            }
        } catch (e) {
            console.error('获取情绪事件失败:', e);
        }
        
        return events;
    }

    // 获取21天计划里程碑事件
    function getPlanMilestoneEvents() {
        const events = [];
        
        try {
            const progress = localStorage.getItem(STORAGE_PREFIX + 'achievementProgress');
            if (progress) {
                const parsed = JSON.parse(progress);
                if (parsed.persistence && parsed.persistence.planProgress) {
                    Object.entries(parsed.persistence.planProgress).forEach(([archetype, days]) => {
                        // 第7天里程碑
                        if (days >= 7) {
                            events.push({
                                id: 'plan_7_' + archetype,
                                type: 'plan',
                                subtype: 'week_complete',
                                date: new Date().toISOString(), // 实际应从完成时间计算
                                title: '完成第一周改变计划',
                                description: `${getArchetypeName(archetype)} - 坚持7天，养成习惯`,
                                icon: '🌱',
                                color: '#27ae60',
                                data: { archetype, days: 7 },
                                milestone: true
                            });
                        }
                        
                        // 第21天里程碑
                        if (days >= 21) {
                            events.push({
                                id: 'plan_21_' + archetype,
                                type: 'plan',
                                subtype: 'plan_complete',
                                date: new Date().toISOString(),
                                title: '完成21天改变计划！',
                                description: `${getArchetypeName(archetype)} - 完成完整改变周期`,
                                icon: '🏆',
                                color: '#FFD700',
                                data: { archetype, days: 21 },
                                milestone: true
                            });
                        }
                    });
                }
            }
        } catch (e) {
            console.error('获取计划里程碑失败:', e);
        }
        
        return events;
    }

    // ==================== 辅助函数 ====================

    // 计算连续打卡里程碑
    function calculateStreakMilestones(checkins) {
        const milestones = [];
        const sorted = [...checkins].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        let currentStreak = 0;
        let lastDate = null;
        
        sorted.forEach(checkin => {
            const date = new Date(checkin.date);
            
            if (lastDate) {
                const diffDays = Math.floor((date - lastDate) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    currentStreak++;
                } else if (diffDays > 1) {
                    currentStreak = 1;
                }
            } else {
                currentStreak = 1;
            }
            
            lastDate = date;
            
            // 记录里程碑天数
            if ([3, 7, 14, 21, 30].includes(currentStreak)) {
                milestones.push({
                    days: currentStreak,
                    date: checkin.createdAt
                });
            }
        });
        
        return milestones;
    }

    // 查找徽章定义
    function findBadgeById(id) {
        if (typeof window.ACHIEVEMENTS === 'undefined') return null;
        
        for (const category of Object.values(window.ACHIEVEMENTS)) {
            const badge = category.achievements?.find(a => a.id === id);
            if (badge) return badge;
        }
        return null;
    }

    // 判断是否是里程碑徽章
    function isMilestoneBadge(badge) {
        const milestoneTypes = ['plan_progress', 'checkin_streak', 'monthly_checkin'];
        return milestoneTypes.includes(badge.condition.type);
    }

    // 获取徽章颜色
    function getBadgeColor(type) {
        const colors = {
            'first_test': '#FFD700',
            'view_result_detail': '#3498db',
            'view_archetypes': '#9b59b6',
            'view_characters': '#e74c3c',
            'enter_guidance': '#27ae60',
            'start_plan': '#f39c12',
            'plan_progress': '#e67e22',
            'checkin_streak': '#e74c3c',
            'monthly_checkin': '#16a085',
            'daily_checkin': '#2ecc71',
            'mood_tracking': '#3498db',
            'view_timeline': '#9b59b6',
            'use_tool': '#1abc9c',
            'use_emergency_tool': '#e74c3c',
            'share_result': '#3498db',
            'share_achievement': '#f39c12'
        };
        return colors[type] || '#95a5a6';
    }

    // 获取原型名称
    function getArchetypeName(key) {
        const names = {
            'lone_hero': '孤勇者',
            'orphan': '孤勇者',
            'pleaser': '讨好者',
            'caregiver': '讨好者',
            'hermit': '隐士',
            'controller': '控制狂',
            'ruler': '控制狂',
            'victim': '受害者',
            'performer': '表演者',
            'jester': '表演者',
            'savior': '拯救者',
            'rescuer': '拯救者',
            'wanderer': '漫游者',
            'explorer': '漫游者',
            'warrior': '战士',
            'healer': '治愈者',
            'observer': '观察者',
            'sage': '观察者',
            'awakener': '觉醒者'
        };
        return names[key] || key;
    }

    // 获取原型图标
    function getArchetypeIcon(key) {
        const icons = {
            'lone_hero': '⚔️',
            'orphan': '⚔️',
            'pleaser': '😢',
            'caregiver': '😢',
            'hermit': '🏔️',
            'controller': '🎮',
            'ruler': '🎮',
            'victim': '😔',
            'performer': '🎭',
            'jester': '🎭',
            'savior': '🦸',
            'rescuer': '🦸',
            'wanderer': '🎒',
            'explorer': '🎒',
            'warrior': '⚔️',
            'healer': '💚',
            'observer': '🔍',
            'sage': '🔍',
            'awakener': '✨'
        };
        return icons[key] || '⭐';
    }

    // 获取原型颜色
    function getArchetypeColor(key) {
        const colors = {
            'lone_hero': '#e74c3c',
            'orphan': '#e74c3c',
            'pleaser': '#3498db',
            'caregiver': '#3498db',
            'hermit': '#95a5a6',
            'controller': '#9b59b6',
            'ruler': '#9b59b6',
            'victim': '#34495e',
            'performer': '#f39c12',
            'jester': '#f39c12',
            'savior': '#27ae60',
            'rescuer': '#27ae60',
            'wanderer': '#e67e22',
            'explorer': '#e67e22',
            'warrior': '#c0392b',
            'healer': '#16a085',
            'observer': '#2980b9',
            'sage': '#2980b9',
            'awakener': '#8e44ad'
        };
        return colors[key] || '#95a5a6';
    }

    // ==================== 统计数据 ====================

    // 获取改变轨迹统计
    function getJourneyStats() {
        const events = getTimelineEvents();
        const milestones = events.filter(e => e.milestone);
        
        // 计算各类事件数量
        const stats = {
            totalEvents: events.length,
            milestones: milestones.length,
            tests: events.filter(e => e.type === 'test').length,
            roles: events.filter(e => e.type === 'role').length,
            badges: events.filter(e => e.type === 'badge').length,
            diaries: events.filter(e => e.type === 'diary').length,
            moods: events.filter(e => e.type === 'mood').length,
            plans: events.filter(e => e.type === 'plan').length,
            firstEvent: events.length > 0 ? events[events.length - 1].date : null,
            lastEvent: events.length > 0 ? events[0].date : null
        };
        
        // 计算成长天数
        if (stats.firstEvent) {
            const first = new Date(stats.firstEvent);
            const now = new Date();
            stats.journeyDays = Math.floor((now - first) / (1000 * 60 * 60 * 24));
        } else {
            stats.journeyDays = 0;
        }
        
        return stats;
    }

    // ==================== 导出 ====================

    window.JourneyService = {
        getTimelineEvents,
        getJourneyStats,
        getArchetypeName,
        getArchetypeIcon,
        getArchetypeColor
    };

})();
