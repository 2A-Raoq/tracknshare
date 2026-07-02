# RECETTE SOUTENANCE

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit la recette finale à réaliser avant la soutenance du projet Track'N Share.

La recette soutenance correspond à la vérification complète du projet dans les conditions les plus proches possibles de la présentation finale. Elle doit permettre de confirmer que l'application se lance, que le mode démo fonctionne, que le parcours principal est fluide, que les fonctionnalités MVP sont visibles et que les risques bloquants sont maîtrisés.

Ce document doit être utilisé comme checklist finale quelques jours avant la soutenance, puis une dernière fois le jour même.

## 1 Objectifs de la recette soutenance

La recette soutenance doit vérifier que :

- le projet peut être lancé rapidement ;

- Docker fonctionne ;

- PostgreSQL et Redis sont disponibles ;

- les migrations sont exécutées ;

- les données de démonstration sont présentes ;

- le compte démo fonctionne ;

- le dashboard est consultable ;

- les statistiques sont cohérentes ;

- le leaderboard est visible ;

- les équipes sont disponibles ;

- le chat fonctionne ;

- les routes privées sont protégées ;

- le mode mock fonctionne sans Steam/Epic ;

- Swagger est accessible si besoin ;

- aucun secret n'est exposé ;

- un plan de secours existe en cas de problème.

## 2 Périmètre de la recette

### 2.1 Inclus dans la recette

La recette couvre :

- lancement local ;

- configuration Docker ;

- variables d'environnement ;

- base PostgreSQL ;

- Redis ;

- back-end NestJS ;

- front-end React/PWA ;

- authentification ;

- dashboard ;

- statistiques mockées ;

- leaderboards ;

- équipes ;

- invitations ;

- chat ;

- sécurité minimale ;

- Swagger ;

- documentation utile ;

- scénario de présentation.

### 2.2 Hors périmètre de la recette

La recette soutenance ne vise pas à valider entièrement :

- une production réelle ;

- une montée en charge ;

- un audit de sécurité complet ;

- toutes les intégrations Steam/Epic en conditions réelles ;

- tous les navigateurs possibles ;

- toutes les fonctionnalités futures P1/P2.

## 3 Conditions de réussite

La recette est considérée réussie si :

- tous les tests bloquants P0 passent ;

- aucun bug critique n'empêche la présentation ;

- les bugs connus sont contournables ;

- le mode démo est stable ;

- le parcours principal est réalisable de bout en bout ;

- la documentation permet d'expliquer les choix techniques ;

- l'équipe connaît le plan de secours.

## 4 Préparation avant recette

### 4.1 Matériel nécessaire

À prévoir :

- ordinateur de présentation ;

- chargeur ;

- navigateur récent ;

- Docker installé ;

- accès au repository GitHub ;

- accès au Drive de documentation ;

- connexion Internet si nécessaire ;

- copie locale du projet ;

- captures d'écran de secours ;

- éventuel export PDF de documents importants.

### 4.2 Logiciels nécessaires

À vérifier :

- Git ;

- Docker ;

- Docker Compose ;

- Node.js si lancement hors Docker ;

- navigateur Chrome, Edge ou Firefox ;

- éditeur de code si démonstration technique ;

- terminal fonctionnel.

### 4.3 Documents utiles à avoir ouverts

Documents recommandés :

- Cahier des charges ;

- Specifications-fonctionnelles ;

- Stack-technique-detaillee ;

- Choix-technologiques ;

- Endpoints-REST-API ;

- Documentation-Socket-io ;

- Authentification-JWT ;

- Roles-permissions ;

- Configuration-Docker ;

- Procedure-deploiement ;

- Variables-environnement ;

- Monitoring-logs ;

- Tests-API ;

- Tests-securite.

## 5 Configuration recommandée pour la soutenance

### 5.1 Variables d'environnement

Configuration recommandée :

NODE_ENV=development

DEMO_MODE=true

DEMO_SEED_ENABLED=true

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

SWAGGER_ENABLED=true

LOG_LEVEL=info

RATE_LIMIT_ENABLED=true

### 5.2 Objectif de cette configuration

Cette configuration permet :

- de ne pas dépendre de Steam ;

