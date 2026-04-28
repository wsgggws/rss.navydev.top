import { useState, useEffect, useMemo } from 'react'
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
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchArticleList()
  }, [rssId])

  async function fetchArticleList() {
    if (!rssId) {
      setArticles([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await fetchArticles({ rssId, page: 1, pageSize: 100 })
      setArticles(data.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'load failed')
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles
    const lower = searchQuery.toLowerCase()
    return articles.filter(article =>
      article.title.toLowerCase().includes(lower) ||
      (article.summary_md?.toLowerCase().includes(lower) ?? false)
    )
  }, [articles, searchQuery])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
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
          color: 'var(--text-secondary)',
        }}
      >
        loading...
      </div>
    )
  }

  if (error) {
    return (
      <Card
        style={{
          textAlign: 'center',
          padding: '40px',
          marginTop: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
          {error}
        </div>
        <button
          onClick={fetchArticleList}
          style={{
            padding: '8px 16px',
            background: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          retry
        </button>
      </Card>
    )
  }

  if (!rssId) {
    return (
      <Card
        style={{
          textAlign: 'center',
          padding: '60px 40px',
          marginTop: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
          }}
        >
          select a subscription to view articles
        </div>
      </Card>
    )
  }

  return (
    <div
      className="article-list-container"
      style={{
        maxWidth: '800px',
        width: '100%',
        padding: '12px',
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="search articles..."
          value={searchQuery}
          onChange={e => handleSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <h2
          style={{
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          articles ({filteredArticles.length})
        </h2>
      </div>

      {filteredArticles.length === 0 ? (
        <Card
          style={{
            textAlign: 'center',
            padding: '60px 40px',
            marginTop: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
            }}
          >
            {searchQuery ? 'no match' : 'no articles'}
          </div>
        </Card>
      ) : (
        filteredArticles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => onArticleClick(article)}
          />
        ))
      )}
    </div>
  )
}

export default ArticleList
