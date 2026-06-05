# CONVENTIONS DE CODE

Projet Track'N Share

Version : 1.0

Date : 08/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit les conventions de code prévues pour le développement de Track'N Share.

Il a pour objectif de garantir que le code reste lisible, cohérent, maintenable et compréhensible par toute l'équipe. Ces conventions doivent être suivies dès le début du développement afin d'éviter une dette technique trop importante.

Track'N Share étant prévu avec React, TypeScript, NestJS, Socket.io, PostgreSQL, Redis, Docker et une approche PWA, les règles ci-dessous couvrent à la fois le front-end, le back-end, les services temps réel, les modèles de données, les APIs et les aspects sécurité.

## 1 Principes généraux

### 1.1 Lisibilité avant complexité

Le code doit être écrit pour être compris facilement.

Une solution simple, claire et maintenable est préférable à une solution trop optimisée mais difficile à relire.

Règles :

- nommer clairement les variables, fonctions et fichiers ;

- éviter les abréviations obscures ;

- découper les gros fichiers ;

- limiter les fonctions trop longues ;

- éviter les conditions imbriquées excessives ;

- privilégier un code explicite.

### 1.2 Cohérence du projet

Le code doit suivre les mêmes règles partout.

Exemples :

- même style de nommage ;

- même structure de dossiers ;

- même format de réponse API ;

- même manière de gérer les erreurs ;

- même manière d'appeler les services externes.

### 1.3 Séparation des responsabilités

Chaque fichier ou classe doit avoir un rôle clair.

Exemples :

- un controller NestJS reçoit la requête et délègue au service ;

- un service contient la logique métier ;

- un repository ou ORM gère l'accès aux données ;

- un composant React affiche l'interface ;

- un hook React gère une logique réutilisable ;

- un provider externe gère uniquement une API externe.

## 2 Langage et typage

### 2.1 TypeScript obligatoire

Le projet doit utiliser TypeScript côté front-end et back-end.

Objectifs :

- réduire les erreurs ;

- améliorer l'autocomplétion ;

- rendre les contrats plus clairs ;

- faciliter la maintenance.

### 2.2 Éviter any

Le type any doit être évité autant que possible.

À préférer :

- interfaces ;

- types personnalisés ;

- generics ;

- unknown avec validation ;

- DTO typés.

Exemple à éviter :

function calculateScore(stats: any) {}

Exemple recommandé :

function calculateScore(stats: PlayerStatsInput): number {}

### 2.3 Types explicites pour les données métier

Les données importantes doivent avoir des types dédiés.

Exemples :

- User ;

- PlayerProfile ;

- Game ;

- PlayerStats ;

- Team ;

- TeamMember ;

- Season ;

- LeaderboardEntry ;

- ChatMessage ;

- ExternalStatsResult.

## 3 Nommage

### 3.1 Variables et fonctions

Utiliser camelCase.

Exemples :

- userId ;

- teamId ;

- currentSeason ;

- calculateScore ;

- syncPlayerStats ;

- getTeamMembers.

### 3.2 Classes et composants

Utiliser PascalCase.

Exemples :

- AuthService ;

- StatsService ;

- TeamController ;

- LeaderboardPage ;

- UserProfileCard ;

- TeamChatPanel.

### 3.3 Constantes

Utiliser UPPER_SNAKE_CASE pour les constantes globales.

Exemples :

- MIN_MATCHES_FOR_LEADERBOARD ;

- DEFAULT_PAGE_SIZE ;

- MAX_CHAT_MESSAGE_LENGTH ;

- SCORE_KD_WEIGHT.

### 3.4 Fichiers front-end

Recommandation : kebab-case pour les fichiers.

Exemples :

- user-profile-card.tsx ;

- leaderboard-page.tsx ;

- team-chat-panel.tsx ;

- use-auth.ts ;

- api-client.ts.

### 3.5 Fichiers back-end NestJS

Respecter les conventions NestJS.

Exemples :

- auth.module.ts ;

- auth.controller.ts ;

- auth.service.ts ;

- create-team.dto.ts ;

- team-member.guard.ts ;

- stats-sync.service.ts.

## 4 Formatting

### 4.1 Outils recommandés

Utiliser :

- ESLint ;

- Prettier ;

- TypeScript strict si possible.

### 4.2 Règles générales

