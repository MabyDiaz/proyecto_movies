import pool from '../db.js';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

dotenv.config();

// // Crear una nueva película
// export const createMovie = (req, res) => {
//   const {
//     titulo,
//     descripcion,
//     fecha_de_lanzamiento,
//     id_tmdb,
//     calificacion,
//     poster_path,
//   } = req.body;

//   // Validación básica de campos obligatorios
//   if (
//     !titulo ||
//     !descripcion ||
//     !fecha_de_lanzamiento ||
//     !id_tmdb ||
//     !calificacion ||
//     !poster_path
//   ) {
//     return res.status(400).json({ error: 'Todos los campos son obligatorios' });
//   }

//   // Procesamiento de datos antes de insertar en la base de datos
//   const movieData = {
//     titulo: titulo.trim(),
//     descripcion: descripcion.trim(),
//     fecha_de_lanzamiento: fecha_de_lanzamiento.trim(),
//     id_tmdb: id_tmdb.trim(),
//     calificacion: calificacion.trim(),
//     poster_path: poster_path.trim(),
//   };

//   // Insertar datos en la base de datos
//   const query = 'INSERT INTO peliculas SET ?';

//   pool.query(query, movieData, (error, results, fields) => {
//     if (error) {
//       console.error('Error al insertar la película:', error);
//       return res.status(500).json({ error: 'Error interno del servidor' });
//     }

//     console.log('Película creada exitosamente:', results.insertId);
//     return res.status(201).json({
//       message: 'Película creada exitosamente',
//       movieId: results.insertId,
//     });
//   });
// };

// // Obtener todas las películas
// export const getAllMovies = (req, res) => {
//   const query = 'SELECT * FROM peliculas';
//   pool.query(query, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Error al obtener películas' });
//     }
//     console.log('Results:', results);
//     res.status(200).json(results);
//   });
// };

// // Obtener una película por ID
// export const getMovieById = (req, res) => {
//   const movieId = req.params.id;
//   const query = 'SELECT * FROM peliculas WHERE id = ?';
//   pool.query(query, [movieId], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Error al obtener la película' });
//     } else if (results.length === 0) {
//       return res.status(404).json({ error: 'Película no encontrada' });
//     } else {
//       return res.status(200).json(results[0]);
//     }
//   });
// };

// // Actualizar una película
// export const updateMovie = (req, res) => {
//   const { id } = req.params;
//   const {
//     titulo,
//     descripcion,
//     fecha_de_lanzamiento,
//     id_tmdb,
//     calificacion,
//     poster_path,
//   } = req.body;

//   const query =
//     'UPDATE peliculas SET titulo = ?, descripcion = ?, fecha_de_lanzamiento = ?, id_tmdb = ?, calificacion = ?, poster_path = ? WHERE id = ?';
//   pool.query(
//     query,
//     [
//       titulo,
//       descripcion,
//       fecha_de_lanzamiento,
//       id_tmdb,
//       calificacion,
//       poster_path,
//       id,
//     ],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         return res
//           .status(500)
//           .json({ error: 'Error al actualizar la película' });
//       }
//       res.status(200).json({ message: 'Película actualizada exitosamente' });
//     }
//   );
// };

// Crear una nueva película
export const createMovie = async (req, res) => {
  const {
    titulo,
    descripcion,
    fecha_de_lanzamiento,
    id_tmdb,
    calificacion,
    poster_path,
  } = req.body;

  if (
    !titulo ||
    !descripcion ||
    !fecha_de_lanzamiento ||
    !id_tmdb ||
    !calificacion ||
    !poster_path
  ) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const movieData = {
    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
    fecha_de_lanzamiento: fecha_de_lanzamiento.trim(),
    id_tmdb: id_tmdb.trim(),
    calificacion: calificacion.trim(),
    poster_path: poster_path.trim(),
  };

  try {
    const [results] = await pool.query(
      'INSERT INTO peliculas SET ?',
      movieData
    );
    console.log('Película creada exitosamente:', results.insertId);
    res.status(201).json({
      message: 'Película creada exitosamente',
      movieId: results.insertId,
    });
  } catch (error) {
    console.error('Error al insertar la película:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todas las películas
export const getAllMovies = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM peliculas');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener películas:', error);
    res.status(500).json({ error: 'Error al obtener películas' });
  }
};

// Obtener una película por ID
export const getMovieById = async (req, res) => {
  const movieId = req.params.id;
  try {
    const [results] = await pool.query('SELECT * FROM peliculas WHERE id = ?', [
      movieId,
    ]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    res.status(200).json(results[0]);
  } catch (error) {
    console.error('Error al obtener la película:', error);
    res.status(500).json({ error: 'Error al obtener la película' });
  }
};

// Actualizar una película
export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    descripcion,
    fecha_de_lanzamiento,
    id_tmdb,
    calificacion,
    poster_path,
  } = req.body;

  try {
    await pool.query(
      'UPDATE peliculas SET titulo = ?, descripcion = ?, fecha_de_lanzamiento = ?, id_tmdb = ?, calificacion = ?, poster_path = ? WHERE id = ?',
      [
        titulo,
        descripcion,
        fecha_de_lanzamiento,
        id_tmdb,
        calificacion,
        poster_path,
        id,
      ]
    );
    res.status(200).json({ message: 'Película actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la película:', error);
    res.status(500).json({ error: 'Error al actualizar la película' });
  }
};

// Eliminar una película por ID
export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM peliculas WHERE id = ?';
  try {
    await pool.query(query, [id]);
    res
      .status(200)
      .json({ message: `Película con ID: ${id} eliminada correctamente` });
  } catch (error) {
    console.error('Error al eliminar la película:', error);
    res.status(500).json({ error: 'Error al eliminar la película' });
  }
};

