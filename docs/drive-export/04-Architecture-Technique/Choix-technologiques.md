# CHOIX TECHNOLOGIQUES

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document présente les choix technologiques retenus pour le projet Track'N Share. Il explique pourquoi chaque technologie est utilisée, quels besoins elle couvre, quelles alternatives ont été envisagées et quels sont les points de vigilance.

Track'N Share est une plateforme web/mobile sous forme de Progressive Web App permettant aux joueurs de suivre, partager et comparer leurs statistiques gaming. Le projet nécessite une stack moderne, maintenable et suffisamment robuste pour gérer l'authentification, les profils, les statistiques, les leaderboards, les équipes, les saisons, le chat temps réel, la sécurité et la démonstration.

## 1 Synthèse des choix technologiques

Choix principaux retenus :

- Front-end : React + TypeScript.

- Routing front-end : Wouter.

- State management : Valtio.

- Back-end : NestJS + TypeScript.

- API : REST.

- Temps réel : Socket.io.

- Base de données principale recommandée : PostgreSQL.

- Cache / sessions / leaderboards rapides : Redis.

- Alternative ou contrainte possible : Redis-JSON.

- PWA : manifest + service worker.

- Documentation API : Swagger.

- Sécurité : bcrypt ou Argon2, guards NestJS, validation DTO, Helmet, CORS, rate limiting.

- DevOps : Docker + Docker Compose.

- Suivi projet : GitHub + GitHub Project.

- Qualité code : ESLint + Prettier.

- Tests : Jest côté back-end, Vitest ou React Testing Library côté front si le temps le permet.

## 2 Critères de choix

Les technologies ont été choisies selon plusieurs critères :

- compatibilité avec une application web/mobile ;

- facilité de prise en main ;

- pertinence pour un MVP ;

- maintenabilité ;

- cohérence entre front-end et back-end ;

- capacité à gérer le temps réel ;

- capacité à gérer les données relationnelles ;

- sécurité ;

- facilité de démonstration ;

- possibilité d'évolution future.

Le projet doit rester réaliste. Les choix techniques doivent donc éviter une complexité inutile tout en montrant de vraies compétences professionnelles.

## 3 Choix front-end

### 3.1 React

Technologie retenue : React.

Rôle dans le projet :

React sera utilisé pour développer l'interface utilisateur de Track'N Share : landing page, authentification, dashboard, profil, statistiques, leaderboards, équipes, chat, saisons et paramètres.

Pourquoi ce choix :

- React est très adapté aux interfaces dynamiques.

- Le projet contient beaucoup de composants réutilisables : cartes de statistiques, tableaux de classement, formulaires, messages de chat, cards d'équipe.

- React permet de construire une application moderne et évolutive.

- React fonctionne très bien avec TypeScript.

- React est compatible avec une approche PWA.

Alternatives envisagées :

- Vue.js : simple et agréable, mais moins cohérent avec les choix TypeScript/NestJS déjà envisagés.

- Angular : très complet, mais plus lourd pour un MVP à deux développeurs.

- Svelte : performant et moderne, mais moins standard dans certains contextes d'équipe.

Décision :

React est retenu car il offre un bon équilibre entre simplicité, puissance, écosystème et maintenabilité.

Points de vigilance :

- éviter de créer des composants trop volumineux ;

- organiser le code par features ;

- gérer les états loading, erreur et vide ;

- tester régulièrement le rendu mobile.

### 3.2 TypeScript côté front-end

Technologie retenue : TypeScript.

Rôle dans le projet :

TypeScript permet de typer les données manipulées par l'interface : utilisateurs, profils, jeux, statistiques, scores, équipes, messages, saisons et notifications.

Pourquoi ce choix :

- réduit les erreurs de manipulation de données ;

- améliore l'autocomplétion ;

- rend le code plus lisible ;

- facilite la collaboration ;

- cohérent avec NestJS côté back-end.

Alternatives envisagées :

- JavaScript simple : plus rapide au début, mais moins sûr sur un projet avec beaucoup de modèles de données.

Décision :

TypeScript est retenu pour assurer une meilleure qualité et cohérence du code.

Points de vigilance :

- définir des types clairs dès le départ ;

- éviter les types any ;

- partager autant que possible les structures entre front et back, ou au moins les documenter.

