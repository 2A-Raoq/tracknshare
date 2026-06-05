# RÔLES ET PERMISSIONS

Projet Track'N Share

Version : 1.0

Date : 06/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit le système de rôles et permissions prévu pour Track'N Share.

Il définit les acteurs de l'application, leurs droits, les restrictions d'accès, les règles de sécurité et les contrôles à mettre en place côté back-end NestJS et côté front-end React/PWA.

L'objectif est de garantir que chaque utilisateur puisse effectuer uniquement les actions autorisées, notamment sur les profils, les statistiques, les équipes, les chats, les saisons, les leaderboards et l'administration.

## 1 Vue d'ensemble

### 1.1 Principe général

Track'N Share utilise deux familles de rôles :

1. Les rôles applicatifs globaux.

Ils définissent le niveau de permission général d'un utilisateur dans toute la plateforme.

2. Les rôles d'équipe.

Ils définissent les droits d'un utilisateur à l'intérieur d'une équipe précise.

Exemple :

Un utilisateur peut être PLAYER dans l'application, CAPTAIN dans une équipe, MEMBER dans une autre équipe, et ne pas avoir accès à une troisième équipe.

### 1.2 Règle de sécurité principale

Toutes les permissions importantes doivent être vérifiées côté back-end.

Le front-end peut masquer ou afficher des boutons selon le rôle, mais il ne doit jamais être considéré comme une source de sécurité suffisante.

### 1.3 Objectifs du système de permissions

Le système doit permettre de :

- protéger les données personnelles ;

- protéger les profils privés ;

- empêcher les actions non autorisées ;

- sécuriser le chat d'équipe ;

- gérer correctement les rôles d'équipe ;

- différencier joueur, modérateur et administrateur ;

- éviter les modifications frauduleuses de statistiques ou scores ;

- préparer les futures fonctionnalités d'administration.

## 2 Types d'utilisateurs

### 2.1 Visiteur

Définition :

Utilisateur non connecté.

Droits principaux :

- consulter la landing page ;

- consulter certains contenus publics ;

- consulter les jeux disponibles ;

- consulter les leaderboards publics ;

- accéder aux pages de connexion et d'inscription ;

- utiliser le mode démo si activé.

Restrictions :

- ne peut pas accéder au dashboard ;

- ne peut pas modifier un profil ;

- ne peut pas synchroniser des statistiques ;

- ne peut pas créer ou rejoindre une équipe ;

- ne peut pas accéder au chat ;

- ne peut pas envoyer de messages ;

- ne peut pas consulter les données privées.

### 2.2 Joueur connecté

Définition :

Utilisateur authentifié avec un compte standard.

Droits principaux :

- accéder à son dashboard ;

- consulter et modifier son profil ;

- lier un compte de jeu ;

- synchroniser ses statistiques ;

- consulter son score ;

- consulter les leaderboards ;

- consulter les saisons ;

- créer une équipe ;

- rejoindre une équipe via code ;

- consulter ses équipes ;

- quitter une équipe ;

- accéder au chat de ses équipes ;

- recevoir des notifications.

Restrictions :

- ne peut pas modifier le profil d'un autre utilisateur ;

- ne peut pas modifier les statistiques manuellement ;

- ne peut pas accéder au chat d'une équipe dont il n'est pas membre ;

- ne peut pas supprimer ou gérer une équipe s'il n'a pas le bon rôle ;

- ne peut pas accéder à l'administration.

### 2.3 Membre d'équipe

Définition :

Joueur appartenant à une équipe avec le rôle MEMBER.

Droits principaux :

- consulter la page de son équipe ;

- consulter les membres de l'équipe ;

- consulter les statistiques collectives ;

- participer au chat d'équipe ;

- quitter l'équipe ;

- consulter l'historique d'équipe si autorisé.

Restrictions :

- ne peut pas modifier l'équipe ;

- ne peut pas promouvoir un membre ;

- ne peut pas exclure un membre ;

- ne peut pas régénérer le code d'invitation si la règle ne l'autorise pas ;

- ne peut pas supprimer l'équipe.

### 2.4 Co-capitaine

Définition :

Membre d'équipe avec des droits de gestion intermédiaires.

Droits possibles :

- consulter la page équipe ;

