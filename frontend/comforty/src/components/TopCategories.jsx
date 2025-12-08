import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useRef } from "react";

const categories = [
  {
    id: 1,
    title: "Wing Chair",
    count: "3,584 Products",
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&w=1200&q=80",
  },
  {
    id: 2,
    title: "Wooden Chair",
    count: "157 Products",
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&w=1200&q=80",
  },
  {
    id: 3,
    title: "Desk Chair",
    count: "154 Products",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&w=1200&q=80",
  },
  {
    id: 4,
    title: "Park Bench",
    count: "154 Products",
    image:
      "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&w=1200&q=80",
  },
  {
    id: 5,
    title: "Office Chair",
    count: "240 Products",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&w=1200",
  },
  {
    id: 6,
    title: "Dining Chair",
    count: "520 Products",
    image:
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&w=1200",
  },
  {
    id: 7,
    title: "Recliner",
    count: "89 Products",
    image:
      "https://images.unsplash.com/photo-1505692794401-34d4982f5163?auto=format&w=1200",
  },
];

export default function TopCategories() {
  const sliderRef = useRef(null);

  // Duplicate list for infinite scrolling
  const infiniteList = [...categories, ...categories, ...categories];

  useEffect(() => {
    const slider = sliderRef.current;
    const itemWidth = 260 + 24; // card width + gap
    const startPosition = categories.length * itemWidth;

    slider.scrollLeft = startPosition;

    const handleScroll = () => {
      if (slider.scrollLeft < itemWidth) {
        slider.scrollLeft += categories.length * itemWidth;
      } else if (
        slider.scrollLeft >
        (categories.length * 2 * itemWidth) - itemWidth
      ) {
        slider.scrollLeft -= categories.length * itemWidth;
      }
    };

    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  const scroll = (direction) => {
    const slider = sliderRef.current;
    const amount = 280;

    slider.scrollTo({
      left:
        direction === "left"
          ? slider.scrollLeft - amount
          : slider.scrollLeft + amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 sm:py-12 md:py-14 bg-white relative">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">

        {/* Title + Buttons */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Categories</h2>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#007580] hover:text-white transition"
            >
              <FiChevronLeft className="text-lg sm:text-xl" />
            </button>

            <button
              onClick={() => scroll("right")}
              className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#007580] hover:text-white transition"
            >
              <FiChevronRight className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        {/* Left soft shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />

        {/* Right soft shadow */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        {/* Infinite Slider */}
        <div
          ref={sliderRef}
          className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {infiniteList.map((cat, i) => (
            <div
              key={i}
              className="min-w-[200px] sm:min-w-[240px] md:min-w-[260px] h-[250px] sm:h-[280px] md:h-[320px] relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            >
              {/* Image */}
              <img
                src={cat.image}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                alt={cat.title}
              />

              {/* Gradient bottom */}
       <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white p-2 sm:p-3 rounded-b-xl">
  <h2 className="text-sm sm:text-base md:text-lg font-semibold">{cat.title}</h2>
  <p className="text-xs sm:text-sm">{cat.count}</p>
</div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
