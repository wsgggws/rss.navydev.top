import { AlertCircle, Rss, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SubscriptionItem } from '../api/subscription'

interface SidebarProps {
  selectedId: string
  onSelect: (id: string) => void
  subscriptions: SubscriptionItem[]
  isOpen?: boolean
  isMobileOpen?: boolean
  onClose?: () => void
  loading?: boolean
  error?: string
}

function Sidebar({
  selectedId,
  onSelect,
  subscriptions,
  isOpen,
  isMobileOpen,
  onClose,
  loading,
  error,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()
    if (!query) return subscriptions
    return subscriptions.filter(sub => sub.title.toLocaleLowerCase().includes(query))
  }, [searchQuery, subscriptions])

  const sidebarContent = (
    <div className="sidebar-panel">
      <div className="sidebar-heading">
        <div>
          <span className="eyebrow">YOUR FEEDS</span>
          <h2>订阅源</h2>
        </div>
        <span className="sidebar-count">{subscriptions.length}</span>
        <button type="button" className="icon-button sidebar-close" onClick={onClose} aria-label="关闭订阅栏">
          <X size={19} />
        </button>
      </div>

      <label className="search-field sidebar-search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          placeholder="搜索订阅源"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          aria-label="搜索订阅源"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery('')} aria-label="清空搜索">
            <X size={15} />
          </button>
        )}
      </label>

      <nav className="feed-list" aria-label="订阅源列表">
        {loading && Array.from({ length: 6 }, (_, index) => (
          <div className="feed-skeleton" key={index} />
        ))}

        {!loading && error && (
          <div className="sidebar-message is-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filteredList.length === 0 && (
          <div className="sidebar-message">
            <Search size={20} />
            <span>{searchQuery ? '没有匹配的订阅源' : '暂无订阅源'}</span>
          </div>
        )}

        {!loading && !error && filteredList.map(sub => {
          const active = selectedId === sub.id
          return (
            <button
              type="button"
              key={sub.id}
              className={`feed-item ${active ? 'is-active' : ''}`}
              onClick={() => onSelect(sub.id)}
              aria-current={active ? 'page' : undefined}
              title={sub.title}
            >
              <span className="feed-icon"><Rss size={15} /></span>
              <span>{sub.title}</span>
              {active && <span className="active-dot" />}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" />
        <span>内容由订阅源自动更新</span>
      </div>
    </div>
  )

  return (
    <>
      <aside className={`desktop-sidebar ${isOpen ? 'is-open' : ''}`}>{sidebarContent}</aside>
      <aside className={`mobile-sidebar ${isMobileOpen ? 'is-open' : ''}`} aria-hidden={!isMobileOpen}>
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
