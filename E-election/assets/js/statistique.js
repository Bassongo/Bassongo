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
// Fonctions utilitaires pour les votes
// ===============================

// Génère la clé de vote pour chaque type et index
function getVoteKey(type, index) {
    return `vote_${type}_${index}`;
}

// Récupère tous les votes pour un type d'élection
function getVotes(type, data) {
    let votes = [];
    for (let i = 0; i < data.length; i++) {
        const vote = localStorage.getItem(getVoteKey(type, i));
        if (vote) votes.push({ posteIndex: i, candidat: JSON.parse(vote) });
    }
    return votes;
}

// Compte les votes pour chaque candidat d'un poste/club/classe
function countVotes(type, data) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        const poste = data[i];
        let candidats = poste.candidats || poste.candidats; // pour AES/Classe ou Club
        let counts = candidats.map(c => ({ ...c, votes: 0 }));
        const vote = localStorage.getItem(getVoteKey(type, i));
        if (vote) {
            const v = JSON.parse(vote);
            const idx = candidats.findIndex(c => c.nom === v.nom && c.prenom === v.prenom);
            if (idx !== -1) counts[idx].votes = 1; // 1 vote par navigateur
        }
        result.push({ poste: poste.poste || poste.nomClub, candidats: counts });
    }
    return result;
}

// Nombre total de votes exprimés pour ce type
function totalVotes(type, data) {
    return getVotes(type, data).length;
}

// ===============================
// Affichage des chiffres clés
// ===============================
function afficherStatsGlobal(type, data) {
    const stats = countVotes(type, data);
    const nbPostes = data.length;
    const nbVotes = totalVotes(type, data);
    // Pourcentage de participation (sur nbPostes)
    const taux = nbPostes === 0 ? 0 : Math.round((nbVotes / nbPostes) * 100);

    document.getElementById('stats-global').innerHTML = `
        <div class="stats-card">
            <div class="stat-value">${nbVotes}</div>
            <div class="stat-label">Nombre de votes exprimés</div>
        </div>
        <div class="stats-card">
            <div class="stat-value">${nbPostes}</div>
            <div class="stat-label">Nombre de postes/clubs</div>
        </div>
        <div class="stats-card">
            <div class="stat-value">${taux}%</div>
            <div class="stat-label">Taux de participation</div>
        </div>
    `;
}

// ===============================
// Affichage du graphique principal (barres ou camembert)
// ===============================
let statsChart = null;
function afficherStatsGraph(type, data) {
    const stats = countVotes(type, data);

    // Pour le graphique, on prend le poste/club/classe le plus voté (ou le premier)
    const poste = stats.find(p => p.candidats.some(c => c.votes > 0)) || stats[0];
    if (!poste) {
        document.getElementById('stats-graph').style.display = "none";
        return;
    }
    document.getElementById('stats-graph').style.display = "flex";

    const labels = poste.candidats.map(c => `${c.prenom} ${c.nom}`);
    const votes = poste.candidats.map(c => c.votes);

    // Détruit l'ancien graphique si besoin
    if (statsChart) statsChart.destroy();

    // Crée un graphique à barres
    const ctx = document.getElementById('statsChart').getContext('2d');
    statsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Votes pour ${poste.poste}`,
                data: votes,
                backgroundColor: [
                    '#2563eb', '#38bdf8', '#fbbf24', '#64748b', '#a3e635', '#f472b6', '#f87171'
                ],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: `Répartition des votes pour "${poste.poste}"` }
            },
            scales: {
                y: { beginAtZero: true, precision: 0, stepSize: 1 }
            }
        }
    });
}

// ===============================
// Affichage du détail par poste/club/classe
// ===============================
function afficherStatsDetail(type, data) {
    const stats = countVotes(type, data);
    document.getElementById('stats-detail').innerHTML = stats.map(poste => `
        <div class="stats-poste">
            <h3>${poste.poste}</h3>
            <div class="stats-candidats">
                ${poste.candidats.map(c => `
                    <div class="stats-candidat">
                        <img src="${c.photo}" alt="${c.prenom} ${c.nom}">
                        <div class="candidat-info">
                            <div class="candidat-nom">${c.prenom} ${c.nom}</div>
                            <div class="candidat-desc">${c.classe ? c.classe : ''} ${c.nationalite ? ' - ' + c.nationalite : ''}</div>
                        </div>
                        <div class="candidat-votes">${c.votes} vote${c.votes > 1 ? 's' : ''}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ===============================
// Gestion du selecteur de type d'élection
// ===============================
function afficherStats(type) {
    let data;
    if (type === 'aes') data = donneesAES;
    else if (type === 'club') data = donneesClubs;
    else if (type === 'classe') data = donneesClasse;
    else return;

    afficherStatsGlobal(type, data);
    afficherStatsGraph(type, data);
    afficherStatsDetail(type, data);
}

document.getElementById('type-stats').addEventListener('change', function () {
    afficherStats(this.value);
});

// ===============================
// Affichage initial à l'ouverture de la page
// ===============================
window.addEventListener('DOMContentLoaded', function() {
    const state = getState();
    const info = document.getElementById('stats-global');
    if (!state.vote.category || !userHasVoted(state.vote.category)) {
        if (info) info.innerHTML = '<p>Vous devez voter pour voir les statistiques.</p>';
        return;
    }
    afficherStats(document.getElementById('type-stats').value);
});