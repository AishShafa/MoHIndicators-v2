import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
  Form,
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  GridView as GridIcon,
  ViewList as ListIcon,
  FilterList as FilterIcon,
  FileDownload,
  Share as ShareIcon,
  Visibility,
  Close as CloseIcon,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import "./Results.css"; // Import custom styles

// Util for formatting numbers and percentages
const formatValue = (value, unit) => {
  if (unit === "%") return value + "%";
  if (unit && unit.includes("/")) return `${value} ${unit}`;
  return value;
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

// Change percentage color
const ChangePercent = ({ change }) => {
  if (typeof change !== "number") return null;
  return (
    <span
      className={`change-percent ${
        change > 0 ? "positive" : change < 0 ? "negative" : ""
      }`}
    >
      {change > 0 && (
        <>
          <ArrowUpward style={{ fontSize: "1rem" }} />
          +{change}%
        </>
      )}
      {change < 0 && (
        <>
          <ArrowDownward style={{ fontSize: "1rem" }} />
          {change}%
        </>
      )}
      {change === 0 && "0%"}
    </span>
  );
};

// Modal for details (screenshot 2)
const IndicatorModal = ({
  show,
  onHide,
  indicator,
  onDownloadCSV,
  onDownloadChart,
  onShare,
}) => {
  if (!indicator) return null;
  return (
    <Modal show={show} onHide={onHide} size="xl" className="dashboard-modal">
      <Modal.Body>
        <Row>
          <Col md={8}>
            <div className="modal-header-custom">
              <h3 className="modal-title mb-1">{indicator.title}</h3>
              <div className="modal-category-row">
                <span className="modal-category">{indicator.category}</span>
                <ChangePercent change={indicator.change_percent} />
                <small className="modal-change-text ms-2">
                  {indicator.change_percent < 0
                    ? `${indicator.change_percent}% from previous period`
                    : indicator.change_percent > 0
                    ? `+${indicator.change_percent}% from previous period`
                    : ""}
                </small>
              </div>
              <div className="modal-meta-row mb-1">
                <span>
                  Last updated: {formatDate(indicator.updated_at)}
                </span>
                <span className="ms-4">
                  Region: {indicator.region || "National"}
                </span>
              </div>
              <div className="modal-description mb-3">
                {indicator.description}
              </div>
            </div>
            <Card className="modal-visual-card mb-4">
              <Card.Body>
                <h5 className="mb-3">Data Visualization</h5>
                {/* You can render a chart here with a charting library */}
                <div className="modal-chart-placeholder"> {/* Placeholder */} </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="modal-statistics-card mb-4">
              <Card.Body>
                <h5 className="mb-3">Key Statistics</h5>
                <div className="modal-stat-value mb-2">
                  <div className="modal-stat-label mb-1">Current Value</div>
                  <div className="modal-stat-number">
                    {indicator.value_display}
                  </div>
                </div>
                <div className="modal-stat-change mb-2">
                  <div className="modal-stat-label">Change from Previous</div>
                  <div>
                    <ChangePercent change={indicator.change_percent} />
                  </div>
                </div>
                <div className="modal-stat-points">
                  <div className="modal-stat-label">Data Points</div>
                  <div>{indicator.data_points || 0}</div>
                </div>
              </Card.Body>
            </Card>
            <Card className="modal-actions-card mb-4">
              <Card.Body>
                <h5 className="mb-3">Actions</h5>
                <Button
                  variant="outline-primary"
                  className="w-100 mb-2"
                  onClick={() => onDownloadCSV(indicator)}
                  starticon={<FileDownload />}
                >
                  <FileDownload className="me-1" />
                  Download Data (CSV)
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-100 mb-2"
                  onClick={() => onDownloadChart(indicator)}
                  starticon={<FileDownload />}
                >
                  <FileDownload className="me-1" />
                  Download Chart (PNG)
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => onShare(indicator)}
                  starticon={<ShareIcon />}
                >
                  <ShareIcon className="me-1" />
                  Share Chart
                </Button>
              </Card.Body>
            </Card>
            <Card className="modal-datasource-card">
              <Card.Body>
                <h6>Data Source</h6>
                <div className="modal-datasource-text">
                  Ministry of Health, Republic of Maldives
                  <br />
                  Health Information System
                </div>
                <div className="modal-datasource-date">
                  Updated: {formatDate(indicator.updated_at)}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Button
          variant="link"
          className="modal-close-btn"
          onClick={onHide}
          aria-label="Close"
        >
          <CloseIcon />
        </Button>
      </Modal.Body>
    </Modal>
  );
};

