import { useState } from 'react'
import { Input, Button } from 'animal-island-ui'
import { SubscriptionItem } from '../api/subscription'

interface FilterBarProps {
  subscriptions: SubscriptionItem[]
  selectedRssIds: string[]
  searchQuery: string
  startDate: string
  endDate: string
  onRssIdsChange: (ids: string[]) => void
  onSearchChange: (query: string) => void
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onReset: () => void
}

function FilterBar({
  subscriptions,
  selectedRssIds,
  searchQuery,
  startDate,
  endDate,
  onRssIdsChange,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(true)

  const toggleSubscription = (id: string) => {
    if (selectedRssIds.includes(id)) {
      onRssIdsChange(selectedRssIds.filter(rssId => rssId !== id))
    } else {
      onRssIdsChange([...selectedRssIds, id])
    }
  }

  const selectAllSubscriptions = () => {
    onRssIdsChange(subscriptions.map(s => s.id))
  }

  const clearSubscriptions = () => {
    onRssIdsChange([])
  }

  const hasActiveFilters = selectedRssIds.length > 0 || searchQuery || startDate || endDate

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          cursor: 'pointer',
          borderBottom: expanded ? '1px solid var(--border-color)' : 'none',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>🔍</span>
          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
            筛选
          </span>
          {hasActiveFilters && (
            <span
              style={{
                background: 'var(--accent-primary)',
                color: 'white',
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '10px',
              }}
            >
              {selectedRssIds.length + (searchQuery ? 1 : 0) + (startDate ? 1 : 0) + (endDate ? 1 : 0)}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {expanded ? '收起' : '展开'}
        </span>
      </div>

      {expanded && (
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                fontWeight: '600',
              }}
            >
              文章搜索
            </label>
            <Input
              placeholder="搜索文章标题..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              allowClear
              onClear={() => onSearchChange('')}
              size="large"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                fontWeight: '600',
              }}
            >
              <span>订阅源筛选</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    selectAllSubscriptions()
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  全选
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    clearSubscriptions()
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  清空
                </button>
              </div>
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                maxHeight: '120px',
                overflowY: 'auto',
                padding: '8px',
                background: 'var(--bg-primary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
              }}
            >
              {subscriptions.map(sub => (
                <button
                  key={sub.id}
                  onClick={e => {
                    e.stopPropagation()
                    toggleSubscription(sub.id)
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: selectedRssIds.includes(sub.id)
                      ? '2px solid var(--accent-primary)'
                      : '1px solid var(--border-color)',
                    background: selectedRssIds.includes(sub.id)
                      ? 'var(--accent-primary)'
                      : 'var(--bg-card)',
                    color: selectedRssIds.includes(sub.id)
                      ? 'white'
                      : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {sub.title}
                </button>
              ))}
            </div>
            {selectedRssIds.length > 0 && (
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                }}
              >
                已选择 {selectedRssIds.length} 个订阅源
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                fontWeight: '600',
              }}
            >
              日期范围
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="date"
                value={startDate}
                onChange={e => onStartDateChange(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>至</span>
              <input
                type="date"
                value={endDate}
                onChange={e => onEndDateChange(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              onClick={onReset}
              style={{
                width: '100%',
                marginTop: '8px',
              }}
            >
              重置筛选
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterBar