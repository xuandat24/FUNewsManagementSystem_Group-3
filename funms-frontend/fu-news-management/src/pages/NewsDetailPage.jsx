import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { newsApi } from '../services/newsApi.js'

export default function NewsDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    newsApi.getPublic(id).then(data => { if (active) setArticle(data) })
      .catch(err => { if (active) setError(err.message) })
    return () => { active = false }
  }, [id])
  return <main className="container py-4 article-detail">
    <Link to="/">← Trang chủ</Link>
    {error && <p className="alert alert-danger mt-4" role="alert">{error}</p>}
    {!error && !article && <p className="mt-4">Đang tải...</p>}
    {article && <article className="mt-4 bg-white p-4 rounded border">
      <p className="text-primary">{article.categoryName}</p>
      <h1 className="h2">{article.title}</h1>
      <p className="lead">{article.headline}</p>
      <p className="text-muted small">{article.authorName} · {article.createdDate ? new Date(article.createdDate).toLocaleDateString('vi-VN') : ''}</p>
      <hr />
      <p className="article-content">{article.content}</p>
      {article.source && <p className="text-muted">Nguồn: {article.source}</p>}
    </article>}
  </main>
}