### 3.3 Wouter pour le routing

Technologie retenue : Wouter.

Rôle dans le projet :

Wouter permet de gérer les routes côté front-end : landing page, connexion, inscription, dashboard, profils, équipes, chat et saisons.

Pourquoi ce choix :

- très léger ;

- simple à utiliser ;

- suffisant pour un MVP ;

- moins complexe que React Router pour un projet de taille moyenne.

Alternatives envisagées :

- React Router : très complet, très répandu, mais plus lourd.

- TanStack Router : puissant, mais plus complexe.

Décision :

Wouter est retenu car il répond au besoin sans surcharger le projet.

Points de vigilance :

- bien gérer les routes privées ;

- ne pas compter uniquement sur le front-end pour la sécurité ;

- les permissions doivent être vérifiées côté back-end.

### 3.4 Valtio pour le state management

Technologie retenue : Valtio.

Rôle dans le projet :

Valtio permet de gérer certains états globaux : utilisateur connecté, profil courant, état d'authentification, équipe active, notifications ou préférences UI.

Pourquoi ce choix :

- simple à utiliser ;

- moins lourd que Redux ;

- adapté au MVP ;

- permet une gestion d'état réactive.

Alternatives envisagées :

- Redux Toolkit : robuste mais plus verbeux.

- Zustand : très bonne alternative, simple et populaire.

- Context API : possible mais peut devenir moins propre si l'état global grandit.

Décision :

Valtio est retenu pour sa simplicité et sa rapidité de mise en place.

Points de vigilance :

- ne pas stocker de données sensibles inutilement côté front ;

- éviter de stocker un token sensible dans localStorage ;

- nettoyer l'état utilisateur à la déconnexion.

## 4 Choix PWA

### 4.1 Progressive Web App

Technologie retenue : PWA avec manifest et service worker.

Rôle dans le projet :

Track'N Share doit être utilisable comme une application installable sur mobile ou desktop.

Pourquoi ce choix :

- correspond à l'objectif web/mobile du projet ;

- permet une expérience proche d'une application native ;

- évite de développer une application mobile native séparée ;

- valorise le projet pendant la soutenance.

Alternatives envisagées :

- application mobile native : trop coûteuse pour le MVP.

- React Native : intéressant, mais impliquerait une base mobile distincte ou plus complexe.

- simple site responsive : plus simple, mais moins ambitieux qu'une PWA.

Décision :

La PWA est retenue pour offrir une expérience mobile installable sans multiplier les technologies.

Points de vigilance :

- ne pas cacher de données sensibles ;

- vérifier le manifest ;

- tester le mode standalone ;

- prévoir une page offline simple ;

- nettoyer les données privées après déconnexion.

### 4.2 Service worker

Technologie retenue : service worker.

Rôle dans le projet :

Le service worker permet de gérer le cache des assets statiques et une expérience offline simple.

Pourquoi ce choix :

- nécessaire pour une vraie PWA ;

- améliore la performance perçue ;

- permet d'afficher une page offline.

Décision :

Le service worker est retenu, mais avec une stratégie prudente.

Stratégie recommandée :

- cache-first pour les assets statiques ;

- network-first pour les données utilisateur ;

- aucune mise en cache persistante de messages privés ou données sensibles.

## 5 Choix back-end

### 5.1 NestJS

Technologie retenue : NestJS.

Rôle dans le projet :

NestJS sera utilisé pour construire le back-end, exposer l'API REST, gérer les règles métier, l'authentification, les profils, les statistiques, les scores, les équipes, les saisons et le chat temps réel.

Pourquoi ce choix :

- framework structuré et modulaire ;

- très adapté à TypeScript ;

- proche d'une architecture professionnelle ;

- supporte facilement les guards, pipes, interceptors et services ;

- compatible avec Socket.io ;

- compatible Swagger ;

- bonne séparation des responsabilités.

Alternatives envisagées :

- Express.js : plus léger, mais moins structurant.

- Fastify seul : performant, mais nécessite plus d'organisation manuelle.

- Laravel / Symfony : très solides, mais changent de langage et moins cohérents avec TypeScript front.

- Django : robuste, mais écosystème Python différent.

Décision :

NestJS est retenu pour sa structure, sa cohérence avec TypeScript et sa pertinence pour un projet complet.

Points de vigilance :

