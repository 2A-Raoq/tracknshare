# STRATÉGIES D'INDEXATION

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit les stratégies d'indexation recommandées pour la base de données de Track'N Share.

L'objectif est de garantir de bonnes performances sur les requêtes les plus importantes du projet : authentification, profils, statistiques, scores, leaderboards, saisons, équipes, invitations, chat, recherche et archives trimestrielles.

Track'N Share manipule beaucoup de données liées entre elles : utilisateurs, jeux, statistiques, saisons, équipes, membres, messages et classements. Une mauvaise indexation peut ralentir fortement l'application, surtout sur les dashboards, leaderboards et historiques de saisons.

Ce document sert de référence pour :

- concevoir la base de données ;

- préparer les migrations ;

- optimiser les requêtes ;

- définir les contraintes d'unicité ;

- éviter les doublons ;

- améliorer les performances ;

- préparer les futures évolutions.

## 1 Principes généraux d'indexation

### 1.1 Définition

Un index est une structure utilisée par la base de données pour retrouver plus rapidement certaines lignes.

Sans index, la base peut devoir parcourir toute une table pour trouver une donnée. Avec un index adapté, elle peut accéder beaucoup plus vite aux lignes concernées.

### 1.2 Pourquoi indexer Track'N Share

Track'N Share doit souvent rechercher ou trier des données selon :

- un utilisateur ;

- un jeu ;

- une saison ;

- une équipe ;

- un score ;

- un rang ;

- une conversation ;

- une date ;

- un statut.

Les index permettent donc d'améliorer :

- le chargement du dashboard ;

- l'affichage des leaderboards ;

- la recherche de profils ;

- l'accès aux équipes ;

- l'historique des saisons ;

- l'affichage du chat ;

- les vérifications d'authentification.

### 1.3 Attention aux index inutiles

Un index accélère les lectures, mais peut ralentir les écritures.

Chaque insertion, mise à jour ou suppression doit maintenir les index associés. Il ne faut donc pas indexer toutes les colonnes sans réflexion.

Règle générale :

Indexer les colonnes utilisées fréquemment dans :

- WHERE ;

- JOIN ;

- ORDER BY ;

- GROUP BY ;

- contraintes UNIQUE ;

- recherches textuelles.

## 2 Base cible recommandée

### 2.1 PostgreSQL

PostgreSQL est recommandé comme base principale pour Track'N Share.

Il permet :

- les index classiques B-tree ;

- les index composés ;

- les index uniques ;

- les index partiels ;

- les index sur dates ;

- les index pour recherche textuelle ;

- les contraintes relationnelles.

### 2.2 Redis

Redis peut être utilisé en complément pour :

- cache de leaderboards ;

- classement rapide ;

- sessions ;

- rate limiting ;

- données temporaires ;

- Socket.io ou pub/sub.

Redis ne remplace pas forcément PostgreSQL pour les données durables. Les index durables doivent principalement être pensés côté PostgreSQL.

### 2.3 Redis-JSON

Si Redis-JSON est utilisé, l'indexation doit être pensée via conventions de clés et éventuellement RediSearch si disponible.

Cependant, pour le projet Track'N Share, PostgreSQL reste plus adapté aux relations complexes.

## 3 Types d'index utiles

### 3.1 Index B-tree

Type d'index par défaut dans PostgreSQL.

Utilisation :

- égalité ;

- comparaison ;

- tri ;

- dates ;

- identifiants.

Exemples :

- email utilisateur ;

- userId ;

- teamId ;

- seasonId ;

- gameId ;

- score ;

- createdAt.

### 3.2 Index unique

Empêche les doublons.

Utilisation :

- email unique ;

- pseudo unique si la règle est retenue ;

- code d'invitation unique ;

- couple userId + gameId + seasonId pour les statistiques.

### 3.3 Index composé

Index sur plusieurs colonnes.

Utilisation :

- requêtes filtrées par plusieurs champs ;

- leaderboards par jeu et saison ;

- stats par utilisateur, jeu et saison ;

- messages par conversation et date.

Exemple :

Index sur (gameId, seasonId, score DESC) pour afficher un leaderboard.

### 3.4 Index partiel

Index appliqué uniquement à certaines lignes.

Utilisation :

- indexer seulement les utilisateurs actifs ;

- indexer seulement les notifications non lues ;

- indexer seulement les joueurs éligibles au leaderboard.

Exemple :

Index sur player_stats uniquement lorsque isEligible = true.

### 3.5 Index sur texte

Utile pour la recherche de joueurs, équipes ou jeux.

Utilisation :

- recherche par pseudo ;

- recherche par nom d'équipe ;

- recherche par tag ;

- recherche par nom de jeu.

Pour le MVP, un index simple sur les champs normalisés peut suffire. Pour une recherche avancée, PostgreSQL full-text search ou trigram peut être envisagé.

## 4 Tables principales et index recommandés

### 4.1 Table users

Rôle : stocker les comptes utilisateurs.

Colonnes fréquentes :

- id ;

- email ;

- username ;

- role ;

- createdAt ;

- lastLoginAt ;

- deletedAt ou disabledAt si présent.

Requêtes fréquentes :

- connexion par email ;

- récupération utilisateur par id ;

- recherche par pseudo ;

- vérification d'un email déjà utilisé ;

- filtrage des utilisateurs actifs.

Index recommandés :

- PRIMARY KEY sur id ;

- UNIQUE sur email ;

- UNIQUE ou INDEX sur username selon règle métier ;

- INDEX sur role si filtrage admin ;

