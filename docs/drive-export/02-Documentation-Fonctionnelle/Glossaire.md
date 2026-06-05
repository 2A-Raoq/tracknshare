# GLOSSAIRE

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce glossaire regroupe les principaux termes utilisés dans le projet Track'N Share. Il sert à harmoniser le vocabulaire entre les documents fonctionnels, techniques, le cahier des charges, les user stories, les règles métier, les spécifications fonctionnelles et le développement.

Les termes sont classés par catégories :

- vocabulaire général du projet ;

- vocabulaire utilisateur ;

- vocabulaire gaming ;

- statistiques et scoring ;

- équipes et social ;

- saisons et leaderboards ;

- PWA et front-end ;

- back-end et API ;

- base de données ;

- sécurité et confidentialité ;

- gestion de projet.

## 1 Vocabulaire général du projet

Track'N Share

Nom du projet. Plateforme web et mobile permettant aux joueurs de suivre, partager et comparer leurs statistiques de jeux vidéo.

Plateforme

Ensemble de l'application Track'N Share, comprenant le front-end, le back-end, la base de données, l'API, la PWA et les fonctionnalités utilisateur.

Application

Interface utilisée par l'utilisateur pour accéder aux fonctionnalités de Track'N Share.

Web app

Application accessible depuis un navigateur web.

Application mobile web

Application web pensée pour être utilisée sur mobile, sans être une application native installée depuis un store.

MVP

Minimum Viable Product. Version minimale du projet contenant les fonctionnalités essentielles permettant de démontrer l'application.

Fonctionnalité bonus

Fonctionnalité intéressante mais non obligatoire pour le MVP. Elle peut être développée si le temps le permet.

Évolution future

Fonctionnalité avancée prévue pour une version ultérieure du projet.

Mode démo

Mode de fonctionnement permettant de présenter l'application avec des données fictives déjà préparées, sans dépendre d'une API externe.

Données seedées

Données fictives insérées automatiquement dans la base pour remplir l'application, tester les fonctionnalités et préparer la soutenance.

Soutenance

Présentation finale du projet devant un jury ou des évaluateurs.

## 2 Utilisateurs et rôles

Utilisateur

Personne possédant ou non un compte sur Track'N Share.

Visiteur

Personne qui consulte l'application sans être connectée.

Utilisateur connecté

Utilisateur authentifié ayant accès aux fonctionnalités privées de l'application.

Joueur

Utilisateur principal de Track'N Share. Il consulte ses statistiques, son profil, son classement et peut rejoindre une équipe.

Compte utilisateur

Compte créé par un joueur pour accéder aux fonctionnalités privées.

Profil utilisateur

Page regroupant les informations d'un joueur : pseudo, avatar, bio, statistiques, score, rang, équipe et badges éventuels.

Pseudo

Nom public utilisé par un joueur sur la plateforme.

Avatar

Image représentant un utilisateur dans l'application.

Bannière

Image affichée en haut d'un profil utilisateur ou d'une page équipe.

Bio

Courte description personnalisée rédigée par un utilisateur sur son profil.

Rôle

Niveau d'autorisation attribué à un utilisateur ou à un membre d'équipe.

Administrateur

Utilisateur disposant de droits avancés pour gérer la plateforme. Fonctionnalité prévue en évolution future.

Modérateur

Utilisateur chargé de traiter les signalements ou contenus problématiques. Fonctionnalité prévue en bonus ou évolution.

Compte démo

Compte utilisateur préparé pour présenter rapidement l'application avec des données complètes.

## 3 Authentification

Authentification

Processus permettant de vérifier l'identité d'un utilisateur.

Inscription

Action de créer un compte utilisateur.

Connexion

Action permettant à un utilisateur d'accéder à son compte avec ses identifiants.

Déconnexion

Action permettant de fermer une session utilisateur.

Session

Période pendant laquelle un utilisateur est reconnu comme connecté.

Token

Jeton d'authentification permettant d'identifier un utilisateur connecté auprès du serveur.

JWT

JSON Web Token. Format de token souvent utilisé pour authentifier des requêtes API.

Cookie HttpOnly

Cookie inaccessible depuis JavaScript côté navigateur, utilisé pour réduire certains risques de vol de token.

Cookie Secure

Cookie transmis uniquement via HTTPS.

