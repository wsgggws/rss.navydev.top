import { ArrowUpRight, Clock3, Eye, FileText, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ArticleItem } from '../api/subscription'
import { formatArticleDate } from '../utils/date'

interface ArticleCardProps {
  article: ArticleItem
  onClick: () => void
  isRead?: boolean
  visitCount?: number
}

function cleanSummary(value?: string) {
  return value
    ?.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/[#*`>\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function ArticleCard({ article, onClick, isRead = false, visitCount = 0 }: ArticleCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const summary = cleanSummary(article.summary_md)

  useEffect(() => setImageFailed(false), [article.image_url])

  return (
    <button
      type="button"
      onClick={onClick}
      className={`article-card ${isRead ? 'is-read' : 'is-unread'}`}
      aria-label={`阅读：${article.title}`}
    >
      <span className="article-card-body">
        <span className="article-title-row">
          {!isRead && <span className="unread-indicator" aria-label="未读" />}
          <span className="article-card-title">{article.title}</span>
        </span>

        {summary && <span className="article-summary">{summary}</span>}

        <span className="article-meta">
          <span><Clock3 size={14} />{formatArticleDate(article.published_at, { relative: true })}</span>
          {article.author && <span><UserRound size={14} />{article.author}</span>}
          {visitCount > 0 && <span><Eye size={14} />{visitCount.toLocaleString()} 次阅读</span>}
          <span className="read-more">阅读全文 <ArrowUpRight size={14} /></span>
        </span>
      </span>

      <span className="article-thumbnail" aria-hidden="true">
        {article.image_url && !imageFailed ? (
          <img src={article.image_url} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <FileText size={24} />
        )}
      </span>
    </button>
  )
}

export default ArticleCard
