import connection from '../db.js';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

dotenv.config();

// Crear una nueva película
export const createMovie = (req, res) => {
  const { titulo, descripcion, fechaEstreno, director, poster_path } = req.body;

  const query =
    'INSERT INTO peliculas (titulo, descripcion, fechaEstreno, director, poster_path) VALUES (?, ?, ?, ?, ?)';
  connection.query(
    query,
    [titulo, descripcion, fechaEstreno, director, poster_path],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al crear una película' });
      }
      res.status(201).json({
        message: 'Película creada exitosamente',
        movieId: results.insertId,
      });
    }
  );
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage }).single('poster_path');

// export const createMovie = (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Error al subir el archivo' });
//     }

//     const { titulo, descripcion, fechaEstreno, director } = req.body;
//     const poster_path = req.file ? req.file.path : null;

//     const query =
//       'INSERT INTO peliculas (titulo, descripcion, fechaEstreno, director, poster_path) VALUES (?, ?, ?, ?, ?)';
//     connection.query(
//       query,
//       [titulo, descripcion, fechaEstreno, director, poster_path],
//       (err, results) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Error al crear una película' });
//         }
//         res.status(201).json({
//           message: 'Película creada exitosamente',
//           movieId: results.insertId,
//         });
//       }
//     );
//   });
// };

// Obtener todas las películas
export const getAllMovies = (req, res) => {
  const query = 'SELECT * FROM peliculas';
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener películas' });
    }
    res.status(200).json(results);
  });
};

// Obtener una película por ID
export const getMovieById = (req, res) => {
  const movieId = req.params.id;
  const query = 'SELECT * FROM peliculas WHERE id = ?';
  connection.query(query, [movieId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener la película' });
    } else if (results.length === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    } else {
      return res.status(200).json(results[0]);
    }
  });
};

// Actualizar una película
export const updateMovie = (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    descripcion,
    fecha_de_lanzamiento,
    id_tmdb,
    calificacion,
    poster_path,
  } = req.body;

  const query =
    'UPDATE peliculas SET titulo = ?, descripcion = ?, fecha_de_lanzamiento = ?, id_tmdb = ?, calificacion = ?, poster_path = ? WHERE id = ?';
  connection.query(
    query,
    [
      titulo,
      descripcion,
      fecha_de_lanzamiento,
      id_tmdb,
      calificacion,
      poster_path,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: 'Error al actualizar la película' });
      }
      res.status(200).json({ message: 'Película actualizada exitosamente' });
    }
  );
};

// Eliminar una película por ID
export const deleteMovie = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM peliculas WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al eliminar la película' });
    }
    res
      .status(200)
      .json({ message: `Película con ID: ${id} eliminada correctamente` });
  });
};

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    const moviesWithImages = movies.map((movie) => {
      return {
        ...movie.dataValues,
        poster: `/uploads/${movie.poster}`,
      };
    });
    res.json(moviesWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching movies' });
  }
};