- participer au chat ;

- inviter des membres ;

- régénérer un code d'invitation si autorisé ;

- modifier certaines informations non critiques de l'équipe ;

- gérer certains membres simples selon règle retenue.

Restrictions :

- ne peut pas supprimer l'équipe ;

- ne peut pas exclure le capitaine ;

- ne peut pas retirer le rôle du capitaine ;

- ne peut pas promouvoir un autre membre au-dessus de ses droits ;

- ne peut pas accéder à l'administration globale.

### 2.5 Capitaine

Définition :

Responsable principal d'une équipe. Par défaut, le créateur d'une équipe devient capitaine.

Droits principaux :

- modifier l'équipe ;

- générer ou régénérer le code d'invitation ;

- promouvoir un membre en co-capitaine ;

- rétrograder un co-capitaine ;

- exclure un membre ;

- gérer les invitations ;

- supprimer ou désactiver l'équipe si la fonctionnalité existe ;

- accéder au chat d'équipe ;

- modérer certains messages de l'équipe si la règle est retenue.

Restrictions :

- ne peut pas modifier les scores manuellement ;

- ne peut pas accéder aux données privées personnelles des membres ;

- ne peut pas agir sur les autres équipes ;

- ne peut pas accéder à l'administration globale sauf s'il est aussi ADMIN.

### 2.6 Modérateur

Définition :

Utilisateur ayant des droits de modération sur certains contenus.

Priorité : P2, évolution future.

Droits possibles :

- consulter les signalements ;

- masquer un message signalé ;

- traiter un signalement ;

- avertir un utilisateur ;

- accéder à certains outils de modération.

Restrictions :

- ne peut pas accéder aux secrets techniques ;

- ne peut pas modifier les rôles administrateurs ;

- ne peut pas modifier les scores ;

- ne peut pas supprimer définitivement des données sans droit admin.

### 2.7 Administrateur

Définition :

Utilisateur avec les droits les plus élevés sur la plateforme.

Priorité : P2, sauf certaines actions de maintenance nécessaires au MVP.

Droits possibles :

- gérer les utilisateurs ;

- désactiver un compte ;

- gérer les jeux disponibles ;

- déclencher l'archivage manuel d'une saison ;

- recalculer les leaderboards ;

- consulter les signalements ;

- gérer les rôles ;

- superviser les données de démonstration.

Restrictions :

- ne doit pas voir les mots de passe ;

- ne doit pas voir les tokens externes ;

- ne doit pas exposer les données privées sans justification ;

- ses actions sensibles doivent idéalement être journalisées.

## 3 Rôles applicatifs globaux

### 3.1 Liste des rôles applicatifs

PLAYER

Utilisateur standard de la plateforme.

MODERATOR

Utilisateur chargé de traiter les signalements et contenus problématiques.

ADMIN

Utilisateur disposant de droits d'administration.

SYSTEM

Rôle interne non attribué à un utilisateur classique. Utilisé pour les tâches automatiques comme l'archivage trimestriel ou les recalculs planifiés.

### 3.2 Stockage recommandé

Le rôle applicatif peut être stocké dans la table users.

Exemple :

users.role = PLAYER | MODERATOR | ADMIN

Le rôle SYSTEM ne doit pas forcément être stocké comme utilisateur classique. Il peut représenter une tâche interne sécurisée.

### 3.3 Présence du rôle dans le JWT

Le JWT peut contenir le rôle applicatif global.

Exemple :

{

"sub": "user_123",

"username": "ClementTNS",

"role": "PLAYER"

}

Attention :

Le rôle dans le JWT peut devenir obsolète si le rôle de l'utilisateur change avant l'expiration du token. Pour les actions très sensibles, il est recommandé de revérifier le rôle en base.

## 4 Rôles d'équipe

### 4.1 Liste des rôles d'équipe

CAPTAIN

Responsable principal de l'équipe.

CO_CAPTAIN

Membre avec droits de gestion partiels.

MEMBER

Membre standard.

INVITED

Utilisateur invité mais pas encore membre actif.

BANNED

Utilisateur bloqué de l'équipe, optionnel pour évolution future.

### 4.2 Stockage recommandé

Les rôles d'équipe doivent être stockés dans la table team_members.

