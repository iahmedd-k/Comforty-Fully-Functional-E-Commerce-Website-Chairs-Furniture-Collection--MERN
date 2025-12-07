import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/fotter';

// Dummy API functions
const dummyAPI = {
  getUserProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      createdAt: '2023-01-15',
    };
  },
  getUserOrders: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 'ORD-1001',
        date: '2024-01-15',
        status: 'Delivered',
        total: 299,
        items: [
          { name: 'Classic Wing Chair', quantity: 1, price: 299, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=200' },
        ],
      },
      {
        id: 'ORD-1002',
        date: '2024-01-10',
        status: 'Processing',
        total: 448,
        items: [
          { name: 'Oak Wooden Chair', quantity: 2, price: 89, image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=200' },
          { name: 'Modern Desk Chair', quantity: 1, price: 229, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200' },
        ],
      },
      {
        id: 'ORD-1003',
        date: '2024-01-05',
        status: 'Shipped',
        total: 599,
        items: [
          { name: 'Leather Recliner', quantity: 1, price: 599, image: 'https://images.unsplash.com/photo-1505692794401-34d4982f5163?w=200' },
        ],
      },
      {
        id: 'ORD-1004',
        date: '2023-12-28',
        status: 'Delivered',
        total: 179,
        items: [
          { name: 'Wooden Park Bench', quantity: 1, price: 179, image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=200' },
        ],
      },
    ];
  },
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [userData, ordersData] = await Promise.all([
        dummyAPI.getUserProfile(),
        dummyAPI.getUserOrders(),
      ]);
      setUser(userData);
      setOrders(ordersData);
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        street: userData.address.street,
        city: userData.address.city,
        state: userData.address.state,
        zipCode: userData.address.zipCode,
        country: userData.address.country,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Save user data logic here
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information and orders</p>
          </div>

          {/* Tabs */}
          <div className="border-b-2 border-gray-200 mb-6 sm:mb-8">
            <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              {['profile', 'orders'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'profile' ? 'Profile Information' : 'Order History'}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sm:p-8 text-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl sm:text-4xl text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Information</h3>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors text-sm sm:text-base"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditMode(false);
                            loadUserData();
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors text-sm sm:text-base"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="pt-4 border-t-2 border-gray-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                          <input
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            disabled={!editMode}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              disabled={!editMode}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                            <input
                              type="text"
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              disabled={!editMode}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                            <input
                              type="text"
                              value={formData.zipCode}
                              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                              disabled={!editMode}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                            <input
                              type="text"
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              disabled={!editMode}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab Content */}
          {activeTab === 'orders' && (
            <div className="space-y-4 sm:space-y-6">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                  <p className="text-gray-600">No orders found</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-gray-900 text-sm sm:text-base">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">Total Amount</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-900">${order.total}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;

