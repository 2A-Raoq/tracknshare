# INSPIRATIONS PRODUIT

Projet Track'N Share

Version : 1.0

Date de vérification : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document rassemble les inspirations produit pertinentes pour Track'N Share.

Il ne s'agit pas de copier des plateformes existantes, mais d'identifier des idées intéressantes en matière d'expérience utilisateur, de statistiques, de profils joueurs, de classements, de progression, d'équipes, de communautés et de démonstration produit.

Ces inspirations doivent aider l'équipe à concevoir une application claire, utile et crédible, tout en gardant une identité propre à Track'N Share.

## 1 Positionnement produit de Track'N Share

Track'N Share est une plateforme web permettant à des joueurs de suivre, comparer et partager leurs statistiques de jeu.

L'application vise à proposer :

- un profil joueur clair ;

- un dashboard de statistiques ;

- un score synthétique ;

- des leaderboards ;

- des équipes ;

- un chat d'équipe ;

- une expérience communautaire ;

- un mode démo fiable pour la soutenance ;

- des intégrations Steam/Epic futures ou optionnelles.

Pour le MVP, Track'N Share doit rester simple : dashboard lisible, stats compréhensibles, score clair, leaderboard visible, équipe accessible, chat fonctionnel et données de démonstration cohérentes.

## 2 Règles d'inspiration

Les produits listés dans ce document servent d'inspiration fonctionnelle et UX.

Il ne faut pas recopier :

- interface exacte ;

- branding ;

- wording propriétaire ;

- icônes spécifiques ;

- systèmes de notation propriétaires ;

- design graphique reconnaissable.

Chaque idée doit être adaptée à :

- une équipe de deux développeurs ;

- un MVP étudiant ;

- une stack React/NestJS ;

- des données mockées au départ ;

- un objectif de soutenance ;

- une documentation déjà structurée.

## 3 Inspirations liées aux statistiques gaming

### 3.1 Tracker Network / tracker.gg

Lien : https://tracker.gg/

Pourquoi c'est pertinent :

Tracker Network est une référence connue pour le suivi de statistiques de joueurs sur plusieurs jeux.

Idées intéressantes :

- profils joueurs centrés sur les statistiques ;

- comparaison entre joueurs ;

- dashboards par jeu ;

- historique de performance ;

- chiffres clés visibles rapidement ;

- classements ;

- approche multi-jeux.

À reprendre pour Track'N Share :

- présenter les stats principales en cartes ;

- proposer une vue par jeu ;

- afficher un score ou un rang ;

- rendre les profils faciles à partager ;

- garder une hiérarchie visuelle claire.

À éviter :

- surcharger l'interface ;

- multiplier trop de métriques dès le MVP ;

- dépendre d'un grand volume de données réelles ;

- créer une navigation trop complexe.

Application MVP :

Track'N Share peut reprendre l'idée d'un dashboard joueur multi-cartes : score, K/D, winrate, matchesPlayed, dernière synchronisation et rang.

### 3.2 OP.GG

Lien : https://www.op.gg/

Pourquoi c'est pertinent :

OP.GG est une plateforme de consultation de profils, statistiques, matchs et classements principalement connue autour de League of Legends.

Idées intéressantes :

- recherche rapide d'un joueur ;

- profil public très lisible ;

- historique de matchs ;

- scores synthétiques ;

- statistiques contextualisées ;

- classements.

À reprendre pour Track'N Share :

- recherche de joueur ou profil ;

- profil public simplifié ;

- affichage clair du rang ;

- distinction entre résumé global et détail ;

- badges ou indicateurs pour rendre les performances lisibles.

À éviter :

- reproduire une interface trop spécifique à League of Legends ;

- ajouter des métriques trop avancées sans données fiables ;

- rendre le profil trop dense pour le MVP.

Application MVP :

Un profil Track'N Share peut contenir un résumé simple : pseudo, avatar, jeu principal, score, winrate, K/D, équipe et rang leaderboard.

### 3.3 Leetify

Lien : https://leetify.com/

Pourquoi c'est pertinent :

