// src/components/lists/Lists.jsx

import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import ListItem from './ListItem';
import { motion } from 'framer-motion';
import './Lists.css'; // Create and style accordingly

const Lists = ({ refreshLists }) => {
  const api = useApi();
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await api.get('/GetLists');
        console.log(response.data.lists);
        setLists(response.data.lists);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };
    fetchLists();
  }, [api, refreshLists]);

  return (
    <motion.div
      className="lists-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {lists.map((list) => (
        <ListItem key={list.id} list={list} refreshLists={refreshLists} />
      ))}
    </motion.div>
  );
};

export default Lists;