Cookie SameSite

Paramètre de cookie permettant de limiter certains risques d'attaque CSRF.

Mot de passe hashé

Mot de passe transformé par un algorithme de hachage avant stockage, afin de ne jamais conserver le mot de passe en clair.

Argon2

Algorithme moderne de hachage de mot de passe.

bcrypt

Algorithme de hachage de mot de passe couramment utilisé.

Route privée

Page ou endpoint accessible uniquement aux utilisateurs connectés.

Guard

Mécanisme back-end permettant de protéger une route ou une action selon l'identité ou les permissions de l'utilisateur.

## 4 Gaming et comptes de jeu

Jeu

Jeu vidéo suivi par la plateforme Track'N Share.

Compte de jeu

Compte externe lié à une plateforme ou à un jeu, par exemple Steam ou Epic Games.

Plateforme de jeu

Service externe permettant d'accéder à des jeux ou statistiques, comme Steam ou Epic Games.

Steam

Plateforme de distribution de jeux vidéo pouvant fournir certaines données de compte ou de jeu via API.

Epic Games

Plateforme de jeux vidéo pouvant potentiellement être liée au projet selon les APIs disponibles.

API de jeu

Interface permettant de récupérer des données depuis un jeu ou une plateforme de jeu.

API externe

API fournie par un service extérieur au projet Track'N Share.

API mockée

API simulée qui retourne des données fictives. Elle permet de tester ou démontrer l'application sans dépendre d'un service externe réel.

Synchronisation

Action de récupérer ou mettre à jour les statistiques d'un joueur depuis une source externe ou mockée.

Dernière synchronisation

Date et heure de la dernière mise à jour des statistiques.

Identifiant externe

Identifiant du joueur sur une plateforme ou un jeu externe.

Token externe

Jeton d'accès permettant de communiquer avec une API externe. Il doit être protégé.

## 5 Statistiques gaming

Statistiques

Données mesurant les performances d'un joueur ou d'une équipe.

Match

Partie jouée par un joueur.

Partie jouée

Match enregistré dans les statistiques d'un joueur.

Victoire

Partie gagnée par un joueur ou une équipe.

Défaite

Partie perdue par un joueur ou une équipe.

Kill

Élimination réalisée par un joueur dans un jeu.

Death

Mort ou élimination subie par un joueur.

K/D ratio

Ratio kills/deaths. Il mesure le rapport entre les éliminations réalisées et les morts subies.

Winrate

Taux de victoire. Il correspond au pourcentage de parties gagnées.

Score

Valeur calculée à partir des statistiques d'un joueur ou d'une équipe pour permettre un classement.

Score global

Score principal affiché sur le dashboard et utilisé pour le classement.

Score moyen

Moyenne des scores des membres d'une équipe.

Score total

Somme des scores des membres d'une équipe.

Rang

Position d'un joueur ou d'une équipe dans un leaderboard.

Performance

Résultat d'un joueur ou d'une équipe sur un jeu ou une saison.

Progression

Évolution des performances d'un joueur dans le temps.

Statistiques individuelles

Statistiques propres à un joueur.

Statistiques d'équipe

Statistiques calculées à partir des performances des membres d'une équipe.

## 6 Score et calculs

Formule de score

Règle de calcul permettant de transformer plusieurs statistiques en un score unique.

Formule MVP du score

Formule proposée pour le MVP : Score = (K/D ratio x 50) + (Winrate x 40) + (Nombre de parties x 0,5).

Coefficient

Valeur utilisée dans une formule pour donner plus ou moins d'importance à une statistique.

Éligibilité au classement

Condition permettant à un joueur ou une équipe d'apparaître dans un leaderboard.

Minimum de parties

Nombre minimal de parties à jouer pour être classé. Pour le MVP, la règle proposée est 10 parties minimum.

Joueur non éligible

Joueur dont les statistiques existent, mais qui ne respecte pas les conditions pour apparaître dans le classement principal.

Calcul automatique

Calcul réalisé par le système sans intervention manuelle de l'utilisateur.

Recalcul

Nouvelle exécution d'un calcul après modification ou synchronisation des statistiques.

## 7 Leaderboards et classements

Leaderboard

Classement des joueurs ou équipes selon un score ou une statistique.

Leaderboard solo

