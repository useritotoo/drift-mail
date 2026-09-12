import{c as z,b as w,d as n,e as i,f as l,j as A,z as T,t as C,F as K,r as D,q as _,s as H,x as M,n as R}from"./index-C_mrxXDW.js";import{u as N,M as X,C as O,L as Z,F as S,a as F,S as U}from"./mail-CG4fZVRD.js";/**
 * @license lucide-vue-next v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=z("BookTextIcon",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M8 7h6",key:"1f0q6e"}],["path",{d:"M8 11h8",key:"vwpz6n"}]]);/**
 * @license lucide-vue-next v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=z("KeyRoundIcon",[["path",{d:"M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z",key:"167ctg"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]);function L(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function P(t){return t.trim().toLowerCase().replace(/[`*_~]/g,"").replace(/[^\p{Letter}\p{Number}]+/gu,"-").replace(/^-+|-+$/g,"")}function k(t){const s=[];let e=L(t);return e=e.replace(/`([^`]+)`/g,(o,d)=>{const c=`__CODE_${s.length}__`;return s.push(`<code class="api-doc-inline-code">${d}</code>`),c}),e=e.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),e=e.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a class="api-doc-link" href="$2" target="_blank" rel="noreferrer">$1</a>'),s.forEach((o,d)=>{e=e.replace(`__CODE_${d}__`,o)}),e}function B(t){return t.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(s=>s.trim())}function q(t){return t.replace(/\r\n/g,`
`).split(`
`).map(s=>s.match(/^(##|###)\s+(.+)$/)).filter(Boolean).map(s=>({level:s[1].length,text:s[2].trim(),id:P(s[2])}))}function Y(t){const s=t.replace(/\r\n/g,`
`).split(`
`),e=[];let o=[],d=[],c=[],p=[],g=!1;const h=()=>{o.length!==0&&(e.push(`<p class="api-doc-paragraph">${k(o.join(" "))}</p>`),o=[])},r=()=>{d.length!==0&&(e.push(`<ul class="api-doc-list">${d.map(u=>`<li>${k(u)}</li>`).join("")}</ul>`),d=[])},m=()=>{if(c.length<2){o.push(...c),c=[];return}const[u,,...a]=c,b=B(u),v=a.map(B);e.push(`<div class="api-doc-table-wrap"><table class="api-doc-table"><thead><tr>${b.map(x=>`<th>${k(x)}</th>`).join("")}</tr></thead><tbody>${v.map(x=>`<tr>${x.map(y=>`<td>${k(y)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`),c=[]},j=()=>{if(p.length===0){e.push('<pre class="api-doc-code-block"><code></code></pre>');return}e.push(`<pre class="api-doc-code-block"><code>${L(p.join(`
`))}</code></pre>`),p=[]},f=()=>{h(),r(),m()};for(const u of s){const a=u.trim();if(g){a.startsWith("```")?(j(),g=!1):p.push(u);continue}if(a.startsWith("```")){f(),g=!0,p=[];continue}if(!a){f();continue}if(/^---+$/.test(a)){f(),e.push('<hr class="api-doc-divider">');continue}const b=u.match(/^(#{1,3})\s+(.+)$/);if(b){f();const v=b[1].length,x=b[2].trim(),y=`h${v}`;e.push(`<${y} id="${P(x)}">${k(x)}</${y}>`);continue}if(/^- /.test(a)){h(),m(),d.push(a.slice(2).trim());continue}if(a.startsWith("|")&&a.includes("|")){h(),r(),c.push(a);continue}o.push(a)}return g&&j(),f(),e.join("")}const I=`# DriftMail API 文档\r
\r
DriftMail临时邮箱服务 API。\r
\r
## 基础信息\r
\r
- **Base URL**: \`https://your-domain.workers.dev\`\r
- **Content-Type**: \`application/json\`\r
- **认证方式**: \r
  - \`X-Access-Key\` 请求头 - 用于创建邮箱等敏感操作\r
  - \`Bearer Token\` - 用于邮箱操作（通过 Authorization 请求头）\r
\r
---\r
\r
## 域名管理\r
\r
### GET /api/domains\r
\r
获取可用域名列表。\r
\r
**请求头**:\r
\`\`\`\r
X-Access-Key: your-access-key\r
\`\`\`\r
\r
**响应**:\r
\`\`\`json\r
{\r
  "hydra:member": [\r
    {\r
      "id": "uuid",\r
      "domain": "example.com",\r
      "isVerified": true,\r
      "createdAt": "2024-01-01T00:00:00Z"\r
    }\r
  ],\r
  "hydra:totalItems": 1\r
}\r
\`\`\`\r
\r
---\r
\r
## 邮箱账户\r
\r
### POST /api/accounts\r
\r
创建新邮箱账户（带密码）。\r
\r
**请求头**:\r
\`\`\`\r
X-Access-Key: your-access-key\r
\`\`\`\r
\r
**请求体**:\r
\`\`\`json\r
{\r
  "address": "user@example.com",\r
  "password": "yourpassword"\r
}\r
\`\`\`\r
\r
**参数说明**:\r
| 字段 | 类型 | 必填 | 说明 |\r
|------|------|------|------|\r
| address | string | 是 | 完整邮箱地址 |\r
| password | string | 是 | 密码，至少6位 |\r
\r
**响应**: \`201 Created\`\r
\`\`\`json\r
{\r
  "id": "uuid",\r
  "address": "user@example.com",\r
  "authType": "email",\r
  "expiresAt": "2024-01-01T01:00:00Z",\r
  "createdAt": "2024-01-01T00:00:00Z"\r
}\r
\`\`\`\r
\r
**错误响应**:\r
- \`400\` - 邮箱格式无效或密码太短\r
- \`409\` - 邮箱地址已存在\r
- \`422\` - 域名不可用\r
\r
---\r
\r
### POST /api/generate\r
\r
随机生成临时邮箱。\r
\r
**请求头**:\r
\`\`\`\r
X-Access-Key: your-access-key\r
\`\`\`\r
\r
**请求体** (可选):\r
\`\`\`json\r
{\r
  "domain": "example.com"\r
}\r
\`\`\`\r
\r
**参数说明**:\r
| 字段 | 类型 | 必填 | 说明 |\r
|------|------|------|------|\r
| domain | string | 否 | 指定域名，不填则随机选择 |\r
\r
**响应**: \`201 Created\`\r
\`\`\`json\r
{\r
  "id": "uuid",\r
  "address": "randomuser@example.com",\r
  "password": "randompassword",\r
  "token": "jwt-token",\r
  "expiresAt": "2024-01-01T01:00:00Z"\r
}\r
\`\`\`\r
\r
---\r
\r
### POST /api/custom\r
\r
创建自定义用户名的邮箱。\r
\r
**请求头**:\r
\`\`\`\r
X-Access-Key: your-access-key\r
\`\`\`\r
\r
**请求体**:\r
\`\`\`json\r
{\r
  "address": "myname@example.com"\r
}\r
\`\`\`\r
\r
**参数说明**:\r
| 字段 | 类型 | 必填 | 说明 |\r
|------|------|------|------|\r
| address | string | 是 | 完整邮箱地址（用户名3-30字符） |\r
\r
**响应**: \`201 Created\`\r
\`\`\`json\r
{\r
  "id": "uuid",\r
  "address": "myname@example.com",\r
  "password": "randompassword",\r
  "token": "jwt-token",\r
  "expiresAt": "2024-01-01T01:00:00Z"\r
}\r
\`\`\`\r
\r
**错误响应**:\r
- \`400\` - 邮箱格式无效或用户名长度不符\r
- \`409\` - 邮箱地址已存在\r
- \`422\` - 域名不可用\r
\r
---\r
\r
### POST /api/token\r
\r
获取认证令牌（登录）。\r
\r
**请求体**:\r
\`\`\`json\r
{\r
  "address": "user@example.com",\r
  "password": "yourpassword"\r
}\r
\`\`\`\r
\r
**响应**:\r
\`\`\`json\r
{\r
  "id": "uuid",\r
  "token": "jwt-token",\r
  "expiresAt": "2024-01-01T01:00:00Z"\r
}\r
\`\`\`\r
\r
**错误响应**:\r
- \`401\` - 凭据无效\r
\r
---\r
\r
### GET /api/me\r
\r
获取当前账户信息。\r
\r
**请求头**:\r
\`\`\`\r
Authorization: Bearer <token>\r
\`\`\`\r
\r
**响应**:\r
\`\`\`json\r
{\r
  "id": "uuid",\r
  "address": "user@example.com",\r
  "authType": "email",\r
  "expiresAt": "2024-01-01T01:00:00Z",\r
  "createdAt": "2024-01-01T00:00:00Z"\r
}\r
\`\`\`\r
\r
**错误响应**:\r
- \`401\` - 未授权\r
\r
---\r
\r
### PATCH /api/me/extend\r
\r
延长邮箱过期时间。\r
\r
**请求头**:\r
\`\`\`\r
Authorization: Bearer <token>\r
\`\`\`\r
\r
**请求体**:\r
\`\`\`json\r
{\r
  "minutes": 30\r
}\r
\`\`\`\r
\r
**参数说明**:\r
| 字段 | 类型 | 必填 | 说明 |\r
|------|------|------|------|\r
| minutes | number | 否 | 延长分钟数，默认30 |\r
\r
**响应**:\r
\`\`\`json\r
{\r
  "success": true,\r
  "expiresAt": "2024-01-01T01:30:00Z"\r
}\r
\`\`\`\r
\r
---\r
\r
### DELETE /api/accounts/{id}\r
\r
删除邮箱账户（同时删除所有邮件）。\r
\r
**请求头**:\r
\`\`\`\r
Authorization: Bearer <token>\r
\`\`\`\r
\r
**响应**: \`204 No Content\`\r
\r
**错误响应**:\r
- \`401\` - 未授权\r
- \`403\` - 无权删除他人账户\r
\r
---\r
\r
## 邮件管理\r
\r
### GET /api/messages\r
\r
获取邮件列表。\r
\r
**请求头**:\r
\`\`\`\r
Authorization: Bearer <token>\r
\`\`\`\r
\r
**查询参数**:\r
| 参数 | 类型 | 默认值 | 说明 |\r
|------|------|--------|------|\r
| page | number | 1 | 页码 |\r
\r
**响应**:\r
\`\`\`json\r
{\r
  "hydra:member": [\r
    {\r
      "id": "uuid",\r
      "msgid": "message-id",\r
      "from": {\r
        "name": "Sender Name",\r
        "address": "sender@example.com"\r
      },\r
      "to": [\r
        {\r
          "name": "",\r
          "address": "user@example.com"\r
        }\r
      ],\r
      "subject": "邮件主题",\r
      "seen": false,\r
      "hasAttachments": true,\r
      "size": 1234,\r
      "createdAt": "2024-01-01T00:00:00Z"\r
    }\r
  ],\r
  "hydra:totalItems": 10\r
}\r
\`\`\`\r
\r
---\r
\r
### GET /api/messages/{id}\r
\r
获取邮件详情。\r
\r
**请求头**:\r
\`\`\`\r
Authorization: Bearer <token>\r
\`\`\`\r
\r
**响应**:\r
\`\`\`json\r
{\r
  "id": "uuid",\r
  "msgid": "message-id",\r
  "from": {\r
    "name": "Sender Name",\r
    "address": "sender@example.com"\r
  },\r
  "to": [\r
    {\r
      "name": "",\r
      "address": "user@example.com"\r
    }\r
  ],\r
  "subject": "邮件主题",\r
  "text": "纯文本内容",\r
  "html": ["<html>...</html>"],\r
  "seen": false,\r
  "hasAttachments": true,\r
  "size": 1234,\r
  "attachments": [\r
    {\r
      "id": "uuid",\r
      "filename": "document.pdf",\r
      "contentType": "application/pdf",\r
      "size": 5678\r
    }\r
  ],\r
  "createdAt": "2024-01-01T00:00:00Z"\r
}\r
\`\`\`\r
\r
**错误响应**:\r
- \`404\` - 邮件不存在\r
\r
---\r
\r
### PATCH /api/messages/{id}\r
\r
标记邮件为已读。\r
\r
**请求头**:\r
\`\`\`\r
Authorization: Bearer <token>\r
\`\`\`\r
\r
**响应**:\r
\`\`\`json\r
{\r
  "seen": true\r
}\r
\`\`\`\r
\r
---\r
\r
### DELETE /api/messages/{id}\r
\r
删除邮件。\r
\r
**请求头**:\r
\`\`\`\r
Authorization: Bearer <token>\r
\`\`\`\r
\r
**响应**: \`204 No Content\`\r
\r
---\r
\r
### GET /api/sources/{id}\r
\r
获取原始邮件源码。\r
\r
**请求头**:\r
\`\`\`\r
Authorization: Bearer <token>\r
\`\`\`\r
\r
**响应**:\r
\`\`\`json\r
{\r
  "id": "uuid",\r
  "data": "原始邮件完整内容..."\r
}\r
\`\`\`\r
\r
---\r
\r
## 附件\r
\r
### GET /api/attachments/{id}\r
\r
下载附件。\r
\r
**请求头**:\r
\`\`\`\r
Authorization: Bearer <token>\r
\`\`\`\r
\r
**响应**: 二进制文件流\r
\r
**响应头**:\r
\`\`\`\r
Content-Type: <附件类型>\r
Content-Disposition: attachment; filename="<文件名>"\r
\`\`\`\r
\r
---\r
\r
## 错误响应格式\r
\r
所有错误响应格式统一：\r
\r
\`\`\`json\r
{\r
  "error": "Error",\r
  "message": "错误描述信息"\r
}\r
\`\`\`\r
\r
**常见状态码**:\r
| 状态码 | 说明 |\r
|--------|------|\r
| 400 | 请求参数错误 |\r
| 401 | 未授权（缺少或无效的认证） |\r
| 403 | 禁止访问（无权限） |\r
| 404 | 资源不存在 |\r
| 409 | 资源冲突（如邮箱已存在） |\r
| 422 | 无法处理的实体（如域名无效） |\r
| 500 | 服务器内部错误 |\r
\r
---\r
\r
## 环境变量\r
\r
| 变量名 | 必填 | 默认值 | 说明 |\r
|--------|------|--------|------|\r
| JWT_SECRET | 是 | - | JWT 签名密钥 |\r
| ACCESS_KEY | 是 | - | API 访问密钥 |\r
| MAIL_DOMAINS | 是 | - | 可用域名，逗号分隔 |\r
| EXPIRE_MINUTES | 否 | 30 | 邮箱过期时间（分钟） |\r
\r
---\r
\r
## 项目接入示例\r
\r
如果你要在自己的项目里接入 DriftMail，最少只需要准备下面两个配置：\r
\r
- **Base URL**: \`https://your-domain.workers.dev\`\r
- **ACCESS_KEY**: 用于创建临时邮箱，请在请求头中写入 \`X-Access-Key\`\r
\r
创建临时邮箱成功后，接口会返回当前邮箱自己的 \`token\`。后续获取该邮箱的邮件列表、邮件正文和附件时，使用 \`Authorization: Bearer <token>\` 即可。\r
\r
> 建议把 \`ACCESS_KEY\` 放在你自己的服务端环境变量里，不要直接暴露给浏览器前端。\r
\r
### Node.js 最小客户端封装\r
\r
\`\`\`js\r
const config = {\r
  baseUrl: process.env.DRIFTMAIL_BASE_URL,\r
  accessKey: process.env.DRIFTMAIL_ACCESS_KEY,\r
};\r
\r
async function request(path, options = {}, token) {\r
  const headers = {\r
    'Content-Type': 'application/json',\r
    ...(options.headers || {}),\r
  };\r
\r
  if (token) {\r
    headers.Authorization = \`Bearer \${token}\`;\r
  } else {\r
    headers['X-Access-Key'] = config.accessKey;\r
  }\r
\r
  const response = await fetch(\`\${config.baseUrl}\${path}\`, {\r
    ...options,\r
    headers,\r
  });\r
\r
  if (response.status === 204) return null;\r
\r
  const data = await response.json();\r
  if (!response.ok) {\r
    throw new Error(data.message || \`HTTP \${response.status}\`);\r
  }\r
\r
  return data;\r
}\r
\r
export async function createTemporaryMailbox(domain) {\r
  const body = domain ? { domain } : {};\r
  return request('/api/generate', {\r
    method: 'POST',\r
    body: JSON.stringify(body),\r
  });\r
}\r
\r
export async function listMessages(token, page = 1) {\r
  return request(\`/api/messages?page=\${page}\`, {}, token);\r
}\r
\r
export async function getMessage(token, messageId) {\r
  return request(\`/api/messages/\${messageId}\`, {}, token);\r
}\r
\`\`\`\r
\r
### 批量创建 N 个邮箱并读取内容\r
\r
\`\`\`js\r
import { createTemporaryMailbox, listMessages, getMessage } from './driftmail-client.js';\r
\r
async function createMailboxes(count) {\r
  return Promise.all(\r
    Array.from({ length: count }, () => createTemporaryMailbox())\r
  );\r
}\r
\r
async function collectMailboxContent(mailboxes) {\r
  const result = [];\r
\r
  for (const mailbox of mailboxes) {\r
    const messageList = await listMessages(mailbox.token);\r
    const details = await Promise.all(\r
      (messageList['hydra:member'] || []).map((message) =>\r
        getMessage(mailbox.token, message.id)\r
      )\r
    );\r
\r
    result.push({\r
      id: mailbox.id,\r
      address: mailbox.address,\r
      token: mailbox.token,\r
      messages: details,\r
    });\r
  }\r
\r
  return result;\r
}\r
\r
const mailboxes = await createMailboxes(3);\r
const inboxSnapshot = await collectMailboxContent(mailboxes);\r
\r
console.log(inboxSnapshot);\r
\`\`\`\r
\r
### 轮询等待新邮件\r
\r
\`\`\`js\r
import { createTemporaryMailbox, listMessages, getMessage } from './driftmail-client.js';\r
\r
async function waitForFirstMessage(token, options = {}) {\r
  const intervalMs = options.intervalMs ?? 5000;\r
  const timeoutMs = options.timeoutMs ?? 120000;\r
  const startedAt = Date.now();\r
\r
  while (Date.now() - startedAt < timeoutMs) {\r
    const data = await listMessages(token);\r
    const firstMessage = data['hydra:member']?.[0];\r
\r
    if (firstMessage) {\r
      return getMessage(token, firstMessage.id);\r
    }\r
\r
    await new Promise((resolve) => setTimeout(resolve, intervalMs));\r
  }\r
\r
  throw new Error('Timed out waiting for incoming email');\r
}\r
\r
const mailbox = await createTemporaryMailbox();\r
const message = await waitForFirstMessage(mailbox.token);\r
\r
console.log(mailbox.address, message.subject);\r
\`\`\`\r
\r
---\r
\r
## 使用示例\r
\r
### 创建随机邮箱\r
\r
\`\`\`bash\r
curl -X POST https://your-domain.workers.dev/api/generate \\\r
  -H "Content-Type: application/json" \\\r
  -H "X-Access-Key: your-access-key"\r
\`\`\`\r
\r
### 创建自定义邮箱\r
\r
\`\`\`bash\r
curl -X POST https://your-domain.workers.dev/api/custom \\\r
  -H "Content-Type: application/json" \\\r
  -H "X-Access-Key: your-access-key" \\\r
  -d '{"address": "myname@example.com"}'\r
\`\`\`\r
\r
### 获取邮件列表\r
\r
\`\`\`bash\r
curl https://your-domain.workers.dev/api/messages \\\r
  -H "Authorization: Bearer <token>"\r
\`\`\`\r
\r
### 下载附件\r
\r
\`\`\`bash\r
curl https://your-domain.workers.dev/api/attachments/<id> \\\r
  -H "Authorization: Bearer <token>" \\\r
  -o filename.pdf\r
\`\`\`\r
`,G={class:"min-h-screen flex flex-col"},W={class:"sticky top-0 z-40 border-b border-white/5 bg-dark-950/90 backdrop-blur-xl"},V={class:"max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4"},J={class:"flex items-center gap-2.5 min-w-0"},Q={class:"w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"},nn={class:"flex items-center gap-2"},rn={class:"flex-1 max-w-6xl mx-auto w-full px-4 py-6"},en={class:"card p-6 md:p-8 mb-6 relative overflow-hidden"},sn={class:"grid lg:grid-cols-[minmax(0,1.2fr)_320px] gap-6 lg:gap-8 items-start"},tn={class:"relative z-10"},an={class:"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs uppercase tracking-[0.24em] mb-5"},on={class:"flex flex-wrap gap-3 mt-6"},ln={class:"api-doc-stat"},dn={class:"api-doc-stat-value"},cn={class:"api-doc-stat"},pn={class:"api-doc-stat"},mn={class:"card bg-dark-900/55 p-5 relative z-10"},un={class:"flex items-center gap-2 text-dark-100 font-medium mb-4"},gn={class:"mt-5 grid gap-3"},hn={href:"#项目接入示例",class:"btn-primary btn-sm w-full"},xn={href:"#post-api-generate",class:"btn-ghost btn-sm w-full"},fn={class:"grid lg:grid-cols-[240px_minmax(0,1fr)] gap-6 items-start"},bn={class:"card p-4 lg:sticky lg:top-20"},kn={class:"flex items-center gap-2 text-sm font-medium text-dark-100 mb-4"},yn={class:"space-y-1.5"},vn=["href"],wn=["innerHTML"],_n={__name:"ApiDocs",setup(t){const s=H(),e=N(),o=_(()=>q(I)),d=_(()=>Y(I)),c=_(()=>o.value.filter(h=>h.level===3).length);function p(){s.push("/")}function g(){e.clearSession(),e.setMails([]),sessionStorage.removeItem("auth"),s.push("/login")}return(h,r)=>(M(),w("div",G,[n("header",W,[n("div",V,[n("div",J,[n("div",Q,[i(l(X),{class:"w-4 h-4 text-white"})]),r[0]||(r[0]=n("span",{class:"font-bold text-gradient truncate"},"DriftMail",-1)),r[1]||(r[1]=n("span",{class:"badge-primary hidden md:inline-flex"},"API 文档",-1))]),n("div",nn,[n("button",{onClick:p,class:"btn-ghost btn-sm"},[i(l(O),{class:"w-4 h-4 rotate-180"}),r[2]||(r[2]=n("span",{class:"hidden sm:inline"},"返回邮箱",-1))]),n("button",{onClick:g,class:"btn-ghost btn-icon btn-sm"},[i(l(Z),{class:"w-4 h-4"})])])])]),n("main",rn,[n("section",en,[r[12]||(r[12]=n("div",{class:"absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent"},null,-1)),n("div",sn,[n("div",tn,[n("div",an,[i(l(E),{class:"w-3.5 h-3.5"}),r[3]||(r[3]=A(" API Reference ",-1))]),r[7]||(r[7]=T('<h1 class="text-3xl sm:text-4xl font-bold text-dark-50 leading-tight mb-4"> 站内 API 文档说明 </h1><p class="text-dark-300 leading-7 max-w-2xl"> 这里直接读取仓库内的 <code class="api-doc-inline-code">API.md</code> 内容，除了接口定义，还补充了 <code class="api-doc-inline-code">Base URL</code>、<code class="api-doc-inline-code">ACCESS_KEY</code> 和 <code class="api-doc-inline-code">Bearer Token</code> 的项目接入示例。 </p>',2)),n("div",on,[n("div",ln,[i(l(S),{class:"w-4 h-4 text-primary-300"}),n("div",null,[r[4]||(r[4]=n("div",{class:"api-doc-stat-label"},"接口条目",-1)),n("div",dn,C(c.value),1)])]),n("div",cn,[i(l(F),{class:"w-4 h-4 text-emerald-300"}),r[5]||(r[5]=n("div",null,[n("div",{class:"api-doc-stat-label"},"访问控制"),n("div",{class:"api-doc-stat-value"},"Access Key / Bearer")],-1))]),n("div",pn,[i(l($),{class:"w-4 h-4 text-amber-300"}),r[6]||(r[6]=n("div",null,[n("div",{class:"api-doc-stat-label"},"文档来源"),n("div",{class:"api-doc-stat-value"},"仓库 API.md")],-1))])])]),n("div",mn,[n("div",un,[i(l(U),{class:"w-4 h-4 text-primary-300"}),r[8]||(r[8]=A(" 快速接入 ",-1))]),r[11]||(r[11]=T('<ul class="space-y-3 text-sm text-dark-300 leading-6"><li>在你的项目后端填写 <code class="api-doc-inline-code">Base URL</code> 和 <code class="api-doc-inline-code">ACCESS_KEY</code>，即可调用创建邮箱接口。</li><li>调用 <code class="api-doc-inline-code">/api/generate</code> 或 <code class="api-doc-inline-code">/api/custom</code> 后，每个邮箱都会返回自己的 <code class="api-doc-inline-code">token</code>。</li><li>后续读取邮件列表、邮件正文和附件时，使用 <code class="api-doc-inline-code">Authorization: Bearer &lt;token&gt;</code> 即可。</li></ul>',1)),n("div",gn,[n("a",hn,[i(l(S),{class:"w-4 h-4"}),r[9]||(r[9]=n("span",null,"查看接入示例",-1))]),n("a",xn,[i(l($),{class:"w-4 h-4"}),r[10]||(r[10]=n("span",null,"跳到创建邮箱",-1))])])])])]),r[14]||(r[14]=T('<section class="grid md:grid-cols-3 gap-4 mb-6"><div class="card p-5 relative overflow-hidden"><div class="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent"></div><div class="text-[11px] uppercase tracking-[0.24em] text-sky-300/80 mb-3">Base URL</div><div class="text-sm font-mono text-dark-50 break-all">https://your-domain.workers.dev</div><p class="mt-3 text-sm leading-6 text-dark-400"> Worker 的基础入口。你的项目只需保存这个地址，所有 API 都在这个地址下面。 </p></div><div class="card p-5 relative overflow-hidden"><div class="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div><div class="text-[11px] uppercase tracking-[0.24em] text-amber-300/80 mb-3">ACCESS_KEY</div><div class="text-sm font-mono text-dark-50 break-all">X-Access-Key: your-access-key</div><p class="mt-3 text-sm leading-6 text-dark-400"> 用于创建临时邮箱的主控密钥。建议只保存在你自己的服务端环境变量里，不要直接暴露给前端。 </p></div><div class="card p-5 relative overflow-hidden"><div class="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"></div><div class="text-[11px] uppercase tracking-[0.24em] text-emerald-300/80 mb-3">Mailbox Token</div><div class="text-sm font-mono text-dark-50 break-all">Authorization: Bearer &lt;token&gt;</div><p class="mt-3 text-sm leading-6 text-dark-400"> 每个新创建的邮箱都会返回自己的 token。用它获取该邮箱的收件列表、邮件正文和附件。 </p></div></section>',1)),n("section",fn,[n("aside",bn,[n("div",kn,[i(l(E),{class:"w-4 h-4 text-primary-300"}),r[13]||(r[13]=A(" 文档目录 ",-1))]),n("nav",yn,[(M(!0),w(K,null,D(o.value,m=>(M(),w("a",{key:m.id,href:`#${m.id}`,class:R(["api-doc-nav-link",m.level===3?"api-doc-nav-link-sub":""])},C(m.text),11,vn))),128))])]),n("article",{class:"card p-5 sm:p-8 md:p-10 api-doc-content",innerHTML:d.value},null,8,wn)])])]))}};export{_n as default};
