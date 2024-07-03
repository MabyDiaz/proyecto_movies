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

  // Manejar el envío del formulario de creación de película
  document
    .getElementById('createMovieForm')
    .addEventListener('submit', (event) => {
      event.preventDefault();

      const movieTitle = document.getElementById('createMovieTitle').value;
      const movieDescription = document.getElementById(
        'createMovieDescription'
      ).value;
      const movieReleaseDate = document.getElementById(
        'createMovieReleaseDate'
      ).value;
      const movieDirector = document.getElementById(
        'createMovieDirector'
      ).value;
      const moviePoster = document.getElementById('createMoviePoster').value;

      fetch('http://localhost:3000/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: movieTitle,
          descripcion: movieDescription,
          fechaEstreno: movieReleaseDate,
          director: movieDirector,
          poster_path: moviePoster,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          createModal.style.display = 'none';
          fetchMovies(); // Actualiza la lista de películas después de crear una nueva
        })
        .catch((error) => console.error('Error:', error));
    });
});

// Función para obtener y mostrar películas
function fetchMovies() {
  fetch('http://localhost:3000/movies')
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

// Función para ver detalles de una película
function viewMovie(movieId) {
  fetch(`http://localhost:3000/movies/${movieId}`)
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
      document.getElementById('modalMovieReleaseDate').innerText =
        movie.fechaEstreno;
      document.getElementById('modalMovieDirector').innerText = movie.director;
      document.getElementById('modalMoviePoster').src = movie.poster_path;
      document.getElementById('movieModal').style.display = 'block';
    })
    .catch((error) => console.error('Error fetching movie details:', error));
}

// Función para editar una película
function editMovie(movieId) {
  fetch(`http://localhost:3000/movies/${movieId}`)
    .then((response) => response.json())
    .then((movie) => {
      document.getElementById('editMovieId').value = movie.id;
      document.getElementById('editMovieTitle').value = movie.titulo;
      document.getElementById('editMovieDescription').value = movie.descripcion;
      document.getElementById('editMovieReleaseDate').value =
        movie.fechaEstreno;
      document.getElementById('editMovieDirector').value = movie.director;

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
  fetch(`http://localhost:3000/movies/${movieId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      document.getElementById('deleteConfirmationModal').style.display = 'none';
      fetchMovies(); // Actualiza la lista de películas después de eliminar
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

document
  .getElementById('createMovieForm')
  .addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      'file',
      document.getElementById('createMoviePoster').files[0]
    );

    fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const movieTitle = document.getElementById('createMovieTitle').value;
        const movieDescription = document.getElementById(
          'createMovieDescription'
        ).value;
        const movieReleaseDate = document.getElementById(
          'createMovieReleaseDate'
        ).value;
        const movieDirector = document.getElementById(
          'createMovieDirector'
        ).value;
        const moviePosterPath = `uploads/${data.filename}`;

        // Luego de obtener el nombre del archivo, envía los datos de la película al endpoint de películas
        fetch('http://localhost:3000/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            titulo: movieTitle,
            descripcion: movieDescription,
            fechaEstreno: movieReleaseDate,
            director: movieDirector,
            poster_path: moviePosterPath,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Película creada con éxito:', data);
            createModal.style.display = 'none';
            fetchMovies(); // Actualiza la lista de películas después de crear una nueva
          })
          .catch((error) =>
            console.error('Error al crear la película:', error)
          );
      })
      .catch((error) => console.error('Error al subir la imagen:', error));
  });