Règles recommandées :

- indentation : 2 espaces ;

- points-virgules : oui ou selon config Prettier, mais cohérent ;

- guillemets simples ou doubles selon config, mais cohérent ;

- longueur de ligne raisonnable ;

- imports organisés ;

- pas de code mort ;

- pas de console.log oublié en production.

### 4.3 Commandes prévues

Commandes possibles :

npm run lint

npm run format

npm run format:check

npm run typecheck

ou équivalent selon le gestionnaire de paquets choisi.

## 5 Structure front-end recommandée

### 5.1 Organisation globale

Structure recommandée :

src/

assets/

components/

features/

auth/

dashboard/

profile/

games/

leaderboard/

teams/

chat/

settings/

pwa/

hooks/

layouts/

pages/

services/

stores/

types/

utils/

### 5.2 Dossier components

Contient les composants réutilisables génériques.

Exemples :

- Button ;

- Modal ;

- Card ;

- Avatar ;

- Badge ;

- EmptyState ;

- Loader ;

- ErrorMessage.

Ces composants ne doivent pas contenir de logique métier forte.

### 5.3 Dossier features

Contient les fonctionnalités métier.

Exemples :

- features/auth ;

- features/teams ;

- features/stats ;

- features/leaderboard ;

- features/chat.

Chaque feature peut contenir :

- components ;

- hooks ;

- services ;

- types ;

- stores si nécessaire.

### 5.4 Dossier services

Contient les services techniques front-end.

Exemples :

- api-client.ts ;

- auth-api.ts ;

- stats-api.ts ;

- teams-api.ts ;

- socket-client.ts.

### 5.5 Dossier stores

Contient les stores globaux si Valtio est utilisé.

Exemples :

- auth-store.ts ;

- user-store.ts ;

- notification-store.ts ;

- socket-store.ts.

## 6 Conventions React

### 6.1 Composants fonctionnels

Utiliser des composants fonctionnels.

Exemple :

function UserProfileCard(props: UserProfileCardProps) {

return ...;

}

### 6.2 Props typées

Chaque composant doit avoir des props typées.

Exemple :

type UserProfileCardProps = {

user: PublicUserProfile;

showStats?: boolean;

};

### 6.3 Composants courts

Un composant trop long doit être découpé.

Indicateur :

Si un composant dépasse fortement 150 à 200 lignes, vérifier s'il peut être divisé.

### 6.4 Logique dans les hooks

La logique réutilisable doit être extraite dans des hooks.

Exemples :

- useAuth ;

- useCurrentUser ;

- useTeamChat ;

- useLeaderboard ;

- useStatsSync.

### 6.5 Gestion des états

Prévoir les états suivants pour les pages importantes :

- loading ;

- success ;

- empty ;

- error ;

- unauthorized ;

- offline si PWA.

## 7 Conventions back-end NestJS

### 7.1 Organisation des modules

Chaque domaine métier doit avoir son module.

Modules recommandés :

- AuthModule ;

- UsersModule ;

- ProfilesModule ;

- GamesModule ;

- GameAccountsModule ;

- StatsModule ;

- LeaderboardModule ;

- TeamsModule ;

- TeamInvitationsModule ;

- ChatModule ;

- SeasonsModule ;

- NotificationsModule ;

- SecurityModule.

### 7.2 Controllers

Les controllers doivent :

- recevoir les requêtes ;

- valider les entrées via DTO ;

- appliquer les guards ;

- appeler les services ;

- retourner une réponse standardisée.

Ils ne doivent pas contenir de logique métier complexe.

### 7.3 Services

Les services contiennent la logique métier.

Exemples :

- calcul du score ;

- synchronisation de statistiques ;

- création d'équipe ;

- vérification de rôle ;

- archivage de saison ;

- recalcul de leaderboard.

### 7.4 DTO

Chaque entrée utilisateur doit passer par un DTO.

Exemples :

- RegisterDto ;

- LoginDto ;

- UpdateProfileDto ;

- CreateTeamDto ;

- JoinTeamDto ;

- SendTeamMessageDto ;

- SyncStatsDto.

Les DTO doivent utiliser :

- class-validator ;

- class-transformer si nécessaire.

### 7.5 Guards

Les permissions doivent être vérifiées côté back-end.

Guards recommandés :

- JwtAuthGuard ;

