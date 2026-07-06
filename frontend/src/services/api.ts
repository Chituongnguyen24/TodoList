import axios from 'axios';

const getBaseURL = () => {
  // Use env variable if explicitly set
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Otherwise, use relative path so Nginx reverse proxy (or Vite proxy) handles it
  return '';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
