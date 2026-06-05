# LIEN SWAGGER / DOCUMENTATION OPENAPI

Projet Track'N Share

Version : 1.0

Date : 06/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document sert de référence pour la documentation Swagger / OpenAPI de l'API Track'N Share.

Swagger permettra de documenter, visualiser et tester les endpoints REST de l'application directement depuis une interface web générée automatiquement par le back-end NestJS.

Ce document indique :

- l'objectif de Swagger dans le projet ;

- l'URL prévue de la documentation ;

- la configuration recommandée dans NestJS ;

- les conventions de documentation ;

- les tags à utiliser ;

- la sécurité JWT dans Swagger ;

- les endpoints à documenter en priorité ;

- les bonnes pratiques à respecter.

## 1 Rôle de Swagger dans Track'N Share

### 1.1 Définition

Swagger, basé sur OpenAPI, est un outil permettant de générer une documentation interactive de l'API REST.

Dans Track'N Share, Swagger permettra de :

- lister tous les endpoints disponibles ;

- afficher les méthodes HTTP ;

- afficher les paramètres attendus ;

- afficher les DTO de requête ;

- afficher les exemples de réponse ;

- tester les routes directement depuis le navigateur ;

- vérifier les routes protégées par JWT ;

- faciliter l'intégration entre le front-end React et le back-end NestJS ;

- améliorer la qualité de présentation pendant la soutenance.

### 1.2 Objectif projet

L'objectif est que l'API Track'N Share soit documentée clairement et exploitable par l'équipe projet.

Swagger doit être utilisé comme une documentation technique vivante, directement liée au code back-end.

## 2 Lien Swagger prévu

### 2.1 URL en développement local

URL recommandée en local :

http://localhost:3000/api/docs

ou, si l'API est versionnée :

http://localhost:3000/api/v1/docs

### 2.2 URL en production ou démonstration

URL prévue pour un environnement hébergé :

https://api.tracknshare.example.com/api/docs

ou :

https://api.tracknshare.example.com/api/v1/docs

Cette URL devra être remplacée par le lien réel lorsque le back-end sera déployé.

### 2.3 Statut actuel

Statut : À compléter lors de l'implémentation back-end.

Lien local attendu :

http://localhost:3000/api/docs

Lien de production :

À définir.

## 3 Technologies utilisées

### 3.1 Back-end

Technologies concernées :

- NestJS ;

- TypeScript ;

- @nestjs/swagger ;

- swagger-ui-express ;

- DTO avec class-validator ;

- JWT Bearer Authentication.

### 3.2 Front-end

Swagger n'est pas une dépendance front-end directe.

Il sert cependant au front-end React/PWA pour :

- comprendre les endpoints disponibles ;

- vérifier les payloads attendus ;

- tester les routes avant intégration ;

- aligner les types TypeScript avec les réponses API.

## 4 Installation recommandée

### 4.1 Packages nécessaires

Packages à installer côté back-end NestJS :

npm install @nestjs/swagger swagger-ui-express

ou avec pnpm :

pnpm add @nestjs/swagger swagger-ui-express

### 4.2 Objectif des packages

@nestjs/swagger

Permet de générer la documentation OpenAPI depuis les décorateurs NestJS.

swagger-ui-express

Permet d'exposer l'interface web Swagger dans l'application Express utilisée par NestJS.

## 5 Configuration NestJS recommandée

### 5.1 Configuration dans main.ts

Exemple de configuration :

import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {

const app = await NestFactory.create(AppModule);

app.setGlobalPrefix('api');

const config = new DocumentBuilder()

.setTitle("Track'N Share API")

.setDescription("Documentation REST API du projet Track'N Share")

.setVersion('1.0')

.addBearerAuth(

{

type: 'http',

scheme: 'bearer',

bearerFormat: 'JWT',

name: 'Authorization',

description: 'Entrez le token JWT au format : Bearer <token>',

in: 'header',

},

'access-token',

)

.build();

const document = SwaggerModule.createDocument(app, config);

SwaggerModule.setup('api/docs', app, document);

await app.listen(3000);

}

bootstrap();

### 5.2 Résultat attendu

Après démarrage du back-end, la documentation doit être disponible ici :

http://localhost:3000/api/docs

## 6 Configuration avec versioning API

Si le projet utilise un préfixe /api/v1, la configuration peut être :

