// 检查管理员账户状态
const https = require('https');

console.log('🔍 检查管理员账户状态...\n');

const API_URL = 'https://novel-platform-api.sunlongyun1030.workers.dev';

// 测试管理员登录
function testAdminLogin() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            email: 'admin@dskxx.cc',
            password: 'Admin123!@#'
        });
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };
        
        const req = https.request(`${API_URL}/api/users/login`, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`📊 登录响应状态码: ${res.statusCode}`);
                console.log(`📄 登录响应内容: ${data.substring(0, 200)}...\n`);
                
                if (res.statusCode === 200) {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('✅ 管理员登录成功！');
                        console.log(`   用户ID: ${jsonData.data?.id || '未知'}`);
                        console.log(`   用户名: ${jsonData.data?.username || '未知'}`);
                        console.log(`   角色: ${jsonData.data?.role || '未知'}`);
                        resolve(true);
                    } catch (e) {
                        console.log('⚠️ 登录响应解析失败');
                        resolve(false);
                    }
                } else {
                    console.log('❌ 管理员登录失败');
                    console.log('   可能的原因:');
                    console.log('   1. 管理员账户不存在');
                    console.log('   2. 密码错误');
                    console.log('   3. 数据库未扩展（缺少role字段）');
                    resolve(false);
                }
            });
        });
        
        req.on('error', (err) => {
            console.error(`❌ 登录请求失败: ${err.message}`);
            reject(err);
        });
        
        req.write(postData);
        req.end();
    });
}

// 检查用户列表
function checkUsersList() {
    return new Promise((resolve, reject) => {
        https.get(`${API_URL}/api/users?limit=5`, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`📊 用户列表状态码: ${res.statusCode}`);
                
                if (res.statusCode === 200) {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log(`📋 用户总数: ${jsonData.total || jsonData.data?.length || 0}`);
                        
                        if (jsonData.data && jsonData.data.length > 0) {
                            console.log('\n👥 前5个用户:');
                            jsonData.data.forEach((user, index) => {
                                console.log(`   ${index + 1}. ${user.username} (${user.email}) - 角色: ${user.role || '未设置'}`);
                            });
                        }
                        
                        // 检查是否有管理员账户
                        const adminUsers = jsonData.data?.filter(user => user.role === 'admin') || [];
                        console.log(`\n🛡️ 管理员账户数量: ${adminUsers.length}`);
                        
                        if (adminUsers.length === 0) {
                            console.log('⚠️ 没有找到管理员账户');
                            console.log('   需要执行数据库扩展SQL创建管理员账户');
                        }
                        
                        resolve(true);
                    } catch (e) {
                        console.log(`📄 用户列表响应: ${data.substring(0, 200)}...`);
                        resolve(false);
                    }
                } else {
                    console.log('❌ 获取用户列表失败');
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            console.error(`❌ 获取用户列表失败: ${err.message}`);
            reject(err);
        });
    });
}

// 检查数据库表结构
function checkTableStructure() {
    return new Promise((resolve, reject) => {
        // 尝试查询用户表结构
        const postData = JSON.stringify({
            query: "SELECT name, type FROM pragma_table_info('users')"
        });
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };
        
        const req = https.request(`${API_URL}/api/admin/db-query`, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('\n📊 用户表结构:');
                        if (jsonData.data && jsonData.data.length > 0) {
                            jsonData.data.forEach((column, index) => {
                                console.log(`   ${index + 1}. ${column.name} (${column.type})`);
                            });
                            
                            // 检查是否有role字段
                            const hasRoleField = jsonData.data.some(col => col.name === 'role');
                            const hasStatusField = jsonData.data.some(col => col.name === 'status');
                            
                            console.log(`\n✅ role字段: ${hasRoleField ? '存在' : '不存在'}`);
                            console.log(`✅ status字段: ${hasStatusField ? '存在' : '不存在'}`);
                            
                            if (!hasRoleField || !hasStatusField) {
                                console.log('🚨 需要执行数据库扩展SQL添加字段');
                            }
                        }
                        resolve(true);
                    } catch (e) {
                        console.log('\n⚠️ 无法检查表结构（API端点可能不存在）');
                        resolve(false);
                    }
                } else {
                    console.log('\n⚠️ 无法检查表结构（API端点可能不存在）');
                    resolve(false);
                }
            });
        });
        
        req.on('error', (err) => {
            console.log('\n⚠️ 无法检查表结构（API端点可能不存在）');
            resolve(false);
        });
        
        req.write(postData);
        req.end();
    });
}

async function runDiagnosis() {
    console.log('1. 测试管理员登录...');
    const loginSuccess = await testAdminLogin().catch(() => false);
    
    console.log('\n2. 检查用户列表...');
    await checkUsersList().catch(() => false);
    
    console.log('\n3. 检查数据库表结构...');
    await checkTableStructure().catch(() => false);
    
    console.log('\n🎯 诊断结果:');
    
    if (!loginSuccess) {
        console.log('🚨 管理员登录失败！');
        console.log('\n💡 解决方案:');
        console.log('   1. 执行数据库扩展SQL（必须）');
        console.log('   2. 创建管理员账户');
        console.log('   3. 测试登录');
        
        console.log('\n📝 立即执行步骤:');
        console.log('   1. 登录 Cloudflare Dashboard');
        console.log('   2. Workers & Pages → D1');
        console.log('   3. 选择数据库: novel-db');
        console.log('   4. 执行 admin-system-full.sql');
        console.log('   5. 测试登录: https://dskxx.ccwu.cc/admin.html');
    } else {
        console.log('✅ 管理员登录正常！');
        console.log('\n💡 如果网页登录失败，可能原因:');
        console.log('   1. 浏览器缓存问题（清除缓存）');
        console.log('   2. 前端代码问题');
        console.log('   3. 密码输入错误');
    }
}

runDiagnosis();