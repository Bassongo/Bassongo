document.addEventListener('DOMContentLoaded', () => {
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
              const modal = document.createElement('div');
              modal.className = 'modal';
              modal.innerHTML = `
                <div class="modal-content">
                  <span class="close-btn">&times;</span>
                  <h3>Démarrer les votes</h3>
                  <div class="form-group">
                    <label for="voteType">Type d'élection</label>
                    <select id="voteType">
                      <option value="aes">AES</option>
                      <option value="club">Club</option>
                      <option value="classe">Classe</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="voteStart">Date et heure de début</label>
                    <input type="datetime-local" id="voteStart">
                  </div>
                  <div class="form-group">
                    <label for="voteEnd">Date et heure de fin</label>
                    <input type="datetime-local" id="voteEnd">
                  </div>
                  <div class="form-actions">
                    <button id="confirmStartVote" class="admin-btn">valider</button>
                    <button id="cancelStartVote" class="admin-btn danger">Annuler</button>
                  </div>
                </div>`;
              document.body.appendChild(modal);
              modal.style.display = 'flex';
              const closeModal = () => modal.remove();
              modal.querySelector('.close-btn').onclick = closeModal;
              modal.querySelector('#cancelStartVote').onclick = closeModal;
              modal.onclick = e => { if (e.target === modal) closeModal(); };
              modal.querySelector('#confirmStartVote').onclick = () => {
                const type = modal.querySelector('#voteType').value;
                const debut = modal.querySelector('#voteStart').value;
                const fin = modal.querySelector('#voteEnd').value;
                if (!type || !debut || !fin) {
                  alert('Tous les champs sont requis');
                  return;
                }
                localStorage.setItem('voteConfig', JSON.stringify({type, debut, fin}));
                alert('Votes démarrés !');
                closeModal();
              };
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
          document.getElementById('startBtn').onclick = () => alert('Candidatures ouvertes !');
          document.getElementById('closeBtn').onclick = () => alert('Candidatures fermées !');
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