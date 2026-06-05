# CI/CD PIPELINE

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit la stratégie CI/CD prévue pour Track'N Share.

CI/CD signifie Continuous Integration / Continuous Deployment ou Continuous Delivery.

L'objectif est d'automatiser les vérifications du projet afin de s'assurer que le code reste propre, testable, buildable et prêt à être déployé. Pour Track'N Share, le pipeline doit vérifier le front-end React/PWA, le back-end NestJS, les tests, le build, Docker, les variables d'environnement, la sécurité minimale et une éventuelle livraison vers un environnement de démonstration ou de production future.

Pour le MVP, le pipeline peut rester simple. L'objectif principal est de montrer une démarche professionnelle : chaque changement important doit pouvoir être vérifié automatiquement avant d'être fusionné dans la branche principale.

## 1 Vue d'ensemble

### 1.1 Définition de la CI

La CI, ou intégration continue, consiste à vérifier automatiquement le code à chaque changement.

Elle peut exécuter :

- installation des dépendances ;

- lint ;

- format check ;

- tests unitaires ;

- tests d'intégration ;

- build front-end ;

- build back-end ;

- audit de dépendances ;

- build Docker.

### 1.2 Définition de la CD

La CD, ou livraison / déploiement continu, consiste à automatiser la mise à disposition du projet dans un environnement.

Elle peut exécuter :

- build des images Docker ;

- push vers un registre ;

- déploiement staging ;

- migrations ;

- healthcheck après déploiement ;

- rollback si échec.

### 1.3 Objectif pour Track'N Share

Pour Track'N Share, le pipeline doit garantir que :

- le front-end compile ;

- le back-end compile ;

- les tests critiques passent ;

- les migrations ne cassent pas le projet ;

- Docker peut construire les services ;

- aucun secret n'est exposé ;

- le mode démo reste fonctionnel ;

- les branches principales restent stables.

## 2 Outil recommandé

### 2.1 GitHub Actions

L'outil recommandé est GitHub Actions, car le projet est prévu pour être organisé autour de GitHub et d'un GitHub Project / Kanban.

Avantages :

- intégré à GitHub ;

- déclenchement automatique sur push ou pull request ;

- gestion de secrets CI/CD ;

- logs consultables ;

- workflows versionnés dans le dépôt ;

- compatible avec tests, build, Docker et déploiement.

### 2.2 Emplacement des workflows

Les workflows doivent être placés dans :

.github/workflows/

Exemples :

- ci.yml ;

- docker.yml ;

- deploy-staging.yml ;

- security.yml.

Pour le MVP, un seul fichier ci.yml peut suffire.

## 3 Branches recommandées

### 3.1 Branches principales

main

Branche stable du projet. Elle doit représenter une version fonctionnelle.

Dev

Branche d'intégration. Les fonctionnalités y sont fusionnées avant main.

