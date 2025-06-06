// ===============================
// Données des élections 
// ===============================

let donneesAES = [];
let donneesClubs = [];
let donneesClasse = [];

// Groupement des candidats
function groupByPoste(candidats) {
    const map = {};
    candidats.forEach(c => {
        const p = c.poste || 'Autre';
        if (!map[p]) map[p] = { poste: p, candidats: [] };
        map[p].candidats.push(c);
    });
    return Object.values(map);
}
function groupByClub(candidats) {
    const map = {};
    candidats.forEach(c => {
        const cl = c.club || 'Autre';
        if (!map[cl]) map[cl] = { nomClub: cl, candidats: [] };
        map[cl].candidats.push(c);
    });
    return Object.values(map);
}
function loadCandidates() {
    const all = JSON.parse(localStorage.getItem('candidatures')) || [];
    donneesAES = groupByPoste(all.filter(c => c.type && c.type.toLowerCase() === 'aes'));
    donneesClubs = groupByClub(all.filter(c => c.type && c.type.toLowerCase() === 'club'));
    donneesClasse = groupByPoste(all.filter(c => c.type && c.type.toLowerCase() === 'classe'));
}

// ===============================
// Variables de pagination
// ===============================
let pageAES = 0;
let pageClub = 0;
let pageClasse = 0;

// ===============================
// Gestion du vote (localStorage)
// ===============================
function getVoteKey(type, index) {
    return `vote_${type}_${index}`;
}
function hasVoted(type, index) {
    return !!localStorage.getItem(getVoteKey(type, index));
}
function setVote(type, index, candidat) {
    localStorage.setItem(getVoteKey(type, index), JSON.stringify(candidat));
}
function setUserVoted(type) {
    // Optionnel : pour marquer qu'un utilisateur a voté pour ce type
}

// ===============================
// Vérifie si une session de vote est active pour une catégorie
function isVoteActive(categorie) {
    let votes = JSON.parse(localStorage.getItem('votesSessions')) || {};
    if (!votes[categorie]) return false;
    const now = Date.now();
    // Fermeture automatique si la date de fin est dépassée
    if (votes[categorie].active && now > votes[categorie].end) {
        votes[categorie].active = false;
        localStorage.setItem('votesSessions', JSON.stringify(votes));
        return false;
    }
    // N'est actif que si la date de début est atteinte
    if (votes[categorie].active && now >= votes[categorie].start && now <= votes[categorie].end) {
        return true;
    }
    return false;
}

// Vérifie si l'utilisateur a voté pour tous les postes/clubs d'une catégorie
function hasVotedAll(type) {
    if (type === 'aes') {
        return donneesAES.length > 0 && donneesAES.every((_, idx) => hasVoted('aes', idx));
    }
    if (type === 'classe') {
        return donneesClasse.length > 0 && donneesClasse.every((_, idx) => hasVoted('classe', idx));
    }
    if (type === 'club') {
        return donneesClubs.length > 0 && donneesClubs.every((_, idx) => hasVoted('club', idx));
    }
    return false;
}

// Récupère l'état des sessions
function getState() {
    return {
        vote: JSON.parse(localStorage.getItem('votesSessions')) || {}
    };
}

// ===============================
// Affichage d'une photo en grand (modale)
// ===============================
function afficherPhotoGrand(url, nom, infos = "") {
    const modal = document.createElement('div');
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" aria-label="Fermer">&times;</button>
            <img src="${url}" alt="${nom}">
            <h4>${nom}</h4>
            ${infos ? `<div>${infos}</div>` : ""}
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
}

// ===============================
// Affichage AES (par poste)
// ===============================
function afficherAES(index = pageAES) {
    loadCandidates(); // Recharge les données à chaque affichage
    const contenu = document.getElementById('contenu-vote');
    if (!isVoteActive('aes')) {
        // Affiche la période si existante
        const state = getState();
        const v = state.vote['aes'];
        let periode = '';
        if (v) {
            const deb = new Date(v.start);
            const end = new Date(v.end);
            periode = `<div class="periode">Vote du ${deb.toLocaleString()} au ${end.toLocaleString()}</div>`;
            if (Date.now() < v.start) {
                contenu.innerHTML = `${periode}<div class="alert">La session de vote AES n'a pas encore commencé.</div>`;
                return;
            }
        }
        contenu.innerHTML = `${periode}<div class="alert">Aucune session de vote AES ouverte.</div>`;
        return;
    }
    const poste = donneesAES[index];
    if (!poste) {
        contenu.innerHTML = `<div class="alert">Aucun poste disponible.</div>`;
        return;
    }
    const voteKey = getVoteKey('aes', index);
    const dejaVote = hasVoted('aes', index);

    // Génère le HTML des candidats avec bouton de vote
    const candidatsHTML = poste.candidats.map((c, i) => {
        const voted = dejaVote && JSON.parse(localStorage.getItem(voteKey)).nom === c.nom && JSON.parse(localStorage.getItem(voteKey)).prenom === c.prenom;
        return `
        <div class="candidat">
            <img src="${c.photo}" alt="${c.prenom} ${c.nom}" class="photo-candidat" data-nom="${c.prenom} ${c.nom}" data-infos="<strong>Classe :</strong> ${c.classe}<br><strong>Nationalité :</strong> ${c.nationalite}<br><em>${c.mots}</em>">
            <h4>${c.prenom} ${c.nom}</h4>
            <p><strong>Classe :</strong> ${c.classe}</p>
            <p><strong>Nationalité :</strong> ${c.nationalite}</p>
            <p><em>"${c.mots}"</em></p>
            <button class="vote-btn${voted ? ' selected' : ''}" data-index="${i}" ${dejaVote ? 'disabled' : ''}>${voted ? 'Votre vote' : 'Voter'}</button>
        </div>
        `;
    }).join('');

    // Pagination
    const paginationHTML = `
        <button class="page-prev" ${index === 0 ? 'disabled' : ''}>Précédent</button>
        <span>Poste ${index + 1} / ${donneesAES.length}</span>
        <button class="page-next" ${index === donneesAES.length - 1 ? 'disabled' : ''}>Suivant</button>
    `;

    contenu.innerHTML = `
        <h2>Élections AES</h2>
        <div class="poste">
            <h3>Poste : ${poste.poste}</h3>
            <div class="candidats">${candidatsHTML}</div>
        </div>
        <div class="pagination">${paginationHTML}</div>
        ${dejaVote ? `<div class="vote-confirm">Vous avez voté pour ce poste.<br>Merci pour votre participation !</div>` : ""}
    `;

    // Pagination
    contenu.querySelector('.page-prev')?.addEventListener('click', () => {
        if (index > 0) {
            pageAES = index - 1;
            afficherAES(pageAES);
        }
    });
    contenu.querySelector('.page-next')?.addEventListener('click', () => {
        if (index < donneesAES.length - 1) {
            pageAES = index + 1;
            afficherAES(pageAES);
        }
    });

    // Vote
    if (!dejaVote) {
        contenu.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                setVote('aes', index, poste.candidats[idx]);
                setUserVoted('aes');
                // Vérifie si tous les votes sont faits pour AES
                if (hasVotedAll('aes')) {
                    localStorage.setItem('canSeeStats', 'aes');
                }
                afficherAES(index);
            });
        });
    }

    // Affichage grand format sur chaque photo
    contenu.querySelectorAll('.photo-candidat').forEach(img => {
        img.addEventListener('click', function() {
            afficherPhotoGrand(this.src, this.dataset.nom, this.dataset.infos);
        });
    });
}

// ===============================
// Affichage Clubs (par club)
// ===============================
function afficherClub(index = pageClub) {
    loadCandidates();
    const contenu = document.getElementById('contenu-vote');
    if (!isVoteActive('club')) {
        const state = getState();
        const v = state.vote['club'];
        let periode = '';
        if (v) {
            const deb = new Date(v.start);
            const end = new Date(v.end);
            periode = `<div class="periode">Vote du ${deb.toLocaleString()} au ${end.toLocaleString()}</div>`;
            if (Date.now() < v.start) {
                contenu.innerHTML = `${periode}<div class="alert">La session de vote Club n'a pas encore commencé.</div>`;
                return;
            }
        }
        contenu.innerHTML = `${periode}<div class="alert">Aucune session de vote Club ouverte.</div>`;
        return;
    }
    const club = donneesClubs[index];
    if (!club) {
        contenu.innerHTML = `<div class="alert">Aucun club disponible.</div>`;
        return;
    }
    const voteKey = getVoteKey('club', index);
    const dejaVote = hasVoted('club', index);

    // Génère le HTML pour chaque candidat à la présidence du club
    const candidatsHTML = club.candidats.map((candidat, idx) => {
        const voted = dejaVote && JSON.parse(localStorage.getItem(voteKey)).nom === candidat.nom && JSON.parse(localStorage.getItem(voteKey)).prenom === candidat.prenom;
        return `
        <div class="candidat">
            <img src="${candidat.photo}" alt="${candidat.prenom} ${candidat.nom}" class="photo-candidat"
                data-nom="${candidat.prenom} ${candidat.nom}"
                data-infos="<strong>Classe :</strong> ${candidat.classe}<br><strong>Nationalité :</strong> ${candidat.nationalite}">
            <h4>${candidat.prenom} ${candidat.nom}</h4>
            <p><strong>Classe :</strong> ${candidat.classe}</p>
            <p><strong>Nationalité :</strong> ${candidat.nationalite}</p>
            <div class="actions">
                ${candidat.programme ? `<a href="${candidat.programme}" target="_blank" class="btn" download>Voir Programme</a>` : `<button class="btn" disabled>Programme non disponible</button>`}
                <button class="vote-btn${voted ? ' selected' : ''}" data-index="${idx}" ${dejaVote ? 'disabled' : ''}>${voted ? 'Votre vote' : 'Voter'}</button>
                <button class="btn btn-membres" data-candidat="${idx}">Membres de l’équipe</button>
            </div>
        </div>
        `;
    }).join('');

    // Pagination clubs
    const paginationHTML = `
        <button class="page-prev" ${index === 0 ? 'disabled' : ''}>Précédent</button>
        <span>Club ${index + 1} / ${donneesClubs.length}</span>
        <button class="page-next" ${index === donneesClubs.length - 1 ? 'disabled' : ''}>Suivant</button>
    `;

    contenu.innerHTML = `
        <h2>Club : ${club.nomClub}</h2>
        <div class="poste"><h3>Poste : Président</h3></div>
        <div class="candidats">${candidatsHTML}</div>
        <div class="pagination">${paginationHTML}</div>
        ${dejaVote ? `<div class="vote-confirm">Vous avez voté pour ce club.<br>Merci pour votre participation !</div>` : ""}
    `;

    // Pagination clubs
    contenu.querySelector('.page-prev')?.addEventListener('click', () => {
        if (index > 0) {
            pageClub = index - 1;
            afficherClub(pageClub);
        }
    });
    contenu.querySelector('.page-next')?.addEventListener('click', () => {
        if (index < donneesClubs.length - 1) {
            pageClub = index + 1;
            afficherClub(pageClub);
        }
    });

    // Vote
    if (!dejaVote) {
        contenu.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                setVote('club', index, club.candidats[idx]);
                setUserVoted('club');
                if (hasVotedAll('club')) {
                    localStorage.setItem('canSeeStats', 'club');
                }
                afficherClub(index);
            });
        });
    }

    // Affichage grand format sur chaque photo de candidat
    contenu.querySelectorAll('.photo-candidat').forEach(img => {
        img.addEventListener('click', function() {
            afficherPhotoGrand(this.src, this.dataset.nom, this.dataset.infos);
        });
    });

    // Affichage des membres pour chaque candidat
    contenu.querySelectorAll('.btn-membres').forEach(btn => {
        btn.addEventListener('click', function() {
            const idxCandidat = parseInt(this.getAttribute('data-candidat'));
            afficherMembresClub(index, idxCandidat);
        });
    });
}

// ===============================
// Affichage Classe (par poste)
// ===============================
function afficherClasse(index = pageClasse) {
    loadCandidates();
    const contenu = document.getElementById('contenu-vote');
    if (!isVoteActive('classe')) {
        const state = getState();
        const v = state.vote['classe'];
        let periode = '';
        if (v) {
            const deb = new Date(v.start);
            const end = new Date(v.end);
            periode = `<div class="periode">Vote du ${deb.toLocaleString()} au ${end.toLocaleString()}</div>`;
            if (Date.now() < v.start) {
                contenu.innerHTML = `${periode}<div class="alert">La session de vote Classe n'a pas encore commencé.</div>`;
                return;
            }
        }
        contenu.innerHTML = `${periode}<div class="alert">Aucune session de vote Classe ouverte.</div>`;
        return;
    }
    const poste = donneesClasse[index];
    if (!poste) {
        contenu.innerHTML = `<div class="alert">Aucun poste disponible.</div>`;
        return;
    }
    const voteKey = getVoteKey('classe', index);
    const dejaVote = hasVoted('classe', index);

    // Génère le HTML des candidats
    const candidatsHTML = poste.candidats.map((c, i) => {
        const voted = dejaVote && JSON.parse(localStorage.getItem(voteKey)).nom === c.nom && JSON.parse(localStorage.getItem(voteKey)).prenom === c.prenom;
        return `
        <div class="candidat">
            <img src="${c.photo}" alt="${c.prenom} ${c.nom}" class="photo-candidat" data-nom="${c.prenom} ${c.nom}" data-infos="<strong>Classe :</strong> ${c.classe}<br><strong>Nationalité :</strong> ${c.nationalite}<br><em>${c.mots || ''}</em>">
            <h4>${c.prenom} ${c.nom}</h4>
            <p><strong>Classe :</strong> ${c.classe}</p>
            <p><strong>Nationalité :</strong> ${c.nationalite}</p>
            <p><em>"${c.mots || ''}"</em></p>
            <button class="vote-btn${voted ? ' selected' : ''}" data-index="${i}" ${dejaVote ? 'disabled' : ''}>${voted ? 'Votre vote' : 'Voter'}</button>
        </div>
        `;
    }).join('');

    // Pagination
    const paginationHTML = `
        <button class="page-prev" ${index === 0 ? 'disabled' : ''}>Précédent</button>
        <span>Poste ${index + 1} / ${donneesClasse.length}</span>
        <button class="page-next" ${index === donneesClasse.length - 1 ? 'disabled' : ''}>Suivant</button>
    `;

    contenu.innerHTML = `
        <h2>Élections Classe</h2>
        <div class="poste">
            <h3>Poste : ${poste.poste}</h3>
            <div class="candidats">${candidatsHTML}</div>
        </div>
        <div class="pagination">${paginationHTML}</div>
        ${dejaVote ? `<div class="vote-confirm">Vous avez voté pour ce poste.<br>Merci pour votre participation !</div>` : ""}
    `;

    // Pagination
    contenu.querySelector('.page-prev')?.addEventListener('click', () => {
        if (index > 0) {
            pageClasse = index - 1;
            afficherClasse(pageClasse);
        }
    });
    contenu.querySelector('.page-next')?.addEventListener('click', () => {
        if (index < donneesClasse.length - 1) {
            pageClasse = index + 1;
            afficherClasse(pageClasse);
        }
    });

    // Vote
    if (!dejaVote) {
        contenu.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                setVote('classe', index, poste.candidats[idx]);
                setUserVoted('classe');
                if (hasVotedAll('classe')) {
                    localStorage.setItem('canSeeStats', 'classe');
                }
                afficherClasse(index);
            });
        });
    }

    // Affichage grand format sur chaque photo
    contenu.querySelectorAll('.photo-candidat').forEach(img => {
        img.addEventListener('click', function() {
            afficherPhotoGrand(this.src, this.dataset.nom, this.dataset.infos);
        });
    });
}

// ===============================
// Gestion du selecteur de type d'élection
// ===============================
document.getElementById('type-election').addEventListener('change', function () {
    localStorage.setItem('lastVoteType', this.value);
    const selection = this.value;
    // Réinitialise la pagination à chaque changement de type
    pageAES = 0;
    pageClub = 0;
    pageClasse = 0;
    if (!isVoteActive(selection)) {
        document.getElementById('vote-info').textContent = 'Aucun vote en cours pour ' + selection.toUpperCase();
        document.getElementById('contenu-vote').innerHTML = '';
        return;
    }
    const state = getState();
    const v = state.vote[selection];
    if (v) {
        const deb = new Date(v.start);
        const end = new Date(v.end);
        document.getElementById('vote-info').textContent = 'Vote du ' + deb.toLocaleString() + ' au ' + end.toLocaleString();
    }
    if (selection === 'aes') {
        afficherAES(pageAES);
    } else if (selection === 'club') {
        afficherClub(pageClub);
    } else if (selection === 'classe') {
        afficherClasse(pageClasse);
    }
});

// ===============================
// Affichage initial à l'ouverture de la page
// ===============================
window.addEventListener('DOMContentLoaded', function() {
    loadCandidates();
    const select = document.getElementById('type-election');
    select.value = 'aes'; // Par défaut, AES
    pageAES = 0;
    pageClub = 0;
    pageClasse = 0;
    const selection = select.value;
    if (!isVoteActive(selection)) {
        document.getElementById('vote-info').textContent = 'Aucun vote en cours pour ' + selection.toUpperCase();
function initVotePage() {
    const info = document.getElementById('vote-info');
    const select = document.getElementById('type-election');
    const stored = localStorage.getItem('lastVoteType');
    if (stored) select.value = stored;
    if (!isVoteActive()) {
        if (info) info.textContent = 'Aucun vote en cours.';
        document.getElementById('contenu-vote').innerHTML = '';
        return;
    }
    const state = getState();
    const v = state.vote[selection];
    if (v) {
        const deb = new Date(v.start);
        const end = new Date(v.end);
        document.getElementById('vote-info').textContent = 'Vote du ' + deb.toLocaleString() + ' au ' + end.toLocaleString();
    }
    afficherAES(pageAES);
});
    select.dispatchEvent(new Event('change'));
}

document.addEventListener('DOMContentLoaded', initVotePage);
document.addEventListener('stateChanged', initVotePage);