const HealthDashboard = () => {
  const [indicators, setIndicators] = useState([]);
  const [displayedIndicators, setDisplayedIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid"); // "grid" or "list"
  const [sort, setSort] = useState("most_recent"); // For demo
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch data from backend (adapt endpoint as needed)
  const fetchIndicators = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/public/health-forms");
      const data = await res.json();
      // NOTE: Map backend data to expected UI indicator fields.
      const mapped = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.health_indicator_category || item.health_indicator || "",
        value: item.value,
        value_display: item.display_value || item.value || "",
        unit: item.unit,
        change_percent: item.change_percent,
        updated_at: item.created_at,
        region: item.region || "National",
        data_points: item.data_points || (item.charts && item.charts.length) || 0,
        // ...include other backend fields as needed
      }));
      setIndicators(mapped);
      setDisplayedIndicators(mapped);
    } catch (e) {
      setIndicators([]);
      setDisplayedIndicators([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  // Filter and search
  useEffect(() => {
    let filtered = indicators;
    if (search) {
      filtered = filtered.filter((ind) =>
        [ind.title, ind.category, ind.description]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }
    setDisplayedIndicators(filtered);
  }, [search, indicators]);

  // Modal handlers
  const openModal = (indicator) => {
    setSelectedIndicator(indicator);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // Download/Share stubs (implement as needed)
  const handleDownloadCSV = (indicator) => {
    // TODO: implement, or provide link if available
    alert("Download CSV for " + indicator.title);
  };
  const handleDownloadChart = (indicator) => {
    alert("Download Chart for " + indicator.title);
  };
  const handleShare = (indicator) => {
    alert("Share " + indicator.title);
  };

  // Sort and view controls (dummy for now, just UI)
  const handleSort = (type) => setSort(type);
  const handleView = (type) => setView(type);

  // UI
  return (
    <Container fluid className="dashboard-container p-4">
      {/* MODAL */}
      <IndicatorModal
        show={modalOpen}
        onHide={closeModal}
        indicator={selectedIndicator}
        onDownloadCSV={handleDownloadCSV}
        onDownloadChart={handleDownloadChart}
        onShare={handleShare}
      />

      <Row>
        <Col>
          <div className="dashboard-header text-center mb-4">
            <h1 className="dashboard-title">Maldives Health Data Dashboard</h1>
            <div className="dashboard-desc mb-3">
              Explore comprehensive health indicators and statistics for the Republic of Maldives.
              Access real-time data, trends, and insights to understand our nation's health landscape.
            </div>
          </div>
        </Col>
      </Row>

      {/* Controls */}
      <Row className="mb-3 align-items-center">
        <Col md={7} className="mb-2 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Search health indicators, diseases, demographics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dashboard-search"
          />
        </Col>
        <Col md={5}>
          <div className="dashboard-controls d-flex justify-content-end align-items-center">
            <Button variant="outline-secondary" className="me-2">
              <FilterIcon className="me-1" />
              Filters
            </Button>
            <DropdownButton
              id="sort-dropdown"
              title={
                sort === "most_recent"
                  ? "Most Recent"
                  : sort === "alphabetical"
                  ? "A-Z"
                  : "Value"
              }
              onSelect={handleSort}
              variant="outline-secondary"
              className="me-2"
            >
              <Dropdown.Item eventKey="most_recent">Most Recent</Dropdown.Item>
              <Dropdown.Item eventKey="alphabetical">A-Z</Dropdown.Item>
              <Dropdown.Item eventKey="value">By Value</Dropdown.Item>
            </DropdownButton>
            <Button
              variant={view === "grid" ? "primary" : "outline-secondary"}
              onClick={() => handleView("grid")}
              className="me-1"
              aria-label="Grid view"
            >
              <GridIcon />
            </Button>
            <Button
              variant={view === "list" ? "primary" : "outline-secondary"}
              onClick={() => handleView("list")}
              aria-label="List view"
            >
              <ListIcon />
            </Button>
          </div>
        </Col>
      </Row>

      {/* Sub-header: count, export, share */}
      <Row className="mb-3 align-items-center">
        <Col md={6} className="mb-2 mb-md-0">
          <span className="dashboard-subheader">
            Showing {displayedIndicators.length} of {indicators.length} health indicators
          </span>
        </Col>
        <Col md={6}>
          <div className="dashboard-actionbar d-flex justify-content-end">
            <Button variant="outline-secondary" className="me-2">
              <FileDownload className="me-1" />
              Export Data
            </Button>
            <Button variant="outline-secondary">
              <ShareIcon className="me-1" />
              Share
            </Button>
          </div>
        </Col>
      </Row>

      {/* Main indicator grid/list */}
      {loading ? (
        <div className="dashboard-loading text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Loading health indicators...</div>
        </div>
      ) : displayedIndicators.length === 0 ? (
        <div className="dashboard-empty text-center py-5">
          <div>No health indicators found.</div>
        </div>
      ) : view === "grid" ? (
        <Row>
          {displayedIndicators.map((indicator) => (
            <Col lg={4} md={6} sm={12} key={indicator.id} className="mb-4">
              <Card className="dashboard-card h-100">
                <Card.Body>
                  <div className="dashboard-card-header mb-2">
                    <h5 className="dashboard-card-title mb-1">
                      {indicator.title}
                    </h5>
                    <div className="dashboard-card-category mb-1">
                      <span className="dashboard-card-category-pill">
                        {indicator.category}
                      </span>
                      <ChangePercent change={indicator.change_percent} />
                    </div>
                  </div>
                  <div className="dashboard-card-desc mb-2">
                    {indicator.description}
                  </div>
                  <div className="dashboard-card-value mb-3">
                    <strong>{indicator.value_display}</strong>
                  </div>
                  <div className="dashboard-card-meta mb-3">
                    <span>
                      Updated {formatDate(indicator.updated_at)}
                    </span>
                  </div>
                  <div className="dashboard-card-actions d-flex justify-content-between">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openModal(indicator)}
                    >
                      <Visibility className="me-1" />
                      View
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleShare(indicator)}
                    >
                      <ShareIcon className="me-1" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          <Col>
            <Card className="dashboard-list-card">
              <Card.Body>
                {displayedIndicators.map((indicator) => (
                  <div
                    className="dashboard-list-row d-flex align-items-center justify-content-between mb-3"
                    key={indicator.id}
                  >
                    <div className="dashboard-list-info">
                      <h5 className="dashboard-list-title mb-1">
                        {indicator.title}
                        <span className="dashboard-list-category ms-2">
                          {indicator.category}
                        </span>
                        <ChangePercent change={indicator.change_percent} />
                      </h5>
                      <div className="dashboard-list-desc mb-1">
                        {indicator.description}
                      </div>
                      <div className="dashboard-list-meta text-muted mb-0">
                        Updated {formatDate(indicator.updated_at)} &nbsp;|&nbsp;{" "}
                        {indicator.region}
                      </div>
                    </div>
                    <div className="dashboard-list-value">
                      <strong>{indicator.value_display}</strong>
                    </div>
                    <div className="dashboard-list-actions d-flex">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => openModal(indicator)}
                      >
                        <Visibility className="me-1" />
                        View
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleDownloadCSV(indicator)}
                      >
                        <FileDownload />
                      </Button>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default HealthDashboard;