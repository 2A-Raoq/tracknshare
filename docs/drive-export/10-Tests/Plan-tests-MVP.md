# PLAN DE TESTS MVP

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit le plan de tests à appliquer pour valider le MVP de Track'N Share.

Contrairement à la stratégie de tests, qui décrit l'approche générale, ce plan liste concrètement les tests à réaliser avant la soutenance. Il permet de vérifier que les fonctionnalités prioritaires fonctionnent, que le mode démo est stable et que les risques les plus importants sont maîtrisés.

Le plan de tests MVP est volontairement pragmatique : il se concentre sur les fonctionnalités qui doivent absolument fonctionner pour présenter le projet correctement.

## 1 Périmètre du MVP à tester

### 1.1 Fonctionnalités MVP principales

Les fonctionnalités MVP à tester sont :

- lancement du projet avec Docker ;

- configuration des variables d'environnement ;

- base PostgreSQL disponible ;

- Redis disponible ;

- migrations exécutées ;

- données de démonstration seedées ;

- inscription utilisateur ;

- connexion utilisateur ;

- déconnexion utilisateur ;

- dashboard joueur ;

- statistiques mockées ;

- calcul du score ;

- leaderboard solo ;

- équipes ;

- invitations ou code d'équipe ;

- chat d'équipe ;

- permissions d'accès ;

- Swagger ;

- healthchecks ;

- mode démo sans dépendance Steam/Epic.

### 1.2 Fonctionnalités à tester si développées

Fonctionnalités secondaires à tester uniquement si elles sont implémentées :

- upload avatar ;

- notifications ;

- archivage trimestriel automatique ;

- leaderboard équipe ;

- profil public ;

- paramètres utilisateur ;

- suppression ou anonymisation de compte ;

- PWA installable ;

- intégration Steam réelle ;

- intégration Epic/EOS.

### 1.3 Hors périmètre MVP

Ne sont pas obligatoires pour valider le MVP :

- tests de charge avancés ;

- E2E automatisés complets ;

- pentest complet ;

- monitoring production avancé ;

- déploiement production réel ;

- intégration complète de toutes les APIs gaming possibles.

## 2 Objectifs de validation

Le MVP est considéré prêt si :

- l'application se lance localement ;

- un compte démo permet de se connecter ;

- le dashboard affiche des statistiques ;

- le score joueur est cohérent ;

- le leaderboard est consultable ;

- une équipe peut être affichée ou créée ;

- le chat d'équipe fonctionne ;

- les non-membres ne peuvent pas accéder au chat ;

- les routes privées sont protégées ;

- le mode mock fonctionne sans Steam/Epic ;

- Docker permet de présenter le projet ;

- aucun secret n'est exposé ;

- les erreurs bloquantes sont absentes.

## 3 Environnement de test MVP

### 3.1 Environnement recommandé

L'environnement recommandé pour les tests MVP est :

- Docker Compose ;

- frontend React/PWA ;

- backend NestJS ;

- PostgreSQL local ;

- Redis local ;

- MockProvider ;

- données seedées ;

- Swagger activé ;

- mode démo activé.

### 3.2 Configuration recommandée

Variables recommandées :

NODE_ENV=development

DEMO_MODE=true

DEMO_SEED_ENABLED=true

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

SWAGGER_ENABLED=true

LOG_LEVEL=info

### 3.3 Données nécessaires

Données minimales nécessaires :

- un compte démo ;

- plusieurs joueurs fictifs ;

- au moins un jeu ;

- statistiques mockées ;

- une saison active ;

- un leaderboard rempli ;

- au moins une équipe ;

- plusieurs messages de chat ;

- données cohérentes pour la démonstration.

## 4 Niveaux de priorité

### 4.1 P0 — Bloquant MVP

Un test P0 doit obligatoirement passer avant soutenance.

Exemples :

- login ;

- dashboard ;

- Docker ;

- stats mockées ;

- leaderboard ;

- chat ;

- permissions ;

- mode démo.

### 4.2 P1 — Important

Un test P1 est important mais peut être contourné si le MVP reste présentable.

Exemples :

- PWA offline ;

- notifications ;

- upload avatar ;

- archivage saison ;

- tests responsive détaillés.

### 4.3 P2 — Amélioration

Un test P2 concerne une évolution après MVP.

Exemples :

- tests E2E automatisés ;

- tests de charge ;

- tests multi-navigateurs avancés ;

- intégrations externes réelles complètes.

## 5 Plan de tests Docker et lancement

### 5.1 Test MVP-DOC-001 — Lancement Docker

Priorité : P0

Objectif : vérifier que le projet démarre avec Docker Compose.

Préconditions :

- Docker installé ;

- fichier .env présent ;

- ports disponibles ;

- docker-compose.yml présent.

Étapes :

1. Lancer docker compose up --build.

2. Vérifier que les conteneurs démarrent.

3. Vérifier les logs.

4. Ouvrir le front-end.

5. Ouvrir l'API ou Swagger.

Résultat attendu :

- frontend démarré ;

- backend démarré ;

- PostgreSQL démarré ;

- Redis démarré ;

- aucune boucle de redémarrage.

### 5.2 Test MVP-DOC-002 — Connexion PostgreSQL

Priorité : P0

Objectif : vérifier que le back-end se connecte à PostgreSQL.

Étapes :

1. Lancer Docker.

2. Consulter les logs backend.

3. Appeler GET /api/health/database si disponible.

Résultat attendu :

- connexion PostgreSQL réussie ;

- aucun message d'erreur critique ;

- healthcheck database ok.

### 5.3 Test MVP-DOC-003 — Connexion Redis

Priorité : P0

Objectif : vérifier que Redis est accessible par le back-end.

Étapes :

1. Lancer Docker.

2. Consulter les logs backend.

3. Appeler GET /api/health/redis si disponible.

Résultat attendu :

- Redis répond ;

- healthcheck Redis ok ;

- pas d'erreur bloquante.

### 5.4 Test MVP-DOC-004 — Migrations

Priorité : P0

Objectif : vérifier que la structure de base est créée correctement.

Étapes :

1. Lancer la commande de migration.

2. Vérifier les logs.

3. Redémarrer le back-end.

Résultat attendu :

- migrations passées ;

- tables créées ;

- aucune erreur de schéma.

### 5.5 Test MVP-DOC-005 — Seed démo

Priorité : P0

Objectif : vérifier que les données de démonstration sont disponibles.

Étapes :

1. Lancer le seed démo.

2. Vérifier les logs.

3. Se connecter avec le compte démo.

Résultat attendu :

- compte démo créé ;

- statistiques présentes ;

- leaderboard rempli ;

- équipe et messages disponibles.

## 6 Plan de tests authentification

### 6.1 Test MVP-AUTH-001 — Inscription valide

Priorité : P0

Objectif : vérifier qu'un utilisateur peut créer un compte.

Étapes :

1. Ouvrir la page d'inscription.

2. Saisir un email valide.

3. Saisir un pseudo valide.

4. Saisir un mot de passe valide.

5. Valider le formulaire.

Résultat attendu :

- compte créé ;

- message de succès ou redirection ;

- mot de passe hashé côté back-end ;

- aucun passwordHash retourné au front.

### 6.2 Test MVP-AUTH-002 — Inscription invalide

Priorité : P0

Objectif : vérifier la validation du formulaire d'inscription.

Cas à tester :

- email invalide ;

- mot de passe trop court ;

- pseudo trop court ;

- email déjà utilisé ;

- champs vides.

Résultat attendu :

- erreur claire ;

- compte non créé ;

- API retourne un code cohérent.

### 6.3 Test MVP-AUTH-003 — Connexion valide

Priorité : P0

Objectif : vérifier qu'un utilisateur peut se connecter.

Étapes :

1. Ouvrir la page login.

2. Saisir email et mot de passe valides.

3. Valider.

Résultat attendu :

- login réussi ;

- token ou session créée ;

- redirection dashboard ;

- utilisateur affiché comme connecté.

### 6.4 Test MVP-AUTH-004 — Connexion invalide

Priorité : P0

Objectif : vérifier qu'un login incorrect est refusé.

Cas à tester :

- mauvais mot de passe ;

- email inconnu ;

- champs vides.

Résultat attendu :

- accès refusé ;

- message générique ;

- pas d'information indiquant précisément si l'email existe.

### 6.5 Test MVP-AUTH-005 — Déconnexion

Priorité : P0

Objectif : vérifier que l'utilisateur peut se déconnecter proprement.

Étapes :

1. Se connecter.

2. Cliquer sur déconnexion.

3. Vérifier l'état de l'application.

Résultat attendu :

- session supprimée côté front ;

- données privées nettoyées ;

- redirection login ou accueil ;

