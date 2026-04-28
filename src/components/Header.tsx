import { Switch } from 'animal-island-ui'

interface HeaderProps {
  title: string
  onThemeToggle?: () => void
  isDark?: boolean
}

function Header({ title, onThemeToggle, isDark }: HeaderProps) {
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
      <h1
        style={{
          color: 'var(--accent-primary)',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        {title}
      </h1>
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