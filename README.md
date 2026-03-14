# DriftMail API

临时邮箱后端服务，基于 Cloudflare Workers 部署。

## 技术栈

- Cloudflare Workers
- Cloudflare D1 (SQLite)
- Cloudflare KV
- JWT 认证

## 功能特性

- 自定义邮箱用户名
- 多域名支持
- 邮件接收与存储
- 附件支持
- 邮箱有效期管理
- 定时清理过期邮箱

## 部署

### 1. 创建资源

在 [Cloudflare Dashboard](https://dash.cloudflare.com) 创建：

- **D1 数据库**：Workers & Pages → D1 → 创建数据库
- **KV 命名空间**：Workers & Pages → KV → 创建命名空间

### 2. 连接 GitHub 部署

1. Workers & Pages → 创建 → 连接 Git
2. 选择 GitHub 仓库
3. 框架预设选择 `None`
4. 点击保存并部署

### 3. 绑定资源

在 Workers 设置页面：

**Bindings → D1 数据库绑定：**
- 变量名：`DB`
- 选择创建的数据库

**Bindings → KV 命名空间绑定：**
- 变量名：`MAIL_KV`
- 选择创建的命名空间

### 4. 设置环境变量

在 Workers → Settings → Variables 添加：

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `ACCESS_KEY` | ✅ | API 访问密钥，用于验证前端请求 |
| `MAIL_DOMAINS` | ✅ | 邮件域名，多个用逗号分隔，如 `mail1.com,mail2.com` |
| `EXPIRE_MINUTES` | ❌ | 邮箱默认过期时间，默认 30 分钟 |

### 5. 配置邮件路由

在 Cloudflare Dashboard → 选择域名 → Email → Email Routing：

1. 启用邮件路由
2. 添加路由规则：
   - 匹配：`*@your-domain.com`
   - 操作：Send to a Worker
   - 目标：选择部署的 Worker

### 6. 完成

访问你的 Workers 地址，首次请求会自动：
- 创建数据库表
- 同步域名配置
- 生成 JWT 密钥

## API 文档

详见 [API.md](./API.md)

## 作者

二月半

## License

MIT