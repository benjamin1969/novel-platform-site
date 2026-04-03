-- ============================================
-- 简化版管理员系统设置
-- 专为解决管理员登录问题
-- ============================================

-- 第一步：检查表结构
SELECT '当前用户表结构:' as table_info;
SELECT name, type FROM pragma_table_info('users');

-- 第二步：添加角色字段（如果不存在）
-- 注意：如果字段已存在，会报错但可以忽略
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'reader' CHECK(role IN ('reader', 'author', 'admin'));

-- 第三步：添加状态字段（如果不存在）
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'banned'));

-- 第四步：添加注册时间字段（如果不存在）
ALTER TABLE users ADD COLUMN registered_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER));

-- 第五步：检查是否已有管理员账户
SELECT '当前管理员账户:' as admin_check;
SELECT id, username, email, role, status FROM users WHERE role = 'admin';

-- 第六步：创建管理员账户（如果不存在）
-- 用户名: admin, 密码: Admin123!@# (首次登录后请立即修改)
INSERT OR IGNORE INTO users (
    id, username, email, password_hash, 
    role, status, registered_at
) VALUES (
    'admin_001',
    'admin',
    'admin@dskxx.cc',
    '2e465c919fbaae85ea20c78ba44a17a99fc09d7c5074f09f5db89937eed485d3', -- Admin123!@# 的SHA-256哈希
    'admin',
    'active',
    CAST(strftime('%s', 'now') AS INTEGER)
);

-- 第七步：验证管理员账户创建成功
SELECT '管理员账户创建结果:' as result;
SELECT id, username, email, role, status, registered_at 
FROM users 
WHERE username = 'admin' OR email = 'admin@dskxx.cc';

-- 第八步：更新现有用户的角色（如果没有设置）
UPDATE users SET role = 'reader' WHERE role IS NULL OR role = '';

-- 第九步：最终验证
SELECT '最终验证 - 所有用户:' as final_check;
SELECT username, email, role, status FROM users ORDER BY registered_at DESC;

-- 第十步：表结构验证
SELECT '最终表结构:' as final_structure;
SELECT name, type FROM pragma_table_info('users');