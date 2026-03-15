import React, { useEffect, useState } from "react";
import api from "../api/axios"; 
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // حالات الـ Checkout
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    city: "",
    address: "",
    phone: "",
  });

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.cart);
      setTotal(res.data.total);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error fetching cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (!productId || newQuantity < 1) return;
    try {
      await api.put("/cart", { productId, quantity: newQuantity });
      fetchCart();
    } catch (error) {
      alert("Error updating quantity");
    }
  };

  const removeItem = async (productId) => {
    if (!productId) return;
    try {
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch (error) {
      alert("Error removing item");
    }
  };

  // دالة إتمام الشراء النهائية
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/orders", { shippingAddress });
      if (res.data.success) {
        alert("مبروك يا نورة! الطلب سجلناه بنجاح 🎉");
        navigate("/my-orders"); // أو أي صفحة تانية عندك
      }
    } catch (error) {
      alert(error.response?.data?.message || "حدث خطأ أثناء الطلب");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (message || !cart || !cart.items || cart.items.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-sm">
        <div className="text-7xl mb-6">🛍️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">سلتك فاضية</h2>
        <p className="text-gray-500 mb-8">شكلك لسه مأضفتيش حاجة، يلا لفي لفة في المتجر!</p>
        <Link to="/products" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          ابدئي التسوق
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-right">
          <h1 className="text-4xl font-black text-gray-900">سلة المشتريات</h1>
          <p className="text-gray-500 mt-2">عندك {cart.items.filter(i => i.product).length} منتجات في السلة</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* قائمة المنتجات */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => {
              if (!item.product) return null;
              return (
                <div key={item._id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-6 w-full">
                    <img 
                      src={item.product?.image?.startsWith('http') ? item.product.image : `http://localhost:5000/${item.product?.image}`} 
                      alt={item.product?.name}
                      className="w-24 h-24 rounded-2xl object-cover bg-gray-100 shadow-sm"
                    />
                    <div className="flex-1 text-right">
                      <h3 className="text-lg font-bold text-gray-800">{item.product?.name}</h3>
                      <p className="text-blue-600 font-bold mb-3">{item.price} EGP</p>
                      <div className="flex items-center gap-3 bg-gray-50 w-fit px-3 py-1.5 rounded-xl border border-gray-100">
                        <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-red-50 hover:text-red-500 transition-all font-bold text-gray-600">-</button>
                        <span className="font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-green-50 hover:text-green-500 transition-all font-bold text-gray-600">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <p className="text-xl font-black text-gray-900 whitespace-nowrap">{item.price * item.quantity} EGP</p>
                    <button onClick={() => removeItem(item.product?._id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all font-bold text-xs underline">إزالة</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ملخص الحساب و Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-8 text-right">
              {!showCheckout ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">ملخص الحساب</h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between flex-row-reverse text-gray-500">
                      <span>المجموع الفرعي</span>
                      <span className="font-bold text-gray-800">{total} EGP</span>
                    </div>
                    <div className="flex justify-between flex-row-reverse text-gray-500">
                      <span>الشحن</span>
                      <span className="text-green-500 font-bold">مجاني ✨</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between flex-row-reverse text-2xl font-black text-gray-900">
                      <span>الإجمالي</span>
                      <span>{total} EGP</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    إتمام الشراء ←
                  </button>
                </>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">بيانات الشحن</h2>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">المدينة</label>
                    <input 
                      required
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      placeholder="مثال: القاهرة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">العنوان بالتفصيل</label>
                    <input 
                      required
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      placeholder="اسم الشارع، رقم العمارة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">رقم الموبايل</label>
                    <input 
                      required
                      type="tel"
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      placeholder="012xxxxxxxx"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
                    تأكيد الطلب
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-full text-gray-500 text-sm font-bold pt-2"
                  >
                    رجوع للسلة
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;