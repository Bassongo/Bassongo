document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('profileContainer');
  const actionsContainer = document.getElementById('committeeActions');
  const userData = JSON.parse(localStorage.getItem('currentUser'));
  if (!userData) {
    container.innerHTML = '<p>Aucun utilisateur connecté.</p>';
    return;
  }

  const inscription = userData.inscritDepuis ? new Date(userData.inscritDepuis).toLocaleDateString() : '';
  container.innerHTML = `
    <h2>Mon profil</h2>
    <div class="profile-info">
      ${userData.photo ? `<img src="${userData.photo}" class="profile-photo" alt="photo">` : ''}
      ${userData.nom ? `<p><strong>Nom:</strong> ${userData.nom}</p>` : ''}
      ${userData.prenom ? `<p><strong>Prénom:</strong> ${userData.prenom}</p>` : ''}
      <p><strong>Nom d'utilisateur:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      ${userData.classe ? `<p><strong>Classe:</strong> ${userData.classe}</p>` : ''}
      ${userData.nationalite ? `<p><strong>Nationalité:</strong> ${userData.nationalite}</p>` : ''}
      <p><strong>Inscrit depuis:</strong> ${inscription}</p>
    </div>
  `;

  showCommitteeActions(userData, actionsContainer);
});

function showCommitteeActions(user, container) {
  const comites = JSON.parse(localStorage.getItem('comites')) || {};
  const categories = Object.keys(comites).filter(cat =>
    (comites[cat] || []).some(m => m.email === user.email)
  );
  if (categories.length === 0) return;

  categories.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'committee-section';
    section.innerHTML = `
      <h3>${cat.toUpperCase()}</h3>
      <button class="admin-btn" data-action="startCand" data-cat="${cat}">Démarrer candidature</button>
      <button class="admin-btn danger" data-action="stopCand" data-cat="${cat}">Arrêter candidature</button>
      <button class="admin-btn" data-action="startVote" data-cat="${cat}">Démarrer vote</button>
      <button class="admin-btn danger" data-action="stopVote" data-cat="${cat}">Arrêter vote</button>
    `;
    container.appendChild(section);
  });

  container.addEventListener('click', ev => {
    const btn = ev.target;
    const action = btn.dataset.action;
    const cat = btn.dataset.cat;
    if (!action || !cat) return;
    switch (action) {
      case 'startCand':
        startCand(cat);
        break;
      case 'stopCand':
        stopCand(cat);
        break;
      case 'startVote':
        startVoteCat(cat);
        break;
      case 'stopVote':
        stopVoteCat(cat);
        break;
    }
  });
}

function startCand(cat) {
  const deb = prompt('Date de d\u00e9but (YYYY-MM-DD HH:MM)');
  const fin = prompt('Date de fin (YYYY-MM-DD HH:MM)');
  if (!deb || !fin) return;
  const d = Date.parse(deb);
  const f = Date.parse(fin);
  if (isNaN(d) || isNaN(f) || d >= f) { alert('Dates invalides'); return; }
  if (isCandidatureActive(cat)) { alert('Une session est d\u00e9j\u00e0 ouverte'); return; }
  startCandidature(cat, d, f);
  alert('Candidature ouverte pour ' + cat.toUpperCase());
}

function stopCand(cat) {
  if (!isCandidatureActive(cat)) { alert('Aucune session active'); return; }
  endCandidature(cat);
  alert('Candidature stopp\u00e9e pour ' + cat.toUpperCase());
}

function startVoteCat(cat) {
  const deb = prompt('Date de d\u00e9but (YYYY-MM-DD HH:MM)');
  const fin = prompt('Date de fin (YYYY-MM-DD HH:MM)');
  if (!deb || !fin) return;
  const d = Date.parse(deb);
  const f = Date.parse(fin);
  if (isNaN(d) || isNaN(f) || d >= f) { alert('Dates invalides'); return; }
  if (isVoteActive(cat)) { alert('Une session de vote est d\u00e9j\u00e0 ouverte pour cette cat\u00e9gorie'); return; }

  const candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];
  const candidats = candidatures.filter(c => c.type && c.type.toLowerCase() === cat);
  if (candidats.length === 0) {
    alert('Impossible de d\u00e9marrer le vote : aucun candidat pour cette cat\u00e9gorie.');
    return;
  }
  if (isCandidatureActive(cat)) {
    alert('Impossible de d\u00e9marrer le vote : la session de candidature est encore ouverte.');
    return;
  }
  startVote(cat, d, f);
  alert('Vote ouvert pour ' + cat.toUpperCase());
}

function stopVoteCat(cat) {
  if (!isVoteActive(cat)) { alert('Pas de vote actif pour cette cat\u00e9gorie'); return; }
  endVote(cat);
  alert('Vote stopp\u00e9 pour ' + cat.toUpperCase());
}

// ===============================
// Fonctions de gestion des sessions (m\u00eames que l'administrateur)
// ===============================

function getState() {
  return {
    candidature: JSON.parse(localStorage.getItem('candidaturesSessions')) || {},
    vote: JSON.parse(localStorage.getItem('votesSessions')) || {}
  };
}

function isCandidatureActive(categorie) {
  let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
  if (candidatures[categorie] && candidatures[categorie].active && Date.now() > candidatures[categorie].end) {
    candidatures[categorie].active = false;
    localStorage.setItem('candidaturesSessions', JSON.stringify(candidatures));
    return false;
  }
  return candidatures[categorie] && candidatures[categorie].active;
}

function startCandidature(categorie, debut, fin, club = null) {
  let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
  candidatures[categorie] = { active: true, start: debut, end: fin, ...(categorie === 'club' ? { club } : {}) };
  localStorage.setItem('candidaturesSessions', JSON.stringify(candidatures));
}

function endCandidature(categorie) {
  let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
  if (candidatures[categorie]) {
    candidatures[categorie].active = false;
    localStorage.setItem('candidaturesSessions', JSON.stringify(candidatures));
  }
}

function isVoteActive(categorie) {
  let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
  if (votes[categorie] && votes[categorie].active && Date.now() > votes[categorie].end) {
    votes[categorie].active = false;
    localStorage.setItem('votesSessions', JSON.stringify(votes));
    return false;
  }
  return votes[categorie] && votes[categorie].active;
}

function startVote(categorie, debut, fin, club = null) {
  let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
  votes[categorie] = { active: true, start: debut, end: fin, ...(categorie === 'club' ? { club } : {}) };
  localStorage.setItem('votesSessions', JSON.stringify(votes));
}

function endVote(categorie) {
  let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
  if (votes[categorie] && votes[categorie].active) {
    votes[categorie].active = false;
    localStorage.setItem('votesSessions', JSON.stringify(votes));
  }
}
