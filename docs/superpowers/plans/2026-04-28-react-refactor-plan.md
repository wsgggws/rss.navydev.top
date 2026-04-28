# React 重构实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 RSS 阅读器从 Vue 3 重构为 React 18 + Vite + animal-island-ui，采用暗色系赛博朋克风格

**Architecture:** 单页应用，左侧固定边栏订阅源，右侧杂志式文章列表，右侧 Drawer 展示文章详情

**Tech Stack:** Vite, React 18, animal-island-ui, React Router v6, TypeScript

---

## 文件结构

```
src/
├── main.tsx                     # 入口
├── App.tsx                      # 根组件
├── router/
│   └── index.tsx                # 路由配置
├── pages/
│   ├── Home.tsx                 # 首页
│   └── NotFound.tsx             # 404
├── components/
│   ├── Header.tsx               # 顶部导航
│   ├── Sidebar.tsx              # 左侧订阅源边栏
│   ├── ArticleList.tsx          # 文章列表容器
│   ├── ArticleCard.tsx           # 单篇文章卡片 (杂志式)
│   └── ArticleDrawer.tsx        # 文章详情抽屉
├── hooks/
│   └── useDarkMode.ts            # 主题切换 hook
├── api/
│   └── subscription.ts           # API 调用 (复用)
├── utils/
│   └── axios.ts                  # axios 实例 (复用)
└── styles/
    └── global.css               # 全局样式
```

---

## 任务清单

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "rss-reader",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@animal-island/ui": "latest",
    "axios": "^1.9.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.4.1",
    "typescript": "~5.8.3",
    "vite": "^6.3.5"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 4: 创建 tsconfig.app.json**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsd",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: 创建 index.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/rss.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RSS Reader</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: 创建 src/main.tsx**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: 创建 src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 9: 安装依赖**

Run: `npm install`

- [ ] **Step 10: 提交**

```bash
git add package.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html src/
git commit -m "feat: 初始化 Vite + React 项目"
```

---

### Task 2: 路由配置

**Files:**
- Create: `src/router/index.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建 src/router/index.tsx**

```typescript
import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
```

- [ ] **Step 2: 更新 src/App.tsx**

```typescript
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './styles/global.css'

function App() {
  return <RouterProvider router={router} />
}

export default App
```

- [ ] **Step 3: 创建 src/styles/global.css**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}
```

- [ ] **Step 4: 创建 src/pages/NotFound.tsx**

```typescript
function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#1a1a2e',
      color: '#e94560',
    }}>
      <h1 style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', color: '#a2a2a2' }}>Page Not Found</p>
    </div>
  )
}

export default NotFound
```

- [ ] **Step 5: 创建 src/pages/Home.tsx (占位)**

```typescript
function Home() {
  return <div style={{ background: '#16213e', minHeight: '100vh', color: '#e2e8f0', padding: '20px' }}>Home Page</div>
}

export default Home
```

- [ ] **Step 6: 提交**

```bash
git add src/router/index.tsx src/App.tsx src/styles/global.css src/pages/
git commit -m "feat: 添加路由配置和基础页面"
```

---

### Task 3: 基础布局框架

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Layout.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: 创建 src/components/Header.tsx**

```typescript
interface HeaderProps {
  title: string
  onThemeToggle?: () => void
  isDark?: boolean
}

function Header({ title, onThemeToggle, isDark }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      background: '#1a1a2e',
      borderBottom: '1px solid #0f3460',
    }}>
      <h1 style={{ color: '#e94560', fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h1>
      {onThemeToggle && (
        <button
          onClick={onThemeToggle}
          style={{
            padding: '8px 16px',
            background: isDark ? '#0f3460' : '#e94560',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      )}
    </header>
  )
}

export default Header
```

- [ ] **Step 2: 创建 src/components/Layout.tsx**

