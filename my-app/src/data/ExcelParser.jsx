import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import MetricBarChart from "../data/MetricBarChart"
import sampleExcel from "../data/fake_filtered_health_data.xlsx"

export default function ExcelParser({ filters }) {
  const [data, setData] = useState([]);
  const [selectedMetricType, setSelectedMetricType] = useState("Number");

  useEffect(() => {
    const loadExcel = async () => {
      const res = await fetch(sampleExcel);
      const arrayBuffer = await res.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(sheet);
      setData(parsed);
    };

    loadExcel();
  }, []);

  const handleMetricChange = (type) => setSelectedMetricType(type);

  return (
    <div>

      {/* Chart */}
      <MetricBarChart
        data={data}
        filters={filters}
        selectedMetricType={selectedMetricType}
        groupBy={filters.groupBy || "Region"}
      />
    </div>
  );
}
