function initHeader() {
  // Activation onglet courant
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      if (this.classList.contains('disabled-link')) {
        e.preventDefault();
        alert("Cette page est désactivée pour le moment.");
        return;
      }
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Pour que le clic sur .dropdown-toggle ouvre/ferme le menu
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

  function toggleLink(selector, disabled) {
    const link = document.querySelector(selector);
    if (!link) return;
    if (disabled) {
      link.classList.add('disabled-link');
    } else {
      link.classList.remove('disabled-link');
    }
  }

  function updateNavVisibility() {
    const state = getState();
    const candidatureOn = isCandidatureActive();
    const voteOn = isVoteActive();

    toggleLink('a[href$="candidat.html"]', !candidatureOn);
    toggleLink('a[href$="campagnes.html"]', !candidatureOn);
    toggleLink('a[href$="vote.html"]', !voteOn);

    const categories = ['aes', 'classe', 'club'];
    let canSeeStats = false;
    let showResults = false;
    categories.forEach(cat => {
      const v = cat === 'club' ? state.vote.club : state.vote[cat];
      if (!v) return;
      if (v.active && userHasVoted(cat)) canSeeStats = true;
      if (!v.active && v.endTime && Date.now() >= v.endTime && Date.now() <= v.endTime + 7 * 24 * 60 * 60 * 1000) {
        showResults = true;
      }
    });
    toggleLink('a[href$="statistique.html"]', !canSeeStats);
    toggleLink('a[href$="resultat.html"]', !showResults);
  }

  document.addEventListener('DOMContentLoaded', updateNavVisibility);
  document.addEventListener('stateChanged', updateNavVisibility);

  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (user && user.role === 'admin') {
    showAdminSidebar();
  }
}

function showAdminSidebar() {
  if (document.getElementById('adminSidebarContainer')) return;
  const container = document.createElement('div');
  container.id = 'adminSidebarContainer';
  document.body.prepend(container);

  const prefix = location.pathname.includes('/pages/') ? '../' : './';
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = prefix + 'assets/css/admin_sidebar.css';
  document.head.appendChild(link);

  fetch(prefix + 'components/admin_sidebar.html')
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      const script = document.createElement('script');
      script.src = prefix + 'assets/js/admin_accueil.js';
      document.body.appendChild(script);
    })
    .catch(err => console.error('Erreur chargement admin sidebar:', err));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}
