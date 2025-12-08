import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { getDashboardStats, getAllOrders, updateOrderStatus } from '../api/admin';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    images: [],
  });
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error' | ''

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, productsResponse, ordersResponse] = await Promise.all([
        getDashboardStats(),
        getProducts(),
        getAllOrders().catch((error) => {
          console.error('Error fetching orders:', error);
          console.error('Error response:', error?.response?.data);
          console.error('Error status:', error?.response?.status);
          // Show error message but don't break the dashboard
          const errorMsg = error?.response?.data?.message || error?.message || 'Failed to load orders. Please check if you are logged in as admin.';
          setMessage({ 
            text: errorMsg, 
            type: 'error' 
          });
          setTimeout(() => setMessage({ text: '', type: '' }), 5000);
          return []; // Return empty array on error
        }),
      ]);
      
      console.log('Orders response:', ordersResponse);
      console.log('Orders count:', ordersResponse?.length);
      
      // Transform backend stats to match UI expectations
      const stats = {
        totalSales: statsResponse.totalSales || 0,
        totalOrders: statsResponse.totalOrders || 0,
        totalProducts: productsResponse.length || 0,
        totalRevenue: statsResponse.totalSales || 0,
        salesGrowth: 0, // Calculate if needed
        ordersGrowth: 0, // Calculate if needed
        revenueGrowth: 0, // Calculate if needed
      };
      setDashboardStats(stats);
      
      // Generate sales data from orders (last 6 months)
      const salesData = generateSalesDataFromOrders(ordersResponse);
      setSalesData(salesData);
      
      // getProducts already returns the products array
      const productsData = Array.isArray(productsResponse) ? productsResponse : [];
      
      // normalize products for UI
      const normalized = productsData.map((p) => ({
        id: p._id || p.slug || Date.now(),
        slug: p.slug,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        images: p.images || [],
        sales: p.sales || 0,
        status: p.stock > 0 ? 'active' : 'out_of_stock',
      }));
      setProducts(normalized);
      
      // Ensure orders is an array
      const ordersArray = Array.isArray(ordersResponse) ? ordersResponse : [];
      console.log('Setting orders:', ordersArray);
      console.log('Orders array length:', ordersArray.length);
      if (ordersArray.length > 0) {
        console.log('First order sample:', ordersArray[0]);
      }
      setOrders(ordersArray);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ text: 'Failed to load dashboard data. Please try again.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate sales data from orders
  const generateSalesDataFromOrders = (orders) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesByMonth = {};
    
    // Initialize all months with 0
    months.forEach(month => {
      salesByMonth[month] = 0;
    });
    
    // Calculate sales from orders
    if (Array.isArray(orders)) {
      orders.forEach(order => {
        if (order.createdAt) {
          const date = new Date(order.createdAt);
          const month = months[date.getMonth()];
          if (month && order.totalPrice) {
            salesByMonth[month] = (salesByMonth[month] || 0) + order.totalPrice;
          }
        }
      });
    }
    
    // Return last 6 months
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last6Months.push({
        month: months[monthIndex],
        sales: salesByMonth[months[monthIndex]] || 0
      });
    }
    
    return last6Months;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      // Validation
      if (!productForm.name || !productForm.category || !productForm.price || productForm.stock === '') {
        setMessage({ text: 'Please fill in all required fields (Name, Category, Price, Stock)', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        return;
      }

      const payload = {
        name: productForm.name.trim(),
        category: productForm.category,
        price: Number(productForm.price) || 0,
        stock: Number(productForm.stock) || 0,
        description: productForm.description || '',
      };

      if (payload.price <= 0) {
        setMessage({ text: 'Price must be greater than 0', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        return;
      }

      if (payload.stock < 0) {
        setMessage({ text: 'Stock cannot be negative', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        return;
      }

      const hasFiles = productForm.images && productForm.images.length > 0 && 
                       productForm.images[0] instanceof File;

      if (editingProduct && editingProduct.slug) {
        let response;
        if (hasFiles) {
          const fd = new FormData();
          fd.append('name', payload.name);
          fd.append('category', payload.category);
          fd.append('price', String(payload.price));
          fd.append('stock', String(payload.stock));
          fd.append('description', payload.description);
          productForm.images.forEach((file) => {
            if (file instanceof File) {
              fd.append('images', file);
            }
          });
          response = await updateProduct(editingProduct.slug, fd);
        } else {
          response = await updateProduct(editingProduct.slug, payload);
        }
        
        // createProduct/updateProduct already returns the product object
        const updated = response;
        const normalized = {
          id: updated._id || updated.slug,
          slug: updated.slug,
          name: updated.name,
          category: updated.category,
          price: updated.price,
          stock: updated.stock,
          images: updated.images || [],
          sales: updated.sales || 0,
          status: updated.stock > 0 ? 'active' : 'out_of_stock',
        };
        setProducts(products.map((p) => (p.slug === editingProduct.slug || p.id === editingProduct.id ? normalized : p)));
        setMessage({ text: 'Product updated successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      } else {
        let response;
        if (hasFiles) {
          const fd = new FormData();
          fd.append('name', payload.name);
          fd.append('category', payload.category);
          fd.append('price', String(payload.price));
          fd.append('stock', String(payload.stock));
          fd.append('description', payload.description);
          productForm.images.forEach((file) => {
            if (file instanceof File) {
              fd.append('images', file);
            }
          });
          response = await createProduct(fd);
        } else {
          response = await createProduct(payload);
        }
        
        // createProduct already returns the product object
        const created = response;
        if (!created || !created.slug) {
          throw new Error('Failed to create product: Invalid response from server');
        }
        
        const normalized = {
          id: created._id || created.slug || Date.now(),
          slug: created.slug,
          name: created.name,
          category: created.category,
          price: created.price,
          stock: created.stock,
          images: created.images || [],
          sales: created.sales || 0,
          status: created.stock > 0 ? 'active' : 'out_of_stock',
        };
        setProducts([...products, normalized]);
        setMessage({ text: 'Product created successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: '', price: '', stock: '', description: '', images: [] });
      // Reload products to ensure consistency
      loadDashboardData();
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save product. Please try again.';
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      category: product.category || '',
      price: product.price != null ? String(product.price) : '',
      stock: product.stock != null ? String(product.stock) : '',
      description: product.description || '',
      images: product.images || [],
    });
    setShowProductModal(true);
  };

  const reloadOrders = async () => {
    try {
      const updatedOrders = await getAllOrders();
      console.log('Reloaded orders:', updatedOrders);
      const ordersArray = Array.isArray(updatedOrders) ? updatedOrders : [];
      setOrders(ordersArray);
      return ordersArray;
    } catch (error) {
      console.error('Error reloading orders:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to reload orders';
      setMessage({ text: errorMsg, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return [];
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Reload orders to get updated data
      await reloadOrders();
      setMessage({ text: 'Order status updated successfully', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update order status';
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      throw error; // Re-throw to let OrdersManagement handle it
    }
  };

  const handleDeleteProduct = async (product) => {
    setMessage({ text: '', type: '' });
    const identifier = product.slug || product.id;
    if (!identifier) {
      setMessage({ text: 'Cannot delete product: Missing identifier', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(identifier);
        setProducts(products.filter(p => p.id !== product.id && p.slug !== product.slug));
        setMessage({ text: 'Product deleted successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        // Reload products to ensure consistency
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting product:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete product. Please try again.';
        setMessage({ text: errorMessage, type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
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
        return <DashboardHome stats={dashboardStats} salesData={salesData} products={products} orders={orders} />;
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
        return <OrdersManagement orders={orders} onUpdateOrder={handleUpdateOrderStatus} onMessage={setMessage} onReload={reloadOrders} />;
      case 'analytics':
        return <AnalyticsView salesData={salesData} stats={dashboardStats} />;
      default:
        return <DashboardHome stats={dashboardStats} salesData={salesData} products={products} orders={orders} />;
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
            {message.text && (
              <p className={`text-xs mt-1 ${
                message.type === 'success' 
                  ? 'text-green-600' 
                  : message.type === 'error'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {message.text}
              </p>
            )}
          </div>
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
              setProductForm({ name: '', category: '', price: '', stock: '', description: '', images: [] });
          }}
        />
      )}
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ stats, salesData, products, orders }) => {
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
            const maxSales = Math.max(...salesData.map(d => d.sales), 1);
            const height = maxSales > 0 ? (data.sales / maxSales) * 100 : 0;
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
            {orders && orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order._id?.slice(-6) || 'N/A'}</p>
                    <p className="text-sm text-gray-600">
                      {order.user?.name || order.user?.email || 'Guest'}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-teal-600">
                    ${order.totalPrice?.toFixed(2) || '0.00'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Low Stock Alert</h2>
          <div className="space-y-3">
            {products && products.filter(p => p.stock <= 5 && p.stock > 0).length > 0 ? (
              products
                .filter(p => p.stock <= 5 && p.stock > 0)
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-red-600">Stock: {item.stock}</p>
                    </div>
                    <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
                      Restock
                    </button>
                  </div>
                ))
            ) : products && products.filter(p => p.stock === 0).length > 0 ? (
              products
                .filter(p => p.stock === 0)
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-red-600">Out of Stock</p>
                    </div>
                    <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
                      Restock
                    </button>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No low stock items</p>
            )}
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
                        onClick={() => onDelete(product)}
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
              const maxSales = Math.max(...salesData.map(d => d.sales), 1);
              const height = maxSales > 0 ? (data.sales / maxSales) * 100 : 0;
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
const OrdersManagement = ({ orders, onUpdateOrder, onMessage, onReload }) => {
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [localMessages, setLocalMessages] = useState({});

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setLocalMessages({ ...localMessages, [orderId]: '' });
    
    try {
      await onUpdateOrder(orderId, newStatus);
      setLocalMessages({ ...localMessages, [orderId]: { text: 'Status updated successfully', type: 'success' } });
      setTimeout(() => {
        setLocalMessages(prev => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
      }, 5000);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update status';
      setLocalMessages({ ...localMessages, [orderId]: { text: errorMessage, type: 'error' } });
      setTimeout(() => {
        setLocalMessages(prev => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
      }, 5000);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (!orders) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-2">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
          {onReload && (
            <button
              onClick={async () => {
                await onReload();
              }}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
            >
              Refresh Orders
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-2">No orders found</p>
          <p className="text-sm text-gray-400">
            No orders in the database yet. Orders will appear here once customers place orders.
          </p>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        {onReload && (
          <button
            onClick={async () => {
              await onReload();
            }}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
          >
            Refresh Orders
          </button>
        )}
      </div>

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
              {orders.map((order) => {
                const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                const customerName = order.user?.name || order.user?.email || 'Guest';
                const firstProduct = order.products && order.products.length > 0 
                  ? (order.products[0].product?.name || 'Multiple items')
                  : 'N/A';
                const currentStatus = order.orderStatus || order.status || 'pending';
                const orderMessage = localMessages[order._id];
                
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order._id?.slice(-6) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.products?.length > 1 
                        ? `${firstProduct} + ${order.products.length - 1} more`
                        : firstProduct}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${order.totalPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingOrderId === order._id}
                          className={`text-xs font-medium rounded px-2 py-1 border transition-colors ${
                            currentStatus === 'delivered' || currentStatus === 'completed'
                              ? 'bg-green-50 text-green-800 border-green-200'
                              : currentStatus === 'cancelled'
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : currentStatus === 'processing' || currentStatus === 'shipped'
                              ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                              : 'bg-gray-50 text-gray-800 border-gray-200'
                          } ${updatingOrderId === order._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {orderMessage && (
                          <p className={`text-xs ${
                            orderMessage.type === 'success' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {orderMessage.text}
                          </p>
                        )}
                        {updatingOrderId === order._id && (
                          <p className="text-xs text-gray-500">Updating...</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{orderDate}</td>
                  </tr>
                );
              })}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={product.description}
              onChange={(e) => onChange('description', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              rows={3}
            />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images {!editing && <span className="text-gray-500 text-xs">(Optional)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onChange('images', files);
              }}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
            />
            {product.images && product.images.length > 0 && (
              <div className="mt-2 space-y-1">
                {product.images.map((f, i) => (
                  <div key={i} className="text-xs text-gray-600">
                    {f instanceof File ? f.name : (typeof f === 'string' ? f : f.url || f.public_id || 'image')}
                  </div>
                ))}
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">You can upload up to 5 images</p>
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

