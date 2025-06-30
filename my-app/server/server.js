const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000; // or any other port
const SECRET_KEY = 'your_secret_key'; // Replace with an environment variable in production

// Logging configuration
const LOGGING_CONFIG = {
    DEFAULT_THRESHOLD_MINUTES: 5,
    FREQUENT_ACTION_THRESHOLD_MINUTES: 30,
    EXCLUDE_FROM_FREQUENT_LOGGING: [
        'GET /users/history',
        'GET /users',
        'GET /protected',
        'GET /items'
    ]
};

// PostgreSQL connection pool
const pool = new Pool({
    user: "postgres",
    password: "Moh1234",
    host: "localhost",
    port: 5432,
    database: "health_indicators"
});

app.use(cors());
app.use(bodyParser.json());

// Middleware to extract user from token and log actions
app.use(async (req, res, next) => {
    // Extract user from token if present
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const verified = jwt.verify(token, SECRET_KEY);
            req.user = verified;
        } catch (err) {
            // Token is invalid, but we continue without user info
            req.user = null;
        }
    }

    // Log the action after request is processed
    const originalSend = res.send;
    res.send = function(data) {
        // Log action after response is sent
        setImmediate(async () => {
            const userId = req.user?.userId || null;
            const action = `${req.method} ${req.path}`;
            const metadata = { 
                query: req.query, 
                body: req.method !== 'GET' ? req.body : undefined,
                statusCode: res.statusCode,
                userAgent: req.get('User-Agent')
            };

            // Define actions that should not be logged frequently
            const excludeFromFrequentLogging = LOGGING_CONFIG.EXCLUDE_FROM_FREQUENT_LOGGING;

            // Only log if user exists and it's not a frequently called read operation
            if (userId && !excludeFromFrequentLogging.includes(action)) {
                await logUserAction(userId, action, metadata);
            } else if (userId && excludeFromFrequentLogging.includes(action)) {
                // For frequent operations, use longer threshold to reduce noise
                await logUserActionWithCustomThreshold(userId, action, metadata, LOGGING_CONFIG.FREQUENT_ACTION_THRESHOLD_MINUTES);
            }
        });

        originalSend.call(this, data);
    };

    next();
});


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.userId]);
        console.log('User Role:', result.rows[0]?.role);
        next();
    } catch (err) {
        console.error('Admin verification error:', err);
        res.status(500).json({ error: 'Server error during admin verification' });
    }
};

// Example API endpoint to get data
app.get('/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json('Server Error');
    }
});

// Get all users endpoint (protected - admin only)
app.get('/users', async (req, res) => {
    try {
        // Fetch all users from the database
        const result = await pool.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );

        // Respond with the fetched data
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Server error while fetching users' });
    }
});


// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json('Invalid email or password');
        }

        const user = result.rows[0];

        // Directly compare passwords (temporarily)
        if (password !== user.password_hash) {
            return res.status(400).json('Invalid email or password');
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id, roleId: user.role_id }, SECRET_KEY, { expiresIn: '1h' });

        // Respond with token and user data
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                roleId: user.role_id
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json('Server Error');
    }
});

// Registration endpoint (protected - admin only)
app.post('/register', verifyToken, verifyAdmin, async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the email already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Directly store the plain-text password
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
            [username, email, password, role]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });
    } catch (err) {
        console.error('Registration error:', err); // Log the error
        if (err.code === '23505') { // Unique constraint violation
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Server error during registration' });
        }
    }
});



// Protected route example
app.get('/protected', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json('Access denied');

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        res.json({ message: 'Access granted', userId: verified.userId });
    } catch (err) {
        res.status(403).json('Invalid token');
    }
});

// Update user by ID (protected - admin only)
app.put('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    try {
        // Validate inputs
        if (!username || !email || !role) {
            return res.status(400).json({ error: 'Username, email, and role are required' });
        }

        // Build query based on whether password is provided
        let query, values;
        if (password && password.trim() !== '') {
            query = 'UPDATE users SET username = $1, email = $2, password_hash = $3, role = $4 WHERE id = $5 RETURNING id, username, email, role, created_at';
            values = [username, email, password, role, id];
        } else {
            query = 'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, username, email, role, created_at';
            values = [username, email, role, id];
        }

        // Update user in the database
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User updated successfully',
            user: result.rows[0]
        });
    } catch (err) {
        console.error('Update error:', err);
        if (err.code === '23505') { // Unique constraint violation
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Server error during update' });
        }
    }
});

// Delete user by ID (protected - admin only)
app.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        // Prevent users from deleting themselves
        if (req.user.userId === parseInt(id)) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        // Delete user from the database
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username, email, role', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User deleted successfully',
            user: result.rows[0]
        });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Server error during deletion' });
    }
});

// Get user history endpoint (protected - admin only)
app.get('/users/history', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                uh.id,
                uh.user_id,
                u.username,
                uh.action,
                uh.action_timestamp,
                uh.metadata
            FROM users_history uh
            LEFT JOIN users u ON uh.user_id = u.id
            ORDER BY uh.action_timestamp DESC
            LIMIT 100
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching user history:', err);
        res.status(500).json({ error: 'Server error while fetching user history' });
    }
});

// Get logging configuration endpoint (admin only)
app.get('/admin/logging-config', verifyToken, verifyAdmin, async (req, res) => {
    try {
        res.json({
            config: LOGGING_CONFIG,
            message: 'Current logging configuration'
        });
    } catch (err) {
        console.error('Error fetching logging config:', err);
        res.status(500).json({ error: 'Server error while fetching logging configuration' });
    }
});

//Logging Utility with duplicate prevention
const logUserAction = async (userId, action, metadata = null) => {
    await logUserActionWithCustomThreshold(userId, action, metadata, LOGGING_CONFIG.DEFAULT_THRESHOLD_MINUTES);
};

const logUserActionWithCustomThreshold = async (userId, action, metadata = null, thresholdMinutes = 5) => {
    try {
        // Check if the same user has performed the same action recently
        const recentActionCheck = await pool.query(
            `SELECT id FROM users_history 
             WHERE user_id = $1 
             AND action = $2 
             AND action_timestamp > NOW() - INTERVAL '${thresholdMinutes} minutes'
             ORDER BY action_timestamp DESC 
             LIMIT 1`,
            [userId, action]
        );

        // If a recent similar action exists, don't log this one
        if (recentActionCheck.rows.length > 0) {
            console.log(`Duplicate action skipped: User ${userId} - ${action} (within ${thresholdMinutes} minutes)`);
            return;
        }

        // Log the action if no recent duplicate found
        await pool.query(
            `INSERT INTO users_history (user_id, action, metadata) VALUES ($1, $2, $3)`,
            [userId, action, metadata ? JSON.stringify(metadata) : null]
        );
        console.log(`Action logged: User ${userId} - ${action}`);
    } catch (err) {
        console.error("Error logging user action:", err);
    }
};


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

