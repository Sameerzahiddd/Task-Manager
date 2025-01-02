// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Lists from '../components/lists/Lists';
import Modal from '../components/common/Modal';
import AddListForm from '../components/lists/AddListForm';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getLists, addList } from '../services/api';

const Dashboard = () => {
  const [lists, setLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLists = async () => {
    try {
      const data = await getLists();
      setLists(data.lists);
    } catch (error) {
      console.error('Error fetching lists:', error);
      if (!toast.isActive('fetchError')) {
        toast.error('Failed to fetch lists.', { toastId: 'fetchError' });
      }
    }
  };

  const handleAddList = async (listData) => {
    try {
      await addList(listData);
      toast.success('List added successfully!', { toastId: 'addSuccess' });
      fetchLists();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding list:', error);
      if (!toast.isActive('addError')) {
        toast.error('Failed to add list.', { toastId: 'addError' });
      }
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <>
      <Navbar />
      <motion.div
        className="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Welcome to your Dashboard!</h1>
        <button onClick={() => setIsModalOpen(true)} className="add-list-button">
          Add New List
        </button>
        <Lists refreshLists={fetchLists} />
      </motion.div>
      <Footer />

      {/* Add List Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddListForm onAddList={handleAddList} />
      </Modal>
    </>
  );
};

export default Dashboard;