- ne pas surcomplexifier les modules ;

- garder une architecture claire ;

- centraliser les règles métier dans les services ;

- documenter les endpoints.

### 5.2 TypeScript côté back-end

Technologie retenue : TypeScript.

Rôle dans le projet :

TypeScript permet de typer les DTO, services, entités et retours API.

Pourquoi ce choix :

- cohérence avec le front-end ;

- réduction des erreurs ;

- meilleure maintenabilité ;

- bonne intégration avec NestJS.

Décision :

TypeScript est retenu pour l'ensemble du projet afin d'avoir une stack homogène.

### 5.3 API REST

Technologie retenue : API REST.

Rôle dans le projet :

L'API REST permet au front-end de communiquer avec le back-end pour toutes les fonctionnalités principales.

Pourquoi ce choix :

- simple à comprendre ;

- adapté au MVP ;

- facile à documenter avec Swagger ;

- suffisant pour les besoins du projet ;

- compatible avec tous les clients web.

Alternatives envisagées :

- GraphQL : puissant, mais plus complexe pour le MVP.

- gRPC : performant, mais inadapté à une application web simple.

Décision :

REST est retenu pour sa simplicité, sa lisibilité et sa compatibilité avec un projet étudiant/professionnel de taille moyenne.

Points de vigilance :

- bien nommer les endpoints ;

- documenter les paramètres ;

- retourner des erreurs propres ;

- protéger les routes sensibles.

## 6 Choix temps réel

### 6.1 Socket.io

Technologie retenue : Socket.io.

Rôle dans le projet :

Socket.io sera utilisé pour le chat d'équipe en temps réel et éventuellement les notifications ou statuts en ligne.

Pourquoi ce choix :

- simple à intégrer côté client et serveur ;

- compatible avec NestJS ;

- gère les rooms ;

- utile pour un chat d'équipe ;

- adapté aux reconnexions.

Alternatives envisagées :

- WebSocket natif : plus léger, mais demande plus de logique manuelle.

- Server-Sent Events : adapté aux flux serveur vers client, moins complet pour un chat bidirectionnel.

- Firebase Realtime Database : simple, mais ajouterait une dépendance externe forte.

Décision :

Socket.io est retenu pour sa simplicité et son adéquation au chat d'équipe.

Points de vigilance :

- vérifier l'utilisateur à la connexion socket ;

- vérifier l'appartenance à l'équipe avant de rejoindre une room ;

- sauvegarder l'historique des messages ;

- gérer les déconnexions ;

- ne pas exposer les chats d'équipes privées.

## 7 Choix base de données

### 7.1 PostgreSQL

Technologie recommandée : PostgreSQL.

Rôle dans le projet :

PostgreSQL est recommandé pour stocker les données principales : utilisateurs, profils, jeux, comptes liés, statistiques, saisons, équipes, membres, invitations, messages, notifications et badges.

Pourquoi ce choix :

- le projet contient beaucoup de relations ;

- PostgreSQL garantit l'intégrité des données ;

- les requêtes sont structurées ;

- les relations utilisateur-équipe-statistiques-saison sont plus simples à gérer ;

- adapté à une application sérieuse et maintenable.

Alternatives envisagées :

- MongoDB : flexible, mais moins naturel pour les relations nombreuses.

- Redis-JSON seul : rapide, mais moins adapté aux relations complexes.

- SQLite : simple, mais moins pertinent pour un projet multi-service avec Docker.

Décision recommandée :

PostgreSQL est recommandé comme base principale.

Points de vigilance :

- bien définir le modèle de données ;

- créer des index sur les champs importants ;

- éviter les requêtes trop lourdes pour les leaderboards ;

- préparer des migrations.

### 7.2 Redis

Technologie recommandée : Redis.

Rôle dans le projet :

Redis peut être utilisé pour le cache, les sessions, le rate limiting, les leaderboards rapides et certains besoins du temps réel.

Pourquoi ce choix :

- très rapide ;

- adapté au cache ;

- utile pour les classements ;

- utile avec Socket.io si plusieurs instances back-end sont utilisées ;

- complément idéal de PostgreSQL.

Alternatives envisagées :

- cache en mémoire du serveur : simple, mais non partagé et moins robuste.

- uniquement PostgreSQL : possible pour le MVP, mais moins performant pour certains usages.

