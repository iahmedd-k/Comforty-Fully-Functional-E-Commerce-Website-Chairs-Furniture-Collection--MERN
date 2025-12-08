import api from './axios';

export const getDashboardStats = async () => {
  try {
    const res = await api.get('/admin/dashboard');
    return res.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const res = await api.get('/orders');
    return res.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
  try {
    const res = await api.put(`/orders/${orderId}`, {
      orderStatus,
      paymentStatus: paymentStatus || undefined
    });
    return res.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

