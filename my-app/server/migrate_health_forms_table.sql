-- Migration script to add new columns to existing health_data_forms table
-- Run this if the table already exists and you need to add the new columns

-- Add new columns for enhanced chart snapshots
ALTER TABLE health_data_forms 
ADD COLUMN IF NOT EXISTS data_row_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS data_truncated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS submission_snapshot JSONB,
ADD COLUMN IF NOT EXISTS chart_render_settings JSONB;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_health_forms_data_row_count ON health_data_forms(data_row_count);
CREATE INDEX IF NOT EXISTS idx_health_forms_data_truncated ON health_data_forms(data_truncated);

-- Update existing records to set default values
UPDATE health_data_forms 
SET 
  data_row_count = 0,
  data_truncated = false
WHERE data_row_count IS NULL OR data_truncated IS NULL;

-- Add comment to document the purpose of new columns
COMMENT ON COLUMN health_data_forms.data_row_count IS 'Original number of rows in the Excel data before any truncation';
COMMENT ON COLUMN health_data_forms.data_truncated IS 'Whether the Excel data was truncated for storage efficiency';
COMMENT ON COLUMN health_data_forms.submission_snapshot IS 'Metadata about the form submission including chart count and processing info';
COMMENT ON COLUMN health_data_forms.chart_render_settings IS 'Default render settings for charts in this form';

-- Show updated table structure
\d health_data_forms;
