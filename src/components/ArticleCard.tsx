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
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        marginBottom: '16px',
        background: isDark ? '#1a1a2e' : '#ffffff',
        borderRadius: '12px',
        cursor: 'pointer',
        border: `1px solid ${isDark ? '#0f3460' : '#e2e8f0'}`,
      }}
    >
      <div
        style={{
          width: '120px',
          height: '80px',
          background: isDark ? '#0f3460' : '#667eea',
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
            color: isDark ? '#e2e8f0' : '#2d3748',
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
          }}
        >
          {article.summary_md?.replace(/[#*`]/g, '').slice(0, 100) ||
            '暂无摘要'}
        </p>
        <div
          style={{
            color: isDark ? '#e94560' : '#667eea',
            fontSize: '0.8rem',
          }}
        >
          {formatDate(article.published_at)}
          {article.author && ` · ${article.author}`}
        </div>
      </div>
    </Card>
  )
}

export default ArticleCard