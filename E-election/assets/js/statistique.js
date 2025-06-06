// ===============================
// Données des élections 
// ===============================


// Données dynamiques depuis les candidatures enregistrées
let donneesAES = [];
let donneesClubs = [];
let donneesClasse = [];

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
    loadCandidates();
    afficherStats(document.getElementById('type-stats').value);
});