- INDEX sur createdAt si liste admin ou statistiques internes ;

- INDEX partiel sur deletedAt IS NULL si soft delete.

Exemples SQL :

CREATE UNIQUE INDEX users_email_unique_idx ON users(email);

CREATE INDEX users_username_idx ON users(username);

CREATE INDEX users_created_at_idx ON users(created_at);

Si pseudo unique :

CREATE UNIQUE INDEX users_username_unique_idx ON users(username);

### 4.2 Table profiles

Rôle : stocker les informations publiques ou semi-publiques du profil.

Colonnes fréquentes :

- id ;

- userId ;

- visibility ;

- updatedAt.

Requêtes fréquentes :

- récupérer le profil d'un utilisateur ;

- rechercher des profils publics ;

- afficher un profil public.

Index recommandés :

- UNIQUE sur userId ;

- INDEX sur visibility ;

- INDEX composé sur visibility + updatedAt si liste de profils publics.

Exemples SQL :

CREATE UNIQUE INDEX profiles_user_id_unique_idx ON profiles(user_id);

CREATE INDEX profiles_visibility_idx ON profiles(visibility);

### 4.3 Table games

Rôle : stocker les jeux disponibles sur la plateforme.

Colonnes fréquentes :

- id ;

- name ;

- platform ;

- isActive ;

- createdAt.

Requêtes fréquentes :

- lister les jeux actifs ;

- rechercher un jeu par nom ;

- filtrer par plateforme.

Index recommandés :

- PRIMARY KEY sur id ;

- INDEX sur name ;

- INDEX sur platform ;

- INDEX partiel sur isActive = true.

Exemples SQL :

CREATE INDEX games_name_idx ON games(name);

CREATE INDEX games_platform_idx ON games(platform);

CREATE INDEX games_active_idx ON games(id) WHERE is_active = true;

### 4.4 Table game_accounts

Rôle : stocker les comptes de jeu liés aux utilisateurs.

Colonnes fréquentes :

- id ;

- userId ;

- gameId ;

- platform ;

- externalId ;

- externalUsername ;

- lastSyncAt ;

- linkedAt.

Requêtes fréquentes :

- récupérer les comptes de jeu d'un utilisateur ;

- vérifier si un compte externe est déjà lié ;

- synchroniser les statistiques ;

- afficher la date de dernière synchronisation.

Index recommandés :

- INDEX sur userId ;

- INDEX sur gameId ;

- INDEX composé sur userId + gameId ;

- UNIQUE sur platform + externalId si un compte externe ne doit être lié qu'une fois ;

- INDEX sur lastSyncAt pour les synchronisations planifiées.

Exemples SQL :

CREATE INDEX game_accounts_user_id_idx ON game_accounts(user_id);

CREATE INDEX game_accounts_game_id_idx ON game_accounts(game_id);

CREATE INDEX game_accounts_user_game_idx ON game_accounts(user_id, game_id);

CREATE UNIQUE INDEX game_accounts_platform_external_unique_idx ON game_accounts(platform, external_id);

CREATE INDEX game_accounts_last_sync_idx ON game_accounts(last_sync_at);

### 4.5 Table seasons

Rôle : stocker les saisons trimestrielles.

Colonnes fréquentes :

- id ;

- code ;

- name ;

- startDate ;

- endDate ;

- status ;

- archivedAt.

Requêtes fréquentes :

- trouver la saison active ;

- lister les saisons ;

- consulter une saison par code ;

- trouver les saisons terminées à archiver.

Index recommandés :

- UNIQUE sur code ;

- INDEX sur status ;

- INDEX sur startDate ;

- INDEX sur endDate ;

- INDEX partiel sur status = 'ACTIVE'.

Exemples SQL :

CREATE UNIQUE INDEX seasons_code_unique_idx ON seasons(code);

CREATE INDEX seasons_status_idx ON seasons(status);

CREATE INDEX seasons_end_date_idx ON seasons(end_date);

CREATE INDEX seasons_active_idx ON seasons(id) WHERE status = 'ACTIVE';

Point important :

La règle « une seule saison active » peut être renforcée par un index unique partiel :

CREATE UNIQUE INDEX seasons_one_active_unique_idx ON seasons(status) WHERE status = 'ACTIVE';

### 4.6 Table player_stats

Rôle : stocker les statistiques d'un joueur par jeu et saison.

Colonnes fréquentes :

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

- lastSyncAt.

Requêtes fréquentes :

- dashboard utilisateur ;

- statistiques par utilisateur ;

- leaderboard par jeu et saison ;

- historique de stats ;

- calcul de score ;

- vérification d'éligibilité.

Index recommandés :

- INDEX sur userId ;

- INDEX sur gameId ;

- INDEX sur seasonId ;

- INDEX composé sur userId + gameId + seasonId ;

- UNIQUE possible sur userId + gameId + seasonId ;

- INDEX composé sur gameId + seasonId + score DESC ;

- INDEX partiel sur gameId + seasonId + score DESC WHERE isEligible = true ;

- INDEX sur lastSyncAt.

Exemples SQL :

CREATE INDEX player_stats_user_id_idx ON player_stats(user_id);

CREATE INDEX player_stats_game_id_idx ON player_stats(game_id);

CREATE INDEX player_stats_season_id_idx ON player_stats(season_id);

CREATE UNIQUE INDEX player_stats_user_game_season_unique_idx ON player_stats(user_id, game_id, season_id);

CREATE INDEX player_stats_leaderboard_idx ON player_stats(game_id, season_id, score DESC);

