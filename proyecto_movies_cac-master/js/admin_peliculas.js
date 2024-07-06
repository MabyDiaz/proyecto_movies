const isProduction = window.location.hostname !== 'localhost';
const API_BASE_URL = isProduction
  ? 'https://https://proyecto-movies-7vlw.onrender.com'
  : 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();

  // Modal de eliminación
  const deleteModal = document.getElementById('deleteConfirmationModal');
  const closeDeleteModal = document.querySelector('.close-delete');
  const cancelDeleteButton = document.getElementById('cancelDelete');

  if (closeDeleteModal) {
    closeDeleteModal.onclick = function () {
      deleteModal.style.display = 'none';
    };
  }

  if (cancelDeleteButton) {
    cancelDeleteButton.onclick = function () {
      deleteModal.style.display = 'none';
    };
  }

  window.onclick = function (event) {
    if (event.target === deleteModal) {
      deleteModal.style.display = 'none';
    }
  };

  // Modal de edición
  const editModal = document.getElementById('editMovieModal');
  const closeEditModal = document.querySelector('.close-edit');
  const cancelEditButton = document.getElementById('cancelEdit');

  if (closeEditModal) {
    closeEditModal.onclick = function () {
      editModal.style.display = 'none';
    };
  }

  if (cancelEditButton) {
    cancelEditButton.onclick = function () {
      editModal.style.display = 'none';
    };
  }

  window.onclick = function (event) {
    if (event.target === editModal) {
      editModal.style.display = 'none';
    }
  };
});

// Modal de creación
const createModal = document.getElementById('createMovieModal');
const openCreateModalButton = document.getElementById('openCreateModal');
const closeCreateModalButton = document.querySelector('.close-create');
const cancelCreateButton = document.getElementById('cancelCreate');

if (openCreateModalButton) {
  openCreateModalButton.onclick = function () {
    createModal.style.display = 'block';
  };
}

if (closeCreateModalButton) {
  closeCreateModalButton.onclick = function () {
    createModal.style.display = 'none';
  };
}

if (cancelCreateButton) {
  cancelCreateButton.onclick = function () {
    createModal.style.display = 'none';
  };
}

window.onclick = function (event) {
  if (event.target === createModal) {
    editModal.style.display = 'none';
  }
};

const successMessage = document.getElementById('success-message');

// Función para obtener y mostrar películas
function fetchMovies() {
  fetch(`${API_BASE_URL}/movies`)
    .then((response) => response.json())
    .then((movies) => {
      const movieList = document.getElementById('movie-list');
      movieList.innerHTML = ''; // Limpiamos el contenido anterior

      movies.forEach((movie) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${movie.id}</td>
          <td>${movie.titulo}</td>
          <td>${movie.descripcion}</td>
          <td>${movie.fecha_de_lanzamiento}</td>
          <td>${movie.id_tmdb}</td>
          <td>${movie.calificacion}</td>
          <td><img src="${movie.poster_path}" alt="Poster" style="max-width: 100px; max-height: 150px;"></td>
          <td class="btn-action">
            <button class="admin-btn admin-btn-view" onclick="viewMovie(${movie.id})">Ver</button>
            <button class="admin-btn admin-btn-edit" onclick="editMovie(${movie.id})">Editar</button>
            <button class="admin-btn admin-btn-delete" onclick="confirmDeleteMovie(${movie.id})">Eliminar</button>
          </td>
        `;
        movieList.appendChild(row);
      });
    })
    .catch((error) => console.error('Error fetching movies:', error));
}

// Manejar el envío del formulario de creación de película
document
  .getElementById('createMovieForm')
  .addEventListener('submit', (event) => {
    event.preventDefault();

    const movieTitle = document.getElementById('createMovieTitle').value;
    const movieDescription = document.getElementById(
      'createMovieDescription'
    ).value;
    const movieDate = document.getElementById('createMovieDate').value;
    const movieIdTmdb = document.getElementById('createMovieTmdb').value;
    const movieCalif = document.getElementById('createMovieCalif').value;
    const moviePoster = document.getElementById('createMoviePoster').value;

    fetch(`${API_BASE_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: movieTitle,
        descripcion: movieDescription,
        fecha_de_lanzamiento: movieDate,
        id_tmdb: movieIdTmdb,
        calificacion: movieCalif,
        poster_path: moviePoster,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);

        // Mostrar mensaje de éxito
        successMessage.style.display = 'block';
        // Ocultar el mensaje después de 1.5 segundos y cerrar el modal
        setTimeout(() => {
          successMessage.style.display = 'none';
          createModal.style.display = 'none';
          // Restablecer el formulario
          document.getElementById('createMovieForm').reset();
        }, 1500);
        fetchMovies(); // Actualiza la lista de películas después de crear
      })
      .catch((error) => console.error('Error:', error));
  });

