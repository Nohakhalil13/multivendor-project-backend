import React, { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCartAPI, createOrderAPI } from "../api";

const Checkout = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCartAPI();
        setCartItems(items);
      } catch (err) {
        console.error("Cart Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  /* ================= TOTAL ================= */
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const orderData = {
        cartItems: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.productId?.price || item.price,
        })),
        totalPrice: calculateTotal(),
        shippingAddress: form,
      };

      await createOrderAPI(orderData);

      alert("Order placed successfully!");

      navigate("/orders"); // 🔥 أهم خطوة
    } catch (error) {
      console.error("Order Error:", error);
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
    <div className="min-h-screen bg-emerald-50/30 p-4 md:p-10"dir="ltr">
      <div className="max-w-5xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-emerald-700 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <h1 className="text-3xl font-black text-emerald-900 mb-10">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow space-y-5"
          >
            <h2 className="font-bold flex items-center gap-2">
              <Truck size={20} /> Shipping Info
            </h2>

            <input name="name" placeholder="Full Name" onChange={handleChange} required className="input" />
            <input name="email" placeholder="Email" onChange={handleChange} required className="input" />
            <input name="phone" placeholder="Phone" onChange={handleChange} required className="input" />
            <input name="address" placeholder="Address" onChange={handleChange} required className="input" />
            <input name="city" placeholder="City" onChange={handleChange} required className="input" />

            <button className="w-full bg-emerald-500 text-white py-3 rounded-xl">
              Place Order
            </button>
          </form>

          {/* SUMMARY */}
          <div className="bg-white p-8 rounded-3xl shadow h-fit">
            <h2 className="font-bold flex items-center gap-2 mb-6">
              <CreditCard size={20} /> Order Summary
            </h2>

            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-sm mb-2">
                <span>{item.productId?.name}</span>
                <span>{item.quantity} × {item.productId?.price}</span>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <span>Subtotal</span>
              <span>EGP {calculateTotal()}</span>
            </div>

            <div className="flex justify-between text-xl font-bold mt-4">
              <span>Total</span>
              <span>EGP {calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;