CREATE INDEX player_stats_eligible_leaderboard_idx ON player_stats(game_id, season_id, score DESC) WHERE is_eligible = true;

CREATE INDEX player_stats_last_sync_idx ON player_stats(last_sync_at);

Index prioritaire MVP :

L'index le plus important pour les performances est :

(gameId, seasonId, score DESC) avec filtre isEligible = true.

### 4.7 Table teams

Rôle : stocker les équipes.

Colonnes fréquentes :

- id ;

- name ;

- tag ;

- ownerId ;

- inviteCode ;

- visibility ;

- createdAt ;

- deletedAt.

Requêtes fréquentes :

- récupérer une équipe par id ;

- récupérer les équipes d'un capitaine ;

- rejoindre une équipe par code ;

- rechercher une équipe par nom ou tag ;

- afficher les équipes publiques.

Index recommandés :

- PRIMARY KEY sur id ;

- INDEX sur ownerId ;

- UNIQUE sur inviteCode ;

- INDEX sur name ;

- INDEX sur tag ;

- INDEX sur visibility ;

- UNIQUE sur tag si la règle métier l'impose ;

- INDEX partiel sur deletedAt IS NULL si soft delete.

Exemples SQL :

CREATE INDEX teams_owner_id_idx ON teams(owner_id);

CREATE UNIQUE INDEX teams_invite_code_unique_idx ON teams(invite_code);

CREATE INDEX teams_name_idx ON teams(name);

CREATE INDEX teams_tag_idx ON teams(tag);

CREATE INDEX teams_visibility_idx ON teams(visibility);

### 4.8 Table team_members

Rôle : stocker les membres d'une équipe.

Colonnes fréquentes :

- id ;

- teamId ;

- userId ;

- role ;

- joinedAt ;

- leftAt.

Requêtes fréquentes :

- lister les membres d'une équipe ;

- vérifier si un utilisateur est membre d'une équipe ;

- récupérer les équipes d'un utilisateur ;

- vérifier les permissions d'équipe ;

- empêcher un doublon membre.

Index recommandés :

- INDEX sur teamId ;

- INDEX sur userId ;

- INDEX composé sur teamId + userId ;

- UNIQUE sur teamId + userId pour éviter les doublons actifs ;

- INDEX composé sur userId + role si besoin ;

- INDEX partiel sur leftAt IS NULL pour membres actifs.

Exemples SQL :

CREATE INDEX team_members_team_id_idx ON team_members(team_id);

CREATE INDEX team_members_user_id_idx ON team_members(user_id);

CREATE UNIQUE INDEX team_members_team_user_unique_idx ON team_members(team_id, user_id);

CREATE INDEX team_members_active_team_idx ON team_members(team_id) WHERE left_at IS NULL;

CREATE INDEX team_members_active_user_idx ON team_members(user_id) WHERE left_at IS NULL;

### 4.9 Table team_invitations

Rôle : stocker les invitations d'équipe si le système va plus loin qu'un simple code.

Colonnes fréquentes :

- id ;

- teamId ;

- invitedUserId ;

- invitedByUserId ;

- status ;

- code ;

- expiresAt ;

- createdAt.

Requêtes fréquentes :

- vérifier une invitation ;

- lister les invitations reçues ;

- lister les invitations d'une équipe ;

- expirer les invitations.

Index recommandés :

- INDEX sur teamId ;

- INDEX sur invitedUserId ;

- INDEX sur status ;

- UNIQUE sur code ;

- INDEX sur expiresAt ;

- INDEX composé sur invitedUserId + status.

Exemples SQL :

CREATE INDEX team_invitations_team_id_idx ON team_invitations(team_id);

CREATE INDEX team_invitations_invited_user_idx ON team_invitations(invited_user_id);

CREATE INDEX team_invitations_status_idx ON team_invitations(status);

CREATE UNIQUE INDEX team_invitations_code_unique_idx ON team_invitations(code);

CREATE INDEX team_invitations_expires_at_idx ON team_invitations(expires_at);

### 4.10 Table team_season_stats

Rôle : stocker les statistiques d'une équipe sur une saison.

Colonnes fréquentes :

- id ;

- teamId ;

- gameId ;

- seasonId ;

- memberCount ;

- totalScore ;

- averageScore ;

- averageKdRatio ;

- averageWinrate ;

- bestPlayerId ;

- finalRank.

Requêtes fréquentes :

- page équipe ;

- leaderboard d'équipe ;

- historique d'équipe ;

- comparaison d'équipes par saison.

Index recommandés :

- INDEX sur teamId ;

- INDEX sur gameId ;

- INDEX sur seasonId ;

- INDEX composé sur teamId + gameId + seasonId ;

- UNIQUE sur teamId + gameId + seasonId ;

- INDEX composé sur gameId + seasonId + averageScore DESC.

Exemples SQL :

CREATE INDEX team_season_stats_team_id_idx ON team_season_stats(team_id);

CREATE INDEX team_season_stats_game_id_idx ON team_season_stats(game_id);

CREATE INDEX team_season_stats_season_id_idx ON team_season_stats(season_id);

CREATE UNIQUE INDEX team_season_stats_unique_idx ON team_season_stats(team_id, game_id, season_id);

CREATE INDEX team_season_stats_leaderboard_idx ON team_season_stats(game_id, season_id, average_score DESC);

### 4.11 Table conversations

Rôle : stocker les conversations, notamment chat d'équipe ou messages privés.

Colonnes fréquentes :

- id ;

