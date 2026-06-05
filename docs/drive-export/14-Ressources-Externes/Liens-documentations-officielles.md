# LIENS DOCUMENTATIONS OFFICIELLES

Projet Track'N Share

Version : 1.0

Date de vérification : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document centralise les liens vers les documentations officielles utilisées ou recommandées pour le projet Track'N Share.

Il sert de point d'entrée pour retrouver rapidement les sources fiables liées à la stack technique, aux intégrations externes, à la sécurité, au RGPD, aux tests, au DevOps et aux standards de développement.

Le but est d'éviter de baser les choix techniques du projet sur des articles non officiels, des tutoriels obsolètes ou des sources non vérifiées.

## 1 Règles d'utilisation des sources

### 1.1 Priorité aux sources officielles

Pour les décisions importantes, l'équipe doit privilégier :

- documentation officielle des frameworks ;

- documentation officielle des APIs ;

- standards reconnus ;

- textes réglementaires officiels ;

- guides institutionnels ;

- documentation éditeur ;

- RFC ou spécifications standards.

### 1.2 Sources non officielles

Les sources non officielles peuvent être utilisées pour comprendre, comparer ou débloquer un problème, mais elles ne doivent pas être la source principale d'une décision critique.

Exemples de sources à utiliser avec prudence :

- blogs Medium ;

- forums ;

- Reddit ;

- Stack Overflow ;

- vidéos YouTube ;

- tutoriels anciens ;

- bibliothèques non maintenues ;

- documentations communautaires non vérifiées.

### 1.3 Règle spéciale Steam et Epic

Pour les intégrations Steam et Epic, seules les documentations officielles doivent servir de référence projet.

Les APIs non documentées, endpoints internes, reverse engineering ou sources communautaires ne doivent pas être utilisés comme base du MVP.

Pour Track'N Share, Steam et Epic sont prévus comme intégrations encadrées et non bloquantes. Le MockProvider reste la source de données fiable pour le MVP et la soutenance.

## 2 Documentation front-end

### 2.1 React

Nom : React Documentation

Lien : https://react.dev/

Utilisation dans Track'N Share : base du front-end React, composants, hooks, rendu UI, gestion des états locaux.

Priorité : P0

Notes : source principale pour les concepts React modernes.

### 2.2 Vite

Nom : Vite Documentation

Lien : https://vite.dev/guide/

Utilisation dans Track'N Share : tooling front-end, serveur de développement, build de production, variables VITE_*.

Priorité : P0

Notes : à consulter pour la configuration du build React/PWA.

### 2.3 TypeScript

Nom : TypeScript Documentation

Lien : https://www.typescriptlang.org/docs/

Utilisation dans Track'N Share : typage front-end et back-end, interfaces, types métier, DTO, modèles API.

Priorité : P0

Notes : référence principale pour les règles de typage.

### 2.4 MDN Web Docs

Nom : MDN Web Docs

Lien : https://developer.mozilla.org/

Utilisation dans Track'N Share : HTML, CSS, JavaScript, Web APIs, stockage navigateur, sécurité front-end.

Priorité : P0

Notes : documentation de référence pour les standards Web.

### 2.5 MDN Progressive Web Apps

Nom : MDN — Applications Web Progressives

Lien : https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps

Utilisation dans Track'N Share : PWA, service workers, manifest, offline, cache, installation.

Priorité : P0

Notes : utile pour documenter les règles PWA et les limites de cache.

2.6 web.dev Progressive Web Apps

Nom : web.dev — Progressive Web Apps

Lien : https://web.dev/progressive-web-apps/

Utilisation dans Track'N Share : bonnes pratiques PWA, offline UX, installabilité, performance.

Priorité : P1

Notes : source complémentaire à MDN pour les recommandations pratiques.

### 2.7 Tailwind CSS si retenu

Nom : Tailwind CSS Documentation

Lien : https://tailwindcss.com/docs

Utilisation dans Track'N Share : styles utilitaires, responsive design, UI.

Priorité : P2

Notes : à utiliser seulement si Tailwind est retenu dans le développement.

## 3 Documentation back-end

### 3.1 Node.js

Nom : Node.js Documentation

Lien : https://nodejs.org/docs/latest/api/

Utilisation dans Track'N Share : runtime JavaScript côté serveur, APIs Node, environnement d'exécution.

Priorité : P0

