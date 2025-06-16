//Main Dashboard with Indicator Filters

import React, { useState } from "react";
import {  Card , ButtonGroup, Button} from "react-bootstrap";
import TableFilter from "../../components/Filter/TableFilter";
import ChartFilter from "../../components/Filter/ChartFilter";
import DataRead from "../../data/data_read";
import "./Dashboard.css";
import ExcelParser from "../../data/ExcelParser";
import TopNavbar from "../../constants/TopNavBar/TopNavbar";

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(true); /*Menu Open by Default*/
  const [activeView, setActiveView] = useState("table"); // 'table' | 'charts' | 'about'

  const [filters, setFilters] = useState({
    indicator: null,
    metrics: [],
    locations: [],
    ages: [],
    genders: [],
    years: [],
    regions: [],
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <div className="dashboard-root">
      {/* Header/Navbar */}
      <TopNavbar />
      <div className="dashboard-layout">
        {/* Sidebar menu */}
        <div
          className={`sidebar-container ${isMenuOpen ? "" : "collapsed"}`}
          style={{ width: isMenuOpen ? "295px" : "1px", transition: "width 0.3s" }}
        >
          {activeView === "table" && (
            <TableFilter
              isOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              filters={filters}
              setFilters={setFilters}
            />
          )}
          {activeView === "charts" && (
            <ChartFilter
              isOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              filters={filters}
              setFilters={setFilters}
            />
          )}
        </div>
        {/* Main content */}
        <div className="main-content">
          {/* Summary Cards */}
          <div className="dashboard-cards-row" style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
            <Card className="dashboard-card dashboard-card-blue" style={{ flex: 1, minWidth: 180 }}>
              <div className="dashboard-card-label">Total Records</div>
              <div className="dashboard-card-value">75,668</div>
              <div className="dashboard-card-icon"><span role="img" aria-label="trend">📈</span></div>
            </Card>
            <Card className="dashboard-card dashboard-card-green" style={{ flex: 1, minWidth: 180 }}>
              <div className="dashboard-card-label">Average</div>
              <div className="dashboard-card-value">2,609</div>
              <div className="dashboard-card-icon"><span role="img" aria-label="avg">💹</span></div>
            </Card>
            <Card className="dashboard-card dashboard-card-purple" style={{ flex: 1, minWidth: 180 }}>
              <div className="dashboard-card-label">Median</div>
              <div className="dashboard-card-value">3,013</div>
              <div className="dashboard-card-icon"><span role="img" aria-label="median">👥</span></div>
            </Card>
          </div>
          {/* Results Header */}
          <div className="results-header text-center mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="results-header-title" style={{ margin: 0 }}>
              Results
              {filters?.indicator?.label && ` – ${filters.indicator.label}`}
            </h2>
            <span className="dashboard-updated" style={{ background: '#d1fae5', color: '#047857', borderRadius: 8, padding: '4px 16px', fontSize: 14 }}>Updated Today</span>
          </div>
          {/* Chart Section */}
          <section className="dashboard-chart-section" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #e5e7eb', padding: 24, marginBottom: 32 }}>
            <div className="dashboard-chart-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="dashboard-chart-title" style={{ fontWeight: 600, fontSize: 20 }}>Number by Year</div>
              <div className="dashboard-chart-group" style={{ display: 'flex', gap: 12 }}>
                <ButtonGroup className="dashboard-chart-tabs">
                  <Button className="dashboard-chart-tab active">Bar Chart</Button>
                  <Button className="dashboard-chart-tab">Line Chart</Button>
                </ButtonGroup>
                <select className="dashboard-chart-select" style={{ borderRadius: 8, border: '1px solid #d1d5db', padding: '4px 12px' }}>
                  <option>Year</option>
                </select>
              </div>
            </div>
            <div className="dashboard-chart-controls" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Button className="dashboard-chart-btn">Count / Sum</Button>
              <Button className="dashboard-chart-btn">Percent (%)</Button>
              <Button className="dashboard-chart-btn">Mean</Button>
            </div>
            <div className="dashboard-chart-area" style={{ minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #e5e7eb', borderRadius: 12 }}>
              {/* Chart would go here */}
              <div className="dashboard-chart-legend" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <span style={{ display: 'inline-block', width: 18, height: 8, background: '#10b981', borderRadius: 2 }}></span> Value
                <span style={{ display: 'inline-block', width: 18, height: 8, background: '#6366f1', borderRadius: 2 }}></span> Median
              </div>
            </div>
          </section>
          {/* Pane Content (hidden, logic preserved) */}
          <div style={{ display: 'none' }}>
            <ButtonGroup className="toggle-group">
              <Button
                className={activeView === "table" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setActiveView("table")}
              >
                Table
              </Button>
              <Button
                className={activeView === "charts" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setActiveView("charts")}
              >
                Charts
              </Button>
              <Button
                className={activeView === "about" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setActiveView("about")}
              >
                About
              </Button>
            </ButtonGroup>
            <Card className="mb-3" style={{ height: "700px", overflowY: "auto" }}>
              <Card.Body>
                {activeView === "table" && <DataRead filters={filters} />}
                {activeView === "charts" && <ExcelParser filters={filters} />}
                {activeView === "about" && (
                  <div>
                    <h5>About This Dashboard</h5>
                    <p>
                      This dashboard displays public health indicators from various sources.
                      You can filter by indicator type, age, gender, and other demographic fields.
                    </p>
                    <p>
                      It is built using React, Bootstrap, and XLSX, and is intended for use by
                      the Ministry of Health and stakeholders.
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}