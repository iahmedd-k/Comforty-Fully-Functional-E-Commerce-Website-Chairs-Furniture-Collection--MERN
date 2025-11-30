import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t pt-16 pb-10">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* LEFT: LOGO + TEXT + SOCIAL */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-teal-600 text-3xl">🛋️</span>
            <h2 className="text-xl font-semibold text-gray-800">Comforty</h2>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Vivamus tristique odio sit amet velit semper,  
            eu posuere turpis interdum.  
            Cras egestas purus.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-gray-500 text-lg">
            <FaFacebookF className="hover:text-teal-600 cursor-pointer" />
            <FaTwitter className="hover:text-teal-600 cursor-pointer" />
            <FaInstagram className="hover:text-teal-600 cursor-pointer" />
            <FaPinterestP className="hover:text-teal-600 cursor-pointer" />
            <FaYoutube className="hover:text-teal-600 cursor-pointer" />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4">CATEGORY</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-teal-600 cursor-pointer">Sofa</li>
            <li className="hover:text-teal-600 cursor-pointer">Armchair</li>
            <li className="hover:text-teal-600 cursor-pointer">Wing Chair</li>
            <li className="text-teal-600 cursor-pointer">Desk Chair</li>
            <li className="hover:text-teal-600 cursor-pointer">Wooden Chair</li>
            <li className="hover:text-teal-600 cursor-pointer">Park Bench</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4">SUPPORT</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-teal-600 cursor-pointer">Help & Support</li>
            <li className="hover:text-teal-600 cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-teal-600 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-teal-600 cursor-pointer">Help</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4">NEWSLETTER</h3>

          <div className="flex gap-2 mb-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-teal-500"
            />
            <button className="px-6 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition">
              Subscribe
            </button>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.  
            Nullam tincidunt erat enim.
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-12 border-t pt-6">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>@ 2021 – Blogy – Designed & Developed by <span className="text-teal-600">Zakirsoft</span></p>

          {/* Payment Logos */}
          <div className="flex items-center gap-4 mt-4 md:mt-0 opacity-70">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" className="h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
