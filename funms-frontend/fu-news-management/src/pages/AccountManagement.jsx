import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import AccountFormModal from "../components/AccountFormModal.jsx";
import DeleteConfirmModal from "../components/DeleteConfirmModal.jsx";
import {
  getAccounts,
  deleteAccount,
  updateAccount,
  createAccount,
} from "../services/accountsApi";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAcc, setDeletingAcc] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [formError, setFormError] = useState("");

  const fetchAccounts = async () => {
    try {
      const resData = await getAccounts(page, size, keyword, role);
      setAccounts(resData?.content || []);
      setTotalElements(resData?.totalElements || 0);
      setTotalPages(resData?.totalPages || 0);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [page, size, role]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchAccounts();
  };

  const handleOpenDelete = (acc) => {
    setDeletingAcc(acc);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setDeletingAcc(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingAcc) return;
    try {
      await deleteAccount(deletingAcc.accountId);
      handleCloseDelete();
      fetchAccounts();
    } catch (err) {
      setDeleteError(err.message || "Lỗi khi xóa tài khoản");
    }
  };

  const handleOpenCreate = () => {
    setSelectedAcc(null);
    setFormError("");
    setShowFormModal(true);
  };

  const handleOpenEdit = (acc) => {
    setSelectedAcc(acc);
    setFormError("");
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setSelectedAcc(null);
    setFormError("");
  };

  const handleSaveForm = async (formData) => {
    try {
      if (selectedAcc) {
        await updateAccount(selectedAcc.accountId, formData);
      } else {
        await createAccount(formData);
      }
      handleCloseForm();
      fetchAccounts();
    } catch (err) {
      setFormError(err.message || "Lỗi khi lưu tài khoản");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Quản lý tài khoản</h1>
        <Button variant="primary" onClick={handleOpenCreate}>
          + Thêm tài khoản
        </Button>
      </div>

      <Form onSubmit={handleSearch}>
        <Row className="align-items-center">
          <Col md={5} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              placeholder="Nhập tên hoặc email tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Col>

          <Col md={5} className="mb-2 mb-md-0">
            <Form.Select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(0);
              }}
            >
              <option value="">Tất cả vai trò</option>
              <option value="1">Admin</option>
              <option value="2">Staff</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Button variant="primary" type="submit" className="w-100">
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover className="mt-3 align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên tài khoản</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-3 text-muted">
                Không có tài khoản nào phù hợp
              </td>
            </tr>
          ) : (
            accounts.map((acc, index) => (
              <tr key={acc.accountId}>
                <td>{page * size + index + 1}</td>
                <td>
                  <strong>{acc.accountName}</strong>
                </td>
                <td>{acc.accountEmail}</td>
                <td>
                  <Badge bg={acc.accountRole === 1 ? "primary" : "secondary"}>
                    {acc.accountRole === 1 ? "Admin" : "Staff"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleOpenEdit(acc)}
                    className="me-2"
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleOpenDelete(acc)}
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
        <span>Tổng cộng: {totalElements} tài khoản</span>

        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="me-2"
          >
            ← Trước
          </Button>

          <span>
            Trang {page + 1} / {totalPages || 1}
          </span>

          <Button
            variant="outline-secondary"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="ms-2"
          >
            Sau →
          </Button>
        </div>
      </div>

      <AccountFormModal
        show={showFormModal}
        account={selectedAcc}
        onSave={handleSaveForm}
        onClose={handleCloseForm}
        error={formError}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        title="Xác nhận xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${deletingAcc?.accountName}" (${deletingAcc?.accountEmail}) không?`}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDelete}
        error={deleteError}
      />
    </div>
  );
}
