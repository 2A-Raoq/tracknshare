# SYSTÈME D'ARCHIVAGE TRIMESTRIEL

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit le système d'archivage trimestriel prévu pour Track'N Share.

Dans le projet, l'archivage trimestriel correspond au fonctionnement par saisons. Une saison dure trois mois. À la fin d'une saison, les statistiques, scores, leaderboards et performances des joueurs ou équipes doivent être figés afin de conserver un historique fiable et consultable.

Ce document précise :

- le rôle des saisons ;

- les règles d'archivage ;

- les données à archiver ;

- la structure de base de données recommandée ;

- le cycle de vie d'une saison ;

- le fonctionnement des jobs automatiques ;

- les cas d'erreur ;

- la stratégie PostgreSQL / Redis ;

- les besoins pour le mode démo et la soutenance.

## 1 Définition générale

### 1.1 Principe

Track'N Share fonctionne avec des saisons de trois mois. Chaque saison regroupe les statistiques des joueurs, les scores, les leaderboards solo, les leaderboards d'équipe et les performances collectives.

À la fin d'une saison :

- les statistiques de la saison sont conservées ;

- les scores finaux sont figés ;

- les leaderboards sont archivés ;

- les meilleurs joueurs sont conservés ;

- les meilleures équipes sont conservées ;

- une nouvelle saison peut démarrer ;

- les utilisateurs peuvent consulter les anciennes saisons.

### 1.2 Objectif métier

Le système d'archivage permet de :

- suivre l'évolution des performances dans le temps ;

- conserver l'historique des compétitions ;

- éviter d'écraser les anciennes statistiques ;

- permettre des comparaisons entre saisons ;

- valoriser les meilleurs joueurs et équipes d'une période ;

- rendre les leaderboards plus justes et plus dynamiques.

### 1.3 Pourquoi un archivage trimestriel

Un trimestre est une période suffisamment longue pour :

- laisser aux joueurs le temps d'accumuler des statistiques ;

- rendre les leaderboards significatifs ;

- éviter des remises à zéro trop fréquentes ;

- proposer un rythme compétitif clair.

Un trimestre est aussi suffisamment court pour :

- relancer régulièrement la compétition ;

- permettre à de nouveaux joueurs d'entrer dans le classement ;

- créer un historique lisible ;

- motiver les utilisateurs à progresser sur chaque saison.

## 2 Terminologie

Saison

Période de compétition de trois mois.

Saison active

Saison actuellement utilisée pour calculer les statistiques et leaderboards courants.

Saison planifiée

Saison créée en avance mais pas encore commencée.

Saison terminée

Saison dont la date de fin est dépassée.

Saison archivée

Saison terminée dont les statistiques et classements ont été figés.

Archivage

Processus qui sauvegarde l'état final d'une saison afin de le rendre consultable plus tard.

Snapshot

Copie figée d'une donnée à un moment précis. Dans le projet, un snapshot peut représenter le classement final d'un joueur ou d'une équipe à la fin d'une saison.

Leaderboard archivé

Classement figé d'une saison passée.

Statistiques courantes

Statistiques utilisées pour la saison active.

Statistiques historiques

Statistiques conservées après l'archivage d'une saison.

## 3 Cycle de vie d'une saison

### 3.1 Statuts possibles

Une saison peut avoir les statuts suivants :

PLANNED

La saison est créée mais n'a pas encore commencé.

ACTIVE

La saison est en cours. Les statistiques synchronisées sont rattachées à cette saison.

CLOSED

La saison est terminée mais pas encore archivée complètement.

ARCHIVED

La saison est terminée, les données importantes ont été figées et l'historique est consultable.

CANCELLED

Statut optionnel permettant d'annuler une saison créée par erreur.

### 3.2 Cycle normal

Le cycle normal est :

1. Création d'une saison planifiée.

2. Passage en saison active à la date de début.

3. Accumulation des statistiques pendant trois mois.

4. Fin de saison à la date de fin.

5. Passage en statut CLOSED.

6. Lancement de l'archivage.

7. Création des snapshots statistiques et leaderboards.

8. Passage en statut ARCHIVED.

9. Création ou activation de la saison suivante.

### 3.3 Règle importante

Une seule saison peut être active à la fois.

Cette règle est indispensable pour éviter que des statistiques soient rattachées à plusieurs saisons simultanément.

## 4 Découpage annuel recommandé

Track'N Share peut découper l'année en quatre saisons :

Saison 1

Janvier à mars.

Saison 2

Avril à juin.

Saison 3

Juillet à septembre.

Saison 4

Octobre à décembre.

Exemple :

- Saison 2026-Q1 : 01/01/2026 au 31/03/2026 ;

- Saison 2026-Q2 : 01/04/2026 au 30/06/2026 ;

- Saison 2026-Q3 : 01/07/2026 au 30/09/2026 ;

- Saison 2026-Q4 : 01/10/2026 au 31/12/2026.

## 5 Données concernées par l'archivage

### 5.1 Données joueur

Les données joueur à archiver sont :

- userId ;

- gameId ;

- seasonId ;

- wins ;

- losses ;

- kills ;

- deaths ;

- matchesPlayed ;

- kdRatio ;

- winrate ;

- score final ;

- rang final ;

- date de dernière synchronisation ;

- statut d'éligibilité au leaderboard.

### 5.2 Données leaderboard solo

Le leaderboard solo archivé doit conserver :

- seasonId ;

- gameId ;

- rang final ;

- userId ;

- username au moment de l'archivage ;

- avatar au moment de l'archivage si nécessaire ;

- score final ;

- K/D final ;

- winrate final ;

- nombre de parties final ;

- date d'archivage.

Pourquoi conserver username et avatar en snapshot ?

Si l'utilisateur change de pseudo ou d'avatar plus tard, le classement historique peut soit afficher l'identité actuelle, soit l'identité de l'époque. Pour un historique fidèle, il est recommandé de sauvegarder au minimum le pseudo de l'époque.

### 5.3 Données équipe

Les données d'équipe à archiver sont :

- teamId ;

- seasonId ;

- gameId ;

- nom de l'équipe au moment de l'archivage ;

- tag de l'équipe ;

- nombre de membres ;

- score total ;

- score moyen ;

- K/D moyen ;

- winrate moyen ;

- meilleur joueur ;

- rang final dans le leaderboard d'équipe.

### 5.4 Données membres d'équipe

Il peut être utile d'archiver la composition d'une équipe à la fin d'une saison :

- teamId ;

- userId ;

- seasonId ;

- rôle dans l'équipe ;

- date d'entrée ;

- score individuel sur la saison ;

- contribution au score d'équipe.

Objectif :

- savoir qui faisait partie de l'équipe pendant la saison ;

- éviter que les changements de membres faussent l'historique.

### 5.5 Données non archivées ou archivées différemment

Les messages de chat ne sont pas forcément liés au système d'archivage trimestriel. Ils peuvent rester dans leur propre table selon leur conversation.

Les notifications n'ont pas besoin d'être archivées par saison.

Les tokens externes ne doivent jamais être copiés dans des tables d'archive.

Les mots de passe ne sont jamais concernés par l'archivage.

## 6 Modèle de données recommandé

### 6.1 Table seasons

La table seasons représente les saisons.

Champs recommandés :

- id ;

- name ;

- code ;

- startDate ;

- endDate ;

- status ;

- archivedAt ;

- createdAt ;

- updatedAt.

Exemple de code :

- 2026-Q1 ;

- 2026-Q2 ;

- 2026-Q3 ;

- 2026-Q4.

Règles :

- une saison active maximum ;

- startDate doit être inférieure à endDate ;

- code unique ;

- name lisible par l'utilisateur.

### 6.2 Table player_stats

La table player_stats stocke les statistiques d'un joueur sur une saison.

Champs recommandés :

- id ;

- userId ;

- gameId ;

- seasonId ;

- wins ;

- losses ;

- kills ;

- deaths ;

- matchesPlayed ;

- kdRatio ;

- winrate ;

- score ;

- isEligible ;

- lastSyncAt ;

- createdAt ;

- updatedAt.

Contraintes recommandées :

- userId obligatoire ;

- gameId obligatoire ;

- seasonId obligatoire ;

- valeurs numériques supérieures ou égales à 0 ;

- unicité possible sur userId + gameId + seasonId.

### 6.3 Table archived_player_stats

Cette table conserve les statistiques finales d'un joueur après archivage.

Champs recommandés :

- id ;

- originalPlayerStatsId ;

- userId ;

- usernameSnapshot ;

- gameId ;

- seasonId ;

- wins ;

- losses ;

- kills ;

- deaths ;

- matchesPlayed ;

- kdRatio ;

- winrate ;

- finalScore ;

- finalRank ;

- isEligible ;

- archivedAt.

Objectif :

- conserver un historique figé ;

- afficher les anciennes performances ;

- éviter qu'une modification future change les résultats passés.

### 6.4 Table leaderboard_snapshots

Cette table représente un classement archivé.

Champs recommandés :

- id ;

- seasonId ;

- gameId ;

- type ;

- generatedAt ;

- totalEntries ;

- createdAt.

Type possible :

- SOLO ;

- TEAM.

### 6.5 Table leaderboard_snapshot_entries

Cette table contient les entrées d'un classement archivé.

Champs recommandés :

- id ;

- snapshotId ;

- rank ;

- entityType ;

- userId ;

- teamId ;

- displayNameSnapshot ;

- score ;

- kdRatio ;

- winrate ;

- matchesPlayed ;

- metadataJson ;

- createdAt.

entityType :

- USER ;

- TEAM.

metadataJson peut contenir des informations complémentaires comme avatar, tag d'équipe, nombre de membres ou meilleur joueur.

### 6.6 Table team_season_stats

Cette table stocke les statistiques d'équipe pour une saison.

Champs recommandés :

- id ;

- teamId ;

- gameId ;

- seasonId ;

- memberCount ;

- totalScore ;

- averageScore ;

- averageKdRatio ;

- averageWinrate ;

- totalMatchesPlayed ;

- bestPlayerId ;

- finalRank ;

- updatedAt.

### 6.7 Table archived_team_stats

Cette table conserve les statistiques d'équipe archivées.

Champs recommandés :

- id ;

- teamId ;

- teamNameSnapshot ;

- teamTagSnapshot ;

- gameId ;

- seasonId ;

- memberCount ;

- totalScore ;

- averageScore ;

- averageKdRatio ;

- averageWinrate ;

- bestPlayerId ;

- bestPlayerNameSnapshot ;

- finalRank ;

- archivedAt.

### 6.8 Table team_member_season_snapshots

Cette table conserve la composition d'une équipe à la fin d'une saison.

Champs recommandés :

- id ;

- teamId ;

- seasonId ;

- userId ;

- usernameSnapshot ;

- roleSnapshot ;

- joinedAt ;

- scoreContribution ;

- archivedAt.

## 7 Relations principales

Une saison possède plusieurs player_stats.

Une saison possède plusieurs team_season_stats.

Une saison possède plusieurs leaderboard_snapshots.

Un user possède plusieurs player_stats.

Un game possède plusieurs player_stats.

Une team possède plusieurs team_season_stats.

Un leaderboard_snapshot possède plusieurs leaderboard_snapshot_entries.

Relation logique :

season → player_stats → archived_player_stats

season → team_season_stats → archived_team_stats

season → leaderboard_snapshots → leaderboard_snapshot_entries

## 8 Stratégie PostgreSQL / Redis

### 8.1 PostgreSQL

PostgreSQL est recommandé pour stocker toutes les données durables :

- saisons ;

- statistiques joueur ;

- statistiques équipe ;

- archives ;

- snapshots ;

- historique.

Pourquoi PostgreSQL :

- données relationnelles ;

- cohérence ;

- contraintes ;

- requêtes historiques ;

- intégrité des données.

### 8.2 Redis

Redis peut être utilisé pour les données rapides et temporaires :

- leaderboard courant ;

- cache de score ;

- cache de dashboard ;

- rate limiting ;

- sessions ;

- événements temps réel.

Le contenu Redis n'est pas considéré comme source durable de l'archive.

Règle importante :

L'archive finale doit être écrite en base durable, idéalement PostgreSQL.

### 8.3 Redis-JSON

Si Redis-JSON est utilisé comme base principale, il faut prévoir une convention stricte de clés.

Exemples :

- season:{seasonId}

- stats:{userId}:{gameId}:{seasonId}

- teamStats:{teamId}:{gameId}:{seasonId}

- leaderboard:current:{gameId}:{seasonId}

- leaderboard:archive:{gameId}:{seasonId}:solo

- leaderboard:archive:{gameId}:{seasonId}:team

Point de vigilance :

Redis-JSON seul rend l'historique et les relations plus difficiles à maintenir. Pour le système d'archivage, PostgreSQL reste plus adapté.

## 9 Règles métier d'archivage

### 9.1 Une saison active unique

Il ne doit jamais y avoir deux saisons actives en même temps.

### 9.2 Les statistiques sont toujours liées à une saison

Toute statistique joueur ou équipe doit être associée à une seasonId.

### 9.3 Une saison terminée ne doit plus recevoir de nouvelles statistiques courantes

Quand une saison passe en statut CLOSED ou ARCHIVED, les nouvelles synchronisations doivent être rattachées à la nouvelle saison active.

### 9.4 Les archives ne doivent pas être modifiées par les synchronisations futures

Une fois les snapshots créés, ils doivent rester stables.

### 9.5 Les classements archivés doivent conserver le rang final

Le rang final doit être stocké pour éviter de devoir recalculer l'ancien classement en permanence.

### 9.6 Les joueurs non éligibles peuvent être archivés mais pas classés

Un joueur avec moins de 10 parties peut avoir des statistiques archivées, mais ne doit pas apparaître dans le classement principal s'il n'est pas éligible.

### 9.7 Les équipes doivent conserver leur composition de fin de saison

Si une équipe change de membres après la saison, l'archive doit permettre de savoir qui était présent à la fin de la saison.

### 9.8 Les données personnelles doivent respecter les règles de confidentialité

Les snapshots ne doivent pas contenir d'informations inutiles comme email, token ou données sensibles.

## 10 Processus d'archivage automatique

### 10.1 Déclenchement

L'archivage peut être déclenché :

- automatiquement via une tâche planifiée ;

- manuellement par un administrateur en cas de besoin ;

- automatiquement au premier accès après la date de fin si aucune tâche n'a tourné.

Approche recommandée :

Utiliser une tâche planifiée côté back-end avec @nestjs/schedule.

### 10.2 Fréquence de vérification

Le système peut vérifier quotidiennement si une saison doit être clôturée.

Exemple :

Tous les jours à 00h05, le back-end vérifie si la date actuelle dépasse la endDate de la saison active.

### 10.3 Étapes du job d'archivage

Étape 1 — Identifier la saison active

Le système récupère la saison dont le statut est ACTIVE.

Étape 2 — Vérifier la date de fin

Si la date actuelle est supérieure à endDate, la saison peut être clôturée.

Étape 3 — Passer la saison en CLOSED

Le statut passe de ACTIVE à CLOSED pour empêcher de nouvelles écritures sur cette saison.

Étape 4 — Recalculer les scores finaux

Le système recalcule les scores à partir des dernières statistiques disponibles.

Étape 5 — Calculer le leaderboard solo final

Le système trie les joueurs éligibles par score décroissant.

Étape 6 — Créer le snapshot du leaderboard solo

Le classement final est enregistré.

Étape 7 — Calculer les statistiques d'équipe finales

Le système calcule score moyen, score total, K/D moyen, winrate moyen et meilleur joueur.

Étape 8 — Créer le snapshot du leaderboard d'équipe

Le classement final des équipes est enregistré.

Étape 9 — Archiver les statistiques individuelles

Les statistiques finales des joueurs sont copiées dans une table d'archive ou marquées comme historiques.

Étape 10 — Archiver les statistiques d'équipe

Les performances collectives sont figées.

Étape 11 — Archiver la composition des équipes

Les membres et rôles de fin de saison sont sauvegardés.

Étape 12 — Passer la saison en ARCHIVED

La saison est officiellement archivée.

Étape 13 — Créer ou activer la saison suivante

Une nouvelle saison passe en ACTIVE.

Étape 14 — Nettoyer les caches Redis

Les leaderboards courants liés à l'ancienne saison sont invalidés ou renommés.

## 11 Pseudo-algorithme

archiveCurrentSeason():

1. currentSeason = findActiveSeason()

2. if currentSeason is null: stop

3. if now <= currentSeason.endDate: stop

4. mark currentSeason as CLOSED

5. recalculate all player scores for currentSeason

6. compute solo leaderboard entries

7. save solo leaderboard snapshot

8. compute team season stats

9. compute team leaderboard entries

10. save team leaderboard snapshot

11. save archived player stats

12. save archived team stats

13. save team member season snapshots

14. mark currentSeason as ARCHIVED

15. create or activate next season

16. clear Redis cache for old current leaderboard

17. log archive summary without sensitive data

## 12 Gestion des scores pendant l'archivage

### 12.1 Recalcul final

Avant d'archiver, il est recommandé de recalculer tous les scores de la saison pour éviter un classement basé sur des données obsolètes.

### 12.2 Formule MVP

Score = (K/D ratio x 50) + (Winrate x 40) + (Nombre de parties x 0,5)

### 12.3 Éligibilité

Un joueur doit avoir au moins 10 parties pendant la saison pour apparaître dans le leaderboard principal.

### 12.4 Cas des joueurs non éligibles

Le système peut :

- archiver leurs statistiques ;

- ne pas les inclure dans le leaderboard ;

- afficher un statut non éligible dans leur historique personnel.

## 13 Gestion des équipes pendant l'archivage

### 13.1 Calcul d'équipe

Les statistiques d'équipe sont calculées à partir des membres actifs à la fin de la saison.

Données calculées :

- nombre de membres ;

- score total ;

- score moyen ;

- K/D moyen ;

- winrate moyen ;

- total de parties ;

- meilleur joueur.

### 13.2 Score d'équipe

Deux approches sont possibles :

Approche 1 — Score moyen

Le score d'équipe est la moyenne des scores des membres éligibles.

Avantage :

- plus juste pour les petites équipes.

Limite :

- une équipe de peu de joueurs peut être très bien classée.

Approche 2 — Score total

Le score d'équipe est la somme des scores des membres.

Avantage :

- valorise l'activité collective.

Limite :

- favorise les équipes nombreuses.

Recommandation MVP :

Utiliser le score moyen comme score principal, et afficher le score total en donnée secondaire.

### 13.3 Composition d'équipe

La composition d'une équipe doit être archivée pour éviter les incohérences historiques.

Exemple :

Si un joueur quitte une équipe après la saison, l'équipe doit quand même garder l'historique de sa contribution sur la saison passée.

## 14 Consultation des archives

### 14.1 Côté utilisateur

Un joueur doit pouvoir consulter :

- ses anciennes saisons ;

- ses statistiques par saison ;

- son score final ;

- son rang final ;

- son évolution.

### 14.2 Côté équipe

Une équipe doit pouvoir consulter :

- ses anciennes performances ;

- son classement final ;

- ses statistiques collectives ;

- ses anciens membres si cette fonctionnalité est affichée.

### 14.3 Côté leaderboard

Les utilisateurs doivent pouvoir filtrer les leaderboards par saison.

Exemple :

- saison courante ;

- 2026-Q1 ;

- 2026-Q2 ;

- 2026-Q3 ;

- 2026-Q4.

## 15 Endpoints API recommandés

### 15.1 Saisons

GET /seasons

Retourne la liste des saisons.

GET /seasons/current

Retourne la saison active.

GET /seasons/:id

Retourne une saison précise.

POST /seasons

Crée une saison. Réservé admin ou script.

PATCH /seasons/:id/status

Modifie le statut d'une saison. Réservé admin ou système.

### 15.2 Archives joueur

GET /users/me/seasons

Retourne les saisons où l'utilisateur a des statistiques.

GET /users/me/stats/history

Retourne l'historique des statistiques de l'utilisateur.

GET /users/:id/stats/:seasonId

Retourne les statistiques d'un utilisateur sur une saison.

### 15.3 Leaderboards archivés

GET /leaderboards/solo?gameId=...&seasonId=...

Retourne le leaderboard solo courant ou archivé.

GET /leaderboards/teams?gameId=...&seasonId=...

Retourne le leaderboard d'équipe courant ou archivé.

### 15.4 Archivage admin

POST /admin/seasons/:id/archive

Déclenche manuellement l'archivage d'une saison.

POST /admin/seasons/rollover

Déclenche la clôture de la saison active et l'activation de la suivante.

## 16 Stratégie d'indexation

Pour garantir de bonnes performances, il faut indexer les champs utilisés pour les recherches et filtres.

Index recommandés :

- seasons.status ;

- seasons.code ;

- player_stats.userId ;

- player_stats.gameId ;

- player_stats.seasonId ;

- player_stats.score ;

- player_stats.userId + gameId + seasonId ;

- archived_player_stats.userId ;

- archived_player_stats.seasonId ;

- archived_player_stats.gameId ;

- leaderboard_snapshots.seasonId ;

- leaderboard_snapshots.gameId ;

- leaderboard_snapshot_entries.snapshotId ;

- leaderboard_snapshot_entries.rank ;

- team_season_stats.teamId ;

- team_season_stats.seasonId ;

- archived_team_stats.teamId ;

- archived_team_stats.seasonId.

## 17 Cohérence et transactions

### 17.1 Pourquoi utiliser des transactions

L'archivage modifie plusieurs tables. Il faut éviter un état partiellement archivé.

Exemple de problème :

- les statistiques joueur sont archivées ;

- mais le leaderboard d'équipe échoue ;

- la saison reste dans un état incohérent.

### 17.2 Stratégie recommandée

Utiliser une transaction pour les étapes critiques :

- fermeture de saison ;

- création des snapshots ;

- archivage des stats ;

- archivage des équipes ;

- passage en ARCHIVED.

### 17.3 Idempotence

Le processus d'archivage doit être idempotent.

Cela signifie que relancer l'archivage ne doit pas dupliquer les snapshots ou créer des incohérences.

Règles possibles :

- vérifier si un snapshot existe déjà ;

- utiliser des contraintes uniques ;

- refuser de réarchiver une saison ARCHIVED ;

- prévoir un mode force réservé admin si nécessaire.

## 18 Cas d'erreur

### 18.1 Aucune saison active

Problème : le système ne trouve pas de saison active.

Solution :

- logger une erreur technique ;

- ne pas synchroniser les statistiques ;

- afficher un message contrôlé côté utilisateur ;

- créer une saison active via admin ou seed.

### 18.2 Plusieurs saisons actives

Problème : anomalie critique.

Solution :

- bloquer l'archivage ;

- remonter une alerte ;

- corriger manuellement les statuts ;

- ajouter une contrainte ou vérification côté application.

### 18.3 Échec du calcul leaderboard

