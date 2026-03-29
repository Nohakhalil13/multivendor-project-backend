import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import LogoPng from '../../assets/tradify-logo.png'; 

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // سحب الداتا من الـ localStorage مرة واحدة عند تحميل الصفحة
    const storedUser = localStorage.getItem("user"); 
    const storedRole = localStorage.getItem("role"); // تأكدي إنك بتخزني الـ role بـ key اسمه role أو جواه الـ user

    if (storedRole) {
      setUserRole(storedRole);
    } else if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserRole(userData.role);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // --- مصفوفة اللينكات مع خاصية adminOnly ---
  const navLinks = [
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard-vendor', adminOnly: true },
  ];

  // --- فلترة اللينكات بناءً على الـ Role ---
  const filteredLinks = navLinks.filter(link => !link.adminOnly || userRole === 'vendor');

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${
        isScrolled 
        ? 'bg-white/95 backdrop-blur-md py-2 border-slate-100 shadow-sm' 
        : 'bg-white py-3 border-slate-50' 
      }`}
    >
      <div className="container mx-auto px-6 max-w-[1440px] flex items-center justify-between">
        
        {/* --- 1. LEFT SIDE: Actions Suite --- */}
        <div className="flex items-center gap-2 md:gap-4 order-1 lg:order-none">
          
          {/* Dashboard Icon: تظهر فقط للفيندور بجانب الأيكونز التانية */}
          {userRole === 'vendor' && (
            <button 
              onClick={() => navigate('/dashboard-vendor')}
              className="w-9 h-9 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 group relative"
              title="Vendor Dashboard"
            >
              <LayoutDashboard size={17} strokeWidth={2.5} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-black uppercase tracking-widest">
                Dashboard
              </span>
            </button>
          )}

          {/* User Icon */}
          <button 
            onClick={() => navigate('/login')}
            className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-950 rounded-full hover:bg-white hover:shadow-md transition-all border border-slate-100 hidden sm:flex"
          >
            <User size={17} strokeWidth={2.5} />
          </button>

          {/* Cart Pill */}
          <button 
            onClick={() => navigate('/cart')}
            className="flex items-center gap-3 bg-slate-950 text-white px-4 py-2 rounded-full hover:bg-[#27A376] transition-all duration-500 shadow-lg shadow-slate-200"
          >
            <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-black">2</div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Cart</span>
            <ShoppingBag size={15} strokeWidth={2.5} />
          </button>

          {/* Favorites */}
          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors relative">
            <Heart size={19} strokeWidth={2.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Search */}
          <button className="p-2 text-slate-400 hover:text-[#27A376] transition-colors hidden md:block">
            <Search size={19} strokeWidth={2.5} />
          </button>
        </div>

        {/* --- 2. CENTER: Navigation Links (Filtered) --- */}
        <div className="hidden lg:flex items-center gap-9">
          {filteredLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all relative group ${
                pathname === link.path ? 'text-[#27A376]' : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {link.name}
              {pathname === link.path && (
                <motion.div layoutId="navActive" className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#27A376]" />
              )}
            </Link>
          ))}
        </div>

        {/* --- 3. RIGHT SIDE: Tradify Logo --- */}
        <Link to="/" className="flex items-center shrink-0 order-2 group ml-4">
          <img 
            src={LogoPng} 
            alt="Tradify Market" 
            className="h-12 md:h-14 lg:h-16 w-auto object-contain transform group-hover:scale-105 transition-transform duration-500" 
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden ml-4 p-2 text-slate-950 order-3"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="p-6 flex flex-col gap-5">
              {filteredLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xs font-black uppercase tracking-widest border-b border-slate-50 pb-3 last:border-0 ${
                    link.adminOnly ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;