import axios from 'axios';

const isMobile = window.location.protocol === 'file:';
const baseURL = isMobile ? 'http://10.0.2.2:5067' : 'http://localhost:5067';

const api = axios.create({
  baseURL,
});

export default api;
