import React from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const RechartsViewer = ({ 
  chartConfig, 
  data, 
  width = '100%', 
  height = 300 
}) => {
  if (!chartConfig || !data || data.length === 0) {
    return (
      <div className="chart-placeholder" style={{ 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        color: '#6b7280'
      }}>
        <p>No data available for chart, please upload the data from the main form.</p>
      </div>
    );
  }

  const {
    type = 'bar',
    title = '',
    xAxisLabel = '',
    yAxisLabel = '',
    xAxis = '', // Alternative field name for x-axis label
    yAxis = '', // Alternative field name for y-axis label
    color = '#10b981',
    secondaryColor = '#059669',
    backgroundColor = '#ffffff',
    gridLines = 'true',
    legendPosition = 'top',
    animation = 'true',
    borderWidth = 2,
    opacity = 1,
    columnMapping = {},
    grouping = { enabled: false, groupBy: 'x', aggregateFunction: 'sum' }
  } = chartConfig;

  // Use xAxis/yAxis if xAxisLabel/yAxisLabel are not provided
  const finalXAxisLabel = xAxisLabel || xAxis;
  const finalYAxisLabel = yAxisLabel || yAxis;

  // Process data based on column mapping
  let processedData = data.map((item, index) => {
    const result = { index };
    
    if (columnMapping.xAxis && columnMapping.yAxis) {
      result.x = item[columnMapping.xAxis];
      result.y = parseFloat(item[columnMapping.yAxis]) || 0;
      result.name = item[columnMapping.xAxis];
      result.value = parseFloat(item[columnMapping.yAxis]) || 0;
    } else {
      // Fallback to first two columns
      const keys = Object.keys(item);
      if (keys.length >= 2) {
        result.x = item[keys[0]];
        result.y = parseFloat(item[keys[1]]) || 0;
        result.name = item[keys[0]];
        result.value = parseFloat(item[keys[1]]) || 0;
      }
    }
    
    return result;
  });

  // Apply grouping if enabled
  if (grouping.enabled && processedData.length > 0) {
    const grouped = {};
    
    processedData.forEach(item => {
      const key = grouping.groupBy === 'x' ? item.x : item.y;
      if (!grouped[key]) {
        grouped[key] = {
          values: [],
          count: 0,
          items: []
        };
      }
      
      grouped[key].values.push(item.value);
      grouped[key].items.push(item);
      grouped[key].count++;
    });
    
    // Apply aggregation function
    processedData = Object.keys(grouped).map(key => {
      const group = grouped[key];
      let aggregatedValue = 0;
      
      if (group.values.length > 0) {
        switch (grouping.aggregateFunction) {
          case 'sum':
            aggregatedValue = group.values.reduce((a, b) => a + b, 0);
            break;
          case 'average':
            aggregatedValue = group.values.reduce((a, b) => a + b, 0) / group.values.length;
            break;
          case 'max':
            aggregatedValue = Math.max(...group.values);
            break;
          case 'min':
            aggregatedValue = Math.min(...group.values);
            break;
          case 'count':
            aggregatedValue = group.count;
            break;
          default:
            aggregatedValue = group.values.reduce((a, b) => a + b, 0);
        }
      }
      
      const firstItem = group.items[0];
      return {
        x: grouping.groupBy === 'x' ? key : firstItem.x,
        y: grouping.groupBy === 'y' ? key : aggregatedValue,
        name: grouping.groupBy === 'x' ? key : firstItem.name,
        value: aggregatedValue,
        originalCount: group.count,
        groupedValues: group.values
      };
    });
  }

  const chartProps = {
    width: '100%',
    height,
    data: processedData,
    margin: { top: 20, right: 30, left: 20, bottom: 60 }
  };

  const commonAxisProps = {
    axisLine: true,
    tickLine: true,
    tick: { fontSize: 12 }
  };

  const gridProps = gridLines === 'true' ? {
    strokeDasharray: '3 3',
    stroke: '#e5e7eb'
  } : false;

  // For single data series charts, default to no legend unless explicitly set
  const shouldShowLegend = legendPosition === 'top' || legendPosition === 'bottom' || 
                          legendPosition === 'left' || legendPosition === 'right';
  
  const legendProps = shouldShowLegend ? {
    wrapperStyle: { paddingTop: '20px' },
    iconType: 'circle'
  } : false;

  const tooltipProps = {
    contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
  };

  const animationProps = animation === 'true' ? {
    animationBegin: 0,
    animationDuration: 800
  } : {
    animationDuration: 0
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipProps.contentStyle}>
          <p style={{ margin: '4px 0', fontWeight: 'bold' }}>{`${finalXAxisLabel || 'X'}: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color }}>
              {`${finalYAxisLabel || 'Y'}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            {gridProps && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey="x" 
              {...commonAxisProps}
              label={finalXAxisLabel ? { value: finalXAxisLabel, position: 'insideBottom', offset: -5 } : null}
            />
            <YAxis 
              {...commonAxisProps}
              label={finalYAxisLabel ? { value: finalYAxisLabel, angle: -90, position: 'insideLeft' } : null}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Only show legend if explicitly requested for single series charts */}
            {shouldShowLegend && <Legend {...legendProps} />}
            <Bar 
              dataKey="y" 
              fill={color} 
              opacity={opacity}
              strokeWidth={borderWidth}
              stroke={secondaryColor}
              name={finalYAxisLabel || 'Value'}
              {...animationProps}
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...chartProps}>
            {gridProps && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey="x" 
              {...commonAxisProps}
              label={finalXAxisLabel ? { value: finalXAxisLabel, position: 'insideBottom', offset: -5 } : null}
            />
            <YAxis 
              {...commonAxisProps}
              label={finalYAxisLabel ? { value: finalYAxisLabel, angle: -90, position: 'insideLeft' } : null}
            />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend {...legendProps} />}
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke={color} 
              strokeWidth={borderWidth}
              strokeOpacity={opacity}
              dot={{ fill: secondaryColor, strokeWidth: 2, r: 4 }}
              name={finalYAxisLabel || 'Value'}
              {...animationProps}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...chartProps}>
            {gridProps && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey="x" 
              {...commonAxisProps}
              label={finalXAxisLabel ? { value: finalXAxisLabel, position: 'insideBottom', offset: -5 } : null}
            />
            <YAxis 
              {...commonAxisProps}
              label={finalYAxisLabel ? { value: finalYAxisLabel, angle: -90, position: 'insideLeft' } : null}
            />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend {...legendProps} />}
            <Area 
              type="monotone" 
              dataKey="y" 
              stroke={color} 
              fill={color}
              fillOpacity={opacity * 0.6}
              strokeWidth={borderWidth}
              name={finalYAxisLabel || 'Value'}
              {...animationProps}
            />
          </AreaChart>
        );

      case 'pie':
        const COLORS = [color, secondaryColor, '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return (
          <PieChart {...chartProps}>
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend {...legendProps} />}
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height * 0.3, 80)}
              fill={color}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              {...animationProps}
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  opacity={opacity}
                />
              ))}
            </Pie>
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...chartProps}>
            {gridProps && <CartesianGrid {...gridProps} />}
            <XAxis 
              type="number" 
              dataKey="x" 
              {...commonAxisProps}
              label={finalXAxisLabel ? { value: finalXAxisLabel, position: 'insideBottom', offset: -5 } : null}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              {...commonAxisProps}
              label={finalYAxisLabel ? { value: finalYAxisLabel, angle: -90, position: 'insideLeft' } : null}
            />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend {...legendProps} />}
            <Scatter 
              data={processedData} 
              fill={color}
              opacity={opacity}
              {...animationProps}
            />
          </ScatterChart>
        );

      case 'radar':
        return (
          <RadarChart {...chartProps}>
            <PolarGrid />
            <PolarAngleAxis dataKey="x" />
            <PolarRadiusAxis />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend {...legendProps} />}
            <Radar
              name="Data"
              dataKey="y"
              stroke={color}
              fill={color}
              fillOpacity={opacity * 0.6}
              strokeWidth={borderWidth}
              {...animationProps}
            />
          </RadarChart>
        );

      case 'table':
        // Check if "Show All Columns" option is enabled
        const showAllColumns = chartConfig.showAllColumns;
        
        if (showAllColumns && data.length > 0) {
          // Get all column names from the first data row
          const allColumns = Object.keys(data[0]);
          
          return (
            <div className="data-table-all-columns" style={{ width: '100%', height: '100%' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                border: 'none'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    {allColumns.map((column, index) => (
                      <th key={column} style={{ 
                        padding: '12px 16px', 
                        borderBottom: '2px solid #e5e7eb',
                        borderRight: index < allColumns.length - 1 ? '1px solid #e5e7eb' : 'none',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px',
                        minWidth: '120px'
                      }}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ 
                      backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f9fafb',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      {allColumns.map((column, colIndex) => (
                        <td key={column} style={{ 
                          padding: '12px 16px',
                          borderRight: colIndex < allColumns.length - 1 ? '1px solid #f3f4f6' : 'none',
                          fontSize: '14px',
                          color: '#374151',
                          fontWeight: typeof row[column] === 'number' ? '500' : 'normal'
                        }}>
                          {typeof row[column] === 'number' ? 
                            row[column].toLocaleString() : 
                            String(row[column] || '')
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length === 0 && (
                <div style={{ 
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#6b7280',
                  backgroundColor: '#f9fafb',
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  marginTop: '8px'
                }}>
                  <p>No data available to display in table</p>
                </div>
              )}
            </div>
          );
        }
        
        // Default table view with X and Y columns only
        return (
          <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ 
                    padding: '12px 16px', 
                    borderBottom: '2px solid #e5e7eb',
                    borderRight: '1px solid #e5e7eb',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {finalXAxisLabel || 'Category'}
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    borderBottom: '2px solid #e5e7eb',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {finalYAxisLabel || 'Value'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((item, index) => (
                  <tr key={index} style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <td style={{ 
                      padding: '12px 16px',
                      borderRight: '1px solid #f3f4f6',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {item.x}
                    </td>
                    <td style={{ 
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: typeof item.y === 'number' ? '500' : 'normal'
                    }}>
                      {typeof item.y === 'number' ? item.y.toLocaleString() : item.y}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {processedData.length === 0 && (
              <div style={{ 
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6b7280',
                backgroundColor: '#f9fafb',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                marginTop: '8px'
              }}>
                <p>No data available to display in table</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div style={{ 
            height, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#ef4444' 
          }}>
            Unsupported chart type: {type}
          </div>
        );
    }
  };

  return (
    <div style={{ 
      backgroundColor, 
      padding: '16px', 
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      width: '100%',
      minWidth: '500px'
    }}>
      {title && (
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '18px', 
          fontWeight: '600',
          textAlign: 'center',
          color: '#1f2937'
        }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width={width} height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsViewer;
