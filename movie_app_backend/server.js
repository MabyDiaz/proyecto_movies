import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/usuario_routes.js';
import { createUser, loginUser } from './controllers/usuario_controller.js';
import dotenv from 'dotenv';
import session from 'express-session';
import { verifyToken, verifyAdmin } from './middlewares/verifyToken.js'; // Importa los middlewares

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  session({
    secret: 'secret-key', // Cambia esto a una cadena secreta más segura
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

// Obtener el nombre del archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta del frontend
app.use(express.static(path.join(__dirname, '../proyecto_movies_cac-master')));

// Rutas para servir los archivos del frontend
app.get('/register', (req, res) => {
  const filePath = path.join(
    __dirname,
    '../proyecto_movies_cac-master/pages/registrarse.html'
  );
  res.sendFile(filePath);
});

app.get('/login', (req, res) => {
  const filePath = path.join(
    __dirname,
    '../proyecto_movies_cac-master/pages/iniciosesion.html'
  );
  res.sendFile(filePath);
});

// Rutas POST
app.post('/register', createUser); //para registrar un nuevo usuario
app.post('/login', loginUser); //para iniciar sesión

// Usar rutas de usuarios
app.use('/', userRoutes);

// Rutas protegidas
app.get('/ruta-protegida', verifyToken, (req, res) => {
  res.send('Esta es una ruta protegida');
});

app.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.send('Esta es una ruta solo para administradores');
});

app.get('/api/check-admin', (req, res) => {
  if (req.session.isAdmin) {
    res.json({ isAdmin: true });
  } else {
    res.json({ isAdmin: false });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
