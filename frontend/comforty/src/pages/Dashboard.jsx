import React, { useState, useEffect } from 'react';

// Dummy API functions
const dummyAPI = {
  getDashboardStats: async () => {
    return {
      totalSales: 125430,
      totalOrders: 1248,
      totalProducts: 156,
      totalRevenue: 245890,
      salesGrowth: 12.5,
      ordersGrowth: 8.3,
      revenueGrowth: 15.2,
    };
  },
  getSalesData: async () => {
    return [
      { month: 'Jan', sales: 12000 },
      { month: 'Feb', sales: 19000 },
      { month: 'Mar', sales: 15000 },
      { month: 'Apr', sales: 22000 },
      { month: 'May', sales: 18000 },
      { month: 'Jun', sales: 25000 },
    ];
  },
  getProducts: async () => {
    return [
      { id: 1, name: 'Classic Wing Chair', category: 'Wing Chair', price: 299, stock: 45, sales: 120, status: 'active' },
      { id: 2, name: 'Oak Wooden Chair', category: 'Wooden Chair', price: 89, stock: 32, sales: 89, status: 'active' },
      { id: 3, name: 'Ergonomic Desk Chair', category: 'Desk Chair', price: 199, stock: 0, sales: 156, status: 'out_of_stock' },
      { id: 4, name: 'Leather Recliner', category: 'Recliner', price: 599, stock: 12, sales: 45, status: 'active' },
      { id: 5, name: 'Modern Dining Chair', category: 'Dining Chair', price: 89, stock: 67, sales: 234, status: 'active' },
      { id: 6, name: 'Premium Office Chair', category: 'Office Chair', price: 249, stock: 23, sales: 78, status: 'active' },
    ];
  },
  addProduct: async (product) => {
    return { ...product, id: Date.now(), status: 'active' };
  },
  updateProduct: async (id, product) => {
    return { id, ...product };
  },
  deleteProduct: async (id) => {
    return { success: true, id };
  },
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [stats, sales, productsData] = await Promise.all([
        dummyAPI.getDashboardStats(),
        dummyAPI.getSalesData(),
        dummyAPI.getProducts(),
      ]);
      setDashboardStats(stats);
      setSalesData(sales);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const updated = await dummyAPI.updateProduct(editingProduct.id, productForm);
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        const newProduct = await dummyAPI.addProduct(productForm);
        setProducts([...products, newProduct]);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: '', price: '', stock: '' });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dummyAPI.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const categories = ['Wing Chair', 'Wooden Chair', 'Desk Chair', 'Park Bench', 'Office Chair', 'Dining Chair', 'Recliner'];

  const sidebarTabs = [
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '🛋️' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'sales', label: 'Sales', icon: '💰' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <DashboardHome stats={dashboardStats} salesData={salesData} />;
      case 'products':
        return (
          <ProductsManagement
            products={products}
            onAdd={() => {
              setEditingProduct(null);
              setProductForm({ name: '', category: '', price: '', stock: '' });
              setShowProductModal(true);
            }}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        );
      case 'inventory':
        return <InventoryManagement products={products} />;
      case 'sales':
        return <SalesManagement salesData={salesData} stats={dashboardStats} />;
      case 'orders':
        return <OrdersManagement />;
      case 'analytics':
        return <AnalyticsView salesData={salesData} stats={dashboardStats} />;
      default:
        return <DashboardHome stats={dashboardStats} salesData={salesData} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F3]">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r-2 border-gray-200 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 border-b-2 border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-800">Comforty</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="mt-4">
          {sidebarTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {sidebarOpen && <span className="font-medium">{tab.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="text-gray-700 font-medium">Admin</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={productForm}
          editing={!!editingProduct}
          categories={categories}
          onChange={(field, value) => setProductForm({ ...productForm, [field]: value })}
          onSave={handleAddProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
            setProductForm({ name: '', category: '', price: '', stock: '' });
          }}
        />
      )}
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ stats, salesData }) => {
  if (!stats) return null;

  const statCards = [
    { label: 'Total Sales', value: `$${stats.totalSales.toLocaleString()}`, growth: `+${stats.salesGrowth}%`, icon: '💰', color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), growth: `+${stats.ordersGrowth}%`, icon: '📋', color: 'bg-green-500' },
    { label: 'Total Products', value: stats.totalProducts, growth: null, icon: '🛋️', color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, growth: `+${stats.revenueGrowth}%`, icon: '💵', color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-teal-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              {stat.growth && (
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.growth}
                </span>
              )}
            </div>
            <h3 className="text-sm text-gray-600 mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Overview</h2>
        <div className="h-64 flex items-end justify-between space-x-2">
          {salesData.map((data, index) => {
            const maxSales = Math.max(...salesData.map(d => d.sales));
            const height = (data.sales / maxSales) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-teal-500 rounded-t-lg hover:bg-teal-600 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`${data.month}: $${data.sales.toLocaleString()}`}
                />
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{1000 + i}</p>
                  <p className="text-sm text-gray-600">Customer Name</p>
                </div>
                <span className="text-sm font-medium text-teal-600">$299</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Low Stock Alert</h2>
          <div className="space-y-3">
            {[
              { name: 'Ergonomic Desk Chair', stock: 0 },
              { name: 'Premium Office Chair', stock: 12 },
              { name: 'Leather Recliner', stock: 5 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-red-600">Stock: {item.stock}</p>
                </div>
                <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement = ({ products, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <button
          onClick={onAdd}
          className="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sales</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sales}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status === 'active' ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Inventory Management Component
const InventoryManagement = ({ products }) => {
  const lowStockProducts = products.filter(p => p.stock < 20);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-sm text-gray-600 mb-2">Low Stock</h3>
          <p className="text-3xl font-bold text-orange-600">{lowStockProducts.length}</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-sm text-gray-600 mb-2">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600">{outOfStockProducts.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Stock Levels</h3>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Stock: {product.stock}</span>
                    <span className="text-xs text-gray-600">100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        product.stock > 20 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(product.stock / 100) * 100}%` }}
                    />
                  </div>
                </div>
                <button className="px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors">
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sales Management Component
const SalesManagement = ({ salesData, stats }) => {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Sales</span>
              <span className="text-xl font-bold text-gray-900">${stats.totalSales.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Growth</span>
              <span className="text-lg font-bold text-green-600">+{stats.salesGrowth}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Sales</h3>
          <div className="h-48 flex items-end justify-between space-x-2">
            {salesData.map((data, index) => {
              const maxSales = Math.max(...salesData.map(d => d.sales));
              const height = (data.sales / maxSales) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-teal-500 rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders Management Component
const OrdersManagement = () => {
  const orders = [
    { id: 1001, customer: 'John Doe', product: 'Classic Wing Chair', amount: 299, status: 'completed', date: '2024-01-15' },
    { id: 1002, customer: 'Jane Smith', product: 'Oak Wooden Chair', amount: 89, status: 'pending', date: '2024-01-16' },
    { id: 1003, customer: 'Mike Johnson', product: 'Ergonomic Desk Chair', amount: 199, status: 'processing', date: '2024-01-17' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>

      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Analytics View Component
const AnalyticsView = ({ salesData, stats }) => {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Chart</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {salesData.map((data, index) => {
              const maxSales = Math.max(...salesData.map(d => d.sales));
              const height = (data.sales / maxSales) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-teal-500 rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="text-xl font-bold text-gray-900">3.2%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Average Order Value</span>
              <span className="text-xl font-bold text-gray-900">$197</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Customer Retention</span>
              <span className="text-xl font-bold text-gray-900">68%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Modal Component
const ProductModal = ({ product, editing, categories, onChange, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={product.category}
              onChange={(e) => onChange('category', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => onChange('price', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                value={product.stock}
                onChange={(e) => onChange('stock', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
            >
              {editing ? 'Update' : 'Add'} Product
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;

