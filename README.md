
# 🗳️ E-Vote ENSAE | Application de Gestion Numérique des Élections

Bienvenue dans le dépôt GitHub de notre projet réalisé dans le cadre du **Hackathon 2025** organisé par le **Club Informatique de l’ENSAE**.

![Hackathon ENSAE](https://img.shields.io/badge/Hackathon-ENSAE%202025-blue)  
![Statut](https://img.shields.io/badge/Statut-D%C3%A9velopp%C3%A9-yellow)  
![Licence](https://img.shields.io/badge/Licence-MIT-green)

---

## 🧠 Contexte du Hackathon

Le Club Informatique de l’ENSAE a lancé son premier Hackathon pour stimuler l'**innovation technologique** dans la gestion académique.  
Notre équipe a choisi de relever le défi du **Thème 3 : Application de gestion numérique des élections**.

---

## 🎯 Objectif du Projet

Créer une **application sécurisée, simple et intuitive** permettant d'organiser des élections électroniques pour l’amicale, les clubs ou les délégués de classe.

---

## ✨ Fonctionnalités principales

✅ Authentification sécurisée des votants (ID ENSAE)  
✅ Interface de vote claire et intuitive  
✅ Calcul automatique des résultats  
✅ Génération de rapports détaillés de participation et de résultats  
✅ 🛡️ Prévention du double vote et respect de l’anonymat

---

## 💻 Technologies utilisées

- ⚙️ **Frontend** : HTML, CSS et JavaScript
- 🛠️ **Backend** : Node.js avec stockage JSON
- 🗃️ **Base de données** : fichiers JSON
- 🔐 **Authentification** : Jeton sécurisé ou OTP (à préciser)
- 📊 **Reporting** : PDF/Excel, graphiques avec Chart.js (à préciser)
- **Autres**

---

## 🧑‍🤝‍🧑 Équipe du Projet

👩‍💻 **Josée Clémence JEAZE NGUEMEZI**  
📚 *Etudiante en deuxième année en Analyse Statistique (AS)*

👨‍💻 **Marc MARE**  
🎨 *Etudiant en deuxième année en Analyse Statistique (AS)*

👨‍💻 **Gandwende Judicaël Oscar KAFANDO**  
📊 *Etudiant en première année d'ingéniorat en statistique économie (ISE)*

---

## 🚀 Déploiement

Vous pouvez tester l'application en ligne via ce lien (⚠️ à ajouter une fois déployé) :  
🔗 [Lien de l'application en ligne](#)

---

## 📂 Structure du projet

- `E-election/` : Interface utilisateur (HTML/JS)
- `page candidature/` : Maquettes et ressources
- `backend/` : Serveur Node.js

### Lancer le backend et le frontend

Le dossier `E-election/` contenant l'interface utilisateur est désormais servi de
puis le serveur Node.js. Pour démarrer l'application complète :

```bash
cd backend
npm start
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000).



## Nouveautés

- Le backend gère désormais l'authentification via un jeton renvoyé lors de la connexion.
- Les pages d'inscription et de connexion communiquent avec l'API et n'utilisent plus `localStorage` pour stocker les utilisateurs.
- Des sessions sont sauvegardées dans `backend/data/sessions.json`.
- Un endpoint `GET /api/users` permet de récupérer la liste des inscrits (sans mots de passe) pour l'administration.

Pour accéder aux endpoints sécurisés (création de candidature, vote...), le jeton doit être envoyé dans l'en-tête `Authorization: Bearer <token>`.

## Tests backend

Une suite de tests automatisés vérifie les principaux endpoints du serveur. Pour les lancer :

```bash
cd backend
npm test
```

Les tests démarrent le serveur en mémoire et s'assurent du bon fonctionnement de l'inscription, de la connexion et de la protection des routes nécessitant une authentification.
