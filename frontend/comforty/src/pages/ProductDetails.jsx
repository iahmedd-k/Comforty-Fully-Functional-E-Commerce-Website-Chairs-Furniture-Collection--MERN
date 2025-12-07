import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/fotter';

// Dummy API function
const dummyAPI = {
  getProductById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allProducts = {
      1: {
        id: 1,
        name: "Classic Wing Chair",
        slug: "classic-wing-chair",
        description: "Experience timeless elegance with our Classic Wing Chair. Crafted with premium materials and attention to detail, this chair combines comfort and style. Perfect for your living room, study, or office space. Features high-quality upholstery, sturdy construction, and ergonomic design for maximum comfort during long sitting sessions.",
        price: 299,
        oldPrice: 399,
        category: "Wing Chair",
        stock: 45,
        isAvailable: true,
        averageRating: 4.5,
        images: [
          { url: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800", altText: "Classic Wing Chair Front View" },
          { url: "https://images.unsplash.com/photo-1505692794403-34d4982f7676?w=800", altText: "Classic Wing Chair Side View" },
          { url: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800", altText: "Classic Wing Chair Detail" },
          { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800", altText: "Classic Wing Chair Back View" },
        ],
        reviews: [
          { id: 1, userName: "John Smith", rating: 5, comment: "Absolutely love this chair! Very comfortable and looks great in my living room.", createdAt: "2024-01-10" },
          { id: 2, userName: "Sarah Johnson", rating: 4, comment: "Great quality and fast shipping. The chair is sturdy and well-made.", createdAt: "2024-01-08" },
          { id: 3, userName: "Mike Davis", rating: 5, comment: "Perfect addition to my home office. Highly recommend!", createdAt: "2024-01-05" },
        ],
        specifications: {
          material: "Premium Fabric",
          dimensions: "32\" W x 34\" D x 40\" H",
          weight: "45 lbs",
          color: "Beige",
          warranty: "2 Years",
        },
      },
      2: {
        id: 2,
        name: "Modern Wing Chair",
        slug: "modern-wing-chair",
        description: "A contemporary take on the classic wing chair design. This modern piece features sleek lines, premium materials, and exceptional comfort. Ideal for modern living spaces, it seamlessly blends style with functionality.",
        price: 349,
        oldPrice: null,
        category: "Wing Chair",
        stock: 32,
        isAvailable: true,
        averageRating: 4.7,
        images: [
          { url: "https://images.unsplash.com/photo-1505692794403-34d4982f7676?w=800", altText: "Modern Wing Chair" },
          { url: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800", altText: "Modern Wing Chair Detail" },
        ],
        reviews: [
          { id: 1, userName: "Emily Brown", rating: 5, comment: "Beautiful design and very comfortable!", createdAt: "2024-01-12" },
        ],
        specifications: {
          material: "Leather",
          dimensions: "33\" W x 35\" D x 41\" H",
          weight: "48 lbs",
          color: "Black",
          warranty: "3 Years",
        },
      },
      3: {
        id: 3,
        name: "Leather Wing Chair",
        slug: "leather-wing-chair",
        description: "Luxurious leather wing chair that exudes sophistication. Made from genuine leather with premium craftsmanship, this chair offers unparalleled comfort and durability.",
        price: 449,
        oldPrice: 549,
        category: "Wing Chair",
        stock: 18,
        isAvailable: true,
        averageRating: 4.8,
        images: [
          { url: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800", altText: "Leather Wing Chair" },
        ],
        reviews: [
          { id: 1, userName: "Robert Wilson", rating: 5, comment: "Premium quality leather and excellent craftsmanship.", createdAt: "2024-01-15" },
        ],
        specifications: {
          material: "Genuine Leather",
          dimensions: "34\" W x 36\" D x 42\" H",
          weight: "52 lbs",
          color: "Brown",
          warranty: "5 Years",
        },
      },
    };
    
    return allProducts[id] || allProducts[1];
  },
  getRelatedProducts: async (category, excludeId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const relatedProducts = {
      "Wing Chair": [
        { id: 2, name: "Modern Wing Chair", price: 349, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1505692794403-34d4982f7676?w=600", slug: "modern-wing-chair" },
        { id: 3, name: "Leather Wing Chair", price: 449, oldPrice: 549, tag: "Sales", image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600", slug: "leather-wing-chair" },
        { id: 4, name: "Fabric Wing Chair", price: 279, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600", slug: "fabric-wing-chair" },
        { id: 5, name: "Vintage Wing Chair", price: 329, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b06?w=600", slug: "vintage-wing-chair" },
      ],
      "Wooden Chair": [
        { id: 7, name: "Oak Wooden Chair", price: 89, oldPrice: 119, tag: "Sales", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600", slug: "oak-wooden-chair" },
        { id: 8, name: "Teak Wooden Chair", price: 129, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1505691723518-36a8f3be8071?w=600", slug: "teak-wooden-chair" },
        { id: 9, name: "Pine Wooden Chair", price: 79, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600", slug: "pine-wooden-chair" },
      ],
    };
    
    const products = relatedProducts[category] || [];
    return products.filter(p => p.id !== excludeId).slice(0, 4);
  },
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const productData = await dummyAPI.getProductById(parseInt(id));
      setProduct(productData);
      setSelectedImage(0);
      
      // Load related products
      const related = await dummyAPI.getRelatedProducts(productData.category, productData.id);
      setRelatedProducts(related);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      return newQuantity > 0 && newQuantity <= (product?.stock || 0) ? newQuantity : prev;
    });
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    alert(`Added ${quantity} ${product.name} to cart!`);
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

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Product not found</p>
            <Link to="/product" className="text-teal-600 hover:text-teal-700">
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <>
      <Navbar />
      
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/product" className="hover:text-teal-600 transition-colors">Products</Link>
              <span>/</span>
              <span className="text-gray-900">{product.category}</span>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>
          </nav>

          {/* Product Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-[#F0F2F3] rounded-2xl sm:rounded-3xl border-2 border-gray-200 overflow-hidden aspect-square">
                <img
                  src={product.images[selectedImage]?.url || product.images[0]?.url}
                  alt={product.images[selectedImage]?.altText || product.name}
                  className="w-full h-full object-cover"
                />
                {product.oldPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                        selectedImage === index
                          ? 'border-teal-500 ring-2 ring-teal-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.altText}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-sm text-teal-600 font-medium mb-2">{product.category}</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(product.averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.averageRating} ({product.reviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-xl sm:text-2xl text-gray-400 line-through">
                      ${product.oldPrice}
                    </span>
                    <span className="text-sm sm:text-base text-red-600 font-medium">
                      Save ${product.oldPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {product.isAvailable && product.stock > 0 ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">
                      In Stock ({product.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-sm text-red-600">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Description Preview */}
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4 pt-4 border-t-2 border-gray-200">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.isAvailable || product.stock === 0}
                    className="flex-1 px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
                  <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Wishlist</span>
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="bg-[#F0F2F3] rounded-xl p-4 sm:p-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Free Shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">30-Day Return Policy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-8 sm:mb-12">
            <div className="border-b-2 border-gray-200 mb-6">
              <div className="flex space-x-6 sm:space-x-8 overflow-x-auto">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-teal-600 border-b-2 border-teal-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sm:p-8">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  <p className="text-gray-600 leading-relaxed">
                    This premium furniture piece is designed to provide exceptional comfort and style. 
                    Made with high-quality materials and expert craftsmanship, it's built to last for years to come.
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-sm text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">{product.averageRating}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(product.averageRating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b-2 border-gray-100 pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{review.userName}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{review.createdAt}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 border border-gray-100 group"
                  >
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-lg mb-3">
                      {relatedProduct.tag && (
                        <span
                          className={`absolute top-2 sm:top-3 left-2 sm:left-3 text-xs px-2 py-1 rounded-md text-white z-10 ${
                            relatedProduct.tag === 'New' ? 'bg-teal-500' : 'bg-orange-500'
                          }`}
                        >
                          {relatedProduct.tag}
                        </span>
                      )}
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 font-medium mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-base sm:text-lg text-gray-900 font-bold">
                        ${relatedProduct.price}
                      </p>
                      {relatedProduct.oldPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          ${relatedProduct.oldPrice}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetails;

