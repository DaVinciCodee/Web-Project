Documentation Projet Spotimate

Sommaire :
- Introduction
- Organisation
- Côté FrontEnd (Client)
  - Pages
  - Composants
- Côté Backend (Server)
  - Routes
  - Models
  - Controllers
  - Services
  - Server.js
  
Introduction :

Spotimate est un projet qui a pour but de rassembler autour de la musique.
Une sorte de Twitter, dédié à la musique, où l'on peut rencontrer des personnes aux goûts musicaux proches.

Organisation :

Le code est divisé en deux parties : le côté client (frontend), et le côté server (backend).

Côté FrontEnd :

Le frontend est développé avec le framework React, chaque page est un fichier, et chaque composant important de la page en est un autre.
Un fichier 'variables.css' contient les variables globales du site.

Les pages :

On trouve les pages suivantes :
    - Login
    - Explore
    - Profile
    - Feed
  
La page Login :

Permet à l'utilisateur de lier son compte Spotify au site, autorisant l'utilisation de ses données.

La page Explore :

Permet de rechercher des profils, des artistes, des albums ou encore des morceaux,

La page Profile :

Affiche le profil de l'utilisateur, ses artistes les plus écoutés, et notamment les personnes avec qui il matche le plus.

La page Feed : 

Affiche les posts des utilisateurs du site, le fil d'actualité du site.

