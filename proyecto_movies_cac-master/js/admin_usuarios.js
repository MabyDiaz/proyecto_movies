const API_BASE_URL = 'https://proyecto-movies-7vlw.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();

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
  const editModal = document.getElementById('editUserModal');
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

// Modal de ver usuario
const viewModal = document.getElementById('userModal');
const closeViewModal = document.querySelector('.close');

if (closeViewModal) {
  closeViewModal.onclick = function () {
    viewModal.style.display = 'none';
  };
}

window.onclick = function (event) {
  if (event.target === viewModal) {
    viewModal.style.display = 'none';
  }
};

function fetchUsers() {
  fetch(`${API_BASE_URL}/users`)
    .then((response) => response.json())
    .then((users) => {
      const userList = document.getElementById('user-list');
      userList.innerHTML = '';
      users.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.nombre}</td>
          <td>${user.apellido}</td>
          <td>${user.email}</td>
          <td>${user.fechaNacimiento}</td>
          <td>${user.pais}</td>
           <td>${user.isAdmin ? 'Sí' : 'No'}</td>
          <td>
            <button class="admin-btn admin-btn-view" onclick="viewUser(${
              user.id
            })">Ver</button>
            <button class="admin-btn admin-btn-edit" onclick="editUser(${
              user.id
            })">Editar</button>
            <button class="admin-btn admin-btn-delete" onclick="confirmDeleteUser(${
              user.id
            })">Eliminar</button>
          </td>
        `;
        userList.appendChild(row);
      });
    })
    .catch((error) => console.error('Error fetching users:', error));
}

// Manejar el envío del formulario de edición de usuario
document.getElementById('editUserForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const userId = document.getElementById('editUserId').value;
  const userName = document.getElementById('editUserName').value;
  const userSurname = document.getElementById('editUserSurname').value;
  const userEmail = document.getElementById('editUserEmail').value;
  const userBirthdate = document.getElementById('editUserBirthdate').value;
  const userCountry = document.getElementById('editUserCountry').value;
  const userIsAdmin = document.getElementById('editUserIsAdmin').checked;

  fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre: userName,
      apellido: userSurname,
      email: userEmail,
      fechaNacimiento: userBirthdate,
      pais: userCountry,
      isAdmin: userIsAdmin,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      document.getElementById('editUserModal').style.display = 'none';
      fetchUsers(); // Actualiza la lista de usuarios después de editar
    })
    .catch((error) => console.error('Error:', error));
});

function viewUser(userId) {
  fetch(`${API_BASE_URL}/users/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((user) => {
      document.getElementById('modalUserId').innerText = user.id;
      document.getElementById('modalUserName').innerText = user.nombre;
      document.getElementById('modalUserSurname').innerText = user.apellido;
      document.getElementById('modalUserEmail').innerText = user.email;
      document.getElementById('modalUserBirthdate').innerText =
        user.fechaNacimiento;
      document.getElementById('modalUserCountry').innerText = user.pais;
      document.getElementById('modalUserIsAdmin').innerText = user.isAdmin
        ? 'Sí'
        : 'No';
      document.getElementById('userModal').style.display = 'block';
    })
    .catch((error) => console.error('Error fetching user details:', error));
}

function editUser(userId) {
  fetch(`${API_BASE_URL}users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      document.getElementById('editUserId').value = user.id;
      document.getElementById('editUserName').value = user.nombre;
      document.getElementById('editUserSurname').value = user.apellido;
      document.getElementById('editUserEmail').value = user.email;
      document.getElementById('editUserBirthdate').value = user.fechaNacimiento;
      document.getElementById('editUserCountry').value = user.pais;
      document.getElementById('editUserIsAdmin').checked = user.isAdmin;

      const editUserModal = document.getElementById('editUserModal');
      editUserModal.style.display = 'block';
    })
    .catch((error) => console.error('Error fetching user details:', error));
}

function updateUser() {
  const userId = document.getElementById('userId').value;
  const user = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    email: document.getElementById('email').value,
    fechaNacimiento: document.getElementById('fechaNacimiento').value,
    pais: document.getElementById('pais').value,
    isAdmin: document.getElementById('isAdmin'),
  };

  fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      document.getElementById('editUserModal').style.display = 'none';
      fetchUsers(); // Actualiza la lista de usuarios después de la edición
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//Eliminar pelicula
function confirmDeleteUser(userId) {
  document.getElementById('confirmDelete').onclick = function () {
    deleteUser(userId);
  };

  const deleteConfirmationModal = document.getElementById(
    'deleteConfirmationModal'
  );
  deleteConfirmationModal.style.display = 'block';
}

function deleteUser(userId) {
  fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      document.getElementById('deleteConfirmationModal').style.display = 'none';
      fetchUsers(); // Actualiza la lista de usuarios después de eliminar
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
