#!/bin/bash
# 一键重做人生剧本测试项目

set -e

PROJECT_NAME="${1:-life-script-quiz-new}"
GITHUB_USER="${2:-wuzehua2015-hash}"

echo "========================================"
echo "人生剧本测试 - 一键重做"
echo "========================================"
echo ""

# 1. 复制模板
echo "📁 复制项目模板..."
cp -r /root/.openclaw/workspace/archive/life-script-quiz ./$PROJECT_NAME
cd $PROJECT_NAME

# 2. 更新 Git 配置（如果需要）
echo "🔧 更新配置..."
sed -i "s/wuzehua2015-hash/$GITHUB_USER/g" PROJECT_GUIDE.md

# 3. 初始化 Git
echo "📦 初始化 Git..."
rm -rf .git 2>/dev/null || true
git init
git add -A
git commit -m "Initial commit: 人生剧本测试"

# 4. 提示部署
echo ""
echo "========================================"
echo "✅ 项目已创建: $PROJECT_NAME"
echo "========================================"
echo ""
echo "下一步部署到 GitHub:"
echo ""
echo "1. 在 GitHub 创建仓库: $PROJECT_NAME"
echo "2. 运行以下命令:"
echo ""
echo "   cd $PROJECT_NAME"
echo "   git remote add origin https://github.com/$GITHUB_USER/$PROJECT_NAME.git"
echo "   git push -u origin main"
echo ""
echo "3. 在 GitHub 仓库设置中开启 GitHub Pages"
echo ""
echo "4. 访问: https://$GITHUB_USER.github.io/$PROJECT_NAME/"
echo ""
echo "📖 详细说明见 PROJECT_GUIDE.md"
echo ""
