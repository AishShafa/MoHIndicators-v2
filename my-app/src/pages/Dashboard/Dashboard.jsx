//Main Dashboard with Indicator Filters

import React, { useState } from "react";
import {  Card , ButtonGroup, Button} from "react-bootstrap";
import TableFilter from "../../components/Filter/TableFilter";
import ChartFilter from "../../components/Filter/ChartFilter";
import DataRead from "../../data/data_read";
import "./Dashboard.css";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MetricBarChart from "../../data/MetricBarChart";
import ExcelParser from "../../data/ExcelParser";

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
    <>

      {/* Hamburger button*/}
      <button
       className="menu-button" 
       onClick={toggleMenu}
       style={{ left: isMenuOpen ? "290px" : "22px" }} /*width to side of page on menu from open to close*/
>
  {isMenuOpen ? <MenuRoundedIcon/> : <MenuOpenRoundedIcon />}
       </button>

          {/* Sidebar menu + Main Content*/}
          <div className="dashboard-layout">
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


            <div className="main-content">
            {/* View Toggle Buttons */}
            
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

          {/* Pane Content */}
          <Card className="mb-3 card" >
            <Card.Body className="card-body">
              {/* Results Header Section */}
              {activeView === "charts" && (
              <div className="results-header">
                <h2>Results {filters?.indicator?.label && ` – ${filters.indicator.label}`}</h2>
                <div className="results-subtext">Health indicators data visualization</div>

                <div className="summary-cards">
                  <div className="summary-card">
                    <div className="summary-icon-green">
                      <svg width="28" height="28" fill="#10b981" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18.2A8.2 8.2 0 113.8 12 8.21 8.21 0 0112 20.2z"/></svg>
                    </div>
                    <div>
                      <div className="summary-text-label">Total Records</div>
                      <div className="summary-text-value">75,669</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon-green">
                      <svg width="28" height="28" fill="#10b981" viewBox="0 0 24 24"><path d="M17 10.5V7a5 5 0 00-10 0v3.5a2.5 2.5 0 00-2 2.45V17a2.5 2.5 0 002.5 2.5h9A2.5 2.5 0 0020 17v-4.05a2.5 2.5 0 00-2-2.45zM7 7a5 5 0 0110 0v3.5H7V7zm11 10a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 17v-4.05a1.5 1.5 0 011.5-1.45h9A1.5 1.5 0 0119 12.95V17z"/></svg>
                    </div>
                    <div>
                      <div className="summary-text-label">Average</div>
                      <div className="summary-text-value">2,600</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon-purple">
                      <svg width="28" height="28" fill="#a78bfa" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18.2A8.2 8.2 0 113.8 12 8.21 8.21 0 0112 20.2zm0-14.7a1.5 1.5 0 11-1.5 1.5A1.5 1.5 0 0112 5.5z"/></svg>
                    </div>
                    <div>
                      <div className="summary-text-label">Median</div>
                      <div className="summary-text-value">2,500</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
              {/* Pane Content */}
              <div style={{padding: activeView === "charts" ? '0 32px 32px 32px' : 24}}>
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
              </div>
            </Card.Body>
          </Card>
          </div>
          </div>
    </>
  );
}