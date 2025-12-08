import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import { addToCart } from "../api/cart";

export default function Our_Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [activeFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await getProducts();
      
      // Normalize products for UI
      const normalized = allProducts.map(p => ({
        id: p._id || p.slug,
        slug: p.slug,
        title: p.name,
        price: p.price,
        oldPrice: null,
        tag: p.stock <= 10 ? 'Sales' : null,
        image: p.images && p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/600',
        category: p.category,
        stock: p.stock,
        isAvailable: p.isAvailable,
        createdAt: p.createdAt,
      }));

      // Apply filters
      let filtered = normalized;
      switch (activeFilter) {
        case 'NEWEST':
          filtered = normalized.slice().sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
          });
          break;
        case 'TRENDING':
          filtered = normalized.filter(p => p.tag === 'Sales' || p.stock <= 10);
          break;
        case 'BEST SELLERS':
          filtered = normalized.slice().sort((a, b) => (a.stock || 0) - (b.stock || 0)).slice(0, 8);
          break;
        case 'FEATURED':
          filtered = normalized.filter(p => p.tag === 'Sales' || p.isAvailable);
          break;
        default:
          filtered = normalized;
      }

      setProducts(filtered.slice(0, 8)); // Show first 8 products
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-6 min-h-screen bg-white py-12">
      <h2 className="text-center text-3xl font-semibold mb-8">Our Products</h2>

      {/* Filter Tabs */}
      <div className="flex justify-center space-x-6 mb-10 text-gray-600 text-sm font-medium">
        {['ALL', 'NEWEST', 'TRENDING', 'BEST SELLERS', 'FEATURED'].map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveFilter(tab)}
            className={`pb-1 border-b-2 transition ${
              activeFilter === tab
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug || p.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 border border-gray-100 block"
              >
                <div className="relative w-full h-56 overflow-hidden rounded-lg">
                  {p.tag && (
                    <span
                      className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-md text-white ${
                        p.tag === 'New' ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                    >
                      {p.tag}
                    </span>
                  )}

                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <p className="mt-3 text-gray-700 text-sm">{p.title}</p>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-black font-semibold">${p.price}</p>
                  {p.oldPrice && (
                    <span className="text-gray-400 line-through text-sm">${p.oldPrice}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await addToCart(p.id, 1);
                        setMessages({ ...messages, [p.id]: { text: 'Added to cart!', type: 'success' } });
                        setTimeout(() => {
                          setMessages(prev => {
                            const updated = { ...prev };
                            delete updated[p.id];
                            return updated;
                          });
                        }, 3000);
                      } catch (error) {
                        if (error?.response?.status === 401) {
                          navigate('/login');
                        } else {
                          setMessages({ ...messages, [p.id]: { text: 'Failed to add to cart', type: 'error' } });
                          setTimeout(() => {
                            setMessages(prev => {
                              const updated = { ...prev };
                              delete updated[p.id];
                              return updated;
                            });
                          }, 3000);
                        }
                      }
                    }}
                    className="mt-3 w-full bg-gray-100 hover:bg-gray-200 transition py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                  >
                    🛒 Add to Cart
                  </button>
                  {messages[p.id] && (
                    <p className={`text-xs text-center ${
                      messages[p.id].type === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {messages[p.id].text}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {/* View All Button */}
          <div className="flex justify-end mt-8">
            <Link 
              to="/product" 
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
