import React from "react";
import { Button, Modal } from "react-bootstrap";

const UserDeleteModal = ({ show, onClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>탈퇴 확인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        정말 탈퇴하시겠습니까?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="danger" onClick={() => {
          onConfirm(); 
          onClose(); 
        }}>
          탈퇴
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDeleteModal;
