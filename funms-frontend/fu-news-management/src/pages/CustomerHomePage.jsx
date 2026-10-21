import { useEffect, useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { newsApi } from '../services/newsApi.js'

export default function CustomerHomePage() {
  const [articles, setArticles] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    newsApi.list(true, keyword).then(data => { if (active) { setArticles(data); setError('') } })
      .catch(err => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [keyword])

  return <main className="container py-4">
    <div className="welcome-banner mb-4"><p className="mb-2">FU NEWS</p><h1 className="h2">Tin tức và thông báo</h1>
      <p className="mb-0">Cập nhật những bài viết mới nhất dành cho sinh viên.</p></div>
    <Form.Control className="mb-4" aria-label="Tìm tin tức" placeholder="Tìm tin tức..." value={keyword} onChange={e => { setLoading(true); setKeyword(e.target.value) }} />
    {error && <p className="alert alert-danger" role="alert">{error}</p>}
    {loading && <p>Đang tải bài viết...</p>}
    {!loading && !error && !articles.length && <p>Chưa có tin tức.</p>}
    <div className="row g-3">
      {articles.map(item => <div className="col-md-6 col-lg-4" key={item.id}>
        <Card className="h-100 shadow-sm news-card"><Card.Body>
          <p className="small text-primary fw-semibold">{item.categoryName}</p>
          <Card.Title>{item.title}</Card.Title><Card.Text className="text-muted">{item.headline}</Card.Text>
          <small className="text-muted">{item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : ''}</small>
          <div className="mt-3"><Link to={`/news/${item.id}`}>Đọc bài viết →</Link></div>
        </Card.Body></Card>
      </div>)}
    </div>
  </main>
}
