import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/fotter';
import { getProductBySlug, getProducts, addReview } from '../api/products';
import { addToCart } from '../api/cart';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../api/wishlist';

const ProductDetails = () => {
  const { id } = useParams(); // This is actually the slug
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      // Fetch product by slug
      const productData = await getProductBySlug(id);
      
      // Normalize product data for UI
      const normalizedProduct = {
        _id: productData._id,
        id: productData._id || productData.slug,
        slug: productData.slug,
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        oldPrice: null, // Add if you have discount prices in backend
        category: productData.category,
        stock: productData.stock || 0,
        isAvailable: productData.isAvailable !== false,
        averageRating: productData.averageRating || 0,
        images: productData.images || [],
        reviews: productData.reviews || [],
        specifications: productData.specifications || {},
      };
      
      setProduct(normalizedProduct);
      setSelectedImage(0);
      
      // Load related products from same category
      const allProducts = await getProducts({ category: normalizedProduct.category });
      const related = allProducts
        .filter(p => p.slug !== normalizedProduct.slug && p._id !== normalizedProduct._id)
        .slice(0, 4)
        .map(p => ({
          id: p._id || p.slug,
          slug: p.slug,
          name: p.name,
          price: p.price,
          oldPrice: null,
          tag: p.stock <= 10 ? 'Sales' : null,
          image: p.images && p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/600',
        }));
      
      setRelatedProducts(related);
      
      // Check if product is in wishlist
      setWishlisted(isInWishlist(normalizedProduct._id || normalizedProduct.id));
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

  const handleAddToCart = async () => {
    try {
      const productId = product._id || product.id;
      await addToCart(productId, quantity);
      setMessage({ text: `Added ${quantity} ${product.name} to cart!`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to add to cart. Please login.';
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleWishlistToggle = () => {
    const productId = product._id || product.id;
    if (wishlisted) {
      removeFromWishlist(productId);
      setWishlisted(false);
      setMessage({ text: 'Removed from wishlist', type: 'success' });
    } else {
      addToWishlist(product);
      setWishlisted(true);
      setMessage({ text: 'Added to wishlist', type: 'success' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
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
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]?.url || product.images[0]?.url}
                    alt={product.images[selectedImage]?.altText || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {product.oldPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
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
                        alt={image.altText || product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6">
              {message.text && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}
              
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
                  <button 
                    onClick={handleWishlistToggle}
                    className={`px-6 py-3 border-2 font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                      wishlisted 
                        ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
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
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
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
                  ) : (
                    <p className="text-gray-600">No specifications available for this product.</p>
                  )}
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
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => {
                        const reviewDate = review.createdAt 
                          ? new Date(review.createdAt).toLocaleDateString() 
                          : 'N/A';
                        const userName = review.user?.name || review.userName || 'Anonymous';
                        
                        return (
                          <div key={review._id || index} className="border-b-2 border-gray-100 pb-4 last:border-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{userName}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= (review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">{reviewDate}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">{review.comment || 'No comment provided'}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>

                  {/* Add review form */}
                  <div className="mt-6 border-t pt-6">
                    <h4 className="text-lg font-medium mb-3">Write a review</h4>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          await addReview(product.slug, reviewForm);
                          setMessage({ text: 'Review submitted', type: 'success' });
                          setReviewForm({ rating: 5, comment: '' });
                          // refresh product to show new review
                          await loadProduct();
                          setTimeout(() => setMessage({ text: '', type: '' }), 3000);
                        } catch (err) {
                          console.error('Error submitting review:', err);
                          const errMsg = err?.response?.data?.message || 'Failed to submit review';
                          setMessage({ text: errMsg, type: 'error' });
                          setTimeout(() => setMessage({ text: '', type: '' }), 5000);
                        }
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="text-sm text-gray-700">Rating</label>
                        <select
                          value={reviewForm.rating}
                          onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                          className="block mt-1 w-28 px-3 py-2 border-2 border-gray-200 rounded-lg"
                        >
                          {[5,4,3,2,1].map((r) => (
                            <option key={r} value={r}>{r} Star{r>1?'s':''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-700">Comment</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border-2 border-gray-200 rounded-lg"
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-lg">Submit Review</button>
                      </div>
                    </form>
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
                    to={`/product/${relatedProduct.slug || relatedProduct.id}`}
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