app.setGlobalPrefix('api/v1');

SwaggerModule.setup('api/v1/docs', app, document);

Lien local :

http://localhost:3000/api/v1/docs

Recommandation :

Pour le MVP, choisir une seule convention et l'appliquer partout.

## 7 Sécurité JWT dans Swagger

### 7.1 Objectif

Swagger doit permettre de tester les routes protégées par JWT.

L'utilisateur pourra cliquer sur le bouton Authorize et renseigner son token.

### 7.2 Format du token

Format attendu :

Bearer <access_token>

Selon la configuration Swagger, il est possible que l'interface demande uniquement le token sans écrire Bearer. Il faudra vérifier le comportement lors de l'implémentation.

### 7.3 Décorateur à utiliser sur les routes protégées

Pour indiquer qu'une route nécessite un JWT :

@ApiBearerAuth('access-token')

@UseGuards(JwtAuthGuard)

@Get('me')

getMe() {

...

}

### 7.4 Routes concernées

Les routes suivantes doivent être documentées comme protégées :

- GET /auth/me ;

- POST /auth/logout ;

- GET /users/me ;

- PATCH /profiles/me ;

- GET /game-accounts/me ;

- POST /game-accounts ;

- GET /stats/me ;

- POST /stats/sync ;

- POST /teams ;

- POST /teams/join ;

- GET /teams/me ;

- GET /teams/:id/messages ;

- GET /notifications/me ;

- routes admin.

## 8 Tags Swagger recommandés

Les endpoints doivent être regroupés par tags pour améliorer la lisibilité.

Tags recommandés :

Auth

Inscription, connexion, logout, utilisateur connecté, refresh token.

Users

Compte utilisateur, données personnelles, suppression de compte.

Profiles

Profil public, profil privé, modification du profil.

Games

Jeux disponibles, détails de jeu, gestion admin des jeux.

Game Accounts

Comptes de jeu liés, liaison, suppression, compte mocké.

Stats

Statistiques joueur, synchronisation, historique.

Score

Score utilisateur, formule de score, recalcul.

Leaderboards

Leaderboards solo et équipe.

Seasons

Saisons, saison active, saisons archivées.

Teams

Création d'équipe, page équipe, membres, modification.

Team Invitations

Codes d'invitation, rejoindre une équipe, accepter/refuser une invitation.

Team Stats

Statistiques collectives d'équipe.

Messages

Historique REST du chat, fallback REST d'envoi de message.

Notifications

Notifications utilisateur.

Achievements

Badges et achievements.

Search

Recherche globale, joueurs, équipes, jeux.

Demo

Données seedées, compte démo, mode démo.

Admin

Administration, modération, archivage manuel, recalculs.

Health

Healthcheck API, base de données, Redis.

## 9 Décorateurs Swagger recommandés

### 9.1 @ApiTags

Permet de classer un controller.

Exemple :

@ApiTags('Auth')

@Controller('auth')

export class AuthController {}

### 9.2 @ApiOperation

Permet de décrire une route.

Exemple :

@ApiOperation({ summary: 'Connecter un utilisateur' })

### 9.3 @ApiResponse

Permet de documenter les réponses possibles.

Exemple :

@ApiResponse({ status: 200, description: 'Connexion réussie' })

@ApiResponse({ status: 401, description: 'Identifiants invalides' })

### 9.4 @ApiBody

Permet de documenter le body attendu.

Exemple :

@ApiBody({ type: LoginDto })

### 9.5 @ApiParam

Permet de documenter les paramètres d'URL.

Exemple :

@ApiParam({ name: 'id', description: "Identifiant de l'équipe" })

### 9.6 @ApiQuery

Permet de documenter les query params.

Exemple :

@ApiQuery({ name: 'gameId', required: true })

@ApiQuery({ name: 'seasonId', required: false })

### 9.7 @ApiBearerAuth

Permet d'indiquer qu'une route est protégée par JWT.

Exemple :

@ApiBearerAuth('access-token')

## 10 Documentation des DTO

### 10.1 Pourquoi documenter les DTO

Les DTO permettent à Swagger d'afficher automatiquement les champs attendus dans les body de requête.

Chaque DTO important doit contenir des décorateurs @ApiProperty.

### 10.2 Exemple LoginDto

import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString } from 'class-validator';

