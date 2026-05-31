import api from '../../../services/api';

<<<<<<< HEAD
export const registerApi = async (data) => {
    const response = await api.post('/api/auth/signup', data, { withCredentials: true });
    return response.data;
}

export const loginApi = async (data) => {
    const response = await api.post('/api/auth/login', data, { withCredentials: true });
    return response.data;
}

export const logoutApi = async () => {
    const response = await api.post('/api/auth/signout', {}, { withCredentials: true });
    return response.data;
}
=======
const register = async (data) => {
  const response = await axios.post(`${AUTH_URL}/register`, data, {
    withCredentials: true,
  });
  return response.data;
};

const login = async (data) => {
  const response = await axios.post(`${AUTH_URL}/login`, data, {
    withCredentials: true,
  });
  return response.data;
};
>>>>>>> 087dbf7 (sua UI header)
