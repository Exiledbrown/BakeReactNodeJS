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

// Ruta POST para login con username/password
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, username: user.username });
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
  console.log(`Servidor en puerto ${PORT}`);
});