```typescript
import { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
  isDark: boolean
  onThemeToggle: () => void
}

function Layout({ children, isDark, onThemeToggle }: LayoutProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#16213e' : '#f5f7fa',
      color: isDark ? '#e2e8f0' : '#2d3748',
    }}>
      <Header
        title="📡 RSS Reader"
        isDark={isDark}
        onThemeToggle={onThemeToggle}
      />
      <main style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        {children}
      </main>
    </div>
  )
}

export default Layout
```

- [ ] **Step 3: 创建 src/hooks/useDarkMode.ts**

```typescript
import { useState, useCallback } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  return { isDark, toggleTheme }
}
```

- [ ] **Step 4: 更新 src/pages/Home.tsx**

```typescript
import { useState } from 'react'
import Layout from '../components/Layout'
import { useDarkMode } from '../hooks/useDarkMode'

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string | null>(null)

  return (
    <Layout isDark={isDark} onThemeToggle={toggleTheme}>
      <div style={{
        width: '240px',
        background: isDark ? '#0f3460' : '#ffffff',
        padding: '16px',
        borderRight: '1px solid #0f3460',
        minHeight: '100%',
      }}>
        <h2 style={{ color: isDark ? '#e94560' : '#667eea', marginBottom: '16px' }}>订阅源</h2>
        <div style={{ color: isDark ? '#a2a2a2' : '#718096' }}>
          {selectedRssId || '选择一个订阅源'}
        </div>
      </div>
      <div style={{ flex: 1, padding: '24px' }}>
        文章列表区域
      </div>
    </Layout>
  )
}

export default Home
```

- [ ] **Step 5: 验证运行**

Run: `npm run dev`
Expected: 页面显示 Header + 左右布局

- [ ] **Step 6: 提交**

```bash
git add src/components/Header.tsx src/components/Layout.tsx src/hooks/useDarkMode.ts src/pages/Home.tsx
git commit -m "feat: 实现基础布局框架 (Header + Sidebar + Main)"
```

---

### Task 4: 订阅源侧边栏

**Files:**
- Create: `src/api/subscription.ts` (从 Vue 项目复制并适配)
- Create: `src/components/Sidebar.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: 创建 src/utils/axios.ts**

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.detail || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export default api
```

- [ ] **Step 2: 创建 src/api/subscription.ts**

```typescript
import api from '../utils/axios'

export interface SubscriptionItem {
  id: string
  url: string
  title: string
  summary?: string
  createdAt?: string
}

export interface SubscriptionListResponse {
  items: SubscriptionItem[]
  total: number
}

export interface ArticleItem {
  id: string
  link: string
  published_at: string
  summary_md?: string
  title: string
  author?: string
}

export interface ArticleListResponse {
  items: ArticleItem[]
  total: number
}

export async function getAllSubscriptions(params?: {
  page?: number
  pageSize?: number
}): Promise<SubscriptionListResponse> {
  const { page = 1, pageSize = 10 } = params || {}
  const offset = (page - 1) * pageSize

  return api.get('/api/v1/rss/subscriptions', {
    params: { limit: pageSize, offset },
  })
}

export async function fetchArticles(params: {
  rssId: string
  page?: number
  pageSize?: number
}): Promise<ArticleListResponse> {
  const { page = 1, pageSize = 10, rssId } = params || {}
  const offset = (page - 1) * pageSize

  return api.get(`/api/v1/rss/subscriptions/${rssId}/articles`, {
    params: { limit: pageSize, offset },
  })
}

export async function fetchArticleDetail(
  rssId: string,
  articleId: string,
): Promise<ArticleItem> {
  return api.get(`/api/v1/rss/subscriptions/${rssId}/articles/${articleId}`)
}
```

- [ ] **Step 3: 创建 src/components/Sidebar.tsx**

