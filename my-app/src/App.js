
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/Login/Login";
import AboutPage from "./pages/About/About";
import HomePage from "./pages/Dashboard/dashboardsample"


function App() {
  return (
    <Router>
      {/*<TopNavbar />*/}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
      {/*<BottomBar />*/}
    </Router>
  );
}


export default App;

