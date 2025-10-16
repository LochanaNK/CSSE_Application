import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple health
app.get('/', (req, res) => res.send('Auth server is running'));

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'csse_app';

let pool;

// Ensure database exists then create pool
async function createPoolAndEnsure() {
  // connect without database to create it if missing
  const adminConn = await mysql.createConnection({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD });
  try {
    await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } finally {
    await adminConn.end();
  }

  const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Create users table if not exists
  const createSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255),
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;
  const conn = await pool.getConnection();
  try {
    await conn.query(createSql);
    // create schedules table
    const createSchedules = `
      CREATE TABLE IF NOT EXISTS schedules (
        id VARCHAR(64) PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        scheduled_at DATETIME NOT NULL,
        time_label VARCHAR(64),
        status VARCHAR(50) DEFAULT 'Scheduled',
        location_lat DOUBLE NULL,
        location_lng DOUBLE NULL,
        location_label VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;
    await conn.query(createSchedules);
  } finally {
    conn.release();
  }

  return pool;
}

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)', [email, name || null, password_hash]);
      const userId = result.insertId;
      const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.status(201).json({ token, user: { id: userId, email, name } });
    } finally {
      conn.release();
    }
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already registered' });
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Signin
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query('SELECT id, email, name, password_hash FROM users WHERE email = ?', [email]);
      const user = rows[0];
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Protected example
app.get('/api/protected', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return res.json({ ok: true, user: payload });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// JWT middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Create schedule
app.post('/api/schedules', authMiddleware, async (req, res) => {
  const { type, scheduled_at, time_label, location } = req.body; // location: { lat, lng, label }
  if (!type || !scheduled_at) return res.status(400).json({ error: 'type and scheduled_at required' });
  try {
    const id = `s-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const conn = await pool.getConnection();
    try {
      await conn.query('INSERT INTO schedules (id, user_id, type, scheduled_at, time_label, location_lat, location_lng, location_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
        id, req.user.id, type, new Date(scheduled_at), time_label || null, location?.lat || null, location?.lng || null, location?.label || null
      ]);
      return res.status(201).json({ id });
    } finally { conn.release(); }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// List schedules for current user
app.get('/api/schedules', authMiddleware, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query('SELECT id, type, scheduled_at, time_label, status, location_lat, location_lng, location_label FROM schedules WHERE user_id = ? ORDER BY scheduled_at ASC', [req.user.id]);
      // map rows to client-friendly format
      const items = rows.map(r => ({ id: r.id, type: r.type, date: r.scheduled_at, time: r.time_label, status: r.status, location: r.location_lat ? { lat: Number(r.location_lat), lng: Number(r.location_lng), label: r.location_label } : null }));
      return res.json(items);
    } finally { conn.release(); }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete schedule (owner only)
app.delete('/api/schedules/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query('DELETE FROM schedules WHERE id = ? AND user_id = ?', [id, req.user.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
      return res.json({ ok: true });
    } finally { conn.release(); }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Start
createPoolAndEnsure().then(p => {
  // assign pool to module-level var by closure trick
  global.__DB_POOL = p;
  // replace pool getter used in routes
  app.use((req, res, next) => { req.dbPool = p; next(); });
  // expose getConnection helper
  pool = p; // eslint-disable-line no-global-assign
  app.listen(port, () => console.log(`Auth server running on port ${port}`));
}).catch(err => {
  console.error('Failed to ensure database & users table', err);
  process.exit(1);
});
