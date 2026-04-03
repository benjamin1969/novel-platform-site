-- ============================================
-- 仅创建管理员账户 - 最简单版本
-- ============================================

-- 1. 首先检查用户表结构
SELECT '1. 用户表结构:' as step;
SELECT name, type FROM pragma_table_info('users');

-- 2. 尝试添加role字段（如果不存在）
-- 注意：如果字段已存在，会报错但可以忽略
BEGIN TRANSACTION;
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'reader';
COMMIT;

-- 3. 检查是否已有admin用户
SELECT '2. 检查现有admin用户:' as step;
SELECT id, username, email FROM users WHERE username = 'admin' OR email LIKE '%admin%';

-- 4. 创建管理员账户
-- 密码: Admin123!@# 的SHA-256哈希
SELECT '3. 创建管理员账户...' as step;
INSERT OR REPLACE INTO users (
    id, username, email, password_hash, 
    role, registered_at
) VALUES (
    'admin_' || CAST(strftime('%s', 'now') AS TEXT) || '_' || CAST(random() * 10000 AS INTEGER),
    'admin',
    'admin@dskxx.cc',
    '2e465c919fbaae85ea20c78ba44a17a99fc09d7c5074f09f5db89937eed485d3',
    'admin',
    CAST(strftime('%s', 'now') AS INTEGER)
);

-- 5. 验证创建结果
SELECT '4. 管理员账户创建结果:' as step;
SELECT 
    id,
    username,
    email,
    role,
    CASE 
        WHEN role = 'admin' THEN '✅ 管理员'
        WHEN role = 'author' THEN '👤 作者'
        WHEN role = 'reader' THEN '👥 读者'
        ELSE '❓ 未知'
    END as role_text,
    datetime(registered_at, 'unixepoch') as registered_time
FROM users 
WHERE username = 'admin' OR email = 'admin@dskxx.cc'
ORDER BY registered_at DESC;

-- 6. 显示所有用户（验证）
SELECT '5. 所有用户列表:' as step;
SELECT 
    username,
    email,
    CASE 
        WHEN role = 'admin' THEN '🛡️ 管理员'
        WHEN role = 'author' THEN '✍️ 作者'
        WHEN role = 'reader' THEN '👤 读者'
        ELSE '❓ ' || COALESCE(role, '未设置')
    END as role,
    datetime(registered_at, 'unixepoch') as registered_time
FROM users 
ORDER BY 
    CASE role 
        WHEN 'admin' THEN 1
        WHEN 'author' THEN 2
        WHEN 'reader' THEN 3
        ELSE 4
    END,
    registered_at DESC;

-- 7. 最终确认
SELECT '✅ 完成！' as final_message;
SELECT '管理员账户信息:' as info;
SELECT '用户名: admin' as detail;
SELECT '邮箱: admin@dskxx.cc' as detail;
SELECT '密码: Admin123!@#' as detail;
SELECT '角色: 系统管理员' as detail;
SELECT '登录地址: https://dskxx.ccwu.cc/admin.html' as detail;