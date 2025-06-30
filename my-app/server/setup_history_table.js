const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
    user: "postgres",
    password: "Moh1234",
    host: "localhost",
    port: 5432,
    database: "health_indicators"
});

async function createHistoryTable() {
    try {
        // Create users_history table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users_history (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                action TEXT NOT NULL,
                action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB
            );
        `);
        
        console.log('users_history table created successfully');

        // Create indexes for better performance
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_users_history_user_id ON users_history(user_id);
        `);
        
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_users_history_timestamp ON users_history(action_timestamp DESC);
        `);
        
        console.log('Indexes created successfully');

        // Check if table exists and has data
        const result = await pool.query('SELECT COUNT(*) FROM users_history');
        console.log(`users_history table has ${result.rows[0].count} records`);

    } catch (err) {
        console.error('Error creating users_history table:', err);
    } finally {
        await pool.end();
    }
}

createHistoryTable();