Classement individuel des joueurs.

Leaderboard d'équipe

Classement collectif des équipes.

Classement global

Classement général sans filtre spécifique ou selon les règles retenues.

Classement par jeu

Leaderboard filtré sur un jeu précis.

Classement par saison

Leaderboard filtré sur une saison précise.

Classement archivé

Leaderboard figé à la fin d'une saison et consultable plus tard.

Top joueur

Joueur classé parmi les meilleures positions du leaderboard.

Meilleur joueur d'équipe

Membre ayant le meilleur score ou la meilleure performance selon la règle définie.

Tri décroissant

Organisation des résultats du plus grand score au plus petit score.

Filtre

Critère permettant de réduire ou modifier les résultats affichés, par exemple par jeu ou saison.

## 8 Saisons et historique

Saison

Période de compétition d'une durée de trois mois permettant de structurer les statistiques et classements.

Saison active

Saison actuellement en cours.

Saison terminée

Saison dont la date de fin est dépassée.

Saison archivée

Saison terminée dont les statistiques et leaderboards sont conservés en historique.

Historique

Ensemble des anciennes données consultables après leur période active.

Archivage

Action de figer et conserver les données d'une saison terminée.

Récapitulatif saisonnier

Résumé des performances d'un joueur ou d'une équipe sur une saison donnée.

Trimestre

Période de trois mois. Dans Track'N Share, une saison correspond à un trimestre.

## 9 Équipes

Équipe

Groupe de joueurs rassemblés sur Track'N Share pour suivre et comparer leurs performances collectives.

Page équipe

Page affichant les informations, membres, statistiques et chat d'une équipe.

Capitaine

Créateur ou responsable principal d'une équipe. Il possède les droits de gestion les plus élevés.

Co-capitaine

Membre ayant des droits de gestion intermédiaires dans une équipe.

Membre

Utilisateur appartenant à une équipe sans droits de gestion avancés.

Invité

Utilisateur invité dans une équipe ou en attente de validation.

Rôle d'équipe

Niveau de permission d'un utilisateur dans une équipe.

Code d'invitation

Code permettant à un utilisateur de rejoindre une équipe.

Invitation d'équipe

Action ou lien permettant à un joueur d'intégrer une équipe.

Équipe publique

Équipe dont certaines informations sont visibles par d'autres utilisateurs.

Équipe privée

Équipe dont les informations sont limitées aux membres ou partiellement masquées.

Tag d'équipe

Abréviation courte représentant une équipe dans les classements ou profils.

Statistiques collectives

Données calculées à partir de plusieurs membres d'une équipe.

Quitter une équipe

Action par laquelle un membre se retire volontairement d'une équipe.

Supprimer une équipe

Action de fermeture d'une équipe, généralement réservée au capitaine.

## 10 Chat et messagerie

Chat d'équipe

Conversation en temps réel réservée aux membres d'une équipe.

Message

Contenu envoyé par un utilisateur dans une conversation.

Message privé

Message envoyé directement entre deux utilisateurs. Fonctionnalité bonus.

Conversation

Ensemble de messages entre utilisateurs ou membres d'une équipe.

Historique de messages

Liste des anciens messages d'une conversation.

Temps réel

Comportement permettant de recevoir une information immédiatement, sans recharger la page.

Socket.io

Bibliothèque permettant la communication en temps réel entre le front-end et le back-end.

Room

Salon de communication Socket.io. Dans Track'N Share, une équipe peut correspondre à une room de chat.

Statut en ligne

Indication permettant de savoir si un utilisateur est actuellement connecté.

Message lu

Message marqué comme consulté par un utilisateur.

Message non lu

Message reçu mais pas encore consulté.

Signalement

Action permettant de signaler un message ou profil problématique.

## 11 Social et communauté

Ami

Utilisateur ajouté à une liste de contacts.

Demande d'ami

Invitation envoyée à un autre utilisateur pour devenir amis sur la plateforme.

Liste d'amis

Liste des utilisateurs avec lesquels un joueur est connecté socialement.

Blocage

Action empêchant un utilisateur d'interagir avec un autre.

Notification

Alerte informant l'utilisateur d'un événement : invitation, message, badge, demande d'ami ou changement de rang.

Notification lue

Notification déjà consultée par l'utilisateur.

Notification non lue

