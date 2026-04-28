import { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
  isDark: boolean
  onThemeToggle: () => void
}

function Layout({ children, isDark, onThemeToggle }: LayoutProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#16213e' : '#f5f7fa',
      color: isDark ? '#e2e8f0' : '#2d3748',
    }}>
      <Header
        title="📡 RSS Reader"
        isDark={isDark}
        onThemeToggle={onThemeToggle}
      />
      <main style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        {children}
      </main>
    </div>
  )
}

export default Layout
