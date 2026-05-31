import api from '../../../services/api';

export const updateCategory = async (id, data) => {
    const response = await api.put(`/api/category/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/api/category/${id}`);
    return response.data;
};

export const createCategory = async (data) => {
    const response = await api.post('/api/category', data);
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get('/api/categories');
    return response.data;
}

const categoryApi = {
    updateCategory,
    deleteCategory,
    getCategories,
    createCategory,
}

export default categoryApi;