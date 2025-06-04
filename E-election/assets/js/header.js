document.addEventListener('DOMContentLoaded', function() {
  // Activation onglet courant
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Dropdowns
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const parent = this.closest('.dropdown');
      parent.classList.toggle('show');
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  });

  // Ouvre le panneau latéral au clic sur "Moi"
  const moiLink = document.getElementById('moiLink');
  if (moiLink) {
    moiLink.addEventListener('click', function(e) {
      e.preventDefault();
      openPanel();
    });
  }

  // Fonctions d'ouverture/fermeture du panneau
  function openPanel() {
    // Simule des données utilisateur (à remplacer par les vraies données)
    const user = {
      photo: localStorage.getItem('user_photo') || '../assets/img/user.png',
      username: localStorage.getItem('user_username') || 'utilisateur',
      statut: localStorage.getItem('user_role') || 'Utilisateur',
      nom: localStorage.getItem('user_nom') || 'Doe',
      prenom: localStorage.getItem('user_prenom') || 'John',
      classe: localStorage.getItem('user_classe') || 'AS1'
    };
    document.getElementById('profilePhoto').src = user.photo;
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileStatut').textContent = user.statut.charAt(0).toUpperCase() + user.statut.slice(1);
    document.getElementById('profileNomPrenom').textContent = user.nom + ' ' + user.prenom;
    document.getElementById('profileClasse').textContent = user.classe;

    document.getElementById('sidePanel').classList.add('open');
    document.getElementById('sidePanelBg').classList.add('open');
  }
  function closePanel() {
    document.getElementById('sidePanel').classList.remove('open');
    document.getElementById('sidePanelBg').classList.remove('open');
  }
  document.getElementById('closePanelBtn').onclick = closePanel;
  document.getElementById('sidePanelBg').onclick = closePanel;

  // Déconnexion
  document.getElementById('logoutBtn').onclick = function() {
    localStorage.clear();
    window.location.href = "../Home.html";
  };
});