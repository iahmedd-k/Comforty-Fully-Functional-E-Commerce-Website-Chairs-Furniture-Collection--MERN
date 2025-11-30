import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/fotter';

// Dummy products data organized by category
const productsByCategory = {
  'Wing Chair': [
    { id: 1, title: "Classic Wing Chair", price: 299, oldPrice: 399, tag: "Sales", image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600" },
    { id: 2, title: "Modern Wing Chair", price: 349, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1505692794403-34d4982f7676?w=600" },
    { id: 3, title: "Leather Wing Chair", price: 449, oldPrice: 549, tag: "Sales", image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600" },
    { id: 4, title: "Fabric Wing Chair", price: 279, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600" },
    { id: 5, title: "Vintage Wing Chair", price: 329, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b06?w=600" },
    { id: 6, title: "Executive Wing Chair", price: 499, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600" },
  ],
  'Wooden Chair': [
    { id: 7, title: "Oak Wooden Chair", price: 89, oldPrice: 119, tag: "Sales", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600" },
    { id: 8, title: "Teak Wooden Chair", price: 129, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1505691723518-36a8f3be8071?w=600" },
    { id: 9, title: "Pine Wooden Chair", price: 79, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" },
    { id: 10, title: "Mahogany Wooden Chair", price: 159, oldPrice: 199, tag: "Sales", image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600" },
    { id: 11, title: "Walnut Wooden Chair", price: 139, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1505692794403-34d4982f7676?w=600" },
    { id: 12, title: "Bamboo Wooden Chair", price: 99, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600" },
  ],
  'Desk Chair': [
    { id: 13, title: "Ergonomic Desk Chair", price: 199, oldPrice: 249, tag: "Sales", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600" },
    { id: 14, title: "Executive Desk Chair", price: 299, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b06?w=600" },
    { id: 15, title: "Gaming Desk Chair", price: 349, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600" },
    { id: 16, title: "Mesh Desk Chair", price: 179, oldPrice: 229, tag: "Sales", image: "https://images.unsplash.com/photo-1505691723518-36a8f3be8071?w=600" },
    { id: 17, title: "Leather Desk Chair", price: 399, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" },
    { id: 18, title: "Modern Desk Chair", price: 229, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600" },
  ],
  'Park Bench': [
    { id: 19, title: "Classic Park Bench", price: 199, oldPrice: 249, tag: "Sales", image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600" },
    { id: 20, title: "Wooden Park Bench", price: 179, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600" },
    { id: 21, title: "Metal Park Bench", price: 219, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1505692794403-34d4982f7676?w=600" },
    { id: 22, title: "Garden Park Bench", price: 249, oldPrice: 299, tag: "Sales", image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600" },
    { id: 23, title: "Vintage Park Bench", price: 189, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600" },
  ],
  'Office Chair': [
    { id: 24, title: "Premium Office Chair", price: 249, oldPrice: 299, tag: "Sales", image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600" },
    { id: 25, title: "Comfort Office Chair", price: 199, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600" },
    { id: 26, title: "Luxury Office Chair", price: 449, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b06?w=600" },
    { id: 27, title: "Budget Office Chair", price: 129, oldPrice: 179, tag: "Sales", image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600" },
    { id: 28, title: "Swivel Office Chair", price: 179, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1505691723518-36a8f3be8071?w=600" },
    { id: 29, title: "Adjustable Office Chair", price: 279, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" },
  ],
  'Dining Chair': [
    { id: 30, title: "Modern Dining Chair", price: 89, oldPrice: 119, tag: "Sales", image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600" },
    { id: 31, title: "Classic Dining Chair", price: 99, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1505692794403-34d4982f7676?w=600" },
    { id: 32, title: "Upholstered Dining Chair", price: 149, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600" },
    { id: 33, title: "Wooden Dining Chair", price: 79, oldPrice: 99, tag: "Sales", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600" },
    { id: 34, title: "Metal Dining Chair", price: 69, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b06?w=600" },
    { id: 35, title: "Luxury Dining Chair", price: 199, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600" },
  ],
  'Recliner': [
    { id: 36, title: "Leather Recliner", price: 599, oldPrice: 749, tag: "Sales", image: "https://images.unsplash.com/photo-1505692794401-34d4982f5163?w=600" },
    { id: 37, title: "Fabric Recliner", price: 449, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1505692794403-34d4982f7676?w=600" },
    { id: 38, title: "Electric Recliner", price: 799, oldPrice: null, tag: null, image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600" },
    { id: 39, title: "Massage Recliner", price: 999, oldPrice: 1299, tag: "Sales", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600" },
    { id: 40, title: "Modern Recliner", price: 549, oldPrice: null, tag: "New", image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b06?w=600" },
  ],
};

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = Object.keys(productsByCategory);
  
  // Get all products
  const allProducts = Object.values(productsByCategory).flat();

  // Read category from URL params on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
      setActiveFilter('ALL');
    }
  }, [searchParams]);

  // Filter products based on active filter
  const getFilteredProducts = () => {
    if (selectedCategory) {
      return productsByCategory[selectedCategory];
    }
    
    switch (activeFilter) {
      case 'NEWEST':
        return allProducts.filter(p => p.tag === 'New');
      case 'TRENDING':
        return allProducts.filter(p => p.tag === 'Sales');
      case 'BEST SELLERS':
        return allProducts.slice(0, 12);
      case 'FEATURED':
        return allProducts.filter(p => p.tag === 'New' || p.tag === 'Sales');
      default:
        return allProducts;
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
                {productsByCategory[selectedCategory].length} Products
              </p>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 border border-gray-100"
              >
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
                    className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
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

                <button className="w-full bg-gray-100 hover:bg-teal-500 hover:text-white transition-colors py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                  <span>🛒</span>
                  <span>Add to Cart</span>
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
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

