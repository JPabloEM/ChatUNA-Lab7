"use strict";

// Requiere dotenv
require('dotenv').config();

const session = require("express-session");
const { auth, requiresAuth } = require('express-openid-connect');
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const validationModule = require('./unalib/index');

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

// Variables del entorno (Okta)
const OKTA_ISSUER_URI = process.env.OKTA_ISSUER_URI;
const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID;
const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET;
const SECRET = process.env.SECRET;
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;  // Cambia BASE_URL según el entorno

// Configuración de Auth0/Okta
const config = {
  authRequired: true,  // Autenticación requerida en todas las rutas
  auth0Logout: true,
  secret: SECRET,
  baseURL: BASE_URL,
  clientID: OKTA_CLIENT_ID,
  issuerBaseURL: OKTA_ISSUER_URI,
};

// Middleware de autenticación
app.use(auth(config));

// Configuración mínima de sesiones
app.use(session({
  cookie: { httpOnly: true },
  secret: SECRET,
  resave: false,
  saveUninitialized: true
}));

// Servir archivos estáticos
app.use("/static", express.static(path.join(__dirname, "static")));
app.use('/unalib', express.static(path.join(__dirname, 'unalib')));

// Ruta raíz (home) protegida
app.get('/', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Ruta del dashboard protegida
app.get('/dashboard', requiresAuth(), (req, res) => {
  res.send(`
    <h1>Bienvenid@, ${req.oidc.user.name}!</h1>
    <p>Su email es: ${req.oidc.user.email}</p>
    <p><a href="/chat">Ir al chat</a> | <a href="/logout">Cerrar sesión</a></p>
  `);
});

// Ruta para obtener el usuario autenticado
app.get('/user', requiresAuth(), (req, res) => {
  res.json({
    nombre: req.oidc.user.name || 'Usuario Anónimo',
    email: req.oidc.user.email
  });
});

// Ruta del chat protegida
app.get('/chat', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: BASE_URL });
});

// Configuración de Socket.IO para el chat
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Validar el mensaje antes de reenviarlo
  socket.on('Evento-Mensaje-Server', (msg) => {
    const mensajeValidado = validationModule.validateMessage(msg);
    io.emit('Evento-Mensaje-Server', mensajeValidado);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en ${BASE_URL}`);
});
