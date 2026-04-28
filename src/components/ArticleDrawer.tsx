import { useEffect, useState } from 'react'
import { Modal } from 'animal-island-ui'
import { fetchArticleDetail, ArticleItem } from '../api/subscription'

interface ArticleDrawerProps {
  rssId: string
  article: ArticleItem | null
  isDark: boolean
  onClose: () => void
}

function ArticleDrawer({ rssId, article, isDark, onClose }: ArticleDrawerProps) {
  const [detail, setDetail] = useState<ArticleItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (article) {
      fetchDetail()
    }
  }, [article?.id])

  async function fetchDetail() {
    if (!article) return
    try {
      setLoading(true)
      const data = await fetchArticleDetail(rssId, article.id)
      setDetail(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  if (!article) return null

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const displayArticle = detail || article

  return (
    <Modal
      open={!!article}
      onClose={onClose}
      title="文章详情"
      footer={null}
      width="60%"
      maskClosable
      closable
    >
      {loading && (
        <div style={{ textAlign: 'center', color: isDark ? '#a2a2a2' : '#718096' }}>
          加载中...
        </div>
      )}

      {error && (
        <div style={{ color: '#e94560', textAlign: 'center' }}>{error}</div>
      )}

      {!loading && !error && displayArticle && (
        <>
          <h1
            style={{
              color: isDark ? '#e2e8f0' : '#2d3748',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              lineHeight: 1.3,
            }}
          >
            {displayArticle.title}
          </h1>

          <div
            style={{
              color: isDark ? '#a2a2a2' : '#718096',
              fontSize: '0.9rem',
              marginBottom: '24px',
              display: 'flex',
              gap: '16px',
            }}
          >
            <span>📅 {formatDate(displayArticle.published_at)}</span>
            {displayArticle.author && (
              <span>✍️ {displayArticle.author}</span>
            )}
          </div>

          <div
            style={{
              color: isDark ? '#e2e8f0' : '#2d3748',
              lineHeight: 1.8,
            }}
            dangerouslySetInnerHTML={{
              __html: (displayArticle.summary_md || '')
                .replace(/^# .*/gm, '')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(
                  /`([^`]+)`/g,
                  '<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">$1</code>'
                )
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br/>'),
            }}
          />
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <a
              href={displayArticle?.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '12px',
                background: '#e94560',
                color: 'white',
                textAlign: 'center',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              🔗 阅读原文
            </a>
            <button
              onClick={scrollToTop}
              style={{
                padding: '12px 24px',
                background: isDark ? '#0f3460' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ⬆️ 返回顶部
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default ArticleDrawer