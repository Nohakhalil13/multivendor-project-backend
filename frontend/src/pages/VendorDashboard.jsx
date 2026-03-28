import React, { useEffect, useState } from "react";
import { 
  LayoutDashboard, Package, ShoppingCart, 
  LogOut, PlusCircle, Store, Loader2, 
  DollarSign, X, Upload, Trash2, Edit3, AlertCircle, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- 1. مكون إضافة وتعديل المنتج (ProductModal) ---
const ProductModal = ({ onClose, initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialData || { 
    name: "", price: "", description: "", category: "", stock: "1", image: null 
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data.data?.categories || res.data.categories || []))
      .catch(err => console.error("Categories Fetch Error:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return alert("Please select a category");
    setLoading(true);
    const token = localStorage.getItem("token");
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key] instanceof File) data.append("image", formData[key]);
      else if (key !== 'image') data.append(key, formData[key]);
    });

    try {
      const url = initialData 
        ? `http://localhost:5000/api/products/${initialData._id}` 
        : "http://localhost:5000/api/products";
      const method = initialData ? "patch" : "post";

      await axios[method](url, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      
      alert(initialData ? "Updated! ✅" : "Added! 🎉");
      onClose();
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="ltr">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl animate-in zoom-in duration-200">
        <button onClick={onClose} className="absolute right-8 top-8 text-slate-400 hover:text-red-500 transition-colors"><X size={24} /></button>
        <h2 className="text-2xl font-black text-slate-900 mb-6 text-left font-sans">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-left font-sans">
          <input required value={formData.name} placeholder="Product Name" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-emerald-500 transition-all" onChange={(e)=>setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" value={formData.price} placeholder="Price ($)" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-emerald-500" onChange={(e)=>setFormData({...formData, price: e.target.value})} />
            <input required type="number" value={formData.stock} placeholder="Stock" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-emerald-500" onChange={(e)=>setFormData({...formData, stock: e.target.value})} />
          </div>
          <select required value={formData.category?._id || formData.category} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none" onChange={(e)=>setFormData({...formData, category: e.target.value})}>
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
          <textarea required value={formData.description} placeholder="Description..." rows="2" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-emerald-500" onChange={(e)=>setFormData({...formData, description: e.target.value})} />
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 hover:border-emerald-500 transition-all group">
            <input type="file" id="prod-img" className="hidden" accept="image/*" onChange={(e)=>setFormData({...formData, image: e.target.files[0]})} />
            <label htmlFor="prod-img" className="cursor-pointer text-slate-400 text-sm font-bold flex flex-col items-center">
               <Upload className="mb-2 group-hover:text-emerald-500 transition-colors" size={24} /> {formData.image?.name || "Update/Upload Image"}
            </label>
          </div>
          <button disabled={loading} className="w-full py-4 bg-[#10b981] text-white font-black rounded-2xl shadow-xl hover:bg-[#0da372] transition-all transform active:scale-95">
            {loading ? "Saving..." : initialData ? "Update Changes" : "List Product Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 2. المكون الرئيسي (VendorDashboard) ---
const VendorDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]); // أوردرات الفيندور
  const [activeTab, setActiveTab] = useState("inventory"); // التبديل بين الأقسام
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState({ open: false, data: null });

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      setLoading(true);
      
      // 1. جلب البروفايل
      let vendorData = null;
      try {
        const profileRes = await axios.get("http://localhost:5000/api/vendors/me", config);
        vendorData = profileRes.data.data?.vendor || profileRes.data.vendor;
        setProfile(vendorData);
      } catch (err) { console.error("Profile Error:", err); }

      // 2. جلب المنتجات والأوردرات بالتوازي
      const [productsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/products", config),
        axios.get("http://localhost:5000/api/orders", config).catch(() => ({ data: { data: [] } }))
      ]);

      if (vendorData) {
        const myId = (vendorData._id || vendorData.id).toString();

        // فلترة المنتجات
        const allProducts = productsRes.data.data?.products || productsRes.data.products || [];
        setMyProducts(allProducts.filter(p => (p.vendor?._id || p.vendor || "").toString() === myId));

        // فلترة الأوردرات: نعرض الأوردر لو فيه منتج واحد على الأقل يخص هذا الفيندور
        const allOrders = ordersRes.data.data?.orders || ordersRes.data.orders || [];
        const filteredOrders = allOrders.filter(order => 
          order.cartItems.some(item => (item.product?.vendor?._id || item.product?.vendor || "").toString() === myId)
        );
        setMyOrders(filteredOrders);
      }

    } catch (error) {
      console.error("Fetch Error:", error);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMyProducts(prev => prev.filter(p => p._id !== id));
      alert("Deleted 🗑️");
    } catch (err) { alert("Delete failed"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#10b981]" size={40} /></div>;

  if (!profile) return <div className="min-h-screen flex flex-col items-center justify-center">Access Denied</div>;

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex pt-24 text-left font-sans" dir="ltr">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 h-[calc(100vh-96px)] sticky top-24 flex flex-col p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="p-2.5 bg-[#10b981] rounded-xl text-white shadow-lg shadow-emerald-100"><Store size={22} /></div>
          <span className="font-black text-slate-900 text-xl tracking-tighter">Tradify</span>
        </div>
        <nav className="flex-1 space-y-3">
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "inventory" ? 'bg-[#10b981] text-white shadow-xl' : 'text-slate-400 hover:bg-emerald-50 hover:text-[#10b981]'}`}
          >
            <Package size={20}/> My Inventory
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "orders" ? 'bg-[#10b981] text-white shadow-xl' : 'text-slate-400 hover:bg-emerald-50 hover:text-[#10b981]'}`}
          >
            <ShoppingCart size={20}/> Customer Orders
          </button>
        </nav>
        <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="mt-auto flex items-center gap-4 px-5 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-10 lg:p-14">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-14">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {profile?.user?.name || "Vendor"}!</h1>
            <p className="text-slate-400 font-medium mt-2 italic text-sm">Shop: <span className="text-[#10b981] font-bold">{profile?.storeName}</span></p>
          </div>
          {activeTab === "inventory" && (
            <button onClick={() => setModalMode({ open: true, data: null })} className="flex items-center gap-3 bg-[#10b981] hover:bg-[#0da372] text-white px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all transform hover:-translate-y-1">
              <PlusCircle size={22} /> Add New Product
            </button>
          )}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><DollarSign size={24}/></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Earnings</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">${profile?.balance?.toFixed(2) || "0.00"}</h3>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><ShoppingCart size={24}/></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">New Orders</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{myOrders.length}</h3>
          </div>
        </div>

        {/* Dynamic Content: Inventory OR Orders */}
        <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">{activeTab === "inventory" ? "Inventory Control" : "Recent Orders"}</h2>
          </div>

          {activeTab === "inventory" ? (
            // --- قسم المنتجات ---
            myProducts.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest">Product</th>
                    <th className="px-8 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest">Price</th>
                    <th className="px-8 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">Stock</th>
                    <th className="px-8 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {myProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <img src={p.imageCover || `http://localhost:5000/img/products/${p.image}`} className="w-12 h-12 rounded-xl object-cover" onError={(e) => e.target.src = "https://placehold.co/100x100"} />
                        <span className="font-bold text-slate-900">{p.name}</span>
                      </td>
                      <td className="px-8 py-5 font-black">${p.price}</td>
                      <td className="px-8 py-5 text-center"><span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold">{p.stock}</span></td>
                      <td className="px-8 py-5 flex justify-center gap-3">
                        <button onClick={() => setModalMode({ open: true, data: p })} className="p-2 text-blue-400 hover:bg-blue-50 rounded-xl"><Edit3 size={18}/></button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="p-20 text-center font-bold text-slate-400">No products found.</div>
          ) : (
            // --- قسم الأوردرات (جديد) ---
            myOrders.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest">Order ID</th>
                    <th className="px-8 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Price</th>
                    <th className="px-8 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {myOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">#{order._id.slice(-6)}</td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-slate-900">{order.user?.name || "Guest User"}</span>
                        <p className="text-[10px] text-slate-400">{order.shippingAddress?.city}</p>
                      </td>
                      <td className="px-8 py-5 font-black text-emerald-600">${order.totalOrderPrice}</td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <button className="p-2 text-slate-400 hover:text-[#10b981] hover:bg-emerald-50 rounded-xl transition-all"><Eye size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="p-20 text-center font-bold text-slate-400">No orders placed yet.</div>
          )}
        </div>
      </main>

      {modalMode.open && <ProductModal onClose={() => setModalMode({ open: false, data: null })} initialData={modalMode.data} />}
    </div>
  );
};

export default VendorDashboard;