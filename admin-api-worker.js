// 管理员API Worker脚本
// 需要替换现有的 worker.js 或添加为新的Worker

// 管理员API路由处理
async function handleAdminRequest(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // 获取JWT令牌
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({
            success: false,
            message: '需要认证令牌'
        }), { status: 401 });
    }
    
    const token = authHeader.substring(7);
    
    // 验证管理员权限
    const user = await verifyAdminToken(token, env);
    if (!user || user.role !== 'admin') {
        return new Response(JSON.stringify({
            success: false,
            message: '需要管理员权限'
        }), { status: 403 });
    }
    
    // 管理员API路由
    if (path === '/api/admin/stats' && method === 'GET') {
        return await getAdminStats(env, user);
    }
    
    if (path === '/api/admin/users' && method === 'GET') {
        return await getUsers(env, url, user);
    }
    
    if (path === '/api/admin/users' && method === 'POST') {
        return await createUser(request, env, user);
    }
    
    if (path.startsWith('/api/admin/users/') && method === 'GET') {
        const userId = path.split('/').pop();
        return await getUserById(env, userId, user);
    }
    
    if (path.startsWith('/api/admin/users/') && method === 'PUT') {
        const userId = path.split('/').pop();
        return await updateUser(request, env, userId, user);
    }
    
    if (path.startsWith('/api/admin/users/') && method === 'DELETE') {
        const userId = path.split('/').pop();
        return await deleteUser(env, userId, user);
    }
    
    if (path === '/api/admin/novels' && method === 'GET') {
        return await getNovelsForAdmin(env, url, user);
    }
    
    if (path.startsWith('/api/admin/novels/') && method === 'DELETE') {
        const novelId = path.split('/').pop();
        return await deleteNovel(env, novelId, user);
    }
    
    if (path === '/api/admin/comments' && method === 'GET') {
        return await getCommentsForAdmin(env, url, user);
    }
    
    if (path.startsWith('/api/admin/comments/') && method === 'DELETE') {
        const commentId = path.split('/').pop();
        return await deleteComment(env, commentId, user);
    }
    
    if (path === '/api/admin/reports' && method === 'GET') {
        return await getReports(env, url, user);
    }
    
    if (path.startsWith('/api/admin/reports/') && method === 'GET') {
        const reportId = path.split('/').pop();
        return await getReportById(env, reportId, user);
    }
    
    if (path.startsWith('/api/admin/reports/') && method === 'PUT') {
        const reportId = path.split('/').pop();
        return await updateReport(request, env, reportId, user);
    }
    
    if (path === '/api/admin/review' && method === 'POST') {
        return await reviewContent(request, env, user);
    }
    
    if (path === '/api/admin/pending' && method === 'GET') {
        return await getPendingContent(env, url, user);
    }
    
    if (path === '/api/admin/backups' && method === 'GET') {
        return await getBackups(env, user);
    }
    
    if (path === '/api/admin/backups' && method === 'POST') {
        return await createBackup(request, env, user);
    }
    
    if (path.startsWith('/api/admin/backups/') && path.endsWith('/download') && method === 'GET') {
        const backupId = path.split('/')[4];
        return await downloadBackup(env, backupId, user);
    }
    
    if (path.startsWith('/api/admin/backups/') && method === 'DELETE') {
        const backupId = path.split('/').pop();
        return await deleteBackup(env, backupId, user);
    }
    
    if (path === '/api/admin/logs' && method === 'GET') {
        return await getAdminLogs(env, url, user);
    }
    
    if (path === '/api/admin/activities' && method === 'GET') {
        return await getRecentActivities(env, url, user);
    }
    
    if (path === '/api/admin/db-size' && method === 'GET') {
        return await getDatabaseSize(env, user);
    }
    
    return new Response(JSON.stringify({
        success: false,
        message: '管理员API端点不存在'
    }), { status: 404 });
}

// 验证管理员令牌
async function verifyAdminToken(token, env) {
    try {
        // 这里应该使用JWT验证
        // 简化版：直接从数据库查询用户
        const result = await env.DB.prepare(`
            SELECT id, username, email, role, status 
            FROM users 
            WHERE id IN (SELECT user_id FROM sessions WHERE token = ?)
        `).bind(token).first();
        
        return result;
    } catch (error) {
        console.error('验证令牌失败:', error);
        return null;
    }
}

