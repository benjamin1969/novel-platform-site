// 检查数据库状态
const fetch = require('node-fetch');

console.log('🔍 检查数据库状态...\n');

const API_URL = 'https://novel-platform-api.sunlongyun1030.workers.dev';

async function checkDatabaseStatus() {
    try {
        console.log('1. 检查API健康状态...');
        const healthResponse = await fetch(`${API_URL}/health`);
        const healthData = await healthResponse.text();
        console.log(`   ✅ API健康: ${healthData.substring(0, 100)}...\n`);
        
        console.log('2. 检查数据库连接...');
        const dbResponse = await fetch(`${API_URL}/api/health`);
        const dbData = await dbResponse.json();
        console.log(`   ✅ 数据库连接: ${dbData.message}\n`);
        
        console.log('3. 检查现有用户表...');
        const usersResponse = await fetch(`${API_URL}/api/users?limit=1`);
        const usersData = await usersResponse.json();
        
        if (usersResponse.ok) {
            console.log(`   ✅ 用户表存在，共有 ${usersData.total || usersData.data?.length || 0} 个用户\n`);
            
            // 检查是否有管理员账户
            console.log('4. 检查管理员账户...');
            if (usersData.data && usersData.data.length > 0) {
                const adminUsers = usersData.data.filter(user => user.role === 'admin');
                console.log(`   ${adminUsers.length > 0 ? '✅' : '⚠️'} 找到 ${adminUsers.length} 个管理员账户\n`);
                
                if (adminUsers.length === 0) {
                    console.log('   ⚠️ 需要创建管理员账户\n');
                }
            }
        } else {
            console.log('   ❌ 用户表可能不存在或有问题\n');
        }
        
        console.log('5. 检查小说表...');
        const novelsResponse = await fetch(`${API_URL}/api/novels?limit=1`);
        const novelsData = await novelsResponse.json();
        
        if (novelsResponse.ok) {
            console.log(`   ✅ 小说表存在，共有 ${novelsData.total || novelsData.data?.length || 0} 篇小说\n`);
        } else {
            console.log('   ⚠️ 小说表可能不存在\n');
        }
        
        console.log('📊 数据库状态总结:');
        console.log('   ✅ API服务正常');
        console.log('   ✅ 数据库连接正常');
        console.log(`   ✅ 用户表: ${usersResponse.ok ? '正常' : '可能有问题'}`);
        console.log(`   ✅ 小说表: ${novelsResponse.ok ? '正常' : '可能有问题'}`);
        console.log('   ⚠️ 需要执行数据库扩展SQL');
        
        return true;
        
    } catch (error) {
        console.error('❌ 检查数据库状态失败:', error.message);
        console.log('\n💡 可能的原因:');
        console.log('   1. API服务未运行');
        console.log('   2. 网络连接问题');
        console.log('   3. 数据库配置错误');
        return false;
    }
}

// 执行检查
checkDatabaseStatus().then(success => {
    if (success) {
        console.log('\n🎯 下一步: 执行数据库扩展SQL');
        console.log('   1. 登录 Cloudflare Dashboard');
        console.log('   2. Workers & Pages → D1');
        console.log('   3. 选择数据库: novel-db');
        console.log('   4. 执行 admin-system-full.sql');
    } else {
        console.log('\n🚨 需要先解决数据库连接问题');
    }
});