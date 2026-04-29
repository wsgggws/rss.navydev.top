import { useRef, useState, useEffect } from 'react'
import { ArticleItem } from '../api/subscription'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

interface ArticleDrawerProps {
  article: ArticleItem | null
  onClose: () => void
}

function ArticleDrawer({ article, onClose }: ArticleDrawerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [htmlContent, setHtmlContent] = useState('')

  if (!article) return null

  useEffect(() => {
    if (!article?.summary_md) {
      setHtmlContent('')
      return
    }
    const summaryMd = article.summary_md
    const result = marked.parse(summaryMd)
    if (typeof result === 'string') {
      setHtmlContent(DOMPurify.sanitize(result))
    } else {
      result.then(html => {
        setHtmlContent(DOMPurify.sanitize(String(html)))
      })
    }
  }, [article?.id])

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
    <div className="article-drawer-modal">
      <div ref={contentRef} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
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
