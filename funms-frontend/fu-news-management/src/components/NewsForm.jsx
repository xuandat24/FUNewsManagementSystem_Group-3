import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const empty = { newsTitle: '', headline: '', newsContent: '', newsSource: '',
  categoryId: '', createdById: '', newsStatus: true, tagIds: [] }

export default function NewsForm({ article, categories, authors, tags, onClose, onSave }) {
  // key o component cha dam bao form reset khi mo bai khac.
  const [form, setForm] = useState(article ? {
    newsTitle: article.title, headline: article.headline, newsContent: article.content || '',
    newsSource: article.source || '', categoryId: article.categoryId || '',
    createdById: article.authorId || '', newsStatus: article.active, tagIds: article.tagIds || [],
  } : { ...empty })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function change(event) {
    const { name, value, type, checked } = event.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }
  function changeTags(event) {
    const values = Array.from(event.target.selectedOptions).map(o => Number(o.value))
    setForm(prev => ({ ...prev, tagIds: values }))
  }
  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({ ...form, categoryId: Number(form.categoryId),
        createdById: Number(form.createdById), tagIds: form.tagIds })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return <Modal show onHide={onClose} centered size="lg" backdrop="static">
    <Form onSubmit={submit}>
      <Modal.Header closeButton><Modal.Title>{article ? 'Sửa bài viết' : 'Thêm bài viết'}</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <p className="alert alert-danger">{error}</p>}
        <Form.Group className="mb-3"><Form.Label>Tiêu đề *</Form.Label>
          <Form.Control name="newsTitle" maxLength={400} required value={form.newsTitle} onChange={change} /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Tóm tắt *</Form.Label>
          <Form.Control name="headline" maxLength={400} required value={form.headline} onChange={change} /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Nội dung *</Form.Label>
          <Form.Control as="textarea" rows={5} name="newsContent" required value={form.newsContent} onChange={change} /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Nguồn bài viết</Form.Label>
          <Form.Control name="newsSource" maxLength={255} value={form.newsSource} onChange={change} /></Form.Group>
        <div className="row g-3 mb-3">
          <Form.Group className="col-md-6"><Form.Label>Danh mục *</Form.Label>
            <Form.Select required name="categoryId" value={form.categoryId} onChange={change}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Form.Select></Form.Group>
          <Form.Group className="col-md-6"><Form.Label>Nhân viên thực hiện *</Form.Label>
            <Form.Select required name="createdById" value={form.createdById} onChange={change}>
              <option value="">-- Chọn Staff --</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </Form.Select></Form.Group>
        </div>
        <Form.Group className="mb-3"><Form.Label>Tags (giữ Ctrl để chọn nhiều)</Form.Label>
          <Form.Select multiple size="sm" value={form.tagIds.map(String)} onChange={changeTags}>
            {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Form.Select></Form.Group>
        <Form.Check name="newsStatus" type="checkbox" label="Hiển thị trên trang Customer" checked={form.newsStatus} onChange={change} />
      </Modal.Body>
      <Modal.Footer><Button variant="outline-secondary" onClick={onClose}>Hủy</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu bài viết'}</Button></Modal.Footer>
    </Form>
  </Modal>
}