Leetify est intéressant pour l'analyse détaillée de performance, notamment autour de Counter-Strike.

Idées intéressantes :

- score de performance synthétique ;

- détails par axes de progression ;

- analyse après match ;

- visualisation de forces et faiblesses ;

- indicateurs compréhensibles pour progresser.

À reprendre pour Track'N Share :

- un score global Track'N Share ;

- quelques indicateurs de progression ;

- une explication simple de la formule de score ;

- une vue forces / points à améliorer en évolution future ;

- des badges de performance.

À éviter :

- créer un algorithme trop complexe dès le MVP ;

- prétendre analyser finement des matchs sans données réelles ;

- multiplier les sous-scores avant d'avoir un modèle stable.

Application MVP :

Track'N Share peut proposer un score simple calculé à partir de K/D, winrate, nombre de matchs et participation, puis expliquer que la formule sera améliorée plus tard.

## 4 Inspirations liées aux classements et compétitions

### 4.1 FACEIT

Lien : https://www.faceit.com/

Lien corporate : https://corporate.faceit.com/

Documentation développeur : https://docs.faceit.com/docs

Pourquoi c'est pertinent :

FACEIT est une plateforme orientée compétition, matchmaking, communautés, équipes, tournois et classements.

Idées intéressantes :

- progression compétitive ;

- niveau ou rating ;

- équipes ;

- classements saisonniers ;

- sentiment de compétition ;

- statuts et progression.

À reprendre pour Track'N Share :

- leaderboard lisible ;

- mise en avant du rang ;

- pages équipes ;

- notion de saison ;

- progression visible ;

- statut de membre/capitaine.

À éviter :

- reproduire un système compétitif complet ;

- intégrer matchmaking ou tournois dès le MVP ;

- complexifier avec anti-cheat, ligues, points avancés.

Application MVP :

Track'N Share peut s'inspirer du côté compétitif de FACEIT pour afficher un leaderboard simple avec rang, pseudo, score, équipe et jeu.

### 4.2 Steam Community / Steam Profiles

Lien : https://steamcommunity.com/

Pourquoi c'est pertinent :

Steam propose des profils joueurs, avatars, badges, jeux possédés, activité et présence communautaire.

Idées intéressantes :

- identité joueur ;

- profil public ;

- avatar ;

- badges ;

- liste de jeux ;

- activité récente ;

- liaison avec une plateforme de jeu.

À reprendre pour Track'N Share :

- profil joueur personnalisable ;

- avatar ;

- pseudo public ;

- compte externe lié en évolution future ;

- affichage des jeux suivis ;

- badges de progression.

À éviter :

- dépendre directement de Steam pour le MVP ;

- afficher des données privées sans consentement ;

- supposer que tous les profils Steam sont publics.

## 5 Inspirations liées aux communautés et équipes

### 5.1 Discord

Lien : https://discord.com/

Pourquoi c'est pertinent :

Discord est une référence pour la communication communautaire, les groupes, les salons et le chat.

Idées intéressantes :

- chat simple ;

- espaces privés ;

- membres en ligne ;

- rôles ;

- notifications ;

- communautés autour d'un sujet.

À reprendre pour Track'N Share :

- chat d'équipe simple ;

- messages en temps réel ;

- rôles membre/capitaine ;

- état vide du chat ;

- affichage clair des membres.

À éviter :

- refaire Discord ;

- créer des salons multiples dès le MVP ;

- ajouter vocal, modération avancée ou bots ;

- complexifier l'interface chat.

Application MVP :

Track'N Share doit proposer un chat d'équipe minimal mais propre : historique, envoi de message, auteur, date, temps réel et permissions.

### 5.2 Guilded

Lien : https://www.guilded.gg/

Pourquoi c'est pertinent :

Guilded est orienté communautés gaming, équipes, calendriers et organisation.

Idées intéressantes :

- structure d'équipe ;

- rôles ;

- communautés gaming ;

- organisation d'événements ;

- espaces dédiés à un groupe.

À reprendre en évolution :

- page équipe enrichie ;

