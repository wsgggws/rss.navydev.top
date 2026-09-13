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

function Layout(props: LayoutProps) {
  return (
    <div className="app-shell">
      <Header
        isDark={props.isDark}
        onThemeToggle={props.onThemeToggle}
        onMenuToggle={props.onSidebarToggle}
        sidebarOpen={props.sidebarOpen}
        onHistoryToggle={props.onHistoryToggle}
        showHistory={props.showHistory}
        historyCount={props.historyCount}
        totalVisits={props.totalVisits}
      />
      <main className="app-main">{props.children}</main>
    </div>
  )
}

export default Layout