- de ne pas dépendre d'Epic ;

- d'avoir des données stables ;

- d'utiliser le MockProvider ;

- de présenter l'application même sans API externe ;

- de sécuriser le déroulement de la soutenance.

### 5.3 Points de vigilance

À vérifier :

- .env présent ;

- .env non commité ;

- .env.example cohérent ;

- aucune vraie clé dans le front ;

- aucune vraie clé dans Swagger ;

- compte démo non admin ;

- seed démo activé uniquement pour l'environnement de présentation.

## 6 Préparation des données de démonstration

### 6.1 Données minimales attendues

La base de démonstration doit contenir :

- un compte démo principal ;

- plusieurs joueurs fictifs ;

- au moins un jeu ;

- des statistiques variées ;

- une saison active ;

- un leaderboard rempli ;

- une équipe liée au compte démo ;

- plusieurs membres d'équipe ;

- des messages de chat ;

- éventuellement des notifications.

### 6.2 Compte démo recommandé

Compte démo :

- email : demo@tracknshare.local ;

- mot de passe : Demo1234! ;

- rôle : PLAYER ;

- profil complet ;

- équipe existante ;

- statistiques disponibles ;

- accès au chat.

### 6.3 Règles de sécurité des données démo

Les données doivent être :

- fictives ;

- non personnelles ;

- reproductibles ;

- cohérentes ;

- adaptées à la démonstration.

Interdit :

- vrais emails ;

- vrais tokens ;

- vraies clés Steam/Epic ;

- vraies identités ;

- données personnelles réelles.

## 7 Checklist lancement technique

### 7.1 Récupération du projet

À vérifier :

- repository à jour ;

- branche stable utilisée ;

- pas de conflit Git ;

- README disponible ;

- fichiers Docker présents.

Commandes indicatives :

git checkout main

git pull origin main

### 7.2 Vérification du fichier .env

À vérifier :

- .env présent ;

- variables obligatoires renseignées ;

- DATABASE_URL correcte ;

- REDIS_URL correcte ;

- JWT_SECRET présent ;

- MockProvider activé ;

- Steam/Epic désactivés.

### 7.3 Lancement Docker

Commande indicative :

docker compose up -d --build

Résultat attendu :

- frontend running ;

- backend running ;

- postgres running ;

- redis running ;

- aucun conteneur en restart loop.

### 7.4 Vérification des conteneurs

Commande indicative :

docker compose ps

Résultat attendu :

- tous les services nécessaires sont démarrés ;

- PostgreSQL est healthy si healthcheck configuré ;

- backend disponible ;

- frontend disponible.

### 7.5 Vérification des logs

Commandes utiles :

docker compose logs -f backend

docker compose logs -f frontend

docker compose logs -f postgres

docker compose logs -f redis

À vérifier :

- pas d'erreur critique ;

- connexion PostgreSQL réussie ;

- connexion Redis réussie ;

- MockProvider activé ;

- pas de secret affiché dans les logs.

## 8 Checklist migrations et seed

### 8.1 Migrations

Commande indicative :

docker compose exec backend npm run migration:run

ou selon ORM :

docker compose exec backend npx prisma migrate deploy

Résultat attendu :

- migrations exécutées ;

- aucune erreur de schéma ;

- base prête.

### 8.2 Seed démo

Commande indicative :

docker compose exec backend npm run seed:demo

ou :

docker compose exec backend npx prisma db seed

Résultat attendu :

- compte démo créé ;

- joueurs fictifs créés ;

- stats créées ;

- leaderboard rempli ;

- équipe créée ;

- messages de chat créés.

### 8.3 Vérification du seed

À vérifier via front ou API :

- login compte démo ;

- dashboard rempli ;

- leaderboard visible ;

- équipe présente ;

- chat contient des messages.

## 9 Checklist API et healthchecks

### 9.1 Healthcheck API

Endpoint :

GET /api/health

Résultat attendu :

- statut 200 ;

- API ok ;

- pas d'information sensible.

### 9.2 Healthcheck database

Endpoint :

GET /api/health/database

Résultat attendu :

- database ok ;

- aucune DATABASE_URL exposée.

### 9.3 Healthcheck Redis

Endpoint :

GET /api/health/redis

Résultat attendu :

- redis ok ;

- aucun mot de passe exposé.

### 9.4 Swagger

URL recommandée :

http://localhost:3000/api/docs

À vérifier :

- Swagger accessible ;

- endpoints principaux visibles ;

- authentification Bearer documentée ;

- aucun secret réel dans les exemples.

## 10 Checklist front-end

### 10.1 Accès application

URL recommandée :

http://localhost:5173

À vérifier :

- landing page affichée ;

- pas d'erreur critique console ;

- boutons connexion/inscription visibles ;

- navigation fonctionnelle.

### 10.2 Responsive minimum

À vérifier rapidement :

- affichage desktop ;

- largeur mobile dans DevTools ;

- pas de débordement majeur ;

- boutons utilisables ;

- chat lisible.

### 10.3 États principaux

À vérifier :

- loading ;

- error ;

- empty state ;

- accès refusé ;

- session expirée si testable.

## 11 Recette authentification

### 11.1 Connexion compte démo

Étapes :

1. Ouvrir la page login.

2. Saisir les identifiants du compte démo.

3. Valider.

Résultat attendu :

- connexion réussie ;

- redirection dashboard ;

- utilisateur visible comme connecté.

### 11.2 Mauvais identifiants

Étapes :

1. Saisir mauvais mot de passe.

2. Valider.

Résultat attendu :

- connexion refusée ;

- message clair ;

- pas d'information excessive.

### 11.3 Déconnexion

Étapes :

1. Cliquer sur logout.

2. Revenir en arrière navigateur.

Résultat attendu :

- données privées non visibles ;

- retour à login ou accueil ;

- dashboard protégé.

## 12 Recette dashboard et statistiques

### 12.1 Dashboard

À vérifier :

- dashboard chargé ;

- pseudo ou profil affiché ;

- statistiques visibles ;

- score visible ;

- saison active affichée si prévue ;

- dernière synchronisation affichée si prévue.

### 12.2 Statistiques

À vérifier :

- kills ;

- deaths ;

- K/D ;

- wins ;

- losses ;

- winrate ;

- matchesPlayed ;

- score.

### 12.3 Synchronisation mock

Étapes :

1. Cliquer sur synchroniser.

2. Attendre la réponse.

3. Vérifier les valeurs.

Résultat attendu :

- synchronisation réussie ;

- MockProvider utilisé ;

- aucun appel Steam/Epic obligatoire ;

- erreur contrôlée si sync indisponible.

## 13 Recette leaderboards

### 13.1 Leaderboard solo

À vérifier :

- page leaderboard accessible ;

- joueurs affichés ;

- scores affichés ;

- rangs affichés ;

- tri décroissant par score ;

- compte démo visible ou état non classé clair.

### 13.2 Éligibilité

À vérifier si règle implémentée :

- joueur avec assez de parties classé ;

- joueur avec trop peu de parties non éligible ;

- message explicatif si non classé.

### 13.3 État vide

À vérifier si possible :

- aucun crash si leaderboard vide ;

- message d'état vide propre.

## 14 Recette équipes

### 14.1 Accès équipe du compte démo

À vérifier :

- équipe visible ;

- nom équipe visible ;

- tag équipe visible ;

- membres affichés ;

- rôle du compte démo affiché ou exploitable.

### 14.2 Création équipe si testable

Étapes :

1. Créer une équipe avec nom et tag valides.

2. Vérifier la page équipe.

Résultat attendu :

- équipe créée ;

- créateur capitaine ;

- données affichées.

### 14.3 Rejoindre équipe si testable

Étapes :

1. Utiliser un second compte.

2. Saisir un code invitation valide.

3. Rejoindre l'équipe.

Résultat attendu :

- utilisateur ajouté comme membre ;

- accès chat autorisé.

## 15 Recette chat d'équipe

### 15.1 Lire le chat

À vérifier :

- messages existants visibles ;

- auteur visible ;

- date visible ;

- contenu lisible ;

- scroll ou historique utilisable.

### 15.2 Envoyer un message

Étapes :

1. Saisir un message simple.

2. Envoyer.

3. Observer le chat.

Résultat attendu :

- message affiché ;

- message sauvegardé ;

