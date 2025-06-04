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
              <div class="admin-link">
                <a href="pages/vote.html" id="etatVotes" style="color:#fff;text-decoration:underline;">Etat des votes</a>
              </div>
              <div style="margin:18px 0;">
                <button class="admin-btn green" id="startVotesBtn">Démarrer les votes</button>
                <button class="admin-btn danger" id="stopVotesBtn">Arrêter les votes</button>
              </div>
              <div style="margin:18px 0;">
                <button class="admin-btn danger" id="resetBtn">supprimer</button>
                <button class="admin-btn secondary" id="cancelBtn">Annuler</button>
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
          // Ajouter un poste PAR TYPE
          const addPoste = document.getElementById('addPoste');
          if (addPoste) {
            addPoste.onclick = (e) => {
              e.preventDefault();
              const type = prompt('Type d\'élection (club, aes, classe) :').toLowerCase();
              if (!['club', 'aes', 'classe'].includes(type)) {
                alert('Type d\'élection invalide.');
                return;
              }
              const nom = prompt('Nom du nouveau poste :');
              if (nom) {
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
            };
          }
          // Supprimer un poste PAR TYPE
          const deletePoste = document.getElementById('deletePoste');
          if (deletePoste) {
            deletePoste.onclick = (e) => {
              e.preventDefault();
              const type = prompt('Type d\'élection (club, aes, classe) :').toLowerCase();
              let postesByType = JSON.parse(localStorage.getItem('postesByType')) || {};
              if (!postesByType[type] || postesByType[type].length === 0) {
                alert('Aucun poste à supprimer pour ce type.');
                return;
              }
              const nom = prompt('Nom du poste à supprimer :\n' + postesByType[type].join(', '));
              if (nom && postesByType[type].includes(nom)) {
                postesByType[type] = postesByType[type].filter(p => p !== nom);
                localStorage.setItem('postesByType', JSON.stringify(postesByType));
                alert('Poste supprimé pour ' + type + ' !');
              } else if (nom) {
                alert('Ce poste n\'existe pas pour ce type.');
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
              <button class="admin-btn secondary" id="cancelBtn">Annuler</button>
              <button class="admin-btn secondary" id="backBtn">retour</button>
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
              <button class="admin-btn secondary" id="backBtn">retour</button>
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
              <button class="admin-btn secondary" id="backBtn">retour</button>
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