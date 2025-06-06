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

document.addEventListener('DOMContentLoaded', () => {
  const info = document.getElementById('candidature-info');
  if (!isCandidatureActive()) {
    if (info) info.textContent = 'Les candidatures ne sont pas ouvertes.';
    return;
  } else {
    const state = getState();
    if (info) {
      const end = new Date(state.candidature.endTime);
      info.textContent = 'Fin des candidatures : ' + end.toLocaleString();
    }
  }
  const electionButtons = document.querySelectorAll('.election-btn');
  const form = document.getElementById('newCandidature');
  const clubGroup = document.getElementById('clubGroup');
  const clubSelect = document.getElementById('clubSelect');

  electionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.target.textContent.trim().toLowerCase();
      document.getElementById('electionType').value = e.target.textContent;
      form.style.display = 'block';
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
});