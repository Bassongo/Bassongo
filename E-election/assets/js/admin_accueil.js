document.addEventListener('DOMContentLoaded', () => {
  // Elements du modal de démarrage des votes
  const startVotesModal = document.getElementById('startVotesModal');
  const closeStartVotes = document.getElementById('closeStartVotes');
  const nextToDates = document.getElementById('nextToDates');
  const validateVoteModal = document.getElementById('validateVoteModal');
  const cancelVoteModal = document.getElementById('cancelVoteModal');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const voteType = document.getElementById('voteType');
  const voteClubGroup = null;
  const voteClub = null;
  const startVoteInput = document.getElementById('startVote');
  const endVoteInput = document.getElementById('endVote');

  // Elements du modal de démarrage des candidatures
  const startCandModal = document.getElementById('startCandModal');
  const closeStartCand = document.getElementById('closeStartCand');
  const candNextToDate = document.getElementById('candNextToDate');
  const validateCandModal = document.getElementById('validateCandModal');
  const cancelCandModal = document.getElementById('cancelCandModal');
  const candStep1 = document.getElementById('candStep1');
  const candStep2 = document.getElementById('candStep2');
  const candType = document.getElementById('candType');
  const candClubGroup = null;
  const candClub = null;
  const startCandDate = document.getElementById('startCandDate');
  const endCandDate = document.getElementById('endCandDate');

  function loadClubs(select) {
    const clubs = JSON.parse(localStorage.getItem('clubs')) || [];
    if (!select) return;
    select.innerHTML = '<option value="" selected disabled>Choisir un club</option>';
    clubs.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });
  }

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
    if (startCandDate) startCandDate.value = '';
    endCandDate.value = '';
  }

  // Gestion des candidatures sessions (stockage et contrôle)
  function isCandidatureActive(categorie) {
    let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
    return candidatures[categorie] && candidatures[categorie].active;
  }

  function startCandidature(categorie, debut, fin, club) {
    let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
    candidatures[categorie] = {
      active: true,
      start: debut,
      end: fin,
      ...(categorie === 'club' ? { club } : {})
    };
    localStorage.setItem('candidaturesSessions', JSON.stringify(candidatures));
  }

  function endCandidature(categorie) {
    let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
    if (candidatures[categorie]) {
      candidatures[categorie].active = false;
      localStorage.setItem('candidaturesSessions', JSON.stringify(candidatures));
    }
  }

  // ===============================
  //  GESTION DES VOTES (COMPLET)
  // ===============================

  // Vérifie si une session de vote est active pour une catégorie
  function isVoteActive(categorie) {
    let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
    // Fermeture automatique si la date de fin est dépassée
    if (votes[categorie] && votes[categorie].active && Date.now() > votes[categorie].end) {
      votes[categorie].active = false;
      localStorage.setItem('votesSessions', JSON.stringify(votes));
      return false;
    }
    return votes[categorie] && votes[categorie].active;
  }

  // Démarre une session de vote pour une catégorie
  function startVote(categorie, debut, fin, club) {
    let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
    votes[categorie] = {
      active: true,
      start: debut,
      end: fin,
      ...(categorie === 'club' ? { club } : {})
    };
    localStorage.setItem('votesSessions', JSON.stringify(votes));
  }

  // Ferme une session de vote pour une catégorie
  function endVote(categorie) {
    let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
    if (votes[categorie] && votes[categorie].active) {
      votes[categorie].active = false;
      localStorage.setItem('votesSessions', JSON.stringify(votes));
    }
  }

  // Fermeture automatique des votes et candidatures à chaque chargement
  function autoCloseSessions() {
    // Candidatures
    let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
    let changed = false;
    Object.keys(candidatures).forEach(cat => {
      if (candidatures[cat].active && Date.now() > candidatures[cat].end) {
        candidatures[cat].active = false;
        changed = true;
      }
    });
    if (changed) localStorage.setItem('candidaturesSessions', JSON.stringify(candidatures));

    // Votes
    let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
    changed = false;
    Object.keys(votes).forEach(cat => {
      if (votes[cat].active && Date.now() > votes[cat].end) {
        votes[cat].active = false;
        changed = true;
      }
    });
    if (changed) localStorage.setItem('votesSessions', JSON.stringify(votes));
  }
  autoCloseSessions();

  // ===============================
  //  MODAL DE DEMARRAGE DES VOTES
  // ===============================
  if (typeof validateVoteModal !== "undefined" && validateVoteModal) {
    validateVoteModal.onclick = () => {
      const categorie = voteType.value;
      const club = voteType.value === 'club' ? voteClub?.value : null;
      const debut = Date.parse(startVoteInput.value);
      const fin = Date.parse(endVoteInput.value);

      // Vérifications des champs
      if (!categorie) { alert('Type manquant'); return; }
      if (categorie === 'club' && !club) { alert('Sélectionnez un club'); return; }
      if (isNaN(debut) || isNaN(fin) || debut >= fin) { alert('Dates invalides'); return; }
      if (isVoteActive(categorie)) { alert('Une session de vote est déjà ouverte pour cette catégorie'); return; }

      // Vérification de la présence de candidats
      let candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];
      let candidats;
      if (categorie === 'club') {
        candidats = candidatures.filter(c => c.type && c.type.toLowerCase() === 'club' && c.club === club);
      } else {
        candidats = candidatures.filter(c => c.type && c.type.toLowerCase() === categorie);
      }
      if (candidats.length === 0) {
        alert('Impossible de démarrer le vote : aucun candidat pour cette catégorie.');
        return;
      }

      // Stockage de la session de vote
      startVote(categorie, debut, fin, club);
      alert('Votes démarrés pour ' + (categorie === 'club' ? club : categorie).toUpperCase());

      // Demander si on veut démarrer une autre session de vote
      if (confirm('Voulez-vous démarrer une autre session de vote ?')) {
        resetVoteModal();
        startVotesModal.style.display = 'flex';
      } else {
        startVotesModal.style.display = 'none';
        resetVoteModal();
      }
    };
  }

  // ===============================
  //  FERMER UN VOTE MANUELLEMENT
  // ===============================
  if (typeof stopVotesBtn !== "undefined" && stopVotesBtn) {
    stopVotesBtn.onclick = () => {
      const cat = prompt('Catégorie à fermer (aes, club, classe) :');
      if (!cat || !['aes','club','classe'].includes(cat.toLowerCase())) return;
      if (!isVoteActive(cat.toLowerCase())) { alert('Pas de session de vote ouverte pour cette catégorie'); return; }
      endVote(cat.toLowerCase());
      alert('Votes fermés pour ' + cat.toUpperCase());
    };
  }
  if (closeStartVotes) closeStartVotes.onclick = () => { startVotesModal.style.display = 'none'; resetVoteModal(); };
  if (cancelVoteModal) cancelVoteModal.onclick = () => { startVotesModal.style.display = 'none'; resetVoteModal(); };
  if (voteType) voteType.onchange = () => {};
  if (nextToDates) nextToDates.onclick = () => {
    if (!voteType.value) { alert('Choisissez un type'); return; }
    step1.style.display = 'none';
    step2.style.display = 'block';
  };

  // ===============================
  //  MODAL DE DEMARRAGE DES CANDIDATURES
  // ===============================
  if (closeStartCand) closeStartCand.onclick = () => { startCandModal.style.display = 'none'; resetCandModal(); };
  if (cancelCandModal) cancelCandModal.onclick = () => { startCandModal.style.display = 'none'; resetCandModal(); };
  if (candType) candType.onchange = () => {};
  if (candNextToDate) candNextToDate.onclick = () => {
    if (!candType.value) { alert('Choisissez une catégorie'); return; }
    candStep1.style.display = 'none';
    candStep2.style.display = 'block';
  };
  if (validateCandModal) validateCandModal.onclick = () => {
    const categorie = candType.value;
    const club = null;
    const debut = Date.parse(startCandDate.value);
    const fin = Date.parse(endCandDate.value);
    if (!categorie) { alert('Catégorie manquante'); return; }
    if (isNaN(debut) || isNaN(fin) || debut >= fin) { alert('Dates invalides'); return; }
    if (isCandidatureActive(categorie)) { alert('Cette catégorie possède déjà une session active'); return; }
    startCandidature(categorie, debut, fin, club);
    alert('Candidatures ouvertes pour ' + (categorie === 'club' ? club : categorie).toUpperCase());
    // Demander si on veut démarrer une autre session
    if (confirm('Voulez-vous démarrer une autre session de candidature ?')) {
      resetCandModal();
      startCandModal.style.display = 'flex';
    } else {
      startCandModal.style.display = 'none';
      resetCandModal();
    }
  };

  // Redirection des boutons du haut
  const navLinks = document.querySelectorAll('.btn-nav');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      switch (this.textContent.trim().toLowerCase()) {
        case 'inscription candidat':
          window.location.href = 'inscription.html';
          break;
        case 'campagne':
          window.location.href = 'pages/campagnes.html';
          break;
        case 'voter':
          window.location.href = 'pages/vote.html';
          break;
        case 'statistiques':
          window.location.href = 'pages/statistique.html';
          break;
        case 'moi':
          window.location.href = 'pages/moi.html';
          break;
        case 'accueil':
          break;
      }
    });
  });

  const content = document.getElementById('admin-content');
  const sidebarBtns = document.querySelectorAll('.sidebar-btn:not(.logout)');

  function showWelcome() {
    content.innerHTML = `
      <div class="welcome-message" id="welcome-message">
        <h1>Bienvenue sur l'espace administrateur</h1>
        <p>Sélectionnez une option dans le menu à gauche pour commencer.</p>
      </div>
    `;
  }

  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      autoCloseSessions();
      sidebarBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      if (this.id === 'btn-gestion-elections') {
        content.innerHTML = `
          <div class="admin-box">
            <h2>GESTION DES ELECTIONS</h2>
            <div class="admin-actions-col">
              <div>
                <span style="color:#7ed957;font-weight:700;">Date de debut</span>
                <input type="date" id="dateDebut" value="">
              </div>
              <div>
                <span style="color:#e53935;font-weight:700;">Date de fin</span>
                <input type="date" id="dateFin" value="">
              </div>
              <div class="admin-link" style="margin:18px 0;">
                <a href="#" id="addPoste" style="color:#fff;text-decoration:underline;">Ajouter un nouveau poste</a>
              </div>
              <div class="admin-link">
                <a href="#" id="deletePoste" style="color:#fff;text-decoration:underline;">supprimer un poste</a>
              </div>
              <div class="admin-link" style="margin:18px 0;">
                <a href="#" id="addClub" style="color:#fff;text-decoration:underline;">Ajouter un club</a>
              </div>
              <div class="admin-link">
                <a href="#" id="deleteClub" style="color:#fff;text-decoration:underline;">supprimer un club</a>
              </div>
              <div class="admin-link">
                <a href="pages/vote.html" id="etatVotes" style="color:#fff;text-decoration:underline;">Etat des votes</a>
              </div>
              <div style="margin:18px 0;">
                <button class="admin-btn green" id="startVotesBtn">Démarrer les votes</button>
                <button class="admin-btn danger" id="stopVotesBtn">Arrêter les votes</button>
              </div>
              <div style="margin:18px 0;">
                <button class="admin-btn danger" id="resetBtn">supprimer</button>
                <button class="admin-btn" id="cancelBtn">Annuler</button>
                <button class="admin-btn" id="validateBtn">valider</button>
              </div>
            </div>
          </div>
        `;
        setTimeout(() => {
          document.getElementById('resetBtn').onclick = () => {
            document.getElementById('dateDebut').value = '';
            document.getElementById('dateFin').value = '';
          };
          document.getElementById('cancelBtn').onclick = showWelcome;
          document.getElementById('validateBtn').onclick = () => {
            alert('Modifications validées !');
          };
          const startVotesBtn = document.getElementById('startVotesBtn');
          if (startVotesBtn) {
            startVotesBtn.onclick = () => {
              startVotesModal.style.display = 'flex';
            };
          }
          const stopVotesBtn = document.getElementById('stopVotesBtn');
          if (stopVotesBtn) {
            stopVotesBtn.onclick = () => {
              const cat = prompt('Catégorie à fermer (aes, club, classe) :');
              if (!cat || !['aes','club','classe'].includes(cat.toLowerCase())) return;
              if (!isVoteActive(cat.toLowerCase())) { alert('Pas de session de vote ouverte pour cette catégorie'); return; }
              endVote(cat.toLowerCase());
              alert('Votes fermés pour ' + cat.toUpperCase());
            };
          }
          // Ajouter un poste PAR TYPE OU CLUB
          const addPoste = document.getElementById('addPoste');
          if (addPoste) {
            addPoste.onclick = (e) => {
              e.preventDefault();
              const type = prompt('Type d\'élection (club, aes, classe) :').toLowerCase();
              if (!['club', 'aes', 'classe'].includes(type)) {
                alert('Type d\'élection invalide.');
                return;
              }
              let club = '';
              if (type === 'club') {
                const clubs = JSON.parse(localStorage.getItem('clubs')) || [];
                if (clubs.length === 0) { alert('Aucun club disponible.'); return; }
                const idx = prompt('Choisissez le club :\n' + clubs.map((c,i)=>`${i+1}. ${c}`).join('\n'));
                const i = parseInt(idx,10);
                if (!i || i < 1 || i > clubs.length) return;
                club = clubs[i-1];
              }
              const nom = prompt('Nom du nouveau poste :');
              if (nom) {
                if (type === 'club') {
                  let postesByClub = JSON.parse(localStorage.getItem('postesByClub')) || {};
                  postesByClub[club] = postesByClub[club] || [];
                  if (!postesByClub[club].includes(nom)) {
                    postesByClub[club].push(nom);
                    localStorage.setItem('postesByClub', JSON.stringify(postesByClub));
                    alert('Poste ajouté pour ' + club + ' !');
                  } else {
                    alert('Ce poste existe déjà pour ce club.');
                  }
                } else {
                  let postesByType = JSON.parse(localStorage.getItem('postesByType')) || {};
                  postesByType[type] = postesByType[type] || [];
                  if (!postesByType[type].includes(nom)) {
                    postesByType[type].push(nom);
                    localStorage.setItem('postesByType', JSON.stringify(postesByType));
                    alert('Poste ajouté pour ' + type + ' !');
                  } else {
                    alert('Ce poste existe déjà pour ce type.');
                  }
                }
              }
            };
          }
          // Supprimer un poste PAR TYPE OU CLUB
          const deletePoste = document.getElementById('deletePoste');
          if (deletePoste) {
            deletePoste.onclick = (e) => {
              e.preventDefault();
              const type = prompt('Type d\'élection (club, aes, classe) :').toLowerCase();
              if (!['club', 'aes', 'classe'].includes(type)) return;
              if (type === 'club') {
                const clubs = JSON.parse(localStorage.getItem('clubs')) || [];
                if (clubs.length === 0) { alert('Aucun club disponible.'); return; }
                const idx = prompt('Choisissez le club :\n' + clubs.map((c,i)=>`${i+1}. ${c}`).join('\n'));
                const i = parseInt(idx,10);
                if (!i || i < 1 || i > clubs.length) return;
                const club = clubs[i-1];
                let postesByClub = JSON.parse(localStorage.getItem('postesByClub')) || {};
                const arr = postesByClub[club] || [];
                if (arr.length === 0) { alert('Aucun poste à supprimer pour ce club.'); return; }
                const posIdx = prompt('Choisissez le poste :\n' + arr.map((p,j)=>`${j+1}. ${p}`).join('\n'));
                const j = parseInt(posIdx,10);
                if (j >=1 && j <= arr.length) {
                  arr.splice(j-1,1);
                  postesByClub[club] = arr;
                  localStorage.setItem('postesByClub', JSON.stringify(postesByClub));
                  alert('Poste supprimé pour ' + club + ' !');
                }
              } else {
                let postesByType = JSON.parse(localStorage.getItem('postesByType')) || {};
                const arr = postesByType[type] || [];
                if (arr.length === 0) { alert('Aucun poste à supprimer pour ce type.'); return; }
                const posIdx = prompt('Choisissez le poste :\n' + arr.map((p,j)=>`${j+1}. ${p}`).join('\n'));
                const j = parseInt(posIdx,10);
                if (j >=1 && j <= arr.length) {
                  arr.splice(j-1,1);
                  postesByType[type] = arr;
                  localStorage.setItem('postesByType', JSON.stringify(postesByType));
                  alert('Poste supprimé pour ' + type + ' !');
                }
              }
            };
          }
          // Ajouter un club
          const addClub = document.getElementById('addClub');
          if (addClub) {
            addClub.onclick = (e) => {
              e.preventDefault();
              const nom = prompt('Nom du nouveau club :');
              if (nom) {
                let clubs = JSON.parse(localStorage.getItem('clubs')) || [];
                if (!clubs.includes(nom)) {
                  clubs.push(nom);
                  localStorage.setItem('clubs', JSON.stringify(clubs));
                  alert('Club ajouté !');
                } else {
                  alert('Ce club existe déjà.');
                }
              }
            };
          }
          // Supprimer un club
          const deleteClub = document.getElementById('deleteClub');
          if (deleteClub) {
            deleteClub.onclick = (e) => {
              e.preventDefault();
              let clubs = JSON.parse(localStorage.getItem('clubs')) || [];
              if (clubs.length === 0) { alert('Aucun club à supprimer.'); return; }
              const idx = prompt('Quel club supprimer ?\n' + clubs.map((c,i)=>`${i+1}. ${c}`).join('\n'));
              const i = parseInt(idx,10);
              if (i >=1 && i <= clubs.length) {
                const club = clubs.splice(i-1,1)[0];
                localStorage.setItem('clubs', JSON.stringify(clubs));
                let postesByClub = JSON.parse(localStorage.getItem('postesByClub')) || {};
                delete postesByClub[club];
                localStorage.setItem('postesByClub', JSON.stringify(postesByClub));
                alert('Club supprimé !');
              }
            };
          }
        }, 10);
      } else if (this.id === 'btn-gestion-candidats') {
        content.innerHTML = `
          <div class="admin-box">
            <h2>Gestion des candidats</h2>
            <div class="admin-actions">
              <button class="admin-btn" id="startBtn">Démarrer les candidatures</button>
              <button class="admin-btn" id="closeBtn">Fermer les candidatures</button>
              <button class="admin-btn" id="statsBtn">Statistique des candidats</button>
            </div>
            <div class="admin-actions">
              <button class="admin-btn danger" id="deleteBtn">supprimer</button>
              <button class="admin-btn" id="cancelBtn">Annuler</button>
              <button class="admin-btn" id="backBtn">retour</button>
            </div>
          </div>
        `;
        setTimeout(() => {
          document.getElementById('startBtn').onclick = () => {
            startCandModal.style.display = 'flex';
          };
          document.getElementById('closeBtn').onclick = () => {
            const cat = prompt('Catégorie à fermer (aes, club, classe) :');
            if (!cat || !['aes','club','classe'].includes(cat.toLowerCase())) return;
            if (!isCandidatureActive(cat.toLowerCase())) { alert('Pas de session ouverte pour cette catégorie'); return; }
            endCandidature(cat.toLowerCase());
            alert('Candidatures fermées pour ' + cat.toUpperCase());
          };
          document.getElementById('statsBtn').onclick = () => alert('Statistiques des candidats');
          document.getElementById('deleteBtn').onclick = () => {
            if(confirm('Voulez-vous vraiment supprimer ?')) alert('Suppression effectuée');
          };
          document.getElementById('cancelBtn').onclick = () => alert('Action annulée');
          document.getElementById('backBtn').onclick = showWelcome;
        }, 10);
      } else if (this.id === 'btn-gestion-comites') {
        content.innerHTML = `
          <div class="admin-box">
            <h2>GESTION DES COMITES D'ELECTIONS</h2>
            <div class="admin-actions" style="margin-top:40px;">
              <button class="admin-btn" id="nommerComiteBtn">nommer un comité</button>
              <button class="admin-btn" id="consulterComiteBtn">consulter les comités</button>
            </div>
            <div class="admin-actions" style="margin-top:40px;">
              <button class="admin-btn" id="backBtn">retour</button>
            </div>
          </div>
        `;
        setTimeout(() => {
          document.getElementById('nommerComiteBtn').onclick = () => alert('Nommer un comité');
          document.getElementById('consulterComiteBtn').onclick = () => alert('Consulter les comités');
          document.getElementById('backBtn').onclick = showWelcome;
        }, 10);
      } else if (this.id === 'btn-param-admin') {
        content.innerHTML = `
          <div class="admin-box">
            <h2>PARAMÈTRE DE L’ADMINISTRATEUR</h2>
            <div class="admin-actions" style="margin-top:40px;">
              <button class="admin-btn" id="changePwdBtn">changer de mot de passe</button>
              <button class="admin-btn danger" id="deleteAdminBtn">supprimer un administrateur</button>
              <button class="admin-btn" id="addAdminBtn">ajouter un administrateur</button>
            </div>
            <div class="admin-actions" style="margin-top:40px;">
              <button class="admin-btn" id="backBtn">retour</button>
            </div>
          </div>
        `;
        setTimeout(() => {
          document.getElementById('changePwdBtn').onclick = () => alert('Changer de mot de passe');
          document.getElementById('deleteAdminBtn').onclick = () => alert('Supprimer un administrateur');
          document.getElementById('addAdminBtn').onclick = () => alert('Ajouter un administrateur');
          document.getElementById('backBtn').onclick = showWelcome;
        }, 10);
      } else if (this.id === 'btn-statistiques') {
        content.innerHTML = `
          <div class="admin-box">
            <h2>STATISTIQUES</h2>
            <p>Contenu à définir...</p>
          </div>
        `;
      } else {
        content.innerHTML = `
          <div class="admin-box">
            <h2>${this.textContent}</h2>
            <p>Contenu à définir...</p>
          </div>
        `;
      }
    });
  });

  document.getElementById('logoutBtn').onclick = () => {
    alert('Déconnexion');
    // window.location.href = 'login.html';
  };

  showWelcome();
});