# 管理员API部署指南

## 📋 概述
为班级小说网站添加完整的管理员API支持，使管理员后台能够正常工作。

## 🎯 目标
部署管理员API到Cloudflare Workers，支持以下功能：
- 用户管理（查看、创建、更新、删除）
- 小说管理（查看、审核、删除）
- 评论管理（查看、审核、删除）
- 举报处理
- 数据备份
- 操作日志
- 系统统计

## 🚀 部署步骤

### 步骤1: 准备API代码

#### 方案A: 替换现有Worker（推荐）
1. 备份现有的 `worker.js` 文件
2. 将 `admin-api-worker.js` 的内容合并到现有Worker中
3. 添加管理员API路由处理

#### 方案B: 创建新的管理员Worker
1. 创建新的Cloudflare Worker专门处理管理员API
2. 配置不同的路由（如：admin-api.yourdomain.com）
3. 部署到Cloudflare Workers

### 步骤2: 更新Worker配置

#### 修改 `wrangler.toml` 文件：
```toml
name = "novel-platform-api"
main = "src/worker.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "novel-db"
database_id = "a4b9d2d4-b70f-4c75-8976-d97154dbb4e2"

[vars]
JWT_SECRET = "your-jwt-secret-key-here"
INVITATION_CODE_SALT = "your-invitation-salt-here"

[env.production]
workers_dev = false
route = { pattern = "novel-platform-api.sunlongyun1030.workers.dev/*", zone_name = "sunlongyun1030.workers.dev" }
```

### 步骤3: 部署API

#### 使用Wrangler CLI部署：
```bash
# 安装Wrangler（如果尚未安装）
npm install -g wrangler

# 登录到Cloudflare
wrangler login

# 部署到生产环境
wrangler deploy --env production
```

#### 或者通过Cloudflare Dashboard：
1. 访问: https://dash.cloudflare.com/
2. Workers & Pages → 你的Worker
3. 编辑代码 → 粘贴管理员API代码
4. 保存并部署

## 📝 管理员API端点列表

### 1. 系统统计
```
GET /api/admin/stats
```
返回：用户统计、小说统计、评论统计、举报统计

### 2. 用户管理
```
GET    /api/admin/users           # 获取用户列表
POST   /api/admin/users           # 创建用户
GET    /api/admin/users/{id}      # 获取用户详情
PUT    /api/admin/users/{id}      # 更新用户
DELETE /api/admin/users/{id}      # 删除用户
```

### 3. 小说管理
```
GET    /api/admin/novels          # 获取小说列表
DELETE /api/admin/novels/{id}     # 删除小说
```

### 4. 评论管理
```
GET    /api/admin/comments        # 获取评论列表
DELETE /api/admin/comments/{id}   # 删除评论
```

### 5. 举报处理
```
GET    /api/admin/reports         # 获取举报列表
GET    /api/admin/reports/{id}    # 获取举报详情
PUT    /api/admin/reports/{id}    # 处理举报
```

### 6. 内容审核
```
POST   /api/admin/review          # 审核内容
GET    /api/admin/pending         # 获取待审核内容
```

### 7. 数据备份
```
GET    /api/admin/backups         # 获取备份列表
POST   /api/admin/backups         # 创建备份
GET    /api/admin/backups/{id}/download  # 下载备份
DELETE /api/admin/backups/{id}    # 删除备份
```

### 8. 操作日志
```
GET    /api/admin/logs            # 获取操作日志
GET    /api/admin/activities      # 获取最近活动
GET    /api/admin/db-size         # 获取数据库大小
```

## 🔐 认证和授权

### JWT令牌验证
所有管理员API都需要Bearer Token：
```
Authorization: Bearer <jwt-token>
```

### 权限检查
- 只有 `role = 'admin'` 的用户可以访问管理员API
- 每次操作都会记录到 `admin_logs` 表

### 密码哈希函数
需要在Worker中添加密码哈希函数：
```javascript
async function hashPassword(password) {
    // 使用bcrypt或scrypt进行密码哈希
    // 这里使用简单的SHA-256作为示例（生产环境应使用更强的算法）
    const encoder = new TextEncoder();
    const data = encoder.encode(password + env.PASSWORD_SALT);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
```

## 🛠️ 故障排除

### 常见问题1: CORS错误
**症状**: 前端无法访问管理员API
**解决**: 在Worker中添加CORS头
```javascript
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
```

