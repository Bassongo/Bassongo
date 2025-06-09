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

  const comites = JSON.parse(localStorage.getItem('comites')) || {};
  const categories = Object.keys(comites).filter(cat =>
    (comites[cat] || []).some(m => m.email === userData.email)
  );

  if (categories.length > 0) {
    showCommitteeActions(actionsContainer);
    setupModals(categories);
  }
});

function showCommitteeActions(container) {
  container.innerHTML = `
    <div class="committee-section">
      <button class="admin-btn" id="startCandBtn">Démarrer les candidatures</button>
      <button class="admin-btn danger" id="stopCandBtn">Fermer les candidatures</button>
      <button class="admin-btn" id="startVoteBtn">Démarrer les votes</button>
      <button class="admin-btn danger" id="stopVoteBtn">Fermer les votes</button>
    </div>
  `;

  document.getElementById('startCandBtn').onclick = () => {
    window.resetCandModal();
    document.getElementById('startCandModal').style.display = 'flex';
  };
  document.getElementById('stopCandBtn').onclick = () => window.openCloseSession('candidature');
  document.getElementById('startVoteBtn').onclick = () => {
    window.resetVoteModal();
    document.getElementById('startVotesModal').style.display = 'flex';
  };
  document.getElementById('stopVoteBtn').onclick = () => window.openCloseSession('vote');
}