Champs utiles :

- id ;

- teamId ;

- userId ;

- role ;

- joinedAt ;

- leftAt ;

- invitedAt ;

- bannedAt si nécessaire.

### 4.3 Pourquoi ne pas stocker les rôles d'équipe dans le JWT

Un utilisateur peut appartenir à plusieurs équipes avec des rôles différents.

Exemple :

- capitaine dans Team A ;

- membre dans Team B ;

- aucun accès à Team C.

Le JWT deviendrait trop lourd et vite obsolète. Les permissions d'équipe doivent donc être vérifiées en base au moment de l'action.

## 5 Matrice des permissions applicatives

| Action | Visiteur | Joueur | Modérateur | Admin | Système |

|---|---|---|---|---|---|

| Consulter landing page | Oui | Oui | Oui | Oui | Non |

| S'inscrire | Oui | Non | Non | Non | Non |

| Se connecter | Oui | Oui | Oui | Oui | Non |

| Consulter jeux publics | Oui | Oui | Oui | Oui | Non |

| Consulter leaderboard public | Oui | Oui | Oui | Oui | Non |

| Accéder dashboard | Non | Oui | Oui | Oui | Non |

| Modifier son profil | Non | Oui | Oui | Oui | Non |

| Modifier le profil d'un autre utilisateur | Non | Non | Non | Admin uniquement | Non |

| Lier un compte de jeu | Non | Oui | Oui | Oui | Non |

| Synchroniser ses statistiques | Non | Oui | Oui | Oui | Oui si job interne |

| Modifier manuellement ses statistiques | Non | Non | Non | Non sauf maintenance contrôlée | Oui si job |

| Créer une équipe | Non | Oui | Oui | Oui | Non |

| Rejoindre une équipe | Non | Oui | Oui | Oui | Non |

| Participer à un chat d'équipe | Non | Oui si membre | Oui si membre ou modération | Oui si membre ou admin selon règle | Non |

| Consulter notifications | Non | Oui | Oui | Oui | Non |

| Gérer les jeux | Non | Non | Non | Oui | Non |

| Archiver une saison | Non | Non | Non | Oui | Oui |

| Recalculer tous les leaderboards | Non | Non | Non | Oui | Oui |

| Consulter signalements | Non | Non | Oui | Oui | Non |

| Désactiver un compte | Non | Non | Non | Oui | Non |

## 6 Matrice des permissions d'équipe

| Action équipe | Non-membre | Membre | Co-capitaine | Capitaine | Admin |

|---|---|---|---|---|---|

| Consulter page équipe publique | Oui si publique | Oui | Oui | Oui | Oui |

| Consulter page équipe privée | Non | Oui | Oui | Oui | Oui selon règle admin |

| Voir les membres | Selon visibilité | Oui | Oui | Oui | Oui |

| Voir stats équipe | Selon visibilité | Oui | Oui | Oui | Oui |

| Rejoindre par code | Oui si connecté | Déjà membre | Déjà membre | Déjà membre | Oui si compte joueur |

| Quitter l'équipe | Non | Oui | Oui | Cas spécial | Non applicable |

| Accéder au chat | Non | Oui | Oui | Oui | Admin seulement si modération prévue |

| Envoyer un message chat | Non | Oui | Oui | Oui | Non sauf membre |

| Modifier nom/description | Non | Non | Oui si autorisé | Oui | Oui |

| Régénérer code invitation | Non | Non | Oui si autorisé | Oui | Oui |

| Inviter un membre | Non | Non | Oui | Oui | Oui |

| Promouvoir un membre | Non | Non | Non ou limité | Oui | Oui |

| Rétrograder un co-capitaine | Non | Non | Non | Oui | Oui |

| Exclure un membre | Non | Non | Oui si autorisé | Oui | Oui |

| Exclure le capitaine | Non | Non | Non | Non | Oui uniquement cas admin exceptionnel |

| Supprimer l'équipe | Non | Non | Non | Oui | Oui |

## 7 Permissions par module

### 7.1 Module Authentification

Routes publiques :

- POST /auth/register ;

- POST /auth/login ;

- POST /auth/forgot-password si activé.

Routes authentifiées :

- GET /auth/me ;

- POST /auth/logout ;

