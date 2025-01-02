// src/components/dialogs/DeleteTaskDialog.jsx

import React from 'react';
import Modal from '../common/Modal';
import './DeleteTaskDialog.css';

const DeleteTaskDialog = ({ isOpen, onClose, onDelete, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="delete-dialog">
        <h3>Confirm Deletion</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onDelete} className="confirm-button">
            Yes
          </button>
          <button onClick={onClose} className="cancel-button">
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTaskDialog;