function setupModals(categories) {
  const startVotesModal = document.getElementById('startVotesModal');
  const closeStartVotes = document.getElementById('closeStartVotes');
  const nextToDates = document.getElementById('nextToDates');
  const validateVoteModal = document.getElementById('validateVoteModal');
  const cancelVoteModal = document.getElementById('cancelVoteModal');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const voteType = document.getElementById('voteType');
  const startVoteInput = document.getElementById('startVote');
  const endVoteInput = document.getElementById('endVote');

  const startCandModal = document.getElementById('startCandModal');
  const closeStartCand = document.getElementById('closeStartCand');
  const candNextToDate = document.getElementById('candNextToDate');
  const validateCandModal = document.getElementById('validateCandModal');
  const cancelCandModal = document.getElementById('cancelCandModal');
  const candStep1 = document.getElementById('candStep1');
  const candStep2 = document.getElementById('candStep2');
  const candType = document.getElementById('candType');
  const startCandDate = document.getElementById('startCandDate');
  const endCandDate = document.getElementById('endCandDate');

  const closeSessionModal = document.getElementById('closeSessionModal');
  const closeCloseSession = document.getElementById('closeCloseSession');
  const closeSessionCategory = document.getElementById('closeSessionCategory');
  const cancelCloseSession = document.getElementById('cancelCloseSession');
  const validateCloseSession = document.getElementById('validateCloseSession');
  let closeType = null;

  function fillCategories(select) {
    select.innerHTML = '<option value="" selected disabled>Choisir un type</option>';
    categories.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c.toUpperCase();
      select.appendChild(opt);
    });
  }

  fillCategories(voteType);
  fillCategories(candType);

  function fillCloseOptions(type) {
    closeSessionCategory.innerHTML = '<option value="" selected disabled>Choisir une catégorie</option>';
    const sessions = JSON.parse(localStorage.getItem(type === 'vote' ? 'votesSessions' : 'candidaturesSessions')) || {};
    categories.forEach(c => {
      if (sessions[c] && sessions[c].active) {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c.toUpperCase();
        closeSessionCategory.appendChild(opt);
      }
    });
  }

  function openCloseSession(type) {
    closeType = type;
    fillCloseOptions(type);
    if (closeSessionCategory.children.length === 1) { // only placeholder
      alert('Aucune session ouverte à fermer.');
      return;
    }
    closeSessionCategory.value = '';
    closeSessionModal.style.display = 'flex';
  }

  window.openCloseSession = openCloseSession;

  function resetVoteModal() {
    step1.style.display = 'block';
    step2.style.display = 'none';
    voteType.value = '';
    startVoteInput.value = '';
    endVoteInput.value = '';
  }

  function resetCandModal() {
    candStep1.style.display = 'block';
    candStep2.style.display = 'none';
    candType.value = '';
    startCandDate.value = '';
    endCandDate.value = '';
  }

  window.resetVoteModal = resetVoteModal;
  window.resetCandModal = resetCandModal;

  closeStartVotes.onclick = () => { startVotesModal.style.display = 'none'; resetVoteModal(); };
  cancelVoteModal.onclick = () => { startVotesModal.style.display = 'none'; resetVoteModal(); };
  nextToDates.onclick = () => {
    if (!voteType.value) { alert('Choisissez un type'); return; }
    step1.style.display = 'none';
    step2.style.display = 'block';
  };
  validateVoteModal.onclick = () => {
    const categorie = voteType.value;
    const debut = Date.parse(startVoteInput.value);
    const fin = Date.parse(endVoteInput.value);
    if (!categorie) { alert('Type manquant'); return; }
    if (isNaN(debut) || isNaN(fin) || debut >= fin) { alert('Dates invalides'); return; }
    if (isVoteActive(categorie)) { alert('Une session de vote est déjà ouverte pour cette catégorie'); return; }
    const candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];
    const candidats = candidatures.filter(c => c.type && c.type.toLowerCase() === categorie);
    if (candidats.length === 0) {
      alert('Impossible de démarrer le vote : aucun candidat pour cette catégorie.');
      return;
    }
    if (isCandidatureActive(categorie)) {
      alert('Impossible de démarrer le vote : la session de candidature pour cette catégorie est encore ouverte.');
      return;
    }
    startVote(categorie, debut, fin);
    alert('Votes démarrés pour ' + categorie.toUpperCase());
    startVotesModal.style.display = 'none';
    resetVoteModal();
  };

  closeStartCand.onclick = () => { startCandModal.style.display = 'none'; resetCandModal(); };
  cancelCandModal.onclick = () => { startCandModal.style.display = 'none'; resetCandModal(); };
  candNextToDate.onclick = () => {
    if (!candType.value) { alert('Choisissez une catégorie'); return; }
    candStep1.style.display = 'none';
    candStep2.style.display = 'block';
  };
  validateCandModal.onclick = () => {
    const categorie = candType.value;
    const debut = Date.parse(startCandDate.value);
    const fin = Date.parse(endCandDate.value);
    if (!categorie) { alert('Catégorie manquante'); return; }
    if (isNaN(debut) || isNaN(fin) || debut >= fin) { alert('Dates invalides'); return; }
    if (isCandidatureActive(categorie)) { alert('Cette catégorie possède déjà une session active'); return; }
    startCandidature(categorie, debut, fin);
    alert('Candidatures ouvertes pour ' + categorie.toUpperCase());
    startCandModal.style.display = 'none';
    resetCandModal();
  };

  closeCloseSession.onclick = () => { closeSessionModal.style.display = 'none'; };
  cancelCloseSession.onclick = () => { closeSessionModal.style.display = 'none'; };
  validateCloseSession.onclick = () => {
    const cat = closeSessionCategory.value;
    if (!cat) { alert('Choisissez une catégorie'); return; }
    if (closeType === 'vote') {
      if (!isVoteActive(cat)) { alert('Pas de session de vote ouverte pour cette catégorie'); return; }
      endVote(cat);
      alert('Votes fermés pour ' + cat.toUpperCase());
    } else {
      if (!isCandidatureActive(cat)) { alert('Pas de session ouverte pour cette catégorie'); return; }
      endCandidature(cat);
      alert('Candidatures fermées pour ' + cat.toUpperCase());
    }
    closeSessionModal.style.display = 'none';
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

function startCandidature(categorie, debut, fin) {
  let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
  candidatures[categorie] = { active: true, start: debut, end: fin };
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

function startVote(categorie, debut, fin) {
  let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
  votes[categorie] = { active: true, start: debut, end: fin };
  localStorage.setItem('votesSessions', JSON.stringify(votes));
}

function endVote(categorie) {
  let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
  if (votes[categorie] && votes[categorie].active) {
    votes[categorie].active = false;
    localStorage.setItem('votesSessions', JSON.stringify(votes));
  }
}

