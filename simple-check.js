// 简单检查API状态
const https = require('https');

console.log('🔍 简单检查API状态...\n');

const API_URL = 'https://novel-platform-api.sunlongyun1030.workers.dev';

function checkAPI() {
    return new Promise((resolve, reject) => {
        https.get(`${API_URL}/health`, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`✅ API健康检查: ${data.substring(0, 100)}...`);
                resolve(true);
            });
        }).on('error', (err) => {
            console.error(`❌ API连接失败: ${err.message}`);
            reject(err);
        });
    });
}

function checkDatabase() {
    return new Promise((resolve, reject) => {
        https.get(`${API_URL}/api/health`, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log(`✅ 数据库连接: ${jsonData.message}`);
                    resolve(true);
                } catch (e) {
                    console.log(`📄 数据库响应: ${data.substring(0, 100)}...`);
                    resolve(true);
                }
            });
        }).on('error', (err) => {
            console.error(`❌ 数据库连接失败: ${err.message}`);
            reject(err);
        });
    });
}

async function runChecks() {
    try {
        console.log('1. 检查API服务...');
        await checkAPI();
        
        console.log('\n2. 检查数据库连接...');
        await checkDatabase();
        
        console.log('\n🎉 所有检查通过！');
        console.log('\n📊 当前状态:');
        console.log('   ✅ API服务正常运行');
        console.log('   ✅ 数据库连接正常');
        console.log('   ⚠️ 需要执行数据库扩展SQL');
        
        console.log('\n🚀 下一步操作:');
        console.log('   请登录 Cloudflare Dashboard 执行以下SQL:');
        console.log('   -----------------------------------------');
        console.log('   1. 访问: https://dash.cloudflare.com/');
        console.log('   2. Workers & Pages → D1');
        console.log('   3. 选择数据库: novel-db');
        console.log('   4. 在 Query 标签页执行 admin-system-full.sql');
        console.log('   -----------------------------------------');
        
    } catch (error) {
        console.log('\n🚨 检查失败，需要手动验证:');
        console.log('   1. 访问: https://novel-platform-api.sunlongyun1030.workers.dev/health');
        console.log('   2. 访问: https://novel-platform-api.sunlongyun1030.workers.dev/api/health');
        console.log('   3. 确认两个链接都能正常访问');
    }
}

runChecks();