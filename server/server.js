// Importar módulos para servidor y dependencias
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Crear app Express
const app = express();
const PORT = process.env.PORT || 5000;
const USE_HASH = process.env.USE_HASH === 'true';  // Toggle: true = hash, false = plano

// Configurar middleware para JSON y CORS
app.use(express.json());
app.use(cors());

// Crear conexión a MariaDB
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Conectar a DB y loguear estado
db.connect((err) => {
  if (err) {
    console.error('Error en conexión DB:', err);
    return;
  }
  console.log('Conectado a MariaDB');
});

// Middleware para verificar JWT en rutas protegidas
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta POST para login con username/password (plano o hash)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

    const user = results[0];
    let isValid;
    if (USE_HASH) {
      isValid = await bcrypt.compare(password, user.password);
    } else {
      isValid = password === user.password;  // Comparación plana para dev/prod simple
    }
    if (!isValid) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, username: user.username });
  });
});

// Ruta POST para registro de nuevo usuario (plano o hash)
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ error: 'Faltan campos requeridos' });

  // Verificar si usuario ya existe
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) return res.status(400).json({ error: 'Usuario ya existe' });

    let hashedPassword = password;
    if (USE_HASH) {
      hashedPassword = await bcrypt.hash(password, 10);  // Hash solo si toggle true
    }

    // Insertar nuevo usuario
    db.query('INSERT INTO users (username, password, role, created_at) VALUES (?, ?, ?, NOW())', [username, hashedPassword, role], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Usuario creado exitosamente', userId: result.insertId });
    });
  });
});

// Ruta POST simulada para login social (Google/FB/Apple)
app.post('/api/login/social', (req, res) => {
  const { provider, token } = req.body;
  res.json({ token: 'fake-jwt-token', role: 'cliente', username: 'user_social' });
});

// Ruta GET protegida para orders de usuario
app.get('/api/orders', authenticateToken, (req, res) => {
  db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Ruta GET pública para productos
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Ruta GET protegida para detalles de order
app.get('/api/orders/:id/details', authenticateToken, (req, res) => {
  const orderId = req.params.id;
  db.query(`
    SELECT od.*, p.name, p.price 
    FROM order_details od 
    JOIN products p ON od.product_id = p.id 
    WHERE od.order_id = ?
  `, [orderId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Iniciar servidor en puerto configurado
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT} (Hash: ${USE_HASH ? 'Sí' : 'No'})`);
});