import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import BottomBar from "./constants/BottomBar/BottomBar";
import TopNavBar from "./constants/TopNavbar/TopNavbar";

// Pages
import Dashboard from "./pages/Public/Dashboard/Dashboard";
import LoginPage from "./pages/Private/Login/Login";
import SamplePage from "./pages/Public/Dashboard/dashboardsample";
import HomePage from "./pages/Private/Admin/Admin";
import AdminPage from "./pages/Private/Admin/Admin";
import RegisterPage from "./pages/Private/Admin/Register"; 

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <TopNavBar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<SamplePage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            user && user.role.toLowerCase() === "admin" ? (
              <AdminPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Register page only for admin */}
        <Route
          path="/register"
          element={
            user && user.role.toLowerCase() === "admin" ? (
              <RegisterPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Dashboard route based on role */}
        <Route
          path="/dashboard"
          element={
            user && user.role.toLowerCase() === "admin" ? (
              <AdminPage />
            ) : (
              <Dashboard />
            )
          }
        />
      </Routes>

      <BottomBar />
    </Router>
  );
}

export default App;
