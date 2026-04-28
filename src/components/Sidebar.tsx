import { useState } from 'react'
import { Input, Card } from 'animal-island-ui'
import { SubscriptionItem } from '../api/subscription'

interface SidebarProps {
  selectedId: string | null
  onSelect: (id: string) => void
  onShowAll?: () => void
  subscriptions: SubscriptionItem[]
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

function Sidebar({ selectedId, onSelect, onShowAll, subscriptions, isMobileOpen, onMobileClose }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredList = subscriptions.filter((sub) =>
    sub.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sidebarContent = (
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

      {filteredList.length === 0 && (
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

      {onShowAll && (
        <Card
          type="default"
          onClick={() => {
            onShowAll()
            if (onMobileClose) onMobileClose()
          }}
          style={{
            marginBottom: '16px',
            padding: '14px 16px',
            background: selectedId === null
              ? 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)'
              : 'var(--bg-card)',
            borderRadius: '10px',
            cursor: 'pointer',
            border: selectedId === null
              ? '2px solid var(--accent-primary)'
              : '1px solid var(--border-color)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              color: selectedId === null ? 'white' : 'var(--text-primary)',
              fontWeight: selectedId === null ? 'bold' : '600',
              fontSize: '0.95rem',
              textAlign: 'center',
            }}
          >
            查看全部订阅
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredList.map((sub) => (
          <Card
            key={sub.id}
            type="default"
            onClick={() => {
              onSelect(sub.id)
              if (onMobileClose) onMobileClose()
            }}
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

  return (
    <>
      {/* Desktop sidebar - always visible */}
      <div
        className="hide-on-mobile"
        style={{
          width: '280px',
          flexShrink: 0,
        }}
      >
        {sidebarContent}
      </div>

      {/* Mobile drawer - custom implementation */}
      <div
        className="mobile-drawer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100vh',
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 999,
          boxShadow: isMobileOpen ? '4px 0 20px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        {sidebarContent}
      </div>
    </>
  )
}

export default Sidebar