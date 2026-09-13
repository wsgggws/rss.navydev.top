import { useEffect, useMemo, useState } from 'react'
import { ArticleItem, fetchArticleDetail, getAllSubscriptions, SubscriptionItem, trackVisit } from '../api/subscription'
import ArticleList from '../components/ArticleList'
import HistoryPanel from '../components/HistoryPanel'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import { useDarkMode } from '../hooks/useDarkMode'

type VisitCounts = Record<string, number>
type ReadIdsMap = Record<string, string[]>

function loadLocalValue<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function persistLocalValue(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Reading still works when storage is unavailable (for example, in private mode).
  }
}

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(() => !window.matchMedia('(max-width: 768px)').matches)
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([])
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true)
  const [subscriptionsError, setSubscriptionsError] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [historyArticles, setHistoryArticles] = useState<ArticleItem[]>(() => loadLocalValue('historyArticles', []))
  const [readIdsMap, setReadIdsMap] = useState<ReadIdsMap>(() => loadLocalValue('readIds', {}))
  const [visitCounts, setVisitCounts] = useState<VisitCounts>(() => loadLocalValue('visitCounts', {}))
  const [totalVisits, setTotalVisits] = useState(0)

  const selectedSubscription = useMemo(
    () => subscriptions.find(subscription => subscription.id === selectedRssId),
    [selectedRssId, subscriptions],
  )

  useEffect(() => {
    trackVisit().then(response => setTotalVisits(response.total_visits)).catch(() => undefined)
  }, [])

  useEffect(() => persistLocalValue('visitCounts', visitCounts), [visitCounts])
  useEffect(() => persistLocalValue('readIds', readIdsMap), [readIdsMap])
  useEffect(() => persistLocalValue('historyArticles', historyArticles), [historyArticles])

  useEffect(() => {
    let active = true

    async function fetchSubscriptions() {
      setSubscriptionsLoading(true)
      setSubscriptionsError('')
      try {
        const data = await getAllSubscriptions({ page: 1, pageSize: 100 })
        if (!active) return
        setSubscriptions(data.items)
        setSelectedRssId(current => current || data.items[0]?.id || '')
      } catch (error) {
        if (active) setSubscriptionsError(error instanceof Error ? error.message : '订阅源加载失败')
      } finally {
        if (active) setSubscriptionsLoading(false)
      }
    }

    fetchSubscriptions()
    return () => { active = false }
  }, [])

  function openArticle(article: ArticleItem, rssId = selectedRssId) {
    const resolvedRssId = article.rss_id || rssId
    const optimisticViewCount = (visitCounts[article.id] || article.view_count || 0) + 1
    const enrichedArticle = {
      ...article,
      rss_id: resolvedRssId,
      view_count: optimisticViewCount,
    }
    setVisitCounts(current => ({ ...current, [article.id]: optimisticViewCount }))
    setHistoryArticles(current => [enrichedArticle, ...current.filter(item => item.id !== article.id)].slice(0, 100))

    if (resolvedRssId) {
      void fetchArticleDetail(resolvedRssId, article.id)
        .then(detail => {
          const confirmedCount = detail.view_count || optimisticViewCount
          setVisitCounts(current => ({
            ...current,
            [article.id]: Math.max(current[article.id] || 0, confirmedCount),
          }))
          setHistoryArticles(current => current.map(item => item.id === article.id
            ? { ...item, view_count: Math.max(item.view_count || 0, confirmedCount) }
            : item))
        })
        .catch(() => undefined)
    }
  }

  function markArticleRead(articleId: string) {
    setReadIdsMap(current => {
      const readIds = current[selectedRssId] || []
      if (readIds.includes(articleId)) return current
      return { ...current, [selectedRssId]: [...readIds, articleId] }
    })
  }

  function selectSubscription(id: string) {
    setSelectedRssId(id)
    setShowHistory(false)
    if (window.matchMedia('(max-width: 768px)').matches) setSidebarOpen(false)
  }

  function clearHistory() {
    if (window.confirm('确定清空当前浏览器中的全部阅读记录吗？')) setHistoryArticles([])
  }

  return (
    <Layout
      isDark={isDark}
      onThemeToggle={toggleTheme}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(open => !open)}
      onHistoryToggle={() => setShowHistory(current => !current)}
      showHistory={showHistory}
      historyCount={historyArticles.length}
      totalVisits={totalVisits}
    >
      <Sidebar
        selectedId={selectedRssId}
        onSelect={selectSubscription}
        subscriptions={subscriptions}
        isOpen={sidebarOpen}
        isMobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        loading={subscriptionsLoading}
        error={subscriptionsError}
      />

      {sidebarOpen && <button type="button" className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="关闭订阅栏" />}

      <div className="content-workspace">
        {showHistory ? (
          <HistoryPanel
            articles={historyArticles}
            onClose={() => setShowHistory(false)}
            onClear={clearHistory}
            onArticleClick={article => openArticle(article, article.rss_id)}
            visitCounts={visitCounts}
          />
        ) : (
          <ArticleList
            rssId={selectedRssId}
            feedTitle={selectedSubscription?.title}
            onArticleClick={article => {
              markArticleRead(article.id)
              openArticle(article)
            }}
            readIds={readIdsMap[selectedRssId] || []}
            visitCounts={visitCounts}
          />
        )}
      </div>

    </Layout>
  )
}

export default Home
