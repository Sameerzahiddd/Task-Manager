// src/services/api.js

import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Your Flask backend URL

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', // Explicitly set content type
  },
});

export const getLists = async () => {
  const response = await apiClient.get('/GetLists');
  return response.data;
};

export const addList = async (listData) => {
  const response = await apiClient.post('/Addlists', listData);
  return response.data;
};

export const deleteList = async (listId) => {
  const response = await apiClient.delete(`/DeleteList/${listId}`);
  return response.data;
};

// Similarly, update the other functions if needed
