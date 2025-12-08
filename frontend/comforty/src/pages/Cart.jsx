import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/fotter';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../api/cart';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      setMessage({ 
        text: error?.response?.data?.message || 'Failed to load cart. Please login.', 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const updatedCart = await updateCartItem(productId, newQuantity);
      setCart(updatedCart);
      setMessage({ text: 'Cart updated successfully', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error updating cart:', error);
      setMessage({ 
        text: error?.response?.data?.message || 'Failed to update cart', 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = await removeFromCart(productId);
      setCart(updatedCart);
      setMessage({ text: 'Item removed from cart', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error removing item:', error);
      setMessage({ 
        text: error?.response?.data?.message || 'Failed to remove item', 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        setCart({ items: [] });
        setMessage({ text: 'Cart cleared', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        console.error('Error clearing cart:', error);
        setMessage({ 
          text: error?.response?.data?.message || 'Failed to clear cart', 
          type: 'error' 
        });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-gray-500">Loading cart...</div>
        </div>
        <Footer />
      </>
    );
  }

  const total = calculateTotal();
  const itemCount = cart?.items?.length || 0;

  return (
    <>
      <Navbar />
      
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>
          
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {!cart || itemCount === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
              <Link 
                to="/product" 
                className="inline-block px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => {
                  const product = item.product;
                  const imageUrl = product?.images?.[0]?.url || 'https://via.placeholder.com/300';
                  
                  return (
                    <div key={item.product?._id || item.product?.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <Link 
                          to={`/product/${product?.slug || product?._id}`}
                          className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <img 
                            src={imageUrl} 
                            alt={product?.name || 'Product'} 
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link 
                                to={`/product/${product?.slug || product?._id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors"
                              >
                                {product?.name || 'Product'}
                              </Link>
                              <p className="text-lg font-bold text-teal-600 mt-1">
                                ${product?.price?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(product?._id || product?.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <div className="flex items-center border-2 border-gray-200 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(product?._id || product?.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 text-gray-900 font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(product?._id || product?.id, item.quantity + 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm text-gray-600 ml-auto">
                              Subtotal: <span className="font-semibold">${((product?.price || 0) * item.quantity).toFixed(2)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Clear Cart Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleClearCart}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold">Free</span>
                    </div>
                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/product"
                    className="block mt-4 text-center text-teal-600 hover:text-teal-700 transition-colors text-sm font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;

