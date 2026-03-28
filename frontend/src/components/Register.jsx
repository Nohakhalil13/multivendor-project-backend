import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import api from "../api";

const schema = z.object({
  name: z.string().min(1, "Name is required"), 
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "vendor"]).default("user"), 
  storeName: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: zodResolver(schema) });
  const role = watch("role");

  const onSubmit = async (formData) => {
  try {
    const regRes = await api.post("/auth/register", formData); // ابعتي الـ formData كلها أسهل

    const token = regRes.data.token || regRes.data.data?.token;

    if (token) {
      localStorage.setItem("token", token);
      
      // لو vendor بنكمل باقي الـ request
      if (formData.role === "vendor") {
        await api.post("/vendors/create", {
          storeName: formData.storeName,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
        });
      }
      
      alert("Registration successful! 🚀");
      navigate("/products");
    }
  } catch (error) {
    console.error("Error Details:", error.response?.data);
    alert(error.response?.data?.message || "Registration failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4" dir="ltr">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-900">
            Create Account
          </h2>
          <p className="text-emerald-700 mt-2">
            Join us today! It only takes a minute.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-1">
              Username
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Enter your name..."
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-all
             ${
               errors.name
                 ? "border-red-500 focus:ring-red-200"
                 : "border-emerald-200 border border-gray-300 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500"
             }`}
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="name@company.com"
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-all 
          ${errors.email ? "border-red-500 focus:ring-red-200" : "border-emerald-200 border border-gray-300 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500"}`}
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-all
          ${errors.password ? "border-red-500 focus:ring-red-200" : "border-emerald-200 border border-gray-300 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500"}`}
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <select {...register("role")} className="input-style">
            <option value="user">Customer</option>
            <option value="vendor">Vendor</option>
          </select>

          {/* if vendor */}
          {watch("role") === "vendor" && (
            <div className="space-y-4 mt-4 animate-fade-in">
              <input
                {...register("storeName")}
                placeholder="Store Name"
                className="input-style"
              />
              <input
                {...register("address")}
                placeholder="Store Address"
                className="input-style"
              />
              <input
                {...register("phoneNumber")}
                placeholder="Phone Number"
                className="input-style"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform active:scale-95"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-emerald-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;