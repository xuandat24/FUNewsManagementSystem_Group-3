import { useCallback, useEffect, useState } from 'react'
import { Badge, Button, Form, Table } from 'react-bootstrap'
import NewsForm from '../components/NewsForm.jsx'
import { newsApi } from '../services/newsApi.js'

export default function StaffNewsPage() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [tags, setTags] = useState([])
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [editing, setEditing] = useState(undefined) // undefined: dong; null: them; object: sua
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setArticles(await newsApi.list(false, keyword, categoryId))
      setError('')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [keyword, categoryId])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    Promise.all([newsApi.categories(), newsApi.authors(), newsApi.tags()])
      .then(([c, a, t]) => { setCategories(c); setAuthors(a); setTags(t) })
      .catch(err => setError(err.message))
  }, [])

  async function save(body) {
    if (editing) await newsApi.update(editing.id, body)
    else await newsApi.create(body)
    setEditing(undefined)
    await load()
  }
  async function remove(item) {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${item.title}"?`)) return
    try { await newsApi.remove(item.id); await load() }
    catch (err) { setError(err.message) }
  }

  return <main className="container py-4">
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
      <div><h1 className="h3 mb-1">Quản lý bài viết</h1><p className="text-muted mb-0">Staff / News Article Management</p></div>
      <Button onClick={() => setEditing(null)}>+ Thêm bài viết</Button>
    </div>
    {error && <p role="alert" className="alert alert-danger">{error}</p>}
    <div className="row g-2 mb-3">
      <div className="col-md-7"><Form.Control aria-label="Tìm bài viết" placeholder="Tìm theo tiêu đề hoặc tóm tắt..." value={keyword} onChange={e => setKeyword(e.target.value)} /></div>
      <div className="col-md-5"><Form.Select aria-label="Lọc danh mục" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
        <option value="">Tất cả danh mục</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </Form.Select></div>
    </div>
    <div className="table-responsive bg-white rounded border">
      <Table hover className="mb-0 align-middle"><thead className="table-light"><tr>
        <th>ID</th><th>Tiêu đề</th><th>Danh mục</th><th>Người tạo</th><th>Trạng thái</th><th>Thao tác</th>
      </tr></thead><tbody>
        {articles.map(item => <tr key={item.id}>
          <td>{item.id}</td><td><strong>{item.title}</strong><div className="small text-muted">{item.headline}</div></td>
          <td>{item.categoryName}</td><td>{item.authorName}</td>
          <td><Badge bg={item.active ? 'success' : 'secondary'}>{item.active ? 'Đang hiện' : 'Đã ẩn'}</Badge></td>
          <td className="text-nowrap"><Button size="sm" variant="outline-primary" onClick={() => setEditing(item)}>Sửa</Button>{' '}
            <Button size="sm" variant="outline-danger" onClick={() => remove(item)}>Xóa</Button></td>
        </tr>)}
      </tbody></Table>
      {loading && <p className="p-3 mb-0">Đang tải dữ liệu...</p>}
      {!loading && articles.length === 0 && <p className="p-3 mb-0">Chưa có bài viết phù hợp.</p>}
    </div>
    {editing !== undefined && <NewsForm key={editing?.id ?? 'new'} article={editing} categories={categories} authors={authors} tags={tags}
      onClose={() => setEditing(undefined)} onSave={save} />}
  </main>
}
