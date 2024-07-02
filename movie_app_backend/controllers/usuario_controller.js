import connection from '../db.js';
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
    connection.query(
      query,
      [
        nombre,
        apellido,
        email,
        hashedPassword,
        fechaNacimiento,
        pais,
        terminos,
      ],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al crear un usuario' });
        }
        res.status(201).json({
          message: 'Usuario creado exitosamente',
          userId: results.insertId,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Obtener todos los usuarios
export const getAllUsers = (req, res) => {
  const query = 'SELECT * FROM usuarios';
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    res.status(200).json(results);
  });
};

// Obtener un usuario por ID
export const getUserById = (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM usuarios WHERE id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving user data');
    } else if (results.length === 0) {
      return res.status(404).send('User not found');
    } else {
      return res.json(results[0]);
    }
  });
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, fechaNacimiento, pais, isAdmin } = req.body;

  const query = `
    UPDATE usuarios
    SET nombre = ?, apellido = ?, email = ?, fechaNacimiento = ?, pais = ?, isAdmin = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [nombre, apellido, email, fechaNacimiento, pais, isAdmin, id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: 'Error al actualizar el usuario' });
      }
      res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    }
  );
};

// Eliminar un usuario por ID
export const deleteUser = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting user' });
    }
    res
      .status(200)
      .json({ message: `Usuario con ID: ${id} eliminado correctamente` });
  });
};

// Iniciar sesión
export const loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log('Datos recibidos:', email, password);

  const query = 'SELECT * FROM usuarios WHERE email = ?';

  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al iniciar sesión' });
    }

    if (results.length === 0) {
      console.log('Email no encontrado');
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const user = results[0];
    console.log('Usuario encontrado:', user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Contraseña válida:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    req.session.userId = user.id;
    req.session.username = user.nombre;
    req.session.isAdmin = user.isAdmin;
    console.log('Sesión creada:', req.session);

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET_KEY, {
      expiresIn: '1h',
    });
    console.log('Token generado:', token);

    // Redirigir al usuario al index.html después de iniciar sesión
    res
      .status(200)
      .json({ token, isAdmin: user.isAdmin, redirectTo: '/index.html' });
  });
};
