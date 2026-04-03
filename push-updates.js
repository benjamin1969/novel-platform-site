// 推送修复文件到GitHub
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 推送404修复文件到GitHub...\n');

try {
    const gitPath = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    
    // 添加所有文件
    console.log('📁 添加文件...');
    execSync(`${gitPath} add .`, { stdio: 'inherit', shell: true });
    
    // 提交更改
    console.log('💾 提交更改...');
    execSync(`${gitPath} commit -m "Fix GitHub Pages 404 errors - add 404.html and fix links"`, { stdio: 'inherit', shell: true });
    
    // 推送到GitHub
    console.log('🚀 推送到GitHub...');
    execSync(`${gitPath} push`, { stdio: 'inherit', shell: true });
    
    console.log('\n✅ 文件推送成功！');
    console.log('\n📋 修复内容:');
    console.log('   1. 添加 404.html 重定向页面');
    console.log('   2. 修复 index.html 中的链接（添加 .html 扩展名）');
    console.log('   3. 添加JavaScript路由处理');
    
    console.log('\n⏱️ 预计时间:');
    console.log('   - GitHub Pages自动部署: 1-2分钟');
    console.log('   - 网站更新生效: 立即');
    
    console.log('\n🔗 测试链接:');
    console.log('   1. 首页: https://dskxx.ccwu.cc/');
    console.log('   2. 登录页: https://dskxx.ccwu.cc/login.html');
    console.log('   3. 用户首页: https://dskxx.ccwu.cc/main.html');
    
} catch (error) {
    console.error('❌ 推送失败:', error.message);
    console.log('\n💡 备用方案:');
    console.log('   1. 手动在GitHub网页上传 404.html 文件');
    console.log('   2. 手动更新 index.html 文件');
}