import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add logging interceptors
// apiClient.interceptors.request.use((request) => {
//   console.log('Starting Request', request);
//   return request;
// });

// apiClient.interceptors.response.use(
//   (response) => {
//     console.log('Response:', response);
//     return response;
//   },
//   (error) => {
//     console.error('Response Error:', error);
//     return Promise.reject(error);
//   },
// );
