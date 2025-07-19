
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

  return isAdminLoggedIn === "true" ? <Outlet /> : <Navigate to="/login" replace />;
};
export default AdminProtectedRoute;
