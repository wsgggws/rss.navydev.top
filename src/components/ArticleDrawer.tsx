import { useEffect, useState, useRef } from 'react'
import { Modal } from 'animal-island-ui'
import { fetchArticleDetail, ArticleItem } from '../api/subscription'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

interface ArticleDrawerProps {
  rssId: string
  article: ArticleItem | null
  onClose: () => void
}

function ArticleDrawer({ rssId, article, onClose }: ArticleDrawerProps) {
  const [detail, setDetail] = useState<ArticleItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!article) return

    const articleId = article.id
    let cancelled = false
    async function loadDetail() {
      try {
        setLoading(true)
        const data = await fetchArticleDetail(rssId, articleId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'load failed')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDetail()
    return () => { cancelled = true }
  }, [article?.id, rssId])

  if (!article) return null

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  function scrollToTop() {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const displayArticle = detail || article

  return (
    <Modal
      open={!!article}
      onClose={onClose}
      title="article"
      footer={null}
      width="60%"
      maskClosable
      closable
      className="article-drawer-modal"
    >
      <div ref={contentRef} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            loading...
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--text-primary)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {!loading && !error && displayArticle && (
          <>
            <h1
              style={{
                color: 'var(--text-primary)',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                marginBottom: '12px',
                lineHeight: 1.3,
              }}
            >
              {displayArticle.title}
            </h1>

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
              <span>{formatDate(displayArticle.published_at)}</span>
              {displayArticle.author && (
                <span>{displayArticle.author}</span>
              )}
            </div>

            <div
              className="article-content"
              style={{
                color: 'var(--text-primary)',
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  String(marked.parse(displayArticle.summary_md || 'no content'))
                ),
              }}
            />
            <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
              <a
                href={displayArticle?.link}
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
                read original
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
                top
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
                close
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default ArticleDrawer
