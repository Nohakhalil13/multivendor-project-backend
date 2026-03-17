import React, { useState, useEffect } from "react";
import api from "../api/axios";
import AddProductForm from "../components/AddProductForm";

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSales: 0, totalProducts: 0, orders: 0 });
  
  // حالات التعديل
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ price: "", stock: "" });

  // 1. جلب البيانات (منتجات + طلبات)
  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const resProducts = await api.get("/products/vendor");
      const resOrders = await api.get("/orders/vendor/orders");

      setProducts(resProducts.data);
      setOrders(resOrders.data);

      setStats({
        totalProducts: resProducts.data.length,
        orders: resOrders.data.length,
        totalSales: resOrders.data.reduce((acc, order) => acc + order.totalPrice, 0)
      });
    } catch (err) {
      console.error("Error fetching vendor data", err);
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

  // 3. التعديل (فتح المودال وحفظ البيانات)
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({ price: product.price, stock: product.stock });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${editingProduct._id}`, editFormData);
      alert("Product updated!");
      setEditingProduct(null);
      fetchVendorData(); // تحديث القائمة
    } catch (err) {
      alert("Update failed");
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
            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
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
            <h3 className="text-4xl font-black text-blue-600">{stats.orders}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium mb-1">Total Revenue</p>
            <h3 className="text-4xl font-black text-green-600">{stats.totalSales.toLocaleString()} <span className="text-sm">EGP</span></h3>
          </div>
        </div>

        {/* Edit Modal (يظهر فقط عند التعديل) */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Update Product</h2>
              <form onSubmit={handleUpdate} className="space-y-4 text-right">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Price (EGP)</label>
                  <input 
                    type="number" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-blue-500"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-blue-500"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({...editFormData, stock: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 pt-4 font-bold">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl">Save Changes</button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AddProductForm onProductAdded={fetchVendorData} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Your Inventory</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan="4" className="p-10 text-center text-gray-400">Loading...</td></tr>
                    ) : products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-gray-800">{product.name}</td>
                        <td className="px-6 py-4 text-sm font-bold">{product.price} EGP</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.stock} pcs</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEditClick(product)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">✏️</button>
                            <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-800 font-black">Recent Orders 📦</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {orders.length === 0 ? (
                      <tr><td colSpan="3" className="p-6 text-center text-gray-400">No orders yet.</td></tr>
                    ) : orders.map(order => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 font-bold">{order.user?.name}</td>
                        <td className="px-6 py-4 text-blue-600 font-bold">{order.totalPrice} EGP</td>
                        <td className="px-6 py-4">
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold">Pending</span>
                        </td>
                      </tr>
                    ))}
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