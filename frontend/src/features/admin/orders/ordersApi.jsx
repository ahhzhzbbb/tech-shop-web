import api from "../../../services/api";

export const getAllOrders = async () => {
    const response = await api.get("/api/orders");
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await api.get(`/api/order/${orderId}`);
    return response.data;
};

export const createOrder = async (data) => {
    const response = await api.post("/api/order", data, { withCredentials: true });
    return response.data;
};

export const updateOrder = async (orderId, data) => {
    const response = await api.put(`/api/order/${orderId}`, data, { withCredentials: true });
    return response.data;
};

export const deleteOrder = async (orderId) => {
    const response = await api.delete(`/api/order/${orderId}`, { withCredentials: true });
    return response.data;
};

const ordersApi = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};

export default ordersApi;
