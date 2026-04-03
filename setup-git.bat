@echo off
echo === 设置Git本地仓库 ===
echo.

REM 检查是否在部署目录
if not exist "CNAME" (
    echo ❌ 错误：请在 deploy-domain 目录中运行此脚本
    pause
    exit /b 1
)

echo 📁 当前目录: %CD%
echo.

REM 删除现有的.git目录
if exist ".git" (
    echo 🗑️  删除现有的.git目录...
    rmdir /s /q .git
)

REM 初始化Git仓库
echo 🚀 初始化Git仓库...
git init
git config user.name "OpenClaw AI"
git config user.email "deploy@openclaw.ai"

REM 添加所有文件
echo 📁 添加所有文件...
git add .

REM 提交更改
echo 💾 提交更改...
git commit -m "Deploy novel platform website to GitHub Pages"

REM 重命名分支为main
echo 🌿 设置分支为main...
git branch -M main

echo.
echo ✅ Git本地仓库设置完成！
echo.
echo ========================================
echo.
echo 📋 下一步操作:
echo.
echo 1. 登录GitHub: https://github.com
echo    账号: snh@263.net
echo    密码: Sunnianhui319410
echo.
echo 2. 创建仓库: novel-platform-site
echo    - 点击右上角 '+' → New repository
echo    - 仓库名: novel-platform-site
echo    - 描述: 灯口小学五年级三班小说天地
echo    - 选择: Public
echo    - 不初始化README
echo.
echo 3. 获取仓库URL:
echo    创建仓库后，复制仓库的HTTPS URL
echo    例如: https://github.com/你的用户名/novel-platform-site.git
echo.
echo 4. 执行以下Git命令推送代码:
echo    git remote add origin https://github.com/你的用户名/novel-platform-site.git
echo    git push -u origin main
echo.
echo 5. 启用GitHub Pages:
echo    - 仓库 Settings → Pages
echo    - Source: Deploy from a branch
echo    - Branch: main
echo    - Folder: /
echo.
echo 6. 配置自定义域名:
echo    - 在Custom domain输入: dskxx.ccwu.cc
echo    - 点击 Save
echo.
echo 7. 配置DNS记录:
echo    在域名管理面板添加CNAME记录:
echo    类型: CNAME
echo    名称: dskxx
echo    值: 你的GitHub用户名.github.io
echo.
echo 8. 等待生效后访问:
echo    https://dskxx.ccwu.cc
echo.
echo 🎯 系统状态: ✅ 准备部署
echo 🔗 后端API: https://novel-platform-api.sunlongyun1030.workers.dev
echo 🔑 邀请码: 2014
echo.
pause