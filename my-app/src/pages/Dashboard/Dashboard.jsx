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


          {/* Main content, pushed if sidebar is open */}

        <div className="main-content">
          <div className="results-header text-center mb-3">
  <h2 className="results-header-title">
              Results
              {filters?.indicator?.label && ` – ${filters.indicator.label}`}
            </h2>
            
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
    </>
  );
}