interface HeaderProps {
  title: string
  onThemeToggle?: () => void
  isDark?: boolean
}

function Header({ title, onThemeToggle, isDark }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      background: '#1a1a2e',
      borderBottom: '1px solid #0f3460',
    }}>
      <h1 style={{ color: '#e94560', fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h1>
      {onThemeToggle && (
        <button
          onClick={onThemeToggle}
          style={{
            padding: '8px 16px',
            background: isDark ? '#0f3460' : '#e94560',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      )}
    </header>
  )
}

export default Header
