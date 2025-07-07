import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Badge, Alert, Spinner } from "react-bootstrap";
import RechartsViewer from "./RechartsViewer";
import "./PublicChartsView.css";

const PublicChartsView = ({ formData }) => {
  const [processedCharts, setProcessedCharts] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processFormData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // If the form has Excel data, process it
      if (formData.excel_data) {
        try {
          const parsedExcelData = JSON.parse(formData.excel_data);
          setExcelData(parsedExcelData);
        } catch (parseError) {
          console.warn("Could not parse Excel data:", parseError);
          setExcelData([]);
        }
      } else {
        setExcelData([]);
      }

      // Process charts data - handle both old format and new enhanced snapshots
      if (formData.charts) {
        try {
          const charts = typeof formData.charts === 'string' 
            ? JSON.parse(formData.charts) 
            : formData.charts;
          
          const chartsArray = Array.isArray(charts) ? charts : [];
          
          // Check if charts have processedData (new format) or need processing (old format)
          const processedChartsData = chartsArray.map(chart => {
            if (chart.processedData) {
              // New format: chart already has processed data from submission
              return {
                ...chart,
                // Use the stored processed data
                data: chart.processedData,
                // Preserve all the original styling and configuration
                isSnapshot: true,
                snapshotInfo: {
                  createdAt: chart.snapshotCreatedAt,
                  originalRowCount: chart.dataProcessing?.originalRowCount,
                  processedRowCount: chart.dataProcessing?.processedRowCount,
                  groupingApplied: chart.dataProcessing?.groupingApplied
                }
              };
            } else {
              // Old format: use Excel data for rendering
              return {
                ...chart,
                data: excelData,
                isSnapshot: false
              };
            }
          });
          
          setProcessedCharts(processedChartsData);
        } catch (parseError) {
          console.warn("Could not parse charts data:", parseError);
          setProcessedCharts([]);
        }
      } else {
        setProcessedCharts([]);
      }

    } catch (err) {
      console.error("Error processing form data:", err);
      setError("Failed to process chart data");
    } finally {
      setLoading(false);
    }
  }, [formData, excelData]);

  useEffect(() => {
    if (formData) {
      processFormData();
    }
  }, [formData, processFormData]);

  const getChartTypeIcon = (type) => {
    const icons = {
      bar: "📊",
      line: "📈",
      pie: "🥧",
      area: "📉",
      scatter: "⚪",
      table: "📋"
    };
    return icons[type] || "📊";
  };

  const getChartTypeColor = (type) => {
    const colors = {
      bar: "primary",
      line: "success",
      pie: "warning",
      area: "info",
      scatter: "secondary",
      table: "dark"
    };
    return colors[type] || "primary";
  };

  if (loading) {
    return (
      <div className="charts-loading">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Processing charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Chart Processing Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!formData) {
    return (
      <Alert variant="info">
        <p className="mb-0">No form data selected. Please select a health data report to view its charts.</p>
      </Alert>
    );
  }

  return (
    <div className="public-charts-view">
      {/* Form Summary */}
      <Card className="form-summary-card mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <h4 className="summary-title">📊 Data Summary</h4>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Charts:</span>
                  <Badge bg="success" className="stat-value">
                    {processedCharts.length}
                  </Badge>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Data Points:</span>
                  <Badge bg="info" className="stat-value">
                    {excelData.length}
                  </Badge>
                </div>
                {formData.metric && (
                  <div className="stat-item">
                    <span className="stat-label">Metric:</span>
                    <Badge bg="secondary" className="stat-value">
                      {formData.metric}
                    </Badge>
                  </div>
                )}
              </div>
            </Col>
            <Col md={4} className="text-end">
              <div className="data-quality">
                <span className="quality-label">Data Quality:</span>
                <Badge 
                  bg={excelData.length > 0 ? "success" : "warning"} 
                  className="quality-badge"
                >
                  {excelData.length > 0 ? "✓ Good" : "⚠ Limited"}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Charts Display */}
      {processedCharts.length > 0 ? (
        <div className="charts-grid">
          {processedCharts.map((chart, index) => (
            <Card key={chart.id || index} className="chart-card">
              <Card.Header className="chart-header">
                <div className="chart-title-section">
                  <span className="chart-icon">
                    {getChartTypeIcon(chart.type)}
                  </span>
                  <div>
                    <h5 className="chart-title">
                      {chart.title || `Chart ${index + 1}`}
                    </h5>
                    {chart.description && (
                      <p className="chart-description">{chart.description}</p>
                    )}
                  </div>
                </div>
                <Badge bg={getChartTypeColor(chart.type)} className="chart-type-badge">
                  {chart.type.toUpperCase()}
                </Badge>
              </Card.Header>
              <Card.Body className="chart-body">
                <div className="chart-container">
                  <RechartsViewer
                    chartConfig={chart}
                    data={chart.data || excelData} // Use processed data if available
                    isPublicView={true}
                  />
                </div>
                
                {/* Chart Metadata */}
                <div className="chart-metadata">
                  <Row className="mt-3">
                    <Col sm={6}>
                      {chart.xAxis && (
                        <small className="metadata-info">
                          <strong>X-Axis:</strong> {chart.xAxis}
                        </small>
                      )}
                    </Col>
                    <Col sm={6}>
                      {chart.yAxis && (
                        <small className="metadata-info">
                          <strong>Y-Axis:</strong> {chart.yAxis}
                        </small>
                      )}
                    </Col>
                  </Row>
                  
                  {/* Snapshot Information */}
                  {chart.isSnapshot && chart.snapshotInfo && (
                    <Row className="mt-2">
                      <Col xs={12}>
                        <div className="snapshot-info">
                          <Badge bg="success" className="snapshot-badge">
                            📸 Chart Snapshot
                          </Badge>
                          <small className="text-muted ms-2">
                            Preserved from submission • 
                            {chart.snapshotInfo.processedRowCount} data points
                            {chart.snapshotInfo.groupingApplied && " • Grouped data"}
                          </small>
                        </div>
                      </Col>
                    </Row>
                  )}
                  
                  {/* Data Truncation Warning */}
                  {formData.data_truncated && (
                    <Row className="mt-2">
                      <Col xs={12}>
                        <Alert variant="info" className="data-warning">
                          <small>
                            ℹ️ This chart uses a subset of the original data (first 1000 rows) 
                            for optimal performance. Original dataset had {formData.data_row_count} rows.
                          </small>
                        </Alert>
                      </Col>
                    </Row>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="no-charts-card">
          <Card.Body className="text-center py-5">
            <div className="no-charts-icon">📊</div>
            <h4>No Charts Available</h4>
            <p className="text-muted">
              This health data report doesn't contain any charts yet. 
              Charts will appear here once they are created and configured.
            </p>
          </Card.Body>
        </Card>
      )}

      {/* Raw Data Summary */}
      {excelData.length > 0 && (
        <Card className="data-summary-card mt-4">
          <Card.Header>
            <h5 className="mb-0">📋 Data Overview</h5>
          </Card.Header>
          <Card.Body>
            <p className="mb-2">
              <strong>Total Records:</strong> {excelData.length}
            </p>
            {excelData.length > 0 && (
              <div className="data-columns">
                <strong>Available Fields:</strong>
                <div className="columns-list">
                  {Object.keys(excelData[0]).map((key, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default PublicChartsView;
