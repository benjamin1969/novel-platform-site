// 修改退出登录返回主页面
const { execSync } = require('child_process');

console.log('🔧 修改退出登录返回主页面...\n');

try {
    const gitPath = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    
    // 添加修改的文件
    console.log('📁 添加修改的文件...');
    execSync(`${gitPath} add main.html`, { stdio: 'inherit', shell: true });
    
    // 提交更改
    console.log('💾 提交更改...');
    execSync(`${gitPath} commit -m "Change logout redirect to homepage (index.html) per user request"`, { stdio: 'inherit', shell: true });
    
    // 推送到GitHub
    console.log('🚀 推送到GitHub...');
    execSync(`${gitPath} push origin main`, { stdio: 'inherit', shell: true });
    
    console.log('\n✅ 修改已推送！');
    console.log('\n📋 修改内容:');
    console.log('   退出登录按钮: login.html → index.html（返回主页面）');
    console.log('   保持 checkLogin() 跳转到 login.html（需要登录才能访问用户首页）');
    
    console.log('\n⏱️ 预计时间:');
    console.log('   - GitHub Pages自动部署: 1-2分钟');
    console.log('   - 网站更新生效: 立即');
    
    console.log('\n🔗 用户流程:');
    console.log('   1. 访问首页 (index.html)');
    console.log('   2. 点击登录 → 跳转到 login.html');
    console.log('   3. 登录成功 → 跳转到 main.html（用户首页）');
    console.log('   4. 点击退出登录 → 跳转到 index.html（主页面）');
    console.log('   5. 如果未登录访问 main.html → 跳转到 login.html');
    
    console.log('\n🎯 用户体验优化:');
    console.log('   ✅ 退出后返回主页面，更符合用户习惯');
    console.log('   ✅ 未登录访问受保护页面时跳转到登录页');
    console.log('   ✅ 清晰的导航流程');
    
} catch (error) {
    console.error('❌ 推送失败:', error.message);
    console.log('\n💡 备用方案:');
    console.log('   手动在GitHub网页编辑 main.html 文件:');
    console.log('   1. 找到 logout() 函数');
    console.log('   2. 修改 window.location.href = "index.html";');
}