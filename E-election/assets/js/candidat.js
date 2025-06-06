// ===============================
// Fonctions utilitaires pour charger les postes et clubs
// ===============================
function chargerPostes(type) { /* ... */ }
function chargerClubs() { /* ... */ }
function chargerPostesClub(club) { /* ... */ }

// ===============================
// Récupère l'état des sessions de candidature
// ===============================
function getState() {
    return {
        candidature: JSON.parse(localStorage.getItem('candidaturesSessions')) || {}
    };
}

// ===============================
// Ferme automatiquement la session si la date de fin est dépassée
// ===============================
function checkAndCloseCandidatureSession(categorie) {
    let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
    if (candidatures[categorie] && candidatures[categorie].active && Date.now() > candidatures[categorie].end) {
        candidatures[categorie].active = false;
        localStorage.setItem('candidaturesSessions', JSON.stringify(candidatures));
        return false;
    }
    return candidatures[categorie] && candidatures[categorie].active;
}

// ===============================
// Vérifie si une session de candidature est active et dans la période
// ===============================
function isCandidatureActive(categorie) {
    let candidatures = JSON.parse(localStorage.getItem('candidaturesSessions')) || {};
    if (!candidatures[categorie]) return false;
    const now = Date.now();
    // Ferme la session si la date de fin est dépassée
    if (candidatures[categorie].active && now > candidatures[categorie].end) {
        candidatures[categorie].active = false;
        localStorage.setItem('candidaturesSessions', JSON.stringify(candidatures));
        return false;
    }
    return candidatures[categorie].active && now >= candidatures[categorie].start && now <= candidatures[categorie].end;
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

    electionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = btn.dataset.type;
            const state = getState();
            // Récupère la session pour la catégorie
            const c = type === 'club' ? state.candidature.club : state.candidature[type];

            // 1. Ferme la session si la date de fin est dépassée
            if (!checkAndCloseCandidatureSession(type)) {
                if (info) info.innerHTML = `<span style="color:red;">Session terminée ou non ouverte pour ${type.toUpperCase()}.</span>`;
                if (form) form.style.display = 'none';
                return;
            }

            // 2. Si session non ouverte (pas active)
            if (!c || !c.active) {
                if (info) info.innerHTML = `<span style="color:red;">Session non ouverte pour ${type.toUpperCase()}.</span>`;
                if (form) form.style.display = 'none';
                return;
            }

            // 3. Si la date de début n'est pas encore atteinte
            if (Date.now() < c.start) {
                if (info) info.innerHTML = `<span style="color:orange;">La session de candidature pour ${type.toUpperCase()} n'a pas encore commencé.</span>`;
                if (form) form.style.display = 'none';
                return;
            }

            // 4. Session ouverte et période valide : afficher le formulaire
            if (info) {
                const deb = new Date(c.start);
                const end = new Date(c.end);
                info.innerHTML = `<strong>${type.toUpperCase()}</strong> : du ${deb.toLocaleString()} au ${end.toLocaleString()}`;
            }
            if (form) form.style.display = 'block';
            localStorage.setItem('lastCandidatureType', type);

            // Affichage spécifique club ou autre
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
});