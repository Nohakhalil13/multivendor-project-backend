import React, { useState, useEffect } from "react";
import api from "../api/axios";

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "", // ده الحقل اللي كان بيبعت فاضي
  });
  const [categories, setCategories] = useState([]); // عشان نخزن الأقسام اللي جاية من الداتابيز
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // جلب الأقسام من الباك-إند أول ما الصفحة تفتح
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return alert("Please select a category!");

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category); // دلوقتي هتبعت قيمة حقيقية
    if (image) data.append("image", image);

    try {
      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully! 🎉");
      setFormData({ name: "", description: "", price: "", stock: "", category: "" });
      setImage(null);
      if (onProductAdded) onProductAdded(); // تحديث الجدول تلقائياً
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-2">Product Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Category - ده الجزء اللي ضفناه */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-2">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} required
            className="p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-2">Price (EGP)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Stock */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-2">Stock Amount</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Description */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-semibold text-gray-600 mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="3"
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-semibold text-gray-600 mb-2">Product Image</label>
          <div className="relative border-2 border-dashed border-gray-200 p-4 rounded-xl hover:border-blue-400 transition-colors">
            <input type="file" accept="image/*" onChange={handleImageChange} required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="text-center">
              <span className="text-blue-600 font-medium">{image ? image.name : "Click to upload image"}</span>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:bg-gray-400">
        {loading ? "Uploading..." : "Publish Product"}
      </button>
    </form>
  );
};

export default AddProductForm;