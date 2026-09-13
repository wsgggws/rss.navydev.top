# RSS NAVY

一个专注于阅读体验的轻量 RSS 阅读器。前端完全使用 React、TypeScript 和 Vite 构建，对接独立的 FastAPI 后端获取订阅源、文章和 AI 摘要。

- 线上地址：<https://rss.navydev.top/>
- 后端仓库：<https://github.com/wsgggws/api.rss.navydev.top>

## 功能

- 浏览并搜索 RSS 订阅源
- 搜索当前订阅中的文章
- 按全部或未读状态筛选文章
- 在应用内阅读 Markdown 摘要
- 跳转阅读原文
- 在浏览器本地保存阅读状态和最近阅读记录
- 自动过滤无效的 `1970` 占位日期
- 支持亮色、暗色主题以及系统主题初始化
- 支持桌面端和移动端响应式布局
- 提供加载骨架、错误重试、空状态和图片失败降级

## 技术栈

| 类别 | 技术 |
| --- | --- |
| UI | React 18、TypeScript |
| 构建 | Vite 6 |
| 路由 | React Router 6 |
| 请求 | Axios |
| 内容渲染 | Marked、DOMPurify |
| 图标 | Lucide React |
| 测试 | Vitest |

本项目不依赖 Vue，也不包含 Vue 运行时代码。

## 项目结构

```text
src/
├── api/          # 后端 API 类型与请求函数
├── components/   # React 页面组件
├── hooks/        # React Hooks
├── mock/         # 本地开发模拟数据
├── pages/        # 路由页面
├── router/       # React Router 配置
├── styles/       # 全局主题与响应式样式
└── utils/        # 日期、缓存等通用逻辑
```

## 本地开发

环境要求：Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

开发服务器默认运行于 <http://localhost:3000>。Vite 开发模式内置模拟数据，因此不启动后端也可以检查主要界面和交互。

如需连接真实后端，在 `.env.local` 中设置：

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

如果没有设置 `VITE_API_BASE_URL`，浏览器请求使用当前域名；开发服务器会将 `/api` 代理到 `http://localhost:8000`。

## 测试与构建

```bash
# 运行单元测试
npm test

# 执行 TypeScript 检查并生成生产构建
npm run build

# 本地预览生产构建
npm run preview
```

生产文件输出至 `dist/`。

## 后端接口

前端当前使用以下公开接口：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/api/v1/rss/subscriptions` | 获取订阅源列表 |
| `GET` | `/api/v1/rss/subscriptions/{rss_id}/articles` | 获取订阅源文章列表 |
| `GET` | `/api/v1/rss/subscriptions/{rss_id}/articles/{article_id}` | 获取文章 AI 摘要并记录阅读次数 |
| `POST` | `/api/v1/visit/track` | 记录站点访问 |

接口字段和服务端运行方式以对应的后端仓库 README 为准。

## 部署

仓库中的 `config/nginx/conf.d/rss.navydev.top.conf` 提供了 Nginx 配置示例。典型部署流程为：

```bash
npm ci
npm run build
```

随后由 Web 服务器托管 `dist/`，并将 `/api` 请求转发到后端服务。React Router 使用浏览器路由，Web 服务器需要把未命中的前端路径回退到 `index.html`。

## 数据说明

未读状态、主题偏好和最近阅读记录保存在浏览器 `localStorage` 中，不会跨浏览器或跨设备同步。文章内容、阅读次数和 AI 摘要由后端管理。

## License

[MIT](./LICENSE)
