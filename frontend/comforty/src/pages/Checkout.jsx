import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../components/Navbar';
import Footer from '../components/fotter';
import { getCart } from '../api/cart';
import { checkout, confirmPayment } from '../api/orders';

// Initialize Stripe
// For testing: Get your test publishable key from https://dashboard.stripe.com/test/apikeys
// Add it to your .env file as: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
// Or use the fallback test key below for quick testing
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51Qa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2';
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  console.warn('⚠️ Using fallback test key. For production, add VITE_STRIPE_PUBLISHABLE_KEY to your .env file');
  console.warn('Get your test key from: https://dashboard.stripe.com/test/apikeys');
}

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'cod', // Default to COD
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCart();
      if (!cartData || !cartData.items || cartData.items.length === 0) {
        navigate('/cart');
        return;
      }
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      setMessage({ 
        text: error?.response?.data?.message || 'Failed to load cart. Please login.', 
        type: 'error' 
      });
      setTimeout(() => {
        navigate('/cart');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // This will be handled by CheckoutForm component
  const handleCODSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      setMessage({ text: 'Please fill in all shipping address fields', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return;
    }

    setProcessing(true);
    setMessage({ text: '', type: '' });

    try {
      const shippingAddress = {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      };

      const result = await checkout(shippingAddress, 'cod');
      
      setMessage({ 
        text: result.message || 'Order placed successfully! Payment will be collected on delivery.', 
        type: 'success' 
      });
      
      // Clear cart by reloading it (it should be empty after checkout)
      try {
        await loadCart();
      } catch (err) {
        console.log('Cart already cleared');
      }
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error during checkout:', error);
      setMessage({ 
        text: error?.response?.data?.message || 'Failed to process checkout. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    } finally {
      setProcessing(false);
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
          <div className="text-gray-500">Loading checkout...</div>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Checkout</h1>
          
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <Elements stripe={stripePromise} options={{ locale: 'en' }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Shipping Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.paymentMethod === 'cod' 
                      ? 'border-teal-500 bg-teal-50' 
                      : 'border-gray-200 hover:border-teal-500'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.paymentMethod === 'card' 
                      ? 'border-teal-500 bg-teal-50' 
                      : 'border-gray-200 hover:border-teal-500'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Credit/Debit Card</span>
                      <p className="text-sm text-gray-600">Pay securely with Stripe</p>
                    </div>
                  </label>
                </div>

                {/* Stripe Card Element - Only show when card is selected */}
                {formData.paymentMethod === 'card' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    {!stripeKey ? (
                      <div className="p-3 border-2 border-red-200 rounded-lg bg-red-50">
                        <p className="text-sm text-red-700 mb-2">
                          Stripe is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.
                        </p>
                        <p className="text-xs text-red-600">
                          Get your test key from: <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard</a>
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Test Card Information */}
                        <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                          <p className="text-xs font-semibold text-blue-900 mb-2">🧪 TEST MODE - Use these test cards:</p>
                          <div className="text-xs text-blue-800 space-y-1">
                            <p><strong>Success:</strong> 4242 4242 4242 4242</p>
                            <p><strong>Decline:</strong> 4000 0000 0000 0002</p>
                            <p><strong>3D Secure:</strong> 4000 0025 0000 3155</p>
                            <p className="mt-2">Use any future expiry date, any 3-digit CVC, and any ZIP code</p>
                          </div>
                        </div>
                        
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Details
                        </label>
                        <div className="p-3 border-2 border-gray-200 rounded-lg bg-white">
                          <CheckoutForm 
                            formData={formData}
                            setFormData={setFormData}
                            cart={cart}
                            setMessage={setMessage}
                            setProcessing={setProcessing}
                            navigate={navigate}
                            onPaymentSuccess={loadCart}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => {
                    const product = item.product;
                    return (
                      <div key={product?._id || product?.id} className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={product?.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                            alt={product?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product?.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × ${product?.price?.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ${((product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t-2 border-gray-200 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === 'cod' && (
                  <button
                    type="button"
                    onClick={handleCODSubmit}
                    disabled={processing}
                    className="w-full px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Place Order (COD)'}
                  </button>
                )}
              </div>
            </div>
            </div>
          </Elements>
        </div>
      </div>

      <Footer />
    </>
  );
};

// Stripe Checkout Form Component
const CheckoutForm = ({ formData, setFormData, cart, setMessage, setProcessing, navigate, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setMessage({ 
        text: 'Stripe is not loaded. Please refresh the page and try again.', 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return;
    }

    // Validation
    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      setMessage({ text: 'Please fill in all shipping address fields', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return;
    }

    setProcessingPayment(true);
    setProcessing(true);
    setMessage({ text: '', type: '' });

    try {
      const shippingAddress = {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      };

      // Step 1: Create order and get client secret
      const result = await checkout(shippingAddress, 'card');
      
      if (!result.clientSecret) {
        throw new Error('Failed to initialize payment');
      }

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setMessage({ 
          text: error.message || 'Payment failed. Please try again.', 
          type: 'error' 
        });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded - confirm with backend to update stock and clear cart
        try {
          await confirmPayment(result.orderId);
          setMessage({ 
            text: 'Payment successful! Order placed successfully.', 
            type: 'success' 
          });
          
          // Call parent's payment success handler to refresh cart
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
          
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError);
          // Payment succeeded but confirmation failed - webhook will handle it
          setMessage({ 
            text: 'Payment successful! Your order is being processed.', 
            type: 'success' 
          });
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      } else {
        // Payment is processing or requires action
        setMessage({ 
          text: `Payment status: ${paymentIntent?.status || 'processing'}. Please wait...`, 
          type: 'info' 
        });
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setMessage({ 
        text: error?.response?.data?.message || error?.message || 'Failed to process payment. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    } finally {
      setProcessingPayment(false);
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleCardSubmit} className="space-y-4">
      <CardElement options={cardElementOptions} />
      <button
        type="submit"
        disabled={!stripe || processingPayment}
        className="w-full mt-4 px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {processingPayment ? 'Processing Payment...' : `Pay $${cart?.items?.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0).toFixed(2) || '0.00'}`}
      </button>
    </form>
  );
};

export default Checkout;

