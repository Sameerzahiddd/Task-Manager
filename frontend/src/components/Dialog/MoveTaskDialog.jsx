import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import './MoveTaskDialog.css';

const MoveTaskDialog = ({ isOpen, onClose, taskId, currentListId, refreshTasks }) => {
  const api = useApi();
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        // Fetch all lists associated with the user
        const response = await api.get('/GetLists');
        setLists(response.data.lists); 

        // Set selectedListId to the first available list if no list is pre-selected
        if (response.data.lists.length > 0) {
          setSelectedListId(currentListId || response.data.lists[0].id);
        }
      } catch (error) {
        console.error('Error fetching lists:', error);
        toast.error('Failed to fetch lists.');
      }
    };

    if (isOpen) {
      fetchLists();
    }
  }, [api, isOpen, currentListId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to move the task (or subtask) to the selected list
      await api.put(`/moveTask/${taskId}`, { new_list_id: selectedListId });
      toast.success('Task moved successfully!');
      refreshTasks(); // Refresh tasks after moving
      onClose(); // Close the dialog
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Failed to move task.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="move-task-dialog">
        <h3>Move Task</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Select New List:
            <select
              value={selectedListId || ""}
              onChange={(e) => setSelectedListId(e.target.value)}
              required
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Move</button>
        </form>
      </div>
    </Modal>
  );
};

export default MoveTaskDialog;
