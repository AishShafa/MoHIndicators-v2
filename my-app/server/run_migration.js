const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    password: "Moh1234",
    host: "localhost",
    port: 5432,
    database: "Moh_Indicators"
});

async function runMigration() {
    try {
        console.log('🔄 Running database migration for health_data_forms table...');
        
        // Add new columns
        await pool.query(`
            ALTER TABLE health_data_forms 
            ADD COLUMN IF NOT EXISTS data_row_count INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS data_truncated BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS submission_snapshot JSONB,
            ADD COLUMN IF NOT EXISTS chart_render_settings JSONB
        `);
        
        console.log('✅ New columns added successfully');
        
        // Create indexes
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_health_forms_data_row_count ON health_data_forms(data_row_count);
            CREATE INDEX IF NOT EXISTS idx_health_forms_data_truncated ON health_data_forms(data_truncated);
        `);
        
        console.log('✅ Indexes created successfully');
        
        // Update existing records
        const updateResult = await pool.query(`
            UPDATE health_data_forms 
            SET 
              data_row_count = 0,
              data_truncated = false
            WHERE data_row_count IS NULL OR data_truncated IS NULL
        `);
        
        console.log(`✅ Updated ${updateResult.rowCount} existing records`);
        
        // Show table structure
        const tableInfo = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'health_data_forms' 
            ORDER BY ordinal_position
        `);
        
        console.log('📋 Updated table structure:');
        console.table(tableInfo.rows);
        
        console.log('🎉 Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

// Run the migration
runMigration();
