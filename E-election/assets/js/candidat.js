// ===============================
// Fonctions utilitaires pour charger les postes et clubs
// ===============================

// Charge les postes pour AES ou Classe selon le type sélectionné
function chargerPostes(type) {
    const select = document.getElementById('posteSelect');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Choisir un poste</option>';
    let postesByType = JSON.parse(localStorage.getItem('postesByType')) || {};
    const postes = postesByType[type] || [];
    postes.forEach(poste => {
        const opt = document.createElement('option');
        opt.value = poste;
        opt.textContent = poste;
        select.appendChild(opt);
    });
}

// Charge les clubs dans la liste déroulante
function chargerClubs() {
    const select = document.getElementById('clubSelect');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Choisir un club</option>';
    const clubs = JSON.parse(localStorage.getItem('clubs')) || [];
    clubs.forEach(club => {
        const opt = document.createElement('option');
        opt.value = club;
        opt.textContent = club;
        select.appendChild(opt);
    });
    // Recharge les postes du club sélectionné à chaque changement
    select.onchange = function() {
        chargerPostesClub(this.value);
    };
}

// Charge les postes pour un club donné
function chargerPostesClub(club) {
    const select = document.getElementById('posteSelect');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Choisir un poste</option>';
    let postesByClub = JSON.parse(localStorage.getItem('postesByClub')) || {};
    const postes = postesByClub[club] || [];
    postes.forEach(poste => {
        const opt = document.createElement('option');
        opt.value = poste;
        opt.textContent = poste;
        select.appendChild(opt);
    });
}

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
    const posteSelect = document.getElementById('posteSelect');

    // Par défaut, masquer le formulaire et les groupes spécifiques
    if (form) form.style.display = 'none';
    if (clubGroup) clubGroup.style.display = 'none';

    // Lorsqu'on clique sur un bouton de type (AES, Club, Classe)
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
            if (Date.now() < c.start) {
                if (info) info.innerHTML = `<span style="color:orange;">La session de candidature pour ${type.toUpperCase()} n'a pas encore commencé.</span>`;
                if (form) form.style.display = 'none';
                if (clubGroup) clubGroup.style.display = 'none';
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

    // Si la page est dédiée à la classe, charger directement les postes de classe
    if (document.body.dataset.candidatureClasse === "true") {
        if (clubGroup) clubGroup.style.display = 'none';
        chargerPostes('classe');
        if (form) form.style.display = 'block';
    }
});
// Gestion de la soumission du formulaire de candidature
// Sauvegarde les données et redirige vers la page Mes candidatures
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('validerCandidatureBtn');
    const form = document.getElementById('newCandidature');
    if (!btn || !form) return;
    btn.addEventListener('click', () => {
        const type = localStorage.getItem('lastCandidatureType');
        if (!type) {
            alert('Sélectionnez d\'abord le type d\'élection');
            return;
        }
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const classe = document.getElementById('classe').value;
        const poste = document.getElementById('posteSelect').value;
        const programme = document.getElementById('programme').value.trim();
        const club = type === 'club' ? document.getElementById('clubSelect').value : '';
        if (!nom || !prenom || !classe || !poste || !programme || (type === 'club' && !club)) {
            alert('Veuillez remplir tous les champs requis');
            return;
        }
        const photoInput = document.getElementById('photo');
        let photoUrl = '';
        if (photoInput.files && photoInput.files[0]) {
            photoUrl = URL.createObjectURL(photoInput.files[0]);
        }
        const candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];
        candidatures.push({
            id: Date.now(),
            type,
            club,
            nom,
            prenom,
            classe,
            poste,
            programme,
            photo: photoUrl,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('candidatures', JSON.stringify(candidatures));
        window.location.href = 'mes-candidatures.html';
    });
});