- réception temps réel si plusieurs comptes connectés ;

- pas d'erreur console.

### 15.3 Message invalide

Cas à tester :

- message vide ;

- message trop long si limite définie.

Résultat attendu :

- message refusé ;

- aucun broadcast ;

- message utilisateur clair.

## 16 Recette sécurité minimale

### 16.1 Page privée sans connexion

Étapes :

1. Se déconnecter.

2. Accéder au dashboard par URL.

Résultat attendu :

- accès refusé ;

- redirection login ;

- aucune donnée privée.

### 16.2 Chat non-membre

Étapes :

1. Utiliser un compte non membre.

2. Tenter d'accéder au chat d'une équipe.

Résultat attendu :

- accès refusé ;

- aucun message visible ;

- API ou socket retourne une erreur contrôlée.

### 16.3 Action capitaine par membre simple

Si fonctionnalité disponible :

- tenter régénération code invitation ;

- tenter suppression équipe ;

- tenter exclusion membre.

Résultat attendu :

- action refusée ;

- statut 403 ;

- aucune modification.

### 16.4 Vérification secrets

À vérifier :

- aucun passwordHash dans les réponses ;

- aucun JWT dans les logs ;

- aucune clé Steam/Epic dans le front ;

- aucune DATABASE_URL dans Swagger ;

- .env non visible dans le dépôt.

## 17 Recette PWA et navigation

### 17.1 Refresh page privée

Étapes :

1. Être connecté sur dashboard.

2. Rafraîchir la page.

Résultat attendu :

- page toujours utilisable si session valide ;

- redirection login si session invalide.

### 17.2 Retour navigateur après logout

Étapes :

1. Se connecter.

2. Aller sur dashboard.

3. Se déconnecter.

4. Cliquer retour navigateur.

Résultat attendu :

- données privées non visibles ;

- route protégée.

### 17.3 Installation PWA si activée

À vérifier si fonctionnalité prête :

- application installable ;

- icône correcte ;

- nom correct ;

- pas de cache dangereux.

## 18 Scénario de présentation recommandé

### 18.1 Scénario principal

Ordre conseillé pendant la soutenance :

1. Présenter rapidement le concept Track'N Share.

2. Montrer la landing page.

3. Se connecter avec le compte démo.

4. Montrer le dashboard joueur.

5. Expliquer les statistiques et le score.

6. Montrer le leaderboard solo.

7. Montrer l'équipe du joueur.

8. Montrer les membres.

9. Montrer le chat d'équipe.

10. Envoyer un message.

11. Montrer Swagger rapidement si demandé.

12. Expliquer le MockProvider et le mode démo.

13. Expliquer que Steam/Epic sont prévus comme intégrations documentées.

14. Montrer brièvement la documentation Drive si utile.

### 18.2 Points à expliquer oralement

À préparer :

- pourquoi un MockProvider est utilisé pour le MVP ;

- pourquoi Steam/Epic ne sont pas obligatoires pour la démo ;

- comment le score est calculé ;

- comment les permissions d'équipe sont protégées ;

- comment le chat est sécurisé ;

- comment Docker simplifie le lancement ;

- comment la documentation structure le projet.

## 19 Plan de secours soutenance

### 19.1 Si Docker ne démarre pas

Actions :

- vérifier Docker Desktop ;

- vérifier ports occupés ;

- relancer docker compose down puis up ;

- consulter logs ;

- lancer seulement les services essentiels ;

- utiliser captures d'écran ou vidéo de secours si nécessaire.

Commandes utiles :

docker compose down

docker compose up -d --build

docker compose logs -f backend

### 19.2 Si la base est vide

Actions :

- relancer migrations ;

- relancer seed démo ;

- vérifier .env ;

- vérifier DEMO_SEED_ENABLED=true.

### 19.3 Si le login ne fonctionne pas

Actions :

- vérifier compte démo ;

- relancer seed ;

- vérifier logs backend ;

- vérifier JWT_SECRET ;

- vérifier payload envoyé.

### 19.4 Si le front ne charge pas les données

Actions :

- vérifier VITE_API_BASE_URL ;

- vérifier CORS ;

- vérifier backend ;

- vérifier token ;

