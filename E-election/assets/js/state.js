const defaultState = {
  candidature: {
    aes: { active: false, startTime: null, endTime: null },
    classe: { active: false, startTime: null, endTime: null },
    club: { active: false, club: null, startTime: null, endTime: null }
  },
  vote: { active: false, category: null, club: null, startTime: null, endTime: null }
};

function loadState() {
  const data = localStorage.getItem('electionState');
  return data ? JSON.parse(data) : JSON.parse(JSON.stringify(defaultState));
}

function saveState(state) {
  localStorage.setItem('electionState', JSON.stringify(state));
  // Notifie les autres scripts qu'un changement a été effectué
  document.dispatchEvent(new Event('stateChanged'));
}
function getState() {
  const state = loadState();
  let changed = false;
  ['aes', 'classe'].forEach(cat => {
    const c = state.candidature[cat];
    if (c && c.active && Date.now() > c.endTime) {
      c.active = false;
      changed = true;
    }
  });
  if (state.candidature.club && state.candidature.club.active && Date.now() > state.candidature.club.endTime) {
    state.candidature.club.active = false;
    state.candidature.club.club = null;
    changed = true;
  }
  if (state.vote && state.vote.active && Date.now() > state.vote.endTime) {
    state.vote.active = false;
    state.vote.club = null;
    changed = true;
  }
  if (changed) saveState(state);
  return state;
}


// --- Candidatures ---
function isCandidatureActive(category) {
  const s = getState();
  if (!category) return false;
  const c = category === 'club' ? s.candidature.club : s.candidature[category];
  if (!c) return false;
  return c.active && Date.now() >= c.startTime && Date.now() < c.endTime;
}

function startCandidature(category, startTime, endTime, club = null) {
  const state = getState();
  if (category === 'club') {
    state.candidature.club = { active: true, club, startTime, endTime };
  } else if (category === 'aes' || category === 'classe') {
    state.candidature[category] = { active: true, startTime, endTime };
  }
  saveState(state);
}

function endCandidature(category) {
  const state = getState();
  if (category === 'club') {
    state.candidature.club.active = false;
    state.candidature.club.club = null;
  } else if (category === 'aes' || category === 'classe') {
    state.candidature[category].active = false;
  }
  saveState(state);
}

// --- Votes ---
function isVoteActive(category) {
  const s = getState();
  if (!category) return false;
  // Pour compatibilité, on peut gérer plusieurs votes si besoin
  if (s.vote.category === category) {
    return s.vote.active && Date.now() >= s.vote.startTime && Date.now() < s.vote.endTime;
  }
  return false;
}

function startVote(category, startTime, endTime, club = null) {
  const state = getState();
  state.vote = { active: true, category, club, startTime, endTime };
  saveState(state);
}

function endVote(category) {
  const state = getState();
  if (state.vote.category === category) {
    state.vote.active = false;
    state.vote.club = null;
    saveState(state);
  }
}

// --- Fermeture automatique ---
function autoCloseSessions() {
  const state = getState();
  let changed = false;
  // Candidatures
  ['aes', 'classe'].forEach(cat => {
    const c = state.candidature[cat];
    if (c && c.active && Date.now() > c.endTime) {
      c.active = false;
      changed = true;
    }
  });
  if (state.candidature.club && state.candidature.club.active && Date.now() > state.candidature.club.endTime) {
    state.candidature.club.active = false;
    state.candidature.club.club = null;
    changed = true;
  }
  // Votes
  if (state.vote && state.vote.active && Date.now() > state.vote.endTime) {
    state.vote.active = false;
    state.vote.club = null;
    changed = true;
  }
  if (changed) saveState(state);
}
