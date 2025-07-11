import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense, lazy, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import { NotificationProvider } from "./contexts/NotificationContext";

// Components
import TopNavBar from "./constants/TopNavbar/TopNavbar";
import BottomBar from './constants/BottomBar/BottomBar';
import NotificationManager from "./components/NotificationManager/NotificationManager";  

// Pages
import Dashboard from "./pages/Public/Dashboard/Dashboard";
import Results from "./pages/Public/Results/Results";
import SamplePage from "./pages/Public/Dashboard/dashboardsample";

const Login = lazy(() => import("./pages/Private/Login/Login"));
const RegisterPage = lazy(() => import("./pages/Private/Admin/Users/Register"));
const NotFound = lazy(() => import("./pages/Public/NotFound/NotFound"));
const Admin = lazy(() => import("./pages/Private/Admin/Admin"));

const App = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const keepLoggedIn = JSON.parse(localStorage.getItem("keepLoggedIn")) || false;
    const storedUserData = JSON.parse(localStorage.getItem("userData")) || null;
    
    if (token && keepLoggedIn && storedUserData) {
      setIsLoggedIn(true);
      setUserData(storedUserData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("keepLoggedIn");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <NotificationProvider>
      <Router>
        <TopNavBar userData={userData} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <NotificationManager />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Results />} />
            <Route path="/results" element={<Results />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/admin" /> : <Login />}
            />
            <Route path="/about" element={<Admin />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={true}
          closeOnClick
          theme="colored"
        /> 
        <BottomBar />
      </Router>
    </NotificationProvider>
  );
};

export default App;
