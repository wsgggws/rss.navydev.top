import { ArrowLeft, History, Trash2 } from 'lucide-react'
import { ArticleItem } from '../api/subscription'
import ArticleCard from './ArticleCard'

interface HistoryPanelProps {
  articles: ArticleItem[]
  onClose: () => void
  onClear: () => void
  onArticleClick: (article: ArticleItem) => void
  visitCounts: Record<string, number>
}

function HistoryPanel({ articles, onClose, onClear, onArticleClick, visitCounts }: HistoryPanelProps) {
  return (
    <section className="content-container">
      <div className="content-heading history-heading">
        <div>
          <span className="eyebrow">RECENTLY READ</span>
          <h1>阅读记录</h1>
          <p>最近打开过的 {articles.length} 篇文章，仅保存在当前浏览器。</p>
        </div>
        <div className="history-actions">
          {articles.length > 0 && (
            <button type="button" className="secondary-button danger-button" onClick={onClear}>
              <Trash2 size={16} /> 清空
            </button>
          )}
          <button type="button" className="secondary-button" onClick={onClose}>
            <ArrowLeft size={17} /> 返回文章流
          </button>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state inline-state">
          <span className="state-icon"><History size={24} /></span>
          <h2>还没有阅读记录</h2>
          <p>打开文章后，它会出现在这里。</p>
          <button type="button" className="primary-button" onClick={onClose}>浏览文章</button>
        </div>
      ) : (
        <div className="article-list history-list">
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => onArticleClick(article)}
              isRead
              visitCount={visitCounts[article.id] || article.view_count || 0}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HistoryPanel
