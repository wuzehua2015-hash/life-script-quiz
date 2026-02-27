#!/bin/bash
# 初始化开发环境

echo "🚀 初始化人生剧本社区开发环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 检查环境变量
if [ ! -f .env.local ]; then
    echo "⚠️  未找到 .env.local 文件"
    echo "请复制 .env.example 到 .env.local 并配置"
fi

echo "✅ 环境初始化完成"
echo ""
echo "下一步:"
echo "  1. 配置 .env.local 文件"
echo "  2. 运行 npm run dev 启动开发服务器"
