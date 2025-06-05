document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('profileContainer');
  const userData = JSON.parse(localStorage.getItem('currentUser'));
  if (userData) {
    const inscription = userData.inscritDepuis ? new Date(userData.inscritDepuis).toLocaleDateString() : '';
    container.innerHTML = `
      <h2>Mon profil</h2>
      <div class="profile-info">
        <p><strong>Nom d'utilisateur:</strong> ${userData.username}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Classe:</strong> ${userData.classe}</p>
        <p><strong>Inscrit depuis:</strong> ${inscription}</p>
      </div>
    `;
  } else {
    container.innerHTML = '<p>Aucun utilisateur connect\u00e9.</p>';
  }
});
