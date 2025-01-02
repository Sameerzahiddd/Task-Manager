// src/components/dialogs/EditTaskDialog.jsx

import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import './EditDialog.css'; // Create and style accordingly

const EditTaskDialog = ({ isOpen, onClose, task, refreshTasks }) => {
  const api = useApi();
  const [taskName, setTaskName] = useState(task.name);
  const [completed, setCompleted] = useState(task.completed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/EditTask/${task.id}`, { name: taskName, completed });
      toast.success('Task updated successfully!');
      refreshTasks();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="edit-task-dialog">
        <h3>Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Task Name:
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </label>
          <label>
            Completed:
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
          </label>
          <button type="submit">Update</button>
        </form>
      </div>
    </Modal>
  );
};

export default EditTaskDialog;
