import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { getMyOrdersAPI } from "../api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrdersAPI();
        setOrders(data);
      } catch (error) {
        console.error("Orders Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ================= STATUS STYLE ================= */
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-emerald-600">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24" dir="ltr">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package /> My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-xl shadow">

                {/* HEADER */}
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="font-mono">
                      #{order._id.substring(0, 10)}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="border-t pt-3">
                  {order.cartItems?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span>
                        {item.productId?.name} x{item.quantity}
                      </span>
                      <span>
                        EGP {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="border-t mt-4 pt-3 flex justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-bold">
                    EGP {order.totalPrice}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;