import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/HomeOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import BarChartIcon from '@mui/icons-material/BarChartOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import "./Admin.css"; 
import HealthDataForm from "../../Private/HealthData/HealthDataForm";

const sidebarItems = [
  { label: "Dashboard", icon: <HomeIcon /> },
  { label: "Users", icon: <PeopleIcon /> },
  { label: "Reports", icon: <BarChartIcon /> },
  { label: "Settings", icon: <SettingsIcon /> },
  { label: "Health Data", icon: <MonitorHeartOutlinedIcon /> },
  { label: "Logout", icon: <LogoutIcon /> },
];

const statsData = [
  { title: "Total Users", value: 1250, change: "+12%" },
  { title: "Active Sessions", value: 350, change: "+5%" },
  { title: "New Signups", value: 85, change: "-1.8%" },
  { title: "Errors Logged", value: 4, change: "+200%" },
];

const recentActivities = [
  { id: 1, user: "Alice", action: "Created new report", time: "2 min ago" },
  { id: 2, user: "Bob", action: "Updated user permissions", time: "10 min ago" },
  { id: 3, user: "Clara", action: "Fixed a bug in login", time: "30 min ago" },
];

const Admin = () => {
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken")); // Track login status
  const navigate = useNavigate();
 
{ 
  // Logout handler
  const handleLogout = () => {
    // Clear user data (e.g., token)
    localStorage.removeItem("authToken"); // Example key
    sessionStorage.removeItem("userSession");
    setIsLoggedIn(false);
    // Redirect to login page
    navigate("/login");
  };
  const handleSidebarClick = (label) => {
    if (label === "Logout") {
      handleLogout();
    } else {
      setActiveSidebar(label);
    }
  };

  const [healthData, setHealthData] = useState([]);
  const [newHealthEntry, setNewHealthEntry] = useState("");
  const handleAddHealthData = () => {
    if (newHealthEntry) {
      setHealthData([...healthData, newHealthEntry]);
      setNewHealthEntry("");
    }
  };
  const handleDeleteHealthData = (index) => {
    const updatedHealthData = healthData.filter((_, i) => i !== index);
    setHealthData(updatedHealthData);
  };

  return (
    <>
      <div className="admin-dashboard" role="main" aria-label="Admin dashboard">
        <nav
          className="sidebar"
          aria-label="Admin dashboard navigation"
          role="navigation"
        >
          <div className="sidebar-header" aria-label="Admin dashboard logo and title">
            <span aria-hidden="true" className="dashboard-icon"><DashboardOutlinedIcon /></span> Admin Dashboard
          </div>
          <div className="sidebar-nav" tabIndex={-1}>
            {sidebarItems.map(({ label, icon }) => (
              <div
                key={label}
                className={
                  "sidebar-item " + (activeSidebar === label ? "active" : "")
                }
                role="button"
                tabIndex={0}
                onClick={() => handleSidebarClick(label)}
               onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSidebarClick(label);
                }
              }}
              aria-current={activeSidebar === label ? "page" : undefined}
              >
                <span className="icon" aria-hidden="true">
                  {icon}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </nav>

        <section className="content" aria-label={`${activeSidebar} panel`}>
          {activeSidebar !== "Health Data" && (
            <div className="header-row" style={{ gap: '10px' }}>
              <button className="back-button" style={{ visibility: 'hidden', width: 0, padding: 0, margin: 0, minWidth: 0 }} aria-hidden="true" tabIndex={-1} />
              <div className="page-title" style={{ marginLeft: '0.5rem' }}>
                {activeSidebar === "Dashboard" ? "Dashboard" :
                 activeSidebar === "Users" ? "Users" :
                 activeSidebar === "Reports" ? "Reports" :
                 activeSidebar === "Settings" ? "Settings" :
                 activeSidebar === "Logout" ? "Logout" : activeSidebar}
                <div className="page-title-underline" />
              </div>
            </div>
          )}

          {activeSidebar === "Dashboard" && (
            <>
              <div className="stats-grid" aria-label="Key metrics overview">
                {statsData.map(({ title, value, change }) => (
                  <article key={title} className="stat-card" role="region" aria-labelledby={title.toLowerCase().replace(/\s+/g, '-') + "-title"}>
                    <h2 id={title.toLowerCase().replace(/\s+/g, '-') + "-title"} className="stat-title">{title}</h2>
                    <p className="stat-value" aria-live="polite">{value.toLocaleString()}</p>
                    <p className="stat-change" aria-live="polite">
                      {change}
                    </p>
                  </article>
                ))}
              </div>

              <div className="activity-section" aria-label="Recent user activities">
                <h3 className="activity-header">Recent Activities</h3>
                <ul className="activity-list">
                  {recentActivities.map(({ id, user, action, time }) => (
                    <li key={id} className="activity-item">
                      <span className="activity-user">{user}</span>
                      <span className="activity-action">{action}</span>
                      <time className="activity-time" dateTime={new Date().toISOString()}>
                        {time}
                      </time>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeSidebar === "Health Data" && (
            <div>
              <HealthDataForm />
            </div>
          )}

          {activeSidebar === "Users" && (
            <p style={{ color: "#555", fontStyle: "italic" }}>
              User management panel coming soon!
            </p>
          )}

          {activeSidebar === "Reports" && (
            <p style={{ color: "#555", fontStyle: "italic" }}>
              Reports analytics coming soon!
            </p>
          )}

          {activeSidebar === "Settings" && (
            <p style={{ color: "#555", fontStyle: "italic" }}>
              Settings configuration coming soon!
            </p>
          )}

          {activeSidebar === "Logout" && (
            <p style={{ color: "#555", fontStyle: "italic" }}>
              Redirecting to logout...
            </p>
          )}
        </section>

    </div>
    </>
  );
};
}

export default Admin;

