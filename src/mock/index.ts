import { MockMethod } from 'vite-plugin-mock'

const subscriptions = [
  { id: '1', url: 'https://example.com/feed1', title: '技术周刊' },
  { id: '2', url: 'https://example.com/feed2', title: '独立开发' },
  { id: '3', url: 'https://example.com/feed3', title: '设计札记' },
]

const topics = ['React 新特性', '独立产品开发', '现代 CSS 实践', 'TypeScript 最佳实践', 'Web 性能优化']

const articles = Array.from({ length: 95 }, (_, i) => ({
  id: `article-${i + 1}`,
  link: `https://example.com/article/${i + 1}`,
  published_at: new Date(Date.now() - i * 86400000).toISOString(),
  title: `文章 ${i + 1}：${topics[i % topics.length]}`,
  description: `来自订阅源的内容预览：本文讨论${topics[i % topics.length]}，包含实践方法和具体示例。`,
  author: ['林舟', '陈默', 'Alex Chen', '周宁'][i % 4],
  rss_id: String((i % 3) + 1),
}))

export default [
  {
    url: '/api/v1/rss/subscriptions',
    method: 'get',
    response: () => {
      return {
        items: subscriptions,
        total: subscriptions.length,
      }
    },
  } as MockMethod,
  {
    url: '/api/v1/rss/subscriptions/:rssId/articles',
    method: 'get',
    response: (options: { query?: { limit?: number, offset?: number }, params?: { rssId?: string } }) => {
      const limit = Number(options.query?.limit) || 20
      const offset = Number(options.query?.offset) || 0
      const rssId = options.params?.rssId
      const filtered = articles.filter(a => !rssId || a.rss_id === rssId)
      return {
        items: filtered.slice(offset, offset + limit),
        total: filtered.length,
      }
    },
  } as MockMethod,
  {
    url: '/api/v1/rss/subscriptions/:rssId/articles/:articleId',
    method: 'get',
    response: (options: { params?: { articleId?: string } }) => {
      const article = articles.find(item => item.id === options.params?.articleId) || articles[0]
      return { ...article, view_count: 128 }
    },
  } as MockMethod,
  {
    url: '/api/v1/visit/track',
    method: 'post',
    response: () => ({ total_visits: 12842 }),
  } as MockMethod,
] as MockMethod[]
