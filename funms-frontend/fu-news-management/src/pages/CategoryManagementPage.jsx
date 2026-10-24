import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Row, Table } from 'react-bootstrap'
import CategoryFormModal from '../components/CategoryFormModal.jsx'
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../services/categoriesApi'

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([])

  const [keyword, setKeyword] = useState('')
  const [isActive, setIsActive] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(5)

  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingCat, setDeletingCat] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedCat, setSelectedCat] = useState(null)
  const [formError, setFormError] = useState('')

  const fetchCategories = async () => {
    try {
      const resData = await getCategories(page, size, keyword, isActive)
      setCategories(resData.content || [])
      setTotalElements(resData.totalElements || 0)
      setTotalPages(resData.totalPages || 0)
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, isActive])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    fetchCategories()
  }

  const handleOpenDelete = (cat) => {
    setDeletingCat(cat)
    setDeleteError('')
    setShowDeleteModal(true)
  }

  const handleCloseDelete = () => {
    setShowDeleteModal(false)
    setDeletingCat(null)
    setDeleteError('')
  }

  const handleConfirmDelete = async () => {
    if (!deletingCat) return
    try {
      await deleteCategory(deletingCat.id)
      handleCloseDelete()
      fetchCategories()
    } catch (err) {
      setDeleteError(err.message || 'Lỗi khi xóa danh mục')
    }
  }

  const handleOpenCreate = () => {
    setSelectedCat(null)
    setFormError('')
    setShowFormModal(true)
  }

  const handleOpenEdit = (cat) => {
    setSelectedCat(cat)
    setFormError('')
    setShowFormModal(true)
  }

  const handleCloseForm = () => {
    setShowFormModal(false)
    setSelectedCat(null)
    setFormError('')
  }

  const handleSaveForm = async (formData) => {
    try {
      if (selectedCat) {
        await updateCategory(selectedCat.id, formData)
      } else {
        await createCategory(formData)
      }
      handleCloseForm()
      fetchCategories()
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu danh mục')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Quản lý danh mục</h1>
        <Button variant="primary" onClick={handleOpenCreate}>
          + Thêm danh mục
        </Button>
      </div>

      <Form onSubmit={handleSearch}>
        <Row className="align-items-center">
          <Col md={5} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              placeholder="Nhập từ khóa..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Col>

          <Col md={5} className="mb-2 mb-md-0">
            <Form.Select
              value={isActive}
              onChange={(e) => {
                setIsActive(e.target.value)
                setPage(0)
              }}
            >
              <option value="">Tất cả</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Không hoạt động</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Button variant="primary" type="submit" className="w-100">
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Số bài viết</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted py-3">
                Không có danh mục nào.
              </td>
            </tr>
          ) : (
            categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>
                  <strong>{cat.name}</strong>
                </td>
                <td>{cat.description || '—'}</td>
                <td>
                  <Badge bg={cat.active ? 'success' : 'secondary'}>
                    {cat.active ? 'Đang hoạt động' : 'Không hoạt động'}
                  </Badge>
                </td>
                <td>
                  <Badge bg="info" text="dark">
                    {cat.totalArticles > 0 ? cat.totalArticles + ' bài' : '0 bài'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleOpenEdit(cat)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleOpenDelete(cat)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <CategoryFormModal
        show={showFormModal}
        onClose={handleCloseForm}
        onSave={handleSaveForm}
        category={selectedCat}
        error={formError}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${deletingCat?.name}" không?`}
        error={deleteError}
      />
    </div>
  )
}
