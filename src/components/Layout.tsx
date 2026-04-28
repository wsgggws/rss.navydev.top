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
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        transition: 'background 0.3s ease, color 0.3s ease',
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