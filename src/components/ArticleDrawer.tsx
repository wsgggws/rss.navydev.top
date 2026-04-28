import { useEffect, useState } from 'react'
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
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '50%',
      minWidth: '400px',
      height: '100vh',
      background: isDark ? '#16213e' : '#ffffff',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      transform: article ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: `1px solid ${isDark ? '#0f3460' : '#e2e8f0'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: isDark ? '#1a1a2e' : '#f7fafc',
      }}>
        <h2 style={{
          color: isDark ? '#e94560' : '#667eea',
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}>
          文章详情
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: isDark ? '#a2a2a2' : '#718096',
            cursor: 'pointer',
            fontSize: '1.5rem',
            padding: '4px 8px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
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
            <h1 style={{
              color: isDark ? '#e2e8f0' : '#2d3748',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              lineHeight: 1.3,
            }}>
              {displayArticle.title}
            </h1>

            <div style={{
              color: isDark ? '#a2a2a2' : '#718096',
              fontSize: '0.9rem',
              marginBottom: '24px',
              display: 'flex',
              gap: '16px',
            }}>
              <span>📅 {formatDate(displayArticle.published_at)}</span>
              {displayArticle.author && <span>✍️ {displayArticle.author}</span>}
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
                  .replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">$1</code>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/\n/g, '<br/>')
              }}
            />
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: `1px solid ${isDark ? '#0f3460' : '#e2e8f0'}`,
        display: 'flex',
        gap: '12px',
        background: isDark ? '#1a1a2e' : '#f7fafc',
      }}>
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
    </div>
  )
}

export default ArticleDrawer