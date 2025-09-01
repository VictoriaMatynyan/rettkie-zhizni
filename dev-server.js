import { createRequire } from 'module';
import path from 'path';
import url from 'url';

const require = createRequire(import.meta.url);
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.API_PORT || 3001);
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15m
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7d
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_rettkie';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({ logger: true });

server.use(middlewares);
server.use(jsonServer.bodyParser);

function sanitizeUser(user) {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  return rest;
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL_SECONDS }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL_SECONDS,
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function getDb() {
  return router.db;
}

// Register
server.post('/auth/register', async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    role = 'parent',
    ...rest
  } = req.body || {};
  if (!email || !password || !firstName || !lastName) {
    return res
      .status(400)
      .json({ message: 'email, password, firstName, lastName are required' });
  }

  const db = getDb();
  const existing = db.get('users').find({ email }).value();
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now(),
    email,
    password: hashed,
    firstName,
    lastName,
    role,
    isActive: true,
    isEmailVerified: false,
    registeredAt: new Date().toISOString(),
    hasConsentToDataProcessing: !!rest.hasConsentToDataProcessing,
    ...rest,
  };

  db.get('users').push(user).write();

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return res.status(201).json({
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });
});

// Login
server.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  const db = getDb();
  const user = db.get('users').find({ email }).value();
  if (!user)
    return res.status(401).json({ message: 'Invalid email or password' });
  if (user.isActive === false)
    return res.status(403).json({ message: 'Account disabled' });

  // Support both plain and hashed passwords for seed data
  let ok = false;
  if (typeof user.password === 'string' && user.password.startsWith('$2')) {
    ok = await bcrypt.compare(password, user.password);
  } else {
    ok = user.password === password;
  }
  if (!ok)
    return res.status(401).json({ message: 'Invalid email or password' });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return res.json({
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });
});

// Refresh
server.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken)
    return res.status(400).json({ message: 'refreshToken is required' });
  const payload = verifyToken(refreshToken);
  if (!payload || payload.type !== 'refresh')
    return res.status(401).json({ message: 'Invalid refresh token' });
  const db = getDb();
  const user = db.get('users').find({ id: payload.sub }).value();
  if (!user) return res.status(401).json({ message: 'User not found' });
  const accessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);
  return res.json({
    user: sanitizeUser(user),
    accessToken,
    refreshToken: newRefreshToken,
    tokenType: 'Bearer',
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });
});

// Me
server.get('/auth/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ message: 'Unauthorized' });
  const db = getDb();
  const user = db.get('users').find({ id: payload.sub }).value();
  if (!user) return res.status(401).json({ message: 'User not found' });
  return res.json({ user: sanitizeUser(user) });
});

// Simple auth middleware for protected write operations
server.use((req, res, next) => {
  const method = req.method.toUpperCase();
  const isWrite =
    method === 'POST' ||
    method === 'PUT' ||
    method === 'PATCH' ||
    method === 'DELETE';
  if (!isWrite) return next();

  // Public write exceptions can be added here if needed
  if (req.path.startsWith('/contacts') && method === 'POST') {
    return next();
  }
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ message: 'Unauthorized' });
  req.user = payload;
  return next();
});

// Finally use the router
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Auth Server running on http://localhost:${PORT}`);
});
