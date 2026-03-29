import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api";
import { Mail, Lock, ArrowRight, LogIn, ShieldCheck } from "lucide-react"; // Icons ezafya

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Dfna isSubmitting 3ashan el UX
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      const token = response.data.token || response.data.data?.token;
      const userData = response.data.user || response.data.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        if (userData) localStorage.setItem("user", JSON.stringify(userData));

        if (userData?.role === "vendor") {
          navigate("/dashboard-vendor");
        } else {
          navigate("/products");
        }
        window.location.reload();
      } else {
        alert("Login issue: Token not received.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Login failed. Check your email/password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] p-6 font-sans relative overflow-hidden" dir="ltr">
      {/* Background Decorative Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full backdrop-blur-sm bg-white/80 rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.1)] p-10 border border-white relative z-10">
        
        {/* Logo/Icon Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200 rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShieldCheck className="text-white" size={40} />
          </div>
          <h2 className="text-4xl font-black text-emerald-950 tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-emerald-600 font-medium">
            Great to see you again!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-900 ml-1 flex items-center gap-2">
              <Mail size={16} className="text-emerald-500" /> Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                {...register("email")}
                placeholder="name@company.com"
                className={`w-full px-5 py-4 rounded-2xl border bg-white/50 outline-none transition-all duration-300 placeholder:text-gray-400 ${
                  errors.email
                    ? "border-red-400 focus:ring-4 focus:ring-red-50"
                    : "border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 shadow-sm group-hover:border-emerald-300"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-bold flex items-center gap-1 ml-1">
                • {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <Lock size={16} className="text-emerald-500" /> Password
              </label>
              <a href="#" className="text-xs font-black text-emerald-600 hover:text-emerald-800 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`w-full px-5 py-4 rounded-2xl border bg-white/50 outline-none transition-all duration-300 ${
                  errors.password
                    ? "border-red-400 focus:ring-4 focus:ring-red-50"
                    : "border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 shadow-sm group-hover:border-emerald-300"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-bold flex items-center gap-1 ml-1">
                • {errors.password.message}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" id="remember" className="peer hidden" />
                <div className="w-5 h-5 border-2 border-emerald-200 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                  <ShieldCheck size={12} />
                </div>
              </div>
              <span className="text-sm text-emerald-800 font-semibold select-none group-hover:text-emerald-600">Remember me</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[1.25rem] shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_25px_rgba(16,185,129,0.3)] transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing In..." : (
              <>
                Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-emerald-800 font-semibold bg-emerald-50 py-4 rounded-2xl inline-block px-8 border border-emerald-100/50">
            New here?{" "}
            <Link to="/register" className="text-emerald-600 font-black hover:underline ml-1">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;