// Node.js脚本设置Git仓库
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== 设置Git本地仓库 ===\n');

// 检查是否在部署目录
if (!fs.existsSync('CNAME')) {
    console.error('❌ 错误：请在 deploy-domain 目录中运行此脚本');
    process.exit(1);
}

console.log('📁 当前目录:', process.cwd());
console.log('');

try {
    // 删除现有的.git目录
    if (fs.existsSync('.git')) {
        console.log('🗑️  删除现有的.git目录...');
        fs.rmSync('.git', { recursive: true, force: true });
    }
    
    // Git完整路径
    const gitPath = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    
    // 初始化Git仓库
    console.log('🚀 初始化Git仓库...');
    execSync(`${gitPath} init`, { stdio: 'inherit', shell: true });
    
    console.log('👤 配置用户信息...');
    execSync(`${gitPath} config user.name "OpenClaw AI"`, { stdio: 'inherit', shell: true });
    execSync(`${gitPath} config user.email "deploy@openclaw.ai"`, { stdio: 'inherit', shell: true });
    
    // 添加所有文件
    console.log('📁 添加所有文件...');
    execSync(`${gitPath} add .`, { stdio: 'inherit', shell: true });
    
    // 提交更改
    console.log('💾 提交更改...');
    execSync(`${gitPath} commit -m "Deploy novel platform website to GitHub Pages"`, { stdio: 'inherit', shell: true });
    
    // 重命名分支为main
    console.log('🌿 设置分支为main...');
    execSync(`${gitPath} branch -M main`, { stdio: 'inherit', shell: true });
    
    console.log('\n✅ Git本地仓库设置完成！\n');
    console.log('='.repeat(50));
    console.log('\n📋 下一步操作:\n');
    
    console.log('1. 登录GitHub: https://github.com');
    console.log('   账号: snh@263.net');
    console.log('   密码: Sunnianhui319410\n');
    
    console.log('2. 创建仓库: novel-platform-site');
    console.log('   - 点击右上角 \'+\' → New repository');
    console.log('   - 仓库名: novel-platform-site');
    console.log('   - 描述: 灯口小学五年级三班小说天地');
    console.log('   - 选择: Public');
    console.log('   - 不初始化README\n');
    
    console.log('3. 获取仓库URL:');
    console.log('   创建仓库后，复制仓库的HTTPS URL');
    console.log('   例如: https://github.com/你的用户名/novel-platform-site.git\n');
    
    console.log('4. 执行以下Git命令推送代码:');
    console.log('   git remote add origin https://github.com/你的用户名/novel-platform-site.git');
    console.log('   git push -u origin main\n');
    
    console.log('5. 启用GitHub Pages:');
    console.log('   - 仓库 Settings → Pages');
    console.log('   - Source: Deploy from a branch');
    console.log('   - Branch: main');
    console.log('   - Folder: /\n');
    
    console.log('6. 配置自定义域名:');
    console.log('   - 在Custom domain输入: dskxx.ccwu.cc');
    console.log('   - 点击 Save\n');
    
    console.log('7. 配置DNS记录:');
    console.log('   在域名管理面板添加CNAME记录:');
    console.log('   类型: CNAME');
    console.log('   名称: dskxx');
    console.log('   值: 你的GitHub用户名.github.io\n');
    
    console.log('8. 等待生效后访问:');
    console.log('   https://dskxx.ccwu.cc\n');
    
    console.log('🎯 系统状态: ✅ 准备部署');
    console.log('🔗 后端API: https://novel-platform-api.sunlongyun1030.workers.dev');
    console.log('🔑 邀请码: 2014\n');
    
} catch (error) {
    console.error('❌ Git操作失败:', error.message);
    console.log('\n💡 备用方案:');
    console.log('   1. 手动登录GitHub创建仓库');
    console.log('   2. 使用网页上传 deploy-domain 目录所有文件');
    console.log('   3. 手动配置GitHub Pages和域名');
}