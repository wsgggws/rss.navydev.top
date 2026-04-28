import { Card } from 'animal-island-ui'
import { ArticleItem } from '../api/subscription'

interface ArticleCardProps {
  article: ArticleItem
  isDark: boolean
  onClick: () => void
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ArticleCard({ article, isDark, onClick }: ArticleCardProps) {
  return (
    <Card
      type="default"
      color={isDark ? 'default' : 'default'}
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        marginBottom: '16px',
        background: isDark ? '#16213e' : '#ffffff',
        borderRadius: '12px',
        cursor: 'pointer',
        border: `1px solid ${isDark ? '#0f3460' : '#e8eaf0'}`,
        transition: 'all 0.2s ease',
        boxShadow: isDark
          ? '0 4px 12px rgba(0,0,0,0.2)'
          : '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div
        style={{
          width: '120px',
          height: '80px',
          background: isDark
            ? 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          flexShrink: 0,
        }}
      >
        📰
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            color: isDark ? '#e2e8f0' : '#1a1a2e',
            marginBottom: '8px',
            fontSize: '1.1rem',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {article.title}
        </h3>
        <p
          style={{
            color: isDark ? '#a2a2a2' : '#718096',
            fontSize: '0.9rem',
            marginBottom: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.5,
          }}
        >
          {article.summary_md?.replace(/[#*`\[\]]/g, '').slice(0, 120) ||
            '暂无摘要'}
        </p>
        <div
          style={{
            color: '#e94560',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📅</span>
          <span>{formatDate(article.published_at)}</span>
          {article.author && (
            <>
              <span style={{ color: isDark ? '#0f3460' : '#e2e8f0' }}>|</span>
              <span>✍️</span>
              <span>{article.author}</span>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ArticleCard