Problème : impossible de générer un classement final.

Solution :

- garder la saison en CLOSED ;

- ne pas passer en ARCHIVED ;

- permettre une relance du job ;

- conserver les logs d'erreur sans données sensibles.

### 18.4 Échec Redis

Problème : Redis indisponible pendant l'archivage.

Solution :

- l'archive durable doit continuer si PostgreSQL fonctionne ;

- le cache Redis peut être reconstruit plus tard ;

- ne pas dépendre de Redis comme source principale d'archive.

### 18.5 API externe indisponible au moment de fin de saison

Problème : les stats ne peuvent pas être rafraîchies juste avant l'archive.

Solution :

- utiliser les dernières statistiques disponibles ;

- afficher lastSyncAt ;

- ne pas bloquer l'archivage ;

- prévoir une synchronisation manuelle avant fin de saison si nécessaire.

## 19 Sécurité et confidentialité

### 19.1 Données à ne jamais archiver

Ne jamais archiver dans les snapshots :

- mot de passe ;

- hash de mot de passe ;

- email si non nécessaire ;

- tokens externes ;

- refresh tokens ;

- clés de session ;

- messages privés ;

- secrets techniques.

### 19.2 Données personnelles dans les archives

Les archives peuvent contenir :

- userId ;

- usernameSnapshot ;

- avatarSnapshot optionnel.

Point de vigilance :

Si un utilisateur supprime son compte, les données historiques doivent être supprimées ou anonymisées selon la règle RGPD retenue.

### 19.3 Anonymisation

En cas de suppression de compte, il est possible de conserver les statistiques historiques en remplaçant l'identité par :

- Utilisateur supprimé ;

- userId anonymisé ;

- avatar supprimé.

## 20 Mode démo

### 20.1 Objectif

Le mode démo doit inclure plusieurs saisons archivées pour montrer que l'historique fonctionne.

### 20.2 Données de démo recommandées

Créer au minimum :

- une saison active ;

- deux saisons archivées ;

- 15 à 30 joueurs fictifs ;

- 4 à 8 équipes fictives ;

- plusieurs jeux ;

- des statistiques cohérentes ;

- des leaderboards solo remplis ;

- des leaderboards d'équipe remplis.

### 20.3 Scénario de démonstration

Pendant la soutenance, montrer :

1. La saison active sur le dashboard.

2. Le score actuel du joueur.

3. Le leaderboard courant.

4. La page Saisons.

5. Une saison archivée.

6. Le classement final d'une ancienne saison.

7. L'évolution du joueur entre deux saisons si disponible.

## 21 Exemple de données archivées

### 21.1 Exemple joueur

Saison : 2026-Q1

Joueur : NovaPlayer

Jeu : Valorant ou jeu fictif

Victoires : 42

Défaites : 28

Kills : 830

Deaths : 510

Parties : 70

K/D : 1,63

Winrate : 60 %

Score final : 141,5

Rang final : 12

Éligible : oui

### 21.2 Exemple équipe

Saison : 2026-Q1

Équipe : Shadow Wolves

Tag : SW

Membres : 5

Score total : 640

Score moyen : 128

K/D moyen : 1,42

Winrate moyen : 57 %

Meilleur joueur : NovaPlayer

Rang final : 3

## 22 Requêtes SQL indicatives

### 22.1 Récupérer la saison active

SELECT *

FROM seasons

WHERE status = 'ACTIVE'

LIMIT 1;

### 22.2 Récupérer les statistiques d'un utilisateur par saison

SELECT *

FROM player_stats

WHERE user_id = :userId

AND season_id = :seasonId;

### 22.3 Générer un leaderboard solo

SELECT user_id, score, kd_ratio, winrate, matches_played

FROM player_stats

WHERE season_id = :seasonId

AND game_id = :gameId

AND is_eligible = true

ORDER BY score DESC;

### 22.4 Récupérer un leaderboard archivé

SELECT *

