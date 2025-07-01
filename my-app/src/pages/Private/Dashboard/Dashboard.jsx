import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import RefreshIcon from '@mui/icons-material/Refresh';
import ActivityIcon from '@mui/icons-material/Timeline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './Dashboard.css';

// Sortable Card Component
const SortableStatsCard = ({ stat, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      className={`stat-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...listeners}>
        <DragIndicatorIcon />
      </div>
      <div className="stat-icon" style={{ color: stat.color }}>
        {stat.icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{stat.value.toLocaleString()}</h3>
        <p className="stat-title">{stat.title}</p>
        <p className="stat-description">{stat.description}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      activeSessions: 0,
      newSignups: 0,
      dataLogged: 0
    },
    recentActivity: [],
    userGrowth: [],
    activityTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // State for card order with localStorage persistence
  const [cardOrder, setCardOrder] = useState(() => {
    const saved = localStorage.getItem('dashboard-card-order');
    return saved ? JSON.parse(saved) : ['totalUsers', 'activeSessions', 'newSignups', 'dataLogged'];
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCardOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Save to localStorage
        localStorage.setItem('dashboard-card-order', JSON.stringify(newOrder));
        
        return newOrder;
      });
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to view dashboard data");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/admin/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setDashboardData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch dashboard data error:", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.error || "Failed to fetch dashboard data");
      } else {
        toast.error("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    if (action.includes('login')) return <SupervisorAccountOutlinedIcon/>;
    if (action.includes('POST')) return <PostAddOutlinedIcon/>;
    if (action.includes('GET')) return <VisibilityOutlinedIcon/>;
    if (action.includes('PUT')) return <CreateOutlinedIcon/>;
    if (action.includes('DELETE')) return <DeleteOutlinedIcon/>;
    return <BoltOutlinedIcon/>;
  };

  const getActionColor = (action) => {
    if (action.includes('login')) return '#10b981';
    if (action.includes('POST')) return '#3b82f6';
    if (action.includes('GET')) return '#6b7280';
    if (action.includes('PUT')) return '#f59e0b';
    if (action.includes('DELETE')) return '#ef4444';
    return '#8b5cf6';
  };

  const statsCardsData = {
    totalUsers: {
      id: 'totalUsers',
      title: 'Total Users',
      value: dashboardData.stats.totalUsers,
      icon: <PeopleIcon />,
      color: '#10b981',
      description: 'All registered users'
    },
    activeSessions: {
      id: 'activeSessions',
      title: 'Active Sessions',
      value: dashboardData.stats.activeSessions,
      icon: <TrendingUpIcon />,
      color: '#3b82f6',
      description: 'Active in past 7 days'
    },
    newSignups: {
      id: 'newSignups',
      title: 'New Signups',
      value: dashboardData.stats.newSignups,
      icon: <PersonAddIcon />,
      color: '#f59e0b',
      description: 'Registered in past 7 days'
    },
    dataLogged: {
      id: 'dataLogged',
      title: 'Data Logged',
      value: dashboardData.stats.dataLogged,
      icon: <DataUsageIcon />,
      color: '#8b5cf6',
      description: 'Actions in past 7 days'
    }
  };

  // Get ordered stats cards
  const orderedStatsCards = cardOrder.map(id => statsCardsData[id]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            System overview and analytics
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="refresh-button"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshIcon />
            Refresh
          </button>
        </div>
        
      </div>

      {lastUpdated && (
        <div className="last-updated">
          Last updated: {formatDate(lastUpdated)}
        </div>
      )}

      

      {/* Stats Cards */}
      <div className="dashboard-main-layout">
        <div className="dashboard-left-column">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="stats-grid">
              <SortableContext 
                items={cardOrder}
                strategy={rectSortingStrategy}
              >
                {orderedStatsCards.map((stat) => (
                  <SortableStatsCard
                    key={stat.id}
                    id={stat.id}
                    stat={stat}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>

          {/* Left Content Area */}
          <div className="left-content">
            {/* Quick Stats */}
            <div className="dashboard-card quick-stats-card">
              <div className="card-header">
                <h3 className="card-title">Quick Insights</h3>
              </div>
              <div className="quick-stats">
                <div className="quick-stat">
                  <div className="quick-stat-label">User Activity Rate</div>
                  <div className="quick-stat-value">
                    {dashboardData.stats.totalUsers > 0 
                      ? Math.round((dashboardData.stats.activeSessions / dashboardData.stats.totalUsers) * 100)
                      : 0}%
                  </div>
                </div>
                <div className="quick-stat">
                  <div className="quick-stat-label">Average Actions per Active User</div>
                  <div className="quick-stat-value">
                    {dashboardData.stats.activeSessions > 0 
                      ? Math.round(dashboardData.stats.dataLogged / dashboardData.stats.activeSessions)
                      : 0}
                  </div>
                </div>
                <div className="quick-stat">
                  <div className="quick-stat-label">Growth Rate</div>
                  <div className="quick-stat-value">
                    {dashboardData.stats.totalUsers > 0 
                      ? Math.round((dashboardData.stats.newSignups / dashboardData.stats.totalUsers) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* User Growth Trend */}
            <div className="dashboard-card trend-card">
              <div className="card-header">
                <h3 className="card-title">Recent Trends</h3>
              </div>
              <div className="trend-content">
                <div className="trend-section">
                  <h4>User Registrations (Last 30 days)</h4>
                  {dashboardData.userGrowth.length > 0 ? (
                    <div className="trend-list">
                      {dashboardData.userGrowth.slice(0, 5).map((item, index) => (
                        <div key={index} className="trend-item">
                          <span className="trend-date">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                          <span className="trend-value">{item.count} users</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No registration data available</p>
                  )}
                </div>
                
                <div className="trend-section">
                  <h4>Activity Trend (Last 7 days)</h4>
                  {dashboardData.activityTrend.length > 0 ? (
                    <div className="trend-list">
                      {dashboardData.activityTrend.map((item, index) => (
                        <div key={index} className="trend-item">
                          <span className="trend-date">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                          <span className="trend-value">{item.count} actions</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No activity data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="dashboard-right-column">
          <div className="dashboard-card activity-card">
            <div className="card-header">
              <h3 className="card-title">
                <ActivityIcon /> Recent Activity
              </h3>
            </div>
            <div className="activity-list">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="activity-details">
                      <div className="activity-user">
                        {activity.username || `User ${activity.user_id}`}
                      </div>
                      <div className="activity-action" style={{ color: getActionColor(activity.action) }}>
                        {activity.action}
                      </div>
                      <div className="activity-time">
                        {formatDate(activity.action_timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activity">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
