# Stock Monitor Skill

股票盯盘Skill - 持仓管理与异动监控

## 功能

1. **持仓管理** - 增删改查股票持仓
2. **自动监控** - 实时监控持仓股票异动
3. **异动提醒** - 价格/成交量异常时主动推送

## 使用方法

### 持仓管理命令

```bash
# 买入股票
python3 stock_skill.py buy <股票代码> <数量> <成本价> [股票名称]

# 卖出股票
python3 stock_skill.py sell <股票代码> <数量>

# 加仓
python3 stock_skill.py add <股票代码> <数量> <价格>

# 减仓
python3 stock_skill.py reduce <股票代码> <数量> <价格>

# 清仓
python3 stock_skill.py clear <股票代码>

# 查看持仓
python3 stock_skill.py list

# 查看单只股票详情
python3 stock_skill.py show <股票代码>
```

### 监控命令

```bash
# 启动监控（检查一次）
python3 stock_skill.py monitor

# 更新股票价格
python3 stock_skill.py update

# 查看历史提醒
python3 stock_skill.py alerts
```

### 自然语言接口

```bash
# 使用自然语言命令
python3 stock_skill.py parse "买入ST围海1000股成本4.2"
python3 stock_skill.py parse "卖出方正电机500股"
python3 stock_skill.py parse "查看持仓"
```

## 数据文件

- `stock_portfolio.json` - 持仓数据与配置

## 定时任务

```bash
# 添加到crontab（每30分钟检查一次，交易时间内）
*/30 9-14 * * 1-5 cd /root/.openclaw/workspace && python3 stock_skill.py monitor >> /tmp/stock_monitor.log 2>&1
35-59/30 9 * * 1-5 cd /root/.openclaw/workspace && python3 stock_skill.py monitor >> /tmp/stock_monitor.log 2>&1
```

## 行情接口

- 新浪财经: https://hq.sinajs.cn/list=
- 腾讯财经: https://qt.gtimg.cn/q=

## 监控规则

1. **涨停/跌停**: 价格达到当日涨跌幅限制（±10%，ST股±5%）
2. **涨跌幅超5%**: 相对于昨日收盘价的涨跌幅超过5%
3. **成交量异常**: 成交量超过近期平均的3倍
4. **价格突破**: 突破近期高点或低点
