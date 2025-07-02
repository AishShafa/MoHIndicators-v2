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
        <p>No data available for chart</p>
      </div>
    );
  }

  const {
    type = 'bar',
    title = '',
    xAxisLabel = '',
    yAxisLabel = '',
    color = '#10b981',
    secondaryColor = '#059669',
    backgroundColor = '#ffffff',
    gridLines = 'true',
    legendPosition = 'top',
    animation = 'true',
    borderWidth = 2,
    opacity = 1,
    columnMapping = {}
  } = chartConfig;

  // Process data based on column mapping
  const processedData = data.map((item, index) => {
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

  const legendProps = legendPosition !== 'none' ? {
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
          <p style={{ margin: '4px 0', fontWeight: 'bold' }}>{`${xAxisLabel || 'X'}: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color }}>
              {`${yAxisLabel || 'Y'}: ${entry.value}`}
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
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              {...commonAxisProps}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {legendProps && <Legend {...legendProps} />}
            <Bar 
              dataKey="y" 
              fill={color} 
              opacity={opacity}
              strokeWidth={borderWidth}
              stroke={secondaryColor}
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
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              {...commonAxisProps}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {legendProps && <Legend {...legendProps} />}
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke={color} 
              strokeWidth={borderWidth}
              strokeOpacity={opacity}
              dot={{ fill: secondaryColor, strokeWidth: 2, r: 4 }}
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
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              {...commonAxisProps}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {legendProps && <Legend {...legendProps} />}
            <Area 
              type="monotone" 
              dataKey="y" 
              stroke={color} 
              fill={color}
              fillOpacity={opacity * 0.6}
              strokeWidth={borderWidth}
              {...animationProps}
            />
          </AreaChart>
        );

      case 'pie':
        const COLORS = [color, secondaryColor, '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return (
          <PieChart {...chartProps}>
            <Tooltip content={<CustomTooltip />} />
            {legendProps && <Legend {...legendProps} />}
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
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              {...commonAxisProps}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {legendProps && <Legend {...legendProps} />}
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
            {legendProps && <Legend {...legendProps} />}
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
      border: '1px solid #e5e7eb'
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
