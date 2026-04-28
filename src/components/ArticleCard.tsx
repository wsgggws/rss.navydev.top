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
        padding: '16px',
        marginBottom: '8px',
        background: 'var(--bg-card)',
        cursor: 'pointer',
        border: '1px solid var(--border-color)',
      }}
    >
      <div
        className="article-card-image"
        style={{
          width: '80px',
          height: '60px',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: '1.5rem',
          flexShrink: 0,
        }}
      >
        R
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            color: 'var(--text-primary)',
            marginBottom: '6px',
            fontSize: '1rem',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {article.title}
        </h3>
        {article.summary_md && (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              marginBottom: '6px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.5,
            }}
          >
            {article.summary_md.replace(/[#*`\[\]]/g, '').slice(0, 100)}
          </p>
        )}
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{formatDate(article.published_at)}</span>
          {article.author && (
            <>
              <span>|</span>
              <span>{article.author}</span>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ArticleCard
