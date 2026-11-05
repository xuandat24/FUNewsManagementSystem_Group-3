import { useEffect, useMemo, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { editorApi } from '../services/editorApi.js'

const labels = {
  DRAFT: 'Bản nháp',
  PENDING_REVIEW: 'Chờ duyệt',
  CHANGES_REQUESTED: 'Cần chỉnh sửa',
  PUBLISHED: 'Đã xuất bản',
  REJECTED: 'Bị từ chối',
}
const classes = { DRAFT: 'draft', PENDING_REVIEW: 'pending', CHANGES_REQUESTED: 'changes', PUBLISHED: 'published', REJECTED: 'rejected' }
const dateText = (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '—'

export default function AdminReviewPage() {
  const [articles, setArticles] = useState([])
  const [status, setStatus] = useState('PENDING_REVIEW')
  const [keyword, setKeyword] = useState('')
  const [selected, setSelected] = useState(null)
  const [action, setAction] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [modalError, setModalError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try { setArticles(await editorApi.list()); setError('') }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // Refresh queue every 30 seconds to see new Contributor submissions.
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        editorApi.list().then(setArticles).catch(() => {})
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const counts = {
    PENDING_REVIEW: articles.filter(a => a.workflowStatus === 'PENDING_REVIEW').length,
    CHANGES_REQUESTED: articles.filter(a => a.workflowStatus === 'CHANGES_REQUESTED').length,
    PUBLISHED: articles.filter(a => (a.workflowStatus || 'PUBLISHED') === 'PUBLISHED').length,
    REJECTED: articles.filter(a => a.workflowStatus === 'REJECTED').length,
  }

  const filtered = useMemo(() => articles.filter(article => {
    const current = article.workflowStatus || 'PUBLISHED'
    if (current === 'DRAFT') return false // Drafts have not been submitted to Admin.
    if (status !== 'ALL' && current !== status) return false
    const search = keyword.trim().toLowerCase()
    return !search || `${article.title} ${article.headline} ${article.authorName} ${article.categoryName}`
      .toLowerCase().includes(search)
  }), [articles, status, keyword])

  function open(article) {
    setSelected(article)
    setAction('')
    setFeedback('')
    setModalError('')
  }

  async function decide(type) {
    if (!selected || saving) return
    if (type === 'approve' && !window.confirm(`Xuất bản bài viết "${selected.title}"?`)) return
    if (type !== 'approve' && !feedback.trim()) {
      setModalError('Vui lòng nhập nội dung phản hồi trước khi xác nhận.')
      return
    }
    setSaving(true)
    setModalError('')
    try {
      if (type === 'approve') await editorApi.approve(selected.id)
      if (type === 'changes') await editorApi.requestChanges(selected.id, feedback.trim())
      if (type === 'reject') await editorApi.reject(selected.id, feedback.trim())
      setSelected(null)
      setNotice(type === 'approve' ? 'Đã duyệt và xuất bản bài viết.'
        : type === 'changes' ? 'Đã gửi yêu cầu chỉnh sửa cho Contributor.'
          : 'Đã từ chối bài viết.')
      await load()
    } catch (err) { setModalError(err.message) }
    finally { setSaving(false) }
  }

  return <>
    <div className="admin-page-header">
      <div>
        <p className="admin-eyebrow">Editorial workflow</p>
        <h1>Duyệt bài viết</h1>
        <p className="admin-page-description">Kiểm tra nội dung, phản hồi cho tác giả và quyết định xuất bản.</p>
      </div>
      <Button variant="outline-secondary" onClick={load} disabled={loading}>Làm mới</Button>
    </div>
    <div className="admin-stat-grid">
      {[
        ['Chờ duyệt', counts.PENDING_REVIEW, '#e6a83d'],
        ['Yêu cầu sửa', counts.CHANGES_REQUESTED, '#dd916a'],
        ['Đã xuất bản', counts.PUBLISHED, '#39a47b'],
        ['Bị từ chối', counts.REJECTED, '#c55e65'],
      ].map(([label, total, accent]) => <div className="admin-stat-card" key={label} style={{ '--stat-accent': accent }}>
        <small>{label}</small><strong>{loading ? '...' : total}</strong><span>Trong hệ thống</span>
      </div>)}
    </div>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {notice && <div className="alert alert-success" role="status">{notice}</div>}
    <section className="admin-surface">
      <div className="admin-surface-header">
        <h2>Danh sách bài viết</h2>
        <span className="text-muted small">Tự cập nhật mỗi 30 giây</span>
      </div>
      <div className="admin-filter-panel">
        <div style={{ flex: '1 1 250px' }}>
          <label htmlFor="review-search">Tìm kiếm</label>
          <Form.Control id="review-search" placeholder="Tên bài viết, tác giả..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>
        <div style={{ flex: '0 1 240px' }}>
          <label htmlFor="review-status">Trạng thái</label>
          <Form.Select id="review-status" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="PENDING_REVIEW">Chờ duyệt</option>
            <option value="CHANGES_REQUESTED">Yêu cầu sửa</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="REJECTED">Bị từ chối</option>
            <option value="ALL">Tất cả bài đã gửi</option>
          </Form.Select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table admin-table">
          <thead><tr><th>Bài viết</th><th>Tác giả</th><th>Danh mục</th><th>Ngày tạo</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {filtered.map(a => <tr key={a.id}>
              <td><p className="admin-title-cell">{a.title}</p><p className="admin-subtitle-cell">{a.headline}</p></td>
              <td>{a.authorName || 'Không rõ'}</td>
              <td>{a.categoryName || '—'}</td>
              <td>{dateText(a.createdDate)}</td>
              <td><span className={`admin-status-pill ${classes[a.workflowStatus || 'PUBLISHED'] || 'draft'}`}>{labels[a.workflowStatus || 'PUBLISHED'] || '—'}</span></td>
              <td className="admin-table-actions"><Button size="sm" variant="outline-primary" onClick={() => open(a)}>{a.workflowStatus === 'PENDING_REVIEW' ? 'Xem / Duyệt' : 'Xem lại'}</Button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {loading && <div className="admin-empty">Đang tải bài viết...</div>}
      {!loading && filtered.length === 0 && <div className="admin-empty">Không có bài viết phù hợp.</div>}
    </section>

    <Modal show={Boolean(selected)} onHide={() => !saving && setSelected(null)} size="lg" centered scrollable>
      <Modal.Header closeButton={!saving}><Modal.Title>Chi tiết bài viết</Modal.Title></Modal.Header>
      {selected && <>
        <Modal.Body>
          <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
            <span className={`admin-status-pill ${classes[selected.workflowStatus || 'PUBLISHED'] || 'draft'}`}>
              {labels[selected.workflowStatus || 'PUBLISHED'] || 'Không rõ'}
            </span><span className="text-muted small"># {selected.id}</span>
          </div>
          <h3 className="h4 fw-bold mt-3">{selected.title}</h3>
          <p className="text-muted">{selected.headline || 'Chưa có tóm tắt'}</p>
          <div className="admin-detail-meta">
            <div><small>Tác giả</small><strong>{selected.authorName || 'Không rõ'}</strong></div>
            <div><small>Danh mục</small><strong>{selected.categoryName || '—'}</strong></div>
            <div><small>Ngày tạo</small><strong>{dateText(selected.createdDate)}</strong></div>
            <div><small>Nguồn</small><strong>{selected.source || '—'}</strong></div>
          </div>
          {selected.tagIds?.length > 0 && <p className="small text-muted">Tag ID: {selected.tagIds.map(id => `#${id}`).join(', ')}</p>}
          <h4 className="h6 fw-bold">Nội dung bài viết</h4>
          <div className="admin-review-content">{selected.content || 'Chưa có nội dung'}</div>
          {selected.reviewFeedback && <div className="alert alert-light border mt-3"><strong>Phản hồi trước:</strong> {selected.reviewFeedback}</div>}
          {selected.workflowStatus === 'PENDING_REVIEW' && action && <Form.Group className="mt-4">
            <Form.Label className="fw-bold">{action === 'changes' ? 'Yêu cầu tác giả chỉnh sửa' : 'Lý do từ chối'} *</Form.Label>
            <Form.Control as="textarea" rows={4} maxLength={2000} placeholder="Nhập phản hồi rõ ràng cho Contributor..." value={feedback} onChange={e => setFeedback(e.target.value)} />
          </Form.Group>}
          {modalError && <div role="alert" className="alert alert-danger mt-3 mb-0">{modalError}</div>}
        </Modal.Body>
        <Modal.Footer className="d-flex flex-wrap gap-2">
          <Button variant="outline-secondary" disabled={saving} onClick={() => setSelected(null)}>Đóng</Button>
          {selected.workflowStatus === 'PENDING_REVIEW' && <>
            <Button variant="outline-warning" disabled={saving} onClick={() => { setAction('changes'); setModalError('') }}>Yêu cầu sửa</Button>
            <Button variant="outline-danger" disabled={saving} onClick={() => { setAction('reject'); setModalError('') }}>Từ chối</Button>
            {action && <Button variant="outline-secondary" disabled={saving} onClick={() => { setAction(''); setFeedback(''); setModalError('') }}>Hủy phản hồi</Button>}
            {action ? <Button disabled={saving} variant={action === 'reject' ? 'danger' : 'warning'} onClick={() => decide(action)}>
              {saving ? 'Đang xử lý...' : action === 'reject' ? 'Xác nhận từ chối' : 'Gửi phản hồi'}
            </Button> : <Button disabled={saving} className="admin-primary-button" onClick={() => decide('approve')}>Duyệt & xuất bản</Button>}
          </>}
        </Modal.Footer>
      </>}
    </Modal>
  </>
}