feature/*

Branches de fonctionnalités.

Exemples :

- feature/auth-jwt ;

- feature/team-chat ;

- feature/leaderboards ;

- feature/docker-config.

fix/*

Branches de correction.

Exemples :

- fix/login-error ;

- fix/docker-env ;

- fix/chat-permissions.

### 3.2 Stratégie MVP recommandée

Pour un projet étudiant, une stratégie simple suffit :

- main : version stable / soutenance ;

- feature/* : développement de fonctionnalités ;

- pull requests vers main ;

- CI obligatoire avant merge.

Si l'équipe veut un workflow plus complet :

- feature/* → dev ;

- dev → main après stabilisation.

### 3.3 Règles de protection recommandées

Sur main :

- pas de push direct si possible ;

- pull request obligatoire ;

- CI verte obligatoire ;

- revue par l'autre membre de l'équipe ;

- pas de merge si tests échoués.

## 4 Déclencheurs du pipeline

### 4.1 Pull request

Déclenchement recommandé :

- à chaque pull request vers main ;

- éventuellement vers dev si branche utilisée.

Objectif :

Vérifier que le changement ne casse pas le projet avant fusion.

### 4.2 Push

Déclenchement recommandé :

- à chaque push sur main ;

- éventuellement à chaque push sur dev.

Objectif :

Vérifier que la branche stable reste correcte.

### 4.3 Déclenchement manuel

GitHub Actions permet un lancement manuel avec workflow_dispatch.

Usage :

- relancer un pipeline ;

- déclencher un build Docker ;

- préparer un environnement de démo ;

- lancer un déploiement staging futur.

## 5 Pipeline CI MVP recommandé

### 5.1 Étapes minimales

Pour le MVP, le pipeline CI doit au minimum :

1. Récupérer le code.

2. Installer les dépendances back-end.

3. Installer les dépendances front-end.

4. Exécuter le lint back-end.

5. Exécuter le lint front-end.

6. Lancer les tests unitaires si présents.

7. Build le back-end.

8. Build le front-end.

9. Vérifier que Docker build fonctionne.

### 5.2 Objectif

Cette CI permet de détecter rapidement :

- erreur TypeScript ;

- dépendance manquante ;

- erreur de lint ;

- build front cassé ;

- build back cassé ;

- Dockerfile incorrect ;

- problème de configuration évident.

### 5.3 Priorités

P0 :

- installation ;

- lint ;

- build front ;

- build back ;

- tests unitaires critiques.

P1 :

- tests d'intégration ;

- build Docker ;

- audit de dépendances ;

- test migrations.

P2 :

- déploiement automatique ;

- scans sécurité avancés ;

- tests end-to-end ;

- rollback automatisé.

## 6 Exemple de workflow CI simple

Exemple conceptuel de .github/workflows/ci.yml :

name: CI

on:

pull_request:

branches: [main]

push:

branches: [main]

workflow_dispatch:

jobs:

backend:

name: Backend checks

runs-on: ubuntu-latest

steps:

- name: Checkout repository

uses: actions/checkout@v4

- name: Setup Node.js

uses: actions/setup-node@v4

with:

node-version: 20

cache: npm

cache-dependency-path: backend/package-lock.json

- name: Install backend dependencies

working-directory: backend

run: npm ci

- name: Lint backend

working-directory: backend

run: npm run lint

- name: Test backend

working-directory: backend

run: npm run test

- name: Build backend

working-directory: backend

run: npm run build

frontend:

name: Frontend checks

runs-on: ubuntu-latest

steps:

- name: Checkout repository

uses: actions/checkout@v4

- name: Setup Node.js

uses: actions/setup-node@v4

with:

node-version: 20

cache: npm

cache-dependency-path: frontend/package-lock.json

- name: Install frontend dependencies

working-directory: frontend

run: npm ci

- name: Lint frontend

working-directory: frontend

run: npm run lint

- name: Build frontend

working-directory: frontend

run: npm run build

Remarque :

Ce workflow doit être adapté si le projet utilise pnpm ou yarn.

## 7 Variante avec pnpm

Si le projet utilise pnpm, les étapes peuvent être adaptées :

- name: Setup pnpm

uses: pnpm/action-setup@v4

with:

version: 9

- name: Setup Node.js

uses: actions/setup-node@v4

with:

node-version: 20

cache: pnpm

- name: Install dependencies

run: pnpm install --frozen-lockfile

Recommandation :

Choisir un seul gestionnaire de paquets pour le projet et l'utiliser partout.

## 8 Variables d'environnement dans la CI

### 8.1 Variables non sensibles

La CI peut utiliser des variables non sensibles directement dans le workflow.

Exemples :

- NODE_ENV=test ;

- EXTERNAL_API_MODE=mock ;

- MOCK_PROVIDER_ENABLED=true ;

- LOG_LEVEL=error.

### 8.2 Secrets GitHub Actions

Les secrets doivent être stockés dans GitHub Actions Secrets.

Exemples :

- DATABASE_URL_TEST ;

- JWT_SECRET_TEST ;

- DOCKER_REGISTRY_TOKEN ;

- DEPLOY_TOKEN ;

- SENTRY_DSN ;

- SSH_PRIVATE_KEY si déploiement par SSH.

### 8.3 Règles de sécurité

- ne jamais écrire de secrets dans ci.yml ;

- ne jamais afficher un secret avec echo ;

- séparer secrets test, staging et production ;

- limiter les permissions du workflow ;

- ne pas utiliser de secrets production sur des pull requests non fiables.

### 8.4 Configuration recommandée CI MVP

Pour le MVP :

- utiliser des secrets fictifs pour les tests ;

- garder EXTERNAL_API_MODE=mock ;

- ne pas appeler Steam ou Epic en CI ;

- ne pas nécessiter de vraie clé API externe.

## 9 Services CI pour tests d'intégration

### 9.1 PostgreSQL dans GitHub Actions

Pour tester le back-end avec une vraie base, GitHub Actions peut lancer PostgreSQL comme service.

Exemple conceptuel :

services:

postgres:

image: postgres:16-alpine

env:

POSTGRES_USER: tracknshare

POSTGRES_PASSWORD: tracknshare

POSTGRES_DB: tracknshare_test

ports:

- 5432:5432

options: >-

--health-cmd pg_isready

--health-interval 10s

--health-timeout 5s

--health-retries 5

### 9.2 Redis dans GitHub Actions

Redis peut également être lancé comme service.

Exemple :

services:

redis:

image: redis:7-alpine

ports:

- 6379:6379

### 9.3 Usage recommandé

Pour le MVP :

- les tests unitaires peuvent ne pas nécessiter PostgreSQL ;

- les tests d'intégration peuvent être ajoutés en P1 ;

- Redis est utile pour tester rate limiting, cache et locks.

## 10 Tests à exécuter dans la CI

### 10.1 Tests back-end

Tests P0 :

- AuthService ;

- JwtStrategy ;

- RolesGuard ;

- ResourceOwnerGuard ;

- TeamMemberGuard ;

- StatsService calcul score ;

- TeamService permissions ;

- DTO validation.

Tests P1 :

- endpoints REST ;

- Socket.io ;

- seeders ;

- migrations ;

- archivage trimestriel ;

- provider mock.

### 10.2 Tests front-end

Tests P0 :

- composants critiques ;

- page login ;

- dashboard ;

- affichage leaderboard ;

- état erreur 401 / 403 ;

- affichage mode démo.

Tests P1 :

- parcours utilisateur ;

- formulaires ;

- équipe et chat ;

- PWA offline ;

- accessibilité de base.

### 10.3 Tests end-to-end

Priorité : P2.

Tests possibles :

- inscription ;

- login ;

- dashboard ;

- synchronisation mock ;

- leaderboard ;

- création équipe ;

- chat.

Outils possibles :

- Playwright ;

- Cypress.

Pour le MVP, les tests E2E peuvent être documentés sans être obligatoires.

## 11 Qualité de code

### 11.1 Lint

Objectif :

Détecter les erreurs de style, de règles TypeScript ou de mauvaises pratiques.

Commandes possibles :

- npm run lint ;

- pnpm lint.

### 11.2 Format

Objectif :

Garantir un style homogène.

Commandes possibles :

- npm run format:check ;

- pnpm format:check.

### 11.3 Type-check

Objectif :

Vérifier le typage TypeScript.

Commandes possibles :

- npm run typecheck ;

- tsc --noEmit.

### 11.4 Recommandation MVP

Inclure au minimum :

- lint back ;

- lint front ;

- build back ;

- build front.

## 12 Build Docker dans la CI

### 12.1 Objectif

Vérifier que les Dockerfiles sont valides.

### 12.2 Build des images

Commandes possibles :

docker build -t tracknshare-backend ./backend

docker build -t tracknshare-frontend ./frontend

### 12.3 Build Docker Compose

Commande possible :

docker compose build

### 12.4 Priorité

- P1 pour le MVP ;

- P0 si Docker est la méthode principale de soutenance.

## 13 Audit des dépendances

### 13.1 Objectif

Détecter les vulnérabilités connues dans les dépendances.

### 13.2 Commandes possibles

npm :

npm audit

pnpm :

pnpm audit

### 13.3 Recommandation

Pour le MVP :

- audit en mode informatif ;

- ne pas forcément bloquer le pipeline sur toutes les alertes ;

- corriger les vulnérabilités critiques ou faciles.

En production future :

- bloquer sur vulnérabilités critiques ;

- tenir les dépendances à jour ;

- scanner les images Docker.

## 14 Sécurité du pipeline

### 14.1 Permissions minimales

Les workflows doivent avoir uniquement les droits nécessaires.

Exemple :

permissions:

contents: read

Si le workflow doit publier une image ou déployer, ajouter seulement les permissions nécessaires.

### 14.2 Secrets

Règles :

- secrets GitHub uniquement ;

- pas de secrets dans le YAML ;

- pas de secrets dans les logs ;

- pas de secrets de production dans les PR externes ;

- rotation en cas d'exposition.

### 14.3 Environnements protégés

Pour staging ou production :

- utiliser GitHub Environments ;

- demander une validation manuelle pour production ;

- séparer staging et production ;

- limiter les droits de déploiement.

## 15 Pipeline CD futur

### 15.1 Objectif

Le CD peut automatiser le déploiement après validation de la CI.

### 15.2 Environnements possibles

Staging

Environnement de test proche de la production.

Demo

Environnement dédié à la soutenance ou présentation.

Production

Environnement accessible aux vrais utilisateurs.

### 15.3 Étapes CD recommandées

1. Construire les artefacts.

2. Construire les images Docker.

3. Publier les images dans un registre.

4. Déployer le back-end.

5. Lancer les migrations.

6. Déployer le front-end.

7. Vérifier les healthchecks.

8. Vérifier Swagger si activé.

9. Notifier le résultat.

### 15.4 CD MVP

Pour le MVP, le CD peut rester manuel.

La CI suffit à démontrer :

- qualité ;

- build ;

- tests ;

- stabilité.

## 16 Déploiement staging futur

### 16.1 Déclenchement

Déclenchement possible :

- push sur dev ;

- lancement manuel ;

- merge vers main avec tag staging.

### 16.2 Configuration staging

NODE_ENV=production ou staging

DEMO_MODE=true ou false selon besoin

EXTERNAL_API_MODE=mock ou hybrid

SWAGGER_ENABLED=true

LOG_LEVEL=info

### 16.3 Vérifications post-déploiement

- GET /health ;

- GET /health/database ;

- GET /health/redis ;

- login démo ;

- dashboard ;

- leaderboard ;

- chat ;

- logs sans erreurs critiques.

## 17 Déploiement production futur

### 17.1 Déclenchement

Déclenchement recommandé :

- tag de version ;

- validation manuelle ;

- CI verte obligatoire.

### 17.2 Conditions avant production

- tests passés ;

- migrations testées ;

- secrets configurés ;

- HTTPS ;

- CORS strict ;

- routes démo désactivées ;

- Swagger protégé ;

- monitoring prêt ;

- rollback prévu.

### 17.3 Déploiement manuel contrôlé

Pour une première production, préférer un déploiement manuel contrôlé plutôt qu'un auto-deploy complet.

## 18 Migrations dans le pipeline

### 18.1 Risques

Les migrations peuvent :

- casser la base ;

- supprimer des données ;

- échouer en production ;

- rendre le rollback difficile.

### 18.2 Règles recommandées

- tester les migrations en CI avec base test ;

- sauvegarder avant migration production ;

- éviter les migrations destructives ;

- documenter les migrations importantes ;

- lancer les migrations avant le démarrage complet si nécessaire ;

- vérifier /health après migration.

### 18.3 MVP

Pour le MVP, les migrations peuvent rester manuelles :

docker compose exec backend npm run migration:run

Mais la CI peut vérifier que le build et les tests passent.

## 19 Seeders dans le pipeline

### 19.1 Usage

Les seeders sont utiles pour :

- tests ;

- staging ;

- soutenance ;

- environnement démo.

### 19.2 Règles

- ne jamais seed la production réelle automatiquement ;

- DEMO_SEED_ENABLED=false en production ;

- seed autorisé en staging/demo ;

- seed avec données fictives uniquement ;

- seed idempotent si possible.

### 19.3 CI

La CI peut lancer un seed sur une base de test pour vérifier :

- données cohérentes ;

- compte démo créé ;

- statistiques valides ;

- leaderboards calculables.

## 20 Gestion des versions

### 20.1 Tags

Utiliser des tags pour marquer les versions stables.

Exemples :

- v0.1.0-mvp ;

- v0.2.0-demo ;

- v1.0.0.

### 20.2 Versioning recommandé

Pour le projet :

- v0.x pour le MVP et les versions de démonstration ;

- v1.0.0 pour une version complète stable.

### 20.3 Changelog

Un changelog peut documenter :

- nouvelles fonctionnalités ;

- corrections ;

- changements techniques ;

- migrations ;

- risques connus.

## 21 Notifications du pipeline

### 21.1 MVP

Pour le MVP, les notifications GitHub suffisent.

Les membres voient :

- succès ;

- échec ;

- logs ;

- étape en erreur.

### 21.2 Production future

Notifications possibles :

- email ;

- Discord ;

- Slack ;

- GitHub PR comment ;

- issue automatique si échec critique.

## 22 Exemple de pipeline complet futur

Structure possible :

name: Full CI

on:

pull_request:

branches: [main, dev]

push:

branches: [main, dev]

workflow_dispatch:

jobs:

quality:

runs-on: ubuntu-latest

steps:

- checkout

- setup node

- install dependencies

- lint

- typecheck

- tests

build:

needs: quality

runs-on: ubuntu-latest

steps:

- checkout

- build backend

- build frontend

docker:

needs: build

runs-on: ubuntu-latest

steps:

- checkout

- docker build backend

- docker build frontend

security:

runs-on: ubuntu-latest

steps:

- audit dependencies

- check no .env committed

deploy-staging:

needs: [build, docker]

if: github.ref == 'refs/heads/dev'

runs-on: ubuntu-latest

steps:

- deploy to staging

- run healthcheck

Remarque :

Ce schéma est une cible future. Le MVP peut se limiter à quality + build.

## 23 Contrôles spécifiques Track'N Share

### 23.1 Contrôles sécurité

Le pipeline doit idéalement vérifier :

- aucun fichier .env commité ;

- aucun secret évident dans le code ;

- tests de guards ;

- tests des routes privées ;

- tests du chat non-membre ;

- tests du rate limiting si possible.

### 23.2 Contrôles métier

Le pipeline doit idéalement vérifier :

- score calculé correctement ;

- winrate correct ;

- K/D correct ;

- matchesPlayed cohérent ;

- leaderboard trié ;

- saison active unique ;

- archive non modifiée.

### 23.3 Contrôles démo

Le pipeline peut vérifier en P1/P2 :

- seed demo fonctionne ;

- compte démo créé ;

- MockProvider disponible ;

- Steam/Epic non nécessaires ;

- dashboard demo testable.

## 24 Check no .env committed

### 24.1 Objectif

Éviter qu'un fichier d'environnement contenant des secrets soit commité.

### 24.2 Contrôle simple

Commande possible :

git ls-files | grep -E '(^|/)\.env(\..*)?$' && exit 1 || exit 0

Attention :

Il faut autoriser .env.example.

### 24.3 Recommandation

Ajouter ce contrôle en P1 dans la CI.

## 25 Rollback et CI/CD

### 25.1 Rollback code

Si un déploiement échoue :

- revenir au tag précédent ;

- rebuild ;

- redéployer ;

- vérifier healthcheck.

### 25.2 Rollback base

Plus complexe.

Règles :

- sauvegarde avant migration ;

- éviter migrations destructives ;

- tester avant production ;

- documenter les migrations.

### 25.3 Rollback staging/demo

En staging/demo :

- reset possible ;

- relancer migrations ;

- relancer seed ;

- reconstruire l'environnement.

## 26 Checklist CI MVP

- Workflow GitHub Actions créé.

- Déclenchement sur pull request vers main.

- Déclenchement sur push main.

- Installation dépendances back-end.

- Installation dépendances front-end.

- Lint back-end.

- Lint front-end.

- Tests unitaires back-end si présents.

- Build back-end.

- Build front-end.

- Aucune clé Steam/Epic requise.

- Mode mock utilisé pour tests.

- Secrets non écrits dans le workflow.

- Échec du pipeline bloque le merge.

## 27 Checklist CD future

- Build Docker backend.

- Build Docker frontend.

- Push images dans registre.

- Déploiement staging automatique.

- Healthcheck post-déploiement.

- Migrations contrôlées.

- Seed uniquement staging/demo.

- Déploiement production manuel.

- Rollback documenté.

- Notifications d'échec.

- Secrets GitHub séparés par environnement.

## 28 Risques et solutions

### 28.1 Risque : pipeline trop complexe pour le MVP

Impact : perte de temps et maintenance difficile.

Solution : commencer simple avec lint, test, build.

### 28.2 Risque : CI non représentative du projet réel

Impact : pipeline vert mais application cassée.

Solution : ajouter progressivement Docker build, tests d'intégration et seed demo.

### 28.3 Risque : secrets exposés dans GitHub Actions

Impact : compromission.

Solution : GitHub Secrets, pas de echo, permissions minimales.

### 28.4 Risque : déploiement automatique casse la production

Impact : service indisponible.

Solution : validation manuelle pour production et rollback.

### 28.5 Risque : migrations non testées

Impact : base cassée.

Solution : base de test en CI et sauvegarde avant production.

### 28.6 Risque : dépendances vulnérables

Impact : faille de sécurité.

Solution : audit, mises à jour, blocage sur vulnérabilités critiques en production.

## 29 Plan d'implémentation recommandé

Phase 1 — CI minimale

- créer .github/workflows/ci.yml ;

- installer dépendances ;

- lint ;

- tests ;

- build front/back.

Phase 2 — Qualité renforcée

- typecheck ;

- format check ;

- tests unitaires critiques ;

- cache dépendances ;

- check .env.

Phase 3 — Docker

- build Docker backend ;

- build Docker frontend ;

- docker compose build ;

- test lancement minimal si possible.

Phase 4 — Intégration

- services PostgreSQL et Redis en CI ;

- migrations test ;

- seed demo test ;

- tests d'intégration API.

Phase 5 — CD futur

- staging ;

- healthcheck ;

- notifications ;

- rollback ;

- production manuelle.

## 30 Critères d'acceptation

Le pipeline CI/CD est considéré correctement documenté si :

- l'outil recommandé est identifié ;

- les branches sont définies ;

- les déclencheurs sont expliqués ;

- les étapes CI MVP sont listées ;

- un exemple de workflow est fourni ;

- la gestion des secrets CI/CD est documentée ;

- les tests à exécuter sont identifiés ;

- le build front et back est prévu ;

- Docker est pris en compte ;

- la stratégie CD future est décrite ;

- les migrations et seeders sont encadrés ;

- les risques sont identifiés ;

- les checklists MVP et future sont présentes.

## 31 Conclusion

Le pipeline CI/CD de Track'N Share doit aider l'équipe à maintenir un projet stable, testable et démontrable.

Pour le MVP, la priorité est de mettre en place une CI simple : installation, lint, tests et build du front-end et du back-end.

La CD peut rester manuelle dans un premier temps, surtout pour éviter de complexifier le projet avant la soutenance.

Après le MVP, le pipeline pourra évoluer vers un système plus complet : build Docker, tests d'intégration avec PostgreSQL et Redis, seed demo, staging, healthchecks, déploiement contrôlé et rollback.

Une CI/CD bien pensée permettra à Track'N Share de progresser plus sereinement, en réduisant les régressions et en améliorant la qualité globale du projet.
