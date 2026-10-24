import React, { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'

export default function CategoryFormModal({
  show,
  onClose,
  onSave,
  category = null,
  error = '',
}) {
  const isEditing = Boolean(category?.id)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (category) {
      setName(category.name || '')
      setDescription(category.description || '')
      setActive(category.active ?? true)
    } else {
      setName('')
      setDescription('')
      setActive(true)
    }
    setLocalError('')
  }, [category, show])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setLocalError('Vui lòng nhập tên danh mục!')
      return
    }

    onSave({
      categoryName: name.trim(),
      categoryDescription: description.trim() || null,
      isActive: active,
    })
  }

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {(error || localError) && (
            <Alert variant="danger">{error || localError}</Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>
              Tên danh mục <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên danh mục..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mô tả danh mục</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập mô tả danh mục..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="category-active-switch"
              label={active ? 'Đang hoạt động' : 'Không hoạt động'}
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Lưu thay đổi' : 'Tạo mới'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
