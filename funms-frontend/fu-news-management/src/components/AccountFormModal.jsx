import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

export default function AccountFormModal({
  show,
  onClose,
  onSave,
  account = null,
  error = "",
}) {
  const isEditing = Boolean(account?.accountId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(2);
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (account) {
      setName(account.accountName || "");
      setEmail(account.accountEmail || "");
      setRole(account.accountRole != null ? account.accountRole : 2);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setRole(2);
      setPassword("");
    }
    setLocalError("");
  }, [account, show]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setLocalError("Vui lòng nhập tên tài khoản!");
      return;
    }

    if (!email.trim()) {
      setLocalError("Vui lòng nhập email!");
      return;
    }

    if (!isEditing && !password.trim()) {
      setLocalError("Vui lòng nhập mật khẩu khởi tạo cho tài khoản mới!");
      return;
    }

    onSave({
      accountName: name.trim(),
      accountEmail: email.trim(),
      accountRole: Number(role),
      accountPassword: password.trim() || undefined,
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Cập nhật tài khoản" : "Thêm mới tài khoản"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {(error || localError) && (
            <Alert variant="danger">{error || localError}</Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>
              Tên tài khoản <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập họ và tên / tên tài khoản..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email tài khoản..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Vai trò <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="2">Staff</option>
              <option value="1">Admin</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              {isEditing ? "Mật khẩu mới" : "Mật khẩu khởi tạo"}{" "}
              {!isEditing && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              type="password"
              placeholder={
                isEditing
                  ? "Để trống nếu không muốn đổi mật khẩu"
                  : "Nhập mật khẩu..."
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditing}
            />
            {isEditing && (
              <Form.Text className="text-muted">
                Chỉ nhập nếu bạn muốn đặt lại mật khẩu cho tài khoản này.
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
