# 成就系统详细设计

## 成就类型

### 1. 探索类（Exploration）
鼓励用户深入了解自己和系统

| 成就ID | 名称 | 解锁条件 | 图标 |
|--------|------|---------|------|
| explore_1 | 初次觉醒 | 完成首次测试 | 🌟 |
| explore_2 | 深度探索 | 查看完整结果分析 | 🔍 |
| explore_3 | 原型大师 | 查看所有12原型介绍 | 📚 |
| explore_4 | 角色研究员 | 查看5个角色详情 | 🎭 |
| explore_5 | 改变开始 | 首次进入行动指导 | 🚀 |

### 2. 坚持类（Persistence）
鼓励持续行动，养成习惯

| 成就ID | 名称 | 解锁条件 | 图标 |
|--------|------|---------|------|
| persist_1 | 开始改变 | 开始21天计划 | 🎯 |
| persist_2 | 第一周 | 完成7天计划 | 🌱 |
| persist_3 | 坚持到底 | 完成21天计划 | 🏆 |
| persist_4 | 连续3天 | 每日打卡3天 | 🔥 |
| persist_5 | 连续7天 | 每日打卡7天 | 🔥🔥 |
| persist_6 | 连续21天 | 每日打卡21天 | 🔥🔥🔥 |
| persist_7 | 月度坚持 | 每月打卡15天以上 | 📅 |

### 3. 觉察类（Insight）
鼓励自我觉察和记录

| 成就ID | 名称 | 解锁条件 | 图标 |
|--------|------|---------|------|
| insight_1 | 第一次觉察 | 完成首次每日打卡 | 💡 |
| insight_2 | 情绪记录者 | 记录7天情绪 | 📝 |
| insight_3 | 改变见证者 | 查看成长轨迹 | 📈 |
| insight_4 | 工具使用者 | 使用3次情境应对工具 | 🧰 |
| insight_5 | 紧急自救 | 使用紧急平复工具 | 🆘 |

### 4. 分享类（Sharing）
鼓励传播价值

| 成就ID | 名称 | 解锁条件 | 图标 |
|--------|------|---------|------|
| share_1 | 分享者 | 首次分享测试结果 | 📤 |
| share_2 | 传播者 | 分享3次 | 📢 |
| share_3 | 成就展示 | 分享获得的成就 | 🏅 |

## LocalStorage 存储结构

### lsq_achievements
```json
{
  "unlocked": ["explore_1", "persist_1", "insight_1"],
  "unlockedAt": {
    "explore_1": "2026-02-27T10:00:00Z",
    "persist_1": "2026-02-27T14:30:00Z"
  }
}
```

### lsq_achievementProgress
```json
{
  "explore": {
    "charactersViewed": ["lone_hero_1", "pleaser_2"],
    "archetypesViewed": ["lone_hero", "pleaser"]
  },
  "persist": {
    "currentStreak": 5,
    "maxStreak": 7,
    "totalCheckIns": 12,
    "planProgress": {
      "lone_hero": 15
    }
  },
  "insight": {
    "totalCheckIns": 12,
    "toolsUsed": 3
  },
  "share": {
    "totalShares": 2
  }
}
```

### lsq_dailyCheckIn
```json
{
  "2026-02-27": {
    "checked": true,
    "mood": 4,
    "note": "今天感觉不错",
    "timestamp": "2026-02-27T20:00:00Z"
  },
  "2026-02-28": {
    "checked": true,
    "mood": 3,
    "timestamp": "2026-02-28T21:30:00Z"
  }
}
```

## 成就解锁检测时机

| 时机 | 检测的成就 |
|------|-----------|
| 完成测试 | explore_1 |
| 查看结果详情 | explore_2 |
| 浏览原型介绍 | explore_3 |
| 查看角色详情 | explore_4 |
| 进入行动指导 | explore_5 |
| 开始21天计划 | persist_1 |
| 完成每日任务 | persist_2, persist_3 |
| 每日打卡 | persist_4,5,6, insight_1,2 |
| 查看成长轨迹 | insight_3 |
| 使用工具 | insight_4,5 |
| 分享 | share_1,2,3 |

## UI设计要点

### 成就卡片
- 已解锁：彩色徽章，显示获得时间
- 未解锁：灰色轮廓，显示解锁条件
- 悬停/点击：显示成就详情

### 成就解锁弹窗
- 居中显示，背景模糊
- 徽章放大动画
- Confetti庆祝效果
- 显示成就名称和描述
- 提供"分享成就"按钮

### 成就墙布局
- 顶部：统计（已获得/总数）
- 分类标签：探索/坚持/觉察/分享
- 网格布局：3列（移动端2列）
- 已解锁优先显示
