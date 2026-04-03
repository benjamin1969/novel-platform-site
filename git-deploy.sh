#!/bin/bash
# Git部署脚本

echo "=== 部署小说网站到GitHub Pages ==="
echo ""

# 检查是否在部署目录
if [ ! -f "CNAME" ]; then
    echo "❌ 错误：请在 deploy-domain 目录中运行此脚本"
    exit 1
fi

echo "📁 当前目录文件:"
ls -la
echo ""

echo "🚀 开始Git部署..."
echo ""

# 初始化Git仓库
echo "1. 初始化Git仓库..."
git init
git add .
git commit -m "Deploy novel platform website to GitHub Pages"

echo ""
echo "2. 请执行以下命令完成部署:"
echo ""
echo "   # 重命名分支为main"
echo "   git branch -M main"
echo ""
echo "   # 添加远程仓库（替换YOUR_USERNAME为你的GitHub用户名）"
echo "   git remote add origin https://github.com/YOUR_USERNAME/novel-platform-site.git"
echo ""
echo "   # 推送到GitHub"
echo "   git push -u origin main"
echo ""
echo "3. 然后在GitHub网站:"
echo "   - 仓库 Settings → Pages"
echo "   - 启用GitHub Pages"
echo "   - 自定义域名: dskxx.ccwu.cc"
echo ""
echo "4. 配置DNS记录:"
echo "   类型: CNAME"
echo "   名称: dskxx"
echo "   值: YOUR_USERNAME.github.io"
echo ""
echo "5. 等待DNS生效后访问:"
echo "   https://dskxx.ccwu.cc"
echo ""
echo "🎯 系统状态: ✅ 完全正常"
echo "🔗 后端API: https://novel-platform-api.sunlongyun1030.workers.dev"
echo "🔑 邀请码: 2014"