- type ;

- teamId ;

- createdAt ;

- updatedAt.

Requêtes fréquentes :

- retrouver la conversation d'une équipe ;

- lister les conversations d'un utilisateur en bonus ;

- charger l'historique.

Index recommandés :

- INDEX sur type ;

- UNIQUE sur teamId pour conversation d'équipe si une seule conversation par équipe ;

- INDEX sur updatedAt pour trier les conversations récentes.

Exemples SQL :

CREATE INDEX conversations_type_idx ON conversations(type);

CREATE UNIQUE INDEX conversations_team_unique_idx ON conversations(team_id) WHERE team_id IS NOT NULL;

CREATE INDEX conversations_updated_at_idx ON conversations(updated_at DESC);

### 4.12 Table messages

Rôle : stocker les messages de chat.

Colonnes fréquentes :

- id ;

- conversationId ;

- senderId ;

- contentEncrypted ou content ;

- createdAt ;

- editedAt ;

- deletedAt.

Requêtes fréquentes :

- charger les derniers messages d'une conversation ;

- paginer l'historique ;

- afficher les messages par date ;

- supprimer ou masquer un message.

Index recommandés :

- INDEX sur conversationId ;

- INDEX sur senderId ;

- INDEX composé sur conversationId + createdAt DESC ;

- INDEX partiel sur deletedAt IS NULL si soft delete ;

- INDEX composé sur conversationId + deletedAt + createdAt si beaucoup de messages supprimés.

Exemples SQL :

CREATE INDEX messages_conversation_id_idx ON messages(conversation_id);

CREATE INDEX messages_sender_id_idx ON messages(sender_id);

CREATE INDEX messages_conversation_created_idx ON messages(conversation_id, created_at DESC);

CREATE INDEX messages_not_deleted_idx ON messages(conversation_id, created_at DESC) WHERE deleted_at IS NULL;

Index prioritaire MVP :

(conversationId, createdAt DESC) est indispensable pour afficher rapidement l'historique du chat.

### 4.13 Table notifications

Rôle : stocker les notifications internes.

Colonnes fréquentes :

- id ;

- userId ;

- type ;

- title ;

- content ;

- readAt ;

- createdAt.

Requêtes fréquentes :

- lister les notifications d'un utilisateur ;

- compter les notifications non lues ;

- marquer comme lue.

Index recommandés :

- INDEX sur userId ;

- INDEX composé sur userId + createdAt DESC ;

- INDEX partiel sur userId WHERE readAt IS NULL ;

- INDEX sur type si filtres par type.

Exemples SQL :

CREATE INDEX notifications_user_id_idx ON notifications(user_id);

CREATE INDEX notifications_user_created_idx ON notifications(user_id, created_at DESC);

CREATE INDEX notifications_unread_idx ON notifications(user_id) WHERE read_at IS NULL;

CREATE INDEX notifications_type_idx ON notifications(type);

### 4.14 Table achievements

Rôle : stocker les badges et achievements disponibles.

Colonnes fréquentes :

- id ;

- code ;

- name ;

- condition ;

- points.

Index recommandés :

- UNIQUE sur code ;

- INDEX sur name.

Exemples SQL :

CREATE UNIQUE INDEX achievements_code_unique_idx ON achievements(code);

CREATE INDEX achievements_name_idx ON achievements(name);

### 4.15 Table user_achievements

Rôle : stocker les badges obtenus par les utilisateurs.

Colonnes fréquentes :

- id ;

- userId ;

- achievementId ;

- unlockedAt.

Index recommandés :

- INDEX sur userId ;

- INDEX sur achievementId ;

- UNIQUE sur userId + achievementId pour éviter les doublons.

Exemples SQL :

CREATE INDEX user_achievements_user_id_idx ON user_achievements(user_id);

CREATE INDEX user_achievements_achievement_id_idx ON user_achievements(achievement_id);

CREATE UNIQUE INDEX user_achievements_unique_idx ON user_achievements(user_id, achievement_id);

### 4.16 Tables d'archives

Tables concernées :

- archived_player_stats ;

- archived_team_stats ;

- leaderboard_snapshots ;

- leaderboard_snapshot_entries ;

- team_member_season_snapshots.

Requêtes fréquentes :

- consulter les anciennes stats d'un joueur ;

- consulter un leaderboard archivé ;

- consulter l'historique d'équipe ;

- afficher les saisons passées.

Index recommandés :

- archived_player_stats : userId, seasonId, gameId ;

- archived_team_stats : teamId, seasonId, gameId ;

- leaderboard_snapshots : seasonId, gameId, type ;

- leaderboard_snapshot_entries : snapshotId, rank ;

- team_member_season_snapshots : teamId, seasonId, userId.

Exemples SQL :

CREATE INDEX archived_player_stats_user_idx ON archived_player_stats(user_id);

CREATE INDEX archived_player_stats_season_game_idx ON archived_player_stats(season_id, game_id);

CREATE INDEX archived_team_stats_team_idx ON archived_team_stats(team_id);

CREATE INDEX archived_team_stats_season_game_idx ON archived_team_stats(season_id, game_id);

CREATE INDEX leaderboard_snapshots_lookup_idx ON leaderboard_snapshots(season_id, game_id, type);

CREATE INDEX leaderboard_entries_snapshot_rank_idx ON leaderboard_snapshot_entries(snapshot_id, rank ASC);

CREATE INDEX team_member_snapshots_team_season_idx ON team_member_season_snapshots(team_id, season_id);

## 5 Index spécifiques aux leaderboards