- POST /auth/refresh si activé.

Règles :

- un visiteur peut s'inscrire ;

- un utilisateur connecté ne doit pas recréer un compte depuis la même session ;

- les mots de passe ne sont jamais visibles ;

- les erreurs de login restent génériques.

### 7.2 Module Profils

Actions autorisées :

- tout utilisateur connecté peut consulter son propre profil ;

- un visiteur peut consulter un profil public ;

- un utilisateur peut modifier uniquement son propre profil ;

- un admin peut intervenir sur un profil uniquement dans un cadre d'administration/modération.

Règles :

- l'email ne doit jamais être affiché sur un profil public ;

- un profil privé masque les données sensibles ;

- les statistiques masquées ne doivent pas apparaître publiquement.

### 7.3 Module Jeux et comptes liés

Actions autorisées :

- tous les utilisateurs peuvent consulter la liste des jeux actifs ;

- un joueur connecté peut lier un compte de jeu ;

- un joueur peut délier uniquement ses propres comptes de jeu ;

- un admin peut gérer le catalogue de jeux.

Règles :

- un compte de jeu lié appartient à un seul utilisateur selon la règle retenue ;

- les tokens externes ne doivent jamais être visibles côté front ;

- un utilisateur ne peut pas synchroniser le compte d'un autre utilisateur.

### 7.4 Module Statistiques

Actions autorisées :

- un joueur peut consulter ses propres statistiques ;

- un joueur peut synchroniser ses propres statistiques ;

- un visiteur peut voir uniquement les statistiques publiques ;

- le système peut recalculer les statistiques et scores ;

- l'admin peut lancer des recalculs de maintenance.

Interdictions :

- un joueur ne peut pas modifier manuellement ses statistiques ;

- un joueur ne peut pas modifier son score ;

- un joueur ne peut pas accéder aux statistiques privées d'un autre joueur.

### 7.5 Module Leaderboards

Actions autorisées :

- les leaderboards publics peuvent être consultés par tous ;

- les leaderboards peuvent être filtrés par jeu et saison ;

- le système peut recalculer les classements ;

- un admin peut forcer un recalcul.

Règles :

- seuls les joueurs éligibles apparaissent dans le leaderboard principal ;

- les profils privés doivent être respectés ;

- les scores ne sont pas modifiables par les utilisateurs.

### 7.6 Module Saisons

Actions autorisées :

- tous les utilisateurs peuvent consulter les saisons publiques ;

- le système peut archiver automatiquement une saison ;

- un admin peut déclencher un archivage manuel ;

- un admin peut créer ou corriger une saison.

Règles :

- une seule saison peut être active ;

- les archives ne doivent pas être modifiées par des synchronisations futures ;

- les données sensibles ne doivent pas être copiées dans les snapshots.

### 7.7 Module Équipes

Actions autorisées :

- un joueur connecté peut créer une équipe ;

- le créateur devient capitaine ;

- un joueur connecté peut rejoindre une équipe avec un code valide ;

- un membre peut quitter une équipe ;

- un capitaine peut gérer son équipe ;

- un co-capitaine peut gérer certaines actions si autorisé.

Règles :

- un non-membre ne peut pas accéder aux zones privées de l'équipe ;

- un membre ne peut pas exclure un autre membre ;

- un co-capitaine ne peut pas exclure le capitaine ;

- le capitaine doit transférer son rôle ou supprimer l'équipe avant de quitter s'il est seul.

### 7.8 Module Chat

Actions autorisées :

- seuls les membres actifs d'une équipe peuvent lire son chat ;

- seuls les membres actifs peuvent envoyer un message ;

- un auteur peut éventuellement supprimer son message ;

- un capitaine ou modérateur peut masquer un message selon règle future.

Règles :

- un message vide est refusé ;

- un message doit avoir un auteur ;

- un message doit appartenir à une conversation ;

- un non-membre ne doit jamais recevoir les événements Socket.io du chat.

### 7.9 Module Notifications

Actions autorisées :

- un utilisateur peut consulter ses propres notifications ;

- un utilisateur peut marquer ses propres notifications comme lues ;

- le système peut créer des notifications ;

- un autre utilisateur ne peut pas lire les notifications d'un compte différent.

### 7.10 Module Administration

