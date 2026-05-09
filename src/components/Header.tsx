interface HeaderProps {
  title: string
  onThemeToggle?: () => void
  isDark?: boolean
  onMenuToggle?: () => void
  sidebarOpen?: boolean
  onHistoryToggle?: () => void
  showHistory?: boolean
  historyCount?: number
  totalVisits?: number
}

function Header({ title, onThemeToggle, isDark, onMenuToggle, sidebarOpen, onHistoryToggle, showHistory, historyCount, totalVisits }: HeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '4px',
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? '[x]' : '[=]'}
          </button>
        )}
        <h1
          style={{
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          {title}
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {totalVisits !== undefined && totalVisits > 0 && (
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            {totalVisits.toLocaleString()} visits
          </span>
        )}
        {onHistoryToggle && (
          <button
            onClick={onHistoryToggle}
            style={{
              background: showHistory ? 'var(--text-primary)' : 'transparent',
              color: showHistory ? 'var(--bg-primary)' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              padding: '6px 12px',
              fontSize: '0.85rem',
            }}
          >
            history {historyCount !== undefined && historyCount > 0 ? `(${historyCount})` : ''}
          </button>
        )}
        {onThemeToggle && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
              }}
            >
              {isDark ? 'dark' : 'light'}
            </span>
            <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isDark}
                onChange={onThemeToggle}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: isDark ? 'var(--text-primary)' : 'var(--border-color)',
                  borderRadius: '10px',
                  transition: 'background 0.2s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: isDark ? '22px' : '2px',
                    width: '16px',
                    height: '16px',
                    background: isDark ? 'var(--bg-card)' : 'var(--text-secondary)',
                    borderRadius: '50%',
                    transition: 'left 0.2s',
                  }}
                />
              </span>
            </label>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
