// Required dependencies:
// npm install xlsx recharts

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  PieChart, Pie, Cell,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#f87171', '#34d399', '#facc15'];

const groupAge = (age) => {
  if (!age || typeof age !== 'string') return age;
  const ageStart = parseInt(age.split('-')[0]);
  if (isNaN(ageStart)) return age;
  if (ageStart < 20) return 'Under 20';
  if (ageStart < 30) return '20–29';
  if (ageStart < 40) return '30–39';
  if (ageStart < 50) return '40–49';
  if (ageStart < 60) return '50–59';
  return '60+';
};

const groupYear = (year) => {
  const y = parseInt(year);
  if (isNaN(y)) return year;
  return `${Math.floor(y / 10) * 10}s`;
};

const ExcelChartDashboard = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [groupBy, setGroupBy] = useState('Indicator');
  const [valueColumn, setValueColumn] = useState('Value');
  const [filters, setFilters] = useState({});

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      let jsonData = XLSX.utils.sheet_to_json(ws);

      // Add grouped fields
      jsonData = jsonData.map(row => ({
        ...row,
        AgeGroup: groupAge(row.Age),
        YearGroup: groupYear(row.Year),
      }));

      setData(jsonData);
      setColumns(Object.keys(jsonData[0]));
    };
    reader.readAsBinaryString(file);
  };

  const uniqueValues = (key) => {
    return [...new Set(data.map(row => row[key]))];
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const isNumeric = (val) => !isNaN(parseFloat(val)) && isFinite(val);

  const numericCols = columns.filter(col =>
    data.every(row => isNumeric(row[col]))
  );

  const stringCols = columns.filter(col =>
    !numericCols.includes(col)
  );

  const filteredData = data.filter(row => {
    return Object.entries(filters).every(([key, value]) => {
      return value === '' || row[key] === value;
    });
  });

  const pieData = () => {
    const grouped = {};
    for (let row of filteredData) {
      const key = row[groupBy];
      const value = parseFloat(row[valueColumn]) || 0;
      grouped[key] = (grouped[key] || 0) + value;
    }
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">🥧 Excel Pie Chart Dashboard</h1>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />

      {columns.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {["AgeGroup", "Gender", "YearGroup", "Metric", "Region"].filter(col => columns.includes(col.replace('Group','')) || col === 'AgeGroup' || col === 'YearGroup').map((col) => (
            <div key={col}>
              <label className="font-semibold">{col}</label>
              <select className="w-full p-1 rounded bg-white" onChange={(e) => handleFilterChange(col, e.target.value)}>
                <option value="">All</option>
                {uniqueValues(col).map((val, i) => (
                  <option key={i} value={val}>{val}</option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label className="font-semibold">Group By</label>
            <select className="w-full p-1 rounded bg-white" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              {stringCols.map((col, i) => <option key={i} value={col}>{col}</option>)}
            </select>
          </div>

          <div>
            <label className="font-semibold">Value Column</label>
            <select className="w-full p-1 rounded bg-white" value={valueColumn} onChange={(e) => setValueColumn(e.target.value)}>
              {numericCols.map((col, i) => <option key={i} value={col}>{col}</option>)}
            </select>
          </div>
        </div>
      )}

      {filteredData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {pieData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExcelChartDashboard;
