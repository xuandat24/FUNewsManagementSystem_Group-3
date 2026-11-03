import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import TagFormModal from "../components/TagFormModal.jsx";
import DeleteConfirmModal from "../components/DeleteConfirmModal.jsx";
import {
  searchAllTags,
  deleteTag,
  createTag,
  updateTag,
} from "../services/tagsApiAxios";

export default function TagManagementPage() {
  const [tags, setTags] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTag, setDeletingTag] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [formError, setFormError] = useState("");

  const fetchTags = async () => {
    try {
      const resData = await searchAllTags(keyword, page, size);
      setTags(resData.content || []);
      setTotalElements(resData.totalElements || 0);
      setTotalPages(resData.totalPages || 0);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [page, size]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchTags();
  };

  const handleOpenDelete = (tag) => {
    setDeletingTag(tag);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setDeletingTag(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingTag) return;

    try {
      await deleteTag(deletingTag.id);
      handleCloseDelete();
      fetchTags();
    } catch (error) {
      setDeleteError(error.message || "Lỗi khi xóa tag");
    }
  };

  const handleOpenCreate = () => {
    setSelectedTag(null);
    setFormError("");
    setShowFormModal(true);
  };

  const handleOpenEdit = (tag) => {
    setSelectedTag(tag);
    setFormError("");
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setSelectedTag(null);
    setFormError("");
  };

  const handleSaveForm = async (formData) => {
    try {
      if (selectedTag) {
        await updateTag(selectedTag.id, formData);
      } else {
        await createTag(formData);
      }
      handleCloseForm();
      fetchTags();
    } catch (err) {
      setFormError(err.message || "Lỗi khi lưu tag");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Quản lý thẻ Tag</h1>
        <Button variant="primary" onClick={handleOpenCreate}>
          + Thêm thẻ Tag
        </Button>
      </div>

      <Form onSubmit={handleSearch}>
        <Row className="align-items-center">
          <Col md={10} className="mb-10 mb-md-0">
            <Form.Control
              type="text"
              placeholder="Nhập từ khóa..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
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
            <th>ID</th>
            <th>Tên tag</th>
            <th>Ghi chú</th>
            <th>Số bài viết</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tags.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted py-3">
                Không có thẻ tag nào.
              </td>
            </tr>
          ) : (
            tags.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>
                  <strong>{t.tagName}</strong>
                </td>
                <td>{t.note || "—"}</td>
                <td>
                  <Badge bg="info" text="dark">
                    {t.totalArticles > 0 ? t.totalArticles + " bài" : "0 bài"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleOpenEdit(t)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleOpenDelete(t)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>Tổng cộng: {totalElements} thẻ tag</span>

        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="me-2"
          >
            Trang trước
          </Button>
          <span className="me-2">
            Trang {totalPages === 0 ? 0 : page + 1} / {totalPages}
          </span>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Trang sau
          </Button>
        </div>
      </div>

      <TagFormModal
        show={showFormModal}
        onClose={handleCloseForm}
        onSave={handleSaveForm}
        tag={selectedTag}
        error={formError}
      />
      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa Tag"
        message={`Bạn có chắc muốn xóa tag "${deletingTag?.tagName}" không?`}
        error={deleteError}
      />
    </div>
  );
}