- ouvrir DevTools Network.

### 19.5 Si le chat ne fonctionne pas

Actions :

- vérifier VITE_SOCKET_URL ;

- vérifier token ;

- vérifier appartenance équipe ;

- vérifier logs Socket.io ;

- présenter le chat via données déjà seedées si temps réel indisponible.

### 19.6 Si Steam/Epic sont indisponibles

Réponse :

- le MVP utilise MockProvider ;

- les intégrations Steam/Epic sont documentées ;

- la démo ne dépend pas de ces APIs ;

- le plan secours APIs est prévu.

## 20 Captures et sauvegardes de secours

### 20.1 Captures recommandées

Préparer des captures de :

- landing page ;

- login ;

- dashboard ;

- statistiques ;

- leaderboard ;

- équipe ;

- chat ;

- Swagger ;

- architecture Docker ;

- diagrammes UML.

### 20.2 Vidéo courte optionnelle

Il peut être utile d'avoir une courte vidéo locale du parcours :

- login ;

- dashboard ;

- leaderboard ;

- chat.

Cette vidéo sert uniquement de secours si l'environnement ne démarre pas.

## 21 Checklist finale avant soutenance

### 21.1 Checklist technique

- Repository à jour.

- Branche stable utilisée.

- Docker installé.

- Docker Compose fonctionnel.

- .env présent.

- PostgreSQL démarre.

- Redis démarre.

- Backend démarre.

- Frontend démarre.

- Migrations OK.

- Seed démo OK.

- Healthcheck API OK.

- Swagger accessible.

### 21.2 Checklist fonctionnelle

- Landing page OK.

- Login compte démo OK.

- Logout OK.

- Dashboard OK.

- Stats OK.

- Score OK.

- Leaderboard OK.

- Équipe OK.

- Chat OK.

- Message chat OK.

- Pages privées protégées.

- Non-membre refusé.

### 21.3 Checklist sécurité

- Aucun passwordHash visible.

- Aucun secret dans Swagger.

- Aucun secret dans le front.

- Aucun secret dans logs.

- Compte démo non admin.

- Données démo fictives.

- Routes privées protégées.

- Chat réservé aux membres.

- Mode mock activé.

### 21.4 Checklist présentation

- Ordre de présentation prêt.

- Identifiants démo disponibles hors écran public si nécessaire.

- Documents importants ouverts.

- Captures de secours prêtes.

- Plan B connu.

- Chargeur disponible.

- Navigateur prêt.

- Terminal prêt.

## 22 Critères de validation finale

La recette soutenance est validée si :

- le projet se lance en moins de quelques minutes ;

- le compte démo permet d'accéder à l'application ;

- le dashboard est rempli ;

- les statistiques sont cohérentes ;

- le leaderboard est présentable ;

- l'équipe et le chat sont présentables ;

- les erreurs critiques sont absentes ;

- le mode mock fonctionne ;

- les documents techniques soutiennent les choix du projet ;

- l'équipe peut expliquer les limites et évolutions futures.

## 23 Gestion des anomalies avant soutenance

### 23.1 Bloquant

Exemples :

- Docker ne démarre pas ;

- login impossible ;

- dashboard inaccessible ;

- données démo absentes ;

- chat totalement inutilisable ;

- faille critique visible.

Action : correction obligatoire avant présentation.

### 23.2 Majeur

Exemples :

- bug visible mais contournable ;

- responsive imparfait ;

- message d'erreur peu clair ;

- filtre non fonctionnel.

Action : correction si possible ou contournement préparé.

### 23.3 Mineur

Exemples :

- faute de texte ;

- espacement UI ;

- petit détail visuel.

Action : correction si temps disponible.

## 24 Conclusion

La recette soutenance est la dernière étape de validation du MVP Track'N Share avant présentation.

Elle doit confirmer que l'application est stable, démontrable et cohérente avec la documentation produite.

Le point central est le mode démo : l'application doit pouvoir être présentée avec des données seedées et un MockProvider fiable, sans dépendre d'APIs externes comme Steam ou Epic.

En suivant cette checklist, Ioanes et Clément pourront aborder la soutenance avec un parcours clair, des vérifications précises et un plan de secours en cas de problème technique.
