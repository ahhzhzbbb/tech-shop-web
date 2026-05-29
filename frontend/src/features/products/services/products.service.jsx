import api from '../../../../services/api';

export const getAllProducts = async () => {
    const res = await api.get('/api/products');
    return res.data;
};

export const getProductById = async (productId) => {
    const res = await api.get(`/api/product/${productId}`);
    return res.data;
};

export const getProductsByCategory = async (categoryName) => {
    const res = await api.get(`/api/products/category/${categoryName}`);
    return res.data;
};

export const searchProducts = async (keyword) => {
    const res = await api.get('/api/products/search', { params: { keyword } });
    return res.data;
};

export const createProduct = async (productRequest) => {
    const res = await api.post('/api/product', productRequest, { withCredentials: true });
    return res.data;
};

export const updateProduct = async (productId, productRequest) => {
    const res = await api.put(`/api/product/${productId}`, productRequest, { withCredentials: true });
    return res.data;
};

export const deleteProduct = async (productId) => {
    const res = await api.delete(`/api/product/${productId}`, { withCredentials: true });
    return res.data;
};

// Product attribute value endpoints
export const getProductAttributeValues = async (productId) => {
    const res = await api.get(`/api/product/${productId}/attribute-values`);
    return res.data;
};

export const saveProductAttributeValue = async (productId, attributeRequest) => {
    const res = await api.post(`/api/product/${productId}/attribute-value`, attributeRequest, { withCredentials: true });
    return res.data;
};

export const replaceProductAttributeValues = async (productId, attributeRequests) => {
    const res = await api.put(`/api/product/${productId}/attribute-values`, attributeRequests, { withCredentials: true });
    return res.data;
};

export const deleteProductAttributeValue = async (productId, attributeId) => {
    const res = await api.delete(`/api/product/${productId}/attribute/${attributeId}`, { withCredentials: true });
    return res.data;
};

const productsService = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductAttributeValues,
    saveProductAttributeValue,
    replaceProductAttributeValues,
    deleteProductAttributeValue,
};

export default productsService;