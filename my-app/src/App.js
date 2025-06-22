import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Components
import BottomBar from "./constants/BottomBar/BottomBar";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/Login/Login";
import SamplePage from "./pages/Dashboard/dashboardsample";
import HomePage from "./pages/Dashboard/Dashboard"
import TopNavBar from "./constants/TopNavBar/TopNavbar";
import AdminPage from "./pages/Admin/Admin"


function App() {
  return (
    <Router>
      <TopNavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<SamplePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <BottomBar />
    </Router>
  );
}

export default App;

