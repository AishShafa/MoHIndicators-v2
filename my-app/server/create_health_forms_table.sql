-- Create health_data_forms table
CREATE TABLE IF NOT EXISTS health_data_forms (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    health_indicator VARCHAR(255),
    location VARCHAR(255),
    gender VARCHAR(50),
    region VARCHAR(255),
    metric VARCHAR(255),
    age_group VARCHAR(100),
    year INTEGER,
    value DECIMAL(15,2),
    additional_notes TEXT,
    charts JSONB, -- Enhanced chart snapshots with complete configuration
    excel_data JSONB,
    excel_columns JSONB,
    is_public BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'draft', -- draft, completed, published
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Additional fields for chart snapshots
    data_row_count INTEGER DEFAULT 0, -- Original number of data rows
    data_truncated BOOLEAN DEFAULT false, -- Whether data was truncated for storage
    submission_snapshot JSONB, -- Metadata about the submission
    chart_render_settings JSONB -- Default render settings for all charts
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_forms_public ON health_data_forms(is_public);
CREATE INDEX IF NOT EXISTS idx_health_forms_status ON health_data_forms(status);
CREATE INDEX IF NOT EXISTS idx_health_forms_created_by ON health_data_forms(created_by);
CREATE INDEX IF NOT EXISTS idx_health_forms_indicator ON health_data_forms(health_indicator);
CREATE INDEX IF NOT EXISTS idx_health_forms_location ON health_data_forms(location);
CREATE INDEX IF NOT EXISTS idx_health_forms_year ON health_data_forms(year);
CREATE INDEX IF NOT EXISTS idx_health_forms_created_at ON health_data_forms(created_at);

-- Add some sample data for testing
INSERT INTO health_data_forms (
    title,
    description,
    health_indicator,
    location,
    gender,
    region,
    metric,
    age_group,
    year,
    value,
    additional_notes,
    charts,
    excel_data,
    is_public,
    status,
    created_by
) VALUES 
(
    'Maternal Mortality Rate 2024',
    'Analysis of maternal mortality rates across different regions of Maldives',
    'Maternal Mortality',
    'Male',
    'Female',
    'Central Region',
    'Deaths per 100,000 live births',
    '15-49 years',
    2024,
    68.5,
    'Data collected from regional health facilities',
    '[{"id": 1, "title": "Maternal Mortality by Region", "type": "bar", "xAxis": "Region", "yAxis": "Mortality Rate", "color": "#dc3545"}]'::jsonb,
    '[{"Region": "Central", "Mortality Rate": 68.5, "Population": 150000}, {"Region": "North", "Mortality Rate": 72.1, "Population": 45000}, {"Region": "South", "Mortality Rate": 65.3, "Population": 75000}]'::jsonb,
    true,
    'completed',
    1
),
(
    'Child Vaccination Coverage 2024',
    'Comprehensive analysis of child vaccination coverage rates',
    'Vaccination Coverage',
    'Nationwide',
    'Both',
    'All Regions',
    'Percentage Coverage',
    '0-5 years',
    2024,
    94.2,
    'WHO/UNICEF recommended vaccines included',
    '[{"id": 2, "title": "Vaccination Coverage by Vaccine Type", "type": "pie", "color": "#28a745"}]'::jsonb,
    '[{"Vaccine": "BCG", "Coverage": 98.5}, {"Vaccine": "DPT", "Coverage": 94.2}, {"Vaccine": "Polio", "Coverage": 96.8}, {"Vaccine": "Measles", "Coverage": 91.7}]'::jsonb,
    true,
    'completed',
    1
),
(
    'Mental Health Indicators 2024',
    'Mental health service utilization and outcomes data',
    'Mental Health',
    'Male',
    'Both',
    'Central Region',
    'Service Utilization Rate',
    'All Ages',
    2024,
    23.6,
    'Includes outpatient and inpatient mental health services',
    '[{"id": 3, "title": "Mental Health Service Usage", "type": "line", "xAxis": "Month", "yAxis": "Number of Patients", "color": "#6f42c1"}]'::jsonb,
    '[{"Month": "Jan", "Patients": 245}, {"Month": "Feb", "Patients": 267}, {"Month": "Mar", "Patients": 289}, {"Month": "Apr", "Patients": 312}, {"Month": "May", "Patients": 298}, {"Month": "Jun", "Patients": 335}]'::jsonb,
    true,
    'completed',
    1
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_health_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_health_forms_updated_at
    BEFORE UPDATE ON health_data_forms
    FOR EACH ROW
    EXECUTE FUNCTION update_health_forms_updated_at();

-- Grant permissions (adjust as needed)
-- GRANT SELECT ON health_data_forms TO public_role;
-- GRANT ALL PRIVILEGES ON health_data_forms TO admin_role;
