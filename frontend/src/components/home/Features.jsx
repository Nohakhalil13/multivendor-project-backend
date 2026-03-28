import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Headset } from 'lucide-react';

/**
 * Features Component
 * Highlights the store's value propositions with premium hover effects.
 * Optimized for visual hierarchy and brand alignment.
 */
const Features = () => {
  const items = [
    { icon: <Truck size={28} />, title: "Premium Delivery", desc: "Worldwide concierge service", id: "01" },
    { icon: <ShieldCheck size={28} />, title: "Secure Vault", desc: "Military-grade encryption", id: "02" },
    { icon: <RotateCcw size={28} />, title: "Grace Period", desc: "30-day effortless returns", id: "03" },
    { icon: <Headset size={28} />, title: "Elite Support", desc: "24/7 Dedicated assistance", id: "04" },
  ];

  return (
    <section className="relative py-32 bg-white overflow-hidden border-y border-slate-50" dir="ltr">
      
      {/* --- Ambient Design Elements --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center select-none pointer-events-none opacity-[0.03]">
        <h2 className="text-[15vw] font-black uppercase tracking-[0.2em] text-slate-900">Experience</h2>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-emerald-500/10 transition-all duration-700 cursor-default"
            >
              {/* Animated Background Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />

              <div className="relative z-10 space-y-8">
                {/* Icon & Index Header */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-[15deg] transition-all duration-500 shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black text-slate-100 group-hover:text-emerald-500/40 transition-colors duration-500 tracking-widest">
                    {item.id}
                  </span>
                </div>

                {/* Content Section */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                    {item.desc}
                  </p>
                </div>

                {/* Elegant Animated Divider */}
                <div className="pt-2">
                  <div className="w-8 h-[2px] bg-slate-100 group-hover:w-full group-hover:bg-emerald-500 transition-all duration-700 rounded-full" />
                </div>
              </div>

              {/* Subtle Outer Glow on Hover */}
              <div className="absolute -inset-1 bg-emerald-500/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;