- RolesGuard ;

- ResourceOwnerGuard ;

- TeamMemberGuard ;

- TeamRoleGuard.

## 8 Format des réponses API

### 8.1 Réponse succès

Format recommandé :

{

"success": true,

"data": {},

"message": "Action effectuée avec succès."

}

### 8.2 Réponse erreur

Format recommandé :

{

"success": false,

"error": {

"code": "RESOURCE_NOT_FOUND",

"message": "Ressource introuvable.",

"requestId": "req_abc123"

}

}

### 8.3 Pagination

Format recommandé :

{

"success": true,

"data": [],

"pagination": {

"page": 1,

"limit": 20,

"total": 120,

"totalPages": 6

}

}

### 8.4 Statuts HTTP

Règles :

- 200 : succès lecture ou action simple ;

- 201 : création réussie ;

- 400 : validation incorrecte ;

- 401 : non authentifié ;

- 403 : accès interdit ;

- 404 : ressource introuvable ;

- 409 : conflit métier ;

- 429 : rate limit ;

- 500 : erreur serveur.

## 9 Gestion des erreurs

### 9.1 Erreurs utilisateur

Les messages doivent être compréhensibles.

Exemples :

- "Vous devez être connecté." ;

- "Vous n'avez pas accès à cette équipe." ;

- "Ce code d'invitation est invalide." ;

- "La synchronisation est temporairement indisponible."

### 9.2 Erreurs techniques

Les détails techniques doivent rester côté serveur.

Ne jamais renvoyer :

- stack trace ;

- requête SQL ;

- variables d'environnement ;

- secrets ;

- tokens ;

- clés API.

### 9.3 Codes d'erreur métier

Exemples :

- AUTH_INVALID_CREDENTIALS ;

- AUTH_TOKEN_EXPIRED ;

- TEAM_NOT_FOUND ;

- TEAM_ACCESS_DENIED ;

- TEAM_INVITE_CODE_INVALID ;

- STATS_PROVIDER_UNAVAILABLE ;

- STATS_MAPPING_FAILED ;

- RATE_LIMITED.

## 10 Conventions base de données

### 10.1 Nommage des tables

Recommandation : snake_case et noms explicites.

Exemples :

- users ;

- games ;

- game_accounts ;

- player_stats ;

- teams ;

- team_members ;

- seasons ;

- chat_messages ;

- leaderboard_snapshots.

### 10.2 Champs communs

Champs recommandés :

- id ;

- created_at ;

- updated_at ;

- deleted_at si soft delete ;

- status si besoin.

### 10.3 Identifiants

Utiliser des UUID ou identifiants robustes.

Ne pas exposer de logique interne fragile.

### 10.4 Migrations

Chaque changement de structure doit passer par une migration.

Règles :

- migrations nommées clairement ;

- migrations testées ;

- éviter les suppressions destructives ;

- prévoir rollback si possible.

## 11 Conventions Redis

### 11.1 Préfixes

Utiliser des préfixes clairs.

Exemples :

- cache:user:{userId} ;

- rate:auth:login:{ip} ;

- lock:stats:sync:{userId}:{gameId} ;

- leaderboard:{gameId}:{seasonId} ;

- socket:presence:{userId}.

### 11.2 TTL

Toute donnée temporaire doit avoir un TTL.

Exemples :

- rate limiting ;

- cache provider ;

- locks ;

- présence en ligne ;

- tokens temporaires si utilisés.

### 11.3 Ne pas stocker de secrets

Redis ne doit pas stocker en clair :

- mots de passe ;

- JWT ;

- refresh tokens non protégés ;

- clés API ;

- secrets.

## 12 Conventions Socket.io

### 12.1 Nommage des événements

Utiliser un nommage clair et cohérent.

Exemples :

- team:join ;

- team:leave ;

- team:message:send ;

- team:message:new ;

- team:typing:start ;

- team:typing:stop ;

- notification:new.

### 12.2 Règles de sécurité

- authentifier le socket au handshake ;

- ne jamais faire confiance au userId envoyé par le client ;

- vérifier l'appartenance à l'équipe avant de rejoindre une room ;

- vérifier l'appartenance avant d'envoyer un message ;

- appliquer un rate limiting sur les messages ;

- ne pas logger le contenu complet des messages.

### 12.3 Rooms

