import api from '../../../services/api';

// API for category
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

export const getCategories = async (includeInactive = false) => {
    const response = await api.get('/api/categories', {
        params: includeInactive ? { all: true } : undefined,
    });
    return response.data;
};

// API for attribute
export const getAttributes = async () => {
    const response = await api.get('/api/attributes');
    return response.data;
};

export const getAttributeById = async (id) => {
    const response = await api.get(`/api/attribute/${id}`);
    return response.data;
};

export const createAttribute = async (data) => {
    const response = await api.post('/api/attribute', data);
    return response.data;
};

export const updateAttribute = async (id, data) => {
    const response = await api.put(`/api/attribute/${id}`, data);
    return response.data;
};

export const deleteAttribute = async (id) => {
    const response = await api.delete(`/api/attribute/${id}`);
    return response.data;
};

export const getAttributesByCategory = async (categoryId) => {
    const response = await api.get(`/api/attributes/category/${categoryId}`);
    return response.data;
};

const categoryApi = {
    updateCategory,
    deleteCategory,
    getCategories,
    createCategory,
    getAttributes,
    getAttributeById,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    getAttributesByCategory,
};

export default categoryApi;