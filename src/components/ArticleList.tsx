import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, RefreshCw, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ArticleItem, fetchArticles } from '../api/subscription'
import ArticleCard from './ArticleCard'

interface ArticleListProps {
  rssId: string
  feedTitle?: string
  onArticleClick: (article: ArticleItem) => void
  readIds: string[]
  visitCounts: Record<string, number>
}

type ReadFilter = 'all' | 'unread'
const PAGE_SIZE = 10

function ArticleList({ rssId, feedTitle, onArticleClick, readIds, visitCounts }: ArticleListProps) {
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [readFilter, setReadFilter] = useState<ReadFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadArticles() {
      if (!rssId) {
        setArticles([])
        setTotal(0)
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await fetchArticles({ rssId, page: 1, pageSize: 100 })
        if (active) {
          setArticles(data.items)
          setTotal(data.total)
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : '文章加载失败')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadArticles()
    return () => { active = false }
  }, [rssId, reloadKey])

  useEffect(() => setCurrentPage(1), [rssId, searchQuery, readFilter])

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()
    return articles.filter(article => {
      if (readFilter === 'unread' && readIds.includes(article.id)) return false
      if (!query) return true
      return article.title.toLocaleLowerCase().includes(query)
        || article.description?.toLocaleLowerCase().includes(query)
    })
  }, [articles, readFilter, readIds, searchQuery])

  const unreadCount = useMemo(
    () => articles.filter(article => !readIds.includes(article.id)).length,
    [articles, readIds],
  )
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE))
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredArticles.slice(start, start + PAGE_SIZE)
  }, [filteredArticles, currentPage])

  if (!rssId && !loading) {
    return (
      <div className="empty-state page-state">
        <span className="state-icon"><Inbox size={25} /></span>
        <h2>选择一个订阅源</h2>
        <p>从左侧列表选择感兴趣的内容，开始阅读。</p>
      </div>
    )
  }

  return (
    <section className="content-container" aria-busy={loading}>
      <div className="content-heading">
        <div>
          <span className="eyebrow">LATEST STORIES</span>
          <h1>{feedTitle || '最新文章'}</h1>
          <p>{loading ? '正在同步最新内容…' : `已加载 ${articles.length} 篇，共 ${total} 篇`}</p>
        </div>
        <button
          type="button"
          className="icon-button refresh-button"
          onClick={() => setReloadKey(value => value + 1)}
          disabled={loading}
          aria-label="刷新文章"
          title="刷新文章"
        >
          <RefreshCw size={18} className={loading ? 'is-spinning' : ''} />
        </button>
      </div>

      <div className="article-toolbar">
        <label className="search-field article-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            placeholder="搜索当前订阅中的文章"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            aria-label="搜索文章"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} aria-label="清空搜索">
              <X size={15} />
            </button>
          )}
        </label>
        <div className="segmented-control" aria-label="阅读状态筛选">
          <button type="button" className={readFilter === 'all' ? 'is-active' : ''} onClick={() => setReadFilter('all')}>
            全部 <span>{articles.length}</span>
          </button>
          <button type="button" className={readFilter === 'unread' ? 'is-active' : ''} onClick={() => setReadFilter('unread')}>
            未读 <span>{unreadCount}</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="article-list">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="article-skeleton" key={index}>
              <span><i /><i /><i /></span><b />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="empty-state inline-state is-error">
          <span className="state-icon"><AlertTriangle size={24} /></span>
          <h2>暂时无法加载文章</h2>
          <p>{error}</p>
          <button type="button" className="primary-button" onClick={() => setReloadKey(value => value + 1)}>重新加载</button>
        </div>
      )}

      {!loading && !error && filteredArticles.length === 0 && (
        <div className="empty-state inline-state">
          <span className="state-icon"><Search size={24} /></span>
          <h2>{searchQuery ? '没有找到相关文章' : '这里暂时没有未读文章'}</h2>
          <p>{searchQuery ? '换一个关键词试试。' : '你已经读完当前订阅的所有文章。'}</p>
        </div>
      )}

      {!loading && !error && paginatedArticles.length > 0 && (
        <>
          <div className="article-list">
            {paginatedArticles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article)}
                isRead={readIds.includes(article.id)}
                visitCount={visitCounts[article.id] || article.view_count || 0}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="pagination" aria-label="文章分页">
              <button type="button" className="icon-button" onClick={() => setCurrentPage(page => page - 1)} disabled={currentPage === 1} aria-label="上一页">
                <ChevronLeft size={18} />
              </button>
              <span>第 <strong>{currentPage}</strong> / {totalPages} 页</span>
              <button type="button" className="icon-button" onClick={() => setCurrentPage(page => page + 1)} disabled={currentPage === totalPages} aria-label="下一页">
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}

export default ArticleList