export class LoginDto {

@ApiProperty({ example: 'clement@example.com' })

@IsEmail()

email: string;

@ApiProperty({ example: 'MotDePasseFort123!' })

@IsString()

password: string;

}

### 10.3 Exemple CreateTeamDto

export class CreateTeamDto {

@ApiProperty({ example: 'Shadow Wolves' })

name: string;

@ApiProperty({ example: 'SW' })

tag: string;

@ApiProperty({ example: 'Équipe compétitive FPS', required: false })

description?: string;

@ApiProperty({ example: 'PUBLIC', enum: ['PUBLIC', 'PRIVATE'] })

visibility: 'PUBLIC' | 'PRIVATE';

}

### 10.4 DTO prioritaires à documenter

Priorité P0 :

- RegisterDto ;

- LoginDto ;

- UpdateProfileDto ;

- LinkGameAccountDto ;

- SyncStatsDto ;

- CreateTeamDto ;

- JoinTeamDto ;

- SendMessageDto.

Priorité P1 :

- CreateInvitationDto ;

- UpdateTeamDto ;

- UpdatePrivacyDto ;

- CreateNotificationDto ;

- CreateAchievementDto.

## 11 Réponses standard à documenter

### 11.1 Réponse succès

Format recommandé :

{

"success": true,

"data": {},

"message": "Opération réussie"

}

### 11.2 Réponse liste paginée

{

"success": true,

"data": [],

"pagination": {

"page": 1,

"limit": 20,

"total": 125,

"totalPages": 7

}

}

### 11.3 Réponse erreur

{

"success": false,

"error": {

"code": "VALIDATION_ERROR",

"message": "Les données envoyées sont invalides.",

"details": []

}

}

### 11.4 Erreurs fréquentes à documenter

400 Bad Request

Payload invalide.

401 Unauthorized

Token absent, invalide ou expiré.

403 Forbidden

Utilisateur non autorisé.

404 Not Found

Ressource introuvable.

409 Conflict

Conflit métier : email déjà utilisé, déjà membre, code invitation utilisé.

429 Too Many Requests

Rate limit atteint.

500 Internal Server Error

Erreur serveur.

## 12 Endpoints à documenter en priorité

### 12.1 Authentification

- POST /auth/register

- POST /auth/login

- POST /auth/logout

- GET /auth/me

- POST /auth/refresh si activé

### 12.2 Profils

- GET /profiles/me

- GET /profiles/:id

- PATCH /profiles/me

### 12.3 Jeux et comptes liés

- GET /games

- GET /games/:id

- GET /game-accounts/me

- POST /game-accounts

- POST /game-accounts/mock

- DELETE /game-accounts/:id

### 12.4 Statistiques et score

- GET /stats/me

- POST /stats/sync

- GET /stats/me/history

- GET /score/me

- GET /score/formula

### 12.5 Leaderboards

- GET /leaderboards/solo

- GET /leaderboards/teams

- GET /leaderboards/me/rank

### 12.6 Saisons

- GET /seasons

- GET /seasons/current

- GET /seasons/:id

### 12.7 Équipes

- POST /teams

- GET /teams/me

- GET /teams/:id

- PATCH /teams/:id

- DELETE /teams/:id

- GET /teams/:id/members

### 12.8 Invitations

- POST /teams/join

- POST /teams/:id/invite-code/regenerate

- POST /teams/:id/invitations

- GET /team-invitations/me

- POST /team-invitations/:id/accept

- POST /team-invitations/:id/refuse

### 12.9 Chat REST

- GET /teams/:id/messages

- POST /teams/:id/messages

- DELETE /messages/:id

### 12.10 Démo et healthcheck

- GET /health

- POST /demo/seed

- GET /demo/account

- POST /demo/login

## 13 Routes à exclure ou protéger

### 13.1 Routes internes

Certaines routes ne doivent pas être exposées publiquement en production.

Exemples :

- POST /demo/seed ;

- routes de debug ;

- routes de reset base de données ;

- endpoints internes de maintenance.

### 13.2 Recommandation

En développement :

Swagger peut afficher toutes les routes utiles.

En production :

- protéger Swagger par authentification si nécessaire ;

- désactiver les routes de seed ;

- ne pas exposer les endpoints internes ;

- ne pas afficher d'informations sensibles.

## 14 Swagger et mode démo

