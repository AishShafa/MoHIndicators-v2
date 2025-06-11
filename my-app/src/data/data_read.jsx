/* Read data from datasets / excel sheet using xlsx library */


import DataTable from "../components/Table/Data_Table";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";

// Main component to read and filter Excel data
const DataRead = ({ filters }) => {
  // State to hold the full dataset from the Excel file
  const [data, setData] = useState([]);
  // State to hold filtered data based on selected filters
  const [filteredData, setFilteredData] = useState([]);
  // State to store any file loading or parsing error
  const [error, setError] = useState("");

  // Load and parse the Excel file when the component mounts
  useEffect(() => {
    fetch("/data/fake_filtered_health_data.xlsx")
      .then((res) => res.arrayBuffer()) // Read the file as binary data
      .then((arrayBuffer) => {
        const workbook = XLSX.read(arrayBuffer, { type: "array" }); // Parse the workbook
        const sheetName = workbook.SheetNames[0]; // Use the first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON
        setData(jsonData); // Save the parsed data
      })
      .catch((err) => setError("Failed to load XLSX file: " + err)); // Catch errors
  }, []);

  // Apply filtering logic every time filters or data change
  useEffect(() => {
    let result = data;

    // Filter by indicator if selected
    if (filters.indicator) {
      result = result.filter(
        (row) => row.Indicator === filters.indicator.label
      );
    }

    // Filter by metrics
    if (filters.metrics.length > 0) {
      result = result.filter((row) =>
        filters.metrics.some((m) => m.value === row.Metric)
      );
    }

    // Filter by locations
    if (filters.locations.length > 0) {
      result = result.filter((row) =>
        filters.locations.some((l) => l.value === row.Location)
      );
    }

    // Filter by age groups
    if (filters.ages.length > 0) {
      result = result.filter((row) =>
        filters.ages.some((a) => a.value === row.Age)
      );
    }

    // Filter by genders
    if (filters.genders.length > 0) {
      result = result.filter((row) =>
        filters.genders.some((g) => g.value === row.Gender)
      );
    }

    // Filter by years
    if (filters.years.length > 0) {
      result = result.filter((row) =>
        filters.years.some((y) => y.value === row.Year)
      );
    }

    // Filter by regions
    if (filters.regions.length > 0) {
      result = result.filter((row) =>
        filters.regions.some((r) => r.value === row.Region)
      );
    }

    // Update the filtered data state
    setFilteredData(result);
  }, [filters, data]);

  return (
    <div className="table-container">
      {error ? (
        // Show error if file failed to load
        <p className="text-danger">{error}</p>
      ) : filteredData.length === 0 ? (
        // Show message if no results after filtering
        <p>No data matches the selected filters.</p>
            ) : (
        <DataTable data={filteredData} />
      )}
    </div>
  );
};

// Prop types for type-checking the `filters` prop
DataRead.propTypes = {
  filters: PropTypes.shape({
    indicator: PropTypes.object,
    metrics: PropTypes.array,
    locations: PropTypes.array,
    ages: PropTypes.array,
    genders: PropTypes.array,
    years: PropTypes.array,
    regions: PropTypes.array,
  }).isRequired,
};

export default DataRead;

