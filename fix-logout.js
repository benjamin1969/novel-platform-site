// 修复退出登录404问题
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 修复退出登录404问题...\n');

try {
    const gitPath = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    
    // 先拉取最新代码
    console.log('📥 拉取最新代码...');
    execSync(`${gitPath} pull origin main`, { stdio: 'inherit', shell: true });
    
    // 添加修改的文件
    console.log('📁 添加修改的文件...');
    execSync(`${gitPath} add main.html`, { stdio: 'inherit', shell: true });
    
    // 提交更改
    console.log('💾 提交更改...');
    execSync(`${gitPath} commit -m "Fix logout 404 error - change simple-index.html to login.html"`, { stdio: 'inherit', shell: true });
    
    // 推送到GitHub
    console.log('🚀 推送到GitHub...');
    execSync(`${gitPath} push origin main`, { stdio: 'inherit', shell: true });
    
    console.log('\n✅ 修复已推送！');
    console.log('\n📋 修复内容:');
    console.log('   1. 退出登录按钮: simple-index.html → login.html');
    console.log('   2. 检查登录状态: simple-index.html → login.html');
    
    console.log('\n⏱️ 预计时间:');
    console.log('   - GitHub Pages自动部署: 1-2分钟');
    console.log('   - 网站更新生效: 立即');
    
    console.log('\n🔗 测试步骤:');
    console.log('   1. 登录网站');
    console.log('   2. 点击"退出登录"按钮');
    console.log('   3. 应该跳转到登录页面，而不是404');
    
} catch (error) {
    console.error('❌ 推送失败:', error.message);
    console.log('\n💡 备用方案:');
    console.log('   手动在GitHub网页编辑 main.html 文件:');
    console.log('   1. 找到 logout() 函数');
    console.log('   2. 修改 window.location.href = "login.html";');
    console.log('   3. 找到 checkLogin() 函数');
    console.log('   4. 修改 window.location.href = "login.html";');
}