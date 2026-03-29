import React, { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";


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

  const fetchCart = async () => {
  try {
    const res = await api.get("/cart");

    console.log("FULL RESPONSE 👉", res.data); 

    const items =
      res.data?.cart?.items ||
      res.data?.data?.cart?.items ||
      res.data?.data?.items ||
      [];

    setCartItems(items);
  } catch (err) {
    console.error("Cart Error:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || item.price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const orderData = {
  items: cartItems.map((item) => ({
    product: item.productId?._id,
    quantity: item.quantity,
  })),
  totalPrice: calculateTotal(),
  shippingAddress: form,
};

    if (cartItems.length === 0) {
  alert("Your cart is empty - please add items before checking out.");
  return;
}

    console.log("Sending Order ", orderData); 

    await api.post("/orders", orderData);

    await api.delete("/cart");

    alert("Order placed successfully! Thank you for shopping with us. ");
    navigate("/");
  } catch (error) {
    console.error("Order Error:", error.response?.data);
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
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-black text-emerald-900 mb-10">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 space-y-6"
          >
            <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
              <Truck size={20} /> Shipping Info
            </h2>

            <input name="name" placeholder="Full Name" onChange={handleChange} required className="input" />
            <input name="email" placeholder="Email" onChange={handleChange} required className="input" />
            <input name="phone" placeholder="Phone" onChange={handleChange} required className="input" />
            <input name="address" placeholder="Address" onChange={handleChange} required className="input" />
            <input name="city" placeholder="City" onChange={handleChange} required className="input" />

            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition">
              Place Order
            </button>
          </form>

          {/* SUMMARY */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 h-fit">
            <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
              <CreditCard size={20} /> Order Summary
            </h2>

            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between mb-2 text-sm">
                <span>{item.productId?.name}</span>
                <span>
                  {item.quantity} × {item.productId?.price}
                </span>
              </div>
            ))}

            <div className="flex justify-between mt-4 text-emerald-800">
              <span>Subtotal</span>
              <span className="font-bold">EGP {calculateTotal()}</span>
            </div>

            <div className="flex justify-between mb-4 text-emerald-800">
              <span>Shipping</span>
              <span className="text-emerald-500 font-bold text-sm">
                FREE
              </span>
            </div>

            <div className="flex justify-between text-2xl font-black text-emerald-900">
              <span>Total</span>
              <span>EGP {calculateTotal()}</span>
            </div>

            <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black">
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;