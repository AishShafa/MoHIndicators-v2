import React from "react"
import Chart from "react-apexcharts"
import "./dashboardsample.css"


export const dashboardsample = () => {
    return (
        <div id="webcrumbs">
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4">
                    {/* Main Content */}
                    <div className="grid grid-cols-12 gap-6 mt-6">
                        {/* Sidebar */}
                        <div className="col-span-12 md:col-span-3">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-center mb-4">
                                    <svg
                                        className="w-5 h-5 text-emerald-500 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                        />
                                    </svg>
                                    <h2 className="font-medium">Filters</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm mb-2">Chart Type</p>
                                        <div className="flex gap-1">
                                            <button className="bg-gray-900 text-white px-3 py-1 text-sm rounded-md">
                                                Bar
                                            </button>
                                            <button className="flex items-center px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100">
                                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M3 12H6L9 3L15 21L18 12H21"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Line
                                            </button>
                                            <button className="flex items-center px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100">
                                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="8"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    />
                                                    <path
                                                        d="M12 4V12L16 16"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                Pie
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm mb-2">Group By (X-axis)</p>
                                        <div className="relative">
                                            <select className="w-full p-2 text-sm border border-gray-200 rounded-md appearance-none pr-8">
                                                <option>Year</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-2">
                                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M3 12H6L9 3L15 21L18 12H21"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <p className="text-sm">Indicator</p>
                                        </div>
                                        <div className="relative">
                                            <select className="w-full p-2 text-sm border border-gray-200 rounded-md appearance-none pr-8">
                                                <option>Select Indicator</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-2">
                                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <circle
                                                    cx="9"
                                                    cy="7"
                                                    r="4"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M23 21v-2a4 4 0 00-3-3.87"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M16 3.13a4 4 0 010 7.75"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <p className="text-sm">Age Group</p>
                                        </div>
                                        <div className="relative">
                                            <select className="w-full p-2 text-sm border border-gray-200 rounded-md appearance-none pr-8">
                                                <option>Select options</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm mb-2">Gender</p>
                                        <div className="relative">
                                            <select className="w-full p-2 text-sm border border-gray-200 rounded-md appearance-none pr-8">
                                                <option>Select options</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-2">
                                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="10"
                                                    r="3"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <p className="text-sm">Region</p>
                                        </div>
                                        <div className="relative">
                                            <select className="w-full p-2 text-sm border border-gray-200 rounded-md appearance-none pr-8">
                                                <option>Select options</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-emerald-500 text-white py-2 rounded-md font-medium hover:bg-emerald-600 transition">
                                        Apply Filters
                                    </button>
                                    <button className="w-full text-gray-600 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition">
                                        Clear Selection
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-12 md:col-span-9">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Results</h2>
                                <p className="text-gray-600 mb-4">Health indicators data visualization</p>

                                <div className="absolute right-0 top-0 mt-4 mr-4">
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        Updated Today
                                    </span>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Total Records</p>
                                            <h3 className="text-2xl font-bold">75,669</h3>
                                        </div>
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M8 10L12 14L16 10"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M12 14V3"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M20 21H4"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Average</p>
                                            <h3 className="text-2xl font-bold">2,600</h3>
                                        </div>
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M3 12H6L9 3L15 21L18 12H21"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Median</p>
                                            <h3 className="text-2xl font-bold">2,500</h3>
                                        </div>
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <circle
                                                    cx="9"
                                                    cy="7"
                                                    r="4"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M23 21v-2a4 4 0 00-3-3.87"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M16 3.13a4 4 0 010 7.75"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium">Number by Year</h3>
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500 mr-2">Grouped by:</span>
                                            <span className="text-sm font-medium">Year</span>
                                        </div>
                                    </div>

                                    <div className="h-64">
                                        <Chart
                                            type="bar"
                                            height={250}
                                            width="100%"
                                            series={[
                                                {
                                                    name: "Value",
                                                    data: [2200, 1800, 2400]
                                                }
                                            ]}
                                            options={{
                                                chart: {
                                                    toolbar: {
                                                        show: false
                                                    },
                                                    zoom: {
                                                        enabled: false
                                                    }
                                                },
                                                xaxis: {
                                                    categories: ["2023", "2024", "2025"]
                                                },
                                                yaxis: {
                                                    min: 0,
                                                    max: 3000,
                                                    tickAmount: 4
                                                },
                                                colors: ["#10b981"],
                                                plotOptions: {
                                                    bar: {
                                                        borderRadius: 3
                                                    }
                                                },
                                                dataLabels: {
                                                    enabled: false
                                                },
                                                grid: {
                                                    borderColor: "#f3f4f6",
                                                    strokeDashArray: 4
                                                }
                                            }}
                                        />
                                        {/* Next: "Add interactive hover effects to the chart bars" */}
                                    </div>

                                    <div className="flex items-center justify-center mt-4">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
                                            <span className="text-sm">Value</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default dashboardsample;