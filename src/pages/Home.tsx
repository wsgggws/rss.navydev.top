import { useState } from 'react'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import ArticleList from '../components/ArticleList'
import ArticleDrawer from '../components/ArticleDrawer'
import { useDarkMode } from '../hooks/useDarkMode'
import { ArticleItem } from '../api/subscription'

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)

  return (
    <Layout isDark={isDark} onThemeToggle={toggleTheme}>
      <Sidebar
        selectedId={selectedRssId}
        onSelect={setSelectedRssId}
      />
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {selectedRssId ? (
          <ArticleList
            rssId={selectedRssId}
            onArticleClick={setSelectedArticle}
          />
        ) : (
          <div
            style={{
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginTop: '40px',
            }}
          >
            选择一个订阅源查看文章
          </div>
        )}
      </div>
      <ArticleDrawer
        rssId={selectedRssId || ''}
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}
    </Layout>
  )
}

export default Home