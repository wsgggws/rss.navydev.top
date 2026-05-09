import { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
  isDark: boolean
  onThemeToggle: () => void
  sidebarOpen: boolean
  onSidebarToggle: () => void
  onHistoryToggle?: () => void
  showHistory?: boolean
  historyCount?: number
  totalVisits?: number
}

function Layout({ children, isDark, onThemeToggle, sidebarOpen, onSidebarToggle, onHistoryToggle, showHistory, historyCount, totalVisits }: LayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      <Header
        title="RSS Reader"
        isDark={isDark}
        onThemeToggle={onThemeToggle}
        onMenuToggle={onSidebarToggle}
        sidebarOpen={sidebarOpen}
        onHistoryToggle={onHistoryToggle}
        showHistory={showHistory}
        historyCount={historyCount}
        totalVisits={totalVisits}
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