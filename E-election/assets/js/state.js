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
}

function getState() {
  const state = loadState();
  let changed = false;
  ['aes', 'classe'].forEach(cat => {
    const c = state.candidature[cat];
    if (c.active && Date.now() > c.endTime) {
      c.active = false;
      changed = true;
    }
  });
  if (state.candidature.club.active && Date.now() > state.candidature.club.endTime) {
    state.candidature.club.active = false;
    state.candidature.club.club = null;
    changed = true;
  }
  if (state.vote.active && Date.now() > state.vote.endTime) {
    state.vote.active = false;
    state.vote.club = null;
    changed = true;
  }
  if (changed) saveState(state);
  return state;
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

function startVote(category, startTime, endTime, club = null) {
  const state = getState();
  state.vote = { active: true, category, club, startTime, endTime };
  saveState(state);
}

function endVote() {
  const state = getState();
  state.vote.active = false;
  state.vote.club = null;
  saveState(state);
}

function isCandidatureActive(category = null) {
  const s = getState();
  if (category) {
    const c = category === 'club' ? s.candidature.club : s.candidature[category];
    if (!c) return false;
    return c.active && Date.now() >= c.startTime && Date.now() < c.endTime;
  }
  return ['aes', 'classe', 'club'].some(cat => {
    const c = cat === 'club' ? s.candidature.club : s.candidature[cat];
    return c.active && Date.now() >= c.startTime && Date.now() < c.endTime;
  });
}

function isVoteActive() {
  const s = getState();
  return s.vote.active && Date.now() >= s.vote.startTime && Date.now() < s.vote.endTime;
}

function userHasVoted(category) {
  return localStorage.getItem('voted_' + category) === 'true';
}

function setUserVoted(category) {
  localStorage.setItem('voted_' + category, 'true');
}
