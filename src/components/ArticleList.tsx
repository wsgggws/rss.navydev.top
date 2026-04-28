import { useState, useEffect, useMemo } from 'react'
import { Card } from 'animal-island-ui'
import { fetchArticles, fetchAllArticles, ArticleItem, SubscriptionItem } from '../api/subscription'
import ArticleCard from './ArticleCard'
import FilterBar from './FilterBar'

export interface ArticleFilter {
  rssIds: string[]
  search: string
  startDate: string
  endDate: string
}

interface ArticleListProps {
  rssId: string | null
  subscriptions: SubscriptionItem[]
  onArticleClick: (article: ArticleItem) => void
}

function ArticleList({ rssId, subscriptions, onArticleClick }: ArticleListProps) {
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filter, setFilter] = useState<ArticleFilter>({
    rssIds: rssId ? [rssId] : [],
    search: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    if (rssId) {
      setFilter(prev => ({ ...prev, rssIds: [rssId] }))
    }
  }, [rssId])

  useEffect(() => {
    fetchArticleList()
  }, [rssId])

  async function fetchArticleList() {
    try {
      setLoading(true)
      let data
      if (rssId) {
        data = await fetchArticles({ rssId, page: 1, pageSize: 100 })
      } else {
        data = await fetchAllArticles({ page: 1, pageSize: 200 })
      }
      setArticles(data.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        const titleMatch = article.title.toLowerCase().includes(searchLower)
        const summaryMatch = article.summary_md?.toLowerCase().includes(searchLower) ?? false
        if (!titleMatch && !summaryMatch) {
          return false
        }
      }

      if (filter.startDate) {
        const articleDate = new Date(article.published_at).toISOString().split('T')[0]
        if (articleDate < filter.startDate) {
          return false
        }
      }

      if (filter.endDate) {
        const articleDate = new Date(article.published_at).toISOString().split('T')[0]
        if (articleDate > filter.endDate) {
          return false
        }
      }

      if (rssId === null && filter.rssIds && filter.rssIds.length > 0) {
        if (article.rss_id && !filter.rssIds.includes(article.rss_id)) {
          return false
        }
      }

      return true
    })
  }, [articles, filter, rssId])

  const handleFilterChange = (newFilter: Partial<ArticleFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }))
  }

  const handleReset = () => {
    setFilter({
      rssIds: rssId ? [rssId] : [],
      search: '',
      startDate: '',
      endDate: '',
    })
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

  return (
    <div
      className="article-list-container"
      style={{
        maxWidth: '800px',
        width: '100%',
        padding: '20px',
        margin: '0 auto',
      }}
    >
      <FilterBar
        subscriptions={subscriptions}
        selectedRssIds={filter.rssIds}
        searchQuery={filter.search}
        startDate={filter.startDate}
        endDate={filter.endDate}
        onRssIdsChange={ids => handleFilterChange({ rssIds: ids })}
        onSearchChange={search => handleFilterChange({ search })}
        onStartDateChange={startDate => handleFilterChange({ startDate })}
        onEndDateChange={endDate => handleFilterChange({ endDate })}
        onReset={handleReset}
      />

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
          共 {filteredArticles.length} 篇
          {filter.search && ' (已筛选)'}
        </span>
      </div>

      {filteredArticles.length === 0 ? (
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
            {filter.search || filter.startDate || filter.endDate
              ? '尝试调整筛选条件'
              : '这个订阅源还没有文章'}
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