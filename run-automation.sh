#!/bin/bash
# 自动化运行脚本

MAX_RUNS=${1:-10}
RUN_COUNT=0

mkdir -p automation-logs

echo "🤖 启动 Auto Coding Agent 自动化运行"
echo "最大运行次数: $MAX_RUNS"
echo ""

while [ $RUN_COUNT -lt $MAX_RUNS ]; do
    RUN_COUNT=$((RUN_COUNT + 1))
    LOG_FILE="automation-log-$(date +%Y%m%d-%H%M%S).txt"
    
    echo "[$RUN_COUNT/$MAX_RUNS] 开始运行..."
    
    # 这里会调用agent执行任务
    # 实际执行由主会话控制
    
    echo "[$RUN_COUNT/$MAX_RUNS] 完成，日志: $LOG_FILE"
    sleep 5
done

echo ""
echo "✅ 自动化运行完成"
