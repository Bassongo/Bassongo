// assets/js/auth.js
// Simple authentication guard for pages requiring login

function requireAuth() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    const path = location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
    window.location.href = path;
  }
}

// Automatically check auth when included
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', requireAuth);
} else {
  requireAuth();
}
