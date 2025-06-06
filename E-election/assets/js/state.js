const defaultState = {
  candidature: { active: false, category: null, club: null, endTime: null },
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
  if (state.candidature.active && Date.now() > state.candidature.endTime) {
    state.candidature.active = false;
    state.candidature.club = null;
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

function startCandidature(category, endTime, club = null) {
  const state = getState();
  state.candidature = { active: true, category, club, endTime };
  saveState(state);
}

function endCandidature() {
  const state = getState();
  state.candidature.active = false;
  state.candidature.club = null;
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

function isCandidatureActive() {
  const s = getState();
  return s.candidature.active && Date.now() < s.candidature.endTime;
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