- calendrier d'entraînement ;

- rôles avancés ;

- objectifs d'équipe ;

- planning de matchs.

À éviter pour le MVP :

- trop de modules communautaires ;

- calendrier complexe ;

- gestion de permissions très détaillée.

## 6 Inspirations liées aux dashboards et progression

### 6.1 Strava

Lien : https://www.strava.com/

Pourquoi c'est pertinent :

Même si Strava n'est pas gaming, c'est une bonne inspiration pour la progression personnelle, les statistiques, les activités, les segments et la comparaison sociale.

Idées intéressantes :

- progression personnelle ;

- résumé d'activité ;

- comparaison avec soi-même ;

- objectifs ;

- badges ;

- dimension communautaire.

À reprendre pour Track'N Share :

- progression dans le temps ;

- historique de stats ;

- objectifs personnels ;

- badges de régularité ;

- partage de performances.

À éviter pour le MVP :

- analytics avancées ;

- carte/activité géographique ;

- flux social complet.

Application future :

Track'N Share pourrait proposer un historique de progression par saison ou par mois.

### 6.2 GitHub Profile / Achievements

Lien : https://github.com/

Pourquoi c'est pertinent :

GitHub inspire par ses profils, badges, contributions, historiques et indicateurs d'activité.

Idées intéressantes :

- profil personnel ;

- badges ;

- activité récente ;

- historique ;

- contribution visible ;

- identité communautaire.

À reprendre pour Track'N Share :

- badges joueur ;

- cartes de progression ;

- historique des saisons ;

- contribution à une équipe ;

- statistiques mises en avant.

À éviter :

- interface trop développeur ;

- métriques trop abstraites pour un joueur.

### 6.3 Letterboxd

Lien : https://letterboxd.com/

Pourquoi c'est pertinent :

Letterboxd montre bien comment un profil public peut mélanger goûts, activité, listes, badges et communauté.

Idées intéressantes :

- profil public simple ;

- activité récente ;

- listes ;

- followers ;

- badges / favoris ;

- partage social.

À reprendre en version Track'N Share :

- profil joueur partageable ;

- statistiques favorites ;

- jeux suivis ;

- badges ;

- activité récente.

À éviter pour le MVP :

- réseau social complet ;

- commentaires publics ;

- système d'abonnement complexe.

## 7 Inspirations UX pour le dashboard Track'N Share

Le dashboard Track'N Share peut s'inspirer des plateformes de stats en affichant :

- carte profil ;

- score global ;

- rang leaderboard ;

- stats principales ;

- jeu sélectionné ;

- dernière synchronisation ;

- bouton de synchronisation ;

- résumé équipe ;

- accès rapide au chat ;

- état du mode démo si applicable.

Cartes MVP recommandées :

- Score Track'N Share ;

- K/D ;

- Winrate ;

- Matches played ;

- Rang solo ;

- Équipe actuelle ;

- Dernière synchronisation.

États UX indispensables :

- loading ;

- success ;

- empty ;

- error ;

- unauthorized ;

- demo mode ;

- provider unavailable.

## 8 Inspirations UX pour les leaderboards

Un leaderboard clair doit afficher :

- rang ;

- pseudo ;

- avatar ;

- équipe ;

- jeu ;

- score ;

- winrate ;

- matches played ;

- statut éligible/non éligible si nécessaire.

Pour Track'N Share, il faut garder :

- tri décroissant par score ;

- pagination ;

- filtre par jeu ;

- filtre par saison ;

- ligne utilisateur mise en évidence en évolution ;

- état vide clair.

À éviter :

- trop de colonnes ;

- acronymes non expliqués ;

- scores incompréhensibles ;

- absence d'explication de la formule ;

- classement lent ou non paginé.

## 9 Inspirations UX pour les équipes

La page équipe peut contenir :

- nom de l'équipe ;

- tag ;

- avatar ou bannière ;

- capitaine ;

- membres ;

- score moyen ;

- rang équipe si prévu ;

- code invitation ;

- chat ;

- actions selon rôle.

