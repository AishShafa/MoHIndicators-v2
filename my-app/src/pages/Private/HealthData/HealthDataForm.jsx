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
import InfoIcon from "@mui/icons-material/Info";
import TableViewIcon from "@mui/icons-material/TableView";
import DatasetIcon from "@mui/icons-material/Dataset";
import SettingsIcon from "@mui/icons-material/Settings";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      legendPosition: "none",
      animation: "true",
      borderWidth: "2",
      opacity: "1",
      columnMapping: {
        xAxis: '',
        yAxis: ''
      },
      grouping: {
        enabled: true,
        groupBy: ['x'], // Array to support multiple grouping options
        aggregateFunction: 'sum' // 'sum', 'average', 'max', 'min', 'count'
      },
      barColors: [], // Individual colors for each bar in bar charts
      pieColors: [], // Individual colors for each section in pie charts
      tableHeaderColor: '#f8f9fa',
      tableRowColor: '#ffffff',
      tableAlternateRowColor: '#f9fafb',
      isDonut: false, // Toggle for pie charts to become donut charts
      showLabels: true, // Show/hide chart labels
      showLegend: false, // Show/hide chart legend
      labelFormat: 'percentage' // 'percentage' or 'numbers'
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
    setCharts(charts.map(chart => {
      if (chart.id === chartId) {
        const updatedChart = {...chart, [field]: value};
        
        // Auto-populate axis labels when column mapping changes
        if (field === 'columnMapping') {
          // If xAxis column is being set and xAxis label is empty, set it to the column name
          if (value.xAxis && !chart.xAxis) {
            updatedChart.xAxis = value.xAxis;
          }
          // If yAxis column is being set and yAxis label is empty, set it to the column name
          if (value.yAxis && !chart.yAxis) {
            updatedChart.yAxis = value.yAxis;
          }
        }
        
        return updatedChart;
      }
      return chart;
    }));
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
    setEditingChart(prev => {
      const updated = {
        ...prev,
        columnMapping: {
          ...prev.columnMapping,
          [axis]: column
        }
      };
      
      // Auto-populate axis labels when column mapping changes
      if (axis === 'xAxis' && column && !prev.xAxis) {
        updated.xAxis = column;
      }
      if (axis === 'yAxis' && column && !prev.yAxis) {
        updated.yAxis = column;
      }
      
      return updated;
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate that we have Excel data if charts are configured
      if (charts.length > 0 && (!globalExcelData || globalExcelData.length === 0)) {
        alert('Please upload an Excel file to configure chart data.');
        return;
      }
      
      // Validate that all charts have proper column mapping (except for tables with showAllColumns)
      const unmappedCharts = charts.filter(chart => {
        if (chart.type === 'table' && chart.showAllColumns) {
          return false; // Tables with showAllColumns don't need column mapping
        }
        return !chart.columnMapping?.xAxis || !chart.columnMapping?.yAxis;
      });
      
      if (unmappedCharts.length > 0) {
        alert('Please configure column mapping for all charts before saving.');
        return;
      }
      
      // Optimize Excel data - only send first 1000 rows to prevent payload too large error
      const optimizedExcelData = globalExcelData.length > 1000 
        ? globalExcelData.slice(0, 1000)
        : globalExcelData;
      
      // Remove any unnecessary fields from Excel data to reduce size
      const compactExcelData = optimizedExcelData.map(row => {
        const compactRow = {};
        // Only include columns that are actually used in charts
        const usedColumns = new Set();
        charts.forEach(chart => {
          if (chart.columnMapping?.xAxis) usedColumns.add(chart.columnMapping.xAxis);
          if (chart.columnMapping?.yAxis) usedColumns.add(chart.columnMapping.yAxis);
          if (chart.type === 'table' && chart.showAllColumns) {
            globalExcelColumns.forEach(col => usedColumns.add(col));
          }
        });
        
        // If no charts are configured, include all columns but limit data
        if (usedColumns.size === 0) {
          return row;
        }
        
        // Only include used columns
        for (const column of usedColumns) {
          if (row.hasOwnProperty(column)) {
            compactRow[column] = row[column];
          }
        }
        return compactRow;
      });

      // Create enhanced chart snapshots with complete configuration and processed data
      const chartSnapshots = charts.map(chart => {
        // Process the data for this chart exactly as it would appear
        let processedData = compactExcelData;
        
        if (chart.grouping?.enabled) {
          processedData = groupChartData(
            compactExcelData,
            chart.columnMapping?.xAxis,
            chart.columnMapping?.yAxis,
            chart.grouping.groupBy,
            chart.grouping.aggregateFunction
          );
        }
        
        // Create a complete snapshot of the chart
        return {
          ...chart,
          // Store the exact data that will be used for rendering
          processedData: processedData,
          // Store render settings
          renderSettings: {
            width: 600,
            height: 400,
            responsive: true
          },
          // Store timestamp for when this snapshot was created
          snapshotCreatedAt: new Date().toISOString(),
          // Store the original Excel columns for reference
          originalColumns: globalExcelColumns,
          // Store data processing details
          dataProcessing: {
            originalRowCount: globalExcelData.length,
            processedRowCount: processedData.length,
            groupingApplied: chart.grouping?.enabled || false,
            columnMapping: chart.columnMapping
          }
        };
      });

      const submissionData = {
        title: formData.healthIndicator || 'Untitled Health Data',
        description: formData.additionalNotes,
        healthIndicator: formData.healthIndicator,
        location: formData.location,
        gender: formData.gender,
        region: formData.region,
        metric: formData.metric,
        ageGroup: formData.ageGroup,
        year: parseInt(formData.year) || null,
        value: parseFloat(formData.value) || null,
        additionalNotes: formData.additionalNotes,
        charts: chartSnapshots, // Store enhanced chart snapshots
        excelData: compactExcelData,
        excelColumns: globalExcelColumns,
        isPublic: true, // Make it public so it appears in the Results page
        dataRowCount: globalExcelData.length, // Store original row count for reference
        dataTruncated: globalExcelData.length > 1000, // Flag to indicate if data was truncated
        submissionSnapshot: {
          // Store submission metadata
          submittedAt: new Date().toISOString(),
          chartsCount: chartSnapshots.length,
          hasProcessedData: true
        }
      };
      
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You must be logged in to save health data. Please log in first.');
        return;
      }
      
      console.log('Submission data size:', JSON.stringify(submissionData).length, 'characters');
      console.log('Excel data rows:', submissionData.excelData.length);
      console.log('Charts count:', submissionData.charts.length);
      console.log('Enhanced charts with snapshots:', submissionData.charts.map(c => ({
        title: c.title,
        type: c.type,
        hasProcessedData: !!c.processedData,
        processedDataCount: c.processedData?.length || 0
      })));
      
      const response = await fetch('http://localhost:5000/api/health-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });
      
      if (response.ok) {
        const result = await response.json();
        let successMessage = 'Health data saved successfully! It will now be available in the public Results section.';
        if (submissionData.dataTruncated) {
          successMessage += `\n\nNote: Excel data was truncated to 1000 rows for storage efficiency. Original data had ${submissionData.dataRowCount} rows.`;
        }
        alert(successMessage);
        console.log('Saved health data:', result);
        
        // Clear the form after successful submission
        setFormData({
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
        setCharts([]);
        setGlobalExcelFile(null);
        setGlobalExcelData([]);
        setGlobalExcelColumns([]);
        
        // Optionally redirect
        if (onNavigateBack) {
          onNavigateBack();
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
        console.error('Error saving health data:', errorData);
        
        // Provide specific error messages based on status code
        let errorMessage = 'Error saving health data: ';
        switch (response.status) {
          case 413:
            errorMessage += 'The data payload is too large. Please try with a smaller Excel file.';
            break;
          case 401:
            errorMessage += 'Authentication failed. Please log in again.';
            break;
          case 403:
            errorMessage += 'You do not have permission to save health data.';
            break;
          case 500:
            errorMessage += 'Server error. Please try again later.';
            break;
          default:
            errorMessage += errorData.error || `Server responded with status ${response.status}`;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Network error:', error);
      let errorMessage = 'Network error occurred while saving health data. ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'Please check if the server is running and try again.';
      } else if (error.message.includes('JSON')) {
        errorMessage += 'Data processing error. Please check your Excel file format.';
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
                              placeholder={`${chart.columnMapping?.xAxis}`}
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
                              placeholder={`${chart.columnMapping?.yAxis}`}
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
                            <div className="preview-container" style={{
                              width: "100%",
                              height: "400px",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              overflow: "hidden",
                              backgroundColor: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}>
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
                                  height={380}
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
                        <SettingsIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                        Chart Properties
                      </button>
                      <button 
                        className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => setActiveTab('data')}
                      >
                        <TableViewIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                        Data Preview
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
                            disabled={editingChart.type === 'table' && editingChart.showAllColumns}
                          />
                          {editingChart.type === 'table' && editingChart.showAllColumns && (
                            <p className="field-help">Disabled when showing all columns</p>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Y-Axis Label</label>
                          <input
                            type="text"
                            value={editingChart.yAxis}
                            onChange={(e) => handleEditChartChange('yAxis', e.target.value)}
                            placeholder="Y-axis label"
                            disabled={editingChart.type === 'table' && editingChart.showAllColumns}
                          />
                          {editingChart.type === 'table' && editingChart.showAllColumns && (
                            <p className="field-help">Disabled when showing all columns</p>
                          )}
                        </div>

                        {/* Data Mapping Section */}
                        {globalExcelColumns.length > 0 && !(editingChart.type === 'table' && editingChart.showAllColumns) && (
                          <>
                            <div className="form-group full-width">
                              <div className="data-mapping-divider" style={{ 
                                margin: '16px 0 12px 0', 
                                borderTop: '1px solid #e5e7eb',
                                paddingTop: '12px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                  <DatasetIcon style={{ fontSize: '20px', color: '#6b7280' }} />
                                  <label style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Data Column Mapping</label>
                                  <InfoIcon 
                                    style={{ fontSize: '16px', color: '#6b7280', cursor: 'help' }} 
                                    title="Smart Column Grouping: Columns are automatically grouped by data type - Numeric Data (numbers, percentages, counts), Date/Time (dates, timestamps, years), Categorical (categories, groups, labels), and Text/Description (long text, descriptions). Groups marked with ⭐ are recommended for your selected chart type."
                                  />
                                </div>
                                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
                                  Map your Excel columns to chart axes for data visualization
                                </p>
                              </div>
                            </div>

                            <div className="form-group">
                              <GroupedColumnSelect
                                value={editingChart.columnMapping?.xAxis || ''}
                                onChange={(e) => handleColumnMappingChange('xAxis', e.target.value)}
                                label="X-Axis Data Column"
                                placeholder="Select X-Axis Column"
                                chartType={editingChart.type}
                                axis="xAxis"
                              />
                            </div>
                            
                            <div className="form-group">
                              <GroupedColumnSelect
                                value={editingChart.columnMapping?.yAxis || ''}
                                onChange={(e) => handleColumnMappingChange('yAxis', e.target.value)}
                                label="Y-Axis Data Column"
                                placeholder="Select Y-Axis Column"
                                chartType={editingChart.type}
                                axis="yAxis"
                              />
                            </div>
                          </>
                        )}

                        {editingChart.type === 'table' && editingChart.showAllColumns && (
                          <div className="form-group full-width">
                            <div style={{
                              padding: '16px',
                              backgroundColor: '#fef3c7',
                              border: '1px solid #fbbf24',
                              borderRadius: '8px',
                              fontSize: '14px',
                              color: '#92400e',
                              marginTop: '12px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <TableViewIcon style={{ fontSize: '18px' }} />
                                <strong>All Columns Mode Active</strong>
                              </div>
                              <p style={{ margin: 0 }}>
                                Data column mapping is not needed when displaying all columns. 
                                All data from your Excel file will be shown in the table.
                              </p>
                            </div>
                          </div>
                        )}

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

                    {/* Data Preview Tab */}
                    <div className={`tab-panel ${activeTab === 'data' ? 'active' : ''}`}>
                      <div className="data-preview">
                        {!globalExcelFile ? (
                          <div className="no-data-message" style={{ 
                            textAlign: 'center', 
                            padding: '48px 24px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '12px',
                            border: '2px dashed #d1d5db'
                          }}>
                            <DatasetIcon style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px' }} />
                            <h4 style={{ color: '#374151', marginBottom: '8px' }}>No Data Available</h4>
                            <p style={{ color: '#6b7280', margin: 0 }}>
                              Please upload an Excel file in the main form to view the data preview.
                            </p>
                          </div>
                        ) : globalExcelData.length === 0 ? (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '48px 24px',
                            backgroundColor: '#fef3c7',
                            borderRadius: '12px',
                            border: '1px solid #fbbf24'
                          }}>
                            <SettingsIcon style={{ fontSize: '48px', color: '#f59e0b', marginBottom: '16px' }} />
                            <h4 style={{ color: '#92400e', marginBottom: '8px' }}>Loading Data</h4>
                            <p style={{ color: '#92400e', margin: 0 }}>
                              Processing your Excel file...
                            </p>
                          </div>
                        ) : (
                          <div className="data-table-section">
                            <div className="data-table-header" style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              marginBottom: '16px',
                              paddingBottom: '12px',
                              borderBottom: '2px solid #e5e7eb'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <TableViewIcon style={{ fontSize: '24px', color: '#10b981' }} />
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>Data Preview</h4>
                                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                                    Sample of your uploaded data (showing first 10 rows)
                                  </p>
                                </div>
                              </div>
                              <div className="data-stats" style={{ 
                                display: 'flex', 
                                gap: '24px',
                                fontSize: '14px'
                              }}>
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                                    {globalExcelData.length}
                                  </div>
                                  <div style={{ color: '#6b7280' }}>Rows</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                                    {globalExcelColumns.length}
                                  </div>
                                  <div style={{ color: '#6b7280' }}>Columns</div>
                                </div>
                              </div>
                            </div>

                            <div className="data-table-preview">
                              <div className="table-container" style={{ 
                                maxHeight: '500px', 
                                overflow: 'auto', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '12px',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                              }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0 }}>
                                    <tr>
                                      {globalExcelColumns.map((column, index) => (
                                        <th key={index} style={{ 
                                          padding: '16px 20px', 
                                          borderBottom: '2px solid #e5e7eb', 
                                          fontSize: '14px', 
                                          fontWeight: '600',
                                          textAlign: 'left',
                                          color: '#374151',
                                          backgroundColor: editingChart.columnMapping?.xAxis === column ? '#dbeafe' : 
                                                         editingChart.columnMapping?.yAxis === column ? '#dcfce7' : '#f9fafb',
                                          borderRight: index < globalExcelColumns.length - 1 ? '1px solid #e5e7eb' : 'none'
                                        }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {column}
                                            {editingChart.columnMapping?.xAxis === column && (
                                              <span style={{ 
                                                color: '#3b82f6', 
                                                backgroundColor: '#eff6ff',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                              }}>X</span>
                                            )}
                                            {editingChart.columnMapping?.yAxis === column && (
                                              <span style={{ 
                                                color: '#10b981', 
                                                backgroundColor: '#f0fdf4',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                              }}>Y</span>
                                            )}
                                          </div>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {globalExcelData.slice(0, 10).map((row, rowIndex) => (
                                      <tr key={rowIndex} style={{ 
                                        borderBottom: '1px solid #f3f4f6',
                                        backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#fafafa'
                                      }}>
                                        {globalExcelColumns.map((column, colIndex) => (
                                          <td key={colIndex} style={{ 
                                            padding: '16px 20px', 
                                            fontSize: '14px',
                                            color: '#374151',
                                            backgroundColor: editingChart.columnMapping?.xAxis === column ? '#eff6ff' : 
                                                           editingChart.columnMapping?.yAxis === column ? '#f0fdf4' : 'transparent',
                                            borderRight: colIndex < globalExcelColumns.length - 1 ? '1px solid #f3f4f6' : 'none'
                                          }}>
                                            {String(row[column] || '')}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {globalExcelData.length > 10 && (
                                <div style={{ 
                                  padding: '16px 20px',
                                  backgroundColor: '#f9fafb',
                                  borderTop: '1px solid #e5e7eb',
                                  borderBottomLeftRadius: '12px',
                                  borderBottomRightRadius: '12px',
                                  fontSize: '14px', 
                                  color: '#6b7280',
                                  textAlign: 'center'
                                }}>
                                  <InfoIcon style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '6px' }} />
                                  Showing 10 of {globalExcelData.length} total rows
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Data Processing Tab */}
                    <div className={`tab-panel ${activeTab === 'processing' ? 'active' : ''}`}>
                      <div className="processing-controls">
                        <div style={{ marginBottom: '16px' }}>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>Data Grouping & Aggregation</h4>
                          <p className="section-description" style={{ margin: '0 0 12px 0', fontSize: '13px', lineHeight: '1.2' }}>
                            Group rows with identical axis values and apply aggregation functions.
                          </p>
                        </div>
                        
                        <div className="modal-form-grid" style={{ gap: '12px 20px' }}>
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
                            <p className="field-help" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>Group identical values on the selected axis</p>
                          </div>

                          {editingChart.grouping?.enabled && (
                            <>
                              <div className="form-group">
                                <label>Group By Options</label>
                                <div className="checkbox-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                  <label style={{ margin: 0 }}>
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
                                      style={{ marginRight: '6px' }}
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
                      <div className="style-tab-content">
                        {/* Color Palette Section */}
                        <div className="color-section">
                          <h4>Color Palette</h4>
                          <p className="section-description">Customize your chart colors for better visual impact</p>
                          
                          <div className="color-grid">
                            <div className="form-group">
                              <label>Primary Color</label>
                              <input
                                type="color"
                                value={editingChart.color || '#3b82f6'}
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
                              <label>Accent Color</label>
                              <input
                                type="color"
                                value={editingChart.accentColor || '#f59e0b'}
                                onChange={(e) => handleEditChartChange('accentColor', e.target.value)}
                                className="color-input"
                              />
                            </div>

                            <div className="form-group">
                              <label>Highlight Color</label>
                              <input
                                type="color"
                                value={editingChart.highlightColor || '#ef4444'}
                                onChange={(e) => handleEditChartChange('highlightColor', e.target.value)}
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
                              <label>Text Color</label>
                              <input
                                type="color"
                                value={editingChart.textColor || '#374151'}
                                onChange={(e) => handleEditChartChange('textColor', e.target.value)}
                                className="color-input"
                              />
                            </div>

                            <div className="form-group">
                              <label>Grid Line Color</label>
                              <input
                                type="color"
                                value={editingChart.gridColor || '#e5e7eb'}
                                onChange={(e) => handleEditChartChange('gridColor', e.target.value)}
                                className="color-input"
                              />
                            </div>

                            <div className="form-group">
                              <label>Border Color</label>
                              <input
                                type="color"
                                value={editingChart.borderColor || '#d1d5db'}
                                onChange={(e) => handleEditChartChange('borderColor', e.target.value)}
                                className="color-input"
                              />
                            </div>
                          </div>

                          {/* Color Presets */}
                          <div className="color-presets">
                            <label>Quick Color Schemes</label>
                            <div className="preset-buttons">
                              <button
                                type="button"
                                className="preset-btn"
                                onClick={() => {
                                  const blueScheme = {
                                    color: '#3b82f6',
                                    secondaryColor: '#1d4ed8',
                                    accentColor: '#60a5fa',
                                    highlightColor: '#2563eb',
                                    backgroundColor: '#ffffff',
                                    textColor: '#1f2937',
                                    gridColor: '#e5e7eb',
                                    borderColor: '#d1d5db'
                                  };
                                  Object.keys(blueScheme).forEach(key => {
                                    handleEditChartChange(key, blueScheme[key]);
                                  });
                                }}
                              >
                                <div className="preset-preview">
                                  <div style={{ backgroundColor: '#3b82f6' }}></div>
                                  <div style={{ backgroundColor: '#1d4ed8' }}></div>
                                  <div style={{ backgroundColor: '#60a5fa' }}></div>
                                </div>
                                Blue Scheme
                              </button>

                              <button
                                type="button"
                                className="preset-btn"
                                onClick={() => {
                                  const greenScheme = {
                                    color: '#10b981',
                                    secondaryColor: '#059669',
                                    accentColor: '#34d399',
                                    highlightColor: '#047857',
                                    backgroundColor: '#ffffff',
                                    textColor: '#1f2937',
                                    gridColor: '#e5e7eb',
                                    borderColor: '#d1d5db'
                                  };
                                  Object.keys(greenScheme).forEach(key => {
                                    handleEditChartChange(key, greenScheme[key]);
                                  });
                                }}
                              >
                                <div className="preset-preview">
                                  <div style={{ backgroundColor: '#10b981' }}></div>
                                  <div style={{ backgroundColor: '#059669' }}></div>
                                  <div style={{ backgroundColor: '#34d399' }}></div>
                                </div>
                                Green Scheme
                              </button>

                              <button
                                type="button"
                                className="preset-btn"
                                onClick={() => {
                                  const orangeScheme = {
                                    color: '#f59e0b',
                                    secondaryColor: '#d97706',
                                    accentColor: '#fbbf24',
                                    highlightColor: '#b45309',
                                    backgroundColor: '#ffffff',
                                    textColor: '#1f2937',
                                    gridColor: '#e5e7eb',
                                    borderColor: '#d1d5db'
                                  };
                                  Object.keys(orangeScheme).forEach(key => {
                                    handleEditChartChange(key, orangeScheme[key]);
                                  });
                                }}
                              >
                                <div className="preset-preview">
                                  <div style={{ backgroundColor: '#f59e0b' }}></div>
                                  <div style={{ backgroundColor: '#d97706' }}></div>
                                  <div style={{ backgroundColor: '#fbbf24' }}></div>
                                </div>
                                Orange Scheme
                              </button>

                              <button
                                type="button"
                                className="preset-btn"
                                onClick={() => {
                                  const purpleScheme = {
                                    color: '#8b5cf6',
                                    secondaryColor: '#7c3aed',
                                    accentColor: '#a78bfa',
                                    highlightColor: '#6d28d9',
                                    backgroundColor: '#ffffff',
                                    textColor: '#1f2937',
                                    gridColor: '#e5e7eb',
                                    borderColor: '#d1d5db'
                                  };
                                  Object.keys(purpleScheme).forEach(key => {
                                    handleEditChartChange(key, purpleScheme[key]);
                                  });
                                }}
                              >
                                <div className="preset-preview">
                                  <div style={{ backgroundColor: '#8b5cf6' }}></div>
                                  <div style={{ backgroundColor: '#7c3aed' }}></div>
                                  <div style={{ backgroundColor: '#a78bfa' }}></div>
                                </div>
                                Purple Scheme
                              </button>

                              <button
                                type="button"
                                className="preset-btn"
                                onClick={() => {
                                  const darkScheme = {
                                    color: '#6b7280',
                                    secondaryColor: '#4b5563',
                                    accentColor: '#9ca3af',
                                    highlightColor: '#374151',
                                    backgroundColor: '#1f2937',
                                    textColor: '#f9fafb',
                                    gridColor: '#374151',
                                    borderColor: '#4b5563'
                                  };
                                  Object.keys(darkScheme).forEach(key => {
                                    handleEditChartChange(key, darkScheme[key]);
                                  });
                                }}
                              >
                                <div className="preset-preview">
                                  <div style={{ backgroundColor: '#6b7280' }}></div>
                                  <div style={{ backgroundColor: '#4b5563' }}></div>
                                  <div style={{ backgroundColor: '#9ca3af' }}></div>
                                </div>
                                Dark Scheme
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="style-divider"></div>

                        {/* Individual Color Customization Section */}
                        <div className="individual-colors-section">
                          <h4>Individual Element Colors</h4>
                          <p className="section-description">Customize colors for individual chart elements</p>
                          
                          {/* Bar Chart Colors */}
                          {editingChart.type === 'bar' && (
                            <div className="bar-colors-section">
                              <h5>Bar Colors</h5>
                              <div className="color-list">
                                {globalExcelData && globalExcelData.length > 0 && (() => {
                                  // Get processed data to know how many bars we need
                                  let dataCount = globalExcelData.length;
                                  if (editingChart.grouping?.enabled) {
                                    // Calculate grouped data count
                                    const grouped = new Map();
                                    globalExcelData.forEach(item => {
                                      const xValue = item[editingChart.columnMapping?.xAxis || ''];
                                      if (xValue !== undefined && xValue !== null && xValue !== '') {
                                        grouped.set(xValue, true);
                                      }
                                    });
                                    dataCount = grouped.size;
                                  }
                                  
                                  return Array.from({ length: Math.min(dataCount, 20) }, (_, index) => (
                                    <div key={index} className="color-item">
                                      <label>Bar {index + 1}</label>
                                      <input
                                        type="color"
                                        value={editingChart.barColors?.[index] || '#10b981'}
                                        onChange={(e) => {
                                          const newBarColors = [...(editingChart.barColors || [])];
                                          newBarColors[index] = e.target.value;
                                          handleEditChartChange('barColors', newBarColors);
                                        }}
                                        className="color-input"
                                      />
                                    </div>
                                  ));
                                })()}
                              </div>
                              <div className="color-actions">
                                <button
                                  type="button"
                                  className="reset-colors-btn"
                                  onClick={() => handleEditChartChange('barColors', [])}
                                >
                                  Reset to Default Colors
                                </button>
                                <button
                                  type="button"
                                  className="random-colors-btn"
                                  onClick={() => {
                                    const dataCount = globalExcelData?.length || 8;
                                    const randomColors = Array.from({ length: Math.min(dataCount, 20) }, () => 
                                      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
                                    );
                                    handleEditChartChange('barColors', randomColors);
                                  }}
                                >
                                  Random Colors
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Pie Chart Colors */}
                          {editingChart.type === 'pie' && (
                            <div className="pie-colors-section">
                              <h5>Pie Chart Configuration</h5>
                              
                              {/* Pie Chart Display Options - Compact Grid Layout */}
                              <div className="pie-display-options" style={{ 
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '12px',
                                marginBottom: '16px',
                                padding: '12px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '6px',
                                border: '1px solid #e5e7eb'
                              }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                    <input
                                      type="checkbox"
                                      checked={editingChart.isDonut || false}
                                      onChange={(e) => handleEditChartChange('isDonut', e.target.checked)}
                                      style={{ marginRight: '6px' }}
                                    />
                                    Donut Chart
                                  </label>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                    <input
                                      type="checkbox"
                                      checked={editingChart.showLabels !== false}
                                      onChange={(e) => handleEditChartChange('showLabels', e.target.checked)}
                                      style={{ marginRight: '6px' }}
                                    />
                                    Show Labels
                                  </label>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                    <input
                                      type="checkbox"
                                      checked={editingChart.showLegend || false}
                                      onChange={(e) => handleEditChartChange('showLegend', e.target.checked)}
                                      style={{ marginRight: '6px' }}
                                    />
                                    Show Legend
                                  </label>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ fontSize: '14px', marginBottom: '4px', display: 'block' }}>Label Format</label>
                                  <select
                                    value={editingChart.labelFormat || 'percentage'}
                                    onChange={(e) => handleEditChartChange('labelFormat', e.target.value)}
                                    style={{ fontSize: '13px', padding: '4px 8px', width: '100%' }}
                                  >
                                    <option value="percentage">Percentage</option>
                                    <option value="numbers">Numbers</option>
                                    <option value="both">Name + %</option>
                                    <option value="name">Name Only</option>
                                  </select>
                                </div>
                              </div>

                              <h6 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0' }}>
                                Section Colors
                                <span 
                                  className="info-icon" 
                                  title="Set custom colors for each section in your pie chart"
                                  style={{ 
                                    cursor: 'help', 
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  ?
                                </span>
                              </h6>

                              <div className="color-list">
                                {globalExcelData && globalExcelData.length > 0 && (() => {
                                  // Get processed data to know how many sections we need
                                  let dataCount = globalExcelData.length;
                                  if (editingChart.grouping?.enabled) {
                                    // Calculate grouped data count
                                    const grouped = new Map();
                                    globalExcelData.forEach(item => {
                                      const xValue = item[editingChart.columnMapping?.xAxis || ''];
                                      if (xValue !== undefined && xValue !== null && xValue !== '') {
                                        grouped.set(xValue, true);
                                      }
                                    });
                                    dataCount = grouped.size;
                                  }
                                  
                                  return Array.from({ length: Math.min(dataCount, 15) }, (_, index) => (
                                    <div key={index} className="color-item">
                                      <label>Section {index + 1}</label>
                                      <input
                                        type="color"
                                        value={editingChart.pieColors?.[index] || ['#10b981', '#059669', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'][index % 8]}
                                        onChange={(e) => {
                                          const newPieColors = [...(editingChart.pieColors || [])];
                                          newPieColors[index] = e.target.value;
                                          handleEditChartChange('pieColors', newPieColors);
                                        }}
                                        className="color-input"
                                      />
                                    </div>
                                  ));
                                })()}
                              </div>
                              <div className="color-actions">
                                <button
                                  type="button"
                                  className="reset-colors-btn"
                                  onClick={() => handleEditChartChange('pieColors', [])}
                                >
                                  Reset to Default Colors
                                </button>
                                <button
                                  type="button"
                                  className="random-colors-btn"
                                  onClick={() => {
                                    const dataCount = globalExcelData?.length || 8;
                                    const randomColors = Array.from({ length: Math.min(dataCount, 15) }, () => 
                                      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
                                    );
                                    handleEditChartChange('pieColors', randomColors);
                                  }}
                                >
                                  Random Colors
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Table Colors */}
                          {editingChart.type === 'table' && (
                            <div className="table-colors-section">
                              <h5>Table Colors</h5>
                              <p className="field-help">Customize table appearance and colors</p>
                              
                              <div className="table-color-grid">
                                <div className="form-group">
                                  <label>Header Background</label>
                                  <input
                                    type="color"
                                    value={editingChart.tableHeaderColor || '#f8f9fa'}
                                    onChange={(e) => handleEditChartChange('tableHeaderColor', e.target.value)}
                                    className="color-input"
                                  />
                                </div>

                                <div className="form-group">
                                  <label>Row Background</label>
                                  <input
                                    type="color"
                                    value={editingChart.tableRowColor || '#ffffff'}
                                    onChange={(e) => handleEditChartChange('tableRowColor', e.target.value)}
                                    className="color-input"
                                  />
                                </div>

                                <div className="form-group">
                                  <label>Alternate Row Background</label>
                                  <input
                                    type="color"
                                    value={editingChart.tableAlternateRowColor || '#f9fafb'}
                                    onChange={(e) => handleEditChartChange('tableAlternateRowColor', e.target.value)}
                                    className="color-input"
                                  />
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                className="reset-colors-btn"
                                onClick={() => {
                                  handleEditChartChange('tableHeaderColor', '#f8f9fa');
                                  handleEditChartChange('tableRowColor', '#ffffff');
                                  handleEditChartChange('tableAlternateRowColor', '#f9fafb');
                                }}
                              >
                                Reset to Default Table Colors
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="style-divider"></div>

                        {/* Chart Appearance Section */}
                        <div className="appearance-section">
                          <h4>Chart Appearance</h4>
                          <div className="modal-form-grid">
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
                                value={editingChart.legendPosition || 'none'}
                                onChange={(e) => handleEditChartChange('legendPosition', e.target.value)}
                              >
                                <option value="none">Hide Legend</option>
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
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

                            <div className="form-group">
                              <label>Chart Padding</label>
                              <input
                                type="number"
                                min="0"
                                max="50"
                                value={editingChart.padding || '20'}
                                onChange={(e) => handleEditChartChange('padding', e.target.value)}
                                placeholder="Padding in pixels"
                              />
                            </div>
                          </div>
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
                <div className="chart-preview-container" style={{
                  width: "100%",
                  height: "500px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
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
                    height={480}
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
                <div className="chart-preview-container" style={{
                  width: "100%",
                  height: "500px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div className="chart-placeholder">
                    <div>
                      <p><strong>Chart preview will appear here</strong></p>
                      {editingChart.type === 'table' && editingChart.showAllColumns ? (
                        <p>Upload Excel data in the main form to see the complete table with all columns.</p>
                      ) : (
                        <>
                          <p>Configure data column mapping in "Chart Properties" tab to preview your chart.</p>
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