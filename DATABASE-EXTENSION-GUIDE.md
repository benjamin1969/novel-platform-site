# 数据库扩展操作指南

## 📋 操作概述
为班级小说网站添加完整的管理员系统，需要扩展数据库结构。

## 🚀 立即执行步骤

### 步骤1: 登录 Cloudflare Dashboard
1. 访问: https://dash.cloudflare.com/
2. 使用您的Cloudflare账户登录

### 步骤2: 进入D1数据库管理
1. 左侧菜单点击 **Workers & Pages**
2. 在顶部标签页点击 **D1**
3. 找到数据库: **novel-db** (ID: a4b9d2d4-b70f-4c75-8976-d97154dbb4e2)
4. 点击数据库名称进入详情页

### 步骤3: 执行SQL扩展脚本
1. 点击 **Query** 标签页
2. 复制下面的完整SQL脚本
3. 粘贴到SQL编辑器中
4. 点击 **Run** 按钮执行

## 📝 完整SQL脚本

```sql
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
-- 用户名: admin, 密码: Admin123!@# (首次登录后请立即修改)
INSERT OR REPLACE INTO users (
    id, username, email, password_hash, 
    role, status, registered_at, last_login_at
) VALUES (
    'admin_001',
    'admin',
    'admin@dskxx.cc',
    '2e465c919fbaae85ea20c78ba44a17a99fc09d7c5074f09f5db89937eed485d3',
    'admin',
    'active',
    CAST(strftime('%s', 'now') AS INTEGER),
    NULL
);

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
```

## ✅ 执行后验证

执行成功后，您应该看到：
1. **用户表结构** - 显示所有字段，包括新增的role、status等
2. **管理员账户** - 显示新创建的管理员账户

## 🔐 管理员登录信息

- **后台地址**: https://dskxx.ccwu.cc/admin.html
- **用户名**: `admin`
- **密码**: `Admin123!@#`
- **重要**: 首次登录后立即修改密码！

## 🛠️ 如果遇到错误

### 常见错误及解决方法：

1. **"table users already has column role"**
   - 说明字段已存在，可以跳过相关ALTER TABLE语句
   - 注释掉或删除重复的ALTER TABLE语句

2. **"table already exists"**
   - 说明表已存在，可以跳过CREATE TABLE语句
   - 注释掉或删除重复的CREATE TABLE语句

3. **语法错误**
   - 检查SQL语句的拼写和格式
   - 确保所有语句以分号结束
   - 可以分段执行，先执行ALTER TABLE，再执行CREATE TABLE

### 分段执行方案：

如果完整脚本执行失败，可以分段执行：

```sql
-- 第一部分：修改现有表
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'reader' CHECK(role IN ('reader', 'author', 'admin'));
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'banned'));
ALTER TABLE users ADD COLUMN registered_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER));
ALTER TABLE users ADD COLUMN last_login_at INTEGER;
ALTER TABLE novels ADD COLUMN review_status TEXT DEFAULT 'approved' CHECK(review_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE comments ADD COLUMN review_status TEXT DEFAULT 'approved' CHECK(review_status IN ('pending', 'approved', 'rejected'));

-- 第二部分：创建新表
CREATE TABLE IF NOT EXISTS admin_logs (...);
CREATE TABLE IF NOT EXISTS backups (...);
CREATE TABLE IF NOT EXISTS reports (...);

-- 第三部分：创建管理员账户
INSERT OR REPLACE INTO users (...);

-- 第四部分：创建索引
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
-- ... 其他索引

-- 第五部分：更新现有数据
UPDATE users SET role = 'reader' WHERE role IS NULL;
UPDATE users SET registered_at = CAST(strftime('%s', 'now') AS INTEGER) WHERE registered_at IS NULL;
```

## 📊 扩展内容说明

### 新增字段：
1. **users.role** - 用户角色：reader/author/admin
2. **users.status** - 用户状态：active/suspended/banned
3. **users.registered_at** - 注册时间
4. **users.last_login_at** - 最后登录时间
5. **novels.review_status** - 小说审核状态
6. **comments.review_status** - 评论审核状态

### 新增表：
1. **admin_logs** - 管理员操作日志
2. **backups** - 数据备份记录
3. **reports** - 用户举报记录

## 🎯 下一步操作

数据库扩展完成后：
1. 访问管理员后台：https://dskxx.ccwu.cc/admin.html
2. 使用管理员账户登录
3. 测试各项管理功能
4. 开发后端管理员API（如果需要完整功能）

## 📞 技术支持

如果遇到问题：
1. 检查SQL错误信息
2. 分段执行SQL脚本
3. 联系OpenClaw AI获取帮助

**执行时间**: 约2-5分钟
**影响**: 不会影响现有用户数据
**回滚**: 如果需要回滚，可以删除新增字段和表