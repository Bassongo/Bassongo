document.addEventListener('DOMContentLoaded', () => {
  const electionButtons = document.querySelectorAll('.election-btn');
  const form = document.getElementById('newCandidature');
  
  electionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.getElementById('electionType').value = e.target.textContent;
      form.style.display = 'block';
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