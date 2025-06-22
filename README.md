
# 🗳️ E-Vote ENSAE | Application de Gestion Numérique des Élections

Bienvenue dans le dépôt GitHub de notre projet réalisé dans le cadre du **Hackathon 2025** organisé par le **Club Informatique de l’ENSAE**.

![Hackathon ENSAE](https://img.shields.io/badge/Hackathon-ENSAE%202025-blue)  
![Statut](https://img.shields.io/badge/Statut-En%20développement-yellow)  
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

- ⚙️ **Frontend** : a préciser
- 🛠️ **Backend** : a préciser
- 🗃️ **Base de données** : a préciser
- 🔐 **Authentification** : Jeton sécurisé ou OTP (a préciser)
- 📊 **Reporting** : PDF/Excel, graphiques avec Chart.js (a préciser)
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



La partie frontend se trouve dans le dossier `E-election`. Le backend a été ajouté à partir d'un projet **Django** prêt à l'emploi situé dans le dossier `backend/`.

Une application `election` gère désormais les modèles de vote et les vues associées. Elle est connectée au projet Django via les URLs `elections/`.

### Lancer le backend localement

```bash
# Installer les dépendances (dans un environnement virtuel de préférence)
pip install -r requirements.txt

# Démarrer le serveur de développement
python backend/manage.py runserver
```

Le projet suit maintenant l'organisation classique d'un projet Django avec un module `core` contenant une vue d'exemple.
