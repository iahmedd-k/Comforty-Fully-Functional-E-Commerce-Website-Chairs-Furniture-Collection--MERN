import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/fotter';

const About = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 xl:py-24">
          {/* Hero Banner */}
          <div className="relative overflow-hidden bg-[#F0F2F3] rounded-2xl sm:rounded-3xl border-[#000000] border-2 mb-8 sm:mb-12 lg:mb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-24">
              <div className="text-center space-y-4 sm:space-y-6">
                <p className="text-xs sm:text-sm font-medium text-gray-500 tracking-wider uppercase">
                  ABOUT US
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight px-2">
                  We Create Beautiful Furniture For Your Home
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                  At Comforty, we believe that furniture should be both beautiful and functional. 
                  Our mission is to bring comfort and style to every home.
                </p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-12 sm:mb-16 lg:mb-20">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <p className="text-xs sm:text-sm font-medium text-teal-600 tracking-wider uppercase">
                OUR STORY
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Crafting Excellence Since 2010
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Founded with a passion for quality and design, Comforty has been transforming 
                homes across the globe. We started as a small workshop and have grown into 
                a trusted name in furniture design.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our team of skilled craftsmen and designers work together to create pieces 
                that combine timeless elegance with modern functionality. Every piece is 
                carefully crafted to ensure it meets our high standards of quality.
              </p>
            </div>
            <div className="relative h-64 sm:h-80 lg:h-96 bg-[#F0F2F3] rounded-xl sm:rounded-2xl flex items-center justify-center order-1 lg:order-2">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-gray-500">Our Workshop</p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <p className="text-xs sm:text-sm font-medium text-gray-500 tracking-wider uppercase mb-3 sm:mb-4">
                OUR VALUES
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-4">
                What We Stand For
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Quality */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 hover:border-teal-500 transition-colors">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Quality First</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We use only the finest materials and craftsmanship to ensure every piece 
                  meets our exacting standards.
                </p>
              </div>

              {/* Sustainability */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 hover:border-teal-500 transition-colors">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Sustainability</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We're committed to sustainable practices, using eco-friendly materials 
                  and responsible manufacturing.
                </p>
              </div>

              {/* Customer Focus */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 hover:border-teal-500 transition-colors sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Customer Focus</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Your satisfaction is our priority. We listen to your needs and deliver 
                  exceptional service at every step.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-[#F0F2F3] rounded-2xl sm:rounded-3xl border-2 border-gray-200 p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 lg:mb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-600 mb-1 sm:mb-2">10+</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Years Experience</p>
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-600 mb-1 sm:mb-2">50K+</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Happy Customers</p>
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-600 mb-1 sm:mb-2">500+</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Products</p>
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-600 mb-1 sm:mb-2">100+</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Team Members</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <p className="text-xs sm:text-sm font-medium text-gray-500 tracking-wider uppercase mb-3 sm:mb-4">
                OUR TEAM
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-4">
                Meet The People Behind Comforty
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Team Member 1 */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:border-teal-500 transition-colors">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-200 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">John Smith</h3>
                <p className="text-sm sm:text-base text-teal-600 mb-2 sm:mb-3">CEO & Founder</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Visionary leader with 15+ years in furniture design and manufacturing.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:border-teal-500 transition-colors">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-200 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Sarah Johnson</h3>
                <p className="text-sm sm:text-base text-teal-600 mb-2 sm:mb-3">Head of Design</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Creative designer bringing innovative and stylish furniture concepts to life.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:border-teal-500 transition-colors sm:col-span-2 lg:col-span-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-200 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Mike Davis</h3>
                <p className="text-sm sm:text-base text-teal-600 mb-2 sm:mb-3">Production Manager</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Ensures quality and efficiency in every step of our manufacturing process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;

