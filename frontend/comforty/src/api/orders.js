import api from './axios';

export const checkout = async (shippingAddress, paymentMethod) => {
  try {
    const res = await api.post('/orders/checkout', {
      shippingAddress,
      paymentMethod
    });
    return res.data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const res = await api.get('/orders/my-orders');
    return res.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const confirmPayment = async (orderId) => {
  try {
    const res = await api.post('/orders/confirm-payment', { orderId });
    return res.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