### 常见问题2: 数据库连接错误
**症状**: API返回数据库错误
**解决**:
1. 检查D1数据库绑定名称
2. 验证数据库ID是否正确
3. 检查数据库表是否存在

### 常见问题3: 认证失败
**症状**: 返回401或403错误
**解决**:
1. 检查JWT令牌是否正确
2. 验证用户角色是否为admin
3. 检查令牌是否过期

## 📊 测试管理员API

### 使用curl测试：
```bash
# 获取统计数据
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://novel-platform-api.sunlongyun1030.workers.dev/api/admin/stats

# 获取用户列表
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://novel-platform-api.sunlongyun1030.workers.dev/api/admin/users

# 创建测试用户
curl -X POST -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"username":"testadmin","email":"test@dskxx.cc","password":"Test123!","role":"admin"}' \
     https://novel-platform-api.sunlongyun1030.workers.dev/api/admin/users
```

### 使用Postman测试：
1. 设置Base URL: `https://novel-platform-api.sunlongyun1030.workers.dev`
2. 添加Header: `Authorization: Bearer YOUR_JWT_TOKEN`
3. 测试各个API端点

## 🎨 前端集成

### 管理员后台配置
在 `admin.html` 中，确保API URL正确：
```javascript
const API_URL = 'https://novel-platform-api.sunlongyun1030.workers.dev';
```

### 获取JWT令牌
管理员登录后，前端应保存JWT令牌：
```javascript
// 登录后保存令牌
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// API请求时添加令牌
const response = await fetch(`${API_URL}/api/admin/stats`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
```

## 🔄 数据流图

```
前端 (admin.html)
    ↓ (HTTP请求 + JWT)
Cloudflare Worker (管理员API)
    ↓ (SQL查询)
Cloudflare D1 数据库
    ↓ (查询结果)
Cloudflare Worker
    ↓ (JSON响应)
前端 (admin.html)
```

## 📈 性能优化

### 1. 数据库索引
确保为常用查询字段创建索引：
- `users.role`, `users.status`
- `novels.review_status`, `novels.status`
- `comments.review_status`
- `reports.status`

### 2. 查询优化
- 使用分页查询避免返回大量数据
- 只选择需要的字段
- 使用JOIN优化关联查询

### 3. 缓存策略
- 对统计数据使用短期缓存
- 使用Cloudflare CDN缓存静态数据

## 🛡️ 安全建议

### 1. 输入验证
- 验证所有用户输入
- 防止SQL注入
- 验证文件上传

### 2. 权限控制
- 严格的角色权限检查
- 操作日志记录
- 敏感操作需要二次确认

### 3. 数据保护
- 密码哈希存储
- 敏感数据加密
- 定期数据备份

### 4. 监控和告警
- 监控API调用频率
- 设置异常操作告警
- 定期审计操作日志

## 📋 部署检查清单

### 部署前检查：
- [ ] 数据库扩展SQL已执行
- [ ] 管理员账户已创建
- [ ] Worker代码已更新
- [ ] 环境变量已配置
- [ ] CORS配置正确

### 部署后测试：
- [ ] 管理员登录测试
- [ ] 各API端点功能测试
- [ ] 权限验证测试
- [ ] 错误处理测试
- [ ] 性能测试

### 生产环境验证：
- [ ] SSL证书有效
- [ ] 域名解析正确
- [ ] 备份机制正常
- [ ] 监控告警设置

## 🆘 技术支持

### 遇到问题？
1. 检查Cloudflare Worker日志
2. 验证数据库连接
3. 测试API端点
4. 查看浏览器控制台错误

### 联系支持：
- Cloudflare Workers文档: https://developers.cloudflare.com/workers/
- D1数据库文档: https://developers.cloudflare.com/d1/
- OpenClaw AI技术支持

## 🎉 完成部署

管理员API部署完成后，您的班级小说网站将拥有完整的管理功能：

1. **👥 用户管理** - 管理所有班级成员
2. **📚 内容管理** - 审核和管理小说内容
3. **💬 评论管理** - 维护健康的讨论环境
4. **🚨 举报系统** - 处理不当内容举报
5. **💾 数据备份** - 保护重要数据
6. **📋 操作审计** - 追踪所有管理操作

**预计部署时间**: 30-60分钟
**影响范围**: 仅管理员功能，不影响普通用户
**回滚方案**: 恢复之前的Worker版本