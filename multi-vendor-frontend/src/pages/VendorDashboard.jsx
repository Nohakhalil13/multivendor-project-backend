import React, { useState, useEffect } from "react";
import api from "../api/axios";
import AddProductForm from "../components/AddProductForm";

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSales: 0, totalProducts: 0, orders: 0 });

  // 1. جلب منتجات الفيندور
  const fetchVendorData = async () => {
    try {
      setLoading(true);
// اتأكدي إن المسار مطابق للروتس اللي فوق
const res = await api.get("/products/vendor");
 setProducts(res.data);
      setStats(prev => ({ ...prev, totalProducts: res.data.length }));
    } catch (err) {
      console.error("Error fetching vendor products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  // 2. حذف منتج
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        alert("Product deleted!");
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-500">Manage your store, products, and sales performance.</p>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            + Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium mb-1">Total Products</p>
            <h3 className="text-4xl font-black text-gray-900">{stats.totalProducts}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium mb-1">Active Orders</p>
            <h3 className="text-4xl font-black text-blue-600">0</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium mb-1">Total Revenue</p>
            <h3 className="text-4xl font-black text-green-600">0 <span className="text-sm">EGP</span></h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Add Product Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AddProductForm onProductAdded={fetchVendorData} />
            </div>
          </div>

          {/* Right Column: Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Your Inventory</h2>
                <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                  {products.length} Items
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan="5" className="p-10 text-center text-gray-400">Loading inventory...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan="5" className="p-10 text-center text-gray-400">No products found. Start adding some!</td></tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.image || "https://via.placeholder.com/50"} 
                                alt="" 
                                className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                              />
                              <span className="font-bold text-gray-800 text-sm">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {product.category?.name || "General"}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                            {product.price} EGP
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-500">
                            {product.stock} pcs
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                                ✏️
                              </button>
                              <button 
                                onClick={() => handleDelete(product._id)}
                                className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;