Notes : référence pour les comportements bas niveau côté serveur.

### 3.2 NestJS

Nom : NestJS Documentation

Lien : https://docs.nestjs.com/

Utilisation dans Track'N Share : back-end, modules, controllers, services, providers, guards, pipes, interceptors.

Priorité : P0

Notes : source principale pour l'architecture back-end.

### 3.3 NestJS Configuration

Nom : NestJS Configuration

Lien : https://docs.nestjs.com/techniques/configuration

Utilisation dans Track'N Share : variables d'environnement, configuration centralisée, validation de configuration.

Priorité : P0

Notes : lié aux documents Variables-environnement et Gestion-secrets-env.

### 3.4 NestJS Validation

Nom : NestJS Validation

Lien : https://docs.nestjs.com/techniques/validation

Utilisation dans Track'N Share : DTO, ValidationPipe, class-validator, sécurité des entrées.

Priorité : P0

Notes : essentiel pour les conventions API et sécurité.

### 3.5 NestJS Guards

Nom : NestJS Guards

Lien : https://docs.nestjs.com/guards

Utilisation dans Track'N Share : JWT, rôles, permissions, ResourceOwnerGuard, TeamMemberGuard.

Priorité : P0

Notes : lié aux documents Roles-permissions et Standards-securite-dev.

### 3.6 NestJS WebSockets

Nom : NestJS WebSockets / Gateways

Lien : https://docs.nestjs.com/websockets/gateways

Utilisation dans Track'N Share : chat d'équipe, événements temps réel, Socket.io côté back-end.

Priorité : P0

Notes : à croiser avec la documentation Socket.io officielle.

### 3.7 NestJS OpenAPI / Swagger

Nom : NestJS OpenAPI

Lien : https://docs.nestjs.com/openapi/introduction

Utilisation dans Track'N Share : génération de documentation Swagger, annotations endpoints, modèles API.

Priorité : P0

Notes : lié au document Lien-Swagger.

## 4 Documentation temps réel

### 4.1 Socket.io

Nom : Socket.IO Documentation

Lien : https://socket.io/docs/v4/

Utilisation dans Track'N Share : chat d'équipe, rooms, événements, client/server, reconnexion.

Priorité : P0

Notes : source principale pour Socket.io côté front et back.

### 4.2 Socket.io Server API

Nom : Socket.IO Server API

Lien : https://socket.io/docs/v4/server-api/

Utilisation dans Track'N Share : namespaces, rooms, émission d'événements, gestion de connexions.

Priorité : P1

Notes : utile pour l'implémentation du chat.

### 4.3 Socket.io Client API

Nom : Socket.IO Client API

Lien : https://socket.io/docs/v4/client-api/

Utilisation dans Track'N Share : connexion front-end, écoute d'événements, émission de messages.

Priorité : P1

Notes : utile pour les hooks React liés au chat.

## 5 Documentation base de données et cache

### 5.1 PostgreSQL

Nom : PostgreSQL Documentation

Lien : https://www.postgresql.org/docs/

Utilisation dans Track'N Share : base relationnelle, schéma, index, requêtes, contraintes, migrations.

Priorité : P0

Notes : référence officielle pour PostgreSQL.

### 5.2 Redis

Nom : Redis Documentation

Lien : https://redis.io/docs/latest/

Utilisation dans Track'N Share : cache, rate limiting, locks, leaderboards rapides, présence en ligne.

Priorité : P0

Notes : référence officielle pour Redis Open Source et usages cache.

### 5.3 Prisma si retenu

Nom : Prisma Documentation

Lien : https://www.prisma.io/docs

Utilisation dans Track'N Share : ORM possible, schema, migrations, seeders.

Priorité : P1

Notes : à utiliser si Prisma est choisi pour le back-end.

### 5.4 TypeORM si retenu

Nom : TypeORM Documentation

Lien : https://typeorm.io/

Utilisation dans Track'N Share : ORM possible, entities, migrations, repositories.

Priorité : P1

Notes : alternative à Prisma si TypeORM est choisi.

## 6 Documentation API, standards et authentification

### 6.1 OpenAPI Specification

Nom : OpenAPI Specification

Lien : https://swagger.io/specification/

Utilisation dans Track'N Share : description standard des APIs REST, contrats API, Swagger.

Priorité : P0

Notes : référence de format pour la documentation REST.

### 6.2 Swagger Documentation

