# 智能会议纪要 Skill

自动解析会议内容，提取任务、时间节点，生成结构化纪要并创建提醒。

## 功能特性

- 📝 **智能会议纪要生成** - 自动提取会议时间、参与人、主题、待办事项
- ⏰ **时间节点检测** - 支持多种中文时间表达（今天下午3点、明天上午、本周五等）
- 🔔 **自动提醒** - 根据时间节点创建定时提醒任务
- 📊 **任务跟进** - 区分有/无明确时间的任务，逾期自动标记
- 🔗 **系统集成** - 与 PTK创业追踪.md 系统打通

## 安装

无需安装，直接使用：

```bash
cd /root/.openclaw/workspace/meeting_skill
python cli.py --help
```

## 命令接口

### 1. 整理会议纪要

```bash
# 直接输入内容
python cli.py process -c "今天和梁羽萱开会，PTK要联系客户，今天下午3点前完成"

# 从文件读取
python cli.py process -f meeting.txt

# 指定日期
python cli.py process -c "会议内容..." -d 2026-02-23
```

### 2. 查看今日待办

```bash
python cli.py today
```

### 3. 查看本周会议

```bash
python cli.py week
```

### 4. 延期任务

```bash
python cli.py postpone "联系客户" "明天下午"
python cli.py postpone "提交报告" "本周五"
```

### 5. 获取每日提示

```bash
python cli.py prompt
```

### 6. 检查提醒

```bash
python cli.py check
```

## 文件结构

```
/root/.openclaw/workspace/
├── meeting_skill/
│   ├── __init__.py
│   ├── meeting_parser.py      # 会议内容解析
│   ├── task_extractor.py      # 任务提取
│   ├── time_detector.py       # 时间检测
│   ├── reminder_scheduler.py  # 提醒调度
│   ├── meeting_commands.py    # 命令接口
│   ├── cli.py                 # 命令行入口
│   └── README.md              # 本文件
├── meetings/                   # 会议纪要存储
│   └── YYYY-MM-DD.md
└── meeting_reminders.json      # 提醒任务配置
```

## 时间检测支持

| 表达 | 解析结果 |
|------|----------|
| 今天下午3点 | 当天15:00 |
| 明天上午 | 次日9:00 |
| 本周五 | 本周五当天 |
| 下周二下午2点 | 下周二14:00 |
| 3月15日前 | 3月14日提醒 |
| 后天早上 | 后天8:00 |
| 月底 | 当月最后一天17:00 |
| 周末 | 本周六9:00 |

## Cron 配置

### 1. 每日18:00索要会议纪要

```cron
# 工作日（周一到周五）晚上18:00
0 18 * * 1-5 cd /root/.openclaw/workspace && python meeting_skill/cli.py daily-check >> /tmp/meeting_cron.log 2>&1
```

### 2. 每小时检查提醒

```cron
# 每小时检查一次提醒
0 * * * * cd /root/.openclaw/workspace && python meeting_skill/cli.py check >> /tmp/meeting_cron.log 2>&1
```

## Python API 使用

```python
from meeting_skill import MeetingCommands

# 创建命令实例
commands = MeetingCommands()

# 处理会议内容
result = commands.process_meeting("""
今天和梁羽萱讨论了年后工作重点。
1. PTK要联系深圳商会张立新，今天拉群
2. 梁羽萱负责催星汉打款，明天上午完成
3. 我们要确定三月讲座时间，本周五前决定
""")

print(result['filepath'])  # 生成的会议纪要路径
print(result['tasks_count'])  # 提取的任务数量

# 查看今日待办
print(commands.get_today_todos())

# 查看本周会议
print(commands.get_week_meetings())

# 延期任务
result = commands.postpone_task("联系客户", "明天下午")
```

## 会议纪要格式

生成的会议纪要采用 Markdown 格式：

```markdown
# 会议纪要

## 基本信息

| 项目 | 内容 |
|------|------|
| 日期 | 2026-02-23 |
| 参与人 | PTK, 梁羽萱 |
| 主题 | 年后工作重点梳理 |

## 待办事项

### 🔴 紧急

| 序号 | 事项 | 负责人 | 截止时间 | 状态 |
|------|------|--------|----------|------|
| 1 | 联系娜姐确认培训时间 | 梁羽萱 | 今天 | ⏳ |

### 🟡 重要

| 序号 | 事项 | 负责人 | 截止时间 | 状态 |
|------|------|--------|----------|------|
| 1 | 催星汉打款 | 梁羽萱 | 明天上午 | ⏳ |

## 关键要点

1. 确定外贸人才培训安排
2. 推进客户合作项目

## 原始记录

```
原始会议内容...
```

---
*生成时间: 2026-02-23 21:32*
```

## 提醒任务配置

提醒任务存储在 `meeting_reminders.json`：

```json
[
  {
    "id": "rem_20260223213200_0",
    "task_description": "联系娜姐确认外贸人才培训时间",
    "remind_at": "2026-02-26T08:00:00",
    "deadline": "2026-02-26T09:00:00",
    "assignee": "梁羽萱",
    "source_meeting": "/root/.openclaw/workspace/meetings/2026-02-23.md",
    "status": "pending"
  }
]
```

## 状态说明

- `pending` - 待提醒
- `reminded` - 已提醒
- `completed` - 已完成
- `snoozed` - 已延后

## 注意事项

1. 时间检测基于当前系统时间解析
2. 会议纪要文件按日期命名，同一天多次记录会追加
3. 提醒任务需要配合 cron 或手动检查触发
4. 与 PTK创业追踪.md 的同步是增量式的