// Manejar el envío del formulario de edición de película
document.getElementById('editMovieForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const movieId = document.getElementById('editMovieId').value;
  const movieTitle = document.getElementById('editMovieTitle').value;
  const movieDescription = document.getElementById(
    'editMovieDescription'
  ).value;
  const movieDate = document.getElementById('editMovieDate').value;
  const movieTmdb = document.getElementById('editMovieTmdb').value;
  const movieCalif = document.getElementById('editMovieCalif').value;
  const moviePoster = document.getElementById('editMoviePoster').value;

  fetch(`${API_BASE_URL}/movies/${movieId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      titulo: movieTitle,
      descripcion: movieDescription,
      fecha_de_lanzamiento: movieDate,
      id_tmdb: movieTmdb,
      calificacion: movieCalif,
      poster_path: moviePoster,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      document.getElementById('editMovieModal').style.display = 'none';
      fetchMovies(); // Actualiza la lista de películas después de editar
    })
    .catch((error) => console.error('Error:', error));
});

// Función para ver detalles de una película
function viewMovie(movieId) {
  fetch(`${API_BASE_URL}/movies/${movieId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((movie) => {
      document.getElementById('modalMovieId').innerText = movie.id;
      document.getElementById('modalMovieTitle').innerText = movie.titulo;
      document.getElementById('modalMovieDescription').innerText =
        movie.descripcion;
      document.getElementById('modalMovieDate').innerText =
        movie.fecha_de_lanzamiento;
      document.getElementById('modalMovieTmdb').innerText = movie.id_tmdb;
      document.getElementById('modalMovieCalif').innerText = movie.calificacion;
      document.getElementById('modalMoviePoster').src = `/${movie.poster_path}`;
      document.getElementById('movieModal').style.display = 'block';

      // Configurar el botón de cerrar modal
      const closeMovieModal = document.querySelector('#movieModal .close');
      closeMovieModal.onclick = function () {
        movieModal.style.display = 'none';
      };
    })
    .catch((error) => console.error('Error fetching movie details:', error));
}

// Función para editar una película
function editMovie(movieId) {
  fetch(`${API_BASE_URL}/movies/${movieId}`)
    .then((response) => response.json())
    .then((movie) => {
      document.getElementById('editMovieId').value = movie.id;
      document.getElementById('editMovieTitle').value = movie.titulo;
      document.getElementById('editMovieDescription').value = movie.descripcion;
      document.getElementById('editMovieDate').value =
        movie.fecha_de_lanzamiento;
      document.getElementById('editMovieTmdb').value = movie.id_tmdb;
      document.getElementById('editMovieCalif').value = movie.calificacion;
      document.getElementById('editMoviePoster').value = movie.poster_path;

      const editMovieModal = document.getElementById('editMovieModal');
      editMovieModal.style.display = 'block';
    })
    .catch((error) => console.error('Error fetching movie details:', error));
}

// Función para confirmar eliminación de una película
function confirmDeleteMovie(movieId) {
  document.getElementById('confirmDelete').onclick = function () {
    deleteMovie(movieId);
  };

  const deleteConfirmationModal = document.getElementById(
    'deleteConfirmationModal'
  );
  deleteConfirmationModal.style.display = 'block';
}

// Función para eliminar una película
function deleteMovie(movieId) {
  fetch(`${API_BASE_URL}/movies/${movieId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      document.getElementById('deleteConfirmationModal').style.display = 'none';
      fetchMovies(); // Actualiza la lista de películas después de eliminar
    })
    .catch((error) => console.error('Error:', error));
}