Nom : Swagger Documentation

Lien : https://swagger.io/docs/specification/v3_0/about/

Utilisation dans Track'N Share : compréhension pratique de Swagger/OpenAPI, endpoints, schémas, auth.

Priorité : P1

Notes : utile pour expliquer la documentation interactive.

### 6.3 JSON Web Token RFC 7519

Nom : RFC 7519 — JSON Web Token

Lien : https://datatracker.ietf.org/doc/html/rfc7519

Utilisation dans Track'N Share : access tokens JWT, payload minimal, structure standard.

Priorité : P0

Notes : référence officielle du standard JWT.

### 6.4 JWT Best Current Practices RFC 8725

Nom : RFC 8725 — JSON Web Token Best Current Practices

Lien : https://datatracker.ietf.org/doc/html/rfc8725

Utilisation dans Track'N Share : bonnes pratiques sécurité JWT.

Priorité : P1

Notes : utile pour production future et renforcement sécurité.

### 6.5 MDN HTTP

Nom : MDN HTTP

Lien : https://developer.mozilla.org/en-US/docs/Web/HTTP

Utilisation dans Track'N Share : méthodes HTTP, codes de statut, headers, CORS.

Priorité : P0

Notes : référence pour les conventions API.

### 6.6 MDN CORS

Nom : MDN CORS

Lien : https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS

Utilisation dans Track'N Share : configuration CORS entre front-end et back-end.

Priorité : P0

Notes : utile pour le déploiement et les erreurs front/back.

## 7 Documentation DevOps, Git et CI/CD

### 7.1 Docker

Nom : Docker Documentation

Lien : https://docs.docker.com/

Utilisation dans Track'N Share : conteneurs, Dockerfile, images, réseaux, volumes.

Priorité : P0

Notes : référence principale DevOps.

### 7.2 Docker Compose

Nom : Docker Compose Documentation

Lien : https://docs.docker.com/compose/

Utilisation dans Track'N Share : orchestration locale front/back/PostgreSQL/Redis.

Priorité : P0

Notes : essentiel pour la soutenance.

### 7.3 Docker Compose File Reference

Nom : Docker Compose File Reference

Lien : https://docs.docker.com/compose/compose-file/

Utilisation dans Track'N Share : syntaxe docker-compose.yml, services, volumes, networks, secrets.

Priorité : P1

Notes : utile pour corriger ou faire évoluer la configuration Docker.

### 7.4 Git

Nom : Git Documentation

Lien : https://git-scm.com/docs

Utilisation dans Track'N Share : branches, commits, tags, merge, rollback.

Priorité : P0

Notes : lié au document Conventions-Git.

### 7.5 GitHub Actions

Nom : GitHub Actions Documentation

Lien : https://docs.github.com/en/actions

Utilisation dans Track'N Share : CI/CD, lint, tests, build, Docker, pipelines futurs.

Priorité : P1

Notes : lié au document CI-CD-pipeline.

### 7.6 GitHub Pull Requests

Nom : GitHub Pull Requests Documentation

Lien : https://docs.github.com/pull-requests

Utilisation dans Track'N Share : revues de code, branches, merge, conflits.

Priorité : P1

Notes : lié aux conventions Git.

### 7.7 GitHub Projects

Nom : GitHub Projects Documentation

Lien : https://docs.github.com/en/issues/planning-and-tracking-with-projects

Utilisation dans Track'N Share : Kanban, suivi des tâches, sprints, milestones.

Priorité : P1

Notes : utile pour 13-Sprints-Milestones.

7.8 npm

Nom : npm Docs

Lien : https://docs.npmjs.com/

Utilisation dans Track'N Share : gestion des dépendances JavaScript, scripts, audit.

Priorité : P1

Notes : à utiliser si npm est retenu.

7.9 pnpm

Nom : pnpm Documentation

Lien : https://pnpm.io/

Utilisation dans Track'N Share : alternative à npm pour dépendances front/back.

Priorité : P1

Notes : à utiliser si pnpm est retenu.

## 8 Documentation tests

### 8.1 Jest

Nom : Jest Documentation

Lien : https://jestjs.io/docs/getting-started

Utilisation dans Track'N Share : tests unitaires back-end, services, calcul de score, guards.

Priorité : P1

Notes : souvent utilisé avec NestJS.

### 8.2 React Testing Library

Nom : React Testing Library Documentation

