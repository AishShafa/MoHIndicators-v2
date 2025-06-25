const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from the frontend
  credentials: true,              // Allow credentials (if needed)
}))

=======
>>>>>>> c2cc97f8ad3d73f1ef9103496a1b33c6f5c40c73
const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'Moh1234',  
    database: 'health_indicators'
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
<<<<<<< HEAD
  console.log("Received email:", email);
    console.log("Received password:", password);

    if (!email || !password) {
        console.log("Missing email or password");
        return res.status(400).json({ error: "Email and password are required." });
    }
=======
>>>>>>> c2cc97f8ad3d73f1ef9103496a1b33c6f5c40c73

  try {
    const user = await db('auth.users')
      .join('auth.roles', 'auth.users.role_id', 'auth.roles.id')
      .select('auth.users.*', 'auth.roles.name as role')
      .where({ email })
      .first();

    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'yourSecret',
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register endpoint - Admin only
app.post('/register', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecret');

    if (decoded.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only Admins can register users' });
    }

    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await db('auth.users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Get role id from roles table
    const roleRecord = await db('auth.roles').where({ name: role }).first();
    if (!roleRecord) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Insert new user
    await db('auth.users').insert({
      username,
      email,
      password_hash,
      role_id: roleRecord.id,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

app.listen(8080, () => console.log('Server running on port 8080'));
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Attempting login for:", email);
<<<<<<< HEAD
  app.get('/login', (req, res) => {
  res.send("This is the login endpoint. Use POST to submit credentials.");
});

=======
>>>>>>> c2cc97f8ad3d73f1ef9103496a1b33c6f5c40c73

  try {
    const user = await db('auth.users')
      .join('auth.roles', 'auth.users.role_id', 'auth.roles.id')
      .select('auth.users.*', 'auth.roles.name as role')
      .where({ email })
      .first();

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log("User found:", user.email);
    console.log("Stored hash:", user.password_hash);
    console.log("Entered password:", password);

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      console.log("Password mismatch");
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log("Password correct, generating token...");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'yourSecret',
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
