import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* ABOUT */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-teal-500 text-3xl">🛋️</span>
            <h2 className="text-xl font-bold text-white">Comforty</h2>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Premium furniture collection offering comfort, quality, and style for your home. Discover our range of modern and classic designs.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-gray-400">
            <FaFacebookF className="hover:text-teal-500 cursor-pointer transition" />
            <FaTwitter className="hover:text-teal-500 cursor-pointer transition" />
            <FaInstagram className="hover:text-teal-500 cursor-pointer transition" />
            <FaPinterestP className="hover:text-teal-500 cursor-pointer transition" />
            <FaYoutube className="hover:text-teal-500 cursor-pointer transition" />
          </div>
        </div>

        {/* PAGES */}
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide mb-4">PAGES</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-gray-400 hover:text-teal-500 transition">Home</Link></li>
            <li><Link to="/products" className="text-gray-400 hover:text-teal-500 transition">Shop</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-teal-500 transition">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-teal-500 transition">Contact</Link></li>
            <li><Link to="/cart" className="text-gray-400 hover:text-teal-500 transition">Cart</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide mb-4">SUPPORT</h3>
          <ul className="space-y-2 text-sm">
            <li className="text-gray-400 hover:text-teal-500 cursor-pointer transition">Help & Support</li>
            <li className="text-gray-400 hover:text-teal-500 cursor-pointer transition">Terms & Conditions</li>
            <li className="text-gray-400 hover:text-teal-500 cursor-pointer transition">Privacy Policy</li>
            <li className="text-gray-400 hover:text-teal-500 cursor-pointer transition">Returns</li>
            <li className="text-gray-400 hover:text-teal-500 cursor-pointer transition">FAQ</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide mb-4">NEWSLETTER</h3>

          <div className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 border border-gray-700 bg-gray-800 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            />
            <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded hover:bg-teal-700 transition">
              Join
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Get exclusive offers and updates delivered to your inbox.
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2024 Comforty. All Rights Reserved.</p>

          {/* Payment Logos */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 opacity-60 hover:opacity-100" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 opacity-60 hover:opacity-100" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-5 opacity-60 hover:opacity-100" />
          </div>
        </div>
      </div>
    </footer>
  );
}
