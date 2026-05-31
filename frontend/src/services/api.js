import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Send cookies (httpOnly JWT) with all requests by default
api.defaults.withCredentials = true;

export default api;