/**
 * 每日觉察日记系统
 * 数据结构：日期、内容、关联原型、情绪标签、关联任务
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'lsq_diaries';
    const STORAGE_PREFIX = 'lsq_';

    // 情绪标签选项
    const EMOTION_TAGS = [
        { id: 'calm', name: '平静', emoji: '😌', color: '#90EE90' },
        { id: 'happy', name: '开心', emoji: '😊', color: '#FFD700' },
        { id: 'excited', name: '兴奋', emoji: '🤩', color: '#FF6347' },
        { id: 'anxious', name: '焦虑', emoji: '😰', color: '#FFA500' },
        { id: 'sad', name: '难过', emoji: '😢', color: '#6495ED' },
        { id: 'angry', name: '愤怒', emoji: '😠', color: '#DC143C' },
        { id: 'confused', name: '困惑', emoji: '😕', color: '#9370DB' },
        { id: 'grateful', name: '感恩', emoji: '🙏', color: '#FF69B4' }
    ];

    // 获取所有日记
    function getAllDiaries() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // 保存所有日记
    function saveAllDiaries(diaries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries));
    }

    // 根据ID获取日记
    function getDiaryById(id) {
        const diaries = getAllDiaries();
        return diaries.find(d => d.id === id);
    }

    // 根据日期获取日记
    function getDiaryByDate(date) {
        const diaries = getAllDiaries();
        return diaries.find(d => d.date === date);
    }

    // 创建新日记
    function createDiary(data) {
        const diaries = getAllDiaries();
        const now = new Date();
        
        const diary = {
            id: 'diary_' + now.getTime(),
            date: data.date || formatDate(now),
            content: data.content || '',
            emotions: data.emotions || [],
            archetype: data.archetype || localStorage.getItem('lsq_selected_archetype') || '',
            relatedTaskDay: data.relatedTaskDay || null,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        };
        
        diaries.unshift(diary);
        saveAllDiaries(diaries);
        return diary;
    }

    // 更新日记
    function updateDiary(id, data) {
        const diaries = getAllDiaries();
        const index = diaries.findIndex(d => d.id === id);
        
        if (index === -1) return null;
        
        diaries[index] = {
            ...diaries[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        
        saveAllDiaries(diaries);
        return diaries[index];
    }

    // 删除日记
    function deleteDiary(id) {
        const diaries = getAllDiaries();
        const filtered = diaries.filter(d => d.id !== id);
        saveAllDiaries(filtered);
        return filtered.length < diaries.length;
    }

    // 获取某月的日记
    function getDiariesByMonth(year, month) {
        const diaries = getAllDiaries();
        return diaries.filter(d => {
            const dDate = new Date(d.date);
            return dDate.getFullYear() === year && dDate.getMonth() === month;
        });
    }

    // 获取最近N篇日记
    function getRecentDiaries(count = 7) {
        const diaries = getAllDiaries();
        return diaries.slice(0, count);
    }

    // 获取统计信息
    function getDiaryStats() {
        const diaries = getAllDiaries();
        const emotions = {};
        
        diaries.forEach(d => {
            d.emotions.forEach(e => {
                emotions[e] = (emotions[e] || 0) + 1;
            });
        });
        
        return {
            total: diaries.length,
            emotions: emotions,
            streak: calculateStreak(diaries)
        };
    }

    // 计算连续打卡天数
    function calculateStreak(diaries) {
        if (diaries.length === 0) return 0;
        
        const dates = diaries.map(d => d.date).sort().reverse();
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

    // 获取今天的21天任务
    function getTodayTask() {
        const plan = JSON.parse(localStorage.getItem('lsq_plan') || 'null');
        if (!plan || !plan.days) return null;
        
        const completedDays = plan.days.filter(d => d.completed).length;
        const todayDay = completedDays + 1;
        
        if (todayDay <= 21) {
            return {
                day: todayDay,
                task: plan.days[todayDay - 1]?.task || ''
            };
        }
        return null;
    }

    // 获取原型列表
    function getArchetypeList() {
        const archetypes = [];
        const testResult = localStorage.getItem('lsq_testResult');
        
        if (testResult) {
            try {
                const result = JSON.parse(testResult);
                if (result.archetype) {
                    archetypes.push({
                        key: result.archetype,
                        name: getArchetypeName(result.archetype)
                    });
                }
            } catch (e) {
                console.error('解析测试结果失败:', e);
            }
        }
        
        const selected = localStorage.getItem('lsq_selected_archetype');
        if (selected && !archetypes.find(a => a.key === selected)) {
            archetypes.push({
                key: selected,
                name: getArchetypeName(selected)
            });
        }
        
        return archetypes;
    }

    function getArchetypeName(key) {
        const names = {
            'orphan': '孤勇者',
            'caregiver': '讨好者',
            'hermit': '隐士',
            'ruler': '控制狂',
            'victim': '受害者',
            'jester': '表演者',
            'savior': '拯救者',
            'explorer': '漫游者',
            'warrior': '战士',
            'healer': '治愈者',
            'sage': '观察者',
            'awakener': '觉醒者'
        };
        return names[key] || key;
    }

    // 公开API
    window.DiaryService = {
        EMOTION_TAGS,
        getAllDiaries,
        getDiaryById,
        getDiaryByDate,
        createDiary,
        updateDiary,
        deleteDiary,
        getDiariesByMonth,
        getRecentDiaries,
        getDiaryStats,
        getTodayTask,
        getArchetypeList,
        formatDate
    };
})();
