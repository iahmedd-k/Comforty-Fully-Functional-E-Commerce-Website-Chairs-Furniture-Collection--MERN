import React, { useState } from 'react';

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 3);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 3) % 3);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden bg-[#F0F2F3] rounded-3xl border-[#000000] border-2 mt-10 mx-auto"
        style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '0rem', maxWidth: 'calc(100% - 5rem)', width: '100%' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-0">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium text-gray-500 tracking-wider uppercase mb-4">
                  WELCOME TO CHAIRY
                </p>
                <h1 className="text-4xl lg:text-5xl xl:text-5xl font-bold text-gray-900 leading-tight">
                  Best Furniture Collection For Your Interior.
                </h1>
              </div>
              <button className="inline-flex items-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors group">
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
           <div className="relative h-96 lg:h-full min-h-96 flex items-center justify-center mt-0">

              {/* 1. Background Shape Image (The lighter circle/blob) */}
              <img
                src="/BG Shapes.png" // Ensure this path is correct
                alt="Background Shapes"
                // Positioned absolutely, slightly bigger than the chair
                className="absolute w-[90%] h-auto object-contain z-10 opacity-75 " 
                // Precisely centered within the column
                style={{ top: '8%', left: '50%', transform: 'translate(-14%, -40%)' }}
              />

              {/* 2. Chair Image - Positioned on top of the background shape */}
              <img
                src="/Product Image.png" // Ensure this path is correct
                alt="Chair"
                className="absolute h-[100%] w-auto object-contain z-20"
                // Centered horizontally, pushed slightly down vertically to align with the design
                style={{ top: '20%', left: '90%', transform: 'translate(-55%, -30%)' }}
              />

              {/* Discount Badge - Positioned absolutely relative to the container */}
              <div className="absolute  bg-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg z-30 animate-bounce-slow"
                 style={{ top: '1%', left: '120%', transform: 'translate(-110%, -78%)' }}>
                <span className="text-red-500 font-bold text-xl">54%</span>
                <span className="text-gray-500 text-xs">Discount</span>
              </div>
            </div>
          </div>

          {/* Navigation Arrows (already correctly positioned) */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators (already correctly positioned) */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

        {/* Features Section (no changes needed for positioning here) */}
   <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[95%] lg:w-[85%] xl:w-[80%] z-40">
  <div className="bg-[#FFFFFF] rounded-xl shadow-2xl p-6 mx-auto" style={{ margin: '0 10px' }}> {/* <-- Here is the 10px margin */}
       
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Discount */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Discount</h3>
                <p className="text-sm text-gray-600">Every week new sales</p>
              </div>
            </div>

            {/* Free Delivery */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Free Delivery</h3>
                <p className="text-sm text-gray-600">100% Free for all orders</p>
              </div>
            </div>

            {/* Great Support */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Great Support 24/7</h3>
                <p className="text-sm text-gray-600">We care your experiences</p>
              </div>
            </div>

            {/* Secure Payment */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% Secure Payment Method</p>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="bg-white py- mt-5">
  <div className="max-w-7xl mx-auto px-9">
    <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-24">
      {/* All logos as images */}
      <img src="/Logo (2).png" alt="Zapier" className="h-15" />
      <img src="/Logo (6).png" alt="Pipedrive" className="h-15" />
      <img src="/Logo (5).png" alt="Z" className="h-15" />
      <img src="/Logo (3).png" alt="BURNT TOAST" className="h-15" />
      <img src="/Logo (7).png" alt="PandaDoc" className="h-15" />
      <img src="/Logo (1).png" alt="MOZ" className="h-15" />
    </div>
  </div>
</div>

    </div>
  );
};

export default Header;