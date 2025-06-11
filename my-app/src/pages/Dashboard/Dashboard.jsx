//Main Dashboard with Indicator Filters

import React, { useState } from "react";
import {  Card , ButtonGroup, Button} from "react-bootstrap";
import SearchMenu from "../../components/Menu/SearchMenu";
import DataRead from "../../data/data_read";
import "./Dashboard.css";
import TopNavbar from "../../constants/TopNavbar/TopNavbar";


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
      {/* Top navbar */}
      <TopNavbar />

      {/* Hamburger button*/}
      <button
       className="menu-button" 
       onClick={toggleMenu}
       style={{ left: isMenuOpen ? "295px" : "32px" }} /*width to side of page on menu from open to close*/
>
  {isMenuOpen ? "←" : "☰"}
       </button>

          {/* Sidebar menu + Main Content*/}
          <div className="dashboard-layout">
            <SearchMenu 
            isOpen={isMenuOpen} 
            toggleMenu={toggleMenu} 
            filters={filters} 
            setFilters={setFilters} 
            />

          {/* Main content, pushed if sidebar is open */}

        <div className="main-content">
          <div className="results-header d-flex align-items-center justify-content-center mb-4">
          {/*<h3 className="me-2 mb-0">Results</h3>*/}

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
          </div>

          {/* Pane Content */}
          <Card className="mb-3" style={{ height: "700px", overflowY: "auto" }}>
            <Card.Body>
              {activeView === "table" && <DataRead filters={filters} />}
              {activeView === "charts" && (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <span>📊 Charts view coming soon</span>
                </div>
              )}
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
    </>
  );
}