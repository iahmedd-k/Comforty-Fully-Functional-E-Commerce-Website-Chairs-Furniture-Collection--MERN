import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const products = [
  {
    id: 1,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: null,
    tag: "New",
    tagColor: "bg-green-500",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&w=800",
  },
  {
    id: 2,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: 30,
    tag: "Sale",
    tagColor: "bg-orange-500",
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&w=800&q=80&fit=crop",
  },
  {
    id: 3,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: null,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&w=800",
  },
  {
    id: 4,
    title: "Library Stool Chair",
    price: 20,
    oldPrice: null,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&w=800&q=80&fit=crop",
  },
];

export default function Featured() {
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
            <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-[#007580] transition">
              <FiChevronLeft className="text-xl text-gray-600" />
            </button>

            <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-[#007580] transition">
              <FiChevronRight className="text-xl text-gray-600" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.map((p) => (
            <div
  key={p.id}
  className="relative bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
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
      <FaStar key={star} className="h-4 w-4" />
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

  <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition">
    <FiShoppingCart /> Add to Cart
  </button>
</div>

          ))}
        </div>

      </div>
    </section>
  );
}
