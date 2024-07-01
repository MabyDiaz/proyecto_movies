document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');
  const adminPanelLink = document.getElementById('adminPanelLink');

  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  updateLoginStatus(!!token);

  if (token && isAdmin) {
    adminPanelLink.style.display = 'block';
  }

  logoutLink.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    updateLoginStatus(false);
    window.location.href = '/index.html';
  });
});

function updateLoginStatus(isLoggedIn) {
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');
  const adminPanelLink = document.getElementById('adminPanelLink');

  if (isLoggedIn) {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'block';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
      adminPanelLink.style.display = 'block';
    }
  } else {
    loginLink.style.display = 'block';
    logoutLink.style.display = 'none';
    adminPanelLink.style.display = 'none';
  }
}
