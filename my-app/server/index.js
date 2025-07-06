const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from the frontend
  methods: "GET,POST,PUT,DELETE", // Allow these HTTP methods
  credentials: true,              // Allow credentials (if needed)
}));

// Database connection
const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'Moh1234',
    database: 'Moh_Indicators',
  },
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await db('auth.users')
      .join('auth.roles', 'auth.users.role_id', 'auth.roles.id')
      .select('auth.users.*', 'auth.roles.name as role')
      .where({ email })
      .first();

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (user.password_hash !== password) {
         return res.status(400).json({ error: 'Invalid email or password' });
       }

    const token = jwt.sign(
         { id: user.id, role: user.role },
         process.env.JWT_SECRET || 'yourSecret',
         { expiresIn: '1h' }
       );
       res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
     } catch (err) {
       console.error(err); // Log the actual error
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

    const existingUser = await db('auth.users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const roleRecord = await db('auth.roles').where({ name: role }).first();

    if (!roleRecord) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

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

// Get all users endpoint - Admin only
app.get('/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecret');

    if (decoded.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only Admins can view users' });
    }

    const users = await db('auth.users')
      .join('auth.roles', 'auth.users.role_id', 'auth.roles.id')
      .select(
        'auth.users.id',
        'auth.users.username',
        'auth.users.email',
        'auth.users.created_at',
        'auth.roles.name as role'
      )
      .orderBy('auth.users.created_at', 'desc');

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

// Update user endpoint - Admin only
app.put('/users/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecret');

    if (decoded.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only Admins can update users' });
    }

    const { id } = req.params;
    const { username, email, role, password } = req.body;

    if (!username || !email || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email is already taken by another user
    const existingUser = await db('auth.users')
      .where({ email })
      .whereNot({ id })
      .first();
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered by another user' });
    }

    const roleRecord = await db('auth.roles').where({ name: role }).first();
    if (!roleRecord) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const updateData = {
      username,
      email,
      role_id: roleRecord.id,
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    await db('auth.users').where({ id }).update(updateData);

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during update' });
  }
});

// Delete user endpoint - Admin only
app.delete('/users/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecret');

    if (decoded.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only Admins can delete users' });
    }

    const { id } = req.params;

    // Check if user exists
    const user = await db('auth.users').where({ id }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (parseInt(id) === decoded.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await db('auth.users').where({ id }).del();

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during deletion' });
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
