import React, { useState } from "react";
import "./HealthDataForm.css";

const HealthDataForm = () => {
  const [formData, setFormData] = useState({
    healthIndicator: "",
    location: "",
    gender: "",
    region: "",
    additionalNotes: "",
    metric: "",
    ageGroup: "",
    year: 2025,
    value: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // data to backend
  };

  return (
    <div className="health-data-form">
      <button className="back-button">&larr; Back to Health Data</button>

      <h2>Health Indicator Information</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="healthIndicator">Health Indicator *</label>
            <input
              type="text"
              id="healthIndicator"
              name="healthIndicator"
              value={formData.healthIndicator}
              onChange={handleChange}
              placeholder="e.g., Infant Mortality Rate"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select location</option>
              <option value="capital">Capital</option>
              <option value="north">Northern Region</option>
              <option value="south">Southern Region</option>
              <option value="east">Eastern Region</option>
              <option value="west">Western Region</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="region">Region *</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            >
              <option value="">Select region</option>
              <option value="urban">Urban</option>
              <option value="rural">Rural</option>
              <option value="coastal">Coastal</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="additionalNotes">Additional Notes</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Any additional information about this health indicator..."
            />
          </div>
        </div>

        <div className="form-divider"></div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="metric">Metric *</label>
            <input
              type="text"
              id="metric"
              name="metric"
              value={formData.metric}
              onChange={handleChange}
              placeholder="e.g., Deaths per 1000 live births"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ageGroup">Age Group *</label>
            <select
              id="ageGroup"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              required
            >
              <option value="">Select age group</option>
              <option value="0-1">0-1 years</option>
              <option value="1-5">1-5 years</option>
              <option value="5-14">5-14 years</option>
              <option value="15-24">15-24 years</option>
              <option value="25-64">25-64 years</option>
              <option value="65+">65+ years</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="year">Year *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="2000"
              max="2030"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="value">Value *</label>
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="e.g., 8.5"
              step="0.1"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Health Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthDataForm;