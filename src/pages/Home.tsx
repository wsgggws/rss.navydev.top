import { useState } from 'react'
import Layout from '../components/Layout'
import { useDarkMode } from '../hooks/useDarkMode'

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string | null>(null)

  return (
    <Layout isDark={isDark} onThemeToggle={toggleTheme}>
      <div style={{
        width: '240px',
        background: isDark ? '#0f3460' : '#ffffff',
        padding: '16px',
        borderRight: '1px solid #0f3460',
        minHeight: '100%',
      }}>
        <h2 style={{ color: isDark ? '#e94560' : '#667eea', marginBottom: '16px' }}>订阅源</h2>
        <div style={{ color: isDark ? '#a2a2a2' : '#718096' }}>
          {selectedRssId || '选择一个订阅源'}
        </div>
      </div>
      <div style={{ flex: 1, padding: '24px' }}>
        文章列表区域
      </div>
    </Layout>
  )
}

export default Home