Notification encore non consultée.

Feed social

Flux d'actualités sociales. Fonctionnalité avancée non prioritaire.

## 12 Gamification

Gamification

Ajout de mécaniques de jeu à l'application pour motiver les utilisateurs.

Badge

Récompense visuelle débloquée par un utilisateur après avoir rempli une condition.

Achievement

Succès ou accomplissement débloqué par un utilisateur.

Objectif personnel

But défini par un joueur, par exemple atteindre un certain K/D, winrate ou rang.

Progression d'objectif

Pourcentage ou valeur montrant l'avancement vers un objectif.

Récompense

Élément donné à l'utilisateur pour valoriser son activité ou ses performances.

Série de victoires

Suite de plusieurs victoires consécutives.

MVP d'équipe

Joueur considéré comme le plus performant de son équipe selon une règle définie.

## 13 PWA et front-end

PWA

Progressive Web App. Application web pouvant être installée sur un appareil et offrir une expérience proche d'une application native.

Manifest

Fichier décrivant les informations nécessaires à l'installation d'une PWA : nom, icônes, couleurs, mode d'affichage et URL de démarrage.

Service worker

Script exécuté par le navigateur permettant notamment le cache, le mode offline et certaines fonctionnalités PWA.

Cache

Stockage temporaire de ressources pour accélérer le chargement ou permettre un usage partiel hors ligne.

Offline

État dans lequel l'utilisateur n'a pas de connexion internet.

Page offline

Page affichée lorsqu'une ressource n'est pas accessible sans connexion.

Mode standalone

Mode d'affichage d'une PWA sans barre de navigateur, comme une application installée.

Responsive

Capacité d'une interface à s'adapter à différentes tailles d'écran.

Mobile-first

Approche de conception qui privilégie d'abord l'expérience mobile.

Front-end

Partie visible de l'application utilisée par l'utilisateur.

React

Bibliothèque JavaScript utilisée pour créer des interfaces utilisateur.

TypeScript

Langage basé sur JavaScript ajoutant du typage statique.

Routing

Gestion des routes et pages côté front-end.

Wouter

Bibliothèque légère de routing pour React.

State management

Gestion de l'état de l'application côté front-end.

Valtio

Bibliothèque de state management pouvant être utilisée avec React.

Composant

Élément réutilisable d'interface front-end.

Layout

Structure globale d'une page ou de l'application.

Dashboard

Page principale d'un utilisateur connecté affichant ses informations importantes.

## 14 Back-end et API

Back-end

Partie serveur de l'application gérant les données, règles métier, sécurité et API.

NestJS

Framework Node.js utilisé pour construire le back-end de manière modulaire.

Node.js

Environnement permettant d'exécuter JavaScript côté serveur.

API

Application Programming Interface. Ensemble d'endpoints permettant au front-end de communiquer avec le back-end.

API REST

Style d'API basé sur des ressources accessibles via des méthodes HTTP.

Endpoint

URL d'API permettant d'effectuer une action ou récupérer des données.

Controller

Composant back-end recevant les requêtes API.

Service

Composant back-end contenant la logique métier ou technique.

Module

Bloc fonctionnel dans NestJS regroupant controllers, services et dépendances.

DTO

Data Transfer Object. Objet définissant la structure des données envoyées ou reçues via l'API.

Validation

Vérification des données reçues avant traitement.

Swagger

Outil permettant de documenter et tester une API.

CORS

Cross-Origin Resource Sharing. Mécanisme contrôlant les domaines autorisés à appeler l'API.

Helmet

Middleware ajoutant des headers de sécurité HTTP côté back-end.

Rate limiting

Limitation du nombre de requêtes sur une période donnée pour éviter les abus.

## 15 Base de données et stockage

Base de données

Système de stockage des informations de l'application.

PostgreSQL

Base de données relationnelle recommandée pour gérer les utilisateurs, équipes, statistiques, messages et saisons.

Redis

Base de données en mémoire utile pour le cache, les sessions, les leaderboards rapides et le temps réel.

Redis-JSON

Extension ou usage de Redis permettant de stocker des documents JSON.

Cache applicatif

Stockage temporaire utilisé pour améliorer les performances.

Migration

Script permettant de créer ou modifier la structure de la base de données.

Seeder

Script permettant d'insérer des données initiales ou fictives dans la base.

