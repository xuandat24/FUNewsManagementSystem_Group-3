import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { editorApi } from '../services/editorApi.js'

const names = {
  DRAFT: 'Bản nháp',
  PENDING_REVIEW: 'Chờ duyệt',
  CHANGES_REQUESTED: 'Cần chỉnh sửa',
  PUBLISHED: 'Đã xuất bản',
  REJECTED: 'Bị từ chối',
}

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      setArticles(await editorApi.list())
      setError('')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const count = (status) => articles.filter(a => (a.workflowStatus || 'PUBLISHED') === status).length
  const pending = articles.filter(a => a.workflowStatus === 'PENDING_REVIEW')
  const cards = [
    { title: 'Tổng bài viết', value: articles.length, color: '#35668d', hint: 'Tất cả trạng thái' },
    { title: 'Chờ duyệt', value: count('PENDING_REVIEW'), color: '#e7a63e', hint: 'Cần Admin xem xét' },
    { title: 'Yêu cầu chỉnh sửa', value: count('CHANGES_REQUESTED'), color: '#de8d63', hint: 'Đang chờ Contributor sửa' },
    { title: 'Đã xuất bản', value: count('PUBLISHED'), color: '#39a47b', hint: 'Đã hoàn thành duyệt' },
  ]

  return <>
    <div className="admin-page-header">
      <div>
        <p className="admin-eyebrow">Admin dashboard</p>
        <h1>Tổng quan hệ thống</h1>
        <p className="admin-page-description">Theo dõi tình trạng bài viết và tiến trình duyệt nội dung.</p>
      </div>
      <Button variant="outline-secondary" onClick={load} disabled={loading}>Làm mới</Button>
    </div>
    {error && <div role="alert" className="alert alert-danger">{error}</div>}
    <div className="admin-stat-grid">
      {cards.map(card => <div className="admin-stat-card" key={card.title} style={{ '--stat-accent': card.color }}>
        <small>{card.title}</small>
        <strong>{loading ? '...' : card.value}</strong>
        <span>{card.hint}</span>
      </div>)}
    </div>
    <div className="admin-dashboard-grid">
      <section className="admin-surface">
        <header className="admin-surface-header"><h2>Bài viết chờ duyệt</h2><Link to="/admin/reviews">Xem tất cả</Link></header>
        {loading ? <div className="admin-empty">Đang tải...</div> : pending.length ?
          <div className="table-responsive"><table className="table admin-table"><thead><tr><th>Tiêu đề</th><th>Tác giả</th><th>Trạng thái</th></tr></thead>
            <tbody>{pending.slice(0, 6).map(a => <tr key={a.id}>
              <td><div className="admin-title-cell">{a.title}</div><div className="admin-subtitle-cell">{a.categoryName || 'Chưa phân loại'}</div></td>
              <td>{a.authorName || 'Không rõ'}</td>
              <td><span className="admin-status-pill pending">Chờ duyệt</span></td>
            </tr>)}</tbody></table></div> : <div className="admin-empty">Không có bài viết nào đang chờ duyệt.</div>}
      </section>
      <section className="admin-surface">
        <header className="admin-surface-header"><h2>Phân bổ trạng thái</h2></header>
        <div style={{ padding: '17px 22px 21px' }}>
          {Object.entries(names).map(([status, name]) => {
            const value = count(status)
            return <div key={status} className="admin-progress-row">
              <span>{name}</span>
              <div className="admin-progress-bar"><span className="admin-progress-fill" style={{ width: `${articles.length ? (value / articles.length) * 100 : 0}%` }} /></div>
              <strong>{value}</strong>
            </div>
          })}
          <p className="text-muted small mt-4 mb-0">Số liệu lấy từ database, không phải dữ liệu giả.</p>
        </div>
      </section>
    </div>
  </>
}
