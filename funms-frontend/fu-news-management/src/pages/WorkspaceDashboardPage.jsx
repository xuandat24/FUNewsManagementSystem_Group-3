import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { contributorApi } from '../services/contributorApi.js'
import { editorApi } from '../services/editorApi.js'

const labels = {
  DRAFT: 'Bản nháp',
  PENDING_REVIEW: 'Chờ duyệt',
  CHANGES_REQUESTED: 'Cần chỉnh sửa',
  PUBLISHED: 'Đã xuất bản',
  REJECTED: 'Bị từ chối',
}

export default function WorkspaceDashboardPage({ isAdmin }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = isAdmin ? await editorApi.list() : await contributorApi.list()
      setArticles(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [isAdmin])

  function count(status) {
    return articles.filter(a => (a.workflowStatus || 'PUBLISHED') === status).length
  }

  const cards = [
    { title: 'Tổng bài viết', value: articles.length, color: '#35668d' },
    { title: 'Bản nháp', value: count('DRAFT'), color: '#8895a4' },
    { title: 'Chờ duyệt', value: count('PENDING_REVIEW'), color: '#e7a63e' },
    { title: 'Đã xuất bản', value: count('PUBLISHED'), color: '#39a47b' },
  ]
  const recent = articles.slice(0, 6)

  return <>
    <div className="admin-page-header">
      <div>
        <p className="admin-eyebrow">{isAdmin ? 'Admin' : 'Staff'} Dashboard</p>
        <h1>Tổng quan {isAdmin ? 'hệ thống' : 'bài viết của tôi'}</h1>
        <p className="admin-page-description">Dữ liệu được lấy trực tiếp từ Backend.</p>
      </div>
      <Button variant="outline-secondary" onClick={load} disabled={loading}>Làm mới</Button>
    </div>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    <div className="admin-stat-grid">
      {cards.map(card => <div className="admin-stat-card" key={card.title} style={{ '--stat-accent': card.color }}>
        <small>{card.title}</small><strong>{loading ? '...' : card.value}</strong>
      </div>)}
    </div>
    <section className="admin-surface">
      <header className="admin-surface-header">
        <h2>{isAdmin ? 'Bài viết gần đây' : 'Bài viết của tôi'}</h2>
        <Link to="/workspace/articles">Xem tất cả</Link>
      </header>
      {loading ? <p className="admin-empty">Đang tải...</p> : recent.length ?
        <div className="table-responsive"><table className="table admin-table">
          <thead><tr><th>Tiêu đề</th><th>Danh mục</th><th>Trạng thái</th></tr></thead>
          <tbody>{recent.map(a => <tr key={a.id}>
            <td>{a.title}</td><td>{a.categoryName || 'Chưa chọn'}</td>
            <td>{labels[a.workflowStatus || 'PUBLISHED'] || 'Không rõ'}</td>
          </tr>)}</tbody>
        </table></div>
        : <p className="admin-empty">Chưa có bài viết.</p>}
    </section>
  </>
}
