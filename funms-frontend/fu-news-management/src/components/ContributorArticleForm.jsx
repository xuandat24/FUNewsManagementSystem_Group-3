import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

export default function ContributorArticleForm({ article, categories, tags, onClose, onSave }) {
  const [form, setForm] = useState({
    newsTitle: article?.title || '',
    headline: article?.headline || '',
    newsContent: article?.content || '',
    newsSource: article?.source || '',
    categoryId: article?.categoryId || '',
    tagIds: article?.tagIds || [],
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function changeTags(event) {
    const ids = Array.from(event.target.selectedOptions, option => Number(option.value))
    setForm({ ...form, tagIds: ids })
  }

  async function save(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave({
        ...form,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return <Modal show onHide={onClose} centered size="lg" backdrop="static">
    <Form onSubmit={save}>
      <Modal.Header closeButton>
        <Modal.Title>{article ? 'Chỉnh sửa bài viết' : 'Tạo bản nháp'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small">Có thể lưu nháp chỉ với tiêu đề. Điền tóm tắt, nội dung và danh mục trước khi gửi duyệt.</p>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề *</Form.Label>
          <Form.Control required maxLength={400} name="newsTitle" value={form.newsTitle} onChange={change} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tóm tắt</Form.Label>
          <Form.Control maxLength={400} name="headline" value={form.headline} onChange={change} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nội dung</Form.Label>
          <Form.Control as="textarea" rows={6} name="newsContent" value={form.newsContent} onChange={change} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nguồn bài viết</Form.Label>
          <Form.Control maxLength={255} name="newsSource" value={form.newsSource} onChange={change} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Danh mục</Form.Label>
          <Form.Select name="categoryId" value={form.categoryId} onChange={change}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tags (Ctrl + click để chọn nhiều)</Form.Label>
          <Form.Select multiple value={form.tagIds.map(String)} onChange={changeTags}>
            {tags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>Hủy</Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : article ? 'Lưu chỉnh sửa' : 'Save Draft'}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
}
