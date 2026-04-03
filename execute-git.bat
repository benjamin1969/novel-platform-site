@echo off
echo === 执行Git操作 ===
echo.

REM 设置Git路径
set GIT_PATH="C:\Program Files\Git\cmd\git.exe"

echo 1. 配置用户信息...
%GIT_PATH% config user.name "OpenClaw AI"
%GIT_PATH% config user.email "deploy@openclaw.ai"

echo 2. 添加所有文件...
%GIT_PATH% add .

echo 3. 提交更改...
%GIT_PATH% commit -m "Deploy novel platform website to GitHub Pages"

echo 4. 设置分支为main...
%GIT_PATH% branch -M main

echo.
echo ✅ Git操作完成！
echo.
echo 📋 下一步:
echo 1. 登录GitHub创建仓库: novel-platform-site
echo 2. 执行以下命令推送代码:
echo    %GIT_PATH% remote add origin https://github.com/你的用户名/novel-platform-site.git
echo    %GIT_PATH% push -u origin main
echo.
pause