- dashboard inaccessible après logout.

### 6.6 Test MVP-AUTH-006 — Route privée sans token

Priorité : P0

Objectif : vérifier la protection des routes privées.

Étapes :

1. Appeler GET /api/users/me sans token.

2. Appeler une page privée sans être connecté.

Résultat attendu :

- API retourne 401 ;

- front redirige vers login ou affiche accès refusé.

## 7 Plan de tests profil utilisateur

### 7.1 Test MVP-PROF-001 — Consultation profil connecté

Priorité : P0

Objectif : vérifier qu'un utilisateur connecté voit son profil.

Résultat attendu :

- pseudo affiché ;

- avatar ou placeholder ;

- informations cohérentes ;

- email non exposé publiquement.

### 7.2 Test MVP-PROF-002 — Modification profil

Priorité : P1

Objectif : vérifier qu'un utilisateur peut modifier ses informations autorisées.

Cas à tester :

- modification pseudo si autorisée ;

- modification bio ;

- modification avatar si disponible.

Résultat attendu :

- données mises à jour ;

- validation appliquée ;

- champs interdits ignorés ou refusés.

## 8 Plan de tests dashboard et statistiques

### 8.1 Test MVP-STATS-001 — Affichage dashboard

Priorité : P0

Objectif : vérifier que le dashboard joueur s'affiche.

Préconditions :

- utilisateur connecté ;

- données mockées disponibles.

Résultat attendu :

- dashboard visible ;

- stats principales affichées ;

- score affiché ;

- saison active affichée ;

- état de chargement géré.

### 8.2 Test MVP-STATS-002 — Stats mockées

Priorité : P0

Objectif : vérifier que le MockProvider fournit des données utilisables.

Résultat attendu :

- kills, deaths, wins, losses, matchesPlayed disponibles ;

- valeurs cohérentes ;

- pas de dépendance à Steam/Epic.

### 8.3 Test MVP-STATS-003 — Calcul K/D

Priorité : P0

Objectif : vérifier le calcul du ratio K/D.

Cas à tester :

- kills = 100, deaths = 50 ;

- deaths = 0 ;

- kills = 0.

Résultat attendu :

- ratio correct ;

- division par zéro gérée ;

- affichage cohérent.

### 8.4 Test MVP-STATS-004 — Calcul winrate

Priorité : P0

Objectif : vérifier le calcul du taux de victoire.

Cas à tester :

- wins = 10, losses = 10 ;

- wins = 0 ;

- matchesPlayed = 0.

Résultat attendu :

- winrate correct ;

- cas zéro géré ;

- affichage cohérent.

### 8.5 Test MVP-STATS-005 — Calcul score

Priorité : P0

Objectif : vérifier que le score est calculé côté back-end selon les règles métier.

Résultat attendu :

- score numérique ;

- score stable ;

- score non modifiable côté front ;

- formule centralisée.

### 8.6 Test MVP-STATS-006 — Synchronisation stats mock

Priorité : P0

Objectif : vérifier que l'utilisateur peut déclencher une synchronisation en mode mock.

Résultat attendu :

- sync réussie ;

- lastSyncAt mis à jour ;

- dashboard rafraîchi ;

- pas d'appel Steam/Epic obligatoire.

## 9 Plan de tests leaderboards

### 9.1 Test MVP-LB-001 — Affichage leaderboard solo

Priorité : P0

Objectif : vérifier que le leaderboard solo s'affiche.

Résultat attendu :

- liste de joueurs visible ;

- score visible ;

- rang visible ;

- tri décroissant par score.

### 9.2 Test MVP-LB-002 — Éligibilité leaderboard

Priorité : P0

Objectif : vérifier qu'un joueur non éligible n'apparaît pas ou est indiqué comme non classé.

Cas à tester :

- joueur avec assez de parties ;

- joueur avec moins que le minimum requis.

Résultat attendu :

- règle appliquée ;

- affichage cohérent.

### 9.3 Test MVP-LB-003 — Pagination leaderboard

Priorité : P1

Objectif : vérifier que le leaderboard ne charge pas trop de données d'un coup.

Résultat attendu :

- page et limit fonctionnent ;

- réponse paginée ;

- front affiche la pagination ou charge progressivement.

### 9.4 Test MVP-LB-004 — Leaderboard vide

Priorité : P1

Objectif : vérifier l'état vide.

Résultat attendu :

- message clair ;

- pas d'erreur front ;

- bouton ou indication utile si nécessaire.

## 10 Plan de tests équipes

### 10.1 Test MVP-TEAM-001 — Création équipe

Priorité : P0

Objectif : vérifier qu'un utilisateur connecté peut créer une équipe.

Résultat attendu :

- équipe créée ;

- créateur ajouté comme capitaine ;

- nom et tag validés ;

- équipe visible dans le profil ou espace équipe.

### 10.2 Test MVP-TEAM-002 — Validation création équipe

Priorité : P0

Cas à tester :

- nom trop court ;

- nom trop long ;

- tag invalide ;

- utilisateur non connecté.

Résultat attendu :

- erreurs claires ;

- équipe non créée si données invalides.

### 10.3 Test MVP-TEAM-003 — Rejoindre une équipe

Priorité : P0

Objectif : vérifier qu'un utilisateur peut rejoindre une équipe avec un code valide.

Résultat attendu :

- utilisateur ajouté comme membre ;

- équipe visible ;

- accès au chat autorisé.

### 10.4 Test MVP-TEAM-004 — Code invitation invalide

Priorité : P0

Objectif : vérifier qu'un code invalide est refusé.

Résultat attendu :

- erreur claire ;

- utilisateur non ajouté ;

- tentative éventuellement rate limitée.

### 10.5 Test MVP-TEAM-005 — Permissions capitaine

Priorité : P0

Objectif : vérifier que les actions réservées au capitaine ne sont pas accessibles aux membres simples.

Résultat attendu :

- capitaine autorisé ;

- membre simple refusé ;

- API retourne 403 si nécessaire.

## 11 Plan de tests chat d'équipe

### 11.1 Test MVP-CHAT-001 — Accès chat par membre

Priorité : P0

Objectif : vérifier qu'un membre peut lire le chat de son équipe.

Résultat attendu :

- messages affichés ;

- historique visible ;

- room Socket.io rejointe.

### 11.2 Test MVP-CHAT-002 — Accès chat par non-membre

Priorité : P0

Objectif : vérifier qu'un non-membre ne peut pas accéder au chat.

Résultat attendu :

- accès refusé ;

- API retourne 403 ;

- socket ne rejoint pas la room.

### 11.3 Test MVP-CHAT-003 — Envoi message par membre

Priorité : P0

Objectif : vérifier qu'un membre peut envoyer un message.

Résultat attendu :

- message sauvegardé ;

- message affiché ;

- autres membres reçoivent le message ;

- senderId vient du token, pas du payload client.

### 11.4 Test MVP-CHAT-004 — Message invalide

Priorité : P0

Cas à tester :

- message vide ;

- message trop long ;

- utilisateur non connecté ;

- non-membre.

Résultat attendu :

- message refusé ;

- erreur claire ;

- pas de broadcast.

### 11.5 Test MVP-CHAT-005 — Rate limiting chat

Priorité : P1

Objectif : vérifier que le spam de messages est limité.

Résultat attendu :

- au-delà de la limite, messages refusés ;

- réponse claire ;

- logs propres.

## 12 Plan de tests API générale

### 12.1 Test MVP-API-001 — Format réponse succès

Priorité : P0

Objectif : vérifier que les réponses suivent le format standard.

Résultat attendu :

- success: true ;

- data présent ;

- message si pertinent.

### 12.2 Test MVP-API-002 — Format réponse erreur

Priorité : P0

Objectif : vérifier que les erreurs suivent le format standard.

Résultat attendu :

- success: false ;

- error.code ;

- error.message ;

- requestId si disponible.

### 12.3 Test MVP-API-003 — Validation DTO

Priorité : P0

Objectif : vérifier que les payloads invalides sont refusés.

Résultat attendu :

- statut 400 ;

- erreur de validation claire ;

- aucune écriture incorrecte en base.

### 12.4 Test MVP-API-004 — Swagger accessible

Priorité : P0

Objectif : vérifier que Swagger permet de consulter les endpoints.

Résultat attendu :

- Swagger accessible en développement ;

- endpoints principaux documentés ;

- aucun secret réel dans Swagger.

## 13 Plan de tests sécurité MVP

### 13.1 Test MVP-SEC-001 — PasswordHash absent

Priorité : P0

Objectif : vérifier que les réponses API ne retournent jamais passwordHash.

Résultat attendu :

- aucun passwordHash dans les réponses utilisateur.

### 13.2 Test MVP-SEC-002 — Route admin refusée

Priorité : P0 si admin développé

Objectif : vérifier qu'un PLAYER ne peut pas accéder aux routes admin.

Résultat attendu :

- statut 403 ;

- message clair.

### 13.3 Test MVP-SEC-003 — Modification ressource autre utilisateur

Priorité : P0

Objectif : vérifier qu'un utilisateur ne peut pas modifier les données d'un autre.

Résultat attendu :

- accès refusé ;

- aucune modification en base.

### 13.4 Test MVP-SEC-004 — Secrets non exposés

Priorité : P0

Objectif : vérifier qu'aucun secret n'est exposé au front ou dans Swagger.

Résultat attendu :

- pas de JWT_SECRET ;

- pas de DATABASE_URL ;

- pas de STEAM_WEB_API_KEY ;

- pas de EPIC_CLIENT_SECRET.

### 13.5 Test MVP-SEC-005 — XSS basique

Priorité : P1

Objectif : vérifier que les champs texte ne permettent pas d'injecter du HTML actif.

Cas à tester :

- pseudo contenant balise HTML ;

- bio contenant script ;

- message chat contenant HTML.

Résultat attendu :

- contenu affiché comme texte ou refusé ;

- aucun script exécuté.

## 14 Plan de tests PWA et responsive

### 14.1 Test MVP-PWA-001 — Responsive mobile

Priorité : P1

Objectif : vérifier l'affichage sur mobile.

Pages à vérifier :

- login ;

- dashboard ;

- leaderboard ;

- équipe ;

- chat.

Résultat attendu :

- interface lisible ;

- pas de débordement majeur ;

- actions principales accessibles.

### 14.2 Test MVP-PWA-002 — Refresh page privée

Priorité : P0

Objectif : vérifier qu'un refresh ne casse pas la session.

Résultat attendu :

- utilisateur toujours connecté si token valide ;

- redirection login si token absent/expiré.

### 14.3 Test MVP-PWA-003 — Données privées après logout

Priorité : P0

Objectif : vérifier que les données privées ne restent pas affichées après logout.

Résultat attendu :

- dashboard inaccessible ;

- store nettoyé ;

- données privées non visibles.

## 15 Plan de tests mode démo

### 15.1 Test MVP-DEMO-001 — Compte démo

Priorité : P0

Objectif : vérifier que le compte démo fonctionne.

Résultat attendu :

- connexion possible ;

- dashboard rempli ;

- équipe disponible ;

- chat disponible.

### 15.2 Test MVP-DEMO-002 — MockProvider actif

Priorité : P0

Objectif : vérifier que les stats viennent du MockProvider.

Résultat attendu :

- aucune clé Steam/Epic nécessaire ;

- stats disponibles ;

- sync possible ;

- fallback stable.

### 15.3 Test MVP-DEMO-003 — Données cohérentes

Priorité : P0

Objectif : vérifier que les données de démo sont crédibles.

Résultat attendu :

- scores variés ;

- leaderboard rempli ;

- équipes non vides ;

- messages présents ;

- saisons si prévues.

## 16 Plan de tests régression avant soutenance

### 16.1 Parcours complet démo

Priorité : P0

Étapes :

1. Lancer Docker.

2. Lancer migrations.

3. Lancer seed démo.

4. Ouvrir le front.

5. Se connecter au compte démo.

6. Consulter dashboard.

7. Consulter stats.

8. Consulter leaderboard.

9. Consulter équipe.

10. Envoyer un message chat.

11. Se déconnecter.

Résultat attendu :

- aucun blocage ;

- parcours fluide ;

- données visibles ;

- erreurs absentes ou contrôlées.

### 16.2 Parcours accès refusé

Priorité : P0

Étapes :

1. Accéder au dashboard sans être connecté.

2. Accéder au chat d'une équipe non membre.

3. Tenter une action réservée au capitaine avec membre simple.

Résultat attendu :

- accès refusé proprement ;

- pas de fuite de données ;

- messages clairs.

## 17 Matrice synthétique des tests MVP

| Domaine | Tests P0 | Tests P1 | Tests P2 |

|---|---|---|---|

| Docker | lancement, DB, Redis, seed | scripts utilitaires | déploiement auto |

| Auth | register, login, logout, JWT | refresh token | 2FA |

| Dashboard | affichage stats | responsive avancé | personnalisation |

| Stats | mock, K/D, winrate, score | historique | stats réelles avancées |

| Leaderboard | affichage, tri, éligibilité | pagination | filtres avancés |

| Équipes | création, rejoindre, permissions | invitations avancées | modération |

| Chat | accès membre, refus non-membre, message | rate limit | présence typing |

| API | format, validation, Swagger | requestId | versioning avancé |

| Sécurité | secrets, guards, ownership | XSS, rate limit | pentest |

| PWA | logout, refresh | offline | installation complète |

| Démo | compte démo, MockProvider | données enrichies | scénario multi-comptes |

## 18 Gestion des anomalies

### 18.1 Classification

Bloquant :

- application impossible à lancer ;

- login impossible ;

- dashboard inutilisable ;

- chat inaccessible ;

- Docker cassé ;

- données démo absentes ;

- faille de permissions majeure.

Majeur :

- fonctionnalité importante partiellement cassée ;

- affichage incorrect mais contournable ;

- erreur API non bloquante ;

- problème responsive visible.

Mineur :

- faute de texte ;

- petit décalage UI ;

- message d'erreur à améliorer ;

- amélioration ergonomique.

### 18.2 Suivi des anomalies

Chaque anomalie doit être suivie dans GitHub Project ou issue GitHub avec :

- titre ;

- domaine ;

- priorité ;

- étapes de reproduction ;

- résultat attendu ;

- résultat obtenu ;

- responsable ;

- statut.

## 19 Critères de sortie MVP

Le MVP est considéré testable et présentable si :

- tous les tests P0 passent ;

- aucun bug bloquant n'est ouvert ;

- les bugs majeurs restants sont connus et contournables ;

- Docker fonctionne ;

- le compte démo fonctionne ;

- MockProvider fonctionne ;

- le dashboard est visible ;

- le leaderboard est visible ;

- le chat d'équipe fonctionne ;

- les permissions critiques sont respectées ;

- Swagger ne contient aucun secret ;

- la documentation est cohérente avec le comportement présenté.

## 20 Checklist finale rapide

Avant soutenance :

- Docker démarre.

- Backend démarre.

- Frontend démarre.

- PostgreSQL répond.

- Redis répond.

- Migrations passées.

- Seed démo passé.

- Compte démo OK.

- Login OK.

- Dashboard OK.

- Stats OK.

- Leaderboard OK.

- Équipe OK.

- Chat OK.

- Logout OK.

- Routes privées protégées.

- Non-membre refusé.

- Secrets non visibles.

- Swagger OK.

- Mode mock OK.

## 21 Risques et solutions

### 21.1 Risque : trop de tests à réaliser

Impact : perte de temps avant soutenance.

Solution : exécuter d'abord les tests P0, puis P1 si temps disponible.

### 21.2 Risque : données démo insuffisantes

Impact : démonstration peu convaincante.

Solution : prévoir un seed riche avec joueurs, stats, équipes et messages.

### 21.3 Risque : Docker non stable

Impact : soutenance compromise.

Solution : tester Docker plusieurs fois sur machine propre.

### 21.4 Risque : API externe indisponible

Impact : stats cassées.

Solution : utiliser MockProvider en MVP.

### 21.5 Risque : bug de permissions

Impact : faille visible et critique.

Solution : tester systématiquement accès membre / non-membre / capitaine.

## 22 Critères d'acceptation du plan de tests

Ce plan est considéré complet si :

- il liste les tests MVP prioritaires ;

- il distingue P0, P1 et P2 ;

- il couvre Docker ;

- il couvre auth ;

- il couvre dashboard et stats ;

- il couvre leaderboards ;

- il couvre équipes et chat ;

- il couvre API ;

- il couvre sécurité ;

- il couvre mode démo ;

- il fournit une checklist finale ;

- il permet de décider si le MVP est prêt pour soutenance.

## 23 Conclusion

Le plan de tests MVP de Track'N Share sert à vérifier les fonctionnalités indispensables avant la soutenance.

L'objectif n'est pas de tout tester de manière exhaustive, mais de garantir que le parcours principal fonctionne : lancer le projet, se connecter, consulter ses statistiques, voir le leaderboard, accéder à son équipe, utiliser le chat et démontrer que les accès sont sécurisés.

Les tests P0 doivent être traités comme bloquants. Les tests P1 et P2 pourront être ajoutés progressivement selon l'avancement du développement.

Avec ce plan, Ioanes et Clément disposent d'une base claire pour contrôler la qualité du MVP pendant et après le développement.