Décision :

Redis est recommandé en complément de PostgreSQL, pas forcément comme base principale.

Points de vigilance :

- ne pas stocker de secrets en clair ;

- définir une stratégie d'expiration ;

- documenter les clés ;

- ne pas remplacer PostgreSQL pour les relations complexes.

### 7.3 Redis-JSON

Technologie possible : Redis-JSON.

Rôle possible dans le projet :

Redis-JSON peut stocker certaines données sous forme de documents JSON, notamment dans un prototype ou si la contrainte pédagogique l'impose.

Avantages :

- rapide ;

- flexible ;

- stockage JSON simple ;

- pratique pour prototypage.

Limites :

- relations complexes plus difficiles ;

- risque de duplication ;

- maintenance plus délicate ;

- moins naturel pour utilisateurs, équipes, membres et saisons.

Décision :

Redis-JSON peut être utilisé si nécessaire, mais la recommandation principale reste PostgreSQL + Redis.

## 8 Choix ORM / accès aux données

### 8.1 Prisma ou TypeORM

Choix possible : Prisma ou TypeORM.

Rôle :

Ces outils permettent de gérer l'accès à la base de données, les modèles et les migrations.

Prisma — avantages :

- très lisible ;

- migrations simples ;

- typage TypeScript excellent ;

- bonne expérience développeur.

TypeORM — avantages :

- très intégré avec NestJS ;

- approche orientée entités ;

- connu dans l'écosystème Node/Nest.

Décision recommandée :

Prisma est recommandé si l'équipe veut une bonne expérience TypeScript et des migrations simples. TypeORM reste une alternative valable si l'équipe préfère une intégration NestJS plus classique.

Point de vigilance :

Le choix doit être fait tôt pour éviter de réécrire le modèle de données.

## 9 Choix sécurité

### 9.1 Hash des mots de passe

Technologie retenue : Argon2 ou bcrypt.

Pourquoi :

- ne jamais stocker les mots de passe en clair ;

- protéger les utilisateurs ;

- respecter les bonnes pratiques.

Décision recommandée :

Argon2 est préférable si possible. bcrypt reste acceptable et très répandu.

### 9.2 Guards NestJS

Technologie retenue : Guards NestJS.

Rôle :

Protéger les routes privées et vérifier les rôles ou permissions.

Pourquoi :

- intégré à NestJS ;

- clair ;

- centralisable ;

- adapté à auth, équipes et admin.

9.3 class-validator et class-transformer

Technologies retenues : class-validator + class-transformer.

Rôle :

Valider les DTO côté back-end.

Pourquoi :

- éviter les données invalides ;

- réduire les risques d'injection ;

- améliorer la robustesse de l'API.

### 9.4 Helmet

Technologie retenue : Helmet.

Rôle :

Ajouter des headers HTTP de sécurité.

Pourquoi :

- protection simple et rapide ;

- utile contre certaines failles courantes ;

- bonne pratique back-end.

### 9.5 CORS configuré

Technologie retenue : configuration CORS NestJS.

Rôle :

Contrôler quels domaines peuvent appeler l'API.

Pourquoi :

- éviter des appels non désirés ;

- séparer proprement front et back ;

- sécuriser les environnements.

### 9.6 Rate limiting

Technologie retenue : rate limiting.

Rôle :

Limiter les tentatives abusives, notamment sur login, register, invitations et messages.

Pourquoi :

- réduire le bruteforce ;

- limiter le spam ;

- protéger l'API.

## 10 Choix documentation API

### 10.1 Swagger

Technologie retenue : Swagger / OpenAPI.

Rôle :

Documenter les endpoints REST.

Pourquoi ce choix :

- très compatible avec NestJS ;

- utile pour tester l'API ;

- facilite l'intégration front/back ;

- améliore la soutenance.

Alternatives envisagées :

- documentation Markdown manuelle ;

- Postman collection ;

- Insomnia collection.

Décision :

Swagger est retenu comme documentation API principale, avec éventuellement un complément Markdown.

## 11 Choix DevOps

### 11.1 Docker

Technologie retenue : Docker.

Rôle :

Docker permet de créer des environnements isolés pour le front-end, le back-end, PostgreSQL et Redis.

Pourquoi ce choix :

- simplifie l'installation ;

