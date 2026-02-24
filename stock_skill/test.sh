#!/bin/bash
# 股票盯盘Skill测试脚本

cd /root/.openclaw/workspace

echo "========================================"
echo "股票盯盘Skill - 功能测试"
echo "========================================"
echo ""

# 测试1: 查看空持仓
echo "📋 测试1: 查看空持仓"
python3 stock_skill/stock_skill.py list
echo ""

# 测试2: 买入股票
echo "📋 测试2: 买入股票 (平安银行 000001)"
python3 stock_skill/stock_skill.py buy 000001 1000 10.50 平安银行
echo ""

# 测试3: 加仓
echo "📋 测试3: 加仓 (平安银行 000001)"
python3 stock_skill/stock_skill.py buy 000001 500 11.00 平安银行
echo ""

# 测试4: 买入另一只股票
echo "📋 测试4: 买入另一只股票 (万科A 000002)"
python3 stock_skill/stock_skill.py buy 000002 2000 15.80 万科A
echo ""

# 测试5: 查看持仓
echo "📋 测试5: 查看持仓列表"
python3 stock_skill/stock_skill.py list
echo ""

# 测试6: 查看单只股票详情
echo "📋 测试6: 查看单只股票详情 (000001)"
python3 stock_skill/stock_skill.py show 000001
echo ""

# 测试7: 减仓
echo "📋 测试7: 减仓 (平安银行 卖出300股)"
python3 stock_skill/stock_skill.py sell 000001 300
echo ""

# 测试8: 查看持仓（确认减仓）
echo "📋 测试8: 查看持仓（确认减仓）"
python3 stock_skill/stock_skill.py list
echo ""

# 测试9: 自然语言命令 - 买入
echo "📋 测试9: 自然语言命令 - 买入"
python3 stock_skill/stock_skill.py parse "买入000063 800股成本18.5"
echo ""

# 测试10: 自然语言命令 - 查看持仓
echo "📋 测试10: 自然语言命令 - 查看持仓"
python3 stock_skill/stock_skill.py parse "查看持仓"
echo ""

# 测试11: 自然语言命令 - 卖出
echo "📋 测试11: 自然语言命令 - 卖出"
python3 stock_skill/stock_skill.py parse "卖出000002 500股"
echo ""

# 测试12: 清仓
echo "📋 测试12: 清仓 (平安银行)"
python3 stock_skill/stock_skill.py sell 000001
echo ""

# 测试13: 最终持仓
echo "📋 测试13: 最终持仓"
python3 stock_skill/stock_skill.py list
echo ""

# 测试14: 监控功能
echo "📋 测试14: 运行监控检查"
python3 stock_skill/stock_skill.py monitor
echo ""

echo "========================================"
echo "测试完成!"
echo "========================================"
