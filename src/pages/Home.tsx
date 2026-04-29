import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import ArticleList from '../components/ArticleList'
import ArticleDrawer from '../components/ArticleDrawer'
import { useDarkMode } from '../hooks/useDarkMode'
import { ArticleItem, getAllSubscriptions } from '../api/subscription'

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string>('')
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [subscriptions, setSubscriptions] = useState<any[]>([])

  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    setSidebarOpen(!isMobile)
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

  return (
    <Layout
      isDark={isDark}
      onThemeToggle={toggleTheme}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
    >
      <Sidebar
        selectedId={selectedRssId}
        onSelect={setSelectedRssId}
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
        <ArticleList
          rssId={selectedRssId}
          onArticleClick={setSelectedArticle}
        />
      </div>
      {selectedArticle && (
        <ArticleDrawer
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </Layout>
  )
}

export default Home