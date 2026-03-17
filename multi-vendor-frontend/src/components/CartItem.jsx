import React from "react";
import { Plus, Minus, X, Tag } from "lucide-react"; // أيقونات بروفيشنال

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="group relative flex items-center gap-6 bg-white p-5 rounded-[2rem] border border-gray-100 hover:border-green-100 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 mb-4">
      
      {/* 1. صورة المنتج - بستايل كارت صغير داخل السلة */}
      <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-50">
        <img 
          src={item.productId?.image || "https://via.placeholder.com/150"} 
          alt={item.productId?.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* 2. تفاصيل المنتج - مرتبة ومنظمة */}
      <div className="flex-grow flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-green-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            {item.productId?.category?.name || "Uncategorized"}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {item.productId?.name}
        </h3>
        
        <div className="mt-2">
          <span className="text-xl font-black text-green-600">
            {item.productId?.price} <span className="text-sm">SAR</span>
          </span>
        </div>
      </div>

      {/* 3. التحكم في الكمية - بستايل كبسولة (Capsule Design) */}
      <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
        <button 
          onClick={() => onUpdateQuantity(item.productId._id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-9 h-9 flex items-center justify-center bg-white text-gray-600 rounded-xl shadow-sm hover:bg-red-50 hover:text-red-500 disabled:opacity-30 transition-all"
        >
          <Minus size={16} strokeWidth={3} />
        </button>
        
        <span className="px-5 text-lg font-black text-gray-800">
          {item.quantity}
        </span>

        <button 
          onClick={() => onUpdateQuantity(item.productId._id, item.quantity + 1)}
          className="w-9 h-9 flex items-center justify-center bg-white text-gray-600 rounded-xl shadow-sm hover:bg-green-50 hover:text-green-600 transition-all"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>

      {/* 4. زرار الحذف - علامة X بستايل مودرن في الزاوية */}
      <button 
        onClick={() => onRemove(item.productId._id)}
        className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-gray-100 text-gray-400 hover:text-white hover:bg-red-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <X size={16} strokeWidth={3} />
      </button>

    </div>
  );
};

export default CartItem;