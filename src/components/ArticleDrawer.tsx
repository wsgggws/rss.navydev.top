import { Clock3, ExternalLink, Eye, LoaderCircle, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ArticleItem, fetchArticleDetail } from '../api/subscription'
import { formatArticleDate } from '../utils/date'

interface ArticleDrawerProps {
  article: ArticleItem | null
  onClose: () => void
  rssId?: string
  onViewCountUpdate?: (articleId: string, count: number) => void
}

type FrameStatus = 'loading' | 'loaded' | 'unavailable'

function ArticleDrawer({ article, onClose, rssId: rssIdProp, onViewCountUpdate }: ArticleDrawerProps) {
  const [frameStatus, setFrameStatus] = useState<FrameStatus>('loading')
  const [viewCount, setViewCount] = useState(article?.view_count || 0)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    setFrameStatus('loading')
    const timeoutId = window.setTimeout(
      () => setFrameStatus(status => status === 'loading' ? 'unavailable' : status),
      8000,
    )
    return () => window.clearTimeout(timeoutId)
  }, [article?.id, article?.link])

  useEffect(() => {
    if (!article) return
    let active = true
    const articleId = article.id
    const rssId = article.rss_id || rssIdProp || ''

    setViewCount(article.view_count || 0)

    async function recordView() {
      if (!rssId) return
      try {
        const detail = await fetchArticleDetail(rssId, articleId)
        if (active) {
          const count = detail.view_count || 0
          setViewCount(count)
          onViewCountUpdate?.(articleId, count)
        }
      } catch {
        // Loading the source URL does not depend on the visit counter request.
      }
    }

    recordView()
    return () => { active = false }
  }, [article?.id, rssIdProp])

  if (!article) return null

  return (
    <div className="article-drawer-backdrop" onMouseDown={onClose}>
      <div
        className="article-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-drawer-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <header className="drawer-header">
          <span className="drawer-kicker">SOURCE VIEW</span>
          <button type="button" className="icon-button" onClick={onClose} aria-label="关闭文章" title="关闭">
            <X size={21} />
          </button>
        </header>

        <section className="drawer-article">
          <h1 id="article-drawer-title">{article.title}</h1>
          <div className="drawer-meta">
            <span><Clock3 size={15} />{formatArticleDate(article.published_at)}</span>
            {article.author && <span><UserRound size={15} />{article.author}</span>}
            <span><Eye size={15} />{viewCount.toLocaleString()} 次阅读</span>
          </div>
        </section>

        <div className="article-frame-shell">
          {frameStatus === 'loading' && (
            <div className="drawer-loading"><LoaderCircle size={22} className="is-spinning" />正在加载原文</div>
          )}
          {frameStatus === 'unavailable' && (
            <div className="drawer-loading is-unavailable">
              <ExternalLink size={22} />
              <strong>来源网站暂时无法在站内显示</strong>
              <span>请使用下方按钮打开原始页面。</span>
            </div>
          )}
          <iframe
            key={article.id}
            className="article-frame"
            src={article.link}
            title={`${article.title} - 原文`}
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            onLoad={() => setFrameStatus('loaded')}
            onError={() => setFrameStatus('unavailable')}
          />
        </div>

        <footer className="drawer-footer">
          <a className="primary-button" href={article.link} target="_blank" rel="noopener noreferrer">
            阅读原文 <ExternalLink size={17} />
          </a>
        </footer>
      </div>
    </div>
  )
}

export default ArticleDrawer
