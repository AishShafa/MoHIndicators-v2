import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Register from "./Register";
import History from "./History";

const Users = ({ activeUserSubsection, setActiveUserSubsection }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    role: '',
    password: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7); // Show 7 users per page

  // Fetch users from database
  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("You must be logged in to view users");
      setLoading(false);
      return;
    }
    

    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const formattedUsers = response.data.map(user => ({
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        status: 'active', // You can add status field to database if needed
        lastLogin: new Date(user.created_at).toLocaleDateString(),
        avatar: user.username.substring(0, 2).toUpperCase()
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Fetch users error:", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.error || "Failed to fetch users");
      } else {
        toast.error("Unable to connect to the server");
      }
    }
    setLoading(false);
  };

  // Load users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "" || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setEditingUser(null); // Cancel any editing when changing pages
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setEditingUser(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setEditingUser(null);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages with ellipsis logic
      if (currentPage <= 3) {
        // Show first pages
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show middle pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditForm({
      username: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
  };

  // Handle update user
  const handleUpdateUser = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("You must be logged in to update users");
      return;
    }

    // Validate required fields
    if (!editForm.username || !editForm.email || !editForm.role) {
      toast.error("Username, email, and role are required");
      return;
    }

    try {
      const updateData = {
        username: editForm.username,
        email: editForm.email,
        role: editForm.role
      };

      // Only include password if it's provided
      if (editForm.password && editForm.password.trim() !== '') {
        updateData.password = editForm.password;
      }

      await axios.put(`http://localhost:5000/users/${editingUser}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      toast.success("User updated successfully!");
      setEditingUser(null);
      setEditForm({ username: '', email: '', role: '', password: '' });
      fetchUsers(); // Refresh the users list
    } catch (err) {
      console.error("Update user error:", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.error || "Failed to update user");
      } else {
        toast.error("Unable to connect to the server");
      }
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("You must be logged in to delete users");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      toast.success("User deleted successfully!");
      fetchUsers(); // Refresh the users list
    } catch (err) {
      console.error("Delete user error:", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.error || "Failed to delete user");
      } else {
        toast.error("Unable to connect to the server");
      }
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ username: '', email: '', role: '', password: '' });
  };

  return (
    <div>
      {activeUserSubsection === "New User" && (
        <div>
          <Register 
            onUserRegistered={fetchUsers} 
            onNavigateBack={() => setActiveUserSubsection("Manage Users")}
          />
        </div>
      )}

      {activeUserSubsection === "Manage Users" && (
        <div className="users-section">
          <div className="header-row">
            <div className="page-title">
              Manage Users
              <div className="page-title-underline" />
            </div>
          </div>
          <div className="health-data-form users-content">
            
            {/* Search and Filter Section */}
            <div className="form-section" style={{ marginBottom: '20px' }}>
              <div className="form-group">
                <label htmlFor="searchUsers">Search Users</label>
                <input
                  type="text"
                  id="searchUsers"
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="filterRole">Filter by Role</label>
                <select 
                  id="filterRole"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>

            <div className="form-divider"></div>

            {/* Users Table */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Loading users...
                </div>
              ) : (
                <>
                  <div className="users-table-container">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Created Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            {editingUser === user.id ? (
                              <input
                                type="text"
                                value={editForm.username}
                                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                style={{ width: '150px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                              />
                            ) : (
                              <div className="user-info">
                                <div className="user-avatar">{user.avatar}</div>
                                <span>{user.name}</span>
                              </div>
                            )}
                          </td>
                          <td>
                            {editingUser === user.id ? (
                              <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                style={{ width: '180px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                              />
                            ) : (
                              user.email
                            )}
                          </td>
                          <td>
                            {editingUser === user.id ? (
                              <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                style={{ width: '100px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                              >
                                <option value="User">User</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                              </select>
                            ) : (
                              <span className={`role-badge ${user.role.toLowerCase()}`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            )}
                          </td>
                          <td>
                            {editingUser === user.id ? (
                              <div>
                                <input
                                  type="password"
                                  placeholder="New password (optional)"
                                  value={editForm.password}
                                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                                  style={{ width: '150px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                              </div>
                            ) : (
                              <span className={`status-badge ${user.status}`}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </span>
                            )}
                          </td>
                          <td>{user.lastLogin}</td>
                          <td>
                            <div className="action-buttons">
                              {editingUser === user.id ? (
                                <>
                                  <button 
                                    className="action-btn edit"
                                    onClick={handleUpdateUser}
                                    style={{ backgroundColor: '#10b981', color: 'white' }}
                                  >
                                    <SaveIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                                    Save
                                  </button>
                                  <button 
                                    className="action-btn delete"
                                    onClick={handleCancelEdit}
                                    style={{ backgroundColor: '#6b7280', color: 'white' }}
                                  >
                                    <CancelIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    className="action-btn edit"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <EditIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                                    Edit
                                  </button>
                                  <button 
                                    className="action-btn delete"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <DeleteIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {currentUsers.length === 0 && !loading && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                            {filteredUsers.length === 0 ? 
                              "No users found matching your search criteria." :
                              "No users on this page."
                            }
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                  <div className="pagination-container">
                    <div className="pagination-info">
                      Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                    </div>
                    <div className="pagination-controls">
                      <button 
                        className="pagination-btn" 
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      
                      {getPageNumbers().map((pageNumber, index) => (
                        pageNumber === '...' ? (
                          <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                        ) : (
                          <button
                            key={pageNumber}
                            className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        )
                      ))}
                      
                      <button 
                        className="pagination-btn" 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {activeUserSubsection === "Users History" && (
        <div>
          <History />
        </div>
      )}
    </div>
  );
};

export default Users;
