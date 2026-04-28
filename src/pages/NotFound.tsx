function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#1a1a2e',
      color: '#e94560',
    }}>
      <h1 style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', color: '#a2a2a2' }}>Page Not Found</p>
    </div>
  )
}

export default NotFound