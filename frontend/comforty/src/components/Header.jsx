import React, { useState } from 'react';

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 3);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 3) % 3);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden bg-[#F0F2F3] rounded-2xl sm:rounded-3xl border-[#000000] border-2 mx-2 sm:mx-4 md:mx-6 lg:mx-auto my-4 sm:my-6 lg:my-10"
        style={{ maxWidth: 'calc(100% - 1rem)', width: '100%' }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 flex flex-col justify-center order-2 lg:order-1">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 tracking-wider uppercase mb-2 sm:mb-3 md:mb-4">
                  WELCOME TO CHAIRY
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-snug sm:leading-tight">
                  Best Furniture Collection For Your Interior.
                </h1>
              </div>
              <button className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-teal-500 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-teal-600 transition-colors group w-fit">
                Shop Now
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Right Content - Chair Image and Background */}
           <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 xl:h-full flex items-center justify-center order-1 lg:order-2">

              {/* 1. Background Shape Image (The lighter circle/blob) */}
              <img
                src="/BG Shapes.png"
                alt="Background Shapes"
                className="absolute w-64 sm:w-72 md:w-80 lg:w-96 h-auto object-contain z-10 opacity-60 sm:opacity-70 lg:opacity-75" 
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />

              {/* 2. Chair Image - Positioned on top of the background shape */}
              <img
                src="/Product Image.png"
                alt="Chair"
                className="absolute w-48 sm:w-56 md:w-64 lg:w-72 h-auto object-contain z-20"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />

              {/* Discount Badge - Positioned absolutely relative to the container */}
              <div className="absolute bg-white rounded-full w-16 sm:w-20 h-16 sm:h-20 flex flex-col items-center justify-center shadow-lg z-30 animate-bounce-slow"
                 style={{ top: '5%', right: '5%', transform: 'none' }}>
                <span className="text-red-500 font-bold text-lg sm:text-xl">54%</span>
                <span className="text-gray-500 text-xs">Discount</span>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

        {/* Features Section */}
        <div className="w-full px-2 sm:px-4 md:px-6 py-4 sm:py-6 z-40">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6 w-full mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
              {/* Discount */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Discount</h3>
                  <p className="text-xs text-gray-500">Weekly sales</p>
                </div>
              </div>

              {/* Free Delivery */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9-4v4m0 0v4m0-4h4m-4 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Free Delivery</h3>
                  <p className="text-xs text-gray-500">All orders</p>
                </div>
              </div>

              {/* Great Support */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">24/7 Support</h3>
                  <p className="text-xs text-gray-500">Always here</p>
                </div>
              </div>

              {/* Secure Payment */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Secure Pay</h3>
                  <p className="text-xs text-gray-500">100% Safe</p>
                </div>
              </div>
            </div>
          </div>
        </div>



      <div className="bg-white py-6 sm:py-8 md:py-10 lg:py-12 mt-8 sm:mt-10 md:mt-12 lg:mt-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
      {/* All logos as images */}
      <img src="/Logo (2).png" alt="Zapier" className="h-8 sm:h-10 md:h-12 lg:h-15 object-contain" />
      <img src="/Logo (6).png" alt="Pipedrive" className="h-8 sm:h-10 md:h-12 lg:h-15 object-contain" />
      <img src="/Logo (5).png" alt="Z" className="h-8 sm:h-10 md:h-12 lg:h-15 object-contain" />
      <img src="/Logo (3).png" alt="BURNT TOAST" className="h-8 sm:h-10 md:h-12 lg:h-15 object-contain" />
      <img src="/Logo (7).png" alt="PandaDoc" className="h-8 sm:h-10 md:h-12 lg:h-15 object-contain" />
      <img src="/Logo (1).png" alt="MOZ" className="h-8 sm:h-10 md:h-12 lg:h-15 object-contain" />
    </div>
  </div>
</div>

    </div>
  );
};

export default Header;