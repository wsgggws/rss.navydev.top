import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import ArticleList from '../components/ArticleList'
import ArticleDrawer from '../components/ArticleDrawer'
import HistoryPanel from '../components/HistoryPanel'
import { useDarkMode } from '../hooks/useDarkMode'
import { ArticleItem, getAllSubscriptions } from '../api/subscription'

type ReadIdsMap = Record<string, string[]>

function loadReadIds(): ReadIdsMap {
  try {
    const stored = localStorage.getItem('readIds')
    return stored ? JSON.parse(stored) : {}
  } catch { return {} }
}

function saveReadIds(map: ReadIdsMap) {
  try {
    localStorage.setItem('readIds', JSON.stringify(map))
  } catch {}
}

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string>('')
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [historyArticles, setHistoryArticles] = useState<ArticleItem[]>(() => {
    try {
      const stored = localStorage.getItem('historyArticles')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  const [readIdsMap, setReadIdsMap] = useState<ReadIdsMap>(loadReadIds)

  useEffect(() => {
    saveReadIds(readIdsMap)
  }, [readIdsMap])

  useEffect(() => {
    try {
      localStorage.setItem('historyArticles', JSON.stringify(historyArticles))
    } catch {}
  }, [historyArticles])

  useEffect(() => {
    setSidebarOpen(true)
  }, [])

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  async function fetchSubscriptions() {
    try {
      const data = await getAllSubscriptions({ page: 1, pageSize: 50 })
      setSubscriptions(data.items)
      if (data.items.length > 0 && !selectedRssId) {
        setSelectedRssId(data.items[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err)
    }
  }

  const handleArticleRead = (article: ArticleItem) => {
    setHistoryArticles(prev => {
      if (prev.some(a => a.id === article.id)) return prev
      return [{ ...article, rss_id: article.rss_id || selectedRssId }, ...prev]
    })
  }

  const handleMarkRead = (articleId: string) => {
    setReadIdsMap(prev => {
      const current = prev[selectedRssId] || []
      if (current.includes(articleId)) return prev
      return { ...prev, [selectedRssId]: [...current, articleId] }
    })
  }

  return (
    <Layout
      isDark={isDark}
      onThemeToggle={toggleTheme}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      onHistoryToggle={() => setShowHistory(!showHistory)}
      showHistory={showHistory}
      historyCount={historyArticles.length}
    >
      <Sidebar
        selectedId={selectedRssId}
        onSelect={(id) => {
          setSelectedRssId(id)
          setShowHistory(false)
        }}
        subscriptions={subscriptions}
        isOpen={sidebarOpen}
        isMobileOpen={sidebarOpen}
      />
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {showHistory ? (
          <HistoryPanel
            articles={historyArticles}
            onClose={() => setShowHistory(false)}
            onArticleClick={setSelectedArticle}
          />
        ) : (
          <ArticleList
            rssId={selectedRssId}
            onArticleClick={(article) => {
              handleMarkRead(article.id)
              handleArticleRead(article)
              setSelectedArticle(article)
            }}
            readIds={readIdsMap[selectedRssId] || []}
          />
        )}
      </div>
      {selectedArticle && (
        <ArticleDrawer
          article={selectedArticle}
          rssId={selectedRssId}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </Layout>
  )
}

export default Home