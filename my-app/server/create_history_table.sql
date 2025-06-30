-- Create users_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS users_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_users_history_user_id ON users_history(user_id);

-- Create an index on action_timestamp for better performance when sorting by time
CREATE INDEX IF NOT EXISTS idx_users_history_timestamp ON users_history(action_timestamp DESC);

-- Insert some sample data for testing (optional)
-- Note: Uncomment the lines below if you want to test with sample data
/*
INSERT INTO users_history (user_id, action, metadata) VALUES 
(1, 'GET /users', '{"query": {}, "statusCode": 200, "userAgent": "Mozilla/5.0"}'),
(1, 'POST /login', '{"query": {}, "statusCode": 200, "userAgent": "Mozilla/5.0"}'),
(2, 'PUT /users/3', '{"query": {}, "body": {"username": "testuser"}, "statusCode": 200, "userAgent": "Mozilla/5.0"}');
*/