### 14.1 Utilité pendant la soutenance

Swagger est utile pendant la soutenance pour montrer :

- la structure de l'API ;

- la qualité de la documentation ;

- les routes principales ;

- les DTO ;

- l'authentification JWT ;

- le fonctionnement des endpoints.

### 14.2 Scénario possible

1. Ouvrir Swagger.

2. Montrer les tags principaux : Auth, Stats, Teams, Leaderboards.

3. Exécuter POST /auth/login avec le compte démo.

4. Copier le token JWT.

5. Cliquer sur Authorize.

6. Tester GET /auth/me.

7. Tester GET /stats/me.

8. Tester GET /leaderboards/solo.

9. Tester GET /teams/me.

## 15 Bonnes pratiques de documentation

### 15.1 Chaque route doit avoir une description claire

Éviter les descriptions trop vagues.

Mauvais exemple :

"Retourne des données."

Bon exemple :

"Retourne les statistiques du joueur connecté pour une saison et un jeu donnés."

### 15.2 Ajouter des exemples réalistes

Les exemples doivent correspondre au projet.

Exemples de données :

- ClementTNS ;

- Shadow Wolves ;

- 2026-Q2 ;

- game_1 ;

- team_123.

### 15.3 Documenter les erreurs

Chaque route importante doit indiquer :

- erreur 400 ;

- erreur 401 si route protégée ;

- erreur 403 si permissions ;

- erreur 404 si ressource introuvable ;

- erreur 409 si conflit métier.

### 15.4 Garder Swagger à jour

Swagger doit évoluer avec le code.

À chaque ajout d'endpoint :

- ajouter tag ;

- ajouter summary ;

- ajouter DTO ;

- ajouter réponses ;

- ajouter sécurité si nécessaire.

## 16 Checklist Swagger MVP

La documentation Swagger est considérée comme prête pour le MVP si :

- Swagger est accessible en local ;

- le titre est correct ;

- la description du projet est présente ;

- la version API est indiquée ;

- la sécurité Bearer JWT est configurée ;

- les endpoints Auth sont documentés ;

- les endpoints Profiles sont documentés ;

- les endpoints Games sont documentés ;

- les endpoints Stats sont documentés ;

- les endpoints Leaderboards sont documentés ;

- les endpoints Seasons sont documentés ;

- les endpoints Teams sont documentés ;

- les endpoints Chat REST sont documentés ;

- les DTO principaux contiennent @ApiProperty ;

- les erreurs principales sont documentées ;

- les routes admin sont protégées ;

- les routes de seed sont protégées ou désactivables.

## 17 Risques et solutions

### 17.1 Risque : Swagger non mis à jour

Impact : documentation incorrecte.

Solution : ajouter les décorateurs Swagger en même temps que les endpoints.

### 17.2 Risque : routes sensibles visibles publiquement

Impact : exposition de fonctionnalités internes.

Solution : protéger Swagger ou masquer/désactiver certaines routes en production.

### 17.3 Risque : DTO incomplets

Impact : le front-end ne sait pas quoi envoyer.

Solution : documenter chaque DTO avec @ApiProperty.

### 17.4 Risque : sécurité JWT mal documentée

Impact : impossible de tester les routes privées depuis Swagger.

Solution : configurer addBearerAuth et @ApiBearerAuth.

### 17.5 Risque : données sensibles dans les exemples

Impact : fuite de secrets ou mauvaises pratiques.

Solution : utiliser uniquement des données fictives.

## 18 Lien final à renseigner

Lien local Swagger :

http://localhost:3000/api/docs

Lien local si versioning :

http://localhost:3000/api/v1/docs

Lien de démonstration :

À compléter après déploiement.

Lien de production :

À compléter après déploiement.

## 19 Conclusion

Swagger est un élément important de la documentation API de Track'N Share.

Il permettra de relier la documentation fonctionnelle au back-end réel, de tester les endpoints et de faciliter la communication entre les parties front-end et back-end.

Pour le MVP, l'objectif est d'avoir une documentation Swagger claire sur les modules essentiels : authentification, profils, jeux, statistiques, score, leaderboards, saisons, équipes, invitations, chat REST, mode démo et healthcheck.

Lorsque l'API sera développée, ce document devra être mis à jour avec le lien réel de Swagger et les éventuelles conventions finales retenues.
