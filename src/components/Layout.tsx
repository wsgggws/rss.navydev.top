import { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
  isDark: boolean
  onThemeToggle: () => void
}

function Layout({ children, isDark, onThemeToggle }: LayoutProps) {
  return (
    <div
      className={isDark ? 'dark-mode' : ''}
      style={{
        minHeight: '100vh',
        background: isDark ? '#1a1a2e' : '#f5f7fa',
        color: isDark ? '#e2e8f0' : '#1a1a2e',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <Header
        title="📡 RSS Reader"
        isDark={isDark}
        onThemeToggle={onThemeToggle}
      />
      <main
        style={{
          display: 'flex',
          minHeight: 'calc(100vh - 65px)',
        }}
      >
        {children}
      </main>
    </div>
  )
}

export default Layout