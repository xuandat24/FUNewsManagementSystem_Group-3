import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

export default function TagFormModal({
  show,
  onClose,
  onSave,
  tag = null,
  error = "",
}) {
  const isEditing = Boolean(tag?.id);

  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (tag) {
      //update
      setName(tag.tagName || "");
      setNote(tag.note || "");
    } else {
      //add thêm đối tượng
      setName("");
      setNote("");
    }
    setLocalError("");
  }, [tag, show]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setLocalError("Vui lingf nhập tên thẻ tag!");
      return;
    }

    onSave({
      tagName: name.trim(),
      note: note.trim() || null,
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Cập nhật Tag" : "Thêm mới Tag"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {(error || localError) && (
            <Alert variant="danger">{error || localError}</Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>
              Tên Tag <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên tag..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập ghi chú cho tag..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
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
