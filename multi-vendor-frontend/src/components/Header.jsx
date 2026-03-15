import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            My<span className="text-gray-800">Marketplace</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Products
          </Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Cart
            {/* اختياري: دائرة صغيرة لعدد المنتجات */}
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">0</span>
          </Link>
          <Link to="/vendor/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Vendor Panel
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Login
          </Link>
          <Link 
            to="/Register" 
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;