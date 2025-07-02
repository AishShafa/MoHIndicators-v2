import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as XLSX from "xlsx";
import RechartsViewer from "../../../components/Charts/RechartsViewer";
import "./HealthDataForm.css";

const HealthDataForm = ({onNavigateBack}) => {
  const [formData, setFormData] = useState({
    healthIndicator: "",
    location: "",
    gender: "",
    region: "",
    additionalNotes: "",
    metric: "",
    ageGroup: "",
    year: 2025,
    value: "",
  });

  // Global Excel data state - shared across all charts
  const [globalExcelFile, setGlobalExcelFile] = useState(null);
  const [globalExcelData, setGlobalExcelData] = useState([]);
  const [globalExcelColumns, setGlobalExcelColumns] = useState([]);

  const [charts, setCharts] = useState([]);
  const [expandedCharts, setExpandedCharts] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingChart, setEditingChart] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addChart = () => {
    const newChart = {
      id: Date.now(),
      title: "",
      type: "bar",
      description: "",
      xAxis: "",
      yAxis: "",
      color: "#10b981",
      secondaryColor: "#059669",
      backgroundColor: "#ffffff",
      gridLines: "true",
      legendPosition: "top",
      animation: "true",
      borderWidth: "2",
      opacity: "1",
      columnMapping: {
        xAxis: '',
        yAxis: ''
      }
    };
    setCharts([...charts, newChart]);
    setExpandedCharts({...expandedCharts, [newChart.id]: true});
  };

  const removeChart = (chartId) => {
    setCharts(charts.filter(chart => chart.id !== chartId));
    const newExpanded = {...expandedCharts};
    delete newExpanded[chartId];
    setExpandedCharts(newExpanded);
  };

  const updateChart = (chartId, field, value) => {
    setCharts(charts.map(chart => 
      chart.id === chartId ? {...chart, [field]: value} : chart
    ));
  };

  const toggleChartExpansion = (chartId) => {
    setExpandedCharts({
      ...expandedCharts,
      [chartId]: !expandedCharts[chartId]
    });
  };

  const openEditModal = (chart) => {
    setEditingChart({ ...chart });
    setEditModalOpen(true);
    setActiveTab('properties');
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingChart(null);
    setActiveTab('properties');
  };

  const handleEditChartChange = (field, value) => {
    setEditingChart(prev => ({ ...prev, [field]: value }));
  };

  const handleColumnMappingChange = (axis, column) => {
    setEditingChart(prev => ({
      ...prev,
      columnMapping: {
        ...prev.columnMapping,
        [axis]: column
      }
    }));
  };

  // Global Excel file handler - used by all charts
  const handleGlobalExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGlobalExcelFile(file);
      
      // Parse Excel file
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          
          if (jsonData.length > 0) {
            const headers = jsonData[0];
            const rows = jsonData.slice(1);
            
            // Convert to array of objects
            const parsedData = rows.map(row => {
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] || '';
              });
              return obj;
            });
            
            setGlobalExcelData(parsedData);
            setGlobalExcelColumns(headers);
          }
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          alert('Error parsing Excel file. Please ensure it\'s a valid Excel or CSV file.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const saveEditedChart = () => {
    if (editingChart) {
      // Save the updated chart
      setCharts(charts.map(chart => 
        chart.id === editingChart.id ? editingChart : chart
      ));
      closeEditModal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that we have Excel data if charts are configured
    if (charts.length > 0 && (!globalExcelData || globalExcelData.length === 0)) {
      alert('Please upload an Excel file to configure chart data.');
      return;
    }
    
    // Validate that all charts have proper column mapping
    const unmappedCharts = charts.filter(chart => 
      !chart.columnMapping?.xAxis || !chart.columnMapping?.yAxis
    );
    
    if (unmappedCharts.length > 0) {
      alert('Please configure column mapping for all charts before saving.');
      return;
    }
    
    const submissionData = {
      ...formData,
      charts: charts,
      globalExcelData: globalExcelData,
      globalExcelColumns: globalExcelColumns,
      globalExcelFileName: globalExcelFile?.name || null
    };
    
    console.log("Form submitted:", submissionData);
    // TODO: Send data to backend
  };

  return (
      <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Add New Health Data</h1>
          <p className="dashboard-subtitle">
            Create a new indicator along with their name, about, data and chart.
          </p>
          </div>
          <div className="header-actions">
          <button className="back-button" onClick={() => onNavigateBack && onNavigateBack()}>
          <ArrowBackIcon style={{ marginRight: 8, verticalAlign: "middle" }} />
          Back to Health Data
        </button>
        </div>
      </div>
      <div className="health-data-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group full-width">
              <label htmlFor="healthIndicator">Health Indicator *</label>
              <input
                type="text"
                id="healthIndicator"
                name="healthIndicator"
                value={formData.healthIndicator}
                onChange={handleChange}
                placeholder="e.g., Infant Mortality Rate"
                required
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="additionalNotes">About * </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="About this health indicator..."
              />
            </div>
          </div>

          <div className="form-divider"></div>

          {/* Global Data Upload Section */}
          <div className="data-upload-section">
            <div className="section-header">
              <h3 className="section-title">Data Source</h3>
              <p className="section-subtitle">Upload one Excel file to be used for all charts in this indicator</p>
            </div>
            
            <div className="excel-upload-container">
              <div className="excel-upload-section">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleGlobalExcelUpload}
                  id="global-excel-upload"
                  className="excel-input"
                />
                <label htmlFor="global-excel-upload" className="excel-upload-btn">
                  <CloudUploadIcon style={{ marginRight: '8px' }} />
                  {globalExcelFile ? globalExcelFile.name : 'Choose Excel File'}
                </label>
                <p className="upload-help">
                  Upload Excel or CSV file containing data for all charts. 
                  First row should contain column headers.
                </p>
              </div>
              
              {globalExcelFile && globalExcelData.length > 0 && (
                <div className="data-preview-summary">
                  <div className="summary-stats">
                    <div className="stat-item">
                      <span className="stat-label">File:</span>
                      <span className="stat-value">{globalExcelFile.name}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Records:</span>
                      <span className="stat-value">{globalExcelData.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Columns:</span>
                      <span className="stat-value">{globalExcelColumns.length}</span>
                    </div>
                  </div>
                  
                  <div className="columns-preview">
                    <strong>Available Columns:</strong>
                    <div className="columns-list">
                      {globalExcelColumns.map((column, index) => (
                        <span key={index} className="column-tag">{column}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-divider"></div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="charts-header">
              <h3 className="section-title">Charts Configuration</h3>
              <button type="button" className="add-chart-btn" onClick={addChart}>
                <AddIcon style={{ fontSize: '18px', marginRight: '6px' }} />
                Add Chart
              </button>
            </div>

            {charts.length === 0 ? (
              <div className="no-charts-message">
                <p>No charts added yet. Click "Add Chart" to create your first chart.</p>
              </div>
            ) : (
              <div className="charts-list">
                {charts.map((chart, index) => (
                  <div key={chart.id} className="chart-item">
                    <div className="chart-header" onClick={() => toggleChartExpansion(chart.id)}>
                      <div className="chart-title-section">
                        <span className="chart-number">Chart {index + 1}</span>
                        <span className="chart-title-text">
                          {chart.title || "Untitled Chart"}
                        </span>
                      </div>
                      <div className="chart-actions">
                        <button 
                          type="button" 
                          className="edit-chart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(chart);
                          }}
                          title="Edit Chart"
                        >
                          <EditIcon style={{ fontSize: '16px' }} />
                        </button>
                        <button 
                          type="button" 
                          className="remove-chart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeChart(chart.id);
                          }}
                          title="Delete Chart"
                        >
                          <DeleteIcon style={{ fontSize: '16px' }} />
                        </button>
                        <button type="button" className="expand-btn">
                          {expandedCharts[chart.id] ? 
                            <ExpandLessIcon style={{ fontSize: '20px' }} /> : 
                            <ExpandMoreIcon style={{ fontSize: '20px' }} />
                          }
                        </button>
                      </div>
                    </div>

                    {expandedCharts[chart.id] && (
                      <div className="chart-content">
                        <div className="chart-form-section">
                          <div className="form-group">
                            <label>Chart Title *</label>
                            <input
                              type="text"
                              value={chart.title}
                              onChange={(e) => updateChart(chart.id, 'title', e.target.value)}
                              placeholder="Enter chart title"
                            />
                          </div>

                          <div className="form-group">
                            <label>Chart Type *</label>
                            <select
                              value={chart.type}
                              onChange={(e) => updateChart(chart.id, 'type', e.target.value)}
                            >
                              <option value="bar">Bar Chart</option>
                              <option value="line">Line Chart</option>
                              <option value="pie">Pie Chart</option>
                              <option value="area">Area Chart</option>
                              <option value="scatter">Scatter Plot</option>
                              <option value="radar">Radar Chart</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>X-Axis Label</label>
                            <input
                              type="text"
                              value={chart.xAxis}
                              onChange={(e) => updateChart(chart.id, 'xAxis', e.target.value)}
                              placeholder="X-axis label"
                            />
                          </div>

                          <div className="form-group">
                            <label>Y-Axis Label</label>
                            <input
                              type="text"
                              value={chart.yAxis}
                              onChange={(e) => updateChart(chart.id, 'yAxis', e.target.value)}
                              placeholder="Y-axis label"
                            />
                          </div>

                          <div className="form-group">
                            <label>Chart Color</label>
                            <input
                              type="color"
                              value={chart.color}
                              onChange={(e) => updateChart(chart.id, 'color', e.target.value)}
                              className="color-input"
                            />
                          </div>

                          <div className="form-group full-width">
                            <label>Chart Description</label>
                            <textarea
                              value={chart.description}
                              onChange={(e) => updateChart(chart.id, 'description', e.target.value)}
                              placeholder="Describe what this chart represents..."
                              rows="3"
                            />
                          </div>

                          {/* Quick Column Mapping */}
                          {globalExcelColumns.length > 0 && (
                            <div className="quick-mapping">
                              <label>Quick Data Mapping</label>
                              <div className="mapping-row">
                                <div className="mapping-field">
                                  <label>X-Axis Column</label>
                                  <select
                                    value={chart.columnMapping?.xAxis || ''}
                                    onChange={(e) => updateChart(chart.id, 'columnMapping', {
                                      ...chart.columnMapping,
                                      xAxis: e.target.value
                                    })}
                                  >
                                    <option value="">Select Column</option>
                                    {globalExcelColumns.map((column, index) => (
                                      <option key={index} value={column}>{column}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="mapping-field">
                                  <label>Y-Axis Column</label>
                                  <select
                                    value={chart.columnMapping?.yAxis || ''}
                                    onChange={(e) => updateChart(chart.id, 'columnMapping', {
                                      ...chart.columnMapping,
                                      yAxis: e.target.value
                                    })}
                                  >
                                    <option value="">Select Column</option>
                                    {globalExcelColumns.map((column, index) => (
                                      <option key={index} value={column}>{column}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Mini Chart Preview */}
                        {globalExcelData.length > 0 && chart.columnMapping?.xAxis && chart.columnMapping?.yAxis && (
                          <div className="mini-chart-preview">
                            <div className="preview-header">
                              <h4>Chart Preview</h4>
                              <VisibilityIcon style={{ fontSize: '16px', color: '#10b981' }} />
                            </div>
                            <div className="preview-container">
                              <RechartsViewer
                                chartConfig={chart}
                                data={globalExcelData}
                                height={200}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              <SaveIcon style={{ marginRight: 8, verticalAlign: "middle" }} />
              Save Health Data
            </button>
          </div>
        </form>

        {/* Edit Chart Modal */}
        {editModalOpen && editingChart && (
          <div className="modal-overlay">
            <div className="edit-chart-modal">
              <div className="modal-header">
                <h2>Edit Chart: {editingChart.title}</h2>
                <button className="close-modal-btn" onClick={closeEditModal}>
                  <CloseIcon />
                </button>
              </div>

              <div className="modal-content">
                <div className="modal-tabs">
                  <div className="tab-buttons">
                    <button 
                      className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
                      onClick={() => setActiveTab('properties')}
                    >
                      Chart Properties
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
                      onClick={() => setActiveTab('data')}
                    >
                      Data & Values
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
                      onClick={() => setActiveTab('style')}
                    >
                      Style & Colors
                    </button>
                  </div>

                  <div className="tab-content">
                    {/* Chart Properties Tab */}
                    <div className={`tab-panel ${activeTab === 'properties' ? 'active' : ''}`}>
                      <div className="modal-form-grid">
                        <div className="form-group">
                          <label>Chart Title *</label>
                          <input
                            type="text"
                            value={editingChart.title}
                            onChange={(e) => handleEditChartChange('title', e.target.value)}
                            placeholder="Enter chart title"
                          />
                        </div>

                        <div className="form-group">
                          <label>Chart Type *</label>
                          <select
                            value={editingChart.type}
                            onChange={(e) => handleEditChartChange('type', e.target.value)}
                          >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                            <option value="area">Area Chart</option>
                            <option value="scatter">Scatter Plot</option>
                            <option value="doughnut">Doughnut Chart</option>
                            <option value="radar">Radar Chart</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>X-Axis Label</label>
                          <input
                            type="text"
                            value={editingChart.xAxis}
                            onChange={(e) => handleEditChartChange('xAxis', e.target.value)}
                            placeholder="X-axis label"
                          />
                        </div>

                        <div className="form-group">
                          <label>Y-Axis Label</label>
                          <input
                            type="text"
                            value={editingChart.yAxis}
                            onChange={(e) => handleEditChartChange('yAxis', e.target.value)}
                            placeholder="Y-axis label"
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Chart Description</label>
                          <textarea
                            value={editingChart.description}
                            onChange={(e) => handleEditChartChange('description', e.target.value)}
                            placeholder="Describe what this chart represents..."
                            rows="3"
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Chart Description</label>
                          <textarea
                            value={editingChart.description}
                            onChange={(e) => handleEditChartChange('description', e.target.value)}
                            placeholder="Describe what this chart represents..."
                            rows="3"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data & Values Tab */}
                    <div className={`tab-panel ${activeTab === 'data' ? 'active' : ''}`}>
                      <div className="data-preview">
                        <h4>Column Mapping</h4>
                        
                        {!globalExcelFile ? (
                          <div className="no-data-message">
                            <p>Please upload an Excel file in the main form to configure chart data mapping.</p>
                          </div>
                        ) : globalExcelData.length === 0 ? (
                          <p>Loading data from Excel file...</p>
                        ) : (
                          <>
                            <div className="file-info">
                              <p><strong>Using Global Data:</strong> {globalExcelFile.name}</p>
                              <p><strong>Records:</strong> {globalExcelData.length}</p>
                              <p><strong>Columns:</strong> {globalExcelColumns.length}</p>
                            </div>

                            <div className="data-mapping-section">
                              <p>Map your Excel columns to chart axes:</p>
                              
                              <div className="mapping-controls">
                                <div className="form-group">
                                  <label>X-Axis Data Column</label>
                                  <select 
                                    value={editingChart.columnMapping?.xAxis || ''}
                                    onChange={(e) => handleColumnMappingChange('xAxis', e.target.value)}
                                  >
                                    <option value="">Select Column</option>
                                    {globalExcelColumns.map((column, index) => (
                                      <option key={index} value={column}>{column}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div className="form-group">
                                  <label>Y-Axis Data Column</label>
                                  <select
                                    value={editingChart.columnMapping?.yAxis || ''}
                                    onChange={(e) => handleColumnMappingChange('yAxis', e.target.value)}
                                  >
                                    <option value="">Select Column</option>
                                    {globalExcelColumns.map((column, index) => (
                                      <option key={index} value={column}>{column}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Live Chart Preview */}
                            {editingChart.columnMapping?.xAxis && editingChart.columnMapping?.yAxis && (
                              <div className="chart-preview-section">
                                <h5>Live Chart Preview</h5>
                                <div className="preview-container">
                                  <RechartsViewer
                                    chartConfig={editingChart}
                                    data={globalExcelData}
                                    height={250}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="data-table-preview">
                              <h5>Data Sample (First 5 rows)</h5>
                              <div className="table-container" style={{ maxHeight: '300px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0 }}>
                                    <tr>
                                      {globalExcelColumns.map((column, index) => (
                                        <th key={index} style={{ 
                                          padding: '8px 12px', 
                                          borderBottom: '1px solid #e5e7eb', 
                                          fontSize: '12px', 
                                          fontWeight: '600',
                                          textAlign: 'left',
                                          backgroundColor: editingChart.columnMapping?.xAxis === column ? '#dbeafe' : 
                                                         editingChart.columnMapping?.yAxis === column ? '#dcfce7' : '#f9fafb'
                                        }}>
                                          {column}
                                          {editingChart.columnMapping?.xAxis === column && <span style={{ color: '#3b82f6', marginLeft: '4px' }}>(X)</span>}
                                          {editingChart.columnMapping?.yAxis === column && <span style={{ color: '#10b981', marginLeft: '4px' }}>(Y)</span>}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {globalExcelData.slice(0, 5).map((row, rowIndex) => (
                                      <tr key={rowIndex}>
                                        {globalExcelColumns.map((column, colIndex) => (
                                          <td key={colIndex} style={{ 
                                            padding: '8px 12px', 
                                            borderBottom: '1px solid #f3f4f6', 
                                            fontSize: '12px',
                                            backgroundColor: editingChart.columnMapping?.xAxis === column ? '#eff6ff' : 
                                                           editingChart.columnMapping?.yAxis === column ? '#f0fdf4' : 'white'
                                          }}>
                                            {String(row[column] || '')}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {globalExcelData.length > 5 && (
                                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                                  Showing 5 of {globalExcelData.length} total rows
                                </p>
                              )}
                            </div>

                            {editingChart.columnMapping?.xAxis && editingChart.columnMapping?.yAxis && (
                              <div className="chart-preview-info">
                                <h5>Chart Configuration Summary</h5>
                                <div style={{ 
                                  backgroundColor: '#f0fdf4', 
                                  border: '1px solid #bbf7d0', 
                                  borderRadius: '6px', 
                                  padding: '12px',
                                  fontSize: '14px'
                                }}>
                                  <p><strong>Chart Type:</strong> {editingChart.type}</p>
                                  <p><strong>X-Axis:</strong> {editingChart.columnMapping.xAxis}</p>
                                  <p><strong>Y-Axis:</strong> {editingChart.columnMapping.yAxis}</p>
                                  <p><strong>Data Points:</strong> {globalExcelData.length}</p>
                                  <p style={{ color: '#059669', marginTop: '8px' }}>
                                    ✓ Chart is ready to save
                                  </p>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Style & Colors Tab */}
                    <div className={`tab-panel ${activeTab === 'style' ? 'active' : ''}`}>
                      <div className="modal-form-grid">
                        <div className="form-group">
                          <label>Primary Color</label>
                          <input
                            type="color"
                            value={editingChart.color}
                            onChange={(e) => handleEditChartChange('color', e.target.value)}
                            className="color-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Secondary Color</label>
                          <input
                            type="color"
                            value={editingChart.secondaryColor || '#059669'}
                            onChange={(e) => handleEditChartChange('secondaryColor', e.target.value)}
                            className="color-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Background Color</label>
                          <input
                            type="color"
                            value={editingChart.backgroundColor || '#ffffff'}
                            onChange={(e) => handleEditChartChange('backgroundColor', e.target.value)}
                            className="color-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Grid Lines</label>
                          <select
                            value={editingChart.gridLines || 'true'}
                            onChange={(e) => handleEditChartChange('gridLines', e.target.value)}
                          >
                            <option value="true">Show Grid Lines</option>
                            <option value="false">Hide Grid Lines</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Legend Position</label>
                          <select
                            value={editingChart.legendPosition || 'top'}
                            onChange={(e) => handleEditChartChange('legendPosition', e.target.value)}
                          >
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                            <option value="none">Hide Legend</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Animation</label>
                          <select
                            value={editingChart.animation || 'true'}
                            onChange={(e) => handleEditChartChange('animation', e.target.value)}
                          >
                            <option value="true">Enable Animation</option>
                            <option value="false">Disable Animation</option>
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label>Chart Border Width</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={editingChart.borderWidth || '2'}
                            onChange={(e) => handleEditChartChange('borderWidth', e.target.value)}
                            placeholder="Border width in pixels"
                          />
                        </div>

                        <div className="form-group">
                          <label>Chart Opacity</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={editingChart.opacity || '1'}
                            onChange={(e) => handleEditChartChange('opacity', e.target.value)}
                          />
                          <span className="opacity-value">{editingChart.opacity || '1'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="cancel-btn" onClick={closeEditModal}>
                  Cancel
                </button>
                <button className="save-btn" onClick={saveEditedChart}>
                  <SaveIcon style={{ marginRight: '8px' }} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthDataForm;