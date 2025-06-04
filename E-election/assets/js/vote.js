// ===============================
// Données des élections 
// ===============================


// Données AES (exemple)
const donneesAES = [
    {
        poste: "Président",
        candidats: [
            { nom: "Kaboré", prenom: "Ali", classe: "3ème ISE", nationalite: "Burkinabè", mots: "Unir pour construire", photo: "../assets/img/ali.jpg" },
            { nom: "Sawadogo", prenom: "Fatou", classe: "2ème ECO", nationalite: "Burkinabè", mots: "Innovation pour tous", photo: "../assets/img/fatou.jpg" },
            { nom: "Diallo", prenom: "Mamadou", classe: "2ème ISE", nationalite: "Sénégalais", mots: "Pour une AES forte", photo: "../assets/img/mamadou.jpg" }
        ]
    },
    {
        poste: "Vice-Président",
        candidats: [
            { nom: "Traoré", prenom: "Aminata", classe: "1ère ECO", nationalite: "Mali", mots: "Ensemble vers l'excellence", photo: "../assets/img/aminata.jpg" },
            { nom: "Sow", prenom: "Ibrahima", classe: "3ème ISE", nationalite: "Sénégalais", mots: "Agir pour tous", photo: "../assets/img/ibrahima.jpg" }
        ]
    },
    {
        poste: "Secrétaire Général",
        candidats: [
            { nom: "Ouédraogo", prenom: "Moussa", classe: "1ère ISE", nationalite: "Burkinabè", mots: "Transparence et rigueur", photo: "../assets/img/moussa.jpg" }
        ]
    },
    {
        poste: "Trésorier",
        candidats: [
            { nom: "Zongo", prenom: "Rachid", classe: "2ème ECO", nationalite: "Burkinabè", mots: "Gérer avec équité", photo: "../assets/img/rachid.jpg" },
            { nom: "Barry", prenom: "Awa", classe: "2ème ISE", nationalite: "Guinéenne", mots: "Pour une gestion claire", photo: "../assets/img/awa.jpg" }
        ]
    },
    {
        poste: "Responsable Communication",
        candidats: [
            { nom: "Diop", prenom: "Seynabou", classe: "1ère ECO", nationalite: "Sénégalaise", mots: "Communiquer pour avancer", photo: "../assets/img/seynabou.jpg" },
            { nom: "Kane", prenom: "Moussa", classe: "3ème ISE", nationalite: "Sénégalais", mots: "La voix de l'AES", photo: "../assets/img/kane.jpg" },
            { nom: "Cissé", prenom: "Fatima", classe: "2ème ECO", nationalite: "Mali", mots: "Informer, rassembler", photo: "../assets/img/fatima.jpg" }
        ]
    },
    {
        poste: "Responsable Culturel",
        candidats: [
            { nom: "Ndiaye", prenom: "Cheikh", classe: "1ère ISE", nationalite: "Sénégalais", mots: "Culture pour tous", photo: "../assets/img/cheikh.jpg" }
        ]
    },
    {
        poste: "Responsable Sportif",
        candidats: [
            { nom: "Camara", prenom: "Moussa", classe: "2ème ECO", nationalite: "Guinéen", mots: "Le sport, notre force", photo: "../assets/img/moussa_camara.jpg" },
            { nom: "Sagna", prenom: "Marie", classe: "1ère ECO", nationalite: "Sénégalaise", mots: "Bouger ensemble", photo: "../assets/img/marie.jpg" }
        ]
    },
    {
        poste: "Responsable Logistique",
        candidats: [
            { nom: "Fofana", prenom: "Abdoulaye", classe: "3ème ISE", nationalite: "Guinéen", mots: "L'organisation avant tout", photo: "../assets/img/abdoulaye.jpg" }
        ]
    },
    {
        poste: "Responsable Informatique",
        candidats: [
            { nom: "Sy", prenom: "Ousmane", classe: "2ème ISE", nationalite: "Sénégalais", mots: "Numériser l'AES", photo: "../assets/img/ousmane.jpg" },
            { nom: "Kouyaté", prenom: "Binta", classe: "1ère ECO", nationalite: "Guinéenne", mots: "Pour une AES connectée", photo: "../assets/img/binta.jpg" }
        ]
    },
    {
        poste: "Responsable Santé",
        candidats: [
            { nom: "Ba", prenom: "Aissatou", classe: "2ème ECO", nationalite: "Sénégalaise", mots: "La santé avant tout", photo: "../assets/img/aissatou.jpg" }
        ]
    }
];

// Données Clubs
const donneesClubs = [
    {
        nomClub: "Leadership",
        candidats: [
            {
                nom: "Kaboré",
                prenom: "Fatoumata",
                nationalite: "Burkinabè",
                classe: "L2 Statistique",
                photo: "../assets/img/fatoumata.jpg",
                programme: "../assets/docs/programme_leadership.pdf",
                membres: [
                    { nom: "Ouédraogo", prenom: "Issa", nationalite: "Burkinabè", classe: "L1 Informatique", photo: "../assets/img/issa.jpg" },
                    { nom: "Zongo", prenom: "Mariam", nationalite: "Burkinabè", classe: "L2 Économie", photo: "../assets/img/mariam.jpg" }
                ]
            },
            {
                nom: "Traoré",
                prenom: "Aminata",
                nationalite: "Mali",
                classe: "L3 Statistique",
                photo: "../assets/img/aminata.jpg",
                programme: "",
                membres: [
                    { nom: "Kone", prenom: "Salif", nationalite: "Mali", classe: "L2 Statistique", photo: "../assets/img/salif.jpg" }
                ]
            }
        ]
    },
    {
        nomClub: "Presse",
        candidats: [
            {
                nom: "Sanou",
                prenom: "Yacouba",
                nationalite: "Burkinabè",
                classe: "L3 Journalisme",
                photo: "../assets/img/yacouba.jpg",
                programme: "../assets/docs/programme_presse.pdf",
                membres: [
                    { nom: "Compaoré", prenom: "Aïcha", nationalite: "Burkinabè", classe: "L2 Info", photo: "../assets/img/aicha.jpg" },
                    { nom: "Kinda", prenom: "Roland", nationalite: "Burkinabè", classe: "L2 Journalisme", photo: "../assets/img/roland.jpg" }
                ]
            }
        ]
    },
    {
        nomClub: "Anglais",
        candidats: [
            {
                nom: "Ouedraogo",
                prenom: "Judicaël",
                nationalite: "Burkinabè",
                classe: "L3 Lettres Modernes",
                photo: "../assets/img/judicael.jpg",
                programme: "",
                membres: [
                    { nom: "Tapsoba", prenom: "Linda", nationalite: "Burkinabè", classe: "L1 Anglais", photo: "../assets/img/linda.jpg" }
                ]
            },
            {
                nom: "Smith",
                prenom: "John",
                nationalite: "Nigérian",
                classe: "L2 Anglais",
                photo: "../assets/img/john.jpg",
                programme: "../assets/docs/programme_anglais.pdf",
                membres: [
                    { nom: "Koulibaly", prenom: "Mohamed", nationalite: "Malien", classe: "L2 Traduction", photo: "../assets/img/mohamed.jpg" }
                ]
            }
        ]
    },
    {
        nomClub: "Informatique",
        candidats: [
            {
                nom: "Zida",
                prenom: "Nicolas",
                nationalite: "Burkinabè",
                classe: "L2 Informatique",
                photo: "../assets/img/nicolas.jpg",
                programme: "../assets/docs/programme_informatique.pdf",
                membres: [
                    { nom: "Nana", prenom: "Sophie", nationalite: "Burkinabè", classe: "L1 Info", photo: "../assets/img/sophie.jpg" },
                    { nom: "Sawadogo", prenom: "Ali", nationalite: "Burkinabè", classe: "L2 Info", photo: "../assets/img/ali.jpg" },
                    { nom: "Barry", prenom: "Salif", nationalite: "Guinéen", classe: "L3 Info", photo: "../assets/img/salif.jpg" }
                ]
            },
            {
                nom: "Diallo",
                prenom: "Aminata",
                nationalite: "Guinéenne",
                classe: "L3 Informatique",
                photo: "../assets/img/aminata.jpg",
                programme: "",
                membres: [
                    { nom: "Kone", prenom: "Fatou", nationalite: "Mali", classe: "L2 Info", photo: "../assets/img/fatou.jpg" }
                ]
            },
            {
                nom: "Sow",
                prenom: "Ibrahima",
                nationalite: "Sénégalais",
                classe: "L2 Informatique",
                photo: "../assets/img/ibrahima.jpg",
                programme: "",
                membres: []
            }
        ]
    }
];

// Données Classe
const donneesClasse = [
    {
        poste: "Responsable",
        candidats: [
            { nom: "Kaboré", prenom: "Ali", classe: "3ème ISE", nationalite: "Burkinabè", mots: "Unir pour construire", photo: "../assets/img/ali.jpg" },
            { nom: "Sawadogo", prenom: "Fatou", classe: "2ème ECO", nationalite: "Burkinabè", mots: "Innovation pour tous", photo: "../assets/img/fatou.jpg" },
            { nom: "Diallo", prenom: "Mamadou", classe: "2ème ISE", nationalite: "Sénégalais", mots: "Pour une AES forte", photo: "../assets/img/mamadou.jpg" }
        ]
    },
    {
        poste: "Responsable adjoint",
        candidats: [
            { nom: "Traoré", prenom: "Aminata", classe: "1ère ECO", nationalite: "Mali", mots: "Ensemble vers l'excellence", photo: "../assets/img/aminata.jpg" },
            { nom: "Sow", prenom: "Ibrahima", classe: "3ème ISE", nationalite: "Sénégalais", mots: "Agir pour tous", photo: "../assets/img/ibrahima.jpg" }
        ]
    }
];



