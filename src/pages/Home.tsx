import { useState } from 'react'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import ArticleList from '../components/ArticleList'
import { useDarkMode } from '../hooks/useDarkMode'
import { ArticleItem } from '../api/subscription'

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)

  return (
    <Layout isDark={isDark} onThemeToggle={toggleTheme}>
      <Sidebar
        isDark={isDark}
        selectedId={selectedRssId}
        onSelect={setSelectedRssId}
      />
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {selectedRssId ? (
          <ArticleList
            rssId={selectedRssId}
            isDark={isDark}
            onArticleClick={setSelectedArticle}
          />
        ) : (
          <div style={{
            color: isDark ? '#a2a2a2' : '#718096',
            textAlign: 'center',
            marginTop: '40px',
          }}>
            选择一个订阅源查看文章
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Home
