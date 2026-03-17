import React, { useEffect, useState } from "react";
import api from "../api/axios";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/vendor/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Orders Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-black mb-8 text-gray-800">طلبات الزبائن 📦</h1>
      
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">العميل</th>
              <th className="p-4">المنتجات</th>
              <th className="p-4">إجمالي السعر</th>
              <th className="p-4">العنوان</th>
              <th className="p-4">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold">{order.user?.name}</td>
                <td className="p-4 text-sm">
                  {order.items.map((item, i) => (
                    <div key={i}>{item.product?.name} (x{item.quantity})</div>
                  ))}
                </td>
                <td className="p-4 text-blue-600 font-bold">{order.totalPrice} EGP</td>
                <td className="p-4 text-xs text-gray-500">{order.shippingAddress?.city} - {order.shippingAddress?.address}</td>
                <td className="p-4">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                    قيد التجهيز
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="p-10 text-center text-gray-400">مفيش طلبات جاتلك لسه يا بطلة.. شدي حيلك! 🚀</div>}
      </div>
    </div>
  );
};

export default VendorOrders;