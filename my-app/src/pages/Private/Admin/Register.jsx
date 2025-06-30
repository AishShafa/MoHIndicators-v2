import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import "./Register.css";

export default function Register({ onUserRegistered, onNavigateBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // Default role

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to register users");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
        role
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      setLoading(false);
      
      if (response.status === 201) {
        toast.success("User registered successfully!");
        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("User");
        
        // Call the callback to refresh users list
        if (onUserRegistered) {
          onUserRegistered();
        }
      }
    } catch (err) {
      setLoading(false);
      console.error("Register error:", err);
      
      if (err.response && err.response.data) {
        toast.error(err.response.data.error || "Registration failed");
      } else {
        toast.error("Unable to connect to the server");
      }
    }
  };

  return (
    <>
      <div className="header-row">
        <button className="back-button" onClick={() => onNavigateBack && onNavigateBack()}>
          <ArrowBackIcon style={{ marginRight: 8, verticalAlign: "middle" }} />
          Manage Users
        </button>
        <div className="page-title">
          Register New User
          <div className="page-title-underline" />
        </div>
      </div>
      <div className="register-form-container">
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Enter username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Enter email address"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select 
                id="role"
                name="role"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="User">User</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              className={`save-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              <SaveIcon style={{ marginRight: 8, verticalAlign: "middle" }} />
              {loading ? "Registering..." : "Register User"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
