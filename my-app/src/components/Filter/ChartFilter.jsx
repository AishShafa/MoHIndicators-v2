import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./ChartFilter.css";
import MultiSelect from "./MultiSelect";

export default function ChartFilter({ isOpen, toggleMenu, filters, setFilters }) {
  const [view, setView] = useState("list");

  // Local filter state
  const [tempIndicator, setTempIndicator] = useState(null);
  const [tempAges, setTempAges] = useState([]);
  const [tempGenders, setTempGenders] = useState([]);
  const [tempYears, setTempYears] = useState([]);
  const [tempRegions, setTempRegions] = useState([]);
  const [tempMetrics, setTempMetrics] = useState([]);
  const [tempLocations, setTempLocations] = useState([]);
  
  useEffect(() => {
    setTempIndicator(filters.indicator || null);
    setTempAges(filters.ages || []);
    setTempGenders(filters.genders || []);
    setTempYears(filters.years || []);
    setTempRegions(filters.regions || []);
    setTempMetrics(filters.metrics || []);
    setTempLocations(filters.locations || []);
    setView(filters.chartType || "list");
  }, [filters]);

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
    setView("list");
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

  return (
    <div className="filters-sidebar-wrapper">
      <div className={`sidebar-menu ${isOpen ? "open" : ""} filter-card`}>
        <div className="filters-title-row">
          <svg className="w-5 h-5 text-emerald-500 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          <h2 className="filters-title">Filters</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm mb-2 font-semibold">Chart Type</p>
            <div className="flex gap-1">
              <button
                type="button"
                className={`chart-type-btn${view === 'module' ? ' selected' : ''} px-3 py-1 text-sm rounded-full ${view === 'module' ? 'text-white' : 'text-gray-700'}`}
                onClick={() => setView('module')}
                aria-label="Bar"
              >
                Bar
              </button>
              <button
                type="button"
                className={`chart-type-btn${view === 'list' ? ' selected' : ''} px-3 py-1 text-sm rounded-full ${view === 'list' ? 'text-white' : 'text-gray-700'}`}
                onClick={() => setView('list')}
                aria-label="Line"
              >
                Line
              </button>
              <button
                type="button"
                className={`chart-type-btn${view === 'quilt' ? ' selected' : ''} px-3 py-1 text-sm rounded-full ${view === 'quilt' ? 'text-white' : 'text-gray-700'}`}
                onClick={() => setView('quilt')}
                aria-label="Pie"
              >
                Pie
              </button>
            </div>
          </div>
          <Form onSubmit={handleApplyFilters} className="space-y-4">
            <div>
              <MultiSelect label="Indicator" options={indicatorOptions} selectedOptions={tempIndicator ? [tempIndicator] : []} onChange={selected => setTempIndicator(selected[0] || null)} isMulti={false} />
            </div>
            <MultiSelect label="Metric" options={metricOptions} selectedOptions={tempMetrics} onChange={setTempMetrics} />
            <MultiSelect label="Location" options={locationOptions} selectedOptions={tempLocations} onChange={setTempLocations} />
            <MultiSelect label="Age Group" options={ageOptions} selectedOptions={tempAges} onChange={setTempAges} />
            <MultiSelect label="Gender" options={genderOptions} selectedOptions={tempGenders} onChange={setTempGenders} />
            <MultiSelect label="Year" options={yearOptions} selectedOptions={tempYears} onChange={setTempYears} />
            <MultiSelect label="Region" options={regionOptions} selectedOptions={tempRegions} onChange={setTempRegions} />
            <button type="submit" className="w-full bg-emerald-500 text-white py-2 rounded-md font-medium hover:bg-emerald-600 transition">Apply Filters</button>
            <button type="button" onClick={handleClearFilters} className="w-full text-gray-600 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition">Clear Selection</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
