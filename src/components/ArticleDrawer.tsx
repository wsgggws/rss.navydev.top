import { useRef, useState, useEffect } from 'react'
import { ArticleItem, fetchArticleDetail } from '../api/subscription'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

interface ArticleDrawerProps {
  article: ArticleItem | null
  onClose: () => void
}

function ArticleDrawer({ article, onClose }: ArticleDrawerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [htmlContent, setHtmlContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  useEffect(() => {
    if (!article) return

    const articleId = article.id
    const rssId = article.rss_id || ''
    const summaryMd = article.summary_md

    setLoading(true)
    setHtmlContent('')

    async function loadContent() {
      try {
        let content = summaryMd
        if (!content && rssId) {
          const detail = await fetchArticleDetail(rssId, articleId)
          content = detail.summary_md
        }
        if (content) {
          const result = marked.parse(content)
          if (typeof result === 'string') {
            setHtmlContent(DOMPurify.sanitize(result))
          } else {
            result.then(html => {
              setHtmlContent(DOMPurify.sanitize(String(html)))
            })
          }
        }
      } catch (err) {
        setHtmlContent('<p>Failed to load article</p>')
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [article?.id, article?.rss_id, article?.summary_md])

  if (!article) return null

  function formatDate(dateString: string) {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  function scrollToTop() {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <div className="article-drawer-modal" onClick={onClose}>
      <div ref={contentRef} style={{ maxHeight: '100vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <>
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span>{formatDate(article.published_at)}</span>
            {article.author && (
              <span>{article.author}</span>
            )}
          </div>

          {loading && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>loading...</div>}

          {!loading && htmlContent && (
            <div
              className="article-content"
              style={{
                color: 'var(--text-primary)',
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{
                __html: htmlContent,
              }}
            />
          )}
          <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '10px',
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              → read original
            </a>
            <button
              onClick={scrollToTop}
              style={{
                padding: '10px 16px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
            >
              ↑ top
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 16px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
            >
              × close
            </button>
          </div>
        </>
      </div>
    </div>
  )
}

export default ArticleDrawer