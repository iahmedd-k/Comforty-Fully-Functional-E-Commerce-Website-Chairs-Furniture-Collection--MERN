import React from "react";

/**
 * Testimonials.jsx
 * React + Tailwind component tuned to match the provided design.
 *
 * Usage: <Testimonials />
 */

export default function Testimonials() {
  return (
    <section className="w-full bg-[#f3f6f7] py-20">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1f2d3d]">
            What Client Says About Us
          </h2>

          {/* Right control: teal round button + small chevron (matches screenshot) */}
          <div className="flex items-center gap-4">
            <button
              aria-label="testimonial-prev"
              className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm hover:bg-teal-700 transition"
            >
              {/* left arrow (you can replace with icon library) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 transform -rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* tiny chevron to the right as in screenshot */}
            <div className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <article className="relative bg-white rounded-xl shadow-lg p-8 border border-gray-100 overflow-hidden">
            {/* faded quote marks - decorative */}
            <svg
              className="hidden lg:block absolute right-6 bottom-6 opacity-8 w-28 h-28 text-gray-200 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
              style={{ opacity: 0.08 }}
            >
              <path
                d="M7.5 8.5C7.5 6 9 4 11.5 4C13.9853 4 16 6.01472 16 8.5C16 11.4853 13.9853 13.5 11 13.5H10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 8.5C3.5 6 5 4 7.5 4C9.98528 4 12 6.01472 12 8.5C12 11.4853 9.98528 13.5 7 13.5H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="text-gray-600 leading-relaxed mb-6 pl-4 border-l-4 border-sky-400">
              “Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit. Vivamus Sit Amet Mi
              Nec Massa Tincidunt Blandit Et Eu Sem. Maecenas Laoreet Ultrices Diam Dignissim
              Posuere. Aenean Ultrices Dui At Ipsum Sagittis, Pharetra Lacinia Dui Faucibus.
              In Ac Bibendum Ex. Aenean Dolor Massa, Euismod Sit Amet Suscipit Et.”
            </p>

            <div className="flex items-center gap-4 mt-4">
              {/* avatar with colored circle as in screenshot */}
              <div className="w-12 h-12 rounded-full bg-[#f36d53] flex items-center justify-center overflow-hidden shadow-sm">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Kristin Watson"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#1f2d3d]">Kristin Watson</p>
                <p className="text-xs text-gray-400">Fashion Designer</p>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="relative bg-white rounded-xl shadow-lg p-8 border border-gray-100 overflow-hidden">
            <svg
              className="hidden lg:block absolute right-6 bottom-6 opacity-8 w-28 h-28 text-gray-200 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
              style={{ opacity: 0.08 }}
            >
              <path
                d="M7.5 8.5C7.5 6 9 4 11.5 4C13.9853 4 16 6.01472 16 8.5C16 11.4853 13.9853 13.5 11 13.5H10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 8.5C3.5 6 5 4 7.5 4C9.98528 4 12 6.01472 12 8.5C12 11.4853 9.98528 13.5 7 13.5H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="text-gray-600 leading-relaxed mb-6 pl-4 border-l-4 border-teal-400">
              “Nullam Sapien Elit, Dignissim Eu Viverra Et, Scelerisque Et Felis. Aliquam
              Egestas Dui Elit, Quis Tincidunt Lacus Aliquam Et. Duis Nulla Velit, Dignissim Ut
              Odio Ac, Eleifend Luctus Leo. Ut Ac Imperdiet Velit. Aliquam Semper Ex In
              Volutpat Rutrum.”
            </p>

            <div className="flex items-center gap-4 mt-4">
              <div className="w-12 h-12 rounded-full bg-[#f36d53] flex items-center justify-center overflow-hidden shadow-sm">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Esther Howard"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#1f2d3d]">Esther Howard</p>
                <p className="text-xs text-gray-400">Fashion Designer</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
