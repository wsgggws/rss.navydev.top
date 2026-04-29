import { useState } from 'react'
import { SubscriptionItem } from '../api/subscription'

interface SidebarProps {
  selectedId: string
  onSelect: (id: string) => void
  subscriptions: SubscriptionItem[]
  isOpen?: boolean
  isMobileOpen?: boolean
}

function Sidebar({ selectedId, onSelect, subscriptions, isOpen, isMobileOpen }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredList = subscriptions.filter((sub) =>
    sub.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sidebarContent = (
    <div
      style={{
        width: '320px',
        background: 'var(--bg-secondary)',
        padding: '16px',
        borderRight: '1px solid var(--border-color)',
        minHeight: '100%',
        overflowY: 'auto',
      }}
    >
      <input
        type="text"
        placeholder="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: '16px',
          width: '100%',
          padding: '10px 14px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          outline: 'none',
          borderRadius: '0',
        }}
      />

      {filteredList.length === 0 && (
        <div
          style={{
            color: 'var(--text-secondary)',
            textAlign: 'center',
            padding: '40px 20px',
          }}
        >
          {searchQuery ? 'no match' : 'no subscriptions'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {filteredList.map((sub) => (
          <div
            key={sub.id}
            onClick={() => {
              onSelect(sub.id)
            }}
            style={{
              padding: '12px',
              background: selectedId === sub.id ? 'var(--bg-card)' : 'transparent',
              border: selectedId === sub.id ? '1px solid var(--border-color)' : '1px solid transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {sub.title}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div
        className="hide-on-mobile"
        style={{
          width: '320px',
          flexShrink: 0,
          display: isOpen ? 'block' : 'none',
        }}
      >
        {sidebarContent}
      </div>

      <div
        className="mobile-drawer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '100vh',
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.2s ease-in-out',
          zIndex: 999,
        }}
      >
        {sidebarContent}
      </div>
    </>
  )
}

export default Sidebar
