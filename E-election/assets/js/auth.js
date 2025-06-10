// assets/js/auth.js
// Redirects to login page if user not authenticated

document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = '../login.html';
    return;
  }
  fetch('/api/me', { headers: { 'Authorization': 'Bearer ' + token } })
    .then(resp => {
      if (!resp.ok) {
        sessionStorage.removeItem('token');
        window.location.href = '../login.html';
      }
    })
    .catch(() => {
      sessionStorage.removeItem('token');
      window.location.href = '../login.html';
    });
});
