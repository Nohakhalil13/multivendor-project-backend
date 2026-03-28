import React, { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");

      const items =
        response.data?.data?.cart?.items || response.data?.data?.items || [];

      setCartItems(items);
    } catch (error) {
      console.error("Cart Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    if (!Array.isArray(cartItems)) return 0;

    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || item.price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  const navigate = useNavigate();

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await api.put("/cart", {
        productId,
        quantity: newQuantity,
      });

      fetchCartItems();
    } catch (error) {
      console.error("Update Error:", error.response?.data);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCartItems();
    } catch (error) {
      console.error("Delete Error:", error.response?.data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-600 font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 p-4 md:p-10" dir="ltr">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold mb-6 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition"
          />
          Back to Shopping
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-emerald-600" size={32} />
          <h1 className="text-3xl font-bold text-emerald-900">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-emerald-100">
            <p className="text-emerald-800 text-xl font-medium mb-6">
              Your cart is empty
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const productData = item.productId || {};

                const productId =
                  productData._id || item.product?._id || item._id;

                return (
                  <div
                    key={item._id}
                    className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border"
                  >
                    {/* Image */}
                    <img
                      src={
                        productData.image ||
                        "https://via.placeholder.com/150"
                      }
                      className="w-20 h-20 rounded-xl object-cover"
                      alt=""
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-emerald-900">
                        {productData.name || "Product"}
                      </h3>
                      <p className="text-emerald-700 font-bold">
                        EGP {productData.price || item.price || 0}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl">
                      <button
                        onClick={() =>
                          updateQuantity(productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-emerald-100 disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(productId, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-emerald-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(productId)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border h-fit">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">
                Summary
              </h2>

              <div className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span className="font-bold">
                  EGP {calculateTotal()}
                </span>
              </div>

              <div className="flex justify-between mb-6">
                <span>Shipping</span>
                <span className="text-emerald-500 font-bold text-xs">
                  FREE
                </span>
              </div>

              <div className="flex justify-between mb-8 text-xl font-black">
                <span>Total</span>
                <span>EGP {calculateTotal()}</span>
              </div>

              <button
                onClick={() =>
                 navigate("/checkout", {
                  state: { cartItems },
                  })
                }
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition"
              >
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
