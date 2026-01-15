# SpotiMate
---

**Spotimate** est une application web qui comble le fossé entre le streaming musical et les réseaux sociaux. Alors que la musique est intrinsèquement sociale, l'expérience de streaming est souvent solitaire.

---

## Fonctionnalités principales

- Authentification sécurisée via Spotify OAuth 2.0
- Analyse des goûts musicaux et création de profils utilisateurs
- Matching intelligent basé sur la similarité des playlists et morceaux préférés
- Messagerie instantanée en temps réel entre utilisateurs compatibles
- Interface utilisateur fluide et responsive avec React
- Possibilité de publier des posts sur un fil d'actualité

---

## Technologies utilisées

| Partie           | Technologies                          |
|------------------|------------------------------------|
| Frontend (client)| React, React Router, Axios          |
| Backend (serveur)| Node.js, Express, Scoket.io, Spotify Web API  |
| Authentification | OAuth 2.0 via Spotify               |
| Base de données   | MongoDB      |

---

## Côté administratif

- **Équipe de développement :** Trois membres : Mathis Lefebvre, Thibault Lannuzel et Corentin Lucas
  - Chaque developpeur s'occupe d'une fonctionalité, du back au front, ce qui permet un grand controle et une responsabilité partagé.
- **Gestion des branches Git :** Branche principale `main`, branche d’intégration `developp`, branches features pour chaque fonctionnalité
- **Phases de développement :**  
  - Mise en place de l’authentification Spotify ✔
  - Configuration page Profil ✔
  - Développement page Explorer ✔
  - Développement du système de matching ✔
  - Implémentation du chat en temps réel ✔
  - Implémentation de la création de post et la gestion du feed ✔
  - Tests et déploiement (à chaque changement)
  - Développement du frontend (en parallèle) ✔
- **Réunions :** Hebdomadaires, tous les lundis à 18h00 pour discuter de l'avancement du projet.
- **Code review :** Pull requests obligatoires avant fusion dans `developp` puis `main`

---

## Démonstration de l'application



---

## Bugs connus 
- Mauvaise gestion du cache, parfois il n'est pas vidé après déconnexion.
- Messagerie "preque" instantanée, la gestion des sockets est à améliorer.
- On peut modifier le profile des autres.

---

## Amélioration possibles 
- Commentaire sous les postes.
- Partage de musique avec player intégré.
- Messagerie plus réactive.

---

### License
[Polytech Angers](LICENSE) © Spotimate Team

---

### Contact
Pour toute question : spotimate@proton.me