Rôles MVP :

- CAPTAIN ;

- MEMBER.

Rôles futurs :

- CO_CAPTAIN ;

- MODERATOR ;

- ANALYST.

À éviter :

- permissions trop complexes ;

- interface d'administration trop lourde ;

- fonctionnalités tournoi avant MVP ;

- équipes multi-jeux trop avancées trop tôt.

## 10 Inspirations UX pour le chat

Chat MVP :

- historique ;

- auteur ;

- date ;

- message ;

- envoi temps réel ;

- refus non-membre ;

- validation message vide ;

- scroll simple.

Fonctions futures :

- typing indicator ;

- présence en ligne ;

- réactions ;

- mentions ;

- modération ;

- édition/suppression de message ;

- salons multiples.

À éviter pour le MVP :

- pièces jointes ;

- images ;

- vocal ;

- rôles complexes ;

- historique infini non paginé ;

- notifications avancées.

## 11 Inspirations UX pour le mode démo

Le mode démo doit être une vraie partie du produit, pas seulement un bricolage technique.

Il doit permettre de montrer :

- dashboard rempli ;

- stats crédibles ;

- leaderboard vivant ;

- équipe active ;

- chat avec messages ;

- parcours complet sans API externe.

Données de démo recommandées :

- 8 à 20 joueurs fictifs ;

- 2 à 4 équipes ;

- plusieurs jeux ;

- une saison active ;

- scores variés ;

- messages de chat ;

- stats cohérentes ;

- compte démo central.

## 12 Inspirations visuelles

Track'N Share peut adopter une esthétique :

- moderne ;

- gaming sobre ;

- lisible ;

- dashboard-first ;

- contrastée ;

- responsive ;

- orientée données.

À envisager :

- cards statistiques ;

- badges ;

- rangs ;

- avatars ;

- tags d'équipe ;

- graphiques simples ;

- couleurs par performance ;

- icônes de jeu ;

- skeleton loading.

À éviter :

- interface trop flashy ;

- animations excessives ;

- trop de couleurs ;

- tableaux illisibles ;

- textes trop petits ;

- dépendance forte à des assets non disponibles.

## 13 Fonctionnalités inspirantes à classer par priorité

### 13.1 P0 — MVP

- inscription / connexion ;

- profil simple ;

- dashboard stats ;

- score global ;

- leaderboard solo ;

- équipe ;

- code invitation ;

- chat d'équipe ;

- mode démo ;

- Swagger pour API ;

- permissions basiques.

### 13.2 P1 — Amélioration utile

- profil public partageable ;

- historique de stats ;

- filtres leaderboard ;

- badges ;

- leaderboards par saison ;

- notifications ;

- PWA installable ;

- rang utilisateur mis en évidence ;

- indicateurs de progression.

### 13.3 P2 — Évolution future

- intégration Steam réelle ;

- intégration Epic/EOS réelle ;

- tournois ;

- matchmaking ;

- équipes multi-rosters ;

- analytics avancées ;

- recommandations personnalisées ;

- feed social ;

- achievements avancés ;

- API publique.

## 14 Benchmark synthétique

| Produit | Ce qui inspire Track'N Share | À reprendre | À éviter |

|---|---|---|---|

| Tracker Network | stats gaming multi-jeux | cartes stats, profils, classements | surcharge de données |

| OP.GG | profils, matchs, leaderboards | profil lisible, recherche joueur | design trop spécifique LoL |

| Leetify | analyse performance | score, axes de progression | analyse trop complexe MVP |

| FACEIT | compétition, équipes, rangs | leaderboard, équipes, saison | matchmaking/tournoi complet |

| Steam | identité joueur | profil, avatar, liaison future | dépendance Steam MVP |

| Discord | chat et communauté | chat équipe, rôles simples | refaire Discord |

| Guilded | communautés gaming | organisation équipe future | trop de modules |

| Strava | progression personnelle | historique, objectifs | réseau social complet |

| GitHub | profil et badges | badges, activité | interface trop développeur |

| Letterboxd | profil partageable | profil public, activité | social complet |