- évite les différences entre machines ;

- facilite la soutenance ;

- permet de lancer tous les services de manière reproductible.

Alternatives envisagées :

- installation manuelle locale ;

- services cloud uniquement.

Décision :

Docker est retenu pour l'environnement de développement et la démonstration.

### 11.2 Docker Compose

Technologie retenue : Docker Compose.

Rôle :

Lancer plusieurs services avec une seule commande.

Services possibles :

- front-end ;

- back-end ;

- PostgreSQL ;

- Redis ;

- outil d'administration de base en bonus.

Pourquoi ce choix :

- simple ;

- adapté au projet ;

- facilite la collaboration.

### 11.3 GitHub

Technologie retenue : GitHub.

Rôle :

- versionner le code ;

- organiser les branches ;

- créer les issues ;

- suivre le projet avec GitHub Project ;

- gérer les reviews.

Pourquoi ce choix :

- standard du développement collaboratif ;

- déjà adapté au kanban projet ;

- permet une bonne traçabilité.

## 12 Choix qualité code

### 12.1 ESLint

Technologie retenue : ESLint.

Rôle :

Détecter les erreurs potentielles et imposer certaines règles de code.

Pourquoi :

- améliore la qualité ;

- évite certains bugs ;

- harmonise le code.

### 12.2 Prettier

Technologie retenue : Prettier.

Rôle :

Formater automatiquement le code.

Pourquoi :

- évite les débats de style ;

- rend le code homogène ;

- facilite les reviews.

## 13 Choix tests

### 13.1 Jest côté back-end

Technologie retenue : Jest.

Rôle :

Tester les services et comportements back-end.

Pourquoi :

- intégré avec NestJS ;

- adapté aux tests unitaires ;

- utile pour les calculs métier.

Tests prioritaires :

- calcul du K/D ;

- calcul du winrate ;

- calcul du score ;

- éligibilité leaderboard ;

- création d'équipe ;

- permissions d'équipe ;

- validation auth.

### 13.2 Vitest ou React Testing Library côté front-end

Technologie possible : Vitest + React Testing Library.

Rôle :

Tester certains composants ou comportements front-end.

Pourquoi :

- utile pour sécuriser les composants critiques ;

- adapté aux formulaires, états vides et dashboard.

Décision :

Les tests front-end sont recommandés mais peuvent rester secondaires si le planning est serré.

### 13.3 Tests manuels

Les tests manuels restent importants pour le MVP.

Parcours à tester :

- inscription ;

- connexion ;

- déconnexion ;

- dashboard ;

- synchronisation mockée ;

- leaderboard ;

- création d'équipe ;

- rejoindre une équipe ;

- chat temps réel ;

- responsive mobile ;

- installation PWA.

## 14 Choix intégrations externes

### 14.1 API mockée d'abord

Choix retenu : commencer par une API mockée.

Pourquoi :

- éviter de bloquer le MVP ;

- sécuriser la démonstration ;

- garantir des données complètes ;

- éviter les quotas ou restrictions d'APIs externes.

Décision :

L'API mockée est obligatoire pour le MVP.

### 14.2 API Steam ou autre API réelle

Choix possible : intégrer une API réelle si le temps le permet.

Pourquoi :

- rendre le projet plus crédible ;

- montrer une vraie intégration externe ;

- enrichir les statistiques.

Point de vigilance :

Une API réelle ne doit pas être indispensable à la soutenance.

## 15 Choix interface et UX

### 15.1 Design responsive

Choix retenu : mobile-first.

Pourquoi :

- le projet vise une expérience web/mobile ;

- la PWA doit être agréable sur téléphone ;

- les dashboards et leaderboards doivent rester lisibles.

### 15.2 Tableaux et cartes

Choix retenu : utiliser des tableaux sur desktop et des cartes ou tableaux adaptés sur mobile.

Pourquoi :

- les leaderboards peuvent contenir beaucoup de colonnes ;

- les cartes sont plus lisibles sur petit écran.

### 15.3 États UI obligatoires

Chaque page importante doit gérer :

- chargement ;

- erreur ;

- état vide ;

- données disponibles.

Pourquoi :

- éviter une interface cassée ;

- améliorer la démonstration ;

- guider l'utilisateur.

## 16 Choix données de démonstration

### 16.1 Seeders

