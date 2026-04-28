import { Card } from 'animal-island-ui'
import { ArticleItem } from '../api/subscription'

interface ArticleCardProps {
  article: ArticleItem
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

function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <Card
      type="default"
      onClick={onClick}
      className="article-card"
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        marginBottom: '16px',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        cursor: 'pointer',
        border: '1px solid var(--border-color)',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px var(--shadow)',
      }}
    >
      <div
        className="article-card-image"
        style={{
          width: '120px',
          height: '80px',
          background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
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
            color: 'var(--text-primary)',
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
            color: 'var(--text-secondary)',
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
            color: 'var(--accent-primary)',
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
              <span style={{ color: 'var(--text-secondary)' }}>|</span>
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