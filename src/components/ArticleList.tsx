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
