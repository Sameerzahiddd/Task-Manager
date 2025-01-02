// src/components/tasks/Tasks.jsx
import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import TaskItem from './TaskItem';
import './Tasks.css';

const Tasks = ({ listId, refreshTasksTrigger }) => {
  const api = useApi();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/GetTasks/${listId}`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [listId, refreshTasksTrigger]); // Add refreshTasksTrigger as a dependency

  return (
    <div className="tasks-container">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} refreshTasks={fetchTasks} />
      ))}
    </div>
  );
};

export default Tasks;