// ===============================
// Variables de pagination
// ===============================
let pageAES = 0;
let pageClub = 0;
let pageClasse = 0;

// ===============================
// Gestion du vote (localStorage)
// ===============================
// Structure : vote_aes_0 = "Ali" (clé = type_posteIndex, valeur = nom/prenom)
function getVoteKey(type, index) {
    return `vote_${type}_${index}`;
}
function hasVoted(type, index) {
    return !!localStorage.getItem(getVoteKey(type, index));
}
function setVote(type, index, candidat) {
    localStorage.setItem(getVoteKey(type, index), JSON.stringify(candidat));
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
    const contenu = document.getElementById('contenu-vote');
    const poste = donneesAES[index];
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
        if (index > 0) { pageAES = index - 1; afficherAES(pageAES); }
    });
    contenu.querySelector('.page-next')?.addEventListener('click', () => {
        if (index < donneesAES.length - 1) { pageAES = index + 1; afficherAES(pageAES); }
    });

    // Vote
    if (!dejaVote) {
        contenu.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                setVote('aes', index, poste.candidats[idx]);
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
    const contenu = document.getElementById('contenu-vote');
    const club = donneesClubs[index];
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
        if (index > 0) { pageClub = index - 1; afficherClub(pageClub); }
    });
    contenu.querySelector('.page-next')?.addEventListener('click', () => {
        if (index < donneesClubs.length - 1) { pageClub = index + 1; afficherClub(pageClub); }
    });

    // Vote
    if (!dejaVote) {
        contenu.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                setVote('club', index, club.candidats[idx]);
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
// Affichage des membres d'un club
// ===============================
function afficherMembresClub(indexClub, indexCandidat) {
    const club = donneesClubs[indexClub];
    const candidat = club.candidats[indexCandidat];
    const contenu = document.getElementById('contenu-vote');

    const membresHTML = (candidat.membres || []).map(m => `
        <div class="membre">
            <img src="${m.photo}" alt="${m.prenom} ${m.nom}" class="photo-candidat"
                data-nom="${m.prenom} ${m.nom}"
                data-infos="<strong>Classe :</strong> ${m.classe}<br><strong>Nationalité :</strong> ${m.nationalite}">
            <h4>${m.prenom} ${m.nom}</h4>
            <p><strong>Classe :</strong> ${m.classe}</p>
            <p><strong>Nationalité :</strong> ${m.nationalite}</p>
        </div>
    `).join('');

    contenu.innerHTML = `
        <h2>Club : ${club.nomClub}</h2>
        <h3>Candidat : ${candidat.prenom} ${candidat.nom}</h3>
        <h4>Membres de l’équipe</h4>
        <div class="membres">${membresHTML}</div>
        <button class="btn btn-retour">Retour</button>
    `;

    contenu.querySelector('.btn-retour')?.addEventListener('click', () => {
        afficherClub(indexClub);
    });

    contenu.querySelectorAll('.photo-candidat').forEach(img => {
        img.addEventListener('click', function() {
            afficherPhotoGrand(this.src, this.dataset.nom, this.dataset.infos);
        });
    });
}

// ===============================
// Affichage Classe (par poste)
// ===============================
function afficherClasse(index = pageClasse) {
    const contenu = document.getElementById('contenu-vote');
    const poste = donneesClasse[index];
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
        if (index > 0) { pageClasse = index - 1; afficherClasse(pageClasse); }
    });
    contenu.querySelector('.page-next')?.addEventListener('click', () => {
        if (index < donneesClasse.length - 1) { pageClasse = index + 1; afficherClasse(pageClasse); }
    });

    // Vote
    if (!dejaVote) {
        contenu.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                setVote('classe', index, poste.candidats[idx]);
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
    const selection = this.value;
    if (selection === 'aes') {
        pageAES = 0;
        afficherAES(pageAES);
    } else if (selection === 'club') {
        pageClub = 0;
        afficherClub(pageClub);
    } else if (selection === 'classe') {
        pageClasse = 0;
        afficherClasse(pageClasse);
    } else {
        document.getElementById('contenu-vote').innerHTML = `
            <h2>Élections ${selection.toUpperCase()}</h2>
            <p>Les détails des élections pour ${selection} seront bientôt disponibles.</p>
        `;
    }
});

// ===============================
// Affichage initial à l'ouverture de la page
// ===============================
window.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('type-election');
    if (select.value === 'aes') {
        afficherAES(pageAES);
    } else if (select.value === 'club') {
        afficherClub(pageClub);
    } else if (select.value === 'classe') {
        afficherClasse(pageClasse);
    } else {
        document.getElementById('contenu-vote').innerHTML = `
            <h2>Élections ${select.value.toUpperCase()}</h2>
            <p>Les détails des élections pour ${select.value} seront bientôt disponibles.</p>
        `;
    }
});