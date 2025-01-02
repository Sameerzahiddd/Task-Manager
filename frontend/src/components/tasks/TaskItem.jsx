import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { motion } from 'framer-motion';
import EditTaskDialog from '../Dialog/EditTaskDialog';
import DeleteTaskDialog from '../Dialog/DeleteTaskDialog';
import MoveTaskDialog from '../Dialog/MoveTaskDialog';
import AddTaskForm from './AddTaskForm';
import './TaskItem.css';

const TaskItem = ({ task, refreshTasks }) => {
  const api = useApi();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Track if subtasks are shown

  const toggleCompletion = async () => {
    try {
      await api.put(`/TaskCompleted/${task.id}`);
      refreshTasks();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/DeleteTask/${task.id}`);
      refreshTasks();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddSubtask = async (subtaskName) => {
    try {
      await api.post(`/AddSubtasks`, {
        name: subtaskName,
        parent_id: task.id,
        list_id: task.list_id,
      });
      refreshTasks();
      setShowAddSubtaskForm(false);
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const toggleSubtasks = () => setIsExpanded((prev) => !prev); // Toggle expanded state

  return (
    <motion.div
      className="task-item"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="task-details" onClick={toggleSubtasks}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleCompletion}
        />
        <span className={`task-name ${task.completed ? 'completed' : ''} ${isExpanded ? 'expanded' : ''}`}>
          {task.name}
        </span>
      </div>
      <div className="task-actions">
        <button onClick={() => setIsEditOpen(true)}>Edit</button>
        <button onClick={() => setIsMoveOpen(true)}>Move</button>
        <button onClick={() => setIsDeleteOpen(true)}>Delete</button>
        <button onClick={() => setShowAddSubtaskForm(!showAddSubtaskForm)}>
          {showAddSubtaskForm ? 'Cancel' : 'Add Subtask'}
        </button>
      </div>

      {showAddSubtaskForm && <AddTaskForm onAddTask={handleAddSubtask} />}

      {/* Subtask container with expanded/collapsed toggle */}
      <div className={`subtask-container ${isExpanded ? 'expanded' : ''}`}>
        {task.subtasks && task.subtasks.map((subtask) => (
          <TaskItem
            key={subtask.id}
            task={subtask}
            refreshTasks={refreshTasks}
          />
        ))}
      </div>

      <EditTaskDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        task={task}
        refreshTasks={refreshTasks}
      />

      <MoveTaskDialog
        isOpen={isMoveOpen}
        onClose={() => setIsMoveOpen(false)}
        taskId={task.id}
        currentListId={task.list_id}
        refreshTasks={refreshTasks}
      />

      <DeleteTaskDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={handleDelete}
        message={`Are you sure you want to delete the task "${task.name}"?`}
      />
    </motion.div>
  );
};

export default TaskItem;
