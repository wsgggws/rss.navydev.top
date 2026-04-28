import { useState, useEffect } from 'react'
import { getAllSubscriptions, SubscriptionItem } from '../api/subscription'

interface SidebarProps {
  isDark: boolean
  selectedId: string | null
  onSelect: (id: string) => void
}

function Sidebar({ isDark, selectedId, onSelect }: SidebarProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  async function fetchSubscriptions() {
    try {
      setLoading(true)
      const data = await getAllSubscriptions({ page: 1, pageSize: 50 })
      setSubscriptions(data.items)
      if (data.items.length > 0 && !selectedId) {
        onSelect(data.items[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const filteredList = subscriptions.filter(sub =>
    sub.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{
      width: '240px',
      background: isDark ? '#0f3460' : '#ffffff',
      padding: '16px',
      borderRight: `1px solid ${isDark ? '#0f3460' : '#e2e8f0'}`,
      minHeight: '100%',
      overflowY: 'auto',
    }}>
      <h2 style={{
        color: isDark ? '#e94560' : '#667eea',
        marginBottom: '16px',
        fontSize: '1.1rem',
      }}>
        📡 我的订阅
      </h2>

      <input
        type="text"
        placeholder="搜索订阅..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: `1px solid ${isDark ? '#1a1a2e' : '#e2e8f0'}`,
          background: isDark ? '#1a1a2e' : '#f7fafc',
          color: isDark ? '#e2e8f0' : '#2d3748',
          marginBottom: '16px',
          outline: 'none',
        }}
      />

      {loading && (
        <div style={{ color: isDark ? '#a2a2a2' : '#718096' }}>加载中...</div>
      )}

      {error && (
        <div style={{ color: '#e94560' }}>{error}</div>
      )}

      {!loading && !error && filteredList.length === 0 && (
        <div style={{ color: isDark ? '#a2a2a2' : '#718096' }}>
          {searchQuery ? '没有找到匹配的订阅' : '暂无订阅'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredList.map(sub => (
          <div
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: selectedId === sub.id
                ? '#e94560'
                : isDark ? '#1a1a2e' : '#f7fafc',
              color: selectedId === sub.id ? 'white' : isDark ? '#e2e8f0' : '#2d3748',
              cursor: 'pointer',
              fontWeight: selectedId === sub.id ? 'bold' : 'normal',
              transition: 'all 0.2s',
            }}
          >
            {sub.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar