function chargerPostes(type) {
  const select = document.getElementById('poste');
  if (!select) return;
  select.innerHTML = '<option value="">-- Sélectionnez un poste --</option>';
  const postesByType = JSON.parse(localStorage.getItem('postesByType')) || {};
  const postes = postesByType[type?.toLowerCase()] || [];
  postes.forEach(poste => {
    const opt = document.createElement('option');
    opt.value = poste;
    opt.textContent = poste;
    select.appendChild(opt);
  });

  // Afficher un message si aucun poste n'est disponible
  const validerBtn = document.getElementById('validerCandidatureBtn');
  if (postes.length === 0) {
    select.disabled = true;
    if (validerBtn) validerBtn.disabled = true;
    if (!document.getElementById('no-poste-msg')) {
      const msg = document.createElement('div');
      msg.id = 'no-poste-msg';
      msg.style.color = 'red';
      msg.style.marginTop = '10px';
      msg.textContent = "Aucun poste n'est disponible pour ce type d'élection. Veuillez contacter l'administrateur.";
      select.parentNode.appendChild(msg);
    }
  } else {
    select.disabled = false;
    if (validerBtn) validerBtn.disabled = false;
    const msg = document.getElementById('no-poste-msg');
    if (msg) msg.remove();
  }
}

function chargerClubs() {
  const select = document.getElementById('clubSelect');
  if (!select) return;
  select.innerHTML = '<option value="">-- Sélectionnez un club --</option>';
  const clubs = JSON.parse(localStorage.getItem('clubs')) || [];
  clubs.forEach(club => {
    const opt = document.createElement('option');
    opt.value = club;
    opt.textContent = club;
    select.appendChild(opt);
  });
}

function chargerPostesClub(club) {
  const select = document.getElementById('poste');
  if (!select) return;
  select.innerHTML = '<option value="">-- Sélectionnez un poste --</option>';
  const postesByClub = JSON.parse(localStorage.getItem('postesByClub')) || {};
  const postes = postesByClub[club] || [];
  postes.forEach(poste => {
    const opt = document.createElement('option');
    opt.value = poste;
    opt.textContent = poste;
    select.appendChild(opt);
  });

  const validerBtn = document.getElementById('validerCandidatureBtn');
  if (postes.length === 0) {
    select.disabled = true;
    if (validerBtn) validerBtn.disabled = true;
    if (!document.getElementById('no-poste-msg')) {
      const msg = document.createElement('div');
      msg.id = 'no-poste-msg';
      msg.style.color = 'red';
      msg.style.marginTop = '10px';
      msg.textContent = "Aucun poste n'est disponible pour ce club.";
      select.parentNode.appendChild(msg);
    }
  } else {
    select.disabled = false;
    if (validerBtn) validerBtn.disabled = false;
    const msg = document.getElementById('no-poste-msg');
    if (msg) msg.remove();
  }
}

// Vérifie si une session de candidature est active pour une catégorie
function isCandidatureActive(categorie) {
  let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
  return candidatures[categorie] && candidatures[categorie].active;
}

// Récupère l'état des sessions
function getState() {
  return {
    candidature: JSON.parse(localStorage.getItem('candidaturesSessions')) || {}
  };
}

document.addEventListener('DOMContentLoaded', () => {
function updateInfo() {
  const info = document.getElementById('candidature-info');
  const state = getState();
  const msgs = [];
  let sessionsOuvertes = [];
  ['aes','classe','club'].forEach(cat => {
    if (isCandidatureActive(cat)) {
      sessionsOuvertes.push(cat);
      const c = cat === 'club' ? state.candidature.club : state.candidature[cat];
      const deb = new Date(c.start);
      const end = new Date(c.end);
      const label = cat === 'club' ? (c.club || "Club") : cat.toUpperCase();
      msgs.push(`<strong>${label}</strong> : du ${deb.toLocaleString()} au ${end.toLocaleString()}`);
    }
  });
  if (info) {
    if (msgs.length === 0) {
      info.textContent = 'Les candidatures ne sont pas ouvertes.';
    } else {
      info.innerHTML = msgs.join('<br>');
    }
  }
}

function initCandidatPage() {
  updateInfo();
  const electionButtons = document.querySelectorAll('.election-btn');
  const form = document.getElementById('newCandidature');
  const clubGroup = document.getElementById('clubGroup');
  const clubSelect = document.getElementById('clubSelect');

  // Désactive tous les boutons par défaut
  
  electionButtons.forEach(btn => {
    const type = btn.textContent.trim().toLowerCase();
    btn.disabled = false; // Toujours actif
    btn.classList.remove('disabled');
    btn.addEventListener('click', (e) => {
      if (!isCandidatureActive(type)) {
        // Affiche le message et masque le formulaire
        if (info) info.innerHTML = `<span style="color:red;">Session non ouverte pour ${type.toUpperCase()}.</span>`;
        if (form) form.style.display = 'none';
        return;
      }
      // Affiche les périodes et le formulaire
      document.getElementById('electionType').value = btn.textContent;
      const c = type === 'club' ? state.candidature.club : state.candidature[type];
      if (info) {
        const deb = new Date(c.start);
        const end = new Date(c.end);
        const label = type === 'club' ? (c.club || "Club") : type.toUpperCase();
        info.innerHTML = `<strong>${label}</strong> : du ${deb.toLocaleString()} au ${end.toLocaleString()}`;
      }
      if (form) form.style.display = 'block';
      form.style.display = 'block';
      localStorage.setItem('lastCandidatureType', type);
      if (type === 'club') {
        if (clubGroup) clubGroup.style.display = 'block';
        chargerClubs();
        chargerPostesClub(clubSelect.value);
      } else {
        if (clubGroup) clubGroup.style.display = 'none';
        chargerPostes(type);
      }
    });
  });
  


  if (clubSelect) {
    clubSelect.addEventListener('change', (e) => {
      chargerPostesClub(e.target.value);
    });
  }

  const last = localStorage.getItem('lastCandidatureType');
  if (last) {
    const btn = Array.from(electionButtons).find(b => b.textContent.trim().toLowerCase() === last);
    if (btn && isCandidatureActive(last)) btn.click();
  }

  document.getElementById('validerCandidatureBtn').addEventListener('click', () => {
    const candidature = {
      id: Date.now(),
      type: document.getElementById('electionType').value,
      nom: document.getElementById('nom').value,
      prenom: document.getElementById('prenom').value,
      classe: document.getElementById('classe').value,
      club: document.getElementById('clubSelect').value,
      poste: document.getElementById('poste').value,
      programme: document.getElementById('programme').value,
      photo: document.getElementById('photo').files[0] ? 
        URL.createObjectURL(document.getElementById('photo').files[0]) : '',
      date: new Date().toLocaleDateString()
    };

    const existing = JSON.parse(localStorage.getItem('candidatures')) || [];
    existing.push(candidature);
    localStorage.setItem('candidatures', JSON.stringify(existing));
    
    window.location.href = 'mes-candidatures.html';
  });

}

document.addEventListener('DOMContentLoaded', initCandidatPage);
document.addEventListener('stateChanged', initCandidatPage);