Modèle de données

Description des entités et relations stockées en base.

Entité

Objet métier stocké en base, comme User, Team, Game ou Message.

Relation

Lien entre deux entités, par exemple un utilisateur appartient à une équipe.

Clé primaire

Identifiant unique d'une ligne ou entité en base relationnelle.

Clé étrangère

Référence vers une autre entité en base relationnelle.

## 16 Sécurité et confidentialité

Sécurité

Ensemble des mécanismes protégeant l'application, les utilisateurs et les données.

Confidentialité

Protection des informations personnelles ou sensibles contre les accès non autorisés.

Donnée personnelle

Information permettant d'identifier directement ou indirectement un utilisateur, comme email, pseudo ou avatar.

Donnée sensible

Information nécessitant une protection renforcée, comme mot de passe, token, message privé ou email.

RGPD

Règlement Général sur la Protection des Données. Cadre européen encadrant l'utilisation des données personnelles.

Chiffrement

Transformation d'une donnée lisible en donnée illisible sans clé de déchiffrement.

AES-GCM

Algorithme de chiffrement symétrique pouvant être utilisé pour protéger des messages ou tokens.

IV

Initialization Vector. Valeur unique utilisée lors du chiffrement pour renforcer la sécurité.

Secret

Valeur confidentielle utilisée par l'application, comme une clé JWT ou clé de chiffrement.

Variable d'environnement

Variable stockée hors du code source contenant une configuration ou un secret.

XSS

Cross-Site Scripting. Faille permettant d'injecter du code malveillant dans une page web.

CSRF

Cross-Site Request Forgery. Attaque consistant à faire exécuter une action non voulue par un utilisateur authentifié.

Bruteforce

Tentative répétée de deviner un mot de passe ou un accès.

Permission

Droit accordé à un utilisateur pour effectuer une action.

Autorisation

Vérification qu'un utilisateur a le droit d'effectuer une action.

Journalisation

Enregistrement d'informations techniques dans des logs.

Logs

Fichiers ou sorties contenant des informations sur le fonctionnement de l'application.

## 17 Gestion de projet

Cahier des charges

Document décrivant le besoin, les objectifs, le périmètre et les contraintes du projet.

Spécifications fonctionnelles

Document décrivant le comportement attendu de l'application côté utilisateur et métier.

Règles métier

Contraintes fonctionnelles que l'application doit respecter.

User story

Description courte d'un besoin utilisateur sous la forme : En tant que..., je veux..., afin de...

Critère d'acceptation

Condition permettant de valider qu'une user story ou fonctionnalité est terminée.

Backlog

Liste des tâches ou user stories à réaliser.

Kanban

Méthode visuelle de gestion des tâches avec colonnes comme Backlog, À faire, En cours, Review et Terminé.

GitHub Project

Outil GitHub permettant d'organiser les issues et tâches sous forme de tableau ou projet.

Issue

Tâche ou ticket de travail dans GitHub.

Sprint

Période de travail durant laquelle certaines tâches sont planifiées.

Epic

Grand domaine fonctionnel regroupant plusieurs user stories.

Priorité P0

Priorité indispensable pour le MVP.

Priorité P1

Priorité importante mais non bloquante pour le MVP.

Priorité P2

Priorité bonus ou évolution future.

Bug

Erreur ou comportement incorrect dans l'application.

Review

Étape de vérification du code, d'une tâche ou d'une fonctionnalité avant validation.

Recette

Phase de test permettant de vérifier que l'application correspond aux attentes.

## 18 Liste alphabétique rapide

A

Achievement : succès débloqué par un utilisateur.

Administrateur : rôle avancé de gestion de la plateforme.

API : interface permettant au front-end et au back-end de communiquer.

API mockée : API simulée retournant des données fictives.

Archivage : conservation des données d'une saison terminée.

Authentification : vérification de l'identité d'un utilisateur.

Avatar : image représentant un utilisateur.

B

Back-end : partie serveur de l'application.

Backlog : liste des tâches ou user stories à réaliser.

Badge : récompense visuelle débloquée par un utilisateur.

Bannière : image affichée en haut d'un profil ou d'une équipe.

Bruteforce : tentative répétée pour deviner un accès.

C

Cache : stockage temporaire de ressources ou données.

