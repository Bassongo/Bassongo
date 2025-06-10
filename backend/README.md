# Backend Node.js

Ce dossier contient l'implémentation minimale d'un serveur Node.js pour l'application E-Vote ENSAE.

## Fonctionnement

Le serveur utilise uniquement les modules natifs de Node.js (pas de dépendances externes).
Les données sont stockées au format JSON dans le dossier `data/`.

### Lancer le serveur

```bash
node server.js
```

Le serveur écoute par défaut sur le port `3000`.

## Endpoints principaux

- `POST /api/register` : création d'un utilisateur `{email, password}`
- `POST /api/login` : connexion d'un utilisateur `{email, password}`
- `POST /api/elections` : création d'une élection `{name}`
- `GET /api/elections` : liste des élections
- `POST /api/candidates` : ajout d'un candidat à une élection `{electionId, name}`
- `GET /api/candidates?electionId=ID` : liste des candidats
- `POST /api/vote` : enregistrer un vote `{userId, electionId, candidateId}`
- `GET /api/results?electionId=ID` : résultat d'une élection

## Schéma de données

Les fichiers JSON contiennent des tableaux d'objets simples :

- `users.json` : `{id, email, passwordHash}`
- `elections.json` : `{id, name}`
- `candidates.json` : `{id, electionId, name}`
- `votes.json` : `{id, userId, electionId, candidateId}`
