# 八字命理分析 Skill

## 简介

这是一个完整的八字命理分析系统，支持：
- 基础排盘（公历/农历）
- 真太阳时转换
- 十神计算
- 日主强弱分析
- 喜用神判断
- 大运排法
- 事业财运分析
- 婚姻感情分析
- 健康分析
- 流年大运分析
- 八字档案管理

## 文件结构

```
bazi_skill/
├── __init__.py          # 包初始化
├── bazi_core.py         # 核心算法（万年历、排盘、十神、大运）
├── bazi_analyzer.py     # 分析报告生成
├── bazi_storage.py      # 数据持久化
├── bazi_commands.py     # 命令接口
└── SKILL.md             # 本文件

bazi_records.json        # 八字档案数据文件
```

## 命令接口

### 基础命令

| 命令 | 格式 | 说明 |
|------|------|------|
| 排盘 | `排盘 1997年11月4日18:30 山东聊城 [男/女]` | 排出四柱八字 |
| 分析事业财运 | `分析事业财运` | 事业财运专项分析 |
| 查看大运 | `查看大运` | 大运流年分析 |
| 完整分析 | `完整分析` | 生成完整Markdown报告 |
| 保存八字档案 | `保存八字档案 姓名` | 保存当前八字 |
| 查询档案 | `查询档案 [姓名]` | 查询八字档案 |
| 合婚 | `合婚 男方姓名 女方姓名` | 合婚分析 |

### 使用示例

```python
from bazi_skill.bazi_commands import handle_command

# 排盘
result = handle_command("排盘 1997年11月4日18:30 山东聊城 男")
print(result)

# 分析事业财运
result = handle_command("分析事业财运")
print(result)

# 查看大运
result = handle_command("查看大运")
print(result)

# 保存档案
result = handle_command("保存八字档案 张三")
print(result)

# 查询档案
result = handle_command("查询档案 张三")
print(result)
```

## API 使用

### 核心排盘

```python
from bazi_skill.bazi_core import calculate_bazi

# 计算八字
result = calculate_bazi(
    year=1997, month=11, day=4, 
    hour=18, minute=30,
    city='聊城', gender='男', 
    calendar='公历'  # 或 '农历'
)

# result 包含：
# - bazi: 四柱八字
# - day_master: 日主信息
# - wuxing_count: 五行统计
# - day_master_analysis: 日主强弱分析
# - xiyongshen: 喜用神
# - dayun: 大运信息
```

### 生成报告

```python
from bazi_skill.bazi_analyzer import generate_report

# 生成完整分析报告
report = generate_report(bazi_data)
print(report)  # Markdown格式
```

### 数据管理

```python
from bazi_skill.bazi_storage import (
    save_bazi_record, 
    query_bazi_record, 
    list_bazi_records
)

# 保存档案
save_bazi_record('张三', bazi_data, notes='备注信息')

# 查询档案
record = query_bazi_record('张三')

# 列出档案
records = list_bazi_records(limit=10)
```

## 分析体系

### 1. 基础排盘

- 支持公历/农历转换
- 自动转换为真太阳时
- 排出四柱八字、藏干、十神

### 2. 日主强弱分析

评分维度：
- 月令（40分）
- 通根（30分）
- 透干（20分）
- 生扶（10分）

### 3. 喜用神判断

- 身旺：喜克泄耗（官杀、食伤、财）
- 身弱：喜印比（印、比劫）
- 从格：顺势而行

### 4. 大运排法

- 阳年男命顺排，阴年男命逆排
- 阳年女命逆排，阴年女命顺排
- 起运岁数 = 出生到最近节气的天数 ÷ 3

### 5. 专项分析

- **事业财运**：官杀、财星分析，行业建议
- **婚姻感情**：配偶星、婚姻宫分析
- **健康**：五行强弱对应的健康提示
- **流年大运**：运势吉凶判断

## 数据文件格式

### bazi_records.json

```json
{
  "records": [
    {
      "id": 1,
      "name": "张三",
      "bazi_data": { ... },
      "notes": "备注",
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00"
    }
  ],
  "version": "1.0.0"
}
```

## 注意事项

1. **真太阳时**：排盘时会自动转换为真太阳时，确保准确性
2. **节气计算**：当前使用简化算法，精确度在可接受范围内
3. **命理参考**：分析结果仅供参考，人生掌握在自己手中

## 更新日志

### v1.0.0
- 基础排盘功能
- 十神计算
- 日主强弱分析
- 喜用神判断
- 大运排法
- 事业财运分析
- 档案管理
