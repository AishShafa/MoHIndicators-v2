import React from "react";
import { Link } from "react-router-dom";
import "./TopNavbar.css";

export default function TopNavbar() {
 
    return (
        <div id="webcrumbs">
            <div className="bg-white"> 
                <div className="border-b border-gray-300 w-full">
                <div className="w-full px-4">
                    {/* Header */}
                    <header className="flex items-center justify-between py-4 px-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">

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
                        <Link to="/home" className="text-gray-600 hover:text-gray-900">
                        HOME</Link>
                        <Link to="/" className="text-gray-600 hover:text-gray-900">
                        RESULTS</Link>
                        <Link to="/about" className="text-gray-600 hover:text-gray-900">
                        ABOUT</Link>
                        <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                        ADMIN</Link>
                        <Link
                            to="/login"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium transition"
                        >
                            LOGIN
                        </Link>
                        </nav>

                    </header>
                    </div>
            </div>
        </div>
        </div>
    )
}