### 5.1 Problème à résoudre

Les leaderboards sont l'une des fonctionnalités les plus sensibles en performance.

Ils nécessitent de :

- filtrer par jeu ;

- filtrer par saison ;

- exclure les joueurs non éligibles ;

- trier par score décroissant ;

- paginer les résultats ;

- afficher le rang.

### 5.2 Index leaderboard solo courant

Index recommandé :

CREATE INDEX player_stats_eligible_leaderboard_idx

ON player_stats(game_id, season_id, score DESC)

WHERE is_eligible = true;

Pourquoi :

- game_id filtre le jeu ;

- season_id filtre la saison ;

- score DESC accélère le tri ;

- WHERE is_eligible = true limite l'index aux joueurs classables.

### 5.3 Index leaderboard équipe courant

Index recommandé :

CREATE INDEX team_season_stats_leaderboard_idx

ON team_season_stats(game_id, season_id, average_score DESC);

Si le classement utilise le score total :

CREATE INDEX team_season_stats_total_score_idx

ON team_season_stats(game_id, season_id, total_score DESC);

### 5.4 Leaderboards archivés

Les leaderboards archivés doivent être stockés en snapshot avec le rang déjà calculé.

Index recommandé :

CREATE INDEX leaderboard_entries_snapshot_rank_idx

ON leaderboard_snapshot_entries(snapshot_id, rank ASC);

Pourquoi :

L'affichage d'un ancien leaderboard devient très rapide : on récupère les entrées d'un snapshot déjà triées par rang.

### 5.5 Pagination

Pour les leaderboards longs, éviter de charger toutes les entrées.

Approches :

- pagination classique LIMIT / OFFSET ;

- pagination par curseur si nécessaire ;

- cache Redis pour top 100.

Pour le MVP, LIMIT / OFFSET suffit.

## 6 Index pour le dashboard

### 6.1 Données nécessaires

Le dashboard doit afficher :

- utilisateur connecté ;

- profil ;

- stats de la saison active ;

- score ;

- rang ;

- équipe active ;

- saison courante ;

- dernière synchronisation.

### 6.2 Index nécessaires

Index importants :

- users.id ;

- profiles.userId ;

- player_stats.userId + seasonId ;

- team_members.userId ;

- seasons.status ;

- player_stats.gameId + seasonId + score DESC pour calcul du rang.

Exemples :

CREATE INDEX player_stats_dashboard_idx ON player_stats(user_id, season_id);

CREATE INDEX team_members_user_active_idx ON team_members(user_id) WHERE left_at IS NULL;

CREATE INDEX seasons_active_idx ON seasons(id) WHERE status = 'ACTIVE';

### 6.3 Calcul du rang

Calculer le rang en temps réel peut coûter cher si la table est grande.

Pour le MVP :

- calculer le rang à partir du leaderboard filtré ;

- limiter la taille des données ;

- éventuellement stocker finalRank en fin de saison.

Évolution :

- stocker un rang courant recalculé périodiquement ;

- utiliser Redis sorted sets pour les leaderboards courants.

## 7 Index pour la recherche

### 7.1 Recherche joueur

Recherche prévue : pseudo utilisateur.

Index simple :

CREATE INDEX users_username_idx ON users(username);

Si recherche insensible à la casse :

- stocker un champ username_normalized ;

- indexer username_normalized.

Exemple :

CREATE INDEX users_username_normalized_idx ON users(username_normalized);

### 7.2 Recherche équipe

Recherche prévue : nom ou tag d'équipe.

Index recommandés :

CREATE INDEX teams_name_idx ON teams(name);

CREATE INDEX teams_tag_idx ON teams(tag);

Si recherche insensible à la casse :

- ajouter name_normalized ;

- ajouter tag_normalized.

### 7.3 Recherche jeu

Index recommandés :

CREATE INDEX games_name_idx ON games(name);

CREATE INDEX games_platform_idx ON games(platform);

### 7.4 Recherche avancée

Pour une recherche plus souple :

- PostgreSQL full-text search ;

- extension pg_trgm ;

- moteur externe plus tard si nécessaire.

Pour le MVP, les champs normalisés et index B-tree suffisent.

## 8 Contraintes d'unicité

### 8.1 Pourquoi utiliser des contraintes uniques

Les contraintes uniques protègent l'intégrité des données.

Elles évitent :

- emails dupliqués ;

- pseudos dupliqués si interdits ;

- doublons de stats par saison ;

- doublons de membres dans une équipe ;

- codes d'invitation dupliqués ;

- badges attribués plusieurs fois.

### 8.2 Contraintes recommandées

Utilisateurs :

- email unique ;

- username unique si règle retenue.

Statistiques :

- userId + gameId + seasonId unique.

Équipes :

- inviteCode unique ;

- tag unique si règle retenue.

Membres :

- teamId + userId unique.

Badges :

- userId + achievementId unique.

Saisons :

- code unique ;

- une seule saison active via index unique partiel.

## 9 Index et soft delete

### 9.1 Définition

Le soft delete consiste à ne pas supprimer physiquement une ligne, mais à remplir un champ deletedAt.

### 9.2 Avantages

- conserver un historique ;

- permettre une restauration ;

- éviter certaines pertes accidentelles.

### 9.3 Inconvénients

- toutes les requêtes doivent filtrer deletedAt IS NULL ;

- les index doivent tenir compte des lignes actives.

### 9.4 Index partiels recommandés

Exemples :

CREATE INDEX users_active_idx ON users(id) WHERE deleted_at IS NULL;

