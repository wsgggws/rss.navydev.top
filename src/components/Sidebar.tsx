import { useState, useEffect } from 'react'
import { Input, Card } from 'animal-island-ui'
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

  const filteredList = subscriptions.filter((sub) =>
    sub.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div
      style={{
        width: '280px',
        background: isDark ? '#16213e' : '#ffffff',
        padding: '20px',
        borderRight: `1px solid ${isDark ? '#0f3460' : '#e8eaf0'}`,
        minHeight: '100%',
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          color: '#e94560',
          marginBottom: '16px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>📡</span>
        <span>我的订阅</span>
      </h2>

      <Input
        placeholder="搜索订阅..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: '20px',
          width: '100%',
        }}
        size="large"
      />

      {loading && (
        <div
          style={{
            color: isDark ? '#a2a2a2' : '#718096',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          加载中...
        </div>
      )}

      {error && (
        <div
          style={{
            color: '#e94560',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && filteredList.length === 0 && (
        <div
          style={{
            color: isDark ? '#a2a2a2' : '#718096',
            textAlign: 'center',
            padding: '40px 20px',
          }}
        >
          {searchQuery ? '🔍 没有找到匹配的订阅' : '📭 暂无订阅'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredList.map((sub) => (
          <Card
            key={sub.id}
            type="default"
            onClick={() => onSelect(sub.id)}
            style={{
              padding: '14px 16px',
              background:
                selectedId === sub.id
                  ? isDark
                    ? 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : isDark
                    ? '#1a1a2e'
                    : '#f7fafc',
              borderRadius: '10px',
              cursor: 'pointer',
              border:
                selectedId === sub.id
                  ? '2px solid #e94560'
                  : `1px solid ${isDark ? '#0f3460' : '#e8eaf0'}`,
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                color:
                  selectedId === sub.id
                    ? 'white'
                    : isDark
                      ? '#e2e8f0'
                      : '#1a1a2e',
                fontWeight: selectedId === sub.id ? 'bold' : '600',
                fontSize: '0.95rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {sub.title}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Sidebar