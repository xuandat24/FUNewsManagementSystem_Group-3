import { useEffect, useState } from 'react'
import { Badge, Button, Table } from 'react-bootstrap'
import ContributorArticleForm from '../components/ContributorArticleForm.jsx'
import { contributorApi } from '../services/contributorApi.js'
import { newsApi } from '../services/newsApi.js'

const statusLabels = {
  DRAFT: 'Bản nháp',
  PENDING_REVIEW: 'Đang chờ duyệt',
  CHANGES_REQUESTED: 'Cần chỉnh sửa',
  PUBLISHED: 'Đã xuất bản',
  REJECTED: 'Bị từ chối',
}
const statusColors = {
  DRAFT: 'secondary',
  PENDING_REVIEW: 'warning',
  CHANGES_REQUESTED: 'danger',
  PUBLISHED: 'success',
  REJECTED: 'danger',
}

export default function MyArticlesPage() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [editing, setEditing] = useState(undefined) // undefined: closed, null: new
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState(null)

  useEffect(() => {
    let active = true
    Promise.all([contributorApi.list(), newsApi.categories(), newsApi.tags()])
      .then(([items, categories, tags]) => {
        if (!active) return
        setArticles(items)
        setCategories(categories)
        setTags(tags)
      })
      .catch(err => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function reload() {
    setArticles(await contributorApi.list())
  }

  async function saveDraft(body) {
    if (editing) await contributorApi.update(editing.id, body)
    else await contributorApi.create(body)
    setEditing(undefined)
    setError('')
    setNotice('Đã lưu bài viết thành công.')
    await reload()
  }

  async function submit(article) {
    if (!window.confirm(`Gửi bài "${article.title}" để Editor duyệt?`)) return
    setError('')
    setNotice('')
    setSendingId(article.id)
    try {
      await contributorApi.submit(article.id)
      setNotice('Đã gửi bài viết để duyệt.')
      await reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSendingId(null)
    }
  }


  return <main className="container py-4">
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
      <div>
        <h1 className="h3 mb-1">My Articles / My Drafts</h1>
        <p className="text-muted mb-0">Tạo nháp, nhận góp ý và gửi duyệt. Contributor không thể tự xuất bản.</p>
      </div>
      <Button onClick={() => setEditing(null)}>+ Tạo bản nháp</Button>
    </div>

    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {notice && <div className="alert alert-success" role="status">{notice}</div>}
    <div className="table-responsive bg-white rounded border">
      <Table hover className="mb-0 align-middle">
        <thead className="table-light"><tr>
          <th>Tiêu đề</th><th>Danh mục</th><th>Trạng thái</th><th>Góp ý của Editor</th><th>Thao tác</th>
        </tr></thead>
        <tbody>
          {articles.map(article => {
            const editable = article.workflowStatus === 'DRAFT'
              || article.workflowStatus === 'CHANGES_REQUESTED'
            return <tr key={article.id}>
              <td><strong>{article.title}</strong><div className="small text-muted">{article.headline}</div></td>
              <td>{article.categoryName || 'Chưa chọn'}</td>
              <td><Badge bg={statusColors[article.workflowStatus] || 'secondary'}>
                {statusLabels[article.workflowStatus] || article.workflowStatus}
              </Badge></td>
              <td>{article.reviewFeedback
                ? <span className="text-danger">{article.reviewFeedback}</span>
                : <span className="text-muted">—</span>}</td>
              <td className="text-nowrap">
                {editable ? <>
                  <Button size="sm" variant="outline-primary" onClick={() => setEditing(article)}>Sửa</Button>{' '}
                  <Button size="sm" disabled={sendingId === article.id} onClick={() => submit(article)}>
                    {article.workflowStatus === 'CHANGES_REQUESTED' ? 'Revise & Resubmit' : 'Submit for Review'}
                  </Button>
                </> : <span className="text-muted small">Không thể chỉnh sửa</span>}
              </td>
            </tr>
          })}
        </tbody>
      </Table>
      {loading && <p className="p-3 mb-0">Đang tải bài viết...</p>}
      {!loading && articles.length === 0 && <p className="p-3 mb-0">Bạn chưa có bài viết nào. Hãy tạo bản nháp đầu tiên.</p>}
    </div>

    {editing !== undefined && <ContributorArticleForm
      key={editing?.id ?? 'new'}
      article={editing}
      categories={categories}
      tags={tags}
      onClose={() => setEditing(undefined)}
      onSave={saveDraft}
    />}
  </main>
}