Actions autorisées admin :

- consulter les utilisateurs ;

- désactiver un compte ;

- gérer les jeux ;

- consulter les signalements ;

- déclencher l'archivage ;

- recalculer les leaderboards ;

- gérer certains paramètres de plateforme.

Règles :

- les actions admin doivent être protégées par RolesGuard ;

- les actions critiques doivent idéalement être journalisées ;

- les mots de passe, tokens et secrets ne doivent jamais être visibles.

## 8 Permissions REST API

### 8.1 Routes publiques

- POST /auth/register

- POST /auth/login

- GET /games

- GET /games/:id

- GET /leaderboards/solo

- GET /leaderboards/teams

- GET /seasons

- GET /seasons/current

- GET /profiles/:id selon visibilité

- GET /search selon visibilité

- GET /health

### 8.2 Routes authentifiées

- GET /auth/me

- POST /auth/logout

- GET /users/me

- PATCH /users/me

- GET /profiles/me

- PATCH /profiles/me

- GET /game-accounts/me

- POST /game-accounts

- DELETE /game-accounts/:id

- GET /stats/me

- POST /stats/sync

- GET /stats/me/history

- POST /teams

- GET /teams/me

- POST /teams/join

- GET /notifications/me

### 8.3 Routes membre d'équipe

- GET /teams/:id/messages

- POST /teams/:id/messages

- GET /teams/:id/stats si équipe privée

- GET /teams/:id/history si équipe privée

- Accès Socket.io à team:{teamId}

### 8.4 Routes capitaine / co-capitaine

- PATCH /teams/:id

- POST /teams/:id/invite-code/regenerate

- POST /teams/:id/invitations

- DELETE /team-invitations/:id selon règle

### 8.5 Routes capitaine uniquement

- DELETE /teams/:id

- POST /teams/:id/members/:userId/promote

- POST /teams/:id/members/:userId/demote

- DELETE /teams/:id/members/:userId

### 8.6 Routes administrateur

- POST /games

- PATCH /games/:id

- DELETE /games/:id

- GET /admin/users

- PATCH /admin/users/:id/disable

- GET /admin/reports

- PATCH /admin/reports/:id/resolve

- POST /admin/seasons/:id/archive

- POST /admin/recalculate-leaderboards

## 9 Permissions Socket.io

### 9.1 Connexion socket

Condition :

- JWT valide obligatoire.

Règle :

- un socket non authentifié est refusé ;

- le userId est récupéré depuis le token, jamais depuis le payload client.

9.2 joinTeamRoom

Permission :

- membre actif de l'équipe.

Refus si :

- utilisateur non connecté ;

- équipe introuvable ;

- utilisateur non membre ;

- utilisateur ayant quitté l'équipe ;

- équipe supprimée.

9.3 sendTeamMessage

Permission :

- membre actif de l'équipe.

Règles :

- message non vide ;

- longueur maximale ;

- sauvegarde en base ;

- diffusion uniquement à la room de l'équipe.

9.4 teamMessageDeleted

Permission :

- auteur du message ;

- capitaine selon règle ;

- modérateur selon évolution.

9.5 notificationReceived

Permission :

- envoyé uniquement dans la room personnelle user:{userId}.

## 10 Guards NestJS recommandés

### 10.1 JwtAuthGuard

Rôle : vérifier que la requête contient un JWT valide.

Utilisé sur :

- routes privées ;

- endpoints utilisateur ;

- endpoints stats ;

- endpoints équipes ;

- endpoints notifications.

### 10.2 RolesGuard

Rôle : vérifier le rôle applicatif global.

Exemple :

@Roles('ADMIN')

Utilisé sur :

- administration ;

- gestion des jeux ;

- archivage manuel ;

- recalcul global.

### 10.3 TeamMemberGuard

Rôle : vérifier que l'utilisateur est membre actif d'une équipe.

Utilisé sur :

- GET /teams/:id/messages ;

- POST /teams/:id/messages ;

- joinTeamRoom ;

- sendTeamMessage.

### 10.4 TeamRoleGuard

Rôle : vérifier le rôle de l'utilisateur dans une équipe.

Exemples :

- CAPTAIN ;

- CO_CAPTAIN ;

- MEMBER.

Utilisé sur :