Nommage recommandé :

- team:{teamId} ;

- user:{userId}.

## 13 Conventions sécurité dans le code

### 13.1 Secrets

Règles :

- aucun secret dans le code ;

- aucun secret dans le front-end ;

- aucun secret dans les logs ;

- utiliser .env ;

- utiliser .env.example avec valeurs fictives.

### 13.2 Validation

Toute donnée venant de l'utilisateur doit être validée.

Sources concernées :

- body ;

- params ;

- query ;

- headers ;

- événements Socket.io ;

- données externes Steam/Epic ;

- fichiers uploadés.

### 13.3 Permissions

Les permissions doivent être contrôlées côté back-end.

Le front peut masquer des boutons, mais cela ne suffit jamais.

### 13.4 Logs

Ne jamais logger :

- mot de passe ;

- passwordHash ;

- JWT ;

- refresh token ;

- clé Steam ;

- secret Epic ;

- DATABASE_URL complète ;

- contenu complet des messages privés.

## 14 Conventions APIs externes

### 14.1 Couche provider

Les APIs externes doivent être appelées via des providers dédiés.

Exemples :

- SteamProvider ;

- EpicProvider ;

- MockStatsProvider.

Les controllers ne doivent jamais appeler directement Steam ou Epic.

### 14.2 Mapping normalisé

Les providers doivent convertir les réponses externes vers un format interne.

Exemple :

ExternalStatsResult {

provider: 'STEAM' | 'EPIC' | 'MOCK';

externalId: string;

gameExternalId: string;

stats: {

wins: number;

losses: number;

kills: number;

deaths: number;

matchesPlayed: number;

};

metadata: {

mappingStatus: 'COMPLETE' | 'PARTIAL' | 'FAILED' | 'UNAVAILABLE';

};

}

### 14.3 Fallback

Si une API externe échoue :

- ne pas supprimer les anciennes données ;

- utiliser le cache si disponible ;

- utiliser MockProvider en mode démo ;

- retourner une erreur contrôlée ;

- logger l'échec sans secret.

## 15 Conventions PWA

### 15.1 Données privées

Les données privées ne doivent pas être mises en cache sans réflexion.

Règles :

- Network First pour les données utilisateur ;

- Cache First pour les assets statiques ;

- nettoyage au logout ;

- page offline neutre ;

- pas de secrets dans le cache.

### 15.2 Responsive

Le front doit être mobile-first.

Règles :

- composants lisibles sur mobile ;

- boutons suffisamment grands ;

- leaderboards scrollables ;

- pages dashboard adaptées ;

- navigation claire.

## 16 Commentaires dans le code

### 16.1 Quand commenter

Les commentaires sont utiles pour expliquer :

- une règle métier ;

- une formule de score ;

- une décision technique ;

- un fallback ;

- un comportement de sécurité.

### 16.2 Quand éviter

Éviter les commentaires qui répètent simplement le code.

Exemple inutile :

// incrémente i

i++;

### 16.3 Commentaires recommandés

Exemple :

// Un joueur doit avoir au moins 10 parties pour être éligible au leaderboard.

## 17 Formule de score

### 17.1 Centralisation

La formule de score doit être centralisée dans un service ou utilitaire unique.

Exemple :

calculatePlayerScore(stats: PlayerStatsInput): number

### 17.2 Règle

Ne jamais recalculer le score manuellement à plusieurs endroits.

### 17.3 Constantes

Les poids doivent être définis dans des constantes.

Exemple :

const SCORE_KD_WEIGHT = 50;

const SCORE_WINRATE_WEIGHT = 40;

const SCORE_MATCH_WEIGHT = 0.5;

const MIN_MATCHES_FOR_LEADERBOARD = 10;

## 18 Imports et dépendances

### 18.1 Imports

Règles :

- imports organisés ;

- supprimer les imports inutilisés ;

- éviter les chemins relatifs trop longs ;

- utiliser des alias si configurés.

### 18.2 Dépendances

Règles :

- éviter d'ajouter une dépendance pour un besoin simple ;

- vérifier la maintenance du package ;

- éviter les packages abandonnés ;

- documenter les dépendances importantes.

## 19 Tests associés au code

### 19.1 Tests minimums recommandés

Même avant un gros dispositif de test, prévoir au minimum :

- test du calcul de score ;

