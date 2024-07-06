import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.KEY;

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  const { nombre, apellido, email, password, fechaNacimiento, pais, terminos } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      'INSERT INTO usuarios (nombre, apellido, email, password, fechaNacimiento, pais, terminos) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [results] = await pool.query(query, [
      nombre,
      apellido,
      email,
      hashedPassword,
      fechaNacimiento,
      pais,
      terminos,
    ]);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      userId: results.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  const query = 'SELECT * FROM usuarios';

  try {
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM usuarios WHERE id = ?';

  try {
    const [results] = await pool.query(query, [userId]);
    if (results.length === 0) {
      return res.status(404).send('User not found');
    } else {
      return res.json(results[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving user data');
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, fechaNacimiento, pais, isAdmin } = req.body;

  const query =
    'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, fechaNacimiento = ?, pais = ?, isAdmin = ? WHERE id = ?';

  try {
    await pool.query(query, [
      nombre,
      apellido,
      email,
      fechaNacimiento,
      pais,
      isAdmin,
      id,
    ]);
    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario por ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id = ?';

  try {
    await pool.query(query, [id]);
    res
      .status(200)
      .json({ message: `Usuario con ID: ${id} eliminado correctamente` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

// Iniciar sesión
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ?';

  try {
    const [results] = await pool.query(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    req.session.userId = user.id;
    req.session.username = user.nombre;
    req.session.isAdmin = user.isAdmin;

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res
      .status(200)
      .json({ token, isAdmin: user.isAdmin, redirectTo: '/index.html' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
