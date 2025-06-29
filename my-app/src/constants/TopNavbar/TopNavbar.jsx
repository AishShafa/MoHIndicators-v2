import React from "react";
import { Link } from "react-router-dom";
import "./TopNavbar.css";

export default function TopNavbar({ user, onLogout }) {
 
    return (
        <div id="webcrumbs">
            <div className="bg-white"> 
                <div className="border-b border-gray-300 w-full">
                <div className="w-full px-4">
                    {/* Header */}
                    <header className="flex items-center justify-between py-3 px-6"> {/* Reduced vertical padding for a shorter bar */}
                        <div className="flex items-center">
                            <div className="flex items-center justify-center" style={{ width: '44px', height: '44px', backgroundColor: '#10b981', borderRadius: '50%', minWidth: '44px', minHeight: '44px', marginRight: '0.75rem' }}>
                                <svg
                                    className="w-6 h-6 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3 12H6L9 3L15 21L18 12H21"
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
                        
                        <nav className="navbar">
                        <Link to="/home" className="nav-link">
                            HOME
                        </Link>
                        <Link to="/" className="nav-link">
                            RESULTS
                        </Link>
                        <Link to="/about" className="nav-link">
                            ABOUT
                        </Link>
                         {/* Conditional Rendering Based on User Login Status */}
                {user ? (
                  <>
                    <Link to="/admin" className="nav-link">
                      ADMIN DASHBOARD
                    </Link>
                    <button
                      onClick={onLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition"
                    >
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium transition"
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
}
