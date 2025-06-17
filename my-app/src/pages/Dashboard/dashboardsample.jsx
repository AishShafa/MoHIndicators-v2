"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Filter, TrendingUp, Calendar, Users, MapPin, Activity, BarChart3, PieChartIcon } from "lucide-react"

// Sample data - replace with actual backend data
const sampleData = [
  { year: "2023", value: 2300, median: 2200, region: "Malé", age: "25-40", gender: "Male" },
  { year: "2024", value: 2600, median: 2500, region: "Addu", age: "19-24", gender: "Female" },
  { year: "2025", value: 2900, median: 2800, region: "Kaafu", age: "41-60", gender: "Male" },
]

export default function HealthDashboard() {
  // Main filter state
  const [filters, setFilters] = useState({
    indicator: null,
    ages: [],
    genders: [],
    years: [],
    regions: [],
    chartType: "bar",
    groupBy: "Year",
  })

  // Temporary filter state for form
  const [tempIndicator, setTempIndicator] = useState(null)
  const [tempAges, setTempAges] = useState([])
  const [tempGenders, setTempGenders] = useState([])
  const [tempYears, setTempYears] = useState([])
  const [tempRegions, setTempRegions] = useState([])
  const [groupBy, setGroupBy] = useState("Year")
  const [chartType, setChartType] = useState("bar")

  // Data state
  const [data, setData] = useState(sampleData)
  const [loading, setLoading] = useState(false)

  // Initialize temp filters from main filters
  useEffect(() => {
    setTempIndicator(filters.indicator || null)
    setTempAges(filters.ages || [])
    setTempGenders(filters.genders || [])
    setTempYears(filters.years || [])
    setTempRegions(filters.regions || [])
    setGroupBy(filters.groupBy || "Year")
    setChartType(filters.chartType || "bar")
  }, [filters])

  // Filter options
  const indicatorOptions = [
    { value: "AllI", label: "All Indicators" },
    { value: "structural", label: "Structural & Policy Determinants" },
    { value: "community", label: "Community & Behavioral Determinants" },
    { value: "clinical", label: "Clinical & Outcome Determinants" },
  ]

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
  ]

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ]

  // Generate year options
  const yearOptions = []
  for (let y = 2025; y >= 1990; y--) {
    yearOptions.push({ value: y.toString(), label: y.toString() })
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
  ]

  const groupByOptions = [
    { value: "Age", label: "Age" },
    { value: "Gender", label: "Gender" },
    { value: "Year", label: "Year" },
    { value: "Region", label: "Region" },
  ]

  // Apply filters function
  const handleApplyFilters = async () => {
    setLoading(true)

    const newFilters = {
      indicator: tempIndicator,
      ages: groupBy !== "Age" ? tempAges : [],
      genders: groupBy !== "Gender" ? tempGenders : [],
      years: groupBy !== "Year" ? tempYears : [],
      regions: tempRegions,
      chartType: chartType,
      groupBy: groupBy,
    }

    setFilters(newFilters)

    // TODO: Replace with actual API call
    try {
      // const response = await fetch('/api/health-data', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newFilters)
      // })
      // const newData = await response.json()
      // setData(newData)

      // Simulate API call
      setTimeout(() => {
        setData(sampleData)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  // Clear filters function
  const handleClearFilters = () => {
    setTempIndicator(null)
    setTempAges([])
    setTempGenders([])
    setTempYears([])
    setTempRegions([])
    setGroupBy("Year")
    setChartType("bar")
  }

  // Multi-select helper functions
  const handleMultiSelectChange = (value, currentValues, setter) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter((item) => item !== value))
    } else {
      setter([...currentValues, value])
    }
  }

  const getSelectedLabel = (selectedValues, options) => {
    if (selectedValues.length === 0) return "Select options"
    if (selectedValues.length === 1) {
      const option = options.find((opt) => opt.value === selectedValues[0])
      return option ? option.label : selectedValues[0]
    }
    return `${selectedValues.length} selected`
  }

  // Chart colors
  const chartColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Health Indicators</h1>
                  <p className="text-sm text-gray-500">Ministry of Health, Republic of Maldives</p>
                </div>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900 bg-transparent border-none">HOME</button>
              <button className="text-gray-600 hover:text-gray-900 bg-transparent border-none">RESULTS</button>
              <button className="text-gray-600 hover:text-gray-900 bg-transparent border-none">ABOUT</button>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded">LOGIN</button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 border rounded bg-white p-4">
              <div className="pb-4 border-b mb-4">
                <div className="flex items-center space-x-2 text-lg font-bold">
                  <Filter className="w-5 h-5 text-emerald-600" />
                  <span>Filters</span>
                </div>
              </div>
              <div className="space-y-6">
                {/* Chart Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Chart Type</label>
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 px-2 py-1 rounded ${chartType === "bar" ? "bg-emerald-500 text-white" : "border"}`}
                      onClick={() => setChartType("bar")}
                    >
                      <BarChart3 className="w-4 h-4 mr-1 inline" /> Bar
                    </button>
                    <button
                      className={`flex-1 px-2 py-1 rounded ${chartType === "line" ? "bg-emerald-500 text-white" : "border"}`}
                      onClick={() => setChartType("line")}
                    >
                      <Activity className="w-4 h-4 mr-1 inline" /> Line
                    </button>
                    <button
                      className={`flex-1 px-2 py-1 rounded ${chartType === "pie" ? "bg-emerald-500 text-white" : "border"}`}
                      onClick={() => setChartType("pie")}
                    >
                      <PieChartIcon className="w-4 h-4 mr-1 inline" /> Pie
                    </button>
                  </div>
                </div>

                {/* Group By Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Group By (X-axis)</label>
                  <select value={groupBy} onChange={e => setGroupBy(e.target.value)} className="w-full border rounded p-1">
                    {groupByOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Indicator Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Indicator</span>
                  </label>
                  <select
                    value={tempIndicator?.value || ""}
                    onChange={e => {
                      const option = indicatorOptions.find(opt => opt.value === e.target.value)
                      setTempIndicator(option)
                    }}
                    className="w-full border rounded p-1"
                  >
                    <option value="">Select Indicator</option>
                    {indicatorOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Age Group Multi-Select */}
                {groupBy !== "Age" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Age Group</span>
                    </label>
                    <div className="border rounded p-2 max-h-32 overflow-y-auto">
                      {ageOptions.map(option => (
                        <label key={option.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={tempAges.includes(option.value)}
                            onChange={() => handleMultiSelectChange(option.value, tempAges, setTempAges)}
                            className="rounded"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gender Multi-Select */}
                {groupBy !== "Gender" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <div className="border rounded p-2 max-h-24 overflow-y-auto">
                      {genderOptions.map(option => (
                        <label key={option.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={tempGenders.includes(option.value)}
                            onChange={() => handleMultiSelectChange(option.value, tempGenders, setTempGenders)}
                            className="rounded"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Year Multi-Select */}
                {groupBy !== "Year" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Year</span>
                    </label>
                    <div className="border rounded p-2 max-h-32 overflow-y-auto">
                      {yearOptions.map(option => (
                        <label key={option.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={tempYears.includes(option.value)}
                            onChange={() => handleMultiSelectChange(option.value, tempYears, setTempYears)}
                            className="rounded"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Region Multi-Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Region</span>
                  </label>
                  <div className="border rounded p-2 max-h-32 overflow-y-auto">
                    {regionOptions.map(option => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tempRegions.includes(option.value)}
                          onChange={() => handleMultiSelectChange(option.value, tempRegions, setTempRegions)}
                          className="rounded"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded"
                    onClick={handleApplyFilters}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Apply Filters"}
                  </button>
                  <button className="w-full border px-4 py-2 rounded" onClick={handleClearFilters}>
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Results</h2>
                <p className="text-gray-600 mt-1">Health indicators data visualization</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded text-sm">Updated Today</span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 shadow-sm rounded p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Records</p>
                    <p className="text-3xl font-bold text-gray-900">{(data.length * 25223).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 shadow-sm rounded p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Average</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.round(data.reduce((acc, item) => acc + item.value, 0) / data.length).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 shadow-sm rounded p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Median</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.round(data.reduce((acc, item) => acc + item.median, 0) / data.length).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Chart Section */}
            <div className="border rounded bg-white">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-xl font-bold">Number by {groupBy}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Grouped by:</span>
                  <span className="border px-2 py-1 rounded text-xs">{groupBy}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="h-96">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">Loading chart data...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "bar" && (
                        <BarChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey={groupBy.toLowerCase()} stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Bar dataKey="value" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                          <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      )}

                      {chartType === "line" && (
                        <LineChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey={groupBy.toLowerCase()} stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="median"
                            stroke="#6366f1"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      )}

                      {chartType === "pie" && (
                        <PieChart>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey={groupBy.toLowerCase()}
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Chart Legend */}
                <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded"></div>
                    <span className="text-sm text-gray-600">Value</span>
                  </div>
                  {chartType === "line" && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-indigo-500 rounded" style={{ borderStyle: "dashed" }}></div>
                      <span className="text-sm text-gray-600">Median</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Data Summary */}
            <div className="border rounded bg-white">
              <div className="p-4 border-b font-bold">Data Summary - Current Selection</div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Count / Sum</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.reduce((acc, item) => acc + item.value, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Percent</p>
                    <p className="text-2xl font-bold text-gray-900">30.30%</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Mean</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(data.reduce((acc, item) => acc + item.value, 0) / data.length).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Median</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(data.reduce((acc, item) => acc + item.median, 0) / data.length).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">© 2025 Ministry of Health, Republic of Maldives. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
