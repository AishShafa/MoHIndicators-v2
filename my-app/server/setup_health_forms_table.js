const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    password: "Moh1234",
    host: "localhost",
    port: 5432,
    database: "Moh_Indicators"
});

async function setupHealthFormsTable() {
    try {
        console.log('Setting up health_data_forms table...');
        
        // Read the SQL file
        const sqlPath = path.join(__dirname, 'create_health_forms_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        // Execute the SQL
        await pool.query(sql);
        
        console.log(' Health data forms table created successfully!');
        console.log(' Sample data inserted successfully!');
        console.log(' Indexes created successfully!');
        
        // Verify the table was created
        const result = await pool.query("SELECT COUNT(*) FROM health_data_forms");
        console.log(` Health forms table now contains ${result.rows[0].count} records`);
        
    } catch (err) {
        console.error('Error setting up health_data_forms table:', err);
    } finally {
        await pool.end();
    }
}

// Run the setup
setupHealthFormsTable();
