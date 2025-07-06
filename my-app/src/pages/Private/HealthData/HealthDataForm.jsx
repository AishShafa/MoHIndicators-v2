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
      },
      grouping: {
        enabled: false,
        groupBy: ['x'], // Array to support multiple grouping options
        aggregateFunction: 'sum' // 'sum', 'average', 'max', 'min', 'count'
      }
    };
    setCharts([...charts, newChart]);
    setExpandedCharts({...expandedCharts, [newChart.id]: true});
  };

  const groupChartData = (data, xKey, yKey, groupByAxis, aggregateFunc) => {
    if (!data || !xKey || !yKey) return [];

    // Create a map to store grouped data
    const grouped = new Map();

    data.forEach(item => {
      const xValue = item[xKey];
      const yValue = item[yKey];
      
      // Skip rows with missing data
      if (xValue === undefined || xValue === null || xValue === '' ||
          yValue === undefined || yValue === null || yValue === '') {
        return;
      }

      // Create a unique key based on what we're grouping by
      let groupKey;
      if (Array.isArray(groupByAxis) && groupByAxis.includes('x') && groupByAxis.includes('y')) {
        // Group by both axes - create unique combinations
        groupKey = `${xValue}|${yValue}`;
      } else if (groupByAxis === 'x' || (Array.isArray(groupByAxis) && groupByAxis.includes('x'))) {
        // Group by X-axis only
        groupKey = xValue;
      } else if (groupByAxis === 'y' || (Array.isArray(groupByAxis) && groupByAxis.includes('y'))) {
        // Group by Y-axis only  
        groupKey = yValue;
      } else {
        // No grouping - use unique combination
        groupKey = `${xValue}|${yValue}`;
      }

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          xValues: [],
          yValues: [],
          count: 0
        });
      }

      const group = grouped.get(groupKey);
      group.xValues.push(xValue);
      group.yValues.push(parseFloat(yValue) || 0);
      group.count++;
    });

    // Convert grouped data back to chart format
    return Array.from(grouped.entries()).map(([key, group]) => {
      let finalXValue, finalYValue;

      if (Array.isArray(groupByAxis) && groupByAxis.includes('x') && groupByAxis.includes('y')) {
        // When grouping by both, keep the original values (no aggregation needed)
        const [xVal, yVal] = key.split('|');
        finalXValue = xVal;
        finalYValue = parseFloat(yVal) || 0;
      } else if (groupByAxis === 'x' || (Array.isArray(groupByAxis) && groupByAxis.includes('x'))) {
        // Group by X-axis, aggregate Y values
        finalXValue = key;
        finalYValue = aggregateValues(group.yValues, aggregateFunc);
      } else if (groupByAxis === 'y' || (Array.isArray(groupByAxis) && groupByAxis.includes('y'))) {
        // Group by Y-axis, aggregate X values (rare case)
        finalXValue = aggregateValues(group.xValues.map(x => parseFloat(x) || 0), aggregateFunc);
        finalYValue = parseFloat(key) || 0;
      } else {
        // No grouping
        finalXValue = group.xValues[0];
        finalYValue = group.yValues[0];
      }

      return {
        [xKey]: finalXValue,
        [yKey]: finalYValue,
        _groupCount: group.count
      };
    });
  };

  // Helper function for aggregation
  const aggregateValues = (values, aggregateFunc) => {
    if (!values || values.length === 0) return 0;
    
    switch (aggregateFunc) {
      case 'average':
        return values.reduce((a, b) => a + b, 0) / values.length;
      case 'max':
        return Math.max(...values);
      case 'min':
        return Math.min(...values);
      case 'count':
        return values.length;
      case 'sum':
      default:
        return values.reduce((a, b) => a + b, 0);
    }
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

  // Function to group columns by data type and similar values
  const groupColumnsByType = (data, columns) => {
    if (!data.length || !columns.length) return { groups: {}, ungrouped: columns };

    const groups = {
      'Numeric Data': [],
      'Date/Time': [],
      'Categorical': [],
      'Text/Description': []
    };
    const ungrouped = [];

    columns.forEach(column => {
      const sampleValues = data.slice(0, 10).map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      
      if (sampleValues.length === 0) {
        ungrouped.push(column);
        return;
      }

      // Check if it's numeric
      const numericValues = sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val));
      if (numericValues.length >= sampleValues.length * 0.7) {
        groups['Numeric Data'].push(column);
        return;
      }

      // Check if it's date/time
      const dateValues = sampleValues.filter(val => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && val.toString().match(/\d{4}|\d{2}\/\d{2}|\d{2}-\d{2}/);
      });
      if (dateValues.length >= sampleValues.length * 0.7) {
        groups['Date/Time'].push(column);
        return;
      }

      // Check if it's categorical (limited unique values)
      const uniqueValues = [...new Set(sampleValues)];
      if (uniqueValues.length <= Math.min(10, sampleValues.length * 0.8)) {
        groups['Categorical'].push(column);
        return;
      }

      // Default to text/description
      groups['Text/Description'].push(column);
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return { groups, ungrouped };
  };

  // Function to get recommended column types for different chart types
  const getRecommendedColumnTypes = (chartType) => {
    const recommendations = {
      'bar': {
        xAxis: ['Categorical', 'Date/Time'],
        yAxis: ['Numeric Data']
      },
      'line': {
        xAxis: ['Date/Time', 'Numeric Data'],
        yAxis: ['Numeric Data']
      },
      'pie': {
        xAxis: ['Categorical'],
        yAxis: ['Numeric Data']
      },
      'area': {
        xAxis: ['Date/Time', 'Numeric Data'],
        yAxis: ['Numeric Data']
      },
      'scatter': {
        xAxis: ['Numeric Data'],
        yAxis: ['Numeric Data']
      },
      'radar': {
        xAxis: ['Categorical'],
        yAxis: ['Numeric Data']
      }
    };
    
    return recommendations[chartType] || { xAxis: [], yAxis: [] };
  };

  // Enhanced GroupedColumnSelect with recommendations
  const GroupedColumnSelect = ({ value, onChange, label, placeholder, chartType, axis }) => {
    const { groups, ungrouped } = groupColumnsByType(globalExcelData, globalExcelColumns);
    const recommendations = chartType ? getRecommendedColumnTypes(chartType) : null;
    const recommendedTypes = recommendations && axis ? recommendations[axis] : [];
    
    return (
      <div className="form-group">
        <label>
          {label}
          {recommendedTypes.length > 0 && (
            <span className="recommendation-hint">
              {' '}(Recommended: {recommendedTypes.join(', ')})
            </span>
          )}
        </label>
        <select value={value || ''} onChange={onChange}>
          <option value="">{placeholder || 'Select Column'}</option>
          
          {Object.entries(groups).map(([groupName, columns]) => {
            const isRecommended = recommendedTypes.includes(groupName);
            return (
              <optgroup 
                key={groupName} 
                label={`${groupName}${isRecommended ? ' ⭐' : ''}`}
              >
                {columns.map((column, index) => (
                  <option key={index} value={column}>{column}</option>
                ))}
              </optgroup>
            );
          })}
          
          {ungrouped.length > 0 && (
            <optgroup label="Other">
              {ungrouped.map((column, index) => (
                <option key={index} value={column}>{column}</option>
              ))}
            </optgroup>
          )}
        </select>
      </div>
    );
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
                              <option value="table">Data Table</option>
                            </select>
                          </div>

                          {chart.type === 'table' && (
                            <div className="form-group">
                              <label>
                                <input
                                  type="checkbox"
                                  checked={chart.showAllColumns || false}
                                  onChange={(e) => updateChart(chart.id, 'showAllColumns', e.target.checked)}
                                  style={{ marginRight: '8px' }}
                                />
                                Show All Columns
                              </label>
                              <p className="field-help" style={{ fontSize: '0.8rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                                When enabled, displays all columns from your Excel file instead of just X and Y axis columns.
                              </p>
                            </div>
                          )}

                          <div className="form-group">
                            <label>X-Axis Label</label>
                            <input
                              type="text"
                              value={chart.xAxis}
                              onChange={(e) => updateChart(chart.id, 'xAxis', e.target.value)}
                              placeholder="X-axis label"
                              disabled={chart.type === 'table' && chart.showAllColumns}
                            />
                            {chart.type === 'table' && chart.showAllColumns && (
                              <p className="field-help">Disabled when showing all columns</p>
                            )}
                          </div>

                          <div className="form-group">
                            <label>Y-Axis Label</label>
                            <input
                              type="text"
                              value={chart.yAxis}
                              onChange={(e) => updateChart(chart.id, 'yAxis', e.target.value)}
                              placeholder="Y-axis label"
                              disabled={chart.type === 'table' && chart.showAllColumns}
                            />
                            {chart.type === 'table' && chart.showAllColumns && (
                              <p className="field-help">Disabled when showing all columns</p>
                            )}
                          </div>
{/*}
                          <div className="form-group">
                            <label>Chart Color</label>
                            <input
                              type="color"
                              value={chart.color}
                              onChange={(e) => updateChart(chart.id, 'color', e.target.value)}
                              className="color-input"
                            />
                          </div>
                          */}

                          <div className="form-group full-width">
                            <label>Chart Description</label>
                            <textarea
                              value={chart.description}
                              onChange={(e) => updateChart(chart.id, 'description', e.target.value)}
                              placeholder="Describe what this chart represents..."
                              rows="3"
                            />
                          </div>

                          {/* Data Grouping Section */}
                          <div className="form-group full-width">
                            <div className="grouping-section">
                              <label className="grouping-label">
                                Data Grouping
                                <span className="grouping-help">Group identical values together</span>
                              </label>
                              <div className="grouping-controls">
                                <div className="form-group">
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={chart.grouping?.enabled || false}
                                      onChange={(e) => updateChart(chart.id, 'grouping', {
                                        ...chart.grouping,
                                        enabled: e.target.checked
                                      })}
                                    />
                                    Enable Grouping
                                  </label>
                                </div>
                                
                                {chart.grouping?.enabled && (
                                  <>
                                    <div className="form-group">
                                      <label>Group By</label>
                                      <div className="checkbox-group">
                                        <label>
                                          <input
                                            type="checkbox"
                                            checked={chart.grouping?.groupBy?.includes('x') || false}
                                            onChange={(e) => {
                                              const groupBy = chart.grouping?.groupBy || [];
                                              const updated = e.target.checked
                                                ? [...groupBy, 'x']
                                                : groupBy.filter(g => g !== 'x');

                                              updateChart(chart.id, 'grouping', {
                                                ...chart.grouping,
                                                groupBy: updated
                                              });
                                            }}
                                          />
                                          Group by X-Axis Categories
                                        </label>

                                        <label style={{ marginLeft: '16px' }}>
                                          <input
                                            type="checkbox"
                                            checked={chart.grouping?.groupBy?.includes('y') || false}
                                            onChange={(e) => {
                                              const groupBy = chart.grouping?.groupBy || [];
                                              const updated = e.target.checked
                                                ? [...groupBy, 'y']
                                                : groupBy.filter(g => g !== 'y');

                                              updateChart(chart.id, 'grouping', {
                                                ...chart.grouping,
                                                groupBy: updated
                                              });
                                            }}
                                          />
                                          Group by Y-Axis Values
                                        </label>
                                      </div>
                                      <p className="field-help">
                                        Select "Group by X-Axis Categories" to show unique categories without aggregation (e.g., show each year separately).
                                        Select both options to show unique combinations of X and Y values.
                                      </p>
                                    </div>
                                    
                                    <div className="form-group">
                                      <label>Aggregate Function</label>
                                      <select
                                        value={chart.grouping?.aggregateFunction || 'sum'}
                                        onChange={(e) => updateChart(chart.id, 'grouping', {
                                          ...chart.grouping,
                                          aggregateFunction: e.target.value
                                        })}
                                        disabled={chart.grouping?.groupBy?.includes('x') && chart.grouping?.groupBy?.includes('y')}
                                      >
                                        <option value="sum">Sum - Add values together</option>
                                        <option value="average">Average - Calculate mean</option>
                                        <option value="max">Maximum - Take highest value</option>
                                        <option value="min">Minimum - Take lowest value</option>
                                        <option value="count">Count - Count occurrences</option>
                                      </select>
                                      <p className="field-help">
                                        {chart.grouping?.groupBy?.includes('x') && chart.grouping?.groupBy?.includes('y') 
                                          ? "Aggregation is disabled when grouping by both axes - each unique combination is preserved."
                                          : "How to combine values when multiple data points have the same grouping key."
                                        }
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Column Mapping */}
                          {/* Quick Data Mapping - hide for tables with showAllColumns */}
                          {globalExcelColumns.length > 0 && !(chart.type === 'table' && chart.showAllColumns) && (
                            <div className="quick-mapping">
                              <div className="mapping-header">
                                <label>Quick Data Mapping</label>
                                <div className="smart-grouping-tooltip">
                                  <span className="info-icon" title="Smart Column Grouping: Columns are automatically grouped by data type - Numeric Data (numbers, percentages, counts), Date/Time (dates, timestamps, years), Categorical (categories, groups, labels), and Text/Description (long text, descriptions). Groups marked with ⭐ are recommended for your selected chart type.">
                                    ℹ️
                                  </span>
                                </div>
                              </div>
                              <div className="mapping-row">
                                <GroupedColumnSelect
                                  value={chart.columnMapping?.xAxis || ''}
                                  onChange={(e) => updateChart(chart.id, 'columnMapping', {
                                    ...chart.columnMapping,
                                    xAxis: e.target.value
                                  })}
                                  label="X-Axis Column"
                                  placeholder="Select X-Axis Column"
                                  chartType={chart.type}
                                  axis="xAxis"
                                />
                                <GroupedColumnSelect
                                  value={chart.columnMapping?.yAxis || ''}
                                  onChange={(e) => updateChart(chart.id, 'columnMapping', {
                                    ...chart.columnMapping,
                                    yAxis: e.target.value
                                  })}
                                  label="Y-Axis Column"
                                  placeholder="Select Y-Axis Column"
                                  chartType={chart.type}
                                  axis="yAxis"
                                />
                              </div>
                            </div>
                          )}

                          {/* Show info message when Quick Data Mapping is disabled for tables */}
                          {chart.type === 'table' && chart.showAllColumns && (
                            <div className="quick-mapping">
                              <div className="mapping-header">
                                <label>Data Mapping</label>
                              </div>
                              <div style={{
                                padding: '12px 16px',
                                backgroundColor: '#fef3c7',
                                border: '1px solid #fbbf24',
                                borderRadius: '6px',
                                fontSize: '14px',
                                color: '#92400e'
                              }}>
                                <strong>All Columns Mode:</strong> Data mapping is not needed when displaying all columns. 
                                All data from your Excel file will be shown in the table.
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Mini Chart Preview */}
                        {/* Chart preview - adjusted condition for data tables with showAllColumns */}
                        {globalExcelData.length > 0 && 
                          (chart.type === 'table' && chart.showAllColumns ? 
                            true : 
                            (chart.columnMapping?.xAxis && chart.columnMapping?.yAxis)
                          ) && (
                          <div className="mini-chart-preview">
                            <div className="preview-header">
                              <h4>Chart Preview</h4>
                              <VisibilityIcon style={{ fontSize: '16px', color: '#10b981' }} />
                              <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '10px' }}>
                                Data rows: {globalExcelData.length}
                                {chart.type === 'table' && chart.showAllColumns ? 
                                  ` | All Columns (${globalExcelColumns.length})` :
                                  ` | X: ${chart.columnMapping?.xAxis} | Y: ${chart.columnMapping?.yAxis}`
                                }
                              </span>
                            </div>
                            <div className="preview-container">
                                <RechartsViewer
                                  chartConfig={chart}
                                  data={
                                    chart.grouping?.enabled
                                      ? groupChartData(
                                          globalExcelData,
                                          chart.columnMapping?.xAxis,
                                          chart.columnMapping?.yAxis,
                                          chart.grouping.groupBy,
                                          chart.grouping.aggregateFunction
                                        )
                                      : globalExcelData
                                  }
                                  width="100%"
                                  height={650}
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
            <div className="modal-layout">
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
                        className={`tab-btn ${activeTab === 'processing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('processing')}
                      >
                        Data Processing
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
                            <option value="table">Data Table</option>
                          </select>
                        </div>

                        {editingChart.type === 'table' && (
                          <div className="form-group">
                            <label>
                              <input
                                type="checkbox"
                                checked={editingChart.showAllColumns || false}
                                onChange={(e) => handleEditChartChange('showAllColumns', e.target.checked)}
                                style={{ marginRight: '8px' }}
                              />
                              Show All Columns
                            </label>
                            <p className="field-help" style={{ fontSize: '0.8rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                              When enabled, displays all columns from your Excel file instead of just X and Y axis columns.
                            </p>
                          </div>
                        )}

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
                              <div className="mapping-header">
                                <p>Map your Excel columns to chart axes:</p>
                                <div className="smart-grouping-tooltip">
                                  <span className="info-icon" title="Smart Column Grouping: Columns are automatically grouped by data type - Numeric Data (numbers, percentages, counts), Date/Time (dates, timestamps, years), Categorical (categories, groups, labels), and Text/Description (long text, descriptions). Groups marked with ⭐ are recommended for your selected chart type.">
                                    ℹ️
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mapping-controls">
                                <GroupedColumnSelect
                                  value={editingChart.columnMapping?.xAxis || ''}
                                  onChange={(e) => handleColumnMappingChange('xAxis', e.target.value)}
                                  label="X-Axis Data Column"
                                  placeholder="Select X-Axis Column"
                                  chartType={editingChart.type}
                                  axis="xAxis"
                                />
                                
                                <GroupedColumnSelect
                                  value={editingChart.columnMapping?.yAxis || ''}
                                  onChange={(e) => handleColumnMappingChange('yAxis', e.target.value)}
                                  label="Y-Axis Data Column"
                                  placeholder="Select Y-Axis Column"
                                  chartType={editingChart.type}
                                  axis="yAxis"
                                />
                              </div>
                            </div>

                            

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

                            {((editingChart.columnMapping?.xAxis && editingChart.columnMapping?.yAxis) || 
                              (editingChart.type === 'table' && editingChart.showAllColumns)) && (
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
                                  {editingChart.type === 'table' && editingChart.showAllColumns ? (
                                    <>
                                      <p><strong>Display Mode:</strong> All Columns ({globalExcelColumns.length} columns)</p>
                                      <p><strong>Columns:</strong> {globalExcelColumns.join(', ')}</p>
                                    </>
                                  ) : (
                                    <>
                                      <p><strong>X-Axis:</strong> {editingChart.columnMapping?.xAxis}</p>
                                      <p><strong>Y-Axis:</strong> {editingChart.columnMapping?.yAxis}</p>
                                    </>
                                  )}
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

                    {/* Data Processing Tab */}
                    <div className={`tab-panel ${activeTab === 'processing' ? 'active' : ''}`}>
                      <div className="processing-controls">
                        <h4>Data Grouping & Aggregation</h4>
                        <p className="section-description">
                          When your data has multiple rows with identical axis values, you can group them together and apply aggregation functions.
                        </p>
                        
                        <div className="modal-form-grid">
                          <div className="form-group">
                            <label>
                              <input
                                type="checkbox"
                                checked={editingChart.grouping?.enabled || false}
                                onChange={(e) => handleEditChartChange('grouping', {
                                  ...editingChart.grouping,
                                  enabled: e.target.checked
                                })}
                                style={{ marginRight: '8px' }}
                              />
                              Enable Data Grouping
                            </label>
                            <p className="field-help">Group identical values on the selected axis</p>
                          </div>

                          {editingChart.grouping?.enabled && (
                            <>
                              <div className="form-group">
                                <label>Group By Options</label>
                                <div className="checkbox-group">
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={editingChart.grouping?.groupBy?.includes('x') || false}
                                      onChange={(e) => {
                                        const groupBy = editingChart.grouping?.groupBy || [];
                                        const updated = e.target.checked
                                          ? [...groupBy, 'x']
                                          : groupBy.filter(g => g !== 'x');

                                        handleEditChartChange('grouping', {
                                          ...editingChart.grouping,
                                          groupBy: updated
                                        });
                                      }}
                                      style={{ marginRight: '8px' }}
                                    />
                                    Group by X-Axis Categories
                                  </label>
                                  <br />
                                  <label style={{ marginTop: '8px' }}>
                                    <input
                                      type="checkbox"
                                      checked={editingChart.grouping?.groupBy?.includes('y') || false}
                                      onChange={(e) => {
                                        const groupBy = editingChart.grouping?.groupBy || [];
                                        const updated = e.target.checked
                                          ? [...groupBy, 'y']
                                          : groupBy.filter(g => g !== 'y');

                                        handleEditChartChange('grouping', {
                                          ...editingChart.grouping,
                                          groupBy: updated
                                        });
                                      }}
                                      style={{ marginRight: '8px' }}
                                    />
                                    Group by Y-Axis Values
                                  </label>
                                </div>
                                <p className="field-help">
                                  Select "Group by X-Axis Categories" to display unique categories without aggregation (e.g., years appear separately).
                                  Select both to preserve unique combinations of X and Y values.
                                </p>
                              </div>

                              <div className="form-group">
                                <label>Aggregation Method</label>
                                <select
                                  value={editingChart.grouping?.aggregateFunction || 'sum'}
                                  onChange={(e) => handleEditChartChange('grouping', {
                                    ...editingChart.grouping,
                                    aggregateFunction: e.target.value
                                  })}
                                  disabled={editingChart.grouping?.groupBy?.includes('x') && editingChart.grouping?.groupBy?.includes('y')}
                                >
                                  <option value="sum">Sum - Add all values together</option>
                                  <option value="average">Average - Calculate mean value</option>
                                  <option value="max">Maximum - Take highest value</option>
                                  <option value="min">Minimum - Take lowest value</option>
                                  <option value="count">Count - Count number of occurrences</option>
                                </select>
                                <p className="field-help">
                                  {editingChart.grouping?.groupBy?.includes('x') && editingChart.grouping?.groupBy?.includes('y') 
                                    ? "Aggregation is disabled when grouping by both axes - each unique combination is preserved."
                                    : "How to combine values when multiple data points share the same grouping key."
                                  }
                                </p>
                              </div>

                              <div className="form-group full-width">
                                <div className="grouping-preview">
                                  <h5>Grouping Examples</h5>
                                  <div className="example-content">
                                    {/* Example for X-axis grouping only */}
                                    {editingChart.grouping?.groupBy?.includes('x') && !editingChart.grouping?.groupBy?.includes('y') && (
                                      <div className="before-after">
                                        <div className="before">
                                          <strong>Before Grouping (X-Axis):</strong>
                                          <div className="data-sample">
                                            <div className="data-row">Year: 2022, Cases: 100</div>
                                            <div className="data-row">Year: 2022, Cases: 150</div>
                                            <div className="data-row">Year: 2023, Cases: 200</div>
                                          </div>
                                        </div>
                                        <div className="arrow">→</div>
                                        <div className="after">
                                          <strong>After Grouping ({editingChart.grouping?.aggregateFunction}):</strong>
                                          <div className="data-sample">
                                            <div className="data-row">Year: 2022, Cases: {
                                              editingChart.grouping?.aggregateFunction === 'sum' ? '250 (100+150)' :
                                              editingChart.grouping?.aggregateFunction === 'average' ? '125 (avg)' :
                                              editingChart.grouping?.aggregateFunction === 'max' ? '150 (max)' :
                                              editingChart.grouping?.aggregateFunction === 'min' ? '100 (min)' :
                                              '2 (count)'
                                            }</div>
                                            <div className="data-row">Year: 2023, Cases: 200</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Example for both axes grouping */}
                                    {editingChart.grouping?.groupBy?.includes('x') && editingChart.grouping?.groupBy?.includes('y') && (
                                      <div className="before-after">
                                        <div className="before">
                                          <strong>Before Grouping (Both Axes):</strong>
                                          <div className="data-sample">
                                            <div className="data-row">Year: 2022, Cases: 100</div>
                                            <div className="data-row">Year: 2022, Cases: 100</div>
                                            <div className="data-row">Year: 2023, Cases: 200</div>
                                            <div className="data-row">Year: 2022, Cases: 150</div>
                                          </div>
                                        </div>
                                        <div className="arrow">→</div>
                                        <div className="after">
                                          <strong>After Grouping (Unique Combinations):</strong>
                                          <div className="data-sample">
                                            <div className="data-row">Year: 2022, Cases: 100 (2 occurrences)</div>
                                            <div className="data-row">Year: 2022, Cases: 150</div>
                                            <div className="data-row">Year: 2023, Cases: 200</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Example for no grouping selected */}
                                    {(!editingChart.grouping?.groupBy || editingChart.grouping?.groupBy?.length === 0) && (
                                      <div className="no-grouping-message">
                                        <p>💡 <strong>Select grouping options above to see examples</strong></p>
                                        <ul>
                                          <li><strong>Group by X-Axis Categories:</strong> Ideal for showing years/categories separately without adding them together</li>
                                          <li><strong>Group by Both Axes:</strong> Shows unique combinations, useful for removing exact duplicates</li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
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

            {/* Chart Preview Panel */}
            {/* Chart preview panel with updated condition for data tables */}
            {(editingChart.type === 'table' && editingChart.showAllColumns) ||
             (editingChart.columnMapping?.xAxis && editingChart.columnMapping?.yAxis) ? (
              <div className="chart-preview-panel">
                <div className="chart-preview-header">
                  <h3>Live Chart Preview</h3>
                  <span className="preview-info">
                    Real-time preview of your chart changes
                  </span>
                </div>
                <div className="chart-preview-container">
                  <RechartsViewer
                    chartConfig={editingChart}
                    data={
                      editingChart.grouping?.enabled
                        ? groupChartData(
                            globalExcelData,
                            editingChart.columnMapping?.xAxis,
                            editingChart.columnMapping?.yAxis,
                            editingChart.grouping.groupBy,
                            editingChart.grouping.aggregateFunction
                          )
                        : globalExcelData
                    }
                    width="100%"
                    height={600}
                  />
                </div>
              </div>
            ) : (
              <div className="chart-preview-panel">
                <div className="chart-preview-header">
                  <h3>Chart Preview</h3>
                  <span className="preview-info">
                    Configure data mapping to see preview
                  </span>
                </div>
                <div className="chart-preview-container">
                  <div className="chart-placeholder">
                    <div>
                      <p><strong>Chart preview will appear here</strong></p>
                      {editingChart.type === 'table' && editingChart.showAllColumns ? (
                        <p>Upload Excel data in the main form to see the complete table with all columns.</p>
                      ) : (
                        <>
                          <p>Go to the "Data & Values" tab to map your Excel columns to chart axes.</p>
                          <p>Once both X-axis and Y-axis columns are selected, you'll see a live preview of your chart.</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthDataForm;