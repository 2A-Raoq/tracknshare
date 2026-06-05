# SPRINT 2 — STATISTIQUES ET LEADERBOARDS

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit le Sprint 2 du projet Track'N Share.

Le Sprint 2 correspond à la mise en place du coeur métier visible du MVP : statistiques joueur, MockProvider, calcul de score, dashboard et leaderboard solo.

Ce sprint est essentiel pour la soutenance, car il transforme l'application en véritable plateforme de suivi de performances gaming. Le MVP ne doit pas dépendre de Steam ou Epic pour fonctionner : le MockProvider et les données seedées sont donc prioritaires.

## 1 Objectif du Sprint 2

### 1.1 Objectif principal

Permettre à un joueur connecté de consulter des statistiques crédibles, de synchroniser des données mockées et d'apparaître dans un leaderboard solo.

À la fin du sprint, l'application doit permettre de :

- afficher un dashboard joueur ;

- générer ou synchroniser des statistiques fictives ;

- calculer K/D, winrate et score ;

- afficher plusieurs joueurs dans un classement ;

- trier le leaderboard par score ;

- présenter des données crédibles pour la démo.

### 1.2 Objectifs secondaires

Le Sprint 2 doit aussi permettre de :

- créer les modèles Game, GameAccount, PlayerStats et Season ;

- préparer la logique de saison de 3 mois ;

- centraliser la formule de score ;

- isoler la récupération externe derrière un provider ;

- gérer les cas d'erreur du provider ;

- seed plusieurs joueurs et statistiques ;

- préparer les futures intégrations Steam/Epic sans les rendre obligatoires.

## 2 Périmètre du Sprint 2

### 2.1 Inclus

Le Sprint 2 inclut :

- modèles Game, GameAccount, PlayerStats, Season ;

- migrations associées ;

- MockProvider ;

- service de normalisation des statistiques ;

- calcul K/D ;

- calcul winrate ;

- calcul score ;

- endpoint GET /api/stats/me ;

- endpoint POST /api/stats/sync ;

- endpoint GET /api/leaderboards/solo ;

- dashboard statistiques côté front ;

- page leaderboard côté front ;

- seed joueurs, jeux et statistiques ;

- données suffisantes pour la soutenance.

### 2.2 Non inclus

Le Sprint 2 ne doit pas inclure :

- intégration Steam réelle complète ;

- intégration Epic réelle complète ;

- leaderboards d'équipe complets ;

- chat ;

- gestion avancée des saisons ;

- analytics complexes ;

- graphiques avancés ;

- badges ;

- matchmaking ;

- historique détaillé multi-saisons.

## 3 Durée recommandée

Durée indicative : 5 à 8 jours de travail selon disponibilité.

Ce sprint est plus métier que le Sprint 1. Il faut privilégier une version simple, stable et démontrable plutôt qu'une intégration externe complexe.

## 4 Livrables attendus

Livrables principaux :

- modèles de données statistiques ;

- migrations prêtes ;

- MockProvider fonctionnel ;

- formule de score centralisée ;

- endpoint stats utilisateur ;

- endpoint synchronisation mock ;

- endpoint leaderboard solo ;

- dashboard joueur ;

- page leaderboard ;

- données seedées crédibles ;

- Swagger mis à jour ;

- milestone M2 validable.

## 5 Tâches du Sprint 2

### 5.1 TNS-201 — Créer modèles Game et PlayerStats

Priorité : P0

Responsable possible : Ioanes

Description : créer les modèles nécessaires au stockage des statistiques.

À faire :

- créer modèle Game ;

- créer modèle GameAccount si nécessaire pour simuler un compte lié ;

- créer modèle PlayerStats ;

- créer modèle Season ;

- relier PlayerStats à User, Game et Season ;

- créer les migrations.

Critères d'acceptation :

- tables créées ;

- relations user/game/stats fonctionnelles ;

- migrations exécutables ;

- données mockables ;

- structure compatible avec les futures APIs externes.

### 5.2 TNS-202 — Créer MockProvider

Priorité : P0

Responsable possible : Ioanes

Description : créer un provider simulant la récupération de statistiques de jeu.

À faire :

- créer une interface de provider de statistiques ;

- créer MockProvider ;

- retourner wins, losses, kills, deaths, matchesPlayed ;

- simuler éventuellement un temps de réponse ;

- prévoir des erreurs simulables ;

- normaliser la réponse.

Critères d'acceptation :

- provider retourne des stats fictives ;

- aucune dépendance à Steam/Epic ;

- données cohérentes ;

- erreurs gérées ;

- provider remplaçable plus tard.

### 5.3 TNS-203 — Implémenter calcul du score

Priorité : P0

Responsable possible : Ioanes

Description : calculer les indicateurs utilisés dans le dashboard et le leaderboard.

Formule MVP proposée :

Score = (K/D ratio × 50) + (Winrate × 40) + (Nombre de parties × 0.5)

À faire :

- calculer K/D ;

- calculer winrate ;

- calculer score ;

- gérer deaths = 0 ;

- gérer matchesPlayed = 0 ;

- centraliser la fonction de calcul ;

- documenter la formule.

Critères d'acceptation :

- score stable ;

- K/D calculé ;

- winrate calculé ;

- division par zéro gérée ;

- formule utilisée côté back ;

- résultat cohérent dans dashboard et leaderboard.

### 5.4 TNS-204 — Endpoint statistiques utilisateur

Priorité : P0

Responsable possible : Ioanes

Description : permettre au joueur connecté de récupérer ses statistiques.

À faire :

- créer GET /api/stats/me ;

- appliquer JwtAuthGuard ;

- récupérer les stats du user connecté ;

- retourner game, season, wins, losses, kills, deaths, kdRatio, winrate, score ;

- gérer absence de stats.

Critères d'acceptation :

- token requis ;

- données limitées à l'utilisateur connecté ;

- score inclus ;

- état vide géré ;

- route documentée Swagger.

### 5.5 TNS-205 — Endpoint synchronisation mock

Priorité : P0

Responsable possible : Ioanes

Description : permettre de générer ou rafraîchir les statistiques depuis le MockProvider.

À faire :

- créer POST /api/stats/sync ;

- utiliser MockProvider ;

- sauvegarder les stats ;

- recalculer le score ;

- mettre à jour lastSyncAt ;

- conserver anciennes stats en cas d'erreur.

Critères d'acceptation :

- sync mock fonctionnelle ;

- stats sauvegardées ;

- score recalculé ;

- erreurs non bloquantes ;

- anciennes données conservées si provider échoue.

### 5.6 TNS-206 — Dashboard statistiques front

Priorité : P0

Responsable possible : Clément

Description : afficher les statistiques principales du joueur connecté.

À faire :

- créer page ou section dashboard ;

- appeler GET /api/stats/me ;

- afficher score, K/D, winrate, matchesPlayed ;

- afficher kills, deaths, wins, losses ;

- ajouter bouton de synchronisation mock ;

- gérer loading, error et empty state.

Critères d'acceptation :

- score visible ;

- K/D visible ;

- winrate visible ;

- matchesPlayed visible ;

- bouton sync fonctionnel ;

- interface lisible en responsive minimal.

### 5.7 TNS-207 — Endpoint leaderboard solo

Priorité : P0

Responsable possible : Ioanes

Description : créer le classement solo des joueurs.

À faire :

- créer GET /api/leaderboards/solo ;

- trier par score décroissant ;

- ajouter rang ;

- prévoir pagination simple ;

- filtrer par jeu si possible ;

- exclure les joueurs sans stats exploitables.

Critères d'acceptation :

- leaderboard disponible ;

- joueurs triés par score ;

- rang calculé ;

- pagination présente ;

- données seedées visibles ;

- route documentée Swagger.

### 5.8 TNS-208 — Page leaderboard front

Priorité : P0

Responsable possible : Clément

Description : afficher le classement solo dans l'interface.

À faire :

- créer page leaderboard ;

- appeler l'API leaderboard ;

- afficher rang, pseudo, score, K/D, winrate, parties ;

- gérer loading/error/empty ;

- rendre le tableau lisible sur mobile.

Critères d'acceptation :

- rang affiché ;

- pseudo affiché ;

- score affiché ;

- statistiques principales visibles ;

- état vide géré ;

- UX suffisamment propre pour la démo.

### 5.9 TNS-209 — Seed statistiques et leaderboard

Priorité : P0

Responsable possible : Ioanes

Description : préparer des données de démonstration crédibles.

À faire :

- créer plusieurs utilisateurs fictifs ;

- créer au moins un jeu MVP ;

- créer une saison active ;

- créer des stats variées ;

- associer le compte démo à des stats ;

- remplir le leaderboard.

Critères d'acceptation :

- plusieurs joueurs visibles ;

- scores variés ;

- leaderboard crédible ;

- données non réelles ;

- dashboard compte démo rempli.

## 6 Répartition possible

### 6.1 Ioanes

Tâches principales possibles :

- modèles Game, GameAccount, PlayerStats, Season ;

- migrations ;

- MockProvider ;

- calcul score ;

- endpoints stats ;

- endpoint leaderboard ;

- seed statistiques ;

- Swagger.

### 6.2 Clément

Tâches principales possibles :

- dashboard UI ;

- cartes statistiques ;

- bouton synchronisation ;

- page leaderboard ;

- intégration API ;

- gestion loading/error/empty ;

- responsive.

### 6.3 Tâches communes

À faire ensemble :

- valider la formule de score ;

- valider le format des réponses API ;

- choisir les données de démo ;

- tester le parcours dashboard → sync → leaderboard.

## 7 Dépendances

### 7.1 Dépendances internes

- Sprint 2 dépend de Sprint 1 pour l'utilisateur connecté.

- Le leaderboard dépend des statistiques et du score.

- Le dashboard dépend de l'endpoint stats.

- Les équipes du Sprint 3 pourront réutiliser les utilisateurs et scores.

### 7.2 Dépendances techniques

- base PostgreSQL disponible ;

- migrations fonctionnelles ;

- AuthGuard fonctionnel ;

- compte démo présent ;

- front capable d'appeler l'API avec token.

## 8 Definition of Done du Sprint 2

Le Sprint 2 est terminé si :

- les modèles statistiques existent ;

- le MockProvider fonctionne ;

- un joueur connecté peut synchroniser des stats mockées ;

- le dashboard affiche des statistiques ;

- le score est calculé côté back ;

- le leaderboard affiche plusieurs joueurs ;

- les joueurs sont triés par score ;

- les données seedées suffisent pour la démonstration ;

- le MVP ne dépend pas de Steam/Epic ;

- Swagger documente les routes principales.

## 9 Tests à réaliser pendant le Sprint 2

### 9.1 Tests API

- GET /api/stats/me sans token ;

- GET /api/stats/me avec token ;

- POST /api/stats/sync avec token ;

- POST /api/stats/sync avec erreur provider simulée ;

- GET /api/leaderboards/solo ;

- vérification du tri par score ;

- vérification des cas deaths = 0 et matchesPlayed = 0.

### 9.2 Tests front

- dashboard avec stats ;

- dashboard sans stats ;

- bouton synchronisation ;

- affichage loading ;

- affichage erreur ;

- page leaderboard remplie ;

- page leaderboard vide ;

- responsive minimal.

### 9.3 Tests métier

- score cohérent ;

- K/D cohérent ;

- winrate cohérent ;

- joueur avec peu ou pas de parties géré ;

- données anciennes conservées si erreur de sync.

## 10 Risques du Sprint 2

### 10.1 Risque : vouloir intégrer Steam/Epic trop tôt

Impact : retard important.

Solution : MockProvider prioritaire, intégrations réelles en P2.

### 10.2 Risque : formule de score déséquilibrée

Impact : leaderboard peu crédible.

Solution : garder une formule simple, documentée et ajustable.

### 10.3 Risque : données de démo insuffisantes

Impact : soutenance peu convaincante.

Solution : seed plusieurs joueurs, jeux et scores variés.

### 10.4 Risque : confusion entre stats réelles et mockées

Impact : mauvaise compréhension du jury.

Solution : documenter clairement que le MockProvider sécurise le MVP.

### 10.5 Risque : dashboard trop chargé

Impact : UX confuse.

Solution : afficher d'abord les indicateurs essentiels : score, K/D, winrate, parties.

## 11 Checklist de fin Sprint 2

- Modèles Game, GameAccount, PlayerStats, Season créés.

- Migrations exécutées.

- MockProvider prêt.

- Calcul K/D prêt.

- Calcul winrate prêt.

- Calcul score prêt.

- GET /api/stats/me prêt.

- POST /api/stats/sync prêt.

- GET /api/leaderboards/solo prêt.

- Dashboard stats prêt.

- Page leaderboard prête.

- Seed stats prêt.

- Compte démo avec stats.

- Swagger mis à jour.

- MVP indépendant de Steam/Epic.

## 12 Passage au Sprint 3

Le passage au Sprint 3 est possible quand :

- les utilisateurs ont des statistiques ;

- le compte démo affiche un dashboard rempli ;

- le leaderboard est présentable ;

- les données seedées existent ;

- les futurs modules Team peuvent s'appuyer sur des utilisateurs existants ;

- le parcours login → dashboard → leaderboard est stable.

## 13 Conclusion

Le Sprint 2 donne à Track'N Share son intérêt principal : suivre les performances gaming et comparer les joueurs.

Grâce au MockProvider, le MVP reste démontrable même sans API externe réelle. Le dashboard et le leaderboard permettront de montrer une application utile, visuelle et cohérente avant d'ajouter les équipes et le chat dans le Sprint 3.

SPRINT 2 — STATISTIQUES ET LEADERBOARDS

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit le Sprint 2 du projet Track'N Share.

Le Sprint 2 correspond à la mise en place du coeur métier visible du MVP : statistiques joueur, MockProvider, calcul de score, dashboard et leaderboard solo.

Ce sprint est essentiel pour la soutenance, car il transforme l'application en véritable plateforme de suivi de performances gaming. Le MVP ne doit pas dépendre de Steam ou Epic pour fonctionner : le MockProvider et les données seedées sont donc prioritaires.

## 1 Objectif du Sprint 2

### 1.1 Objectif principal

Permettre à un joueur connecté de consulter des statistiques crédibles, de synchroniser des données mockées et d'apparaître dans un leaderboard solo.

À la fin du sprint, l'application doit permettre de :

- afficher un dashboard joueur ;

- générer ou synchroniser des statistiques fictives ;

- calculer K/D, winrate et score ;

- afficher plusieurs joueurs dans un classement ;

- trier le leaderboard par score ;

- présenter des données crédibles pour la démo.

### 1.2 Objectifs secondaires

Le Sprint 2 doit aussi permettre de :

- créer les modèles Game, GameAccount, PlayerStats et Season ;

- préparer la logique de saison de 3 mois ;

- centraliser la formule de score ;

- isoler la récupération externe derrière un provider ;

- gérer les cas d'erreur du provider ;

- seed plusieurs joueurs et statistiques ;

- préparer les futures intégrations Steam/Epic sans les rendre obligatoires.

## 2 Périmètre du Sprint 2

### 2.1 Inclus

Le Sprint 2 inclut :

- modèles Game, GameAccount, PlayerStats, Season ;

- migrations associées ;

- MockProvider ;

- service de normalisation des statistiques ;

- calcul K/D ;

- calcul winrate ;

- calcul score ;

- endpoint GET /api/stats/me ;

- endpoint POST /api/stats/sync ;

- endpoint GET /api/leaderboards/solo ;

- dashboard statistiques côté front ;

- page leaderboard côté front ;

- seed joueurs, jeux et statistiques ;

- données suffisantes pour la soutenance.

### 2.2 Non inclus

Le Sprint 2 ne doit pas inclure :

- intégration Steam réelle complète ;

- intégration Epic réelle complète ;

- leaderboards d'équipe complets ;

- chat ;

- gestion avancée des saisons ;

- analytics complexes ;

- graphiques avancés ;

- badges ;

- matchmaking ;

- historique détaillé multi-saisons.

## 3 Durée recommandée

Durée indicative : 5 à 8 jours de travail selon disponibilité.

Ce sprint est plus métier que le Sprint 1. Il faut privilégier une version simple, stable et démontrable plutôt qu'une intégration externe complexe.

## 4 Livrables attendus

Livrables principaux :

- modèles de données statistiques ;

- migrations prêtes ;

- MockProvider fonctionnel ;

- formule de score centralisée ;

- endpoint stats utilisateur ;

- endpoint synchronisation mock ;

- endpoint leaderboard solo ;

- dashboard joueur ;

- page leaderboard ;

- données seedées crédibles ;

- Swagger mis à jour ;

- milestone M2 validable.

## 5 Tâches du Sprint 2

### 5.1 TNS-201 — Créer modèles Game et PlayerStats

Priorité : P0

Responsable possible : Ioanes

Description : créer les modèles nécessaires au stockage des statistiques.

À faire :

- créer modèle Game ;

- créer modèle GameAccount si nécessaire pour simuler un compte lié ;

- créer modèle PlayerStats ;

- créer modèle Season ;

- relier PlayerStats à User, Game et Season ;

- créer les migrations.

Critères d'acceptation :

- tables créées ;

- relations user/game/stats fonctionnelles ;

- migrations exécutables ;

- données mockables ;

- structure compatible avec les futures APIs externes.

### 5.2 TNS-202 — Créer MockProvider

Priorité : P0

Responsable possible : Ioanes

Description : créer un provider simulant la récupération de statistiques de jeu.

À faire :

- créer une interface de provider de statistiques ;

- créer MockProvider ;

- retourner wins, losses, kills, deaths, matchesPlayed ;

- simuler éventuellement un temps de réponse ;

- prévoir des erreurs simulables ;

- normaliser la réponse.

Critères d'acceptation :

- provider retourne des stats fictives ;

- aucune dépendance à Steam/Epic ;

- données cohérentes ;

- erreurs gérées ;

- provider remplaçable plus tard.

### 5.3 TNS-203 — Implémenter calcul du score

Priorité : P0

Responsable possible : Ioanes

Description : calculer les indicateurs utilisés dans le dashboard et le leaderboard.

Formule MVP proposée :

Score = (K/D ratio × 50) + (Winrate × 40) + (Nombre de parties × 0.5)

À faire :

- calculer K/D ;

- calculer winrate ;

- calculer score ;

- gérer deaths = 0 ;

- gérer matchesPlayed = 0 ;

- centraliser la fonction de calcul ;

- documenter la formule.

Critères d'acceptation :

- score stable ;

- K/D calculé ;

- winrate calculé ;

- division par zéro gérée ;

- formule utilisée côté back ;

- résultat cohérent dans dashboard et leaderboard.

### 5.4 TNS-204 — Endpoint statistiques utilisateur

Priorité : P0

Responsable possible : Ioanes

Description : permettre au joueur connecté de récupérer ses statistiques.

À faire :

- créer GET /api/stats/me ;

- appliquer JwtAuthGuard ;

- récupérer les stats du user connecté ;

- retourner game, season, wins, losses, kills, deaths, kdRatio, winrate, score ;

- gérer absence de stats.

Critères d'acceptation :

- token requis ;

- données limitées à l'utilisateur connecté ;

- score inclus ;

- état vide géré ;

- route documentée Swagger.

### 5.5 TNS-205 — Endpoint synchronisation mock

Priorité : P0

Responsable possible : Ioanes

Description : permettre de générer ou rafraîchir les statistiques depuis le MockProvider.

À faire :

- créer POST /api/stats/sync ;

- utiliser MockProvider ;

- sauvegarder les stats ;

- recalculer le score ;

- mettre à jour lastSyncAt ;

- conserver anciennes stats en cas d'erreur.

Critères d'acceptation :

- sync mock fonctionnelle ;

- stats sauvegardées ;

- score recalculé ;

- erreurs non bloquantes ;

- anciennes données conservées si provider échoue.

### 5.6 TNS-206 — Dashboard statistiques front

Priorité : P0

Responsable possible : Clément

Description : afficher les statistiques principales du joueur connecté.

À faire :

- créer page ou section dashboard ;

- appeler GET /api/stats/me ;

- afficher score, K/D, winrate, matchesPlayed ;

- afficher kills, deaths, wins, losses ;

- ajouter bouton de synchronisation mock ;

- gérer loading, error et empty state.

Critères d'acceptation :

- score visible ;

- K/D visible ;

- winrate visible ;

- matchesPlayed visible ;

- bouton sync fonctionnel ;

- interface lisible en responsive minimal.

### 5.7 TNS-207 — Endpoint leaderboard solo

Priorité : P0

Responsable possible : Ioanes

Description : créer le classement solo des joueurs.

À faire :

- créer GET /api/leaderboards/solo ;

- trier par score décroissant ;

- ajouter rang ;

- prévoir pagination simple ;

- filtrer par jeu si possible ;

- exclure les joueurs sans stats exploitables.

Critères d'acceptation :

- leaderboard disponible ;

- joueurs triés par score ;

- rang calculé ;

- pagination présente ;

- données seedées visibles ;

- route documentée Swagger.

### 5.8 TNS-208 — Page leaderboard front

Priorité : P0

Responsable possible : Clément

Description : afficher le classement solo dans l'interface.

À faire :

- créer page leaderboard ;

- appeler l'API leaderboard ;

- afficher rang, pseudo, score, K/D, winrate, parties ;

- gérer loading/error/empty ;

- rendre le tableau lisible sur mobile.

Critères d'acceptation :

- rang affiché ;

- pseudo affiché ;

- score affiché ;

- statistiques principales visibles ;

- état vide géré ;

- UX suffisamment propre pour la démo.

### 5.9 TNS-209 — Seed statistiques et leaderboard

Priorité : P0

Responsable possible : Ioanes

Description : préparer des données de démonstration crédibles.

À faire :

- créer plusieurs utilisateurs fictifs ;

- créer au moins un jeu MVP ;

- créer une saison active ;

- créer des stats variées ;

- associer le compte démo à des stats ;

- remplir le leaderboard.

Critères d'acceptation :

- plusieurs joueurs visibles ;

- scores variés ;

- leaderboard crédible ;

- données non réelles ;

- dashboard compte démo rempli.

## 6 Répartition possible

### 6.1 Ioanes

Tâches principales possibles :

- modèles Game, GameAccount, PlayerStats, Season ;

- migrations ;

- MockProvider ;

- calcul score ;

- endpoints stats ;

- endpoint leaderboard ;

- seed statistiques ;

- Swagger.

### 6.2 Clément

Tâches principales possibles :

- dashboard UI ;

- cartes statistiques ;

- bouton synchronisation ;

- page leaderboard ;

- intégration API ;

- gestion loading/error/empty ;

- responsive.

### 6.3 Tâches communes

À faire ensemble :

- valider la formule de score ;

- valider le format des réponses API ;

- choisir les données de démo ;

- tester le parcours dashboard → sync → leaderboard.

## 7 Dépendances

### 7.1 Dépendances internes

- Sprint 2 dépend de Sprint 1 pour l'utilisateur connecté.

- Le leaderboard dépend des statistiques et du score.

- Le dashboard dépend de l'endpoint stats.

- Les équipes du Sprint 3 pourront réutiliser les utilisateurs et scores.

### 7.2 Dépendances techniques

- base PostgreSQL disponible ;

- migrations fonctionnelles ;

- AuthGuard fonctionnel ;

- compte démo présent ;

- front capable d'appeler l'API avec token.

## 8 Definition of Done du Sprint 2

Le Sprint 2 est terminé si :

- les modèles statistiques existent ;

- le MockProvider fonctionne ;

- un joueur connecté peut synchroniser des stats mockées ;

- le dashboard affiche des statistiques ;

- le score est calculé côté back ;

- le leaderboard affiche plusieurs joueurs ;

- les joueurs sont triés par score ;

- les données seedées suffisent pour la démonstration ;

- le MVP ne dépend pas de Steam/Epic ;

- Swagger documente les routes principales.

## 9 Tests à réaliser pendant le Sprint 2

### 9.1 Tests API

- GET /api/stats/me sans token ;

- GET /api/stats/me avec token ;

- POST /api/stats/sync avec token ;

- POST /api/stats/sync avec erreur provider simulée ;

- GET /api/leaderboards/solo ;

- vérification du tri par score ;

- vérification des cas deaths = 0 et matchesPlayed = 0.

### 9.2 Tests front

- dashboard avec stats ;

- dashboard sans stats ;

- bouton synchronisation ;

- affichage loading ;

- affichage erreur ;

- page leaderboard remplie ;

- page leaderboard vide ;

- responsive minimal.

### 9.3 Tests métier

- score cohérent ;

- K/D cohérent ;

- winrate cohérent ;

- joueur avec peu ou pas de parties géré ;

- données anciennes conservées si erreur de sync.

## 10 Risques du Sprint 2

### 10.1 Risque : vouloir intégrer Steam/Epic trop tôt

Impact : retard important.

Solution : MockProvider prioritaire, intégrations réelles en P2.

### 10.2 Risque : formule de score déséquilibrée

Impact : leaderboard peu crédible.

Solution : garder une formule simple, documentée et ajustable.

### 10.3 Risque : données de démo insuffisantes

Impact : soutenance peu convaincante.

Solution : seed plusieurs joueurs, jeux et scores variés.

### 10.4 Risque : confusion entre stats réelles et mockées

Impact : mauvaise compréhension du jury.

Solution : documenter clairement que le MockProvider sécurise le MVP.

### 10.5 Risque : dashboard trop chargé

Impact : UX confuse.

Solution : afficher d'abord les indicateurs essentiels : score, K/D, winrate, parties.

## 11 Checklist de fin Sprint 2

- Modèles Game, GameAccount, PlayerStats, Season créés.

- Migrations exécutées.

- MockProvider prêt.

- Calcul K/D prêt.

- Calcul winrate prêt.

- Calcul score prêt.

- GET /api/stats/me prêt.

- POST /api/stats/sync prêt.

- GET /api/leaderboards/solo prêt.

- Dashboard stats prêt.

- Page leaderboard prête.

- Seed stats prêt.

- Compte démo avec stats.

- Swagger mis à jour.

- MVP indépendant de Steam/Epic.

## 12 Passage au Sprint 3

Le passage au Sprint 3 est possible quand :

- les utilisateurs ont des statistiques ;

- le compte démo affiche un dashboard rempli ;

- le leaderboard est présentable ;

- les données seedées existent ;

- les futurs modules Team peuvent s'appuyer sur des utilisateurs existants ;

- le parcours login → dashboard → leaderboard est stable.

## 13 Conclusion

Le Sprint 2 donne à Track'N Share son intérêt principal : suivre les performances gaming et comparer les joueurs.

Grâce au MockProvider, le MVP reste démontrable même sans API externe réelle. Le dashboard et le leaderboard permettront de montrer une application utile, visuelle et cohérente avant d'ajouter les équipes et le chat dans le Sprint 3.
