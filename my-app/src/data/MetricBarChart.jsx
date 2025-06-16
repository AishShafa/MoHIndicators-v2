import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";


const omitGroupByFilter = (filters, groupBy) => {
  const newFilters = { ...filters };
  switch (groupBy) {
    case "Age":
      newFilters.ages = [];
      break;
    case "Gender":
      newFilters.genders = [];
      break;
    case "Year":
      newFilters.years = [];
      break;
    case "Region":
      newFilters.regions = [];
      break;
    case "Location":
      newFilters.locations = [];
      break;
    default:
      break;
  }
  return newFilters;
};


// Utility to match filters except the groupBy axis
const matchFilters = (row, filters, excludeKey) => {
  const match = {
    indicator: () => !filters.indicator || row.Indicator === filters.indicator.label,
    ages: () => !filters.ages || filters.ages.length === 0 || filters.ages.some(a => a.value === row.Age),
    genders: () => !filters.genders || filters.genders.length === 0 || filters.genders.some(g => g.value === row.Gender),
    years: () => !filters.years || filters.years.length === 0 || filters.years.some(y => y.value == row.Year),
    regions: () =>
  !filters.regions ||
  filters.regions.length === 0 ||
  filters.regions.some(r => r.value.toLowerCase() === (row.Region || "").toLowerCase()),

  };

  return Object.entries(match).every(([key, fn]) => (key === excludeKey ? true : fn()));
};


// Helper to calculate median
const median = (arr) => {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

const metricOptions = [
  { key: "Value", label: "Count / Sum" },
  { key: "Percent", label: "Percent (%)" },
  { key: "Mean", label: "Mean" },
  { key: "Median", label: "Median" },
];

const groupByOptions = [
  "Age", "Gender", "Region", "Year"
];

export default function MetricBarChart({ data, filters, selectedMetricType }) {
  const [selectedMetric, setSelectedMetric] = useState("Value");
  const [groupBy, setGroupBy] = useState("Location");

  if (!data || !Array.isArray(data)) return null;

  // Step 1: Filter data while excluding the groupBy field from filters
  const filtered = data.filter(row => {
    const metric = (row.Metric || "").toLowerCase();
    const isMetricMatch =
      selectedMetricType === "Number"
        ? !metric.includes("percent") && !metric.includes("rate")
        : selectedMetricType === "Percent"
        ? metric.includes("percent") || metric.includes("%")
        : metric.includes("rate");

    return isMetricMatch && matchFilters(row, filters, groupBy.toLowerCase() + "s");
  });

  if (filtered.length === 0) {
    return <p className="p-4">No data matching the filters.</p>;
  }

  const allValues = filtered.map(row => parseFloat(row.Value) || 0);
  const sumValues = allValues.reduce((a, b) => a + b, 0);
  const meanValue = allValues.length ? sumValues / allValues.length : 0;
  const medianValue = median(allValues);

  // Step 2: Aggregate by selected groupBy
  const groupedData = {};
  filtered.forEach(row => {
    const key = row[groupBy] || "Unknown";
    const val = parseFloat(row.Value) || 0;
    if (!groupedData[key]) groupedData[key] = { total: 0, values: [] };
    groupedData[key].total += val;
    groupedData[key].values.push(val);
  });

  const chartData = Object.entries(groupedData).map(([key, { total, values }]) => ({
    [groupBy]: key,
    Value: total,
    Percent: sumValues ? (total / sumValues) * 100 : 0,
    Mean: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
    Median: median(values),
  }));

  // Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white border border-gray-300 p-3 rounded">
        <strong>{groupBy}: {label}</strong><br />
        <span>Count / Sum: {item.Value.toFixed(2)}</span><br />
        <span>Percent: {item.Percent.toFixed(2)}%</span><br />
        <span>Mean: {item.Mean.toFixed(2)}</span><br />
        <span>Median: {item.Median.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-2">
        {selectedMetricType} by {groupBy}
      </h3>

      {/* Select groupBy */}
      <div className="mb-4 flex flex-wrap gap-3">
        <label className="font-medium">Group X-axis by:</label>
        <select
          value={groupBy}
          onChange={e => setGroupBy(e.target.value)}
          className="px-3 py-1 border rounded bg-gray-100"
        >
          {groupByOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Metric type selector */}
      <div className="mb-4 flex flex-wrap gap-3">
        {metricOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setSelectedMetric(opt.key)}
            className={`px-3 py-1 rounded ${
              selectedMetric === opt.key
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={groupBy} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey={selectedMetric}
            fill="#10b981"
            name={metricOptions.find(m => m.key === selectedMetric)?.label || selectedMetric}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Overall Summary */}
      <div className="mt-4 text-sm text-gray-700">
        <p><strong>Overall Mean:</strong> {meanValue.toFixed(2)}</p>
        <p><strong>Overall Median:</strong> {medianValue.toFixed(2)}</p>
      </div>
    </div>
  );
}
