import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api"; 
import { Link, useNavigate } from "react-router-dom";
import { User, Store, Mail, Lock, UserCircle, ArrowRight, MapPin, Phone } from "lucide-react";

/**
 * 1. Validation Schema
 * Updated to use 'user' instead of 'customer' to match your Backend logic
 */
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "vendor"]), // Matching: role || "user" in your controller
  storeName: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
}).refine((data) => {
  if (data.role === "vendor") {
    return !!data.storeName && !!data.phoneNumber;
  }
  return true;
}, {
  message: "Store details are required for vendors",
  path: ["storeName"], 
});

const Register = () => {
  const navigate = useNavigate();
  const [serverMsg, setServerMsg] = useState({ text: "", isError: false });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ 
    resolver: zodResolver(schema),
    defaultValues: { role: "user" } 
  });

  const currentRole = watch("role");

  const onSubmit = async (formData) => {
    setServerMsg({ text: "", isError: false });
    try {
      /**
       * Your Backend controller handles both User and Vendor creation 
       * in a single "/auth/register" POST request.
       */
      const res = await api.post("/auth/register", formData);
      
      const token = res.data.token;
      const userData = res.data.data.user;

      if (token) {
        // Save auth data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Update global axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setServerMsg({ text: "Account created successfully! Redirecting...", isError: false });

        // Step 3: Conditional Redirection based on Role
        setTimeout(() => {
          if (userData.role === "vendor") {
            navigate("/vendor-dashboard"); // Redirect to your React Vendor Page
          } else {
            navigate("/products"); // Redirect regular users to products
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data);
      setServerMsg({ 
        text: error.response?.data?.message || "Registration failed. Please try again.", 
        isError: true 
      });
    }
  };

  const inputStyle = (error) => `
    w-full bg-gray-50 border p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 transition-all text-sm
    ${error ? "border-red-400 focus:ring-red-100" : "border-gray-100 focus:ring-[#10b981]/20"}
  `;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-10 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#10b981] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100">
            <Store className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">Join our multivendor marketplace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setValue("role", "user")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${currentRole === 'user' ? 'bg-white text-[#10b981] shadow-sm' : 'text-gray-400'}`}
            >
              <User size={18} /> Customer
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "vendor")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${currentRole === 'vendor' ? 'bg-[#10b981] text-white shadow-md' : 'text-gray-400'}`}
            >
              <Store size={18} /> Vendor
            </button>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input {...register("name")} placeholder="Full Name" className={inputStyle(errors.name)} />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input {...register("email")} placeholder="Email Address" className={inputStyle(errors.email)} />
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="password" {...register("password")} placeholder="Password" className={inputStyle(errors.password)} />
          </div>

          {/* Vendor Fields (Only if role is vendor) */}
          {currentRole === "vendor" && (
            <div className="pt-4 mt-4 border-t border-dashed border-gray-200 space-y-4 animate-in slide-in-from-top duration-300">
              <p className="text-xs font-black text-[#10b981] uppercase tracking-widest ml-2">Store Profile</p>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input {...register("storeName")} placeholder="Store Name *" className={inputStyle(errors.storeName)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input {...register("address")} placeholder="Location" className={inputStyle(errors.address)} />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input {...register("phoneNumber")} placeholder="Phone Number *" className={inputStyle(errors.phoneNumber)} />
                </div>
              </div>
            </div>
          )}

          {serverMsg.text && (
            <div className={`p-3 rounded-xl text-[12px] text-center font-bold ${serverMsg.isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {serverMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#10b981] hover:bg-[#0da372] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-[0.97] disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Register Now"} <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Have an account? <Link to="/login" className="text-[#10b981] font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;