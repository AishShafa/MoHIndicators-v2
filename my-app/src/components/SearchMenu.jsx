// src/components/SearchMenu.jsx
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Select from "react-select";
import "./SearchMenu.css";
import MultiSelect from "../components/MultiSelect";

export default function SearchMenu({ isOpen, toggleMenu }) {


    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedAges, setSelectedAges] = useState([]);
    const [selectedGenders, setSelectedGenders] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedRegions, setSelectedRegions] = useState([]);

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
    { value: "Male", label: "Male'" },
    { value: "Hulhumale", label: "Hulhumale'" },
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
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
  ];

  const regionOptions = [
    { value: "Kaafu", label: "Kaafu" },
    { value: "Laamu", label: "Laamu" },
    { value: "Gaafu", label: "Gaafu" },
  ];

  return (
    <>
      {/* Toggle Button - shown always */}
      <button className="menu-button" onClick={toggleMenu} />

      {/* Slide-out Menu */}
      <div className={`sidebar-menu ${isOpen ? "open" : ""}`}>
      <h5>Filters</h5>
      <Form>
        <Form.Group className="mb-3" controlId="selectIndicator">
        <Form.Label className="custom-form-label">Indicator</Form.Label>
        <Select
        options={indicatorOptions}
        value={selectedIndicator}
        onChange={setSelectedIndicator}
        isSearchable={true}
        isMulti={false}
        classNamePrefix="react-select"
        placeholder="Select Indicator"
        styles={{
        control: (provided) => ({
        ...provided,
        }),
        input: (provided) => ({
        ...provided,
        fontSize: '14px',
        }),
        singleValue: (provided) => ({
        ...provided,
        fontSize: '14px',
        }),
        placeholder: (provided) => ({
        ...provided,
        fontSize: '16px',
        }),
    }}

        />
        </Form.Group>


        <MultiSelect
          label="Metric"
          options={metricOptions}
          selectedOptions={selectedMetrics}
          onChange={setSelectedMetrics}
        />

        <MultiSelect
          label="Location"
          options={locationOptions}
          selectedOptions={selectedLocations}
          onChange={setSelectedLocations}
        />

        <MultiSelect
          label="Age"
          options={ageOptions}
          selectedOptions={selectedAges}
          onChange={setSelectedAges}
        />

        <MultiSelect
          label="Gender"
          options={genderOptions}
          selectedOptions={selectedGenders}
          onChange={setSelectedGenders}
        />

        <MultiSelect
          label="Year"
          options={yearOptions}
          selectedOptions={selectedYears}
          onChange={setSelectedYears}
        />

        <MultiSelect
          label="Region"
          options={regionOptions}
          selectedOptions={selectedRegions}
          onChange={setSelectedRegions}
        />

        <Button variant="success" type="submit" className="w-100 floating-submit-button">
            Apply
          </Button>
        </Form>
      </div>
    </>
  );
}