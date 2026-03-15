import logo from './logo.svg';
import React, { useState } from "react";

import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Products from './pages/Products'
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Home from './pages/Home'

import ProtectedRoute from "./components/ProtectedRoute";
import VendorDashboard from "./pages/VendorDashboard";
import MyOrders from "./pages/MyOrders";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
const user = JSON.parse(localStorage.getItem("user")); // لازم يكون فيه "role": "vendor" جوه

  return (
    // جلب البيانات من localStorage
        <Router>
      <Header />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
         <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart token={token} />} />
        <Route path="/" element={<Products />} />
        <Route path="/my-orders" element={<MyOrders />} />
        {/* <Route
  path="/vendor/dashboard"
  element={
    <ProtectedRoute user={user}>
      <VendorDashboard />
    </ProtectedRoute>
  }
/> */}
<Route path="/vendor/dashboard" element={<VendorDashboard />} />
      </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;




// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // استيراد الصفحات
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Products from "./pages/Products";
// import Cart from "./pages/Cart";

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");

//   return (
//     <Router>
//       <Routes>
        
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login setToken={setToken} />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/cart" element={<Cart token={token} />} />
//         <Route path="/" element={<Products />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;