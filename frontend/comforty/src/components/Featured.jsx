import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { getProducts } from "../api/products";
import { addToCart } from "../api/cart";
import { addToWishlist, isInWishlist } from "../api/wishlist";

export default function Featured() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Fetch products and get first 4 as featured
      const allProducts = await getProducts();
      // Get products with low stock or available as featured
      const featured = allProducts
        .filter(p => p.isAvailable !== false)
        .slice(0, 4)
        .map(p => ({
          id: p._id || p.slug,
          slug: p.slug,
          title: p.name,
          price: p.price,
          oldPrice: null,
          tag: p.stock <= 10 ? "Sale" : "New",
          tagColor: p.stock <= 10 ? "bg-orange-500" : "bg-green-500",
          image: p.images && p.images.length > 0 ? p.images[0].url : "https://via.placeholder.com/800",
          averageRating: p.averageRating || 0,
        }));
      setProducts(featured);
    } catch (error) {
      console.error('Error loading featured products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title + Arrows */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Products
          </h2>

          {/* Navigation icons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrev}
              disabled={products.length === 0}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-[#007580] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="text-xl text-gray-600" />
            </button>

            <button 
              onClick={handleNext}
              disabled={products.length === 0}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-[#007580] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="text-xl text-gray-600" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading featured products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug || p.id}`}
                className="relative bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer block"
              >
                {p.tag && (
                  <span
                    className={`absolute top-3 left-3 text-white text-sm px-3 py-1 rounded-full ${p.tagColor}`}
                  >
                    {p.tag}
                  </span>
                )}

                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />

                <h3 className="text-lg font-semibold text-gray-800">
                  {p.title}
                </h3>

                <div className="flex items-center text-yellow-400 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar 
                      key={star} 
                      className={`h-4 w-4 ${star <= Math.round(p.averageRating) ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-teal-600">${p.price}</p>
                  {p.oldPrice && (
                    <p className="text-gray-500 line-through text-sm">
                      ${p.oldPrice}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
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
                    className="w-full flex items-center justify-center gap-2 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
                  >
                    <FiShoppingCart /> Add to Cart
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
        )}

      </div>
    </section>
  );
}
