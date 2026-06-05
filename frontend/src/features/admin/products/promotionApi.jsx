import api from '../../../services/api';

// API for promotion
export const getAllPromotions = async() => {
    const response = await api.get('/api/promotions');
    return response.data;
}

export const getPromotionById = async (id) => {
    const response = await api.get(`/api/promotion/${id}`);
    return response.data;
};

export const createPromotion = async (data) => {
    const response = await api.post('/api/promotion', data, { withCredentials: true });
    return response.data;
};

export const updatePromotionById = async (id, data) => {
    const response = await api.put(`/api/promotion/${id}`, data, { withCredentials: true });
    return response.data;
};

export const deletePromotionById = async (id) => {
    const response = await api.delete(`/api/promotion/${id}`, { withCredentials: true });
    return response.data;
};

const promotionApi = {
    getAllPromotions,
    getPromotionById,
    createPromotion,
    updatePromotionById,
    deletePromotionById,
};

export default promotionApi;