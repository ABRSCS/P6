Portfolio Architecte Sophie Bluel

Ce projet est un portfolio web interactif pour l’architecte d’intérieur Sophie Bluel. Il permet de présenter ses réalisations, d’ajouter de nouveaux projets via une interface d’administration, et inclut une authentification sécurisée pour la gestion des contenus.
Sommaire

    Fonctionnalités

    Prérequis

    Installation

    Utilisation

    Structure du projet

    Astuces et recommandations

    Crédits

Fonctionnalités

    Affichage dynamique des projets via une galerie filtrable par catégories.

    Mode édition (après connexion) permettant d’ajouter, modifier ou supprimer des projets.

    Authentification sécurisée avec gestion des erreurs.

    Ajout de projet avec formulaire et upload d’image (jpg/png, 4Mo max).

    Responsive design pour une expérience optimale sur tous supports.

Prérequis

    Node.js (v14 ou supérieur)

    npm (généralement installé avec Node.js)

    Un navigateur web moderne (Chrome, Firefox, Edge...)

Installation
1. Cloner le projet

bash
git clone https://github.com/votre-utilisateur/portfolio-architecte-sophie-bluel.git
cd portfolio-architecte-sophie-bluel

2. Installer les dépendances du backend

bash
cd Backend
npm install

3. Lancer le backend

bash
npm start

Le backend démarre par défaut sur http://localhost:5678.
4. Lancer le frontend

Ouvre un nouveau terminal et lance une extension serveur local (comme Live Server sur VSCode) dans le dossier FrontEnd ou à la racine du projet.

    Recommandé : Ouvre le frontend dans une nouvelle fenêtre VSCode pour éviter les conflits avec le backend.

Utilisation

    Accède à http://localhost:5500/FrontEnd/index.html (ou l’adresse fournie par ton serveur local).

    Navigue sur le portfolio.

    Clique sur « Login » pour accéder à l’espace d’administration (identifiants fournis dans le brief ou le backend).

    Ajoute, modifie ou supprime des projets via la modale d’administration.

Structure du projet

text
.
├── Backend
│   ├── ... (fichiers backend)
├── FrontEnd
│   ├── assets
│   │   ├── JS
│   │   │   ├── api.js
│   │   │   ├── app.js
│   │   │   ├── auth.js
│   │   │   ├── contact.js
│   │   │   ├── login.js
│   │   │   ├── modal.js
│   │   │   └── works.js
│   │   ├── icons
│   │   │   └── instagram.png
│   │   ├── images
│   │   └── style.css
│   ├── index.html
│   └── login.html
├── .gitignore
└── README.md

Astuces et recommandations

    Backend et frontend doivent être lancés dans deux instances différentes de VSCode pour éviter les conflits.

    Vérifie les ports utilisés par le backend et le frontend (par défaut : 5678 pour le backend, 5500 pour le frontend avec Live Server).

    Identifiants de connexion : consulte le brief ou la documentation du backend pour obtenir les identifiants valides.

    Problèmes courants : Si les images ne s’affichent pas ou si le login échoue, vérifie que le backend est bien lancé et accessible.

Crédits

Projet réalisé dans le cadre de la formation OpenClassrooms - Parcours Développeur Web.
