import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user }) => {
  // user: ده اللي جاي من الـ localStorage أو context
  if (!user || user.role !== "vendor") {
    // لو مفيش يوزر أو مش Vendor، حوله للـ login
    return <Navigate to="/login" replace />;
  }

  // لو Vendor، خلي الـ children تظهر
  return children;
};

export default ProtectedRoute;