```typescript
import { useState, useEffect } from 'react'
import { getAllSubscriptions, SubscriptionItem } from '../api/subscription'

interface SidebarProps {
  isDark: boolean
  selectedId: string | null
  onSelect: (id: string) => void
}

function Sidebar({ isDark, selectedId, onSelect }: SidebarProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  async function fetchSubscriptions() {
    try {
      setLoading(true)
      const data = await getAllSubscriptions({ page: 1, pageSize: 50 })
      setSubscriptions(data.items)
      if (data.items.length > 0 && !selectedId) {
        onSelect(data.items[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const filteredList = subscriptions.filter(sub =>
    sub.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{
      width: '240px',
      background: isDark ? '#0f3460' : '#ffffff',
      padding: '16px',
      borderRight: `1px solid ${isDark ? '#0f3460' : '#e2e8f0'}`,
      minHeight: '100%',
      overflowY: 'auto',
    }}>
      <h2 style={{
        color: isDark ? '#e94560' : '#667eea',
        marginBottom: '16px',
        fontSize: '1.1rem',
      }}>
        📡 我的订阅
      </h2>

      <input
        type="text"
        placeholder="搜索订阅..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: `1px solid ${isDark ? '#1a1a2e' : '#e2e8f0'}`,
          background: isDark ? '#1a1a2e' : '#f7fafc',
          color: isDark ? '#e2e8f0' : '#2d3748',
          marginBottom: '16px',
          outline: 'none',
        }}
      />

      {loading && (
        <div style={{ color: isDark ? '#a2a2a2' : '#718096' }}>加载中...</div>
      )}

      {error && (
        <div style={{ color: '#e94560' }}>{error}</div>
      )}

      {!loading && !error && filteredList.length === 0 && (
        <div style={{ color: isDark ? '#a2a2a2' : '#718096' }}>
          {searchQuery ? '没有找到匹配的订阅' : '暂无订阅'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredList.map(sub => (
          <div
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: selectedId === sub.id
                ? '#e94560'
                : isDark ? '#1a1a2e' : '#f7fafc',
              color: selectedId === sub.id ? 'white' : isDark ? '#e2e8f0' : '#2d3748',
              cursor: 'pointer',
              fontWeight: selectedId === sub.id ? 'bold' : 'normal',
              transition: 'all 0.2s',
            }}
          >
            {sub.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
```

- [ ] **Step 4: 更新 src/pages/Home.tsx**

```typescript
import { useState } from 'react'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import { useDarkMode } from '../hooks/useDarkMode'

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string | null>(null)

  return (
    <Layout isDark={isDark} onThemeToggle={toggleTheme}>
      <Sidebar
        isDark={isDark}
        selectedId={selectedRssId}
        onSelect={setSelectedRssId}
      />
      <div style={{ flex: 1, padding: '24px' }}>
        {selectedRssId ? `文章列表: ${selectedRssId}` : '选择一个订阅源'}
      </div>
    </Layout>
  )
}

export default Home
```

- [ ] **Step 5: 验证运行**

Run: `npm run dev`
Expected: 侧边栏显示订阅列表，能点击切换

- [ ] **Step 6: 提交**

```bash
git add src/utils/axios.ts src/api/subscription.ts src/components/Sidebar.tsx src/pages/Home.tsx
git commit -m "feat: 添加订阅源侧边栏组件"
```

---

### Task 5: 文章列表 (杂志式)

**Files:**
- Create: `src/components/ArticleCard.tsx`
- Create: `src/components/ArticleList.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: 创建 src/components/ArticleCard.tsx**

```typescript
import { ArticleItem } from '../api/subscription'