- test de l'éligibilité leaderboard ;

- test de création d'équipe ;

- test du code d'invitation ;

- test des guards ;

- test du MockProvider.

### 19.2 Règle

Une fonctionnalité critique doit avoir au moins un test ou une vérification de recette.

Fonctionnalités critiques :

- authentification ;

- permissions ;

- score ;

- leaderboards ;

- équipes ;

- chat ;

- archivage saison.

## 20 Pull requests et revue de code

### 20.1 Taille des PR

Les pull requests doivent rester raisonnables.

Éviter :

- une PR avec 25 fichiers non liés ;

- un mélange front, back, Docker et documentation sans lien clair.

### 20.2 Description PR

Chaque PR doit expliquer :

- objectif ;

- changements principaux ;

- tests effectués ;

- captures si front ;

- risques éventuels.

### 20.3 Revue

L'autre membre doit relire les changements importants.

Points à vérifier :

- lisibilité ;

- sécurité ;

- cohérence avec conventions ;

- absence de secrets ;

- tests ou vérifications.

## 21 Checklist avant commit

Avant de commit :

- le code compile ;

- le lint passe ;

- aucun secret n'est présent ;

- aucun console.log inutile ;

- les noms sont clairs ;

- les fichiers sont au bon endroit ;

- les types sont corrects ;

- les erreurs sont gérées ;

- les routes sensibles sont protégées ;

- la documentation est mise à jour si nécessaire.

## 22 Checklist avant merge

Avant de merger :

- la fonctionnalité fonctionne ;

- les tests ou vérifications sont faits ;

- la PR est relue ;

- les conflits sont résolus ;

- la CI est verte si disponible ;

- les variables d'environnement nécessaires sont documentées ;

- aucune donnée sensible n'est exposée ;

- le comportement est cohérent avec le MVP.

## 23 Priorités MVP

Pour le MVP, appliquer en priorité :

- TypeScript strict autant que possible ;

- DTO sur toutes les entrées ;

- guards sur routes privées ;

- composants React typés ;

- services métier séparés ;

- formule de score centralisée ;

- MockProvider fiable ;

- réponses API standardisées ;

- pas de secrets dans le code ;

- logs sans données sensibles.

## 24 Risques et solutions

### 24.1 Risque : code incohérent

Impact : maintenance difficile.

Solution : conventions communes, Prettier, ESLint, PR courtes.

### 24.2 Risque : logique métier dupliquée

Impact : bugs et résultats différents.

Solution : centraliser la logique dans des services.

### 24.3 Risque : types faibles

Impact : erreurs runtime.

Solution : éviter any, créer des types métier.

### 24.4 Risque : sécurité uniquement côté front

Impact : accès non autorisé possible.

Solution : guards et vérifications côté back-end.

### 24.5 Risque : API externe appelée partout

Impact : code difficile à maintenir et fallback compliqué.

Solution : providers externes centralisés.

### 24.6 Risque : PWA qui cache des données privées

Impact : fuite de données après logout.

Solution : stratégie de cache adaptée et nettoyage logout.

## 25 Critères d'acceptation

Les conventions de code sont considérées respectées si :

- TypeScript est utilisé partout ;

- les fichiers respectent le nommage prévu ;

- les composants React sont typés ;

- les modules NestJS sont séparés par domaine ;

- les DTO valident les entrées ;

- les services contiennent la logique métier ;

- les réponses API sont cohérentes ;

- les erreurs sont standardisées ;

- les permissions sont vérifiées côté back-end ;

- les secrets ne sont jamais dans le code ;

- le scoring est centralisé ;

- les APIs externes passent par des providers ;

- le code est formaté ;

- le lint passe ;

- la PR est relue avant merge.

## 26 Conclusion

Les conventions de code sont indispensables pour garder Track'N Share propre et maintenable.

Comme le projet combine front-end, back-end, temps réel, base de données, PWA, APIs externes et sécurité, il est important de poser des règles avant de commencer le développement.

Ces conventions doivent être appliquées de manière pragmatique : elles ne doivent pas ralentir inutilement l'équipe, mais elles doivent éviter les incohérences, les duplications et les failles évidentes.

Le principe à retenir est simple : un code clair, typé, sécurisé, testé et cohérent sera plus facile à développer, présenter et faire évoluer.
