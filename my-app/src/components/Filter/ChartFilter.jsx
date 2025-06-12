import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Select from "react-select";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import "./ChartFilter.css";
import MultiSelect from "./MultiSelect";

export default function ChartFilter({ isOpen, toggleMenu, filters, setFilters }) {
  const [view, setView] = useState("list");

  // Local filter state
  const [tempIndicator, setTempIndicator] = useState(null);
  const [tempMetrics, setTempMetrics] = useState([]);
  const [tempLocations, setTempLocations] = useState([]);
  const [tempAges, setTempAges] = useState([]);
  const [tempGenders, setTempGenders] = useState([]);
  const [tempYears, setTempYears] = useState([]);
  const [tempRegions, setTempRegions] = useState([]);

  useEffect(() => {
    setTempIndicator(filters.indicator || null);
    setTempMetrics(filters.metrics || []);
    setTempLocations(filters.locations || []);
    setTempAges(filters.ages || []);
    setTempGenders(filters.genders || []);
    setTempYears(filters.years || []);
    setTempRegions(filters.regions || []);
  }, [filters]);

  // Toggle chart view
  const handleViewChange = (event, nextView) => {
    if (nextView !== null) setView(nextView);
  };

  // Apply filters to parent state
  const handleApplyFilters = (e) => {
    e.preventDefault();
    setFilters({
      indicator: tempIndicator,
      metrics: tempMetrics,
      locations: tempLocations,
      ages: tempAges,
      genders: tempGenders,
      years: tempYears,
      regions: tempRegions,
      chartType: view,
    });
  };

  const handleClearFilters = () => {
    setTempIndicator(null);
    setTempMetrics([]);
    setTempLocations([]);
    setTempAges([]);
    setTempGenders([]);
    setTempYears([]);
    setTempRegions([]);
  };

  // Filter options
  const indicatorOptions = [
    { value: "structural", label: "Structural & Policy Determinants" },
    { value: "community", label: "Community & Behavioral Determinants" },
    { value: "clinical", label: "Clinical & Outcome Determinants" },
  ];

  const metricOptions = [
    { value: "Number", label: "Number" },
    { value: "Percent", label: "Percent" },
    { value: "Rate", label: "Rate" },
  ];

  const locationOptions = [
    { value: "Male", label: "Male" },
    { value: "Hulhumale", label: "Hulhumale" },
    { value: "Villingili", label: "Villingili" },
    { value: "Phase2", label: "Phase 2" },
    { value: "Maafushi", label: "Maafushi" },
    { value: "Kaashidhoo", label: "Kaashidhoo" },
  ];

  const ageOptions = [
    { value: "<1", label: "Below 1 Year" },
    { value: "1-4", label: "1–4 Years" },
    { value: "5-14", label: "5–14 Years" },
    { value: "15-18", label: "15–18 Years" },
    { value: "19-24", label: "19–24 Years" },
    { value: "25-40", label: "25–40 Years" },
    { value: "41-60", label: "41–60 Years" },
    { value: "61-80", label: "61–80 Years" },
    { value: "81-90", label: "81–90 Years" },
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Both", label: "Both" },
  ];

  const yearOptions = [
    { value: 2025, label: "2025" },
    { value: 2024, label: "2024" },
    { value: 2023, label: "2023" },
  ];

  const regionOptions = [
    { value: "Kaafu", label: "Kaafu" },
    { value: "Laamu", label: "Laamu" },
    { value: "Gaafu", label: "Gaafu" },
  ];

  return (
    <div className={`sidebar-menu ${isOpen ? "open" : ""}`}>
      <div className="chart-filter-layout">
        {/* Chart Type Buttons */}
        <ToggleButtonGroup
          orientation="vertical"
          value={view}
          exclusive
          onChange={handleViewChange}
          className="chart-toggle-group"
        >
          <ToggleButton value="list" aria-label="map">
            <PublicIcon />
          </ToggleButton>
          <ToggleButton value="module" aria-label="barchart">
            <BarChartIcon />
          </ToggleButton>
          <ToggleButton value="quilt" aria-label="pie">
            <PieChartIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Filters Section */}
        <Form onSubmit={handleApplyFilters} className="filters-section">
          <h3 className="filters-title">Filters</h3>

          <Form.Group className="mb-3" controlId="selectIndicator">
            <Form.Label className="custom-form-label">Indicator</Form.Label>
            <Select
              options={indicatorOptions}
              value={tempIndicator}
              onChange={setTempIndicator}
              isSearchable
              isMulti={false}
              classNamePrefix="react-select"
              placeholder="Select Indicator"
            />
          </Form.Group>

          <MultiSelect label="Metric" options={metricOptions} selectedOptions={tempMetrics} onChange={setTempMetrics} />
          <MultiSelect label="Location" options={locationOptions} selectedOptions={tempLocations} onChange={setTempLocations} />
          <MultiSelect label="Age" options={ageOptions} selectedOptions={tempAges} onChange={setTempAges} />
          <MultiSelect label="Gender" options={genderOptions} selectedOptions={tempGenders} onChange={setTempGenders} />
          <MultiSelect label="Year" options={yearOptions} selectedOptions={tempYears} onChange={setTempYears} />
          <MultiSelect label="Region" options={regionOptions} selectedOptions={tempRegions} onChange={setTempRegions} />

          <Button variant="success" type="submit" className="w-100 floating-submit-button">
            Apply
          </Button>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <span
              onClick={handleClearFilters}
              style={{
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              Clear Selection
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}