CREATE INDEX teams_active_idx ON teams(id) WHERE deleted_at IS NULL;

CREATE INDEX messages_not_deleted_idx ON messages(conversation_id, created_at DESC) WHERE deleted_at IS NULL;

## 10 Index et archivage trimestriel

### 10.1 Besoins

L'archivage nécessite de retrouver rapidement :

- la saison active ;

- les stats d'une saison ;

- les joueurs éligibles ;

- les équipes d'une saison ;

- les snapshots archivés ;

- les rangs archivés.

### 10.2 Index prioritaires

Saisons :

- status ;

- endDate ;

- active unique.

Stats joueur :

- seasonId ;

- gameId + seasonId ;

- gameId + seasonId + score DESC.

Stats équipe :

- teamId + gameId + seasonId ;

- gameId + seasonId + averageScore DESC.

Archives :

- seasonId + gameId ;

- snapshotId + rank.

### 10.3 Requête typique

Afficher les stats archivées d'un joueur :

WHERE userId = ? AND seasonId = ?

Index recommandé :

archived_player_stats(userId, seasonId)

Afficher un leaderboard archivé :

WHERE snapshotId = ? ORDER BY rank ASC

Index recommandé :

leaderboard_snapshot_entries(snapshotId, rank)

## 11 Redis et stratégies de cache

### 11.1 Pourquoi utiliser Redis

Redis peut améliorer les performances pour :

- leaderboards courants ;

- dashboards fréquents ;

- sessions ;

- rate limiting ;

- statut en ligne ;

- données temporaires.

### 11.2 Leaderboards avec Redis Sorted Sets

Redis sorted sets sont adaptés aux classements.

Exemple de clé :

leaderboard:solo:{gameId}:{seasonId}

Chaque entrée :

- member : userId ;

- score : score joueur.

Avantages :

- récupération rapide du top N ;

- calcul de rang rapide ;

- mise à jour rapide après synchronisation.

Commandes utiles conceptuellement :

- ZADD pour ajouter ou mettre à jour un score ;

- ZREVRANGE pour récupérer le top ;

- ZREVRANK pour récupérer le rang d'un joueur.

### 11.3 Leaderboards équipe avec Redis

Clé possible :

leaderboard:team:{gameId}:{seasonId}

Entrée :

- member : teamId ;

- score : averageScore ou totalScore.

### 11.4 Cache dashboard

Clé possible :

dashboard:{userId}:{seasonId}

Durée de vie recommandée :

- courte, par exemple 1 à 5 minutes ;

- invalidation après synchronisation des stats.

### 11.5 Cache saison active

Clé possible :

season:active

Durée de vie :

- quelques minutes ;

- invalidée lors du changement de saison.

### 11.6 Règle importante

Redis est un accélérateur, pas forcément la source de vérité.

La source durable doit rester PostgreSQL pour les données importantes.

## 12 Stratégie d'invalidation du cache

### 12.1 Quand invalider

Invalider ou mettre à jour le cache lorsque :

- les statistiques d'un joueur changent ;

- un score est recalculé ;

- un membre rejoint ou quitte une équipe ;

- les statistiques d'équipe changent ;

- une saison est archivée ;

- un profil change de pseudo ou avatar si affiché dans un leaderboard courant.

### 12.2 Invalidation dashboard

Après synchronisation des stats :

- supprimer dashboard:{userId}:{seasonId} ;

- recalculer si nécessaire.

### 12.3 Invalidation leaderboard

Après recalcul d'un score :

- mettre à jour l'entrée Redis sorted set ;

- ou supprimer le cache leaderboard si la stratégie est cache classique.

### 12.4 Invalidation saison

Après passage à une nouvelle saison :

- supprimer season:active ;

- supprimer ou archiver les clés leaderboard de l'ancienne saison ;

- créer les clés de la nouvelle saison au besoin.

## 13 Index et sécurité

### 13.1 Authentification

Index indispensable :

users.email unique.

Pourquoi :

- la connexion recherche souvent l'utilisateur par email ;

- la création de compte doit vérifier l'unicité.

### 13.2 Permissions équipe

Index indispensables :

- team_members(teamId, userId) ;

- team_members(userId).

Pourquoi :

- vérifier rapidement si un utilisateur appartient à une équipe ;

- protéger les routes et rooms Socket.io.

### 13.3 Chat sécurisé

Index indispensable :

messages(conversationId, createdAt DESC)

Pourquoi :

- charger rapidement l'historique sans exposer les autres conversations.

## 14 Index et performance d'écriture

### 14.1 Effet des index sur les écritures

Plus une table possède d'index, plus les insertions et mises à jour peuvent être coûteuses.

Tables sensibles :

- player_stats : mises à jour après sync ;

- messages : insertion fréquente ;

- notifications : insertion potentiellement fréquente ;

- leaderboard entries : création en masse lors des archives.

### 14.2 Stratégie

Pour le MVP :

- garder les index essentiels ;

- éviter les index trop spécialisés ;

- ajouter des index selon les requêtes réellement lentes.

Pour l'évolution :

- analyser les requêtes avec EXPLAIN ;

- surveiller les temps de réponse ;

- ajouter des index ciblés.

## 15 Index prioritaires pour le MVP

Les index suivants sont les plus importants pour le MVP :

1. users(email) unique.

2. profiles(userId) unique.

3. seasons(status).

4. seasons(code) unique.

5. player_stats(userId, gameId, seasonId) unique.

6. player_stats(gameId, seasonId, score DESC) WHERE isEligible = true.

