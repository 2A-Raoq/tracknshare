# CONVENTIONS GIT

Projet Track'N Share

Version : 1.0

Date : 08/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit les conventions Git et GitHub à appliquer pendant le développement de Track'N Share.

Il sert à organiser le travail d'équipe, garder un historique propre, éviter les conflits, sécuriser le dépôt et garantir que la branche principale reste toujours exploitable pour le développement, la démonstration et la soutenance.

Ces règles doivent être appliquées dès le début du développement, même si le projet démarre avec une petite équipe de deux développeurs.

## 1 Principes généraux

### 1.1 Objectif de Git dans le projet

Git doit permettre de :

- suivre l'historique du projet ;

- travailler à deux sans écraser le travail de l'autre ;

- isoler les nouvelles fonctionnalités ;

- corriger les bugs proprement ;

- relier le code aux tâches du Kanban GitHub Project ;

- revenir à une version stable en cas de problème ;

- préparer une version propre pour la soutenance.

### 1.2 Règle principale

La branche main doit toujours rester stable.

Elle ne doit contenir que du code :

- fonctionnel ;

- relu ;

- testé ou vérifié ;

- sans secret ;

- cohérent avec le MVP ;

- présentable en soutenance.

### 1.3 Travail en branches

Tout développement doit être fait dans une branche dédiée.

Il ne faut pas coder directement sur main.

## 2 Branches principales

2.1 main

Rôle : branche stable du projet.

La branche main sert à :

- conserver la version de référence ;

- préparer les démonstrations ;

- créer les tags de version ;

- garder un état exploitable du projet.

Règles :

- pas de commit direct si possible ;

- fusion uniquement via pull request ;

- CI verte si pipeline disponible ;

- revue par l'autre membre de l'équipe ;

- aucun secret ;

- aucun code cassé.

2.2 dev

Rôle : branche d'intégration facultative.

Elle peut être utilisée si l'équipe veut tester plusieurs fonctionnalités ensemble avant de les envoyer dans main.

Utilisation recommandée :

- feature/* vers dev ;

- dev vers main quand la version est stable.

Pour un projet à deux, dev est utile mais pas obligatoire. Une stratégie simple avec feature/* vers main peut suffire si les PR sont bien relues.

2.3 feature/*

Rôle : développement d'une nouvelle fonctionnalité.

Exemples :

- feature/auth-jwt ;

- feature/profile-settings ;

- feature/stats-sync-mock ;

- feature/player-dashboard ;

- feature/team-chat ;

- feature/leaderboard-solo ;

- feature/pwa-manifest.

2.4 fix/*

Rôle : correction d'un bug.

Exemples :

- fix/login-redirect ;

- fix/docker-database-url ;

- fix/chat-permissions ;

- fix/leaderboard-sort ;

- fix/stats-score-calculation.

2.5 docs/*

Rôle : modification documentaire uniquement.

Exemples :

- docs/api-endpoints ;

- docs/docker-setup ;

- docs/rgpd-update ;

- docs/sprint-roadmap.

2.6 chore/*

Rôle : configuration, dépendances, outillage ou maintenance.

Exemples :

- chore/docker-compose ;

- chore/eslint-config ;

- chore/github-actions ;

- chore/update-dependencies.

## 3 Convention de nommage des branches

### 3.1 Format recommandé

Format :

type/sujet-court

Exemples :

- feature/auth-jwt ;

- feature/team-invitations ;

- feature/stats-dashboard ;

- fix/socket-room-access ;

- docs/conventions-git ;

- chore/docker-postgres-redis.

### 3.2 Types autorisés

Types recommandés :

- feature : nouvelle fonctionnalité ;

- fix : correction ;

- docs : documentation ;

- refactor : amélioration interne sans changement fonctionnel ;

- test : ajout ou correction de tests ;

- chore : maintenance, configuration, dépendances ;

- hotfix : correction urgente sur main ;

- ci : pipeline CI/CD.

### 3.3 Règles de nommage

- utiliser des lettres minuscules ;

- utiliser des tirets ;

- éviter les accents ;

- éviter les espaces ;

- rester court mais compréhensible ;

- nommer la branche selon l'objectif réel.

À éviter :

- test ;

- update ;

- branch-clement ;

- truc ;

- final-final ;

- correction.

## 4 Workflow recommandé

### 4.1 Workflow simple MVP

Pour le MVP, le workflow recommandé est :

1. Créer une tâche dans GitHub Project.

2. Créer une branche depuis main.

3. Développer la fonctionnalité.

4. Faire des commits clairs.

5. Pousser la branche sur GitHub.

6. Ouvrir une pull request.

7. Relire la PR à deux.

8. Corriger si nécessaire.

9. Merger dans main.

10. Supprimer la branche.

11. Mettre à jour la tâche Kanban.

### 4.2 Commandes de base

Créer une branche :

git checkout main

git pull origin main

git checkout -b feature/auth-jwt

Ajouter des fichiers :

git add .

Créer un commit :

git commit -m "feat(auth): add JWT login flow"

Pousser la branche :

git push origin feature/auth-jwt

Mettre à jour main :

git checkout main

git pull origin main

### 4.3 Avant de commencer une nouvelle tâche

Toujours faire :

git checkout main

git pull origin main

Puis créer une nouvelle branche.

## 5 Commits

### 5.1 Objectif des commits

Un commit doit représenter un changement cohérent et compréhensible.

Un bon commit doit permettre de comprendre rapidement :

- ce qui a été changé ;

- dans quelle partie du projet ;

- pourquoi le changement existe.

### 5.2 Format recommandé

Format :

type(scope): message court

Exemples :

- feat(auth): add register endpoint ;

- feat(stats): add score calculation service ;

- fix(chat): prevent non-members from joining team room ;

- docs(api): update REST endpoints documentation ;

- chore(docker): add redis service ;

- test(stats): add score calculation tests.

### 5.3 Types de commits

feat

Ajout d'une fonctionnalité.

fix

Correction d'un bug.

docs

Documentation uniquement.

style

Formatage, espaces, lint, sans changement de logique.

refactor

Réorganisation ou amélioration interne du code sans changement fonctionnel.

test

Ajout ou modification de tests.

chore

Configuration, dépendances, scripts, maintenance.

ci

Modification du pipeline CI/CD.

perf

Amélioration de performance.

### 5.4 Scopes recommandés

Scopes possibles :

- auth ;

- profile ;

- stats ;

- leaderboard ;

- teams ;

- chat ;

- seasons ;

- api ;

- db ;

- redis ;

- docker ;

- pwa ;

- security ;

- docs ;

- ci.

### 5.5 Bonnes pratiques de commits

- faire des commits réguliers ;

- éviter les commits géants ;

- éviter les commits trop petits sans intérêt ;

- vérifier le diff avant commit ;

- écrire un message clair ;

- ne jamais commiter de secret ;

- ne pas mélanger plusieurs sujets sans lien.

### 5.6 Messages à éviter

À éviter :

- update ;

- fix ;

- test ;

- modifications ;

- wip ;

- ça marche ;

- final ;

- final2 ;

- correction bug.

## 6 Pull Requests

### 6.1 Objectif des pull requests

Une pull request permet de :

- relire le code ;

- vérifier la cohérence ;

- discuter d'un changement ;

- relier le code à une tâche ;

- éviter de casser main ;

- garder une trace du travail réalisé.

### 6.2 Quand ouvrir une PR

Ouvrir une PR quand :

- la fonctionnalité est terminée ;

- le code compile ;

- les vérifications minimales sont faites ;

- la branche est à jour ;

- la PR a un objectif clair.

### 6.3 Taille recommandée

Une PR doit rester raisonnable.

À éviter :

- une PR énorme avec front, back, Docker, docs et refactor sans lien clair ;

- une PR contenant plusieurs fonctionnalités indépendantes ;

- une PR difficile à relire.

### 6.4 Contenu attendu d'une PR

Une PR doit contenir :

- un titre clair ;

- une description courte ;

- le contexte ;

- les changements principaux ;

- les tests ou vérifications effectués ;

- les captures d'écran si UI ;

- les impacts sur la documentation ;

- les risques éventuels.

### 6.5 Modèle de PR recommandé

Titre :

feat(stats): add player score calculation

Description :

- Ajout du service de calcul du score joueur.

- Ajout des constantes de pondération.

- Gestion du minimum de parties pour le leaderboard.

Tests réalisés :

- calcul avec stats complètes ;

- calcul avec 0 death ;

- joueur non éligible si moins de 10 parties.

Risques :

- formule à valider avec les règles métier.

## 7 Revue de code

### 7.1 Objectif

La revue de code permet d'améliorer la qualité et de réduire les erreurs.

Même à deux, elle est importante.

### 7.2 Points à vérifier

Pendant la revue, vérifier :

- lisibilité du code ;

- respect des conventions ;

- cohérence avec le MVP ;

- absence de secret ;

- typage TypeScript ;

- gestion des erreurs ;

- sécurité des routes ;

- DTO et validation ;

- permissions back-end ;

- absence de duplication inutile ;

- tests ou vérifications ;

- impact sur la documentation.

### 7.3 Règle de validation

Une PR importante doit être relue par l'autre membre de l'équipe avant merge.

Si la PR est urgente ou mineure, une auto-validation peut être acceptée, mais cela doit rester exceptionnel.

## 8 GitHub Project / Kanban

### 8.1 Objectif

GitHub Project sert à suivre l'avancement des tâches.

Il doit refléter l'état réel du projet.

### 8.2 Colonnes recommandées

Colonnes possibles :

- Backlog ;

- À faire ;

- En cours ;

- En review ;

- Test ;

- Terminé.

### 8.3 Règles d'utilisation

- chaque tâche importante doit avoir une carte ;

- chaque branche doit idéalement correspondre à une carte ;

- chaque PR doit être liée à une carte ;

- une carte ne passe en Terminé que si la tâche est vérifiée ;

- les bugs doivent être ajoutés au Kanban ;

- les tâches de documentation peuvent aussi être suivies.

### 8.4 Exemple de carte

Titre :

Implémenter le login JWT

Description :

- endpoint POST /auth/login ;

- validation DTO ;

- hash password ;

- génération access token ;

- tests login success / fail.

Priorité : P0

Responsable : Ioanes

Branche : feature/auth-jwt

## 9 Issues GitHub

### 9.1 Utilisation

Les issues peuvent servir à suivre :

- bugs ;

- tâches techniques ;

- fonctionnalités ;

- dette technique ;

- améliorations futures.

### 9.2 Labels recommandés

Labels possibles :

- bug ;

- feature ;

- documentation ;

- security ;

- frontend ;

- backend ;

- database ;

- devops ;

- pwa ;

- priority-p0 ;

- priority-p1 ;

- priority-p2.

### 9.3 Bonnes pratiques

Une issue doit préciser :

- le problème ou besoin ;

- le comportement attendu ;

- les critères d'acceptation ;

- la priorité ;

- le responsable si connu.

## 10 Gestion des conflits Git

### 10.1 Principe

Les conflits doivent être résolus avec prudence.

Il ne faut jamais résoudre un conflit au hasard.

### 10.2 Étapes recommandées

1. Lire les deux versions en conflit.

2. Comprendre l'origine du conflit.

3. Garder les changements nécessaires.

4. Demander à l'autre développeur si doute.

5. Relancer les tests ou vérifications.

6. Committer la résolution.

### 10.3 Prévention des conflits

Pour limiter les conflits :

- faire des branches courtes ;

- pull régulièrement main ;

- éviter de modifier les mêmes gros fichiers en parallèle ;

- séparer les tâches front/back quand possible ;

- communiquer sur les fichiers sensibles.

## 11 Gestion des tags et versions

### 11.1 Objectif

Les tags permettent de marquer des versions importantes.

Exemples :

- v0.1.0-setup ;

- v0.2.0-auth ;

- v0.3.0-dashboard ;

- v0.4.0-teams-chat ;

- v1.0.0-mvp.

### 11.2 Quand créer un tag

Créer un tag :

- après une étape importante ;

- avant une soutenance ;

- après stabilisation du MVP ;

- avant une grosse modification risquée.

### 11.3 Commandes

Créer un tag :

git tag v1.0.0-mvp

git push origin v1.0.0-mvp

## 12 Stratégie de rollback

### 12.1 Objectif

Le rollback permet de revenir à une version stable si une modification casse le projet.

### 12.2 Rollback simple

Si le problème vient du code :

- revenir au commit précédent ;

- créer un fix ;

- utiliser un tag stable si disponible.

### 12.3 Règle importante

Éviter les modifications directes risquées sur main.

Les migrations de base de données doivent être testées avant fusion.

## 13 Règles de sécurité Git

### 13.1 Fichiers interdits dans le dépôt

Ne jamais commiter :

- .env ;

- .env.local ;

- vraies clés API ;

- JWT_SECRET ;

- DATABASE_URL réelle ;

- REDIS_URL avec mot de passe ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- refresh tokens ;

- fichiers credentials ;

- clés privées ;

- sauvegardes de base contenant des données réelles.

### 13.2 Fichiers autorisés

Autorisé :

- .env.example ;

- README.md ;

- fichiers de configuration sans secret ;

- documentation ;

- scripts de seed avec données fictives.

### 13.3 .gitignore recommandé

Le .gitignore doit contenir au minimum :

.env

.env.*

!.env.example

node_modules

dist

build

coverage

logs

*.log

.DS_Store

*.pem

*.key

credentials.json

service-account.json

### 13.4 En cas de secret commité

Procédure :

1. considérer le secret comme compromis ;

2. régénérer le secret ;

3. remplacer la valeur dans l'environnement ;

4. supprimer le secret du dépôt ;

5. nettoyer l'historique si nécessaire ;

6. vérifier les logs d'accès ;

7. documenter l'incident.

Important : supprimer le fichier ne suffit pas si le secret est déjà dans l'historique Git.

## 14 Gestion des fichiers générés

### 14.1 Fichiers à ne pas commiter

À éviter :

- node_modules ;

- dist ;

- build ;

- coverage ;

- logs ;

- fichiers temporaires ;

- exports locaux ;

- backups ;

- fichiers .env.

### 14.2 Fichiers à commiter

À commiter :

- code source ;

- package.json ;

- lockfile ;

- Dockerfile ;

- docker-compose.yml sans secret ;

- .env.example ;

- migrations ;

- documentation ;

- scripts utiles.

## 15 Synchronisation avec la documentation Drive

### 15.1 Principe

La documentation Drive sert de référence fonctionnelle, technique et projet.

Quand le code change une règle importante, la documentation doit être mise à jour.

### 15.2 Documents à mettre à jour selon le cas

Exemples :

- changement API : Endpoints-REST-API ;

- changement auth : Authentification-JWT ;

- changement permissions : Roles-permissions ;

- changement variable env : Variables-environnement ;

- changement Docker : Configuration-Docker ;

- changement sécurité : Politique-securite ;

- changement roadmap : Roadmap-MVP ou Backlog-priorise.

## 16 Workflow spécifique Track'N Share

### 16.1 Répartition recommandée

Ioanes :

- back-end NestJS ;

- auth ;

- base de données ;

- stats ;

- APIs externes ;

- leaderboards ;

- sécurité back-end.

Clément :

- front-end React ;

- PWA ;

- dashboard ;

- UI ;

- responsive ;

- intégration API côté front ;

- état global front.

### 16.2 Zones de collaboration

Zones à coordonner ensemble :

- contrat API ;

- DTO et types partagés ;

- format des erreurs ;

- Socket.io ;

- chat ;

- leaderboard ;

- mode démo ;

- soutenance.

## 17 Checklist avant commit

Avant chaque commit :

- vérifier le diff ;

- vérifier qu'aucun secret n'est présent ;

- vérifier que le code compile ;

- vérifier qu'il n'y a pas de console.log inutile ;

- vérifier le nommage des fichiers ;

- vérifier que la modification correspond bien au message de commit ;

- vérifier qu'aucun fichier généré inutile n'est inclus.

## 18 Checklist avant pull request

Avant d'ouvrir une PR :

- branche à jour avec main ;

- lint passé si disponible ;

- build passé si disponible ;

- tests passés si disponibles ;

- fonctionnalité testée manuellement ;

- description PR remplie ;

- captures ajoutées si changement UI ;

- documentation mise à jour si nécessaire ;

- aucune variable secrète ajoutée.

## 19 Checklist avant merge

Avant merge :

- PR relue ;

- commentaires traités ;

- CI verte si disponible ;

- conflits résolus ;

- tests ou vérifications faits ;

- tâche GitHub Project déplacée ;

- pas de secret ;

- main reste stable.

## 20 Priorités MVP

Pour le MVP, les règles les plus importantes sont :

- ne jamais coder directement sur main ;

- créer une branche par tâche ;

- commits clairs ;

- PR courtes ;

- revue par l'autre membre ;

- aucun secret dans Git ;

- lien avec le Kanban ;

- main toujours présentable.

## 21 Risques et solutions

### 21.1 Risque : main cassée

Impact : projet instable, soutenance compromise.

Solution : PR obligatoire, CI, tests manuels avant merge.

### 21.2 Risque : conflits fréquents

Impact : perte de temps et risque d'écraser du code.

Solution : branches courtes, communication, pull régulier.

### 21.3 Risque : historique illisible

Impact : difficile de comprendre les changements.

Solution : commits clairs et branches bien nommées.

### 21.4 Risque : secret commité

Impact : compromission sécurité.

Solution : .gitignore, revue du diff, rotation immédiate.

### 21.5 Risque : PR trop grosses

Impact : revue difficile.

Solution : découper par fonctionnalité ou sous-tâche.

### 21.6 Risque : documentation désynchronisée

Impact : docs fausses ou obsolètes.

Solution : mettre à jour la doc Drive quand une règle change.

## 22 Critères d'acceptation

Les conventions Git sont considérées respectées si :

- main reste stable ;

- le travail se fait en branches ;

- les branches sont nommées clairement ;

- les commits suivent le format recommandé ;

- les PR sont relues ;

- les tâches sont suivies dans GitHub Project ;

- les conflits sont résolus proprement ;

- les tags marquent les versions importantes ;

- aucun secret n'est commité ;

- la documentation est mise à jour quand le code évolue ;

- le projet peut être présenté à partir de main.

## 23 Conclusion

Les conventions Git de Track'N Share doivent permettre à Ioanes et Clément de travailler efficacement sans casser le projet.

Même si l'équipe est petite, des règles simples évitent beaucoup de problèmes : branches courtes, commits clairs, pull requests relues, main stable, aucune fuite de secret et documentation synchronisée.

Le but n'est pas d'ajouter de la lourdeur, mais de garantir que le projet reste propre, compréhensible et prêt pour la soutenance.
