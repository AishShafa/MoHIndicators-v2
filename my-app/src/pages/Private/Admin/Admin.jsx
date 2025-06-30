import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/HomeOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import BarChartIcon from '@mui/icons-material/BarChartOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "./Admin.css"; 
import HealthDataForm from "../../Private/HealthData/HealthDataForm";
import Users from "./Users";

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
  const [activeUserSubsection, setActiveUserSubsection] = useState("New User"); // Track active user subsection
  const [isUsersExpanded, setIsUsersExpanded] = useState(false); // Track if Users section is expanded in sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Track sidebar state
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    // Clear user data (e.g., token)
    localStorage.removeItem("token");
    localStorage.removeItem("keepLoggedIn");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("userSession");
    // Redirect to login page
    navigate("/login");
    window.location.reload();
  };
  const handleSidebarClick = (label) => {
    if (label === "Logout") {
      handleLogout();
    } else if (label === "Users") {
      setActiveSidebar(label);
      setIsUsersExpanded(!isUsersExpanded); // Toggle Users accordion
    } else {
      setActiveSidebar(label);
      setIsUsersExpanded(false); // Close Users accordion when clicking other items
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <div className="admin-dashboard" role="main" aria-label="Dashboard">
        <nav
          className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}
          aria-label="Admin dashboard navigation"
          role="navigation"
        >
          <div className="sidebar-nav" tabIndex={-1}>
            {sidebarItems.map(({ label, icon }) => (
              <div key={label}>
                <div
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
                  title={isSidebarCollapsed ? label : undefined}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="icon" aria-hidden="true">
                      {icon}
                    </span>
                    {!isSidebarCollapsed && <span>{label}</span>}
                  </div>
                  {!isSidebarCollapsed && label === "Users" && activeSidebar === "Users" && (
                    <span style={{ 
                      transform: isUsersExpanded ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.2s',
                      fontSize: '12px'
                    }}>
                      ▼
                    </span>
                  )}
                </div>
                
                {/* Users Accordion Subsections */}
                {!isSidebarCollapsed && label === "Users" && isUsersExpanded && (
                  <div className="user-accordion" style={{
                    marginLeft: '20px',
                    marginTop: '5px',
                    marginBottom: '10px'
                  }}>
                    {["New User", "Manage Users", "Users History"].map((subsection) => (
                      <div
                        key={subsection}
                        className={`subsection-item ${activeUserSubsection === subsection ? 'active-subsection' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveUserSubsection(subsection);
                        }}
                        style={{
                          padding: '8px 12px',
                          marginBottom: '5px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          backgroundColor: activeUserSubsection === subsection ? '#dcf5e9' : 'transparent',
                          color: activeUserSubsection === subsection ? '#046c4e' : '#666',
                          fontWeight: activeUserSubsection === subsection ? '600' : 'normal',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (activeUserSubsection !== subsection) {
                            e.target.style.backgroundColor = '#f0f0f0';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeUserSubsection !== subsection) {
                            e.target.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {subsection}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Toggle button */}
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            <span className="toggle-icon">
              {isSidebarCollapsed ? <AddIcon /> : <RemoveIcon />}
            </span>
          </div>
        </nav>

        <section className="content" aria-label={`${activeSidebar} panel`}>
          {activeSidebar !== "Health Data" && activeSidebar !== "Users" && (
            <div className="header-row" style={{ gap: '10px' }}>
              <button className="back-button" style={{ visibility: 'hidden', width: 0, padding: 0, margin: 0, minWidth: 0 }} aria-hidden="true" tabIndex={-1} />
              <div className="page-title" style={{ marginLeft: '0.5rem' }}>
                {activeSidebar === "Dashboard" ? "Dashboard" :
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
            <div>
              <Users 
                activeUserSubsection={activeUserSubsection}
                setActiveUserSubsection={setActiveUserSubsection}
              />
            </div>
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

