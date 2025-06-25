import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6688"];

const DataPie = ({ filters }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");

  // Load Excel file on mount
  useEffect(() => {
    fetch("/data/fake_filtered_health_data.xlsx")
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
      })
      .catch((err) => setError("Failed to load XLSX file: " + err));
  }, []);

  // Filter and aggregate data
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value || value.length === 0) return true;
          return value.includes(item[key]);
        });
      });
      setFilteredData(filtered);
    }
  }, [data, filters]);

  // Aggregate by Metric
  const aggregatedData = Object.values(
    filteredData.reduce((acc, curr) => {
      const key = curr.Metric;
      const value = parseFloat(curr.Value);
      if (isNaN(value)) return acc;

      if (!acc[key]) {
        acc[key] = { name: key, value: 0 };
      }
      acc[key].value += value;
      return acc;
    }, {})
  );

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (data.length === 0) return <p>Loading data...</p>;
  if (aggregatedData.length === 0) return <p>No data matches the selected filters.</p>;

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={aggregatedData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {aggregatedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

DataPie.propTypes = {
  filters: PropTypes.object, // e.g., { Gender: ['Male'], Age: ['15-49'] }
};

export default DataPie;
