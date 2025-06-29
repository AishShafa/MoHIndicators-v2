const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000; // or any other port
const SECRET_KEY = 'your_secret_key'; // Replace with an environment variable in production

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

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

