import React from "react";
import { Mail, Phone, MapPin, ShoppingBag } from "lucide-react"; // أيقونات احترافية

const Footer = () => {
  return (
    <footer className="bg-[#1a1d1c] text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* الطبقة الأولى: محتوى الفوتر */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* 1. البراند والوصف */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center">
                <ShoppingBag size={22} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-[#10b981]">متجري</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Our online store provides you with the best products at the highest quality and best prices with fast and reliable delivery.
            </p>
          </div>

          {/* 2. روابط سريعة */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-[#10b981] transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-[#10b981] transition-colors">Products</a></li>
              <li><a href="/about" className="hover:text-[#10b981] transition-colors">About</a></li>
              <li><a href="/contact" className="hover:text-[#10b981] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* 3. بيانات التواصل (مع الأيقونات) */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gray-500" />
                <span>info@store.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gray-500" />
                <span>+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-500" />
                <span>Riyadh, Saudi Arabia</span>
              </li>
            </ul>
          </div>

          {/* 4. النشرة البريدية */}
          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-[#2a2e2d] border border-gray-700 p-3 rounded-xl flex-1 text-sm outline-none focus:border-[#10b981] transition-all"
              />
              <button className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* خط الفصل */}
        <div className="border-t border-gray-800 pt-8 flex flex-col items-center">
          <p className="text-gray-500 text-sm">
            © 2026 <span className="text-gray-400 font-bold">متجري</span>. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;