- modifier une équipe ;

- régénérer le code d'invitation ;

- gérer les membres ;

- supprimer une équipe.

### 10.5 ResourceOwnerGuard

Rôle : vérifier que l'utilisateur est propriétaire de la ressource.

Utilisé sur :

- modifier son profil ;

- supprimer son compte de jeu ;

- consulter ses données privées ;

- marquer ses notifications comme lues.

## 11 Décorateurs recommandés

@CurrentUser()

Permet de récupérer l'utilisateur connecté depuis request.user.

@Roles(...roles)

Permet d'indiquer les rôles applicatifs autorisés.

@TeamRoles(...roles)

Permet d'indiquer les rôles d'équipe autorisés.

@Public()

Permet d'indiquer qu'une route est publique et ne nécessite pas JwtAuthGuard.

## 12 Règles de propriété des ressources

### 12.1 Profil

Un utilisateur peut modifier uniquement son propre profil.

Exception :

- admin dans un cadre de modération ou maintenance.

### 12.2 Compte de jeu

Un utilisateur peut lier, consulter ou supprimer uniquement ses propres comptes de jeu.

### 12.3 Statistiques

Un utilisateur peut consulter ses stats privées.

Les autres utilisateurs ne voient que les stats publiques autorisées.

### 12.4 Notification

Une notification appartient à un seul utilisateur.

Seul ce propriétaire peut la lire, la marquer comme lue ou la supprimer.

### 12.5 Message

Un message appartient à son auteur, mais il appartient aussi à une conversation.

La lecture dépend de l'accès à la conversation.

### 12.6 Équipe

Une équipe appartient fonctionnellement à son capitaine, mais contient plusieurs membres.

Les actions dépendent du rôle dans team_members.

## 13 Cas particuliers

### 13.1 Capitaine qui quitte son équipe

Problème :

Si le capitaine quitte sans transfert, l'équipe n'a plus de responsable.

Règle recommandée :

- si l'équipe contient d'autres membres, le capitaine doit transférer son rôle avant de quitter ;

- si le capitaine est seul, il peut supprimer l'équipe ou la quitter en supprimant l'équipe ;

- un admin peut corriger une équipe orpheline.

### 13.2 Équipe privée

Règle :

- les non-membres ne voient que les informations publiques minimales ;

- les membres voient les détails ;

- le chat reste toujours privé.

### 13.3 Profil privé

Règle :

- les visiteurs et autres joueurs ne voient pas les informations sensibles ;

- le propriétaire voit toujours ses propres données ;

- les leaderboards peuvent afficher un pseudo masqué selon règle retenue.

### 13.4 Utilisateur désactivé

Règle :

- ne peut plus se connecter ;

- ses tokens doivent être invalidés ou refusés ;

- ses données historiques peuvent rester visibles selon anonymisation.

### 13.5 Saison archivée

Règle :

- les archives ne sont pas modifiables par un joueur ;

- seul le système ou admin peut créer les snapshots ;

- les synchronisations futures ne modifient pas les archives.

## 14 Erreurs de permissions

AUTH_UNAUTHORIZED

Utilisateur non connecté ou token invalide.

AUTH_FORBIDDEN

Utilisateur connecté mais non autorisé.

ROLE_REQUIRED

Rôle applicatif insuffisant.

TEAM_MEMBER_REQUIRED

L'utilisateur doit être membre de l'équipe.

TEAM_ROLE_REQUIRED

Rôle d'équipe insuffisant.

RESOURCE_OWNER_REQUIRED

L'utilisateur n'est pas propriétaire de la ressource.

PROFILE_PRIVATE

Le profil est privé.

TEAM_PRIVATE

L'équipe est privée.

CHAT_NOT_TEAM_MEMBER

L'utilisateur n'est pas membre du chat d'équipe.

ADMIN_REQUIRED

Action réservée à un administrateur.

## 15 Format d'erreur recommandé

Exemple 403 :

{

"success": false,

"error": {

"code": "TEAM_ROLE_REQUIRED",

"message": "Vous n'avez pas le rôle nécessaire pour effectuer cette action.",

"details": {

"requiredRoles": ["CAPTAIN", "CO_CAPTAIN"],

"resource": "team_123"

}

}

}

