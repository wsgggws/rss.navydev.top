import { ArrowLeft, Rss } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="not-found-page">
      <span className="not-found-mark"><Rss size={24} /></span>
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>这篇内容漂走了</h1>
      <p>页面可能已被移动，或者地址有误。回到文章流继续阅读吧。</p>
      <Link className="primary-button" to="/"><ArrowLeft size={17} /> 返回文章流</Link>
    </main>
  )
}

export default NotFound