7. teams(inviteCode) unique.

8. team_members(teamId, userId) unique.

9. team_members(userId) WHERE leftAt IS NULL.

10. team_season_stats(teamId, gameId, seasonId) unique.

11. team_season_stats(gameId, seasonId, averageScore DESC).

12. conversations(teamId) unique si une conversation par équipe.

13. messages(conversationId, createdAt DESC).

14. leaderboard_snapshot_entries(snapshotId, rank ASC).

15. notifications(userId, createdAt DESC) si notifications dans le MVP.

## 16 Stratégie par fonctionnalité

### 16.1 Inscription / connexion

Index nécessaires :

- users.email unique ;

- users.username si recherche ou unicité.

Objectif :

- vérifier rapidement l'identité ;

- éviter les doublons.

### 16.2 Dashboard

Index nécessaires :

- profiles.userId ;

- player_stats.userId + seasonId ;

- seasons.status ;

- team_members.userId.

Objectif :

- charger rapidement les données principales de l'utilisateur.

### 16.3 Leaderboard solo

Index nécessaires :

- player_stats.gameId + seasonId + score DESC ;

- index partiel isEligible = true.

Objectif :

- trier rapidement les joueurs par score.

### 16.4 Équipes

Index nécessaires :

- teams.inviteCode ;

- team_members.teamId ;

- team_members.userId ;

- team_members.teamId + userId.

Objectif :

- rejoindre une équipe ;

- vérifier l'appartenance ;

- afficher les membres.

### 16.5 Chat

Index nécessaires :

- conversations.teamId ;

- messages.conversationId + createdAt DESC.

Objectif :

- charger rapidement les messages d'une équipe.

### 16.6 Saisons et archives

Index nécessaires :

- seasons.status ;

- seasons.endDate ;

- archived_player_stats.userId + seasonId ;

- archived_team_stats.teamId + seasonId ;

- leaderboard_snapshot_entries.snapshotId + rank.

Objectif :

- afficher les historiques rapidement.

## 17 Requêtes types et index associés

### 17.1 Connexion

Requête :

SELECT * FROM users WHERE email = :email;

Index :

users(email) unique.

### 17.2 Dashboard utilisateur

Requête :

SELECT * FROM player_stats

WHERE user_id = :userId

AND season_id = :seasonId;

Index :

player_stats(userId, seasonId).

### 17.3 Leaderboard solo

Requête :

SELECT * FROM player_stats

WHERE game_id = :gameId

AND season_id = :seasonId

AND is_eligible = true

ORDER BY score DESC

LIMIT 100;

Index :

player_stats(gameId, seasonId, score DESC) WHERE isEligible = true.

### 17.4 Rejoindre une équipe

Requête :

SELECT * FROM teams WHERE invite_code = :code;

Index :

teams(inviteCode) unique.

### 17.5 Vérifier membre équipe

Requête :

SELECT * FROM team_members

WHERE team_id = :teamId

AND user_id = :userId

AND left_at IS NULL;

Index :

team_members(teamId, userId), éventuellement partiel sur leftAt IS NULL.

### 17.6 Charger chat

Requête :

SELECT * FROM messages

WHERE conversation_id = :conversationId

AND deleted_at IS NULL

ORDER BY created_at DESC

LIMIT 50;

Index :

messages(conversationId, createdAt DESC) WHERE deletedAt IS NULL.

### 17.7 Leaderboard archivé

Requête :

SELECT * FROM leaderboard_snapshot_entries

WHERE snapshot_id = :snapshotId

ORDER BY rank ASC;

Index :

leaderboard_snapshot_entries(snapshotId, rank).

## 18 Nommage des index

### 18.1 Convention recommandée

Nommer les index de façon claire :

format : table_colonnes_type_idx

Exemples :

- users_email_unique_idx ;

- player_stats_user_game_season_unique_idx ;

- player_stats_eligible_leaderboard_idx ;

- messages_conversation_created_idx ;

- team_members_team_user_unique_idx.

### 18.2 Pourquoi nommer clairement

- facilite la maintenance ;

- facilite les migrations ;

- aide à comprendre les erreurs de contrainte ;

- rend la documentation plus lisible.

## 19 Gestion des migrations

### 19.1 Créer les index dans les migrations

Les index doivent être créés avec les migrations de base de données.

Objectif :

- environnement reproductible ;

- base cohérente sur toutes les machines ;

- déploiement plus propre.

### 19.2 Ne pas créer tous les index dès le premier jour

Pour le MVP, créer d'abord les index essentiels.

Ensuite, ajouter les index selon les besoins réels :

- requête lente ;

- volume de données élevé ;

- nouvelle fonctionnalité.

### 19.3 Vérifier les plans de requête

PostgreSQL permet d'analyser les requêtes avec EXPLAIN ou EXPLAIN ANALYZE.

Cela permet de savoir si un index est réellement utilisé.

## 20 Surveillance et amélioration

### 20.1 Indicateurs à surveiller

- temps de chargement du dashboard ;

- temps de chargement du leaderboard ;

- temps de récupération du chat ;

- temps de synchronisation des stats ;

- temps d'archivage d'une saison.

### 20.2 Quand optimiser

Optimiser si :

- une requête devient lente ;

- le leaderboard dépasse un volume important ;

- le chat contient beaucoup de messages ;

- l'archivage prend trop longtemps ;

- la recherche devient difficile.

### 20.3 Ne pas optimiser trop tôt

Pour le MVP, les volumes de données seront limités. Il faut privilégier :

