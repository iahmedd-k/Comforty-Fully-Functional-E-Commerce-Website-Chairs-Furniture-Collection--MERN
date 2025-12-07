import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount] = useState();
  const [showCategories, setShowCategories] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const profileMenuRef = useRef(null);
  
  // Dummy user state - replace with actual auth state
  const [user, setUser] = useState(null); // Set to null for logged out, or user object for logged in

  const categories = [
    'Wing Chair',
    'Wooden Chair',
    'Desk Chair',
    'Park Bench',
    'Office Chair',
    'Dining Chair',
    'Recliner'
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategories(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showCategories || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategories, showProfileMenu]);

  // Close dropdown when route changes
  useEffect(() => {
    setShowCategories(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#272343] text-gray-800 py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center  text-[#FFFEFE]">
          <div className="flex items-center">
            <span className="text-green-400">✓</span>
            <span className="ml-2 text-[#FFFEFE]">Free Shipping On All Orders Over $50</span>
          </div>
          <div className="flex items-center space-x-4">
            <select className="bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer">
              <option value="eng">Eng</option>
              <option value="fr">Fr</option>
            </select>
            <a href="/faq" className="hover:text-gray-300 transition-colors">
              Faqs
            </a>
            <span className="text-gray-400">|</span>
            <a href="/help" className="hover:text-gray-300 transition-colors">
              Need Help
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-[#F0F2F3] shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-800">Comforty</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button className="relative flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="text-sm font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* User Profile with Popup */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="text-gray-600 hover:text-gray-800 transition-colors relative"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* Profile Menu Popup */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border-2 border-gray-200 z-50 py-2">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b-2 border-gray-200">
                          <p className="font-medium text-gray-900">{user.name || 'User'}</p>
                          <p className="text-sm text-gray-600">{user.email || 'user@example.com'}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            setUser(null);
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          to="/login"
                          onClick={() => {
                            setShowProfileMenu(false);
                            // You can add state to switch to signup form
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Menu */}
      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Categories Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-gray-700 font-medium">All Categories</span>
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform ${showCategories ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Categories Dropdown */}
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
                  <Link
                    to="/product"
                    onClick={() => setShowCategories(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    All Products
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/product?category=${encodeURIComponent(category)}`}
                      onClick={() => setShowCategories(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

           <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
  <Link 
    to="/" 
    className={`font-medium transition-colors pb-1 ${
      isActive('/')
        ? 'text-teal-600 border-b-2 border-teal-600'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    Home
  </Link>

  <Link 
    to="/shop" 
    className={`font-medium transition-colors pb-1 ${
      isActive('/shop')
        ? 'text-teal-600 border-b-2 border-teal-600'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    Shop
  </Link>

  <Link 
    to="/product" 
    className={`font-medium transition-colors pb-1 ${
      isActive('/product')
        ? 'text-teal-600 border-b-2 border-teal-600'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    Product
  </Link>

  <Link 
    to="/pages" 
    className={`font-medium transition-colors pb-1 ${
      isActive('/pages')
        ? 'text-teal-600 border-b-2 border-teal-600'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    Pages
  </Link>

  <Link 
    to="/about" 
    className={`font-medium transition-colors pb-1 ${
      isActive('/about')
        ? 'text-teal-600 border-b-2 border-teal-600'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    About
  </Link>

  <Link 
    to="/contact" 
    className={`font-medium transition-colors pb-1 ${
      isActive('/contact')
        ? 'text-teal-600 border-b-2 border-teal-600'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    Contact
  </Link>
</div>
            {/* Contact Info */}
            <div className="text-sm text-gray-600">
              <span>Contact: </span>
              <a 
                href="tel:(808) 555-0111" 
                className="text-gray-800 font-medium hover:text-teal-600 transition-colors"
              >
                (808) 555-0111
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;