Capitaine : responsable principal d'une équipe.

Chat d'équipe : conversation réservée aux membres d'une équipe.

Chiffrement : protection d'une donnée par transformation illisible.

Classement : liste ordonnée de joueurs ou équipes.

Code d'invitation : code permettant de rejoindre une équipe.

Compte démo : compte préparé pour la démonstration.

Critère d'acceptation : condition de validation d'une fonctionnalité.

D

Dashboard : page principale d'un utilisateur connecté.

Death : mort ou élimination subie par un joueur.

Déconnexion : fermeture de session utilisateur.

Donnée personnelle : information liée à un utilisateur.

Donnée seedée : donnée fictive préchargée dans la base.

DTO : objet décrivant les données échangées via API.

E

Endpoint : route d'API.

Équipe : groupe de joueurs.

Epic : grand domaine fonctionnel.

Évolution future : fonctionnalité prévue après le MVP.

F

Feed social : flux d'activité sociale, prévu en évolution.

Filtre : critère permettant de modifier une liste affichée.

Front-end : interface visible par l'utilisateur.

G

Gamification : mécanique de motivation inspirée du jeu.

GitHub Project : outil de suivi de projet.

Glossaire : document définissant les termes importants.

Guard : protection d'une route ou action côté back-end.

H

Hash : transformation irréversible utilisée pour les mots de passe.

Historique : anciennes données consultables.

I

Identifiant externe : identifiant d'un joueur sur une plateforme externe.

Invitation : demande ou code permettant de rejoindre une équipe.

Issue : ticket de travail dans GitHub.

J

Jeu : jeu vidéo suivi par Track'N Share.

Joueur : utilisateur principal de l'application.

JWT : format de token d'authentification.

K

K/D ratio : ratio kills/deaths.

Kanban : tableau de suivi des tâches.

Kill : élimination réalisée par un joueur.

L

Landing page : page d'accueil publique.

Leaderboard : classement des joueurs ou équipes.

Logs : traces techniques de fonctionnement.

M

Match : partie jouée.

Membre : utilisateur appartenant à une équipe.

MVP : version minimale viable du projet.

N

NestJS : framework back-end Node.js.

Notification : alerte envoyée à un utilisateur.

O

Objectif personnel : but défini par un joueur.

Offline : absence de connexion réseau.

P

P0 : priorité indispensable.

P1 : priorité importante.

P2 : priorité bonus ou future.

Partie jouée : match enregistré dans les statistiques.

Permission : droit d'effectuer une action.

Profil : page d'identité et de statistiques d'un joueur.

PWA : Progressive Web App.

R

Rang : position dans un classement.

Rate limiting : limitation du nombre de requêtes.

React : bibliothèque front-end.

Redis : stockage en mémoire utile pour cache et temps réel.

Responsive : interface adaptée à plusieurs tailles d'écran.

RGPD : règlement sur les données personnelles.

Room : salon Socket.io.

S

Saison : période de compétition de trois mois.

Score : valeur calculée pour classer les performances.

Seeder : script d'insertion de données initiales.

Service worker : script navigateur utilisé par la PWA.

Socket.io : bibliothèque de temps réel.

Sprint : période de travail planifiée.

Statistiques : données de performance.

Synchronisation : mise à jour des statistiques.

T

Tag d'équipe : abréviation d'une équipe.

Token : jeton d'authentification ou d'accès.

Track'N Share : nom du projet.

TypeScript : JavaScript typé.

U

Utilisateur : personne utilisant l'application.

User story : besoin utilisateur formulé simplement.

V

Valtio : bibliothèque de gestion d'état.

Validation : vérification des données reçues.

Visiteur : personne non connectée.

W

Web app : application web.

Winrate : taux de victoire.

Wouter : bibliothèque de routing React.

X

XSS : faille d'injection de script dans une page web.

## 19 Conclusion

Ce glossaire doit être utilisé comme référence commune pour tous les documents du projet Track'N Share.

Il permet d'éviter les ambiguïtés de vocabulaire entre la gestion de projet, la documentation fonctionnelle, l'architecture technique et le développement.

Les termes pourront être enrichis au fil de l'avancement du projet, notamment lors de l'ajout de nouvelles fonctionnalités comme le matchmaking, les tournois, la modération avancée ou les notifications push.
