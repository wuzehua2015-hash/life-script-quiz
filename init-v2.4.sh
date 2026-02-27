#!/bin/bash
# 初始化 v2.4 开发环境

echo "🚀 初始化人生剧本 v2.4 开发环境..."
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 安装依赖
echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"
echo ""

# 检查环境变量
if [ ! -f .env.local ]; then
    echo "⚠️  未找到 .env.local 文件"
    echo "请复制 .env.example 到 .env.local 并配置"
    echo ""
fi

# 显示项目信息
echo "📋 项目信息:"
echo "  版本: v2.4.0"
echo "  域名: https://lifescript.lynkedu.com"
echo "  任务文件: task-v2.4.json"
echo ""

# 读取当前任务状态
if [ -f task-v2.4.json ]; then
    echo "📊 当前任务状态:"
    
    # 使用node读取JSON（如果有jq更好）
    node -e "
        const fs = require('fs');
        const task = JSON.parse(fs.readFileSync('task-v2.4.json', 'utf8'));
        console.log('  阶段数:', task.phases.length);
        
        let totalTasks = 0;
        let completedTasks = 0;
        
        task.phases.forEach(phase => {
            phase.tasks.forEach(t => {
                totalTasks++;
                if (t.passes) completedTasks++;
            });
        });
        
        console.log('  总任务数:', totalTasks);
        console.log('  已完成:', completedTasks);
        console.log('  进度:', Math.round(completedTasks/totalTasks*100) + '%');
    " 2>/dev/null || echo "  请查看 task-v2.4.json 了解详情"
    
    echo ""
fi

echo "✅ 环境初始化完成"
echo ""
echo "下一步:"
echo "  1. 查看任务: cat task-v2.4.json"
echo "  2. 更新进度: 编辑 progress-v2.4.txt"
echo "  3. 开始开发: 按照task执行"
echo ""
