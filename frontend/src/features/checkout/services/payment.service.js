import api from '../../../services/api';

/**
 * Tạo thanh toán cho một đơn hàng.
 * @param {Object} payload PaymentRequest: { orderId, paymentMethod: 'COD'|'VNPAY', bankCode? }
 * @returns {Promise<Object>} PaymentResponse: { paymentId, transactionId, amount, method,
 *   status, createdAt, paymentUrl, message }
 */
export const createPayment = async (payload) => {
    const response = await api.post('/api/payment', payload, { withCredentials: true });
    return response.data;
};

/**
 * Lấy thông tin thanh toán theo orderId.
 * @param {number|string} orderId
 * @returns {Promise<Object>} PaymentDTO
 */
export const getPaymentByOrderId = async (orderId) => {
    const response = await api.get(`/api/payment/order/${orderId}`, { withCredentials: true });
    return response.data;
};

/**
 * Kiểm tra trạng thái giao dịch theo transactionId.
 * @param {string} transactionId
 * @returns {Promise<Object>} { status }
 */
export const checkTransactionStatus = async (transactionId) => {
    const response = await api.get(`/api/payment/status/${transactionId}`, { withCredentials: true });
    return response.data;
};

/**
 * Chuyển tiếp các tham số VNPay trả về cho backend để xác thực chữ ký + cập nhật DB.
 * @param {URLSearchParams|string} search Chuỗi query VNPay redirect kèm theo (vd window.location.search)
 * @returns {Promise<Object>} { status: 'success'|'error', message, payment? }
 */
export const verifyVnpayReturn = async (search) => {
    const qs = typeof search === "string" ? search : `?${search.toString()}`;
    const response = await api.get(`/api/payment/vnpay-callback${qs}`, { withCredentials: true });
    return response.data;
};

const paymentService = {
    createPayment,
    getPaymentByOrderId,
    checkTransactionStatus,
    verifyVnpayReturn,
};

export default paymentService;
