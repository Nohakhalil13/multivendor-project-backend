import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

/**
 * High-End Minimalist Hero
 * Focuses on balanced spacing, clear typography, and a spacious layout.
 * Designed for maximum visual comfort and premium feel.
 */
const Hero = () => {
  const navigate = useNavigate();

  // Animation variants for smooth entrance
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 1, ease: [0.19, 1, 0.22, 1] }
    })
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden pt-20" dir="ltr">
      
      {/* --- Balanced Content Grid --- */}
      <div className="container mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side: Clean Typography & CTA */}
        <div className="flex flex-col items-start text-left space-y-12">
          
          <div className="space-y-6 max-w-xl">
            <motion.div 
              variants={fadeInUp} initial="hidden" animate="visible" custom={0.1}
              className="text-[#27A376] font-black text-[10px] uppercase tracking-[0.5em]"
            >
              The New Standard
            </motion.div>

            <motion.h1 
              variants={fadeInUp} initial="hidden" animate="visible" custom={0.2}
              className="text-6xl md:text-[7.5rem] font-black text-slate-900 leading-[0.9] tracking-tighter"
            >
              Modern <br />
              <span className="italic font-serif font-light text-slate-300">Aesthetics.</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp} initial="hidden" animate="visible" custom={0.3}
              className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-md"
            >
              Carefully selected objects for a refined lifestyle. Simple, functional, and timeless.
            </motion.p>
          </div>

          {/* CTA Buttons with plenty of breathing room */}
          <motion.div 
            variants={fadeInUp} initial="hidden" animate="visible" custom={0.4}
            className="flex flex-wrap items-center gap-10"
          >
            <button 
              onClick={() => navigate('/products')}
              className="bg-slate-900 text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#27A376] transition-all shadow-xl active:scale-95"
            >
              Shop Collection
            </button>
            <button className="group flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-slate-900 pb-1 transition-all">
              Our Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Right Side: Simple & Focused Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Main Visual: Clean Frame */}
          <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)]">
            <img 
              src="https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
              alt="Minimalist Interior" 
            />
            
            {/* Minimalist Floating Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Featured item</p>
                <h3 className="text-slate-900 font-bold">Minimalist Oak Chair</h3>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white">
                <ShoppingBag size={16} />
              </div>
            </div>
          </div>

          {/* Background Decorative Shape (Subtle) */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-50/30 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      </div>

      {/* --- Simple Progress Indicator (Visual Aid) --- */}
      <div className="absolute bottom-12 left-16 hidden lg:flex items-center gap-4">
        <span className="text-[10px] font-black text-slate-900">01</span>
        <div className="w-20 h-[1px] bg-slate-200">
           <div className="w-1/3 h-full bg-slate-900" />
        </div>
        <span className="text-[10px] font-black text-slate-200">03</span>
      </div>
    </section>
  );
};

export default Hero;