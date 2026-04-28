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
        background: isDark ? '#1a1a2e' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#0f3460' : '#e2e8f0'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h1
        style={{
          color: '#e94560',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        {title}
      </h1>
      {onThemeToggle && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: isDark ? '#a2a2a2' : '#718096', fontSize: '0.9rem' }}>
            {isDark ? '🌙' : '☀️'}
          </span>
          <Switch
            checked={isDark}
            onChange={onThemeToggle}
          />
        </div>
      )}
    </header>
  )
}

export default Header