Exemple 401 :

{

"success": false,

"error": {

"code": "AUTH_UNAUTHORIZED",

"message": "Vous devez être connecté pour accéder à cette ressource."

}

}

## 16 Sécurité front-end

### 16.1 Affichage conditionnel

Le front-end doit utiliser les rôles pour afficher ou masquer certaines actions.

Exemples :

- bouton Modifier équipe visible seulement pour capitaine/co-capitaine ;

- bouton Supprimer équipe visible seulement pour capitaine ;

- bouton Admin visible seulement pour admin ;

- chat visible seulement si membre.

### 16.2 Limite du front-end

Même si un bouton est masqué, l'utilisateur peut tenter d'appeler l'API manuellement.

Donc :

- le front améliore l'expérience utilisateur ;

- le back-end assure réellement la sécurité.

### 16.3 Redirections

Comportements recommandés :

- 401 → redirection vers login ;

- 403 → affichage Accès refusé ;

- profil privé → page limitée ;

- équipe privée non membre → page limitée ou erreur.

## 17 Sécurité back-end

### 17.1 Ne jamais faire confiance au client

Le back-end doit ignorer les champs sensibles envoyés par le client.

Exemple :

Un client ne doit jamais pouvoir envoyer :

{

"role": "ADMIN"

}

et obtenir un rôle admin.

### 17.2 Vérifier les rôles en base

Pour les actions d'équipe, vérifier team_members en base.

Pour les actions admin, vérifier users.role.

Pour les propriétaires de ressources, vérifier userId.

### 17.3 Journalisation des actions sensibles

Actions à journaliser idéalement :

- suppression d'équipe ;

- exclusion de membre ;

- promotion/rétrogradation ;

- désactivation de compte ;

- archivage manuel ;

- recalcul global leaderboard.

Les logs ne doivent jamais contenir de mots de passe, tokens ou secrets.

## 18 Modèle de données recommandé

### 18.1 Table users

Champs pertinents :

- id ;

- email ;

- username ;

- passwordHash ;

- role ;

- disabledAt ;

- deletedAt ;

- createdAt ;

- updatedAt.

Rôles possibles :

- PLAYER ;

- MODERATOR ;

- ADMIN.

### 18.2 Table team_members

Champs pertinents :

- id ;

- teamId ;

- userId ;

- role ;

- joinedAt ;

- leftAt ;

- invitedAt ;

- createdAt ;

- updatedAt.

Rôles possibles :

- CAPTAIN ;

- CO_CAPTAIN ;

- MEMBER ;

- INVITED.

### 18.3 Table permissions optionnelle

Pour le MVP, une table permissions dédiée n'est pas indispensable.

Évolution future :

- roles ;

- permissions ;

- role_permissions.

Cette approche RBAC complète peut être utile si le projet devient plus complexe.

## 19 RBAC et ABAC

### 19.1 RBAC

RBAC signifie Role-Based Access Control.

Principe :

Les permissions dépendent du rôle.

Exemple :

ADMIN peut gérer les jeux.

CAPTAIN peut modifier son équipe.

MEMBER peut lire le chat.

### 19.2 ABAC

ABAC signifie Attribute-Based Access Control.

Principe :

Les permissions dépendent aussi des attributs de la ressource ou de l'utilisateur.

Exemple :

Un joueur peut modifier un profil uniquement si profile.userId = currentUser.id.

Un utilisateur peut lire un chat uniquement s'il est membre actif de teamId.

### 19.3 Recommandation Track'N Share

Utiliser un mélange simple :

- RBAC pour les rôles globaux et d'équipe ;

- ABAC pour la propriété des ressources et la confidentialité.

## 20 Tests à prévoir

### 20.1 Tests unitaires back-end

Tester :

- JwtAuthGuard refuse un token invalide ;

- RolesGuard refuse un PLAYER sur route admin ;

- TeamMemberGuard accepte un membre actif ;

- TeamMemberGuard refuse un non-membre ;

- TeamRoleGuard accepte un capitaine ;

- ResourceOwnerGuard refuse un autre utilisateur.

### 20.2 Tests d'intégration API

Tester :

- accès dashboard sans token → 401 ;

- modification profil autre utilisateur → 403 ;

