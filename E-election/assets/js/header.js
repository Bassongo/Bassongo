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

  const profileBtn = document.getElementById('profileBtn');
  const panel = document.getElementById('profilePanel');
  const panelBg = document.getElementById('profilePanelBg');
  const closePanelBtn = document.getElementById('closeProfilePanel');

  function renderProfile() {
    const info = document.getElementById('profilePanelInfo');
    const actions = document.getElementById('panelActions');
    const dateEl = document.getElementById('panelCreationDate');
    if (!info || !actions || !dateEl) return;

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      info.innerHTML = '<p>Aucun utilisateur connecté.</p>';
      actions.innerHTML = '';
      dateEl.textContent = '';
      return;
    }
    const inscr = user.inscritDepuis ? new Date(user.inscritDepuis).toLocaleDateString() : '';
    info.innerHTML = `${user.photo ? `<img src="${user.photo}" class="profile-photo" alt="photo">` : ''}` +
      `<p><strong>@</strong>${user.username}</p>` +
      `${user.nom ? `<p>${user.nom} ${user.prenom || ''}</p>` : ''}` +
      `${user.classe ? `<p>${user.classe}</p>` : ''}`;

    let html = '';
    if (user.role === 'admin') {
      html += `<a class="admin-btn" href="../pages/admin_accueil.html">Admin</a>`;
    }
    const comites = JSON.parse(localStorage.getItem('comites') || '{}');
    const cats = Object.keys(comites).filter(c => (comites[c] || []).some(m => m.email === user.email));
    if (cats.length > 0) {
      html += `<div class="committee-section" style="text-align:center;margin-top:1rem;">
        <button class="admin-btn" id="startCandPanel">Ouvrir candidatures</button>
        <button class="admin-btn danger" id="stopCandPanel">Fermer candidatures</button>
        <button class="admin-btn" id="startVotePanel">Ouvrir votes</button>
        <button class="admin-btn danger" id="stopVotePanel">Fermer votes</button>
      </div>`;
    }
    actions.innerHTML = html;
    dateEl.innerHTML = inscr ? `Inscrit depuis : ${inscr}` : '';

    if (cats.length > 0) {
      document.getElementById('startCandPanel').onclick = () => {
        const type = cats.length === 1 ? cats[0] : prompt('Catégorie ?', cats[0]);
        if (!type) return;
        const debut = Date.parse(prompt('Début (YYYY-MM-DDTHH:MM)'));
        const fin = Date.parse(prompt('Fin (YYYY-MM-DDTHH:MM)'));
        if (isNaN(debut) || isNaN(fin) || debut >= fin) { alert('Dates invalides'); return; }
        if (isCandidatureActive(type)) { alert('Une session est déjà ouverte'); return; }
        startCandidature(type, debut, fin);
        alert('Candidatures ouvertes pour ' + type.toUpperCase());
      };
      document.getElementById('stopCandPanel').onclick = () => {
        const type = cats.length === 1 ? cats[0] : prompt('Catégorie ?', cats[0]);
        if (!type) return;
        if (!isCandidatureActive(type)) { alert('Pas de session ouverte'); return; }
        endCandidature(type);
        alert('Candidatures fermées pour ' + type.toUpperCase());
      };
      document.getElementById('startVotePanel').onclick = () => {
        const type = cats.length === 1 ? cats[0] : prompt('Catégorie ?', cats[0]);
        if (!type) return;
        const debut = Date.parse(prompt('Début (YYYY-MM-DDTHH:MM)'));
        const fin = Date.parse(prompt('Fin (YYYY-MM-DDTHH:MM)'));
        if (isNaN(debut) || isNaN(fin) || debut >= fin) { alert('Dates invalides'); return; }
        if (isVoteActive(type)) { alert('Une session est déjà ouverte'); return; }
        const cands = JSON.parse(localStorage.getItem('candidatures') || '[]').filter(c => c.type && c.type.toLowerCase() === type);
        if (cands.length === 0) { alert('Aucun candidat pour cette catégorie'); return; }
        if (isCandidatureActive(type)) { alert('La candidature est encore ouverte'); return; }
        startVote(type, debut, fin);
        alert('Votes ouverts pour ' + type.toUpperCase());
      };
      document.getElementById('stopVotePanel').onclick = () => {
        const type = cats.length === 1 ? cats[0] : prompt('Catégorie ?', cats[0]);
        if (!type) return;
        if (!isVoteActive(type)) { alert('Pas de vote en cours'); return; }
        endVote(type);
        alert('Votes fermés pour ' + type.toUpperCase());
      };
    }
  }

  function openPanel() {
    renderProfile();
    if (panel) panel.classList.add('open');
    if (panelBg) panelBg.classList.add('open');
  }
  function closePanel() {
    if (panel) panel.classList.remove('open');
    if (panelBg) panelBg.classList.remove('open');
  }

  if (profileBtn) profileBtn.addEventListener('click', e => { e.preventDefault(); openPanel(); });
  if (closePanelBtn) closePanelBtn.addEventListener('click', closePanel);
  if (panelBg) panelBg.addEventListener('click', closePanel);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}
