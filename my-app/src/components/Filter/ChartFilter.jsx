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
  const [groupBy, setGroupBy] = useState("Region");


  // Local filter state
  const [tempIndicator, setTempIndicator] = useState(null);
  const [tempAges, setTempAges] = useState([]);
  const [tempGenders, setTempGenders] = useState([]);
  const [tempYears, setTempYears] = useState([]);
  const [tempRegions, setTempRegions] = useState([]);

  useEffect(() => {
    setTempIndicator(filters.indicator || null);
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
      ages: groupBy !== "Age" ? tempAges : [],
      genders: groupBy !== "Gender" ? tempGenders : [],
      years: groupBy !== "Year" ? tempYears : [],
      regions: tempRegions,

      chartType: view,
      groupBy: groupBy,
    });
    setFilters(setFilters)
  };

  const handleClearFilters = () => {
    setTempIndicator(null);
    setTempAges([]);
    setTempGenders([]);
    setTempYears([]);
    setTempRegions([]);
  };

  // Filter options
  const indicatorOptions = [
    { value: "AllI", label: "All Indicators" },
    { value: "structural", label: "Structural & Policy Determinants" },
    { value: "community", label: "Community & Behavioral Determinants" },
    { value: "clinical", label: "Clinical & Outcome Determinants" },
  ];

  const ageOptions = [
    { value: "AllA", label: "All Ages" },
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
  ];

  const yearOptions = [];
  for (let y = 2025; y >= 1990; y--) {
    yearOptions.push({ value: y, label: y.toString() });
  }

  // Maldives Regions (Atolls and City)
  const regionOptions = [
    { value: "AllR", label: "All Regions" },
    { value: "Addu", label: "Addu" },
    { value: "Alif Dhaalu", label: "Alif Dhaalu" },
    { value: "Alif Alif", label: "Alif Alif" },
    { value: "Baa", label: "Baa" },
    { value: "Dhaalu", label: "Dhaalu" },
    { value: "Faafu", label: "Faafu" },
    { value: "Gaafu Alif", label: "Gaafu Alif" },
    { value: "Gaafu Dhaalu", label: "Gaafu Dhaalu" },
    { value: "Gnaviyani", label: "Gnaviyani" },
    { value: "Haa Dhaalu", label: "Haa Dhaalu" },
    { value: "Haa Alif", label: "Haa Alif" },
    { value: "Kaafu", label: "Kaafu" },
    { value: "Laamu", label: "Laamu" },
    { value: "Lhaviyani", label: "Lhaviyani" },
    { value: "Meemu", label: "Meemu" },
    { value: "Noonu", label: "Noonu" },
    { value: "Raa", label: "Raa" },
    { value: "Seenu", label: "Seenu" },
    { value: "Shaviyani", label: "Shaviyani" },
    { value: "Thaa", label: "Thaa" },
  ];

<Form.Group className="mb-3" controlId="selectGroupBy">
  <Form.Label className="custom-form-label">Group By (X-axis)</Form.Label>
  <Select
    options={[
      { value: "Age", label: "Age" },
      { value: "Gender", label: "Gender" },
      { value: "Year", label: "Year" },
      { value: "Region", label: "Region" },
    ]}
    value={{ value: groupBy, label: groupBy }}
    onChange={(selected) => setGroupBy(selected.value)}
  />
</Form.Group>

  return (
    <div className={`sidebar-menu ${isOpen ? "open" : ""}`}>
      <div className="chart-filter-layout">
        {/* Chart Type Buttons */}
        <ToggleButtonGroup
          orientation="horizontal"
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
                color: "#d9d9d9",
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
