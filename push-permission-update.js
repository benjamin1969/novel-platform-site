// 推送权限调整到GitHub
const { execSync } = require('child_process');

console.log('🚀 推送权限调整到GitHub...\n');
console.log('📋 调整内容: 班级内用小说网站权限设计');
console.log('🎯 核心原则: 阅读无需登录，发布/评论需要登录\n');

try {
    const gitPath = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    
    // 先拉取最新代码
    console.log('📥 拉取最新代码...');
    execSync(`${gitPath} pull origin main`, { stdio: 'inherit', shell: true });
    
    // 添加所有修改的文件
    console.log('📁 添加所有文件...');
    execSync(`${gitPath} add .`, { stdio: 'inherit', shell: true });
    
    // 提交更改
    console.log('💾 提交更改...');
    execSync(`${gitPath} commit -m "Update permission system for classroom novel platform

- Change: Reading novels no longer requires login (visitors can browse)
- Change: Publishing novels requires login (author permission)
- Change: Commenting requires login (reader permission)
- Add: Novel detail page (novel-detail.html) for visitors
- Update: Navigation and permission checks across all pages
- Feature: Prompt login when visitors try to publish or comment
- Design: User-friendly permission system for classroom use"`, { stdio: 'inherit', shell: true });
    
    // 推送到GitHub
    console.log('🚀 推送到GitHub...');
    execSync(`${gitPath} push origin main`, { stdio: 'inherit', shell: true });
    
    console.log('\n✅ 权限调整已推送！');
    
    console.log('\n📊 权限系统总结:');
    console.log('   1. ✅ 浏览小说 (novels.html) - 游客可访问');
    console.log('   2. ✅ 查看小说详情 (novel-detail.html) - 游客可访问');
    console.log('   3. ✅ 发布小说 (publish.html) - 需要登录');
    console.log('   4. ✅ 发表评论 - 需要登录');
    console.log('   5. ✅ 点赞/收藏 - 需要登录');
    console.log('   6. ✅ 管理作品 - 需要登录');
    
    console.log('\n🔗 用户流程:');
    console.log('   👤 游客:');
    console.log('     1. 访问首页 → 浏览小说 → 阅读小说详情');
    console.log('     2. 尝试发布 → 提示登录 → 注册/登录');
    console.log('     3. 尝试评论 → 提示登录 → 注册/登录');
    console.log('');
    console.log('   👤 已登录用户:');
    console.log('     1. 浏览小说 → 发布小说 → 管理章节');
    console.log('     2. 阅读小说 → 发表评论 → 点赞收藏');
    console.log('     3. 查看主页 → 管理作品 → 退出登录');
    
    console.log('\n📁 修改的文件:');
    console.log('   1. novels.html - 移除强制登录，添加权限检查');
    console.log('   2. index.html - 更新导航和权限检查');
    console.log('   3. novel-detail.html - 新增小说详情页面');
    console.log('   4. 所有页面 - 统一的权限检查逻辑');
    
    console.log('\n⏱️ 预计时间:');
    console.log('   - GitHub Pages自动部署: 1-2分钟');
    console.log('   - 网站更新生效: 立即');
    
    console.log('\n🔗 测试链接:');
    console.log('   1. 小说浏览: https://dskxx.ccwu.cc/novels.html');
    console.log('   2. 小说详情: https://dskxx.ccwu.cc/novel-detail.html?id=1 (示例)');
    console.log('   3. 发布小说: https://dskxx.ccwu.cc/publish.html');
    console.log('   4. 用户首页: https://dskxx.ccwu.cc/main.html');
    
    console.log('\n🎯 设计理念:');
    console.log('   - 降低访问门槛: 游客可以自由浏览和阅读');
    console.log('   - 保护创作环境: 发布和评论需要身份验证');
    console.log('   - 适合班级使用: 简单直观的权限系统');
    console.log('   - 渐进式体验: 从浏览到参与的平滑过渡');
    
} catch (error) {
    console.error('❌ 推送失败:', error.message);
    console.log('\n💡 备用方案:');
    console.log('   手动在GitHub网页上传修改的文件');
}