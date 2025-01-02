// src/components/lists/ListItem.jsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useApi } from '../../hooks/useApi';
import { motion } from 'framer-motion';
import EditDialog from '../Dialog/EditDialog';
import DeleteTaskDialog from '../Dialog/DeleteTaskDialog';
import './ListItem.css'; // Ensure this CSS file exists
import { useNavigate } from 'react-router-dom';

const ListItem = ({ list, refreshLists }) => {
  const api = useApi();
  const navigate = useNavigate(); 
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/DeleteList/${list.id}`);
      refreshLists();
      setIsDeleteOpen(false);
      toast.success('List deleted successfully!');
    } catch (error) {
      console.error('Error deleting list:', error);
      toast.error('Failed to delete list.');
    }
  };

  // Handle clicking the main container to navigate
  const handleNavigate = () => {
    navigate(`/dashboard/list/${list.id}`);
  };

  return (
    <motion.div
      className="list-item"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleNavigate} // Make the whole item clickable
    >
      <div className="list-content">
        <h3>{list.name}</h3>
      </div>

      <div className="list-actions">
        <button onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}>Edit</button>
        <button onClick={(e) => { e.stopPropagation(); setIsDeleteOpen(true); }}>Delete</button>
      </div>

      {/* Edit Dialog */}
      <EditDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        list={list}
        refreshLists={refreshLists}
      />

      {/* Delete Dialog */}
      <DeleteTaskDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={handleDelete}
        message={`Are you sure you want to delete the list "${list.name}"?`}
      />
    </motion.div>
  );
};

export default ListItem;
