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
          <Switch checked={isDark} onChange={onThemeToggle} />
        </div>
      )}
    </header>
  )
}

export default Header
