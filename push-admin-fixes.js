// 推送管理员登录修复
const { execSync } = require('child_process');

console.log('🚀 推送管理员登录修复到GitHub...\n');
console.log('📋 修复内容:');
console.log('   👁️ 密码显示/隐藏功能（眼睛图标）');
console.log('   🔐 管理员登录测试页面');
console.log('   📝 简化版管理员创建SQL\n');

try {
    const gitPath = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    
    // 先拉取最新代码
    console.log('📥 拉取最新代码...');
    execSync(`${gitPath} pull origin main`, { stdio: 'inherit', shell: true });
    
    // 添加所有文件
    console.log('📁 添加所有文件...');
    execSync(`${gitPath} add .`, { stdio: 'inherit', shell: true });
    
    // 提交更改
    console.log('💾 提交更改...');
    execSync(`${gitPath} commit -m "Fix admin login issues and add password visibility toggle

- Add password show/hide toggle (eye icon) to login.html
- Create admin-login-test.html for direct admin login testing
- Create simplified SQL script (create-admin-only.sql) for easy admin account creation
- Fix login form styling for password input wrapper
- Improve error messages and debugging information
- Add keyboard shortcuts (Ctrl+Shift+P to toggle password visibility)

Key fixes:
👁️ Password visibility toggle for both login and registration forms
🔐 Direct admin login testing page with detailed debugging
📝 Simplified SQL for quick admin account creation
🔄 Multiple email format attempts for better compatibility
📊 Real-time API response display for debugging"`, { stdio: 'inherit', shell: true });
    
    // 推送到GitHub
    console.log('🚀 推送到GitHub...');
    execSync(`${gitPath} push origin main`, { stdio: 'inherit', shell: true });
    
    console.log('\n✅ 管理员登录修复已推送！');
    
    console.log('\n🔗 测试链接:');
    console.log('   1. 管理员登录测试: https://dskxx.ccwu.cc/admin-login-test.html');
    console.log('   2. 普通登录页面: https://dskxx.ccwu.cc/login.html');
    console.log('   3. 管理员后台: https://dskxx.ccwu.cc/admin.html');
    
    console.log('\n🔐 管理员账户信息:');
    console.log('   用户名: admin');
    console.log('   邮箱: admin@dskxx.cc');
    console.log('   密码: Admin123!@#');
    console.log('   角色: 系统管理员');
    
    console.log('\n📝 立即执行步骤:');
    console.log('   1. 执行数据库SQL创建管理员账户');
    console.log('   2. 使用测试页面验证登录');
    console.log('   3. 访问管理员后台');
    
    console.log('\n💡 SQL执行指南:');
    console.log('   1. 登录 Cloudflare Dashboard');
    console.log('   2. Workers & Pages → D1');
    console.log('   3. 选择数据库: novel-db');
    console.log('   4. 执行 create-admin-only.sql');
    
    console.log('\n🎯 预期结果:');
    console.log('   ✅ 管理员账户创建成功');
    console.log('   ✅ 密码显示/隐藏功能正常');
    console.log('   ✅ 管理员登录测试通过');
    console.log('   ✅ 管理员后台可访问');
    
} catch (error) {
    console.error('❌ 推送失败:', error.message);
    console.log('\n💡 备用方案:');
    console.log('   手动在GitHub网页上传文件');
}