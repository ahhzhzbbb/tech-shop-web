import api from '../../../services/api';

/**
 * Tạo đánh giá mới cho sản phẩm (yêu cầu đăng nhập)
 * @param {Object} payload RatingRequest: { productId, score (1-5), comment }
 * @returns {Promise<Object>} RatingResponse vừa tạo
 */
export const createRating = async (payload) => {
    const res = await api.post('/api/ratings', payload, { withCredentials: true });
    return res.data;
};

/**
 * Lấy danh sách đánh giá của một sản phẩm theo ID
 * @param {number|string} productId
 * @returns {Promise<Array>} Danh sách RatingResponse
 */
export const getRatingsByProductId = async (productId) => {
    const res = await api.get(`/api/products/${productId}/ratings`);
    return res.data;
};

const ratingService = {
    createRating,
    getRatingsByProductId,
};

export default ratingService;
