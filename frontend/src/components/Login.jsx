import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import api from "../api";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    
    console.log("Server Response:", response.data);

    const token = response.data.token || response.data.data?.token;

    if (token) {
      localStorage.setItem("token", token);
      
      alert("Login successful! Redirecting to products...");
      navigate("/products");
    } else {
      console.error("Login succeeded but NO token was found in the response!");
      alert("Login issue: Token not received.");
    }

  } catch (error) {
    console.error(
      "Login Error:",
      error.response ? error.response.data : error.message
    );
    alert("Login failed. Please check your credentials.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4 font-sans " dir="ltr" >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-emerald-700 mt-2">
            Please enter your details to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="name@company.com"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 ${
                errors.email
                  ? "border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-emerald-200 border-gray-300 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-emerald-800">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 ${
                errors.password
                  ? "border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-emerald-200 border-gray-300 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-emerald-700 cursor-pointer select-none"
            >
              Remember me for 30 days
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 transform active:scale-95"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-emerald-50 pt-6">
          <p className="text-sm text-emerald-700 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;