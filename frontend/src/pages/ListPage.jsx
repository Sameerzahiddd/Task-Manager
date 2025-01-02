// src/pages/ListPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Tasks from '../components/tasks/Tasks';
import Modal from '../components/common/Modal';
import AddTaskForm from '../components/tasks/AddTaskForm';
import { useApi } from '../hooks/useApi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import './ListPage.css';

const ListPage = () => {
  const { listId } = useParams();
  const api = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listName, setListName] = useState(''); // State to store the list name
  const [refreshTasksTrigger, setRefreshTasksTrigger] = useState(false); // State to trigger task refresh

  const fetchListDetails = async () => {
    try {
        const response = await api.get(`/GetListDetails/${listId}`);
        setListName(response.data.listName);
    } catch (error) {
        console.error('Error fetching list details:', error);
        toast.error('Failed to fetch list details.');
    }
};


  useEffect(() => {
    fetchListDetails(); // Fetch list details when the component mounts or when listId changes
  }, [listId]);

  const handleAddTask = async (taskData) => {
    try {
      await api.post(`/AddTask/${listId}`, { name: taskData }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Task added successfully!');
      setIsModalOpen(false);
      setRefreshTasksTrigger((prev) => !prev); // Toggle state to trigger refresh in Tasks
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task.');
    }
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="list-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>List: {listName || "Loading..."}</h2> {/* Display list name or a loading indicator */}
        <button onClick={() => setIsModalOpen(true)} className="add-task-button">
          Add New Task
        </button>
        <Tasks listId={listId} refreshTasksTrigger={refreshTasksTrigger} />
      </motion.div>
      <Footer />

      {/* Add Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddTaskForm onAddTask={handleAddTask} />
      </Modal>
    </>
  );
};

export default ListPage;
