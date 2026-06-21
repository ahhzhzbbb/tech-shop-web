import api from '../../../services/api';

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

export const getUserProfileApi = async () => {
  const response = await api.get('/api/auth/user', { withCredentials: true });
  return response.data;
}

export const updateProfileApi = async (data) => {
  const response = await api.put('/api/auth/user', data, { withCredentials: true });
  return response.data;
}