import { ArticleItem } from '../api/subscription'
import ArticleCard from './ArticleCard'

interface HistoryPanelProps {
  articles: ArticleItem[]
  onClose: () => void
  onArticleClick: (article: ArticleItem) => void
}

function HistoryPanel({ articles, onClose, onArticleClick }: HistoryPanelProps) {
  return (
    <div
      style={{
        maxWidth: '1300px',
        width: '100%',
        padding: '12px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <h2
          style={{
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          history ({articles.length})
        </h2>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            background: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          close
        </button>
      </div>

      {articles.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 40px',
            marginTop: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
            }}
          >
            no history yet
          </div>
        </div>
      ) : (
        articles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => onArticleClick(article)}
            isRead={true}
          />
        ))
      )}
    </div>
  )
}

export default HistoryPanel