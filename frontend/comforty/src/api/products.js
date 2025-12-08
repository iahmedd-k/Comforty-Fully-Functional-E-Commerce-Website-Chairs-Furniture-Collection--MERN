import api from './axios';

export const getProducts = async (params = {}) => {
  const res = await api.get('/products', { params });
  // backend returns { totalProducts, page, pages, products }
  // return the array that the UI expects
  return res.data && res.data.products ? res.data.products : (res.data || []);
};

export const getProductBySlug = async (slug) => {
  const res = await api.get(`/products/${slug}`);
  return res.data;
};

export const addReview = async (slug, payload) => {
  const res = await api.post(`/products/${slug}/review`, payload);
  // backend returns { message, product }
  return res.data && res.data.product ? res.data.product : res.data;
};

export const createProduct = async (product) => {
  let res;
  if (product instanceof FormData) {
    res = await api.post('/products', product, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } else {
    res = await api.post('/products', product);
  }
  // backend wraps created product in { message, product }
  return res.data && res.data.product ? res.data.product : res.data;
};

export const updateProduct = async (slugOrId, product) => {
  let res;
  if (product instanceof FormData) {
    res = await api.put(`/products/${slugOrId}`, product, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } else {
    res = await api.put(`/products/${slugOrId}`, product);
  }
  // backend wraps updated product in { message, product }
  return res.data && res.data.product ? res.data.product : res.data;
};

export const deleteProduct = async (slugOrId) => {
  const res = await api.delete(`/products/${slugOrId}`);
  return res.data;
};

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  addReview,
};
