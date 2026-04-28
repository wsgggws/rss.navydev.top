import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#16213e',
      color: '#e2e8f0',
      textAlign: 'center',
      padding: '20px',
    }}>
      <h1 style={{
        fontSize: '8rem',
        fontWeight: 'bold',
        color: '#e94560',
        marginBottom: '1rem',
        textShadow: '0 0 20px rgba(233, 69, 96, 0.5)',
      }}>
        404
      </h1>
      <p style={{
        fontSize: '1.5rem',
        color: '#a2a2a2',
        marginBottom: '2rem',
      }}>
        页面未找到
      </p>
      <Link
        to="/"
        style={{
          padding: '12px 32px',
          background: '#e94560',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'all 0.2s',
        }}
      >
        返回首页
      </Link>
    </div>
  )
}

export default NotFound
