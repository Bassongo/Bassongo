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

document.addEventListener('DOMContentLoaded', () => {
  const electionButtons = document.querySelectorAll('.election-btn');
  const form = document.getElementById('newCandidature');
  
  electionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.target.textContent.trim().toLowerCase();
      document.getElementById('electionType').value = e.target.textContent;
      form.style.display = 'block';
      chargerPostes(type);
    });
  });

  document.getElementById('validerCandidatureBtn').addEventListener('click', () => {
    const candidature = {
      id: Date.now(),
      type: document.getElementById('electionType').value,
      nom: document.getElementById('nom').value,
      prenom: document.getElementById('prenom').value,
      classe: document.getElementById('classe').value,
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