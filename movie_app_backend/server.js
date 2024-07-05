import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/usuario_routes.js';
import moviesRoutes from './routes/movies_routes.js';
import { createUser, loginUser } from './controllers/usuario_controller.js';
import dotenv from 'dotenv';
import session from 'express-session';
import dbConnection from './db.js';
import multer from 'multer';

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const port = process.env.PORT || 3000;

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
    store: sessionStore,
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
app.post('/register', createUser); // para registrar un nuevo usuario
app.post('/login', loginUser); // para iniciar sesión

// Endpoint para subir imágenes
app.post('/upload', upload.single('file'), (req, res) => {
  // Aquí puedes procesar el archivo subido si es necesario
  res.json({ filename: req.file.filename }); // Devuelve el nombre del archivo guardado
});

// Endpoint para subir imágenes
app.post('/upload', upload.single('file'), (req, res) => {
  // Aquí puedes procesar el archivo subido si es necesario
  res.json({ filename: req.file.filename }); // Devuelve el nombre del archivo guardado
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
