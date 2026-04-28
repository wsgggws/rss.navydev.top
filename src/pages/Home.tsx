import { useState } from 'react'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import { useDarkMode } from '../hooks/useDarkMode'

function Home() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedRssId, setSelectedRssId] = useState<string | null>(null)

  return (
    <Layout isDark={isDark} onThemeToggle={toggleTheme}>
      <Sidebar
        isDark={isDark}
        selectedId={selectedRssId}
        onSelect={setSelectedRssId}
      />
      <div style={{ flex: 1, padding: '24px' }}>
        {selectedRssId ? `文章列表: ${selectedRssId}` : '选择一个订阅源'}
      </div>
    </Layout>
  )
}

export default Home
