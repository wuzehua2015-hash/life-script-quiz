#!/bin/bash
# 股票盯盘Skill - 安装脚本

set -e

echo "========================================"
echo "股票盯盘Skill 安装程序"
echo "========================================"
echo ""

WORKSPACE=/root/.openclaw/workspace
SKILL_DIR=$WORKSPACE/stock_skill

cd $WORKSPACE

# 1. 检查Python
echo "📦 检查Python环境..."
if ! command -v python3 &> /dev/null; then
    echo "❌ 未找到Python3，请先安装Python3"
    exit 1
fi

echo "✅ Python3版本: $(python3 --version)"
echo ""

# 2. 设置权限
echo "📦 设置文件权限..."
chmod +x $SKILL_DIR/stock_skill.py
chmod +x $SKILL_DIR/test.sh
echo "✅ 权限设置完成"
echo ""

# 3. 创建数据文件
echo "📦 检查数据文件..."
if [ ! -f "$WORKSPACE/stock_portfolio.json" ]; then
    echo '{"version":"1.0.0","lastUpdated":"","portfolio":[],"monitoring":{"enabled":true,"checkInterval":30,"tradingHours":{"start":"09:35","end":"15:00"},"alertThresholds":{"priceChangePercent":5.0,"volumeMultiplier":3.0,"enableLimitUpAlert":true,"enableLimitDownAlert":true}},"alerts":[]}' > $WORKSPACE/stock_portfolio.json
    echo "✅ 创建数据文件: stock_portfolio.json"
else
    echo "✅ 数据文件已存在"
fi
echo ""

# 4. 安装crontab
echo "📦 安装定时任务..."
echo ""
echo "请手动添加以下定时任务 (运行: crontab -e):"
echo ""
cat $SKILL_DIR/crontab.txt
echo ""

# 5. 测试
echo "📦 运行功能测试..."
echo ""
read -p "是否运行功能测试? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    bash $SKILL_DIR/test.sh
fi

echo ""
echo "========================================"
echo "安装完成!"
echo "========================================"
echo ""
echo "使用方法:"
echo "  python3 stock_skill/stock_skill.py buy 000001 1000 10.50    - 买入"
echo "  python3 stock_skill/stock_skill.py sell 000001 500           - 卖出"
echo "  python3 stock_skill/stock_skill.py list                      - 查看持仓"
echo "  python3 stock_skill/stock_skill.py monitor                   - 运行监控"
echo "  python3 stock_skill/stock_skill.py parse '买入000001 1000股' - 自然语言"
echo ""
echo "数据文件: $WORKSPACE/stock_portfolio.json"
echo "日志文件: /tmp/stock_monitor.log"
echo ""
