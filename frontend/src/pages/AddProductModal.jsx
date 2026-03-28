import React, { useState, useEffect } from "react";
import { X, Upload, Package, DollarSign, Tag } from "lucide-react";
import axios from "axios";

const AddProductModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ 
    name: "", 
    price: "", 
    description: "", 
    category: "", 
    image: null 
  });

  // 1. جلب الأقسام (Categories) عشان نختار ID صح
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        // تأكدي من هيكلة البيانات اللي راجعة من الباك إند عندك
        setCategories(res.data.data?.categories || res.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // تأكيد اختيار القسم عشان ميديناش 400 (Bad Request)
    if (!formData.category) return alert("Please select a category first!");

    setLoading(true);
    const token = localStorage.getItem("token"); // التوكن مهم جداً عشان الـ protect middleware
    
    // استخدام FormData لأن عندك upload.single("image") في الباك إند
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.image) {
      data.append("image", formData.image); // لازم يكون الاسم "image" زي ما هو مكتوب في upload.single("image")
    }

    try {
      const response = await axios.post("http://localhost:5000/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert("Product Created Successfully! 🎉");
        onClose();
        window.location.reload(); // تحديث الصفحة لرؤية المنتج الجديد
      }
    } catch (err) {
      console.error("Upload Error Details:", err.response?.data);
      alert(err.response?.data?.message || "Error creating product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-left" dir="ltr">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-8 top-8 text-slate-400 hover:text-red-500 transition-colors">
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900">Add New Product</h2>
          <p className="text-slate-400 text-sm font-medium">List a new item in your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input required placeholder="Product Name" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 outline-none focus:border-emerald-500" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input required type="number" placeholder="Price" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 outline-none" 
                onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
            
            {/* Category Select */}
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select required className="w-full bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 outline-none appearance-none cursor-pointer"
                onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="">Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <textarea required placeholder="Product description..." rows="3" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:border-emerald-500" 
            onChange={(e) => setFormData({...formData, description: e.target.value})} />

          {/* Image Upload */}
          <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-6 text-center bg-slate-50/50 hover:border-emerald-500 transition-colors group">
            <input type="file" id="image-input" className="hidden" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
            <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center">
              <Upload className="text-slate-300 group-hover:text-emerald-500 mb-2" size={28} />
              <span className="text-sm font-bold text-slate-400 group-hover:text-emerald-600">
                {formData.image ? formData.image.name : "Choose Product Photo"}
              </span>
            </label>
          </div>

          <button disabled={loading} className="w-full py-5 bg-[#10b981] text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-[#0da372] transition-all transform active:scale-95 disabled:opacity-50">
            {loading ? "Creating Listing..." : "List Product Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;