Lien : https://testing-library.com/docs/react-testing-library/intro/

Utilisation dans Track'N Share : tests de composants React, interactions utilisateur.

Priorité : P1

Notes : utile pour tester dashboard, formulaires et états UI.

### 8.3 Playwright

Nom : Playwright Documentation

Lien : https://playwright.dev/docs/intro

Utilisation dans Track'N Share : tests end-to-end futurs, parcours login/dashboard/chat.

Priorité : P2

Notes : non obligatoire pour le MVP, utile en évolution.

### 8.4 Cypress

Nom : Cypress Documentation

Lien : https://docs.cypress.io/

Utilisation dans Track'N Share : alternative E2E à Playwright.

Priorité : P2

Notes : choisir Playwright ou Cypress, pas nécessairement les deux.

## 9 Documentation sécurité et RGPD

### 9.1 CNIL — Guide RGPD du développeur

Nom : Guide RGPD du développeur

Lien : https://www.cnil.fr/fr/guide-rgpd-du-developpeur

Utilisation dans Track'N Share : minimisation, sécurité, droits utilisateurs, gestion des données personnelles.

Priorité : P0

Notes : source française de référence pour les bonnes pratiques RGPD côté développement.

### 9.2 RGPD — texte officiel EUR-Lex

Nom : Règlement UE 2016/679 — RGPD

Lien : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679

Utilisation dans Track'N Share : base réglementaire, droits utilisateurs, traitement des données personnelles.

Priorité : P0

Notes : source juridique officielle.

### 9.3 OWASP Top 10

Nom : OWASP Top 10

Lien : https://owasp.org/Top10/

Utilisation dans Track'N Share : risques de sécurité web principaux, contrôles d'accès, injections, mauvaises configurations.

Priorité : P0

Notes : référence sécurité à utiliser pour Protection-attaques et Tests-securite.

### 9.4 OWASP Cheat Sheet Series

Nom : OWASP Cheat Sheet Series

Lien : https://cheatsheetseries.owasp.org/

Utilisation dans Track'N Share : bonnes pratiques pratiques pour auth, API, XSS, validation, logging, secrets.

Priorité : P0

Notes : très utile pendant le développement.

### 9.5 OWASP ASVS

Nom : OWASP Application Security Verification Standard

Lien : https://owasp.org/www-project-application-security-verification-standard/

Utilisation dans Track'N Share : critères de vérification sécurité avancés.

Priorité : P2

Notes : utile pour production future, pas obligatoire pour le MVP.

## 10 Documentation APIs externes gaming

### 10.1 Steam Web API Overview

Nom : Steamworks Web API Overview

Lien : https://partner.steamgames.com/doc/webapi_overview

Utilisation dans Track'N Share : compréhension générale de la Web API Steam, accès HTTP, méthodes publiques/protégées.

Priorité : P0 pour documentation, P1/P2 pour implémentation réelle

Notes : source principale Steam utilisée pour le dossier 08-Integrations-Externes.

### 10.2 Steam Web API Reference

Nom : Steamworks Web API Reference

Lien : https://partner.steamgames.com/doc/webapi

Utilisation dans Track'N Share : interfaces et méthodes disponibles côté Steamworks Web API.

Priorité : P0 pour documentation, P1/P2 pour implémentation réelle

Notes : à consulter avant toute intégration Steam réelle.

### 10.3 Steam Authentication

Nom : Steamworks Authentication

Lien : https://partner.steamgames.com/doc/features/auth

Utilisation dans Track'N Share : authentification Steam, vérification d'utilisateur, ownership éventuel.

Priorité : P1

Notes : à utiliser seulement si une connexion Steam réelle est prévue.

### 10.4 Epic Online Services SDK

Nom : Epic Online Services SDK

Lien : https://onlineservices.epicgames.com/en-US/sdk

Utilisation dans Track'N Share : compréhension générale EOS, SDK, Developer Portal, services disponibles.

Priorité : P0 pour documentation, P2 pour implémentation réelle

Notes : Epic/EOS reste une intégration future pour le MVP.

### 10.5 Epic Developer Portal

Nom : Epic Developer Portal

Lien : https://dev.epicgames.com/portal

Utilisation dans Track'N Share : configuration produit Epic/EOS, credentials, services.

Priorité : P2

Notes : nécessite un compte développeur Epic.

### 10.6 Epic Developer Documentation

