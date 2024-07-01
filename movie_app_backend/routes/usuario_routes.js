import express from 'express';
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  loginUser,
  getUserById,
} from '../controllers/usuario_controller.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';

const router = express.Router();

// Rutas de usuarios
router.post('/register', createUser); // Registrar un nuevo usuario
router.post('/login', loginUser); // Iniciar sesión
router.get('/users', getAllUsers); // Obtener todos los usuarios
router.get('/users/:id', getUserById); // Obtener un usuario por ID
router.put('/users/:id', updateUser); // Actualizar un usuario por ID
router.delete('/users/:id', deleteUser); // Eliminar un usuario por ID

// Ruta para el panel de administración
router.get('/admin_panel', verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({ message: 'Bienvenido al panel de administración' });
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  });
});

export default router;
