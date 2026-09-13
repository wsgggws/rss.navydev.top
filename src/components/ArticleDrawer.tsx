import DOMPurify from 'dompurify'
import { ArrowUp, Clock3, ExternalLink, Eye, LoaderCircle, UserRound, X } from 'lucide-react'
import { marked } from 'marked'
import { useEffect, useRef, useState } from 'react'
import { ArticleItem, fetchArticleDetail } from '../api/subscription'
import { formatArticleDate } from '../utils/date'

interface ArticleDrawerProps {
  article: ArticleItem | null
  onClose: () => void
  rssId?: string
  onViewCountUpdate?: (articleId: string, count: number) => void
}

function removeRepeatedArticleTitle(html: string, articleTitle: string) {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const firstElement = parsed.body.firstElementChild
  const normalizeText = (value: string | null) => value?.replace(/\s+/g, ' ').trim().toLocaleLowerCase()

  if (
    firstElement
    && ['H1', 'H2'].includes(firstElement.tagName)
    && normalizeText(firstElement.textContent) === normalizeText(articleTitle)
  ) {
    firstElement.remove()
  }

  return parsed.body.innerHTML
}

function ArticleDrawer({ article, onClose, rssId: rssIdProp, onViewCountUpdate }: ArticleDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [htmlContent, setHtmlContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewCount, setViewCount] = useState(article?.view_count || 0)
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(article?.image_url)
  const [imageFailed, setImageFailed] = useState(false)

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
    if (!article) return
    let active = true
    const articleId = article.id
    const articleTitle = article.title
    const rssId = article.rss_id || rssIdProp || ''

    setViewCount(article.view_count || 0)
    setImageUrl(article.image_url)
    setImageFailed(false)
    setLoading(true)
    setHtmlContent('')

    async function loadContent() {
      try {
        let content = article?.summary_md
        let nextImageUrl = article?.image_url

        if (rssId) {
          try {
            const detail = await fetchArticleDetail(rssId, articleId)
            content = detail.summary_md || content
            nextImageUrl = detail.image_url || nextImageUrl
            if (active) {
              const count = detail.view_count || 0
              setViewCount(count)
              setImageUrl(nextImageUrl)
              onViewCountUpdate?.(articleId, count)
            }
          } catch {
            // The list payload is still enough to open the original article.
          }
        }

        if (!active) return
        if (!content) {
          setHtmlContent('<p>该订阅源没有提供正文摘要，可点击下方按钮阅读原文。</p>')
          return
        }

        const parsed = await marked.parse(content)
        const sanitized = DOMPurify.sanitize(String(parsed))
        if (active) setHtmlContent(removeRepeatedArticleTitle(sanitized, articleTitle))
      } catch {
        if (active) setHtmlContent('<p>正文解析失败，请前往原文阅读。</p>')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadContent()
    return () => { active = false }
  }, [article?.id, rssIdProp])

  if (!article) return null

  return (
    <div className="article-drawer-backdrop" onMouseDown={onClose}>
      <div
        ref={panelRef}
        className="article-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-drawer-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <header className="drawer-header">
          <span className="drawer-kicker">READING VIEW</span>
          <button type="button" className="icon-button" onClick={onClose} aria-label="关闭文章" title="关闭">
            <X size={21} />
          </button>
        </header>

        <article className="drawer-article">
          <h1 id="article-drawer-title">{article.title}</h1>
          <div className="drawer-meta">
            <span><Clock3 size={15} />{formatArticleDate(article.published_at)}</span>
            {article.author && <span><UserRound size={15} />{article.author}</span>}
            <span><Eye size={15} />{viewCount.toLocaleString()} 次阅读</span>
          </div>

          {imageUrl && !imageFailed && (
            <img className="drawer-cover" src={imageUrl} alt="" onError={() => setImageFailed(true)} />
          )}

          {loading ? (
            <div className="drawer-loading"><LoaderCircle size={22} className="is-spinning" />正在加载正文</div>
          ) : (
            <div className="article-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </article>

        <footer className="drawer-footer">
          <button type="button" className="secondary-button" onClick={() => panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ArrowUp size={17} /> 返回顶部
          </button>
          <a className="primary-button" href={article.link} target="_blank" rel="noopener noreferrer">
            阅读原文 <ExternalLink size={17} />
          </a>
        </footer>
      </div>
    </div>
  )
}

export default ArticleDrawer
