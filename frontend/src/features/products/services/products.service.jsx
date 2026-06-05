import api from '../../../services/api';

export const getAllProducts = async (page = 0, size = 10) => {
    const res = await api.get('/api/products', { params: { page, size } });
    return res.data;
};

export const getProductById = async (productId) => {
    const res = await api.get(`/api/product/${productId}`);
    return res.data;
};

export const getProductsByCategoryName = async (categoryName) => {
    const res = await api.get(`/api/products/category/${categoryName}`);
    return res.data;
};

export const getProductsByCategoryId = async (categoryId, page = 0, size = 10) => {
    const res = await api.get(`/api/products/category/id/${categoryId}`, { params: { page, size } });
    return res.data;
};

export const searchProducts = async (keyword, page = 0, size = 10) => {
    const res = await api.get('/api/products/search', { params: { keyword, page, size } });
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
    getProductsByCategoryName,
    getProductsByCategoryId,
    searchProducts,
    getProductAttributeValues,
    saveProductAttributeValue,
    replaceProductAttributeValues,
    deleteProductAttributeValue,
};

export default productsService;