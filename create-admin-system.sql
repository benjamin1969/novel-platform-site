-- 管理员系统数据库扩展脚本
-- 在Cloudflare D1 Dashboard中执行

-- 1. 为用户表添加角色字段
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'reader' CHECK(role IN ('reader', 'author', 'admin'));

-- 2. 为用户表添加状态字段
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'banned'));

-- 3. 为用户表添加注册时间字段（如果不存在）
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

-- 10. 创建管理员账户（密码：Admin123!@#）
-- 注意：实际密码需要哈希存储，这里只是示例
INSERT OR IGNORE INTO users (id, username, email, password_hash, role, status, registered_at) 
VALUES (
    'admin_001',
    'admin',
    'admin@dskxx.cc',
    -- 密码哈希：Admin123!@# （实际应该使用bcrypt/scrypt）
    '$2b$10$YourHashedPasswordHere', -- 这里需要实际的哈希值
    'admin',
    'active',
    CAST(strftime('%s', 'now') AS INTEGER)
);

-- 11. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_novels_review_status ON novels(review_status);
CREATE INDEX IF NOT EXISTS idx_comments_review_status ON comments(review_status);

-- 12. 更新现有用户的角色（默认设为reader）
UPDATE users SET role = 'reader' WHERE role IS NULL;

-- 13. 更新现有用户的注册时间
UPDATE users SET registered_at = CAST(strftime('%s', 'now') AS INTEGER) WHERE registered_at IS NULL;

-- 14. 查看用户表结构
SELECT name, type FROM pragma_table_info('users');

-- 15. 查看所有管理员账户
SELECT id, username, email, role, status, registered_at 
FROM users 
WHERE role = 'admin'
ORDER BY registered_at DESC;