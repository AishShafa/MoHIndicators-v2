import React from "react";
import Select from "react-select";




const customStyles = {
  control: (base, state) => ({
    ...base,
    fontSize: "15px",
    backgroundColor: state.isFocused ? "#ffffff" : "#ffffff",
    borderColor: "#2ccd94",
    color: "047857",
    boxShadow: state.isFocused ? "0 0 0 1px #047857" : "none",
    "&:hover": {
      borderColor: "#2ccd94",
    },

  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "13px",
    color: "047857",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "13px",
    color: "#047857",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "13px",
    backgroundColor: state.isSelected
      ? "#047857"
      : state.isFocused
      ? "#047857"
      : "#fff",
    color: state.isSelected ? "white" : "#047857",
    "&:hover": {
      backgroundColor: "#a7f3d0",
    },
  }),
  multiValue: (base) => ({
    ...base,
    fontSize: "13px",
    backgroundColor: "#047857",
  }),
  multiValueLabel: (base) => ({
    ...base,
    fontSize: "13px",
    color: "white",
  }),
  multiValueRemove: (base) => ({
    ...base,
    fontSize: "13px",
    color: "#ffffff",
    ":hover": {
      backgroundColor: "#10b981",
      color: "white",
    },
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#047857", 
    ":hover": {
      color: "#2ccd94",
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#047857", //  line next to arrow
  }),
  menu: (base) => ({
    ...base,
    fontSize: "13px",
    backgroundColor: "#10b981", // dropdown background
    color: "white",
  }),
  input: (base) => ({
    ...base,
    fontSize: "13px",
    color: "#047857", // typed input text
  }),
};


export default function MultiSelect({ label, options, selectedOptions, onChange }) {
  return (
    <div className="mb-3">
      <label
        style={{
          fontWeight: "200",
          fontSize: "15px",
          color: "#000000", // changed from #ffffff to black
          marginBottom: "6px",
          display: "block",
        }}
      >
        {label}
      </label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={onChange}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder={`Select ${label}`}
      />
    </div>
  );
}
