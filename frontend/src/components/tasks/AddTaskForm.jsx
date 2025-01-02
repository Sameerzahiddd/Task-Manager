//AddTaskForm.jsx


import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const AddTaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');

  const handleInputChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      alert('Please enter a task name');
      return;
    }
    
    onAddTask(taskName);
    setTaskName(''); // Clear the input after adding the task
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', gap: 2 }}>
      <TextField
        label="Task Name"
        value={taskName}
        onChange={handleInputChange}
        variant="outlined"
        fullWidth
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
      >
        Add Task
      </Button>
    </Box>
  );
};

export default AddTaskForm;
