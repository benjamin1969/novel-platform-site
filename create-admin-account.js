// 创建管理员账户脚本
// 需要先安装bcrypt: npm install bcryptjs

const crypto = require('crypto');

console.log('🔧 创建管理员账户脚本\n');

// 生成随机ID
function generateId(prefix = 'user') {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `${prefix}_${timestamp}_${random}`;
}

// 生成密码哈希（简化版，实际应该使用bcrypt）
function generatePasswordHash(password) {
    // 注意：这是简化版，实际生产环境应该使用bcrypt
    const salt = 'dskxx_admin_salt_2026';
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}

// 管理员账户信息
const adminAccount = {
    id: 'admin_001',
    username: 'admin',
    email: 'admin@dskxx.cc',
    password: 'Admin123!@#', // 默认密码，首次登录后应该修改
    role: 'admin',
    status: 'active'
};

// 生成SQL语句
const passwordHash = generatePasswordHash(adminAccount.password);
const timestamp = Math.floor(Date.now() / 1000);

const sql = `
-- 创建管理员账户
INSERT OR REPLACE INTO users (
    id, username, email, password_hash, 
    role, status, registered_at, last_login_at
) VALUES (
    '${adminAccount.id}',
    '${adminAccount.username}',
    '${adminAccount.email}',
    '${passwordHash}',
    '${adminAccount.role}',
    '${adminAccount.status}',
    ${timestamp},
    NULL
);

-- 验证管理员账户
SELECT id, username, email, role, status, registered_at 
FROM users 
WHERE role = 'admin'
ORDER BY registered_at DESC;
`;

console.log('📋 管理员账户信息:');
console.log(`   用户名: ${adminAccount.username}`);
console.log(`   邮箱: ${adminAccount.email}`);
console.log(`   密码: ${adminAccount.password} (首次登录后请立即修改)`);
console.log(`   角色: ${adminAccount.role}`);
console.log(`   状态: ${adminAccount.status}`);
console.log(`   ID: ${adminAccount.id}`);

console.log('\n🔑 密码哈希:');
console.log(`   ${passwordHash}`);

console.log('\n📝 SQL语句:');
console.log(sql);

console.log('\n🚀 执行步骤:');
console.log('   1. 登录 Cloudflare Dashboard');
console.log('   2. 进入 Workers & Pages → D1');
console.log('   3. 选择数据库: novel-db');
console.log('   4. 在 Query 标签页粘贴上面的SQL');
console.log('   5. 点击 Run 执行');

console.log('\n⚠️ 安全提醒:');
console.log('   1. 首次登录后立即修改密码');
console.log('   2. 不要分享管理员账户信息');
console.log('   3. 定期备份数据库');
console.log('   4. 监控管理员操作日志');

console.log('\n🎯 管理员权限:');
console.log('   ✅ 管理所有用户账户');
console.log('   ✅ 审核小说发布');
console.log('   ✅ 管理评论内容');
console.log('   ✅ 查看系统日志');
console.log('   ✅ 执行数据备份');
console.log('   ✅ 处理用户举报');

// 生成完整的数据库扩展SQL
const fullSql = `
-- ============================================
-- 管理员系统数据库扩展
-- ============================================

-- 1. 为用户表添加角色字段
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'reader' CHECK(role IN ('reader', 'author', 'admin'));

-- 2. 为用户表添加状态字段
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'banned'));

-- 3. 为用户表添加注册时间字段
ALTER TABLE users ADD COLUMN registered_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER));

-- 4. 为用户表添加最后登录时间字段
ALTER TABLE users ADD COLUMN last_login_at INTEGER;

-- 5. 创建操作日志表
CREATE TABLE IF NOT EXISTS admin_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. 创建备份记录表
CREATE TABLE IF NOT EXISTS backups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    file_size INTEGER,
    backup_type TEXT NOT NULL CHECK(backup_type IN ('full', 'partial')),
    status TEXT NOT NULL CHECK(status IN ('pending', 'completed', 'failed')),
    created_by TEXT NOT NULL,
    created_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)),
    completed_at INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. 创建举报表
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK(target_type IN ('novel', 'comment', 'user')),
    target_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    reviewed_by TEXT,
    reviewed_at INTEGER,
    resolution TEXT,
    created_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)),
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. 为小说表添加审核状态
ALTER TABLE novels ADD COLUMN review_status TEXT DEFAULT 'approved' CHECK(review_status IN ('pending', 'approved', 'rejected'));

-- 9. 为评论表添加审核状态
ALTER TABLE comments ADD COLUMN review_status TEXT DEFAULT 'approved' CHECK(review_status IN ('pending', 'approved', 'rejected'));

-- 10. 创建管理员账户
${sql}

-- 11. 创建索引
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_novels_review_status ON novels(review_status);
CREATE INDEX IF NOT EXISTS idx_comments_review_status ON comments(review_status);

-- 12. 更新现有数据
UPDATE users SET role = 'reader' WHERE role IS NULL;
UPDATE users SET registered_at = CAST(strftime('%s', 'now') AS INTEGER) WHERE registered_at IS NULL;

-- 13. 验证扩展结果
SELECT '用户表结构:' as table_info;
SELECT name, type FROM pragma_table_info('users');

SELECT '管理员账户:' as admin_accounts;
SELECT id, username, email, role, status, registered_at 
FROM users 
WHERE role = 'admin'
ORDER BY registered_at DESC;
`;

console.log('\n📦 完整数据库扩展SQL已生成');
console.log('💾 保存到: admin-system-full.sql');

// 保存完整SQL到文件
const fs = require('fs');
fs.writeFileSync('admin-system-full.sql', fullSql);
console.log('✅ 文件已保存');