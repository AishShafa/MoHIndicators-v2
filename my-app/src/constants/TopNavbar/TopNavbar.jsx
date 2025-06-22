import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./TopNavbar.css";

export default function TopNavbar() {
 
    return (
        <div id="webcrumbs">
            <div className="bg-gray-50"> 
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <header className="flex items-center justify-between py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-emerald-500 rounded-md flex items-center justify-center mr-3">
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
                                <h1 className="font-bold text-lg">Health Indicators</h1>
                                <p className="text-xs text-gray-500">Ministry of Health, Republic of Maldives</p>
                            </div>
                        </div>
                        

                        <nav className="flex items-center space-x-6">
                        <Link to="/home" className="text-sm font-medium hover:text-emerald-600">HOME</Link>
                        <Link to="/" className="text-sm font-medium text-gray-800 hover:text-emerald-600">RESULTS</Link>
                        <Link to="/about" className="text-sm font-medium hover:text-emerald-600">ABOUT</Link>
                        <Link to="/admin" className="text-sm font-medium hover:text-emerald-600">ADMIN</Link>
                        <Link
                            to="/login"
                            className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-600 transition"
                        >
                            LOGIN
                        </Link>
                        </nav>

                    </header>
                    </div>
            </div>
        </div>
    )
}
