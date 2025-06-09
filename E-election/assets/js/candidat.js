// ===============================
// Fonctions utilitaires pour charger les postes et clubs
// ===============================
function chargerPostes(type) {
    const select = document.getElementById('posteSelect');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Choisir un poste</option>';
    let postesByType = JSON.parse(localStorage.getItem('postesByType') || '{}');
    const postes = postesByType[type] || [];
    postes.forEach(poste => {
        const opt = document.createElement('option');
        opt.value = poste;
        opt.textContent = poste;
        select.appendChild(opt);
    });
}

function chargerClubs() {
    const select = document.getElementById('clubSelect');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Choisir un club</option>';
    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    clubs.forEach(club => {
        const opt = document.createElement('option');
        opt.value = club;
        opt.textContent = club;
        select.appendChild(opt);
    });
    select.onchange = function() {
        chargerPostesClub(this.value);
    };
}

function chargerPostesClub(club) {
    const select = document.getElementById('posteSelect');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Choisir un poste</option>';
    let postesByClub = JSON.parse(localStorage.getItem('postesByClub') || '{}');
    const postes = postesByClub[club] || [];
    postes.forEach(poste => {
        const opt = document.createElement('option');
        opt.value = poste;
        opt.textContent = poste;
        select.appendChild(opt);
    });
}

// ===============================
// Gestion de l'état des sessions (utilise state.js)
// ===============================
// La fonction getState provient désormais de state.js. On se contente donc de
// vérifier l'expiration et de sauvegarder le nouvel état si besoin.
function checkAndCloseCandidatureSession(categorie) {
    const state = getState();
    const session = categorie === 'club' ? state.candidature.club : state.candidature[categorie];
    if (!session) return false;
    if (session.active && Date.now() > session.endTime) {
        session.active = false;
        saveState(state);
        return false;
    }
    return session.active;
}

// ===============================
// Gestion de l'affichage du formulaire de candidature selon la session
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    const electionButtons = document.querySelectorAll('.election-btn');
    const info = document.getElementById('candidature-info');
    const form = document.getElementById('newCandidature');
    const clubGroup = document.getElementById('clubGroup');
    const clubSelect = document.getElementById('clubSelect');
    const posteSelect = document.getElementById('posteSelect');

    // Par défaut, masquer le formulaire et les groupes spécifiques
    if (form) form.style.display = 'none';
    if (clubGroup) clubGroup.style.display = 'none';

    // Stocke le type sélectionné pour la soumission
    let currentType = null;

    // Lorsqu'on clique sur un bouton de type (AES, Club, Classe)
    electionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = btn.dataset.type;
            currentType = type;
            const state = getState();
            const c = type === 'club' ? state.candidature.club : state.candidature[type];

            // 1. Ferme la session si la date de fin est dépassée
            if (!checkAndCloseCandidatureSession(type)) {
                if (info) info.innerHTML = `<span style="color:red;">Session terminée ou non ouverte pour ${type.toUpperCase()}.</span>`;
                if (form) form.style.display = 'none';
                if (clubGroup) clubGroup.style.display = 'none';
                return;
            }

            // 2. Si session non ouverte (pas active)
            if (!c || !c.active) {
                if (info) info.innerHTML = `<span style="color:red;">Session non ouverte pour ${type.toUpperCase()}.</span>`;
                if (form) form.style.display = 'none';
                if (clubGroup) clubGroup.style.display = 'none';
                return;
            }

            // 3. Si la date de début n'est pas encore atteinte
            if (Date.now() < c.startTime) {
                if (info) info.innerHTML = `<span style="color:orange;">La session de candidature pour ${type.toUpperCase()} n'a pas encore commencé.</span>`;
                if (form) form.style.display = 'none';
                if (clubGroup) clubGroup.style.display = 'none';
                return;
            }

            // 4. Session ouverte et période valide : afficher le formulaire
            if (info) {
                const deb = new Date(c.startTime);
                const end = new Date(c.endTime);
                info.innerHTML = `<strong>${type.toUpperCase()}</strong> : du ${deb.toLocaleString()} au ${end.toLocaleString()}`;
            }
            if (form) form.style.display = 'block';
            localStorage.setItem('lastCandidatureType', type);

            // Affichage spécifique club ou autre
            if (type === 'club') {
                if (clubGroup) clubGroup.style.display = 'block';
                chargerClubs();
                chargerPostesClub(clubSelect.value);
            } else if (type === 'aes') {
                if (clubGroup) clubGroup.style.display = 'none';
                chargerPostes('aes');
            } else if (type === 'classe') {
                if (clubGroup) clubGroup.style.display = 'none';
                chargerPostes('classe');
            } else {
                if (clubGroup) clubGroup.style.display = 'none';
                chargerPostes(type);
            }
        });
    });

    // Gestion de la soumission du formulaire de candidature
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();

            // Vérifie le type sélectionné
            const type = currentType || localStorage.getItem('lastCandidatureType');
            if (!type) {
                alert("Veuillez d'abord choisir un type de candidature.");
                return;
            }

            // Vérifie le poste sélectionné
            const poste = posteSelect ? posteSelect.value : '';
            if (!poste) {
                alert("Veuillez choisir un poste.");
                return;
            }

            // Pour club, vérifie le club sélectionné
            let club = '';
            if (type === 'club') {
                club = clubSelect ? clubSelect.value : '';
                if (!club) {
                    alert("Veuillez choisir un club.");
                    return;
                }
            }

            // Récupère les autres champs du formulaire (exemple)
            const nom = document.getElementById('nom')?.value || '';
            const prenom = document.getElementById('prenom')?.value || '';
            // Ajoute ici d'autres champs si besoin

            if (!nom || !prenom) {
                alert("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            // Création de la candidature
            const candidature = {
                type,
                poste,
                club,
                nom,
                prenom
                // ...autres champs...
            };

            // Ajout dans le localStorage
            let candidatures = JSON.parse(localStorage.getItem('candidatures') || '[]');
            candidatures.push(candidature);
            localStorage.setItem('candidatures', JSON.stringify(candidatures));

            // Redirection vers la page de mes candidatures
            window.location.href = "mes-candidatures.html";
        };
    }

    // Si la page est dédiée à la classe, charger directement les postes de classe
    if (document.body.dataset.candidatureClasse === "true") {
        if (clubGroup) clubGroup.style.display = 'none';
        chargerPostes('classe');
        if (form) form.style.display = 'block';
        currentType = 'classe';
        localStorage.setItem('lastCandidatureType', 'classe');
    }
});