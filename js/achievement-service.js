/**
 * 成就系统服务层
 * 处理成就解锁检测、进度追踪、存储管理
 */

(function() {
  'use strict';

  // 存储键名
  const STORAGE_KEYS = {
    unlocked: 'lsq_achievements',
    progress: 'lsq_achievementProgress',
    checkIns: 'lsq_dailyCheckIns'
  };

  // 成就服务
  const AchievementService = {
    // ==================== 数据获取 ====================
    
    /**
     * 获取所有成就定义
     */
    getAllAchievements() {
      return window.ACHIEVEMENTS || {};
    },

    /**
     * 获取已解锁成就
     */
    getUnlockedAchievements() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.unlocked);
        return data ? JSON.parse(data) : { unlocked: [], unlockedAt: {} };
      } catch (e) {
        console.error('获取已解锁成就失败:', e);
        return { unlocked: [], unlockedAt: {} };
      }
    },

    /**
     * 获取成就进度
     */
    getProgress() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.progress);
        return data ? JSON.parse(data) : this.getDefaultProgress();
      } catch (e) {
        console.error('获取成就进度失败:', e);
        return this.getDefaultProgress();
      }
    },

    /**
     * 默认进度结构
     */
    getDefaultProgress() {
      return {
        exploration: {
          charactersViewed: [],
          archetypesViewed: []
        },
        persistence: {
          currentStreak: 0,
          maxStreak: 0,
          totalCheckIns: 0,
          planProgress: {}
        },
        insight: {
          totalCheckIns: 0,
          toolsUsed: 0,
          emergencyToolsUsed: 0
        },
        sharing: {
          totalShares: 0
        }
      };
    },

    // ==================== 成就检测 ====================

    /**
     * 检测并解锁成就
     * @param {string} type - 行为类型
     * @param {object} data - 行为数据
     * @returns {array} 新解锁的成就列表
     */
    checkAndUnlock(type, data = {}) {
      const achievements = this.getAllAchievements();
      const unlocked = this.getUnlockedAchievements();
      const progress = this.getProgress();
      const newlyUnlocked = [];

      // 更新进度
      this.updateProgress(type, data, progress);

      // 遍历所有成就检测是否满足条件
      Object.keys(achievements).forEach(category => {
        achievements[category].achievements.forEach(achievement => {
          // 已解锁的跳过
          if (unlocked.unlocked.includes(achievement.id)) {
            return;
          }

          // 检测是否满足条件
          if (this.checkCondition(achievement.condition, progress, data)) {
            unlocked.unlocked.push(achievement.id);
            unlocked.unlockedAt[achievement.id] = new Date().toISOString();
            newlyUnlocked.push(achievement);
          }
        });
      });

      // 保存数据
      if (newlyUnlocked.length > 0) {
        this.saveUnlocked(unlocked);
        this.showUnlockAnimation(newlyUnlocked);
      }

      this.saveProgress(progress);
      return newlyUnlocked;
    },

    /**
     * 检测单个成就是否满足条件
     */
    checkCondition(condition, progress, data) {
      switch (condition.type) {
        case 'first_test':
          return data.testCompleted === true;
        
        case 'view_result_detail':
          return data.viewedDetail === true;
        
        case 'view_archetypes':
          return progress.exploration.archetypesViewed.length >= condition.count;
        
        case 'view_characters':
          return progress.exploration.charactersViewed.length >= condition.count;
        
        case 'enter_guidance':
          return data.enteredGuidance === true;
        
        case 'start_plan':
          return data.planStarted === true;
        
        case 'plan_progress':
          const planDays = Object.values(progress.persistence.planProgress);
          const maxDays = Math.max(0, ...planDays);
          return maxDays >= condition.days;
        
        case 'checkin_streak':
          return progress.persistence.currentStreak >= condition.days;
        
        case 'monthly_checkin':
          return this.getMonthlyCheckInCount() >= condition.days;
        
        case 'daily_checkin':
          return progress.insight.totalCheckIns >= condition.count;
        
        case 'mood_tracking':
          return this.getMoodTrackingDays() >= condition.days;
        
        case 'view_timeline':
          return data.viewedTimeline === true;
        
        case 'use_tool':
          return progress.insight.toolsUsed >= condition.count;
        
        case 'use_emergency_tool':
          return progress.insight.emergencyToolsUsed >= condition.count;
        
        case 'share_result':
          return progress.sharing.totalShares >= condition.count;
        
        case 'share_achievement':
          return data.sharedAchievement === true;
        
        default:
          return false;
      }
    },

    /**
     * 更新进度
     */
    updateProgress(type, data, progress) {
      switch (type) {
        case 'view_archetype':
          if (data.archetype && !progress.exploration.archetypesViewed.includes(data.archetype)) {
            progress.exploration.archetypesViewed.push(data.archetype);
          }
          break;
        
        case 'view_character':
          if (data.character && !progress.exploration.charactersViewed.includes(data.character)) {
            progress.exploration.charactersViewed.push(data.character);
          }
          break;
        
        case 'daily_checkin':
          progress.insight.totalCheckIns++;
          progress.persistence.totalCheckIns++;
          progress.persistence.currentStreak = this.calculateStreak();
          progress.persistence.maxStreak = Math.max(
            progress.persistence.maxStreak,
            progress.persistence.currentStreak
          );
          break;
        
        case 'use_tool':
          progress.insight.toolsUsed++;
          break;
        
        case 'use_emergency_tool':
          progress.insight.emergencyToolsUsed++;
          break;
        
        case 'share':
          progress.sharing.totalShares++;
          break;
        
        case 'plan_progress':
          if (data.archetype && data.day) {
            progress.persistence.planProgress[data.archetype] = Math.max(
              progress.persistence.planProgress[data.archetype] || 0,
              data.day
            );
          }
          break;
      }
    },

    // ==================== 存储操作 ====================

    saveUnlocked(unlocked) {
      try {
        localStorage.setItem(STORAGE_KEYS.unlocked, JSON.stringify(unlocked));
      } catch (e) {
        console.error('保存已解锁成就失败:', e);
      }
    },

    saveProgress(progress) {
      try {
        localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
      } catch (e) {
        console.error('保存成就进度失败:', e);
      }
    },

    // ==================== 统计计算 ====================

    /**
     * 计算连续打卡天数
     */
    calculateStreak() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.checkIns);
        if (!data) return 0;
        
        const checkIns = JSON.parse(data);
        const dates = Object.keys(checkIns).sort().reverse();
        
        if (dates.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (const dateStr of dates) {
          const checkDate = new Date(dateStr);
          checkDate.setHours(0, 0, 0, 0);
          
          const diffDays = Math.floor((currentDate - checkDate) / (1000 * 60 * 60 * 24));
          
          if (diffDays === streak) {
            streak++;
          } else {
            break;
          }
        }
        
        return streak;
      } catch (e) {
        return 0;
      }
    },

    /**
     * 获取本月打卡天数
     */
    getMonthlyCheckInCount() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.checkIns);
        if (!data) return 0;
        
        const checkIns = JSON.parse(data);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return Object.keys(checkIns).filter(dateStr => {
          const date = new Date(dateStr);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;
      } catch (e) {
        return 0;
      }
    },

    /**
     * 获取情绪记录天数
     */
    getMoodTrackingDays() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.checkIns);
        if (!data) return 0;
        
        const checkIns = JSON.parse(data);
        return Object.values(checkIns).filter(entry => entry.mood !== undefined).length;
      } catch (e) {
        return 0;
      }
    },

    // ==================== UI 反馈 ====================

    /**
     * 显示成就解锁动画
     */
    showUnlockAnimation(achievements) {
      // 触发自定义事件，由UI层处理
      window.dispatchEvent(new CustomEvent('achievementUnlocked', {
        detail: { achievements }
      }));
    },

    /**
     * 获取统计信息
     */
    getStats() {
      const achievements = this.getAllAchievements();
      const unlocked = this.getUnlockedAchievements();
      const totalPoints = Object.keys(achievements).reduce((sum, category) => {
        return sum + achievements[category].achievements.reduce((s, a) => s + a.points, 0);
      }, 0);
      
      const earnedPoints = unlocked.unlocked.reduce((sum, id) => {
        Object.keys(achievements).forEach(cat => {
          const ach = achievements[cat].achievements.find(a => a.id === id);
          if (ach) sum += ach.points;
        });
        return sum;
      }, 0);

      return {
        total: window.ACHIEVEMENT_STATS?.total || 20,
        unlocked: unlocked.unlocked.length,
        totalPoints,
        earnedPoints,
        progress: Math.round((unlocked.unlocked.length / (window.ACHIEVEMENT_STATS?.total || 20)) * 100)
      };
    }
  };

  // 导出
  window.AchievementService = AchievementService;

})();