## 15 Proposition d'identité produit Track'N Share

Promesse produit :

Track'N Share aide les joueurs à suivre leurs performances, comparer leurs statistiques et partager leur progression avec leur équipe.

Phrase courte possible :

"Suivez vos stats, progressez avec votre équipe, partagez vos performances."

Axes produit :

- Performance : statistiques et score ;

- Compétition : leaderboards ;

- Équipe : groupe et chat ;

- Progression : historique et saisons ;

- Partage : profil public futur ;

- Fiabilité : mode démo et données maîtrisées.

## 16 Recommandations concrètes pour le MVP

### 16.1 Page d'accueil

Contenu recommandé :

- nom Track'N Share ;

- phrase de valeur ;

- bouton connexion ;

- bouton inscription ;

- aperçu des fonctionnalités ;

- mention stats / leaderboards / équipes.

### 16.2 Dashboard

Contenu recommandé :

- score global ;

- K/D ;

- winrate ;

- matchesPlayed ;

- rang ;

- dernière sync ;

- bouton sync mock ;

- équipe actuelle.

### 16.3 Leaderboard

Contenu recommandé :

- rang ;

- joueur ;

- équipe ;

- jeu ;

- score ;

- winrate ;

- pagination.

### 16.4 Équipe

Contenu recommandé :

- nom équipe ;

- membres ;

- rôles ;

- code invitation ;

- chat.

### 16.5 Chat

Contenu recommandé :

- historique ;

- envoi message ;

- réception temps réel ;

- refus non-membre.

## 17 Points différenciants possibles

Track'N Share peut se différencier par :

- une approche multi-jeux mais simple ;

- un score unique facile à comprendre ;

- un lien fort entre stats et équipe ;

- un mode démo intégré ;

- une documentation projet très complète ;

- une architecture ouverte aux providers externes ;

- une expérience PWA légère.

## 18 Risques produit

### 18.1 Risque : produit trop large

Problème : vouloir faire stats, réseau social, équipes, chat, tournois et APIs externes en même temps.

Solution : limiter le MVP à dashboard, leaderboard, équipe, chat et mock data.

### 18.2 Risque : stats incompréhensibles

Problème : trop de métriques ou score opaque.

Solution : peu de stats mais bien expliquées.

### 18.3 Risque : dépendance API externe

Problème : Steam/Epic indisponibles ou limités.

Solution : MockProvider et intégrations futures documentées.

### 18.4 Risque : interface trop dense

Problème : dashboard illisible.

Solution : cards simples, titres clairs, hiérarchie visuelle.

### 18.5 Risque : chat non sécurisé

Problème : non-membres peuvent lire ou écrire.

Solution : TeamMemberGuard et validation Socket.io.

## 19 Critères d'acceptation produit MVP

Le MVP est cohérent avec les inspirations produit si :

- le dashboard donne une vision claire des performances ;

- le score est visible et compréhensible ;

- le leaderboard permet de comparer les joueurs ;

- l'équipe a une vraie page dédiée ;

- le chat fonctionne en temps réel ;

- les données démo sont crédibles ;

- l'interface reste sobre et lisible ;

- le projet ne dépend pas de Steam/Epic pour la soutenance ;

- les évolutions futures sont clairement identifiées.

## 20 Conclusion

Les inspirations produit montrent que Track'N Share doit se concentrer sur trois piliers : statistiques, compétition et équipe.

Les plateformes comme Tracker Network, OP.GG, Leetify ou FACEIT montrent l'intérêt des profils joueurs, dashboards, scores et classements. Discord et Guilded inspirent la partie communautaire et chat. Des produits comme Strava, GitHub ou Letterboxd montrent comment valoriser la progression, le profil public et le partage.

Pour le MVP, la meilleure approche est de rester simple : un dashboard propre, un leaderboard clair, une équipe avec chat, un score compréhensible et un mode démo fiable.

Les inspirations doivent guider les choix UX et produit, sans pousser l'équipe à développer trop de fonctionnalités avant que le socle principal soit stable.