interface ArticleCardProps {
  article: ArticleItem
  isDark: boolean
  onClick: () => void
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ArticleCard({ article, isDark, onClick }: ArticleCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        background: isDark ? '#1a1a2e' : '#ffffff',
        borderRadius: '12px',
        marginBottom: '16px',
        cursor: 'pointer',
        boxShadow: isDark
          ? '0 4px 12px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.2s',
        border: `1px solid ${isDark ? '#0f3460' : '#e2e8f0'}`,
      }}
    >
      <div style={{
        width: '120px',
        height: '80px',
        background: isDark ? '#0f3460' : '#667eea',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem',
        flexShrink: 0,
      }}>
        📰
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          color: isDark ? '#e2e8f0' : '#2d3748',
          marginBottom: '8px',
          fontSize: '1.1rem',
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {article.title}
        </h3>
        <p style={{
          color: isDark ? '#a2a2a2' : '#718096',
          fontSize: '0.9rem',
          marginBottom: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {article.summary_md?.replace(/[#*`]/g, '').slice(0, 100) || '暂无摘要'}
        </p>
        <div style={{
          color: isDark ? '#e94560' : '#667eea',
          fontSize: '0.8rem',
        }}>
          {formatDate(article.published_at)}
          {article.author && ` · ${article.author}`}
        </div>
      </div>
    </div>
  )
}

export default ArticleCard
```

- [ ] **Step 2: 创建 src/components/ArticleList.tsx**

```typescript
import { useState, useEffect } from 'react'
import { fetchArticles, ArticleItem } from '../api/subscription'
import ArticleCard from './ArticleCard'

interface ArticleListProps {
  rssId: string
  isDark: boolean
  onArticleClick: (article: ArticleItem) => void
}

function ArticleList({ rssId, isDark, onArticleClick }: ArticleListProps) {
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchArticleList()
  }, [rssId])

  async function fetchArticleList() {
    try {
      setLoading(true)
      const data = await fetchArticles({ rssId, page: 1, pageSize: 20 })
      setArticles(data.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        color: isDark ? '#a2a2a2' : '#718096',
      }}>
        加载中...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        color: '#e94560',
        padding: '20px',
        textAlign: 'center',
      }}>
        {error}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div style={{
        color: isDark ? '#a2a2a2' : '#718096',
        padding: '40px',
        textAlign: 'center',
      }}>
        暂无文章
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          article={article}
          isDark={isDark}
          onClick={() => onArticleClick(article)}
        />
      ))}
    </div>
  )
}

