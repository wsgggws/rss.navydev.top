import { Switch } from 'animal-island-ui'

interface HeaderProps {
  title: string
  onThemeToggle?: () => void
  isDark?: boolean
  onMenuToggle?: () => void
  sidebarOpen?: boolean
}

function Header({ title, onThemeToggle, isDark, onMenuToggle, sidebarOpen }: HeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 2px 8px var(--shadow)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
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
              fontSize: '1.5rem',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        )}
        <h1
          style={{
            color: 'var(--accent-primary)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {title}
        </h1>
      </div>
      {onThemeToggle && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
            }}
          >
            {isDark ? '🌙' : '☀️'}
          </span>
          <Switch checked={isDark} onChange={onThemeToggle} />
        </div>
      )}
    </header>
  )
}

export default Header