- création équipe par joueur connecté → 201 ;

- accès chat équipe par membre → 200 ;

- accès chat équipe par non-membre → 403 ;

- suppression équipe par membre → 403 ;

- suppression équipe par capitaine → 204 ;

- route admin par PLAYER → 403 ;

- route admin par ADMIN → 200.

### 20.3 Tests Socket.io

Tester :

- joinTeamRoom par membre ;

- joinTeamRoom par non-membre ;

- sendTeamMessage par membre ;

- sendTeamMessage par non-membre ;

- broadcast uniquement aux membres de la room.

### 20.4 Tests front-end

Tester :

- boutons masqués selon rôle ;

- affichage Accès refusé ;

- redirection login sur 401 ;

- page équipe différente selon membre/non-membre ;

- chat inaccessible à un non-membre.

## 21 Priorisation MVP

P0 indispensable :

- rôle PLAYER ;

- rôle ADMIN minimal si routes admin nécessaires ;

- rôles d'équipe CAPTAIN, CO_CAPTAIN, MEMBER ;

- JwtAuthGuard ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- ResourceOwnerGuard ;

- protection du chat ;

- protection modification profil ;

- protection comptes de jeu ;

- protection création/jointure équipe ;

- vérification back-end des permissions.

P1 important :

- modération simple ;

- invitations détaillées ;

- notifications privées ;

- paramètres de confidentialité avancés ;

- journalisation des actions sensibles.

P2 évolution :

- rôle MODERATOR complet ;

- RBAC avancé avec table permissions ;

- audit logs complets ;

- administration complète ;

- règles de bannissement ;

- gestion multi-équipes avancée.

## 22 Risques et solutions

### 22.1 Risque : permissions seulement côté front

Impact : utilisateur peut appeler l'API manuellement.

Solution : contrôles obligatoires côté back-end.

### 22.2 Risque : rôle d'équipe stocké dans le JWT

Impact : rôle obsolète si l'utilisateur est promu ou exclu.

Solution : vérifier team_members en base.

### 22.3 Risque : chat accessible aux non-membres

Impact : fuite de conversations privées.

Solution : TeamMemberGuard REST et vérification Socket.io avant joinTeamRoom.

### 22.4 Risque : utilisateur modifie une ressource d'un autre

Impact : fuite ou corruption de données.

Solution : ResourceOwnerGuard.

### 22.5 Risque : admin trop puissant sans contrôle

Impact : actions sensibles non traçables.

Solution : limiter les données visibles, journaliser les actions, ne jamais exposer les secrets.

### 22.6 Risque : capitaine quitte sans transfert

Impact : équipe sans responsable.

Solution : imposer transfert ou suppression de l'équipe.

## 23 Critères d'acceptation

Le système de rôles et permissions est considéré comme fonctionnel si :

- un visiteur ne peut pas accéder aux routes privées ;

- un joueur connecté peut accéder à son dashboard ;

- un joueur ne peut modifier que son propre profil ;

- un joueur ne peut synchroniser que ses propres statistiques ;

- un joueur peut créer une équipe et devient capitaine ;

- un membre peut accéder au chat de son équipe ;

- un non-membre ne peut pas accéder au chat ;

- un membre ne peut pas modifier ou supprimer une équipe ;

- un capitaine peut gérer son équipe ;

- un co-capitaine possède uniquement les droits définis ;

- une route admin refuse un PLAYER ;

- les contrôles sont faits côté back-end ;

- les événements Socket.io vérifient aussi les permissions ;

- les données sensibles ne sont jamais exposées par erreur.

## 24 Conclusion

Le système de rôles et permissions est essentiel pour sécuriser Track'N Share.

Le projet doit distinguer :

- les rôles applicatifs globaux : PLAYER, MODERATOR, ADMIN, SYSTEM ;

- les rôles d'équipe : CAPTAIN, CO_CAPTAIN, MEMBER, INVITED.

Pour le MVP, les priorités sont simples : protéger les routes privées, protéger les profils, protéger les statistiques, sécuriser les équipes et empêcher l'accès au chat par des non-membres.

Les fonctionnalités avancées comme la modération complète, les audit logs, le RBAC dynamique et l'administration détaillée pourront être ajoutées après stabilisation du socle principal.
