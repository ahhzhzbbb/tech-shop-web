import axios from 'axios';
const AUTH_URL = "http://localhost:8080/api/auth";

export const registerApi = async (data) => {
    const response = await axios.post(`${AUTH_URL}/register`, data, { withCredentials: true });
    return response.data;
}

export const loginApi = async (data) => {
    const response = await axios.post(`${AUTH_URL}/login`, data, { withCredentials: true });
    return response.data;
}

export const logoutApi = async () => {
    const response = await axios.post(`${AUTH_URL}/logout`, {}, { withCredentials: true });
    return response.data;
}