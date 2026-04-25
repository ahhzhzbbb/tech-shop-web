import axios from 'axios';
const AUTH_URL = "http://localhost:8080/api/auth";

const register = async (data) => {
    const response = await axios.post(`${AUTH_URL}/register`, data, { withCredentials: true })
    return response.data;
}

const login = async (data) => {
    const response = await axios.post(`${AUTH_URL}/login`, data, { withCredentials: true })
    return response.data;
}