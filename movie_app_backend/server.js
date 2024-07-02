import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/usuario_routes.js';
import { createUser, loginUser } from './controllers/usuario_controller.js';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'https://proyecto-movies-7vlw.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Obtener el nombre del archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta del frontend
app.use(express.static(path.join(__dirname, '../proyecto_movies_cac-master')));

// Ruta para servir el archivo de registro
app.get('/register', (req, res) => {
  const filePath = path.join(
    __dirname,
    '../proyecto_movies_cac-master/pages/registrarse.html'
  );
  res.sendFile(filePath);
});

// Rutas  POST
app.post('/register', createUser); //para registrar un nuevo usuario
app.post('/login', loginUser); //para iniciar sesión

// Usar rutas de usuarios
app.use('/', userRoutes);

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
