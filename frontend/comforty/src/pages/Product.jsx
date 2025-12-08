import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/fotter';
import { getProducts } from '../api/products';
import { addToCart } from '../api/cart';

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        
        // Normalize products for UI
        const normalized = productsData.map((p) => ({
          id: p._id || p.slug,
          slug: p.slug,
          title: p.name,
          price: p.price,
          oldPrice: null, // Add if you have discount prices
          tag: p.isAvailable ? (p.stock <= 10 ? 'Sales' : null) : null,
          image: p.images && p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/600',
          category: p.category,
          stock: p.stock,
          isAvailable: p.isAvailable,
        }));
        
        setProducts(normalized);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(normalized.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Read category from URL params on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
      setActiveFilter('ALL');
    }
  }, [searchParams, categories]);

  // Filter products based on active filter
  const getFilteredProducts = () => {
    let filtered = products;
    
    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Apply additional filters
    switch (activeFilter) {
      case 'NEWEST':
        // Sort by creation date (if available) or return as is
        return filtered.slice().sort((a, b) => {
          // If you have createdAt in your product data, use it
          return 0; // For now, just return filtered
        });
      case 'TRENDING':
        return filtered.filter(p => p.tag === 'Sales' || p.stock <= 10);
      case 'BEST SELLERS':
        // Sort by sales or stock (lower stock might indicate more sales)
        return filtered.slice().sort((a, b) => (a.stock || 0) - (b.stock || 0)).slice(0, 12);
      case 'FEATURED':
        return filtered.filter(p => p.tag === 'Sales' || p.isAvailable);
      default:
        return filtered;
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <>
      <Navbar />
      
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of premium furniture designed for comfort and style
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setActiveFilter('ALL');
                  setSearchParams({});
                }}
                className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  selectedCategory === null && activeFilter === 'ALL'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setActiveFilter('ALL');
                    setSearchParams({ category: category });
                  }}
                  className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Tabs */}
          {!selectedCategory && (
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 text-gray-600 text-xs sm:text-sm font-medium">
              {['ALL', 'NEWEST', 'TRENDING', 'BEST SELLERS', 'FEATURED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`pb-1 border-b-2 transition whitespace-nowrap ${
                    activeFilter === tab
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Category Section Header */}
          {selectedCategory && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
                {selectedCategory}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 text-center mt-2">
                {filteredProducts.length} Products
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 border border-gray-100 group"
                >
                  <Link to={`/product/${product.slug || product.id}`}>
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-lg mb-3">
                      {product.tag && (
                        <span
                          className={`absolute top-2 sm:top-3 left-2 sm:left-3 text-xs px-2 py-1 rounded-md text-white z-10 ${
                            product.tag === 'New' ? 'bg-teal-500' : 'bg-orange-500'
                          }`}
                        >
                          {product.tag}
                        </span>
                      )}

                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <p className="text-sm sm:text-base text-gray-700 font-medium mb-2 line-clamp-2">
                      {product.title}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-base sm:text-lg text-gray-900 font-bold">${product.price}</p>
                      {product.oldPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          ${product.oldPrice}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="space-y-1">
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          await addToCart(product.id, 1);
                          setMessages({ ...messages, [product.id]: { text: 'Added to cart!', type: 'success' } });
                          setTimeout(() => {
                            setMessages(prev => {
                              const updated = { ...prev };
                              delete updated[product.id];
                              return updated;
                            });
                          }, 3000);
                        } catch (error) {
                          if (error?.response?.status === 401) {
                            navigate('/login');
                          } else {
                            setMessages({ ...messages, [product.id]: { text: 'Failed to add to cart', type: 'error' } });
                            setTimeout(() => {
                              setMessages(prev => {
                                const updated = { ...prev };
                                delete updated[product.id];
                                return updated;
                              });
                            }, 3000);
                          }
                        }
                      }}
                      className="w-full bg-gray-100 hover:bg-teal-500 hover:text-white transition-colors py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <span>🛒</span>
                      <span>Add to Cart</span>
                    </button>
                    {messages[product.id] && (
                      <p className={`text-xs text-center ${
                        messages[product.id].type === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {messages[product.id].text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <p className="text-lg sm:text-xl text-gray-600">No products found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Product;

