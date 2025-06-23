import React, { useState } from "react";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import "./Admin.css"; 
import HealthDataForm from "../../Private/HealthData/HealthDataForm";

const sidebarItems = [
  { label: "Dashboard", icon: <HomeIcon /> },
  { label: "Users", icon: <PeopleIcon /> },
  { label: "Reports", icon: <BarChartIcon /> },
  { label: "Settings", icon: <SettingsIcon /> },
  { label: "Health Data", icon: <BarChartIcon /> },
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
                onClick={() => setActiveSidebar(label)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveSidebar(label);
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
          <header className="header" tabIndex={-1}>
            {activeSidebar}
          </header>

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
              {activeSidebar === "Health Data" && <HealthDataForm />}
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

export default Admin;

