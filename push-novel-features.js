// 推送小说功能文件到GitHub
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 推送小说浏览和发布功能到GitHub...\n');

try {
    const gitPath = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    
    // 先拉取最新代码
    console.log('📥 拉取最新代码...');
    execSync(`${gitPath} pull origin main`, { stdio: 'inherit', shell: true });
    
    // 添加所有新文件
    console.log('📁 添加所有文件...');
    execSync(`${gitPath} add .`, { stdio: 'inherit', shell: true });
    
    // 提交更改
    console.log('💾 提交更改...');
    execSync(`${gitPath} commit -m "Add novel browsing and publishing features

- Add novels.html: Novel browsing interface with filtering and pagination
- Add publish.html: Novel publishing interface with chapter management
- Update index.html navigation to include new features
- Complete frontend for novel creation and browsing"`, { stdio: 'inherit', shell: true });
    
    // 推送到GitHub
    console.log('🚀 推送到GitHub...');
    execSync(`${gitPath} push origin main`, { stdio: 'inherit', shell: true });
    
    console.log('\n✅ 小说功能已推送！');
    console.log('\n📋 新增功能:');
    console.log('   1. 📖 小说浏览页面 (novels.html)');
    console.log('      - 小说网格展示');
    console.log('      - 排序和筛选功能');
    console.log('      - 搜索功能');
    console.log('      - 分页加载');
    console.log('');
    console.log('   2. ✍️ 小说发布页面 (publish.html)');
    console.log('      - 小说基本信息表单');
    console.log('      - 章节管理系统');
    console.log('      - 草稿保存功能');
    console.log('      - 实时字数统计');
    console.log('');
    console.log('   3. 🔗 导航更新');
    console.log('      - 首页添加新功能链接');
    console.log('      - 完整的用户导航流程');
    
    console.log('\n⏱️ 预计时间:');
    console.log('   - GitHub Pages自动部署: 1-2分钟');
    console.log('   - 网站更新生效: 立即');
    
    console.log('\n🔗 测试链接:');
    console.log('   1. 小说浏览: https://dskxx.ccwu.cc/novels.html');
    console.log('   2. 发布小说: https://dskxx.ccwu.cc/publish.html');
    console.log('   3. 用户首页: https://dskxx.ccwu.cc/main.html');
    console.log('   4. 网站首页: https://dskxx.ccwu.cc/');
    
    console.log('\n🎯 用户流程:');
    console.log('   1. 访问首页 → 浏览小说');
    console.log('   2. 登录账号 → 发布小说');
    console.log('   3. 管理章节 → 发布作品');
    console.log('   4. 查看作品 → 互动评论');
    
    console.log('\n⚠️ 注意:');
    console.log('   后端API需要支持新的小说相关端点');
    console.log('   数据库需要支持小说和章节表');
    console.log('   当前前端已完全实现，等待后端开发');
    
} catch (error) {
    console.error('❌ 推送失败:', error.message);
    console.log('\n💡 备用方案:');
    console.log('   手动在GitHub网页上传文件:');
    console.log('   1. novels.html');
    console.log('   2. publish.html');
    console.log('   3. 更新后的 index.html');
}