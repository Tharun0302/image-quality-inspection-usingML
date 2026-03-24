import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_URL}/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const enhanceImage = async (file, imageId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (imageId) {
    formData.append('image_id', imageId);
  }
  
  const response = await axios.post(`${API_URL}/enhance`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  // Now returns {"enhanced_url": "...", "id": "..."} instead of a raw blob
  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(`${API_URL}/history`);
  return response.data.history;
};
