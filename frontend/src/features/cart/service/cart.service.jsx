import api from '../../../services/api';

// POST /api/cart/items  body: { productId, quantity }
export const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/api/cart/items', { productId, quantity }, { withCredentials: true });
    return res.data;
};

// GET /api/cart
export const getCart = async () => {
    const res = await api.get('/api/cart', { withCredentials: true });
    return res.data;
};

// PUT /api/cart/items/{cartItemId}  body: { quantity }
export const updateCartItem = async (cartItemId, quantity) => {
    const res = await api.put(`/api/cart/items/${cartItemId}`, { quantity }, { withCredentials: true });
    return res.data;
};

// DELETE /api/cart/items/{cartItemId}
export const removeCartItem = async (cartItemId) => {
    const res = await api.delete(`/api/cart/items/${cartItemId}`, { withCredentials: true });
    return res.data;
};

// DELETE /api/cart/clear
export const clearCart = async () => {
    const res = await api.delete('/api/cart/clear', { withCredentials: true });
    return res.data;
};

const cartService = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
};

export default cartService;
