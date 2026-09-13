import { History, Menu, Moon, PanelLeftClose, Rss, Sun } from 'lucide-react'

interface HeaderProps {
  onThemeToggle?: () => void
  isDark?: boolean
  onMenuToggle?: () => void
  sidebarOpen?: boolean
  onHistoryToggle?: () => void
  showHistory?: boolean
  historyCount?: number
  totalVisits?: number
}

function Header({
  onThemeToggle,
  isDark,
  onMenuToggle,
  sidebarOpen,
  onHistoryToggle,
  showHistory,
  historyCount = 0,
  totalVisits = 0,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-brand-group">
        {onMenuToggle && (
          <button
            type="button"
            className="icon-button menu-button"
            onClick={onMenuToggle}
            aria-label={sidebarOpen ? '收起订阅栏' : '展开订阅栏'}
            title={sidebarOpen ? '收起订阅栏' : '展开订阅栏'}
          >
            {sidebarOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}
          </button>
        )}
        <div className="brand-mark" aria-hidden="true">
          <Rss size={19} />
        </div>
        <div className="brand-copy">
          <strong>RSS NAVY</strong>
          <span>专注阅读，远离噪音</span>
        </div>
      </div>

      <div className="header-actions">
        {totalVisits > 0 && (
          <span className="visit-stat" title="本站累计访问次数">
            <strong>{totalVisits.toLocaleString()}</strong>
            <span>次访问</span>
          </span>
        )}
        {onHistoryToggle && (
          <button
            type="button"
            className={`header-action-button ${showHistory ? 'is-active' : ''}`}
            onClick={onHistoryToggle}
            aria-pressed={showHistory}
          >
            <History size={18} />
            <span className="action-label">阅读记录</span>
            {historyCount > 0 && <span className="count-badge">{historyCount}</span>}
          </button>
        )}
        {onThemeToggle && (
          <button
            type="button"
            className="icon-button"
            onClick={onThemeToggle}
            aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
            title={isDark ? '切换到浅色模式' : '切换到深色模式'}
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
