import { MockMethod } from 'vite-plugin-mock'

const subscriptions = [
  { id: '1', url: 'https://example.com/feed1', title: 'Tech News' },
  { id: '2', url: 'https://example.com/feed2', title: 'AI Research' },
  { id: '3', url: 'https://example.com/feed3', title: 'Design Weekly' },
]

const articles = Array.from({ length: 95 }, (_, i) => ({
  id: `article-${i + 1}`,
  link: `https://example.com/article/${i + 1}`,
  published_at: new Date(Date.now() - i * 86400000).toISOString(),
  title: `Article ${i + 1}: ${['React 19 New Features', 'Building AI Apps', 'Modern CSS Tips', 'TypeScript Best Practices', 'Web Performance Guide'][i % 5]}`,
  author: ['John Doe', 'Jane Smith', 'Alex Chen', 'Sarah Johnson'][i % 4],
  rss_id: String((i % 3) + 1),
  summary_md: `# Article ${i + 1} Title

This is the summary content for article ${i + 1}. It contains important information that readers will find valuable.

## Key Points

- Point one about this topic
- Point two discussing the details
- Point three with more insights

## Conclusion

In conclusion, this article covers the essential aspects of ${['React 19', 'AI Development', 'CSS Architecture', 'TypeScript', 'Performance'][i % 5]} that every developer should know.

\`\`\`javascript
console.log('Example code block ${i + 1}');
\`\`\`

> Important quote from the original article.

More detailed explanation follows here with multiple paragraphs of content to simulate real article length.`,
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
] as MockMethod[]