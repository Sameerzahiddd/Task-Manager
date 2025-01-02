// src/components/dialogs/EditDialog.jsx

import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import './EditDialog.css';

const EditDialog = ({ isOpen, onClose, list, refreshLists }) => {
  const api = useApi();
  const [listName, setListName] = useState(list.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/EditList/${list.id}`, { name: listName });
      toast.success('List updated successfully!');
      refreshLists();
      onClose();
    } catch (error) {
      console.error('Error updating list:', error);
      toast.error('Failed to update list.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="edit-dialog">
        <h3>Edit List</h3>
        <form onSubmit={handleSubmit}>
          <label>
            List Name:
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              required
            />
          </label>
          <button type="submit">Update</button>
        </form>
      </div>
    </Modal>
  );
};

export default EditDialog;
