import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Registration from "./components/global/Registration";
import Login from "./components/global/Login";
import Home from "./components/global/Home";
import ProtectedRoute from "./components/global/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