export default ArticleList
```

- [ ] **Step 3: 更新 src/pages/Home.tsx**

```typescript
import { useState } from 'react'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import ArticleList from '../components/ArticleList'
import { useDarkMode } from '../hooks/useDarkMode'
import { ArticleItem } from '../api/subscription'

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)

  return (
    <Layout isDark={isDark} onThemeToggle={toggleTheme}>
      <Sidebar
        isDark={isDark}
        selectedId={selectedRssId}
        onSelect={setSelectedRssId}
      />
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {selectedRssId ? (
          <ArticleList
            rssId={selectedRssId}
            isDark={isDark}
            onArticleClick={setSelectedArticle}
          />
        ) : (
          <div style={{
            color: isDark ? '#a2a2a2' : '#718096',
            textAlign: 'center',
            marginTop: '40px',
          }}>
            选择一个订阅源查看文章
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Home
```

- [ ] **Step 4: 验证运行**

Run: `npm run dev`
Expected: 显示杂志式文章列表卡片

- [ ] **Step 5: 提交**

```bash
git add src/components/ArticleCard.tsx src/components/ArticleList.tsx src/pages/Home.tsx
git commit -m "feat: 添加杂志式文章列表组件"
```

---

### Task 6: 文章详情抽屉

**Files:**
- Create: `src/components/ArticleDrawer.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: 创建 src/components/ArticleDrawer.tsx**

```typescript
import { useEffect, useState } from 'react'
import { fetchArticleDetail, ArticleItem } from '../api/subscription'

interface ArticleDrawerProps {
  rssId: string
  article: ArticleItem | null
  isDark: boolean
  onClose: () => void
}

function ArticleDrawer({ rssId, article, isDark, onClose }: ArticleDrawerProps) {
  const [detail, setDetail] = useState<ArticleItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (article) {
      fetchDetail()
    }
  }, [article?.id])

  async function fetchDetail() {
    if (!article) return
    try {
      setLoading(true)
      const data = await fetchArticleDetail(rssId, article.id)
      setDetail(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  if (!article) return null

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const displayArticle = detail || article

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '50%',
      minWidth: '400px',
      height: '100vh',
      background: isDark ? '#16213e' : '#ffffff',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      transform: article ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: `1px solid ${isDark ? '#0f3460' : '#e2e8f0'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: isDark ? '#1a1a2e' : '#f7fafc',
      }}>
        <h2 style={{
          color: isDark ? '#e94560' : '#667eea',
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}>
          文章详情
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: isDark ? '#a2a2a2' : '#718096',
            cursor: 'pointer',
            fontSize: '1.5rem',
            padding: '4px 8px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {loading && (
          <div style={{ textAlign: 'center', color: isDark ? '#a2a2a2' : '#718096' }}>
            加载中...
          </div>
        )}

        {error && (
          <div style={{ color: '#e94560', textAlign: 'center' }}>{error}</div>
        )}

        {!loading && !error && displayArticle && (
          <>
            <h1 style={{
              color: isDark ? '#e2e8f0' : '#2d3748',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              lineHeight: 1.3,
            }}>
              {displayArticle.title}
            </h1>

            <div style={{
              color: isDark ? '#a2a2a2' : '#718096',
              fontSize: '0.9rem',
              marginBottom: '24px',
              display: 'flex',
              gap: '16px',
            }}>
              <span>📅 {formatDate(displayArticle.published_at)}</span>
              {displayArticle.author && <span>✍️ {displayArticle.author}</span>}
            </div>

            <div
              style={{
                color: isDark ? '#e2e8f0' : '#2d3748',
                lineHeight: 1.8,
              }}
              dangerouslySetInnerHTML={{
                __html: (displayArticle.summary_md || '')
                  .replace(/^# .*/gm, '')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">$1</code>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/\n/g, '<br/>')
              }}
            />
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: `1px solid ${isDark ? '#0f3460' : '#e2e8f0'}`,
        display: 'flex',
        gap: '12px',
        background: isDark ? '#1a1a2e' : '#f7fafc',
      }}>
        <a
          href={displayArticle?.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            padding: '12px',
            background: '#e94560',
            color: 'white',
            textAlign: 'center',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          🔗 阅读原文
        </a>
        <button
          onClick={scrollToTop}
          style={{
            padding: '12px 24px',
            background: isDark ? '#0f3460' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ⬆️ 返回顶部
        </button>
      </div>
    </div>
  )
}

export default ArticleDrawer
```

- [ ] **Step 2: 更新 src/pages/Home.tsx**

```typescript
import { useState } from 'react'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import ArticleList from '../components/ArticleList'
import ArticleDrawer from '../components/ArticleDrawer'
import { useDarkMode } from '../hooks/useDarkMode'
import { ArticleItem } from '../api/subscription'

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)

  return (
    <Layout isDark={isDark} onThemeToggle={toggleTheme}>
      <Sidebar
        isDark={isDark}
        selectedId={selectedRssId}
        onSelect={setSelectedRssId}
      />
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {selectedRssId ? (
          <ArticleList
            rssId={selectedRssId}
            isDark={isDark}
            onArticleClick={setSelectedArticle}
          />
        ) : (
          <div style={{
            color: isDark ? '#a2a2a2' : '#718096',
            textAlign: 'center',
            marginTop: '40px',
          }}>
            选择一个订阅源查看文章
          </div>
        )}
      </div>

      <ArticleDrawer
        rssId={selectedRssId || ''}
        article={selectedArticle}
        isDark={isDark}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Overlay */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}
    </Layout>
  )
}

export default Home
```

- [ ] **Step 3: 验证运行**

Run: `npm run dev`
Expected: 点击文章卡片，右侧滑出文章详情抽屉

- [ ] **Step 4: 提交**

```bash
git add src/components/ArticleDrawer.tsx src/pages/Home.tsx
git commit -m "feat: 添加文章详情抽屉组件"
```

---

### Task 7: 完善主题切换与样式

**Files:**
- Modify: `src/hooks/useDarkMode.ts`
- Modify: `src/styles/global.css`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/components/ArticleCard.tsx`
- Modify: `src/components/ArticleList.tsx`
- Modify: `src/components/ArticleDrawer.tsx`

