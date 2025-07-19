import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import Home from "./components/Home";
import LostFoundSystem from "./pages/BrowseItmes";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import ItemsDetails from "./pages/ItemsDetails";
import ReporteForm from "./pages/ReporteForm";
import VerifyList from '../admin/VerifyList'; 
import AdminProtectedRoute from '../admin/AdminProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/browseitems" element={<LostFoundSystem />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/item/:id" element={<ItemsDetails />} />
            <Route path="/report-item" element={<ReporteForm />} />
          </Route>
        </Route>

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin-dashboard" element={<VerifyList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
