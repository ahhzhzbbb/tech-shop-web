import api from '../../../services/api';

/**
 * Lấy tất cả đơn hàng của một người dùng theo ID
 * @param {number|string} userId 
 * @returns {Promise<Array>} Danh sách đơn hàng
 */
export const getOrdersByUserId = async (userId) => {
    const response = await api.get(`/api/user/${userId}/orders`, { withCredentials: true });
    return response.data;
};

/**
 * Lấy chi tiết một đơn hàng theo ID
 * @param {number|string} orderId 
 * @returns {Promise<Object>} Chi tiết đơn hàng
 */
export const getOrderById = async (orderId) => {
    const response = await api.get(`/api/order/${orderId}`, { withCredentials: true });
    return response.data;
};

const orderService = {
    getOrdersByUserId,
    getOrderById,
};

export default orderService;
