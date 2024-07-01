// document.addEventListener('DOMContentLoaded', () => {
//   // Comprobar si el usuario es administrador
//   fetch('/api/check-admin', { credentials: 'include' })
//     .then((response) => response.json())
//     .then((data) => {
//       const adminPanelLink = document.getElementById('adminPanelLink');
//       const adminLink = document.getElementById('adminLink');

//       if (data.isAdmin) {
//         if (adminPanelLink) {
//           adminPanelLink.style.display = 'block';
//         }
//         if (adminLink) {
//           adminLink.style.display = 'block';
//         }
//       }
//     })
//     .catch((error) => console.error('Error:', error));
// });

document.addEventListener('DOMContentLoaded', () => {
  const adminPanelLink = document.getElementById('adminPanelLink');
  const token = localStorage.getItem('token');

  if (token) {
    fetch('/api/check-admin', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAdmin) {
          localStorage.setItem('isAdmin', 'true');
          if (adminPanelLink) {
            adminPanelLink.style.display = 'block';
          }
        }
      })
      .catch((error) => console.error('Error:', error));
  }
});
