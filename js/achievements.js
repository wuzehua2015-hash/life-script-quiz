/**
 * 成就系统数据定义
 * v2.4 成就系统
 */

const ACHIEVEMENTS = {
  // ==================== 探索类 ====================
  exploration: {
    name: '探索类',
    description: '探索自我，了解不同面向',
    icon: '🔍',
    achievements: [
      {
        id: 'explore_1',
        name: '初次觉醒',
        description: '完成人生剧本测试，发现你的原型',
        icon: '🌟',
        condition: {
          type: 'first_test',
          count: 1
        },
        points: 10
      },
      {
        id: 'explore_2',
        name: '深度探索',
        description: '查看完整的结果分析报告',
        icon: '📊',
        condition: {
          type: 'view_result_detail',
          count: 1
        },
        points: 10
      },
      {
        id: 'explore_3',
        name: '原型大师',
        description: '了解全部12种人生剧本原型',
        icon: '📚',
        condition: {
          type: 'view_archetypes',
          count: 12
        },
        points: 20
      },
      {
        id: 'explore_4',
        name: '角色研究员',
        description: '查看5个不同角色的详细档案',
        icon: '🎭',
        condition: {
          type: 'view_characters',
          count: 5
        },
        points: 15
      },
      {
        id: 'explore_5',
        name: '改变启程',
        description: '首次进入行动指导，开始改变之旅',
        icon: '🚀',
        condition: {
          type: 'enter_guidance',
          count: 1
        },
        points: 10
      }
    ]
  },

  // ==================== 坚持类 ====================
  persistence: {
    name: '坚持类',
    description: '持续行动，养成习惯',
    icon: '🔥',
    achievements: [
      {
        id: 'persist_1',
        name: '开始改变',
        description: '启动21天改变计划',
        icon: '🎯',
        condition: {
          type: 'start_plan',
          count: 1
        },
        points: 10
      },
      {
        id: 'persist_2',
        name: '第一周',
        description: '完成21天计划的第7天',
        icon: '🌱',
        condition: {
          type: 'plan_progress',
          days: 7
        },
        points: 15
      },
      {
        id: 'persist_3',
        name: '坚持到底',
        description: '完成完整的21天改变计划',
        icon: '🏆',
        condition: {
          type: 'plan_progress',
          days: 21
        },
        points: 50
      },
      {
        id: 'persist_4',
        name: '连续3天',
        description: '每日觉察打卡连续3天',
        icon: '🔥',
        condition: {
          type: 'checkin_streak',
          days: 3
        },
        points: 10
      },
      {
        id: 'persist_5',
        name: '连续7天',
        description: '每日觉察打卡连续7天',
        icon: '🔥🔥',
        condition: {
          type: 'checkin_streak',
          days: 7
        },
        points: 20
      },
      {
        id: 'persist_6',
        name: '连续21天',
        description: '每日觉察打卡连续21天',
        icon: '🔥🔥🔥',
        condition: {
          type: 'checkin_streak',
          days: 21
        },
        points: 50
      },
      {
        id: 'persist_7',
        name: '月度坚持',
        description: '一个月内打卡15天以上',
        icon: '📅',
        condition: {
          type: 'monthly_checkin',
          days: 15
        },
        points: 30
      }
    ]
  },

  // ==================== 觉察类 ====================
  insight: {
    name: '觉察类',
    description: '觉察自我，记录成长',
    icon: '💡',
    achievements: [
      {
        id: 'insight_1',
        name: '第一次觉察',
        description: '完成首次每日觉察打卡',
        icon: '✨',
        condition: {
          type: 'daily_checkin',
          count: 1
        },
        points: 10
      },
      {
        id: 'insight_2',
        name: '情绪记录者',
        description: '连续记录7天的情绪状态',
        icon: '📝',
        condition: {
          type: 'mood_tracking',
          days: 7
        },
        points: 15
      },
      {
        id: 'insight_3',
        name: '改变见证者',
        description: '查看你的成长轨迹时间轴',
        icon: '📈',
        condition: {
          type: 'view_timeline',
          count: 1
        },
        points: 10
      },
      {
        id: 'insight_4',
        name: '工具使用者',
        description: '使用3次情境应对工具',
        icon: '🧰',
        condition: {
          type: 'use_tool',
          count: 3
        },
        points: 15
      },
      {
        id: 'insight_5',
        name: '紧急自救',
        description: '在情绪低谷时使用紧急平复工具',
        icon: '🆘',
        condition: {
          type: 'use_emergency_tool',
          count: 1
        },
        points: 20
      }
    ]
  },

  // ==================== 分享类 ====================
  sharing: {
    name: '分享类',
    description: '帮助他人，传播价值',
    icon: '📤',
    achievements: [
      {
        id: 'share_1',
        name: '分享者',
        description: '首次分享你的测试结果',
        icon: '📢',
        condition: {
          type: 'share_result',
          count: 1
        },
        points: 10
      },
      {
        id: 'share_2',
        name: '传播者',
        description: '分享3次，帮助更多人了解自己',
        icon: '📣',
        condition: {
          type: 'share_result',
          count: 3
        },
        points: 20
      },
      {
        id: 'share_3',
        name: '成就展示',
        description: '分享你获得的成就徽章',
        icon: '🏅',
        condition: {
          type: 'share_achievement',
          count: 1
        },
        points: 15
      }
    ]
  }
};

// 成就总数统计
const ACHIEVEMENT_STATS = {
  total: 0,
  byCategory: {}
};

Object.keys(ACHIEVEMENTS).forEach(category => {
  const count = ACHIEVEMENTS[category].achievements.length;
  ACHIEVEMENT_STATS.byCategory[category] = count;
  ACHIEVEMENT_STATS.total += count;
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ACHIEVEMENTS, ACHIEVEMENT_STATS };
}

if (typeof window !== 'undefined') {
  window.ACHIEVEMENTS = ACHIEVEMENTS;
  window.ACHIEVEMENT_STATS = ACHIEVEMENT_STATS;
}
