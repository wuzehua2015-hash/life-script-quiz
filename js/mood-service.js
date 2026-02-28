/**
 * 情绪追踪打卡系统
 * 5级情绪量表 + 原型触发点记录 + 趋势可视化
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'lsq_moodCheckins';

    // 5级情绪量表定义
    const MOOD_LEVELS = [
        { 
            level: 1, 
            name: '很低落', 
            emoji: '😢', 
            color: '#DC143C',
            desc: '感到沮丧、无力或悲伤'
        },
        { 
            level: 2, 
            name: '有点低', 
            emoji: '😕', 
            color: '#FFA500',
            desc: '感到焦虑、烦躁或不安'
        },
        { 
            level: 3, 
            name: '一般', 
            emoji: '😐', 
            color: '#9370DB',
            desc: '情绪平稳，没有特别的感觉'
        },
        { 
            level: 4, 
            name: '还不错', 
            emoji: '😊', 
            color: '#90EE90',
            desc: '感到轻松、愉快或满足'
        },
        { 
            level: 5, 
            name: '非常好', 
            emoji: '🤩', 
            color: '#FFD700',
            desc: '感到兴奋、充满活力或幸福'
        }
    ];

    // 原型触发点选项
    const TRIGGER_OPTIONS = [
        { id: 'work', name: '工作压力', icon: '💼' },
        { id: 'relationship', name: '人际关系', icon: '👥' },
        { id: 'family', name: '家庭关系', icon: '🏠' },
        { id: 'health', name: '身体健康', icon: '💪' },
        { id: 'finance', name: '经济状况', icon: '💰' },
        { id: 'self', name: '自我期望', icon: '🎯' },
        { id: 'future', name: '未来担忧', icon: '🔮' },
        { id: 'past', name: '过去经历', icon: '📜' },
        { id: 'achievement', name: '成就认可', icon: '🏆' },
        { id: 'other', name: '其他', icon: '📝' }
    ];

    // 获取所有打卡记录
    function getAllCheckins() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // 保存所有打卡记录
    function saveAllCheckins(checkins) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checkins));
    }

    // 创建新打卡
    function createCheckin(data) {
        const checkins = getAllCheckins();
        const now = new Date();
        const today = formatDate(now);
        
        // 检查今天是否已打卡
        const existingIndex = checkins.findIndex(c => c.date === today);
        
        const checkin = {
            id: 'mood_' + now.getTime(),
            date: today,
            level: data.level,
            emotions: data.emotions || [],
            triggers: data.triggers || [],
            note: data.note || '',
            archetype: data.archetype || localStorage.getItem('lsq_selected_archetype') || '',
            createdAt: now.toISOString()
        };
        
        if (existingIndex >= 0) {
            // 更新今天的打卡
            checkins[existingIndex] = checkin;
        } else {
            // 添加新打卡
            checkins.unshift(checkin);
        }
        
        saveAllCheckins(checkins);
        return checkin;
    }

    // 获取今天的打卡
    function getTodayCheckin() {
        const today = formatDate(new Date());
        const checkins = getAllCheckins();
        return checkins.find(c => c.date === today);
    }

    // 获取指定日期的打卡
    function getCheckinByDate(date) {
        const checkins = getAllCheckins();
        return checkins.find(c => c.date === date);
    }

    // 获取最近N天的打卡
    function getRecentCheckins(days = 7) {
        const checkins = getAllCheckins();
        const result = [];
        const today = new Date();
        
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = formatDate(date);
            const checkin = checkins.find(c => c.date === dateStr);
            result.push({
                date: dateStr,
                checkin: checkin || null
            });
        }
        
        return result.reverse();
    }

    // 获取情绪趋势数据
    function getMoodTrend(days = 7) {
        const recent = getRecentCheckins(days);
        return recent.map(item => ({
            date: item.date,
            level: item.checkin ? item.checkin.level : null,
            hasCheckin: !!item.checkin
        }));
    }

    // 获取统计数据
    function getMoodStats() {
        const checkins = getAllCheckins();
        if (checkins.length === 0) {
            return {
                total: 0,
                average: 0,
                streak: 0,
                mostCommonLevel: null,
                mostCommonTrigger: null
            };
        }

        // 计算平均情绪值
        const totalLevel = checkins.reduce((sum, c) => sum + c.level, 0);
        const average = (totalLevel / checkins.length).toFixed(1);

        // 计算最常见的情绪等级
        const levelCounts = {};
        checkins.forEach(c => {
            levelCounts[c.level] = (levelCounts[c.level] || 0) + 1;
        });
        const mostCommonLevel = Object.entries(levelCounts)
            .sort((a, b) => b[1] - a[1])[0][0];

        // 计算最常见的触发点
        const triggerCounts = {};
        checkins.forEach(c => {
            c.triggers.forEach(t => {
                triggerCounts[t] = (triggerCounts[t] || 0) + 1;
            });
        });
        const mostCommonTrigger = Object.entries(triggerCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        // 计算连续打卡天数
        const streak = calculateStreak(checkins);

        return {
            total: checkins.length,
            average: average,
            streak: streak,
            mostCommonLevel: parseInt(mostCommonLevel),
            mostCommonTrigger: mostCommonTrigger
        };
    }

    // 计算连续打卡天数
    function calculateStreak(checkins) {
        if (checkins.length === 0) return 0;
        
        const dates = checkins.map(c => c.date).sort().reverse();
        const today = formatDate(new Date());
        
        let streak = 0;
        let checkDate = today;
        
        for (let i = 0; i < dates.length; i++) {
            if (dates[i] === checkDate || (i === 0 && isYesterday(dates[i], checkDate))) {
                streak++;
                checkDate = getPrevDate(checkDate);
            } else if (dates[i] !== checkDate) {
                break;
            }
        }
        
        return streak;
    }

    // 获取原型相关的情绪模式
    function getArchetypeMoodPattern(archetype) {
        const checkins = getAllCheckins().filter(c => c.archetype === archetype);
        if (checkins.length === 0) return null;

        const levelCounts = {};
        const triggerCounts = {};
        
        checkins.forEach(c => {
            levelCounts[c.level] = (levelCounts[c.level] || 0) + 1;
            c.triggers.forEach(t => {
                triggerCounts[t] = (triggerCounts[t] || 0) + 1;
            });
        });

        const avgLevel = checkins.reduce((sum, c) => sum + c.level, 0) / checkins.length;
        
        return {
            archetype,
            total: checkins.length,
            averageLevel: avgLevel.toFixed(1),
            levelDistribution: levelCounts,
            commonTriggers: Object.entries(triggerCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([id, count]) => ({ id, count }))
        };
    }

    // 辅助函数
    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function isYesterday(dateStr, todayStr) {
        const yesterday = new Date(todayStr);
        yesterday.setDate(yesterday.getDate() - 1);
        return dateStr === formatDate(yesterday);
    }

    function getPrevDate(dateStr) {
        const d = new Date(dateStr);
        d.setDate(d.getDate() - 1);
        return formatDate(d);
    }

    // 获取原型名称
    function getArchetypeName(key) {
        const names = {
            'orphan': '孤勇者',
            'caregiver': '讨好者',
            'pleaser': '讨好者',
            'hermit': '隐士',
            'ruler': '控制狂',
            'controller': '控制狂',
            'victim': '受害者',
            'jester': '表演者',
            'performer': '表演者',
            'savior': '拯救者',
            'rescuer': '拯救者',
            'explorer': '漫游者',
            'wanderer': '漫游者',
            'warrior': '战士',
            'healer': '治愈者',
            'sage': '观察者',
            'observer': '观察者',
            'awakener': '觉醒者'
        };
        return names[key] || key;
    }

    // 公开API
    window.MoodService = {
        MOOD_LEVELS,
        TRIGGER_OPTIONS,
        getAllCheckins,
        createCheckin,
        getTodayCheckin,
        getCheckinByDate,
        getRecentCheckins,
        getMoodTrend,
        getMoodStats,
        getArchetypeMoodPattern,
        formatDate
    };
})();
