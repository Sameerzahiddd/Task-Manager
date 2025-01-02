// src/components/lists/AddListForm.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './AddListForm.css'; // Create and style accordingly

const AddListForm = ({ onAddList }) => {
  const [listName, setListName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listName.trim() === '') return;
    onAddList({ name: listName });
    setListName('');
  };

  return (
    <motion.div
      className="add-list-form"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Add New List</h3>
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
        <button type="submit">Add List</button>
      </form>
    </motion.div>
  );
};

export default AddListForm;