- modèle clair ;

- index essentiels ;

- code maintenable ;

- données seedées réalistes.

## 21 Plan d'implémentation recommandé

Phase 1 — Index essentiels

- users.email unique ;

- users.username si nécessaire ;

- profiles.userId unique ;

- seasons.status ;

- player_stats.userId + gameId + seasonId unique ;

- teams.inviteCode unique ;

- team_members.teamId + userId unique ;

- messages.conversationId + createdAt.

Phase 2 — Index leaderboards

- player_stats.gameId + seasonId + score DESC ;

- index partiel joueurs éligibles ;

- team_season_stats.gameId + seasonId + averageScore DESC.

Phase 3 — Index archives

- archived_player_stats.userId + seasonId ;

- archived_team_stats.teamId + seasonId ;

- leaderboard_snapshot_entries.snapshotId + rank.

Phase 4 — Index recherche

- users.username_normalized ;

- teams.name_normalized ;

- teams.tag_normalized ;

- games.name.

Phase 5 — Optimisations avancées

- Redis sorted sets ;

- cache dashboard ;

- recherche full-text ;

- index partiels supplémentaires ;

- analyse EXPLAIN.

## 22 Tableau récapitulatif des index recommandés

| Table | Index recommandé | Priorité | Usage |

|---|---|---|---|

| users | email UNIQUE | P0 | Connexion, inscription |

| users | username | P1 | Recherche joueur |

| profiles | userId UNIQUE | P0 | Profil utilisateur |

| games | name | P1 | Recherche jeu |

| game_accounts | userId, gameId | P0 | Comptes liés |

| seasons | status | P0 | Saison active |

| seasons | code UNIQUE | P0 | Identification saison |

| player_stats | userId, gameId, seasonId UNIQUE | P0 | Stats par saison |

| player_stats | gameId, seasonId, score DESC WHERE isEligible | P0 | Leaderboard solo |

| teams | inviteCode UNIQUE | P0 | Rejoindre équipe |

| teams | name, tag | P1 | Recherche équipe |

| team_members | teamId, userId UNIQUE | P0 | Appartenance équipe |

| team_members | userId WHERE leftAt IS NULL | P0 | Mes équipes |

| team_season_stats | teamId, gameId, seasonId UNIQUE | P0 | Stats équipe |

| team_season_stats | gameId, seasonId, averageScore DESC | P0 | Leaderboard équipe |

| conversations | teamId UNIQUE | P0 | Chat équipe |

| messages | conversationId, createdAt DESC | P0 | Historique chat |

| notifications | userId, createdAt DESC | P1 | Notifications |

| archived_player_stats | userId, seasonId | P0 | Historique joueur |

| archived_team_stats | teamId, seasonId | P0 | Historique équipe |

| leaderboard_snapshot_entries | snapshotId, rank | P0 | Leaderboard archivé |

## 23 Risques et solutions

### 23.1 Risque : trop peu d'index

Impact : requêtes lentes sur dashboard, leaderboards et chat.

Solution : ajouter les index P0 dès la création du modèle.

### 23.2 Risque : trop d'index

Impact : insertions et mises à jour plus lentes.

Solution : commencer par les index essentiels, puis optimiser selon les besoins.

### 23.3 Risque : mauvais index leaderboard

Impact : tri très lent par score.

Solution : index composé gameId + seasonId + score DESC avec filtre isEligible.

### 23.4 Risque : doublons de données

Impact : plusieurs stats pour un même utilisateur, jeu et saison.

Solution : contrainte unique userId + gameId + seasonId.

### 23.5 Risque : chat lent

Impact : messages longs à charger.

Solution : index conversationId + createdAt DESC et pagination.

### 23.6 Risque : recherche inefficace

Impact : recherche joueur ou équipe lente.

Solution : index sur champs normalisés et recherche avancée plus tard.

### 23.7 Risque : cache Redis incohérent

Impact : leaderboard affichant un ancien score.

Solution : invalider ou mettre à jour Redis après recalcul du score.

## 24 Critères d'acceptation

La stratégie d'indexation est considérée comme correcte si :

- l'email utilisateur est unique et indexé ;

- une saison active est retrouvée rapidement ;

- un joueur ne peut pas avoir deux statistiques pour le même jeu et la même saison ;

- un code d'invitation d'équipe est unique ;

- un utilisateur ne peut pas être deux fois membre de la même équipe ;

- le leaderboard solo se filtre par jeu et saison ;

- le leaderboard solo se trie rapidement par score ;

- le leaderboard équipe se filtre par jeu et saison ;

- le chat charge les derniers messages rapidement ;

- les archives sont consultables par saison ;

- les index P0 sont créés dans les migrations ;

- les index inutiles sont évités ;

- Redis est utilisé comme cache ou accélérateur, pas comme unique source durable.

## 25 Conclusion

L'indexation est un point important pour Track'N Share, car le projet repose fortement sur les statistiques, scores, classements, équipes, saisons et messages.

Les index prioritaires doivent d'abord couvrir :

- l'authentification ;

- les statistiques par utilisateur, jeu et saison ;

- les leaderboards ;

- les équipes et membres ;

- le chat ;

- les archives de saisons.

Pour le MVP, il faut rester pragmatique : créer les index essentiels, éviter la sur-optimisation, puis ajouter progressivement des index selon les requêtes réellement lentes.

La stratégie recommandée est PostgreSQL pour les index durables et Redis pour accélérer certains accès comme les leaderboards courants, le dashboard ou les sessions.
