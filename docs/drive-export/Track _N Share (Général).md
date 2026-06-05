systeme matchmaking et infos user et comparaison

systeme de groupes avec des users > stats globales de l’eqp > comparaison d’eqp

leaderboard de l’eqp

points = kd ratio + win/loose sur un ratio de temps (3 mois)

Projet web front, back, bdd

Pour but de partager et comparer les stats de parties W/L et K/D qui donne un système de points, avec un récap tous les 3 mois. Un leaderboard sera dispo pour plusieurs jeux, pour les jeux solo le leaderboard sera en solo, pour les jeux en équipe il y aura des catégories par équipes. Les données des joueurs sont récupérées via l’api du jeu, steam, epic games, etc..  
Les données reçues par l’API seront stockées dans la bdd et sauvegardées avec un historique (tous les 3 mois) pour pouvoir check les stats précédentes et en cas de crash de l’API on aura quand même des données.  
Pour pouvoir accéder à tout ça il faut créer un compte sur le site, et lier ce compte avec les jeux voulus.

Pour créer les équipes il y aura une fonctionnalité pour créer une team avec un id à envoyer à ces amis, ou si vous êtes déjà amis, il vous sera possible de lui envoyer une invitation.  
Un chat de team et mp seront mis en place également

## Pitch Track ‘N Share :

**L'équipe :** Nous sommes deux développeurs, Clément et Ioanes, avec une répartition claire des responsabilités :

- **Chef de projet** : Ioanes

- **Chef front-end** : Clément

- **Chef back-end** : Ioanes

- **Chef mobile** : Clément

**Le concept :** Notre plateforme permet aux joueurs de suivre, partager et comparer leurs performances de jeu à travers un système de points basé sur leurs statistiques (W/L, K/D). L'objectif est de créer une communauté compétitive avec des leaderboards dynamiques et des récapitulatifs trimestriels.

**Les fonctionnalités principales :**

- **Système de points** basé sur les stats de parties (victoires/défaites, kills/deaths)

- **Leaderboards multi-jeux** : classements solo pour les jeux solo, classements par équipes pour les jeux multijoueurs

- **Récapitulatifs trimestriels** avec historique des performances

- **Gestion d'équipes** : création via ID partageable ou invitations entre amis

- **Système social** : chat d'équipe et messagerie privée

- **Connexion de comptes** Steam, Epic Games, etc. pour récupération automatique des données

**Stack technique :**

- **Front-end** : React + TypeScript, Wouter (routing), Valtio (state management)

- **Back-end** : NestJS + TypeScript

- **Real-time** : Socket.io (client & serveur)

- **Base de données** : Redis-JSON

- **APIs externes** : Steam API et autres plateformes de jeux

- **Containerisation** : Docker

**L'innovation :** Nous assurons la résilience des données grâce à un système d'archivage trimestriel, garantissant l'accès aux statistiques même en cas de défaillance des APIs externes.

## Features ?

**Fonctionnalités sociales :**

- **Profils personnalisables** : avatar, bannière, bio, badges débloqués

- **Système d'amis** : ajout, suppression, liste d'amis avec statut en ligne/hors ligne

- **Fil d'actualité** : posts des équipes, achievements, records personnels

- **Réactions et commentaires** sur les performances des amis

**Gamification interne :**

- **Système de badges/achievements** : "Première équipe créée", "10 victoires consécutives", "MVP du mois"

- **Niveaux d'expérience** basés sur l'activité globale sur la plateforme

- **Titres déblocables** à afficher sur le profil

- **Streaks** : jours consécutifs de connexion, parties jouées

**Fonctionnalités d'équipe :**

- **Rôles dans les équipes** : capitaine, co-capitaine, membre

- **Calendrier d'équipe** : planification de sessions de jeu

- **Votes/sondages** dans les équipes (choix du prochain jeu, horaires, etc.)

- **Bibliothèque d'équipe** : partage de replays, screens, stratégies

**Outils communautaires :**

- **Système de défis** : challenges entre équipes ou joueurs

- **Tournois internes** organisés par les utilisateurs

- **Notifications personnalisables** : alertes pour records battus, invitations, messages

- **Recherche et filtres avancés** : trouver des équipes, joueurs par critères

**Statistiques et analyses :**

- **Graphiques de progression** personnalisés (courbes de points, tendances)

- **Comparaisons personnalisées** : face-à-face entre deux joueurs

- **Rapports mensuels/annuels** générés automatiquement

- **Objectifs personnels** : définir et suivre ses propres goals

**Administration :**

- **Système de modération** : signalement de contenu inapproprié

- **Paramètres de confidentialité** : profil public/privé, visibilité des stats

- **Gestion des préférences** : notifications, thème clair/sombre, langue