FROM leaderboard_snapshot_entries

WHERE snapshot_id = :snapshotId

ORDER BY rank ASC;

### 22.5 Récupérer les performances historiques d'une équipe

SELECT *

FROM archived_team_stats

WHERE team_id = :teamId

ORDER BY archived_at DESC;

## 23 Plan d'implémentation recommandé

Phase 1 — Modèle de données

- créer la table seasons ;

- ajouter seasonId aux statistiques ;

- créer team_season_stats ;

- préparer les tables d'archives.

Phase 2 — Saison active

- créer une saison active par défaut ;

- rattacher les stats à la saison active ;

- afficher la saison sur le dashboard.

Phase 3 — Leaderboards par saison

- filtrer les leaderboards par seasonId ;

- gérer l'éligibilité ;

- trier les scores.

Phase 4 — Archivage manuel

- créer un endpoint admin d'archivage ;

- générer les snapshots ;

- vérifier le résultat.

Phase 5 — Archivage automatique

- ajouter une tâche planifiée ;

- clôturer automatiquement les saisons terminées ;

- activer la saison suivante.

Phase 6 — Mode démo

- créer plusieurs saisons fictives ;

- générer des archives ;

- afficher les anciennes saisons dans l'application.

## 24 Critères d'acceptation

Le système d'archivage trimestriel est considéré comme fonctionnel si :

- une saison active existe ;

- les statistiques sont liées à une saison ;

- le dashboard affiche la saison courante ;

- les leaderboards sont filtrables par saison ;

- une saison terminée peut être archivée ;

- les statistiques joueur sont conservées après archivage ;

- les leaderboards solo sont figés ;

- les leaderboards d'équipe sont figés ;

- les statistiques d'équipe sont conservées ;

- la composition des équipes peut être sauvegardée ;

- les anciennes saisons sont consultables ;

- une nouvelle saison peut démarrer ;

- les archives ne sont pas modifiées par les futures synchronisations ;

- les données sensibles ne sont pas copiées dans les archives ;

- le mode démo contient au moins une saison archivée.

## 25 Risques et solutions

### 25.1 Risque : oubli de rattacher les stats à une saison

Impact : impossible de filtrer correctement l'historique.

Solution : rendre seasonId obligatoire dans player_stats.

### 25.2 Risque : double saison active

Impact : statistiques incohérentes.

Solution : contrainte applicative et vérification avant activation.

### 25.3 Risque : archive partielle

Impact : historique incomplet.

Solution : transactions et statut CLOSED avant ARCHIVED.

### 25.4 Risque : leaderboards recalculés différemment plus tard

Impact : l'ancien classement peut changer.

Solution : stocker des snapshots figés.

### 25.5 Risque : données privées conservées inutilement

Impact : problème de confidentialité.

Solution : limiter les champs archivés et prévoir anonymisation.

### 25.6 Risque : API externe indisponible en fin de saison

Impact : stats pas parfaitement à jour.

Solution : utiliser les dernières données disponibles et afficher lastSyncAt.

## 26 Conclusion

Le système d'archivage trimestriel est un élément central de Track'N Share. Il transforme les statistiques courantes en historique exploitable et donne du sens aux saisons, aux leaderboards et à la progression des joueurs.

La solution recommandée consiste à :

- utiliser une table seasons ;

- rattacher toutes les statistiques à une saison ;

- calculer les scores finaux à la clôture ;

- créer des snapshots de leaderboards ;

- archiver les statistiques individuelles et collectives ;

- conserver la composition des équipes ;

- démarrer automatiquement une nouvelle saison ;

- éviter de copier des données sensibles ;

- prévoir des données de démo avec plusieurs saisons.

Pour le MVP, il est suffisant de gérer une saison active, une ou deux saisons archivées de démonstration, un leaderboard solo archivé et un leaderboard d'équipe archivé. Les automatisations complètes peuvent être ajoutées progressivement après validation du fonctionnement de base.
