import React from 'react'
import { Alert, Button, Modal } from 'react-bootstrap'

export default function DeleteConfirmModal({
  show,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  message = 'Bạn có chắc chắn muốn xóa bản ghi này không?',
  error = '',
}) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p className="mb-0">{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy bỏ
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xác nhận xóa
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
