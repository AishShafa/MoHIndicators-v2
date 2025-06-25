// React component that receives filtered data and renders it in a clean table using Bootstrap, if no data is present, it will show a fallback message


import React from "react";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import "./Data_Table.css";

/**
 * DataTable component displays the filtered health data in a styled table format
 * This component expects a data prop which should be an array of objects
 */
const DataTable = ({ data }) => {
  // If no data is provided, show a message
  if (!data || data.length === 0) {
    return <p className="no-data-msg">No data matches the selected filters.</p>;
  }

  return (
    <div className="custom-table-container">
      <Table striped bordered hover responsive className="custom-table">
        <thead>
          <tr>
            <th>Indicator</th>
            <th>Metric</th>
            <th>Location</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Year</th>
            <th>Region</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.Indicator}</td>
              <td>{row.Metric}</td>
              <td>{row.Location}</td>
              <td>{row.Age}</td>
              <td>{row.Gender}</td>
              <td>{row.Year}</td>
              <td>{row.Region}</td>
              <td>{row.Value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DataTable;
