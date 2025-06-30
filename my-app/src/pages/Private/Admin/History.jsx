import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 items per page
  // Fetch user history from server
  // Note: Server-side duplicate action prevention is implemented to avoid
  // logging repeated actions (like viewing this history page) within short time frames
  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/users/history', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setHistory(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to fetch user history');
    } finally {
      setLoading(false);
    }
  };

  // Load history when component mounts
  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter history based on search term and action filter
  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchTerm || 
      (item.username && item.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.action && item.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.user_id && item.user_id.toString().includes(searchTerm));
    
    const matchesAction = !actionFilter || 
      (item.action && item.action.toLowerCase().includes(actionFilter.toLowerCase()));
    
    return matchesSearch && matchesAction;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, actionFilter]);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Format metadata for display
  const formatMetadata = (metadata) => {
    if (!metadata) return '-';
    
    try {
      const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
      return (
        <details style={{ cursor: 'pointer' }}>
          <summary style={{ color: '#10b981', fontSize: '0.9rem' }}>View Details</summary>
          <pre style={{ 
            fontSize: '0.8rem', 
            background: '#f8f9fa', 
            padding: '8px', 
            borderRadius: '4px', 
            marginTop: '4px',
            overflow: 'auto',
            maxHeight: '100px'
          }}>
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </details>
      );
    } catch (e) {
      return metadata.toString();
    }
  };

  return (
    <div className="users-section">
      <div className="header-row">
        <div className="page-title">
          Users History
          <div className="page-title-underline" />
        </div>
        <button 
          className="refresh-btn"
          onClick={fetchHistory}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      <div className="health-data-form users-content">
        {/* Filters */}
        <div className="form-section" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label htmlFor="searchHistory">Search History</label>
            <input
              type="text"
              id="searchHistory"
              placeholder="Search by user ID, username, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="filterAction">Filter by Action</label>
            <select
              id="filterAction"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="GET">GET Requests</option>
              <option value="POST">POST Requests</option>
              <option value="PUT">PUT Requests</option>
              <option value="DELETE">DELETE Requests</option>
              <option value="/login">Login Actions</option>
              <option value="/users">User Management</option>
            </select>
          </div>
        </div>

        <div className="form-divider"></div>

        {/* History Table */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading history...
            </div>
          ) : (
            <>
              <div className="users-table-container">
                {filteredHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '1.1rem', color: '#6b7280' }}>
                      {searchTerm || actionFilter ? 'No history found matching your filters' : 'No user history available'}
                    </div>
                  </div>
                ) : (
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Action</th>
                        <th>Timestamp</th>
                        <th>Metadata</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>
                            <span className="user-id-badge">
                              {item.user_id || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: '500' }}>
                              {item.username || 'Unknown User'}
                            </div>
                          </td>
                          <td>
                            <span style={{
                              backgroundColor: item.action?.includes('GET') ? '#dcfce7' :
                                             item.action?.includes('POST') ? '#dbeafe' :
                                             item.action?.includes('PUT') ? '#fef3c7' :
                                             item.action?.includes('DELETE') ? '#fee2e2' : '#f3f4f6',
                              color: item.action?.includes('GET') ? '#166534' :
                                     item.action?.includes('POST') ? '#1e40af' :
                                     item.action?.includes('PUT') ? '#92400e' :
                                     item.action?.includes('DELETE') ? '#dc2626' : '#374151',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              fontWeight: '500'
                            }}>
                              {item.action}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                            {formatTimestamp(item.action_timestamp)}
                          </td>
                          <td style={{ maxWidth: '200px' }}>
                            {formatMetadata(item.metadata)}
                          </td>
                        </tr>
                      ))}
                      {currentItems.length === 0 && !loading && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                            {filteredHistory.length === 0 ? 
                              "No history found matching your search criteria." :
                              "No history on this page."
                            }
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {filteredHistory.length > 0 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredHistory.length)} of {filteredHistory.length} entries
                  </div>
                  
                  <div className="pagination-controls">
                    <button 
                      className="pagination-btn"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    {getPageNumbers().map((number, index) => (
                      number === '...' ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                      ) : (
                        <button
                          key={number}
                          className={`pagination-btn ${number === currentPage ? 'active' : ''}`}
                          onClick={() => typeof number === 'number' ? handlePageChange(number) : null}
                          disabled={typeof number !== 'number'}
                        >
                          {number}
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
  );
};

export default History;
