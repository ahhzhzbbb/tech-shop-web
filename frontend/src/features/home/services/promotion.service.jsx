import api from '../../../services/api';

export const getAllProductPromotion = async () => {
    const res = await api.get('/api/promotions');
    return res.data;
}
