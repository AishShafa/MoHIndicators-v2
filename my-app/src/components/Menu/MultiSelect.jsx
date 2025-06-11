import React from "react";
import Select from "react-select";

export default function MultiSelect({ label, options, selectedOptions, onChange }) {
  return (
    <div className="mb-3">
      <label style={{ fontWeight: "600", fontSize: "13px", color: "#444", marginBottom: "5px" }}>
        {label}
      </label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={onChange}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder={`Select ${label}`}
      />
    </div>
  );
}
