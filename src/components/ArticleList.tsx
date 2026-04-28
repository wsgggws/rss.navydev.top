import { useState, useEffect } from 'react'
import { Card } from 'animal-island-ui'
import { fetchArticles, ArticleItem } from '../api/subscription'
import ArticleCard from './ArticleCard'

interface ArticleListProps {
  rssId: string
  onArticleClick: (article: ArticleItem) => void
}

function ArticleList({ rssId, onArticleClick }: ArticleListProps) {
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          padding: '40px',
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            marginBottom: '16px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          📖
        </div>
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
          }}
        >
          加载文章中...
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <Card
        style={{
          textAlign: 'center',
          padding: '40px',
          marginTop: '20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>❌</div>
        <div
          style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}
        >
          {error}
        </div>
        <button
          onClick={fetchArticleList}
          style={{
            padding: '10px 24px',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          重试
        </button>
      </Card>
    )
  }

  if (articles.length === 0) {
    return (
      <Card
        style={{
          textAlign: 'center',
          padding: '60px 40px',
          marginTop: '20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
          }}
        >
          暂无文章
        </div>
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginTop: '8px',
          }}
        >
          这个订阅源还没有文章
        </div>
      </Card>
    )
  }

  return (
    <div style={{ maxWidth: '800px', padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          📰 文章列表
        </h2>
        <span
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
          }}
        >
          共 {articles.length} 篇
        </span>
      </div>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onClick={() => onArticleClick(article)}
        />
      ))}
    </div>
  )
}

export default ArticleList