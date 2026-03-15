import React, { useEffect, useState } from "react";
import api from "../api/axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-20 font-bold">جاري تحميل طلباتك...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 text-right" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8">طلباتي السابقة</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
            <p className="text-gray-500">لسه معملتيش أي أوردرات يا نورة.. يلا املئي السلة! 🛒</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-4">
                  <div>
                    <span className="text-sm text-gray-400">رقم الطلب:</span>
                    <span className="text-sm font-bold text-gray-800 mr-2">#{order._id.slice(-6)}</span>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${order.status === 'Processing' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {order.status || 'قيد التنفيذ'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-700">
                      <span>{item.product?.name || "منتج"} (x{item.quantity})</span>
                      <span className="font-bold">{item.price} EGP</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-gray-500 text-sm">
                    <p>عنوان الشحن: {order.shippingAddress?.city}, {order.shippingAddress?.address}</p>
                  </div>
                  <div className="text-xl font-black text-blue-600">
                    {order.totalPrice} EGP
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;