import axios from 'axios';

const getBaseURL = () => {
  // Use env variable if explicitly set (e.g. via GitHub Actions secret)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // In local dev, use empty string so Vite proxy handles /todos -> localhost:8080
  if (import.meta.env.DEV) {
    return '';
  }
  // In production build (GitHub Pages, etc.), call EC2 backend directly
  return 'http://18.143.155.241:8080';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
