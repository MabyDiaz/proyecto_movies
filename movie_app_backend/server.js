import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/usuario_routes.js';
import moviesRoutes from './routes/movies_routes.js';
import { createUser, loginUser } from './controllers/usuario_controller.js';
import dotenv from 'dotenv';
import pool from './db.js';
import session from 'express-session';
import multer from 'multer';

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const port = process.env.PORT || 3000;

// app.get('/ping', async (req, res) => {
//   try {
//     const [result] = await pool.query('SELECT "hello world" as RESULT');
//     console.log(result);
//     res.send('Bienvenido al servidor de Movie App');
//   } catch (error) {
//     console.error('Error executing query:', error);
//     res.status(500).send('Error en el servidor');
//   }
// });

// Configurar multer para manejar las cargas de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage }); // Configura multer

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
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

// Definir __dirname adecuadamente
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

// Rutas POST
app.post('/register', createUser);
app.post('/login', loginUser);

// Endpoint para subir imágenes
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename }); // Devuelve el nombre del archivo guardado
});

// Endpoint para subir imágenes
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});

// Usar rutas de usuarios
app.use('/', userRoutes);
app.use('/', moviesRoutes);

app.get('/api/check-admin', (req, res) => {
  if (req.session.isAdmin) {
    res.json({ isAdmin: true });
  } else {
    res.json({ isAdmin: false });
  }
});

// Ruta para servir archivos en '/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
