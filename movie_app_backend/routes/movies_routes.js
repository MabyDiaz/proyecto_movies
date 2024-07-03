import express from 'express';
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from '../controllers/movies_controller.js';

const router = express.Router();

router.post('/movies', createMovie);
router.get('/movies', getAllMovies);
router.get('/movies/:id', getMovieById);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

export default router;
