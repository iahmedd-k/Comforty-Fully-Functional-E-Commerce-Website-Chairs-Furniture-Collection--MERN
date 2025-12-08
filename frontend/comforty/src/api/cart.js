import api from './axios';

export const getCart = async () => {
  try {
    const res = await api.get('/cart');
    return res.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const res = await api.post('/cart/add', { productId, quantity });
    return res.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const res = await api.put('/cart/update', { productId, quantity });
    return res.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const res = await api.delete('/cart/remove', { data: { productId } });
    return res.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const res = await api.delete('/cart/clear');
    return res.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