- [ ] **Step 1: 更新 src/styles/global.css**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #16213e;
  color: #e2e8f0;
  transition: background 0.3s, color 0.3s;
}

body.light {
  background: #f5f7fa;
  color: #2d3748;
}

#root {
  min-height: 100vh;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: #e94560;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #d63d56;
}

/* 响应式 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
```

- [ ] **Step 2: 更新 src/hooks/useDarkMode.ts**

```typescript
import { useState, useCallback, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      document.body.classList.toggle('light', !next)
      return next
    })
  }, [])

  useEffect(() => {
    document.body.classList.toggle('light', !isDark)
  }, [isDark])

  return { isDark, toggleTheme }
}
```

- [ ] **Step 3: 提交**

```bash
git add src/styles/global.css src/hooks/useDarkMode.ts
git commit -m "feat: 完善主题切换功能 (持久化到 localStorage)"
```

---

### Task 8: 完善 404 页面与 SEO

**Files:**
- Modify: `src/pages/NotFound.tsx`
- Modify: `index.html`

- [ ] **Step 1: 更新 src/pages/NotFound.tsx**

```typescript
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#16213e',
      color: '#e2e8f0',
      textAlign: 'center',
      padding: '20px',
    }}>
      <h1 style={{
        fontSize: '8rem',
        fontWeight: 'bold',
        color: '#e94560',
        marginBottom: '1rem',
        textShadow: '0 0 20px rgba(233, 69, 96, 0.5)',
      }}>
        404
      </h1>
      <p style={{
        fontSize: '1.5rem',
        color: '#a2a2a2',
        marginBottom: '2rem',
      }}>
        页面未找到
      </p>
      <Link
        to="/"
        style={{
          padding: '12px 32px',
          background: '#e94560',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'all 0.2s',
        }}
      >
        返回首页
      </Link>
    </div>
  )
}

export default NotFound
```

- [ ] **Step 2: 更新 index.html 添加 SEO meta**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/rss.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="RSS Reader - 简洁高效的 RSS 阅读器" />
    <meta name="theme-color" content="#16213e" />
    <title>RSS Reader</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/NotFound.tsx index.html
git commit -m "feat: 完善 404 页面和 SEO"
```

---

### Task 9: 最终测试与部署

**Files:**
- Modify: `vite.config.ts` (生产配置)
- Create: `.env.production`

- [ ] **Step 1: 更新 vite.config.ts 添加生产配置**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
```

- [ ] **Step 2: 创建 .env.production**

```
VITE_API_BASE_URL=https://api.rss.navydev.top
```

- [ ] **Step 3: 运行生产构建**

Run: `npm run build`
Expected: 构建成功，生成 dist 目录

- [ ] **Step 4: 验证生产构建**

Run: `npm run preview`
Expected: 预览生产版本正常运行

- [ ] **Step 5: 提交**

```bash
git add vite.config.ts .env.production
git commit -m "feat: 添加生产构建配置"
```

---

## 验证清单

- [ ] `npm run dev` 启动开发服务器
- [ ] 侧边栏显示订阅列表
- [ ] 点击订阅源加载文章列表
- [ ] 文章以杂志式卡片显示 (图片在左，文字在右)
- [ ] 点击文章打开右侧抽屉
- [ ] 抽屉内显示文章详情和原文链接
- [ ] 主题切换按钮工作正常
- [ ] 刷新页面主题状态保持
- [ ] 访问不存在的路由显示 404 页面
- [ ] `npm run build` 构建成功

---

## 实现完成

计划已保存到 `docs/superpowers/plans/2026-04-28-react-refactor-plan.md`

**两个执行选项:**

**1. Subagent-Driven (推荐)** - 每个 Task 由 subagent 执行，任务间有审核

**2. Inline Execution** - 在本 session 中批量执行任务，带检查点

选择哪个方式？