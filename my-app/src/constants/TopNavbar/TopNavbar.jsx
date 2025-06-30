import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./TopNavbar.css";
import "../../pages/Private/Login/Login.css"; 

const TopNavbar = ({ userData, isLoggedIn, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div id="webcrumbs">
      <div className="bg-white">
        <div className="border-b border-gray-300 w-full">
          <div className="w-full px-4">
            {/* Header */}
            <header className="flex items-center justify-between py-3 px-6">
              <div className="flex items-center">
                {/* Logo Section */}
                <div className="logo-circle">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 12H6L9 3L15 21L18 12H22"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="line-one">Health Indicators</h1>
                  <p className="line-two">Ministry of Health, Republic of Maldives</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="navbar">
                <Link
                  to="/home"
                  className={`nav-link ${location.pathname === "/home" ? "active" : ""}`}
                >
                  HOME
                </Link>
                <Link
                  to="/"
                  className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                >
                  RESULTS
                </Link>
                <Link
                  to="/about"
                  className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                >
                  ABOUT
                </Link>

                {/* User-specific Links */}
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/admin"
                      className={`nav-link ${
                        location.pathname === "/admin" ? "active" : ""
                      }`}
                    >
                      DASHBOARD
                    </Link>
                    <button
                      onClick={logout}
                      className="logout-button"
                    >
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="login-button"
                  >
                    LOGIN
                  </Link>
                )}
              </nav>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
