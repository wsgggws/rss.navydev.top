import { Button } from 'animal-island-ui'

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
        background: '#1a1a2e',
        borderBottom: '1px solid #0f3460',
      }}
    >
      <h1 style={{ color: '#e94560', fontSize: '1.5rem', fontWeight: 'bold' }}>
        {title}
      </h1>
      {onThemeToggle && (
        <Button
          onClick={onThemeToggle}
          style={{
            background: isDark ? '#0f3460' : '#e94560',
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </Button>
      )}
    </header>
  )
}

export default Header