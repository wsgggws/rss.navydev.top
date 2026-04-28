import { useState, useEffect } from 'react'
import { Input, Card } from 'animal-island-ui'
import { getAllSubscriptions, SubscriptionItem } from '../api/subscription'

interface SidebarProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

function Sidebar({ selectedId, onSelect }: SidebarProps) {
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
        background: 'var(--bg-secondary)',
        padding: '20px',
        borderRight: '1px solid var(--border-color)',
        minHeight: '100%',
        overflowY: 'auto',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <h2
        style={{
          color: 'var(--accent-primary)',
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
            color: 'var(--text-secondary)',
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
            color: 'var(--accent-primary)',
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
            color: 'var(--text-secondary)',
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
                  ? 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)'
                  : 'var(--bg-card)',
              borderRadius: '10px',
              cursor: 'pointer',
              border:
                selectedId === sub.id
                  ? '2px solid var(--accent-primary)'
                  : '1px solid var(--border-color)',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                color:
                  selectedId === sub.id
                    ? 'white'
                    : 'var(--text-primary)',
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