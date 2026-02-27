#!/bin/bash
# v2.4 自动化运行脚本

MAX_RUNS=${1:-5}
RUN_COUNT=0

mkdir -p automation-logs-v2.4

echo "🤖 启动人生剧本 v2.4 Auto Coding Agent"
echo "最大运行次数: $MAX_RUNS"
echo "任务文件: task-v2.4.json"
echo ""

while [ $RUN_COUNT -lt $MAX_RUNS ]; do
    RUN_COUNT=$((RUN_COUNT + 1))
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    LOG_FILE="automation-logs-v2.4/run-${TIMESTAMP}.log"
    
    echo "[$RUN_COUNT/$MAX_RUNS] 开始运行... ($(date '+%H:%M:%S'))"
    
    # 记录运行信息
    echo "Run $RUN_COUNT at $(date)" > "$LOG_FILE"
    echo "================================" >> "$LOG_FILE"
    
    # 检查当前任务状态
    node -e "
        const fs = require('fs');
        try {
            const task = JSON.parse(fs.readFileSync('task-v2.4.json', 'utf8'));
            console.log('当前任务状态:');
            
            task.phases.forEach((phase, pi) => {
                console.log('\\n[' + phase.name + ']');
                phase.tasks.forEach((t, ti) => {
                    const status = t.passes ? '✅' : '⏳';
                    console.log('  ' + status + ' ' + t.id + ': ' + t.title);
                });
            });
        } catch(e) {
            console.log('读取任务文件失败:', e.message);
        }
    " 2>> "$LOG_FILE"
    
    echo "" >> "$LOG_FILE"
    echo "[$RUN_COUNT/$MAX_RUNS] 完成，日志: $LOG_FILE"
    echo ""
    
    # 检查是否所有任务完成
    ALL_DONE=$(node -e "
        const fs = require('fs');
        try {
            const task = JSON.parse(fs.readFileSync('task-v2.4.json', 'utf8'));
            let allDone = true;
            task.phases.forEach(p => {
                p.tasks.forEach(t => {
                    if (!t.passes) allDone = false;
                });
            });
            console.log(allDone ? 'true' : 'false');
        } catch(e) {
            console.log('false');
        }
    ")
    
    if [ "$ALL_DONE" = "true" ]; then
        echo "🎉 所有任务已完成！"
        break
    fi
    
    if [ $RUN_COUNT -lt $MAX_RUNS ]; then
        echo "等待下一次运行..."
        sleep 10
    fi
done

echo ""
echo "✅ 自动化运行完成"
echo "日志目录: automation-logs-v2.4/"
echo ""

# 显示最终状态
echo "📊 最终任务状态:"
node -e "
    const fs = require('fs');
    try {
        const task = JSON.parse(fs.readFileSync('task-v2.4.json', 'utf8'));
        let total = 0, done = 0;
        task.phases.forEach(p => {
            p.tasks.forEach(t => {
                total++;
                if (t.passes) done++;
            });
        });
        console.log('总进度: ' + done + '/' + total + ' (' + Math.round(done/total*100) + '%)');
    } catch(e) {
        console.log('读取失败');
    }
" 2>/dev/null
