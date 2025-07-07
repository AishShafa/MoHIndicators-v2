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
  height = 300,
  isPublicView = false
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
    accentColor = '#f59e0b',
    highlightColor = '#ef4444',
    backgroundColor = '#ffffff',
    textColor = '#374151',
    gridColor = '#e5e7eb',
    borderColor = '#d1d5db',
    gridLines = 'true',
    legendPosition = 'top',
    animation = 'true',
    borderWidth = 2,
    opacity = 1,
    padding = 20,
    columnMapping = {},
    grouping = { enabled: false, groupBy: 'x', aggregateFunction: 'sum' },
    barColors = [], // Individual bar colors for bar charts
    pieColors = [], // Individual section colors for pie charts
    tableHeaderColor = '#f8f9fa',
    tableRowColor = '#ffffff',
    tableAlternateRowColor = '#f9fafb',
    isDonut = false, // Toggle for pie charts to become donut charts
    showLabels = true, // Show/hide chart labels
    showLegend = false, // Show/hide chart legend
    labelFormat = 'percentage', // 'percentage', 'numbers', 'both', or 'name'
    chartWidth = 600, // Chart width in pixels
    chartHeight = 400, // Chart height in pixels
    showLabelLines = false, // Show lines connecting labels to pie sections
    pieChartSize = 0.3 // Pie chart radius as percentage of container (0.1 to 0.5)
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
    width: chartWidth,
    height: chartHeight,
    data: processedData,
    margin: { top: padding, right: padding, left: padding, bottom: 60 + padding },
    style: { backgroundColor }
  };

  const commonAxisProps = {
    axisLine: { stroke: borderColor },
    tickLine: { stroke: borderColor },
    tick: { fontSize: 12, fill: textColor }
  };

  const gridProps = gridLines === 'true' ? {
    strokeDasharray: '3 3',
    stroke: gridColor
  } : false;

  // For single data series charts, default to no legend unless explicitly set
  const shouldShowLegend = legendPosition === 'top' || legendPosition === 'bottom' || 
                          legendPosition === 'left' || legendPosition === 'right';
  
  const legendProps = shouldShowLegend ? {
    verticalAlign: legendPosition === 'top' ? 'top' : legendPosition === 'bottom' ? 'bottom' : 'middle',
    align: legendPosition === 'left' ? 'left' : legendPosition === 'right' ? 'right' : 'center',
    layout: legendPosition === 'left' || legendPosition === 'right' ? 'vertical' : 'horizontal',
    wrapperStyle: { 
      paddingTop: legendPosition === 'top' ? '0px' : legendPosition === 'bottom' ? '20px' : '0px',
      paddingLeft: legendPosition === 'left' ? '0px' : '0px',
      paddingRight: legendPosition === 'right' ? '0px' : '0px'
    },
    iconType: 'circle'
  } : false;

  const tooltipProps = {
    contentStyle: {
      backgroundColor: backgroundColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      color: textColor
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
        <div style={{
          ...tooltipProps.contentStyle,
          padding: '8px 12px'
        }}>
          <p style={{ margin: '4px 0', fontWeight: 'bold', color: textColor }}>{`${finalXAxisLabel || 'X'}: ${label}`}</p>
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

  // Color palette for multi-colored charts
  const COLORS = [color, secondaryColor, accentColor, highlightColor, '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  // Function to get color for a specific bar index
  const getBarColor = (index) => {
    // Use custom bar color if provided, otherwise fall back to palette
    return barColors[index] || COLORS[index % COLORS.length];
  };

  // Function to get color for a specific pie section
  const getPieColor = (index) => {
    // Use custom pie color if provided, otherwise fall back to palette
    return pieColors[index] || COLORS[index % COLORS.length];
  };

  // Custom label function for pie charts with advanced collision avoidance and optional label lines
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name, index }) => {
    if (!showLabels) return null;

    const RADIAN = Math.PI / 180;
    const totalSlices = processedData.length;
    
    // Dynamic label distance based on number of slices and whether label lines are enabled
    let labelDistance = showLabelLines ? 80 : 45; // More distance when using label lines
    if (totalSlices > 12) labelDistance = showLabelLines ? 100 : 60;
    else if (totalSlices > 8) labelDistance = showLabelLines ? 90 : 50;
    else if (totalSlices > 5) labelDistance = showLabelLines ? 80 : 40;
    
    // Advanced angle adjustment for collision avoidance
    let adjustedAngle = midAngle;
    
    // For charts with many slices, use smarter distribution
    if (totalSlices > 6 && !showLabelLines) {
      // Only apply collision avoidance when not using label lines
      const anglePerSlice = 360 / totalSlices;
      
      // Apply staggered positioning for dense charts
      if (totalSlices > 10) {
        // Alternate between inner and outer label rings
        const isOuterRing = index % 2 === 0;
        labelDistance = isOuterRing ? labelDistance + 20 : labelDistance;
        
        // Add small angular offset to reduce overlap
        const offsetDirection = index % 4 < 2 ? 1 : -1;
        adjustedAngle = midAngle + (offsetDirection * Math.min(8, anglePerSlice * 0.3));
      } else {
        // For medium density, just add small offsets
        const offsetDirection = index % 2 === 0 ? 1 : -1;
        adjustedAngle = midAngle + (offsetDirection * Math.min(5, anglePerSlice * 0.2));
      }
    }
    
    // Calculate final position
    const finalRadius = outerRadius + labelDistance + (isDonut ? 15 : 0);
    const x = cx + finalRadius * Math.cos(-adjustedAngle * RADIAN);
    const y = cy + finalRadius * Math.sin(-adjustedAngle * RADIAN);

    // Format label based on labelFormat
    let labelText = '';
    switch (labelFormat) {
      case 'percentage':
        labelText = `${(percent * 100).toFixed(1)}%`;
        break;
      case 'numbers':
        labelText = value.toLocaleString();
        break;
      case 'both':
        labelText = `${name} ${(percent * 100).toFixed(1)}%`;
        break;
      case 'name':
        labelText = name;
        break;
      case 'name_numbers':
        labelText = `${name} ${value.toLocaleString()}`;
        break;
      default:
        labelText = `${name} ${(percent * 100).toFixed(1)}%`;
    }

    // Smart text anchor and positioning
    const isRightSide = x > cx;
    const textAnchor = isRightSide ? 'start' : 'end';
    
    // Dynamic label length based on available space
    let maxLabelLength = showLabelLines ? 25 : 20; // Longer labels allowed with label lines
    if (totalSlices <= 5) maxLabelLength = showLabelLines ? 35 : 30;
    else if (totalSlices <= 8) maxLabelLength = showLabelLines ? 30 : 25;
    else if (totalSlices > 15) maxLabelLength = showLabelLines ? 20 : 15;
    
    if (labelText.length > maxLabelLength) {
      labelText = labelText.substring(0, maxLabelLength - 3) + '...';
    }
    
    // For very dense charts without label lines, consider hiding some labels
    if (totalSlices > 20 && percent < 0.03 && !showLabelLines) {
      return null; // Hide labels for very small slices in dense charts
    }

    // Render label line if enabled
    const labelLineElement = showLabelLines ? (
      <line
        x1={cx + (outerRadius + 5) * Math.cos(-midAngle * RADIAN)}
        y1={cy + (outerRadius + 5) * Math.sin(-midAngle * RADIAN)}
        x2={x}
        y2={y}
        stroke={textColor}
        strokeWidth={1}
        strokeOpacity={0.6}
        style={{ pointerEvents: 'none' }}
      />
    ) : null;
    
    return (
      <g key={`label-group-${index}`}>
        {labelLineElement}
        <text 
          x={x} 
          y={y} 
          fill={textColor} 
          textAnchor={textAnchor} 
          dominantBaseline="central"
          fontSize={totalSlices > 12 ? "10" : "11"}
          fontWeight="500"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15))',
            pointerEvents: 'none'
          }}
        >
          {labelText}
        </text>
      </g>
    );
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
              label={finalXAxisLabel ? { 
                value: finalXAxisLabel, 
                position: 'insideBottom', 
                offset: -5,
                style: { textAnchor: 'middle', fill: textColor }
              } : null}
            />
            <YAxis 
              {...commonAxisProps}
              label={finalYAxisLabel ? { 
                value: finalYAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: textColor }
              } : null}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Only show legend if explicitly requested for single series charts */}
            {shouldShowLegend && <Legend {...legendProps} />}
            <Bar 
              dataKey="y" 
              opacity={opacity}
              strokeWidth={borderWidth}
              stroke={borderColor}
              name={finalYAxisLabel || 'Value'}
              {...animationProps}
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(index)}
                />
              ))}
            </Bar>
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...chartProps}>
            {gridProps && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey="x" 
              {...commonAxisProps}
              label={finalXAxisLabel ? { 
                value: finalXAxisLabel, 
                position: 'insideBottom', 
                offset: -5,
                style: { textAnchor: 'middle', fill: textColor }
              } : null}
            />
            <YAxis 
              {...commonAxisProps}
              label={finalYAxisLabel ? { 
                value: finalYAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: textColor }
              } : null}
            />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend {...legendProps} />}
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke={color} 
              strokeWidth={borderWidth}
              strokeOpacity={opacity}
              dot={{ fill: highlightColor, strokeWidth: 2, r: 4, stroke: borderColor }}
              activeDot={{ r: 6, fill: accentColor, stroke: borderColor, strokeWidth: 2 }}
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
              label={finalXAxisLabel ? { 
                value: finalXAxisLabel, 
                position: 'insideBottom', 
                offset: -5,
                style: { textAnchor: 'middle', fill: textColor }
              } : null}
            />
            <YAxis 
              {...commonAxisProps}
              label={finalYAxisLabel ? { 
                value: finalYAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: textColor }
              } : null}
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
              dot={{ fill: highlightColor, strokeWidth: 2, r: 3, stroke: borderColor }}
              activeDot={{ r: 5, fill: accentColor, stroke: borderColor, strokeWidth: 2 }}
              name={finalYAxisLabel || 'Value'}
              {...animationProps}
            />
          </AreaChart>
        );

      case 'pie':
        // Calculate pie chart dimensions with proper padding
        const piePadding = padding || 20;
        const availableWidth = chartWidth - (piePadding * 2);
        const availableHeight = chartHeight - (piePadding * 2);
        
        // Adjust for legend space if legend is shown
        let legendSpace = 0;
        if (showLegend) {
          if (legendPosition === 'top' || legendPosition === 'bottom') {
            legendSpace = 40; // Space for horizontal legend
          } else if (legendPosition === 'left' || legendPosition === 'right') {
            legendSpace = 120; // Space for vertical legend
          }
        }
        
        // Calculate effective chart area
        const effectiveWidth = legendPosition === 'left' || legendPosition === 'right' 
          ? availableWidth - legendSpace 
          : availableWidth;
        const effectiveHeight = legendPosition === 'top' || legendPosition === 'bottom' 
          ? availableHeight - legendSpace 
          : availableHeight;
        
        // Calculate pie radius based on available space and pieChartSize setting
        const maxRadius = Math.min(effectiveWidth, effectiveHeight) / 2;
        const pieRadius = Math.max(50, maxRadius * pieChartSize);
        
        // Calculate center position with padding
        const centerX = legendPosition === 'left' ? '60%' : legendPosition === 'right' ? '40%' : '50%';
        const centerY = legendPosition === 'top' ? '60%' : legendPosition === 'bottom' ? '40%' : '50%';
        
        return (
          <PieChart {...chartProps}>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend {...legendProps} />}
            <Pie
              data={processedData}
              cx={centerX}
              cy={centerY}
              innerRadius={isDonut ? Math.max(20, pieRadius * 0.4) : 0}
              outerRadius={pieRadius}
              fill={color}
              dataKey="value"
              label={showLabels ? renderPieLabel : false}
              labelLine={showLabelLines}
              {...animationProps}
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getPieColor(index)}
                  opacity={opacity}
                  stroke={borderColor}
                  strokeWidth={processedData.length > 10 ? 0.5 : 1}
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
              label={finalXAxisLabel ? { 
                value: finalXAxisLabel, 
                position: 'insideBottom', 
                offset: -5,
                style: { textAnchor: 'middle', fill: textColor }
              } : null}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              {...commonAxisProps}
              label={finalYAxisLabel ? { 
                value: finalYAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: textColor }
              } : null}
            />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend {...legendProps} />}
            <Scatter 
              data={processedData} 
              opacity={opacity}
              stroke={borderColor}
              strokeWidth={1}
              {...animationProps}
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Scatter>
          </ScatterChart>
        );

      case 'radar':
        return (
          <RadarChart {...chartProps}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis dataKey="x" tick={{ fill: textColor, fontSize: 12 }} />
            <PolarRadiusAxis tick={{ fill: textColor, fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend {...legendProps} />}
            <Radar
              name="Data"
              dataKey="y"
              stroke={color}
              fill={color}
              fillOpacity={opacity * 0.6}
              strokeWidth={borderWidth}
              dot={{ fill: highlightColor, strokeWidth: 1, r: 3 }}
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
                  <tr style={{ backgroundColor: tableHeaderColor }}>
                    {allColumns.map((column, index) => (
                      <th key={column} style={{ 
                        padding: '12px 16px', 
                        borderBottom: `2px solid ${borderColor}`,
                        borderRight: index < allColumns.length - 1 ? `1px solid ${gridColor}` : 'none',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: textColor,
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
                      backgroundColor: rowIndex % 2 === 0 ? tableRowColor : tableAlternateRowColor,
                      borderBottom: `1px solid ${gridColor}`
                    }}>
                      {allColumns.map((column, colIndex) => (
                        <td key={column} style={{ 
                          padding: '12px 16px',
                          borderRight: colIndex < allColumns.length - 1 ? `1px solid ${gridColor}` : 'none',
                          fontSize: '14px',
                          color: textColor,
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
              border: `1px solid ${borderColor}`,
              borderRadius: '8px'
            }}>
              <thead>
                <tr style={{ backgroundColor: tableHeaderColor }}>
                  <th style={{ 
                    padding: '12px 16px', 
                    borderBottom: `2px solid ${borderColor}`,
                    borderRight: `1px solid ${gridColor}`,
                    textAlign: 'left',
                    fontWeight: '600',
                    color: textColor,
                    fontSize: '14px'
                  }}>
                    {finalXAxisLabel || 'Category'}
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    borderBottom: `2px solid ${borderColor}`,
                    textAlign: 'left',
                    fontWeight: '600',
                    color: textColor,
                    fontSize: '14px'
                  }}>
                    {finalYAxisLabel || 'Value'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((item, index) => (
                  <tr key={index} style={{ 
                    backgroundColor: index % 2 === 0 ? tableRowColor : tableAlternateRowColor,
                    borderBottom: `1px solid ${gridColor}`
                  }}>
                    <td style={{ 
                      padding: '12px 16px',
                      borderRight: `1px solid ${gridColor}`,
                      fontSize: '14px',
                      color: textColor
                    }}>
                      {item.x}
                    </td>
                    <td style={{ 
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: textColor,
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
    <div 
      className="chart-viewer-container"
      style={{ 
        backgroundColor, 
        padding: `${padding}px`, 
        height: `100%`,
        borderRadius: '8px',
        border: `1px solid ${borderColor}`,
        width: '100%',
        minWidth: `${Math.min(chartWidth, 500)}px`,
        overflow: 'auto' // Allow scrolling for very wide charts
      }}
    >
      {title && (
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '18px', 
          fontWeight: '600',
          textAlign: 'center',
          color: textColor
        }}>
          {title}
        </h3>
      )}
      <div 
        className="chart-content-area"
        style={{ 
          backgroundColor,
          height: `100%`,
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        {/* Use ResponsiveContainer only when width/height are percentage or 'auto' */}
        {(typeof width === 'string' && (width.includes('%') || width === 'auto')) || 
         (typeof height === 'string' && (height.includes('%') || height === 'auto')) ? (
          <ResponsiveContainer width={width} height={height}>
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          // Use direct chart rendering when fixed dimensions are provided
          renderChart()
        )}
      </div>
    </div>
  );
};

export default RechartsViewer;
