import React from "react";

const products = [
  {
    id: 1,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: null,
    tag: "New",
    image: "https://images.unsplash.com/photo-1505692794403-34d4982f7676?w=600",
  },
  {
    id: 2,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: 30,
    tag: "Sales",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600",
  },
  {
    id: 3,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: null,
    tag: null,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
  },
  {
    id: 4,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: null,
    tag: null,
    image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b06?w=600",
  },
  {
    id: 5,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: null,
    tag: "New",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
  },
  {
    id: 6,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: 30,
    tag: "Sales",
    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600",
  },
  {
    id: 7,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: null,
    tag: null,
    image: "https://images.unsplash.com/photo-1505691723518-36a8f3be8071?w=600",
  },
  {
    id: 8,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: null,
    tag: null,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600",
  },
];

export default function Our_Products() {
  return (
    <div className="mmax-w-7xl mx-auto px-6 min-h-screen bg-white px-6 py-12 mx-20">
      <h2 className="text-center text-3xl font-semibold mb-8">Our Products</h2>

      {/* Filter Tabs */}
      <div className="flex justify-center space-x-6 mb-10 text-gray-600 text-sm font-medium">
        {['ALL', 'NEWEST', 'TRENDING', 'BEST SELLERS', 'FEATURED'].map((tab, i) => (
          <button
            key={i}
            className={`pb-1 border-b-2 transition ${
              tab === 'TRENDING'
                ? 'border-green-500 text-green-600'
                : 'border-transparent hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 border border-gray-100"
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

            <button className="mt-3 w-full bg-gray-100 hover:bg-gray-200 transition py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
          {/* View All Button */}
      <div className="flex justify-end mt-8">
        <a href="#all" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">View All</a>
      </div>
    </div>
  );
}