Choix retenu : préparer des seeders.

Rôle :

Insérer automatiquement des joueurs, équipes, jeux, saisons, statistiques et messages.

Pourquoi :

- éviter une application vide ;

- préparer la soutenance ;

- tester les fonctionnalités ;

- garantir des leaderboards remplis.

### 16.2 Compte démo

Choix retenu : créer un compte démo.

Pourquoi :

- faciliter la présentation ;

- éviter de créer toutes les données en direct ;

- montrer rapidement le dashboard, les stats, l'équipe et le chat.

## 17 Tableau récapitulatif des choix

| Domaine | Choix retenu | Alternative | Justification |

|---|---|---|---|

| Front-end | React | Vue, Angular, Svelte | Composants, écosystème, PWA |

| Typage | TypeScript | JavaScript | Robustesse et cohérence |

| Routing | Wouter | React Router | Simplicité et légèreté |

| State | Valtio | Redux, Zustand | Simple pour MVP |

| Back-end | NestJS | Express, Fastify | Structure et TypeScript |

| API | REST | GraphQL | Simple et documentable |

| Temps réel | Socket.io | WebSocket natif | Rooms et intégration simple |

| BDD principale | PostgreSQL | MongoDB, Redis-JSON | Relations nombreuses |

| Cache | Redis | Cache mémoire | Performance et leaderboards |

| PWA | Manifest + SW | App native | Mobile sans app native |

| Sécurité auth | Argon2/bcrypt | Mot de passe clair interdit | Bonne pratique sécurité |

| Documentation API | Swagger | Markdown/Postman | Intégration NestJS |

| DevOps | Docker Compose | Setup manuel | Reproductibilité |

| Gestion projet | GitHub Project | Trello, Notion | Lié au repo et issues |

| Tests back | Jest | Mocha | Intégré NestJS |

## 18 Priorisation technique MVP

À faire absolument pour le MVP :

1. React + TypeScript initialisé.

2. NestJS + TypeScript initialisé.

3. Docker Compose fonctionnel.

4. Authentification sécurisée.

5. Base de données structurée.

6. API mockée de statistiques.

7. Dashboard fonctionnel.

8. Calcul score/KD/winrate.

9. Leaderboard solo.

10. Saisons.

11. Équipes et invitations.

12. Chat d'équipe Socket.io.

13. PWA installable.

14. Données seedées.

15. Sécurité minimale : validation, guards, hash, CORS, rate limit.

À faire ensuite :

- badges ;

- amis ;

- messages privés ;

- notifications ;

- graphiques ;

- recherche ;

- modération ;

- API réelle ;

- push notifications.

## 19 Risques liés aux choix technologiques

### 19.1 Risque API externe

Risque : l'API Steam, Epic ou jeu réel peut être indisponible ou limitée.

Solution : API mockée obligatoire et données seedées.

### 19.2 Risque base de données mal choisie

Risque : Redis-JSON seul peut rendre les relations complexes.

Solution : recommander PostgreSQL + Redis.

### 19.3 Risque PWA sécurité

Risque : données sensibles accessibles dans le cache.

Solution : cache limité aux assets, network-first pour données privées, nettoyage au logout.

### 19.4 Risque temps réel

Risque : Socket.io peut devenir complexe avec permissions, rooms et reconnexions.

Solution : commencer par un chat d'équipe simple.

### 19.5 Risque scope technique trop large

Risque : ajouter trop tôt notifications, amis, badges, matchmaking et modération.

Solution : prioriser le MVP et garder les bonus après stabilisation.

## 20 Conclusion

Les choix technologiques retenus pour Track'N Share visent un équilibre entre ambition, réalisme et qualité.

La stack React + TypeScript + NestJS + PostgreSQL + Redis + Socket.io + Docker est cohérente avec les besoins du projet :

- interface moderne ;

- back-end structuré ;

- données relationnelles ;

- temps réel ;

- PWA ;

- sécurité ;

- démonstration fiable.

La décision la plus importante est de sécuriser le MVP avec une API mockée et des données seedées. Les intégrations externes réelles, les notifications push, les badges avancés, le matchmaking et l'administration complète doivent être ajoutés uniquement après validation du socle principal.

Ce document complète la stack technique détaillée en expliquant les raisons concrètes des choix et les compromis associés.
