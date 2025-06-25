import React, { useState, useRef } from "react";

import Chart from "react-apexcharts";
import ChartFilter from "../../../components/Filter/ChartFilter";
import Maps from "../Maps/Maps";

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    indicator: null,
    metrics: [],
    locations: [],
    ages: [],
    genders: [],
    years: [],
    regions: [],
    chartType: "list",  // default chart type
    groupBy: "Region",
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  const chartCategories =
    filters.years.length > 0
      ? filters.years.map((y) => y.value.toString())
      : ["2023", "2024", "2025"];

  const chartData = chartCategories.map(() =>
    Math.floor(2000 + Math.random() * 1000)
  );

  return (
    <div id="webcrumbs">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-6 mt-6">
            {/* Sidebar Filter */}
            <div className="col-span-12 md:col-span-3">
              <ChartFilter
                isOpen={isOpen}
                toggleMenu={toggleMenu}
                filters={filters}
                setFilters={setFilters}
              />
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-9">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold mb-1">
                    {filters.indicator?.label || "Results"}
                  </h2>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Grouped by:</span>
                    <select
                      className="text-sm font-medium border rounded px-2 py-1"
                      value={filters.groupBy}
                      onChange={(e) =>
                        setFilters({ ...filters, groupBy: e.target.value })
                      }
                    >
                      <option value="Region">Region</option>
                      <option value="Age">Age</option>
                      <option value="Gender">Gender</option>
                      <option value="Year">Year</option>
                    </select>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Health indicators data visualization
                </p>

                <div className="h-[400px]">
                  <Maps />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;