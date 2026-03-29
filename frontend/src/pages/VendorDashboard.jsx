import React, { useEffect, useState } from "react";
import { 
  LayoutDashboard, Package, ShoppingCart, 
  LogOut, PlusCircle, Store, Loader2, 
  DollarSign, X, Upload, Trash2, Edit3, Eye,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } }
};

// --- 1. ProductModal (The New Optimized Two-Column Layout) ---
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
      onClose();
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4" dir="ltr">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-4xl rounded-[2.5rem] p-8 relative shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-300 hover:text-slate-900 transition-colors z-10"><X size={20} /></button>
        
        <div className="mb-8 text-left">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic font-serif">
                {initialData ? 'Refine' : 'Register'} <span className="text-emerald-500 font-sans not-italic">Asset.</span>
            </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          {/* Column 1: Primary Data */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
              <input required value={formData.name} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-emerald-500 transition-all font-bold text-slate-900 text-sm" onChange={(e)=>setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (EGP)</label>
                  <input required type="number" value={formData.price} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-emerald-500 font-bold text-sm" onChange={(e)=>setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Level</label>
                  <input required type="number" value={formData.stock} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-emerald-500 font-bold text-sm" onChange={(e)=>setFormData({...formData, stock: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select required value={formData.category?._id || formData.category} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-500 text-sm appearance-none" onChange={(e)=>setFormData({...formData, category: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>

            <button disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-xl hover:bg-emerald-600 transition-all transform active:scale-95 disabled:opacity-50 mt-4">
               {loading ? "Saving..." : initialData ? "Confirm Changes" : "Publish to Gallery"}
            </button>
          </div>

          {/* Column 2: Content & Media */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Representation</label>
              <div className="relative border-2 border-dashed border-slate-100 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all group h-[120px] flex flex-col justify-center items-center">
                <input type="file" id="prod-img" className="hidden" accept="image/*" onChange={(e)=>setFormData({...formData, image: e.target.files[0]})} />
                <label htmlFor="prod-img" className="cursor-pointer text-slate-400 text-[9px] font-black uppercase tracking-[0.1em] flex flex-col items-center">
                   <Upload className="mb-2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} /> 
                   <span className="truncate max-w-[200px]">{formData.image?.name || "Drop Visual Asset"}</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Narrative</label>
              <textarea required value={formData.description} rows="5" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-emerald-500 font-medium text-slate-600 text-sm resize-none" placeholder="Describe the item's unique value..." onChange={(e)=>setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

// --- 2. Main VendorDashboard Component ---
const VendorDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState({ open: false, data: null });

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      setLoading(true);
      const profileRes = await axios.get("http://localhost:5000/api/vendors/me", config);
      const vendorData = profileRes.data.data?.vendor || profileRes.data.vendor;
      setProfile(vendorData);

      const [productsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/products", config),
        axios.get("http://localhost:5000/api/orders", config).catch(() => ({ data: { data: [] } }))
      ]);

      if (vendorData) {
        const myId = (vendorData._id || vendorData.id).toString();
        const allProducts = productsRes.data.data?.products || productsRes.data.products || [];
        setMyProducts(allProducts.filter(p => (p.vendor?._id || p.vendor || "").toString() === myId));

        const allOrders = ordersRes.data.data?.orders || ordersRes.data.orders || [];
        setMyOrders(allOrders.filter(order => 
          order.cartItems.some(item => (item.product?.vendor?._id || item.product?.vendor || "").toString() === myId)
        ));
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMyProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) { alert("Action failed"); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full mb-6" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Authenticating</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex pt-24 overflow-x-hidden" dir="ltr">
      
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-white border-r border-slate-50 h-[calc(100vh-96px)] sticky top-24 hidden lg:flex flex-col p-10">
        <div className="mb-16 px-2 text-left">
            <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Management</h2>
            <nav className="space-y-4">
            <button 
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "inventory" ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:text-emerald-600'}`}
            >
                <Package size={16}/> Inventory
            </button>
            <button 
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "orders" ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:text-emerald-600'}`}
            >
                <ShoppingCart size={16}/> Logistics
            </button>
            </nav>
        </div>

        <div className="mt-auto">
            <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="group flex items-center gap-4 px-6 py-4 text-slate-300 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-all">
            <LogOut size={16} /> Terminate Session
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-20 max-w-7xl text-left">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">{profile?.storeName}</p>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                Vendor <span className="italic font-serif font-light text-slate-300">Station.</span>
            </h1>
          </motion.div>
          
          <motion.button 
            variants={fadeInUp} initial="hidden" animate="visible"
            onClick={() => setModalMode({ open: true, data: null })} 
            className="flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all"
          >
            <PlusCircle size={18} /> New Listing
          </motion.button>
        </header>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.1} className="bg-slate-50 p-12 rounded-[3.5rem] relative overflow-hidden group">
            <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-100 group-hover:text-emerald-100 transition-colors" />
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Total Revenue</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">EGP {profile?.balance?.toFixed(2) || "0.00"}</h3>
                <span className="text-emerald-500 text-[10px] font-black flex items-center gap-1"><TrendingUp size={12}/> +12%</span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.2} className="bg-slate-50 p-12 rounded-[3.5rem] relative overflow-hidden group">
            <ShoppingCart className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-100 group-hover:text-blue-100 transition-colors" />
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Active Deliveries</p>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{myOrders.length} <span className="text-slate-300 font-serif font-light text-3xl italic">Units</span></h3>
          </motion.div>
        </div>

        {/* Table/List Data Container */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.3} className="space-y-8">
            <div className="flex items-center gap-4 mb-10">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 whitespace-nowrap">{activeTab === "inventory" ? "Global Inventory" : "Customer Ledger"}</h2>
                <div className="h-[1px] w-full bg-slate-50" />
            </div>

            {activeTab === "inventory" ? (
                <div className="space-y-4">
                {myProducts.length > 0 ? myProducts.map((p) => (
                    <div key={p._id} className="group flex items-center gap-8 p-6 bg-white border border-slate-50 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500">
                        <div className="w-20 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                            <img src={p.imageCover || `http://localhost:5000/img/products/${p.image}`} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" onError={(e) => e.target.src = "https://placehold.co/200x200"} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-slate-900 text-lg tracking-tight">{p.name}</h4>
                            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mt-1">EGP {p.price}</p>
                        </div>
                        <div className="text-center px-10 hidden md:block">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Stock</p>
                            <p className="font-bold text-slate-900">{p.stock}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setModalMode({ open: true, data: p })} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"><Edit3 size={18}/></button>
                            <button onClick={() => handleDelete(p._id)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                        </div>
                    </div>
                )) : <p className="p-20 text-center font-bold text-slate-300 italic">Vault is empty.</p>}
                </div>
            ) : (
                <div className="space-y-4">
                {myOrders.length > 0 ? myOrders.map((order) => (
                    <div key={order._id} className="group flex items-center gap-8 p-8 bg-white border border-slate-50 rounded-[2rem] hover:shadow-xl transition-all">
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Order Ref: {order._id.slice(-6)}</p>
                            <h4 className="font-black text-slate-900 text-lg tracking-tight">{order.user?.name || "Private Client"}</h4>
                        </div>
                        <div className="hidden md:block">
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Valuation</p>
                             <p className="font-black text-emerald-600">EGP {order.totalOrderPrice}</p>
                        </div>
                        <div className="px-6 py-2 bg-slate-50 rounded-xl">
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${order.isPaid ? 'text-emerald-500' : 'text-orange-400'}`}>
                                {order.isPaid ? "Settled" : "Awaiting Payment"}
                            </span>
                        </div>
                        <button className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"><Eye size={18}/></button>
                    </div>
                )) : <p className="p-20 text-center font-bold text-slate-300 italic">No logistics recorded.</p>}
                </div>
            )}
        </motion.div>
      </main>

      {/* Modal Render */}
      {modalMode.open && <ProductModal onClose={() => setModalMode({ open: false, data: null })} initialData={modalMode.data} />}
    </div>
  );
};

export default VendorDashboard;