import { useState, useEffect, useMemo } from 'react'
import { fetchArticles, ArticleItem } from '../api/subscription'
import ArticleCard from './ArticleCard'

interface ArticleListProps {
  rssId: string
  onArticleClick: (article: ArticleItem) => void
  readIds: string[]
  visitCounts: Record<string, number>
}

const PAGE_SIZE = 10

function ArticleList({ rssId, onArticleClick, readIds, visitCounts }: ArticleListProps) {
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [rssId])

  useEffect(() => {
    fetchArticleList()
  }, [rssId])

  useEffect(() => {
    setCurrentPage(1)
  }, [rssId, searchQuery])

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

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE)
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredArticles.slice(start, start + PAGE_SIZE)
  }, [filteredArticles, currentPage])

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
      <div
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
      </div>
    )
  }

  if (!rssId) {
    return (
      <div
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
      </div>
    )
  }

  return (
    <div
      className="article-list-container"
      style={{
        maxWidth: '1300px',
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
          className="search-input"
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
        <div
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
        </div>
      ) : (
        <>
          {paginatedArticles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => onArticleClick(article)}
              isRead={readIds.includes(article.id)}
              visitCount={visitCounts[article.id] || 0}
            />
          ))}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                marginTop: '16px',
                padding: '16px 0',
              }}
            >
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  background: currentPage === 1 ? 'var(--bg-secondary)' : 'var(--text-primary)',
                  color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                prev
              </button>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  background: currentPage === totalPages ? 'var(--bg-secondary)' : 'var(--text-primary)',
                  color: currentPage === totalPages ? 'var(--text-secondary)' : 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ArticleList