Nom : Epic Developer Documentation

Lien : https://dev.epicgames.com/docs/

Utilisation dans Track'N Share : documentation générale Epic, Epic Online Services, Epic Games Store, SDK.

Priorité : P2

Notes : à utiliser si une intégration Epic réelle est lancée après le MVP.

## 11 Documentation monitoring et qualité future

### 11.1 Sentry

Nom : Sentry Documentation

Lien : https://docs.sentry.io/

Utilisation dans Track'N Share : monitoring erreurs front/back en production future.

Priorité : P2

Notes : non obligatoire pour le MVP.

### 11.2 Prometheus

Nom : Prometheus Documentation

Lien : https://prometheus.io/docs/introduction/overview/

Utilisation dans Track'N Share : métriques et monitoring futur.

Priorité : P2

Notes : utile si monitoring avancé.

### 11.3 Grafana

Nom : Grafana Documentation

Lien : https://grafana.com/docs/

Utilisation dans Track'N Share : dashboards monitoring, visualisation logs/métriques.

Priorité : P2

Notes : utile en production future.

## 12 Documentation interne liée

Les documents internes Track'N Share qui s'appuient sur ces sources sont notamment :

- Stack-technique-detaillee ;

- Choix-technologiques ;

- Configuration-Docker ;

- Variables-environnement ;

- Procedure-deploiement ;

- Monitoring-logs ;

- CI-CD-pipeline ;

- Endpoints-REST-API ;

- Documentation-Socket-io ;

- Authentification-JWT ;

- Roles-permissions ;

- Documentation-Steam-API ;

- Documentation-Epic-Games-API ;

- Plan-secours-APIs ;

- Gestion-rate-limiting ;

- Politique-confidentialite ;

- Conformite-RGPD ;

- Protection-attaques ;

- Gestion-secrets-env ;

- Politique-securite ;

- Strategie-tests ;

- Tests-API ;

- Tests-securite ;

- Standards-securite-dev ;

- Conventions-code ;

- Conventions-API.

## 13 Sources à vérifier régulièrement

Certaines sources évoluent rapidement. Elles doivent être vérifiées avant implémentation réelle :

- Steam Web API ;

- Epic Online Services ;

- Node.js ;

- NestJS ;

- Vite ;

- Docker ;

- GitHub Actions ;

- OWASP ;

- CNIL ;

- dépendances npm.

## 14 Règles de mise à jour de ce document

Ce document doit être mis à jour quand :

- une nouvelle technologie est ajoutée ;

- une intégration externe est retenue ;

- une documentation officielle change d'URL ;

- une décision technique importante est prise ;

- une dépendance majeure est remplacée ;

- le projet passe du MVP à une phase de production.

Chaque ajout doit préciser :

- nom de la source ;

- lien ;

- usage dans Track'N Share ;

- priorité ;

- notes éventuelles.

## 15 Synthèse des sources prioritaires MVP

Pour le MVP, les sources les plus importantes sont :

- React : https://react.dev/

- Vite : https://vite.dev/guide/

- TypeScript : https://www.typescriptlang.org/docs/

- NestJS : https://docs.nestjs.com/

- Socket.io : https://socket.io/docs/v4/

- PostgreSQL : https://www.postgresql.org/docs/

- Redis : https://redis.io/docs/latest/

- Docker : https://docs.docker.com/

- Docker Compose : https://docs.docker.com/compose/

- OpenAPI : https://swagger.io/specification/

- JWT RFC 7519 : https://datatracker.ietf.org/doc/html/rfc7519

- CNIL Guide RGPD développeur : https://www.cnil.fr/fr/guide-rgpd-du-developpeur

- OWASP Top 10 : https://owasp.org/Top10/

- Steam Web API Overview : https://partner.steamgames.com/doc/webapi_overview

- Steam Web API Reference : https://partner.steamgames.com/doc/webapi

- Epic Online Services SDK : https://onlineservices.epicgames.com/en-US/sdk

## 16 Conclusion

Ce document sert de bibliothèque de liens officiels pour Track'N Share.

Il permet de justifier les choix techniques et fonctionnels du projet avec des sources fiables. Il doit rester simple, utile et mis à jour au fil du développement.

Pour la soutenance, il montre que la documentation du projet ne repose pas sur des sources improvisées, mais sur des documentations officielles, standards reconnus et références institutionnelles.