// 记录管理员操作日志
async function logAdminAction(env, user, action, targetType, targetId, details) {
    try {
        const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await env.DB.prepare(`
            INSERT INTO admin_logs (id, user_id, action, target_type, target_id, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
            logId,
            user.id,
            action,
            targetType || null,
            targetId || null,
            details || null,
            Math.floor(Date.now() / 1000)
        ).run();
    } catch (error) {
        console.error('记录操作日志失败:', error);
    }
}

// 获取管理员统计数据
async function getAdminStats(env, user) {
    try {
        // 获取用户统计
        const usersStats = await env.DB.prepare(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
                SUM(CASE WHEN role = 'author' THEN 1 ELSE 0 END) as authors,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended,
                SUM(CASE WHEN DATE(registered_at, 'unixepoch') = DATE('now') THEN 1 ELSE 0 END) as today_new
            FROM users
        `).first();
        
        // 获取小说统计
        const novelsStats = await env.DB.prepare(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
                SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts,
                SUM(CASE WHEN review_status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN DATE(created_at, 'unixepoch') = DATE('now') THEN 1 ELSE 0 END) as today_new
            FROM novels
        `).first();
        
        // 获取评论统计
        const commentsStats = await env.DB.prepare(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN review_status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN DATE(created_at, 'unixepoch') = DATE('now') THEN 1 ELSE 0 END) as today_new
            FROM comments
        `).first();
        
        // 获取举报统计
        const reportsStats = await env.DB.prepare(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
            FROM reports
        `).first();
        
        // 记录操作日志
        await logAdminAction(env, user, 'view_stats', 'system', null, '查看系统统计');
        
        return new Response(JSON.stringify({
            success: true,
            data: {
                totalUsers: usersStats?.total || 0,
                totalAdmins: usersStats?.admins || 0,
                totalAuthors: usersStats?.authors || 0,
                activeUsers: usersStats?.active || 0,
                suspendedUsers: usersStats?.suspended || 0,
                todayUsers: usersStats?.today_new || 0,
                
                totalNovels: novelsStats?.total || 0,
                publishedNovels: novelsStats?.published || 0,
                draftNovels: novelsStats?.drafts || 0,
                pendingNovels: novelsStats?.pending || 0,
                todayNovels: novelsStats?.today_new || 0,
                
                totalComments: commentsStats?.total || 0,
                pendingComments: commentsStats?.pending || 0,
                todayComments: commentsStats?.today_new || 0,
                
                totalReports: reportsStats?.total || 0,
                pendingReports: reportsStats?.pending || 0,
                
                pendingReviews: (novelsStats?.pending || 0) + (commentsStats?.pending || 0)
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('获取统计数据失败:', error);
        return new Response(JSON.stringify({
            success: false,
            message: '获取统计数据失败'
        }), { status: 500 });
    }
}

// 获取用户列表（管理员）
async function getUsers(env, url, user) {
    try {
        const searchParams = url.searchParams;
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const search = searchParams.get('search');
        const offset = (page - 1) * limit;
        
        let query = 'SELECT * FROM users';
        let countQuery = 'SELECT COUNT(*) as total FROM users';
        const params = [];
        
        if (search) {
            query += ' WHERE username LIKE ? OR email LIKE ?';
            countQuery += ' WHERE username LIKE ? OR email LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        query += ' ORDER BY registered_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        // 获取用户数据
        const users = await env.DB.prepare(query).bind(...params).all();
        
        // 获取总数
        const countResult = await env.DB.prepare(countQuery).bind(...params.slice(0, search ? 2 : 0)).first();
        const total = countResult?.total || 0;
        const totalPages = Math.ceil(total / limit);
        
        // 记录操作日志
        await logAdminAction(env, user, 'view_users', 'user', null, `查看用户列表，第${page}页`);
        
        return new Response(JSON.stringify({
            success: true,
            data: users.results,
            total: total,
            page: page,
            totalPages: totalPages
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('获取用户列表失败:', error);
        return new Response(JSON.stringify({
            success: false,
            message: '获取用户列表失败'
        }), { status: 500 });
    }
}

// 创建用户（管理员）
async function createUser(request, env, user) {
    try {
        const data = await request.json();
        const { username, email, password, role = 'reader', status = 'active' } = data;
        
        // 验证输入
        if (!username || !email || !password) {
            return new Response(JSON.stringify({
                success: false,
                message: '请填写所有必填字段'
            }), { status: 400 });
        }
        
        // 检查用户名是否已存在
        const existingUser = await env.DB.prepare(
            'SELECT id FROM users WHERE username = ?'
        ).bind(username).first();
        
        if (existingUser) {
            return new Response(JSON.stringify({
                success: false,
                message: '用户名已存在'
            }), { status: 400 });
        }
        
        // 生成用户ID和密码哈希
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const passwordHash = await hashPassword(password);
        const registeredAt = Math.floor(Date.now() / 1000);
        
        // 创建用户
        await env.DB.prepare(`
            INSERT INTO users (id, username, email, password_hash, role, status, registered_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
            userId,
            username,
            email,
            passwordHash,
            role,
            status,
            registeredAt
        ).run();
        
        // 记录操作日志
        await logAdminAction(env, user, 'create_user', 'user', userId, `创建用户: ${username}, 角色: ${role}`);
        
        return new Response(JSON.stringify({
            success: true,
            message: '用户创建成功',
            data: { id: userId, username, email, role, status }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('创建用户失败:', error);
        return new Response(JSON.stringify({
            success: false,
            message: '创建用户失败'
        }), { status: 500 });
    }
}

// 获取单个用户信息
async function getUserById(env, userId, adminUser) {
    try {
        const user = await env.DB.prepare(
            'SELECT id, username, email, role, status, registered_at, last_login_at FROM users WHERE id = ?'
        ).bind(userId).first();
        
        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                message: '用户不存在'
            }), { status: 404 });
        }
        
        // 记录操作日志
        await logAdminAction(env, adminUser, 'view_user', 'user', userId, `查看用户信息: ${user.username}`);
        
        return new Response(JSON.stringify({
            success: true,
            data: user
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return new Response(JSON.stringify({
            success: false,
            message: '获取用户信息失败'
        }), { status: 500 });
    }
}

// 更新用户信息
async function updateUser(request, env, userId, adminUser) {
    try {
        const data = await request.json();
        const { email, role, status, password } = data;
        
        // 检查用户是否存在
        const existingUser = await env.DB.prepare(
            'SELECT username FROM users WHERE id = ?'
        ).bind(userId).first();
        
        if (!existingUser) {
            return new Response(JSON.stringify({
                success: false,
                message: '用户不存在'
            }), { status: 404 });
        }
        
        // 构建更新语句
        let updateFields = [];
        let params = [];
        
        if (email !== undefined) {
            updateFields.push('email = ?');
            params.push(email);
        }
        
        if (role !== undefined) {
            updateFields.push('role = ?');
            params.push(role);
        }
        
        if (status !== undefined) {
            updateFields.push('status = ?');
            params.push(status);
        }
        
        if (password) {
            const passwordHash = await hashPassword(password);
            updateFields.push('password_hash = ?');
            params.push(passwordHash);
        }
        
        if (updateFields.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: '没有需要更新的字段'
            }), { status: 400 });
        }
        
        params.push(userId);
        
        const updateQuery = `
            UPDATE users 
            SET ${updateFields.join(', ')} 
            WHERE id = ?
        `;
        
        await env.DB.prepare(updateQuery).bind(...params).run();
        
        // 记录操作日志
        await logAdminAction(env, adminUser, 'update_user', 'user', userId, 
            `更新用户信息: ${existingUser.username}, 更新字段: ${updateFields.join(', ')}`);
        
        return new Response(JSON.stringify({
            success: true,
            message: '用户信息更新成功'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('更新用户失败:', error);
        return new Response(JSON.stringify({
            success: false,
            message: '更新用户失败'
        }), { status: 500 });
    }
}

// 删除用户
async function deleteUser(env, userId, adminUser) {
    try {
        // 检查用户是否存在
        const existingUser = await env.DB.prepare(
            'SELECT username FROM users WHERE id = ?'
        ).bind(userId).first();
        
        if (!existingUser) {
            return new Response(JSON.stringify({
                success: false,
                message: '用户不存在'
            }), { status: 404 });
        }
        
        // 删除用户（级联删除相关数据）
        await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
        
        // 记录操作