# SPRINT 3 — ÉQUIPES ET CHAT

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit le Sprint 3 du projet Track'N Share.

Le Sprint 3 correspond à l'ajout de la dimension communautaire du MVP : création d'équipes, adhésion via code d'invitation, rôles de membres et chat d'équipe en temps réel.

Ce sprint doit permettre de démontrer que Track'N Share n'est pas seulement un outil de statistiques individuelles, mais aussi une plateforme sociale et compétitive autour des équipes.

## 1 Objectif du Sprint 3

### 1.1 Objectif principal

Permettre à un utilisateur connecté de créer ou rejoindre une équipe, consulter ses membres et utiliser un chat d'équipe sécurisé.

À la fin du sprint, l'application doit permettre de :

- créer une équipe ;

- générer ou utiliser un code d'invitation ;

- rejoindre une équipe ;

- consulter une page équipe ;

- afficher les membres et leurs rôles ;

- envoyer un message dans le chat d'équipe ;

- recevoir les messages en temps réel ;

- empêcher un non-membre d'accéder au chat.

### 1.2 Objectifs secondaires

Le Sprint 3 doit aussi permettre de :

- préparer la gestion des rôles CAPTAIN et MEMBER ;

- sécuriser les routes d'équipe ;

- créer les guards TeamMemberGuard et TeamRoleGuard ;

- stocker un historique de messages ;

- authentifier Socket.io ;

- utiliser des rooms par équipe ;

- créer des données seedées d'équipe pour la soutenance.

## 2 Périmètre du Sprint 3

### 2.1 Inclus

Le Sprint 3 inclut :

- modèles Team, TeamMember, TeamInvitation si retenu, ChatMessage ;

- migrations associées ;

- TeamsModule ;

- ChatModule ;

- création équipe ;

- rejoindre équipe via code ;

- rôles CAPTAIN/MEMBER ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- page équipe front ;

- affichage des membres ;

- API messages équipe ;

- Socket.io ;

- room team:{teamId} ;

- interface chat ;

- seed équipe et messages.

### 2.2 Non inclus

Le Sprint 3 ne doit pas inclure :

- messagerie privée complète ;

- système d'amis complet ;

- notifications push ;

- modération avancée ;

- chiffrement de bout en bout ;

- calendrier d'équipe ;

- tournois ;

- matchmaking avancé ;

- feed social complet.

## 3 Durée recommandée

Durée indicative : 5 à 8 jours de travail selon disponibilité.

Ce sprint doit rester centré sur un chat d'équipe minimal mais fiable : historique, envoi, réception temps réel et permissions.

## 4 Livrables attendus

Livrables principaux :

- modèles Team et TeamMember ;

- modèle ChatMessage ;

- migrations prêtes ;

- endpoint création équipe ;

- endpoint rejoindre équipe ;

- guards d'équipe ;

- page équipe ;

- API de messages ;

- gateway Socket.io ;

- room par équipe ;

- interface chat ;

- données seedées ;

- Swagger mis à jour ;

- milestone M3 validable.

## 5 Tâches du Sprint 3

### 5.1 TNS-301 — Créer modèles Team et TeamMember

Priorité : P0

Responsable possible : Ioanes

Description : créer la base de données nécessaire aux équipes.

À faire :

- créer modèle Team ;

- créer modèle TeamMember ;

- ajouter les rôles CAPTAIN et MEMBER ;

- relier TeamMember à User et Team ;

- prévoir un code d'invitation sur Team ou une entité TeamInvitation ;

- créer les migrations.

Critères d'acceptation :

- tables créées ;

- relation user/team fonctionnelle ;

- rôle du membre stocké ;

- migration exécutable ;

- structure compatible avec les futures stats d'équipe.

### 5.2 TNS-302 — Créer équipe

Priorité : P0

Responsable possible : Ioanes

Description : permettre à un joueur connecté de créer une équipe.

À faire :

- créer endpoint POST /api/teams ;

- appliquer JwtAuthGuard ;

- valider name et tag ;

- créer l'équipe ;

- générer un code d'invitation ;

- ajouter le créateur comme CAPTAIN.

Critères d'acceptation :

- utilisateur connecté requis ;

- équipe créée ;

- créateur ajouté comme CAPTAIN ;

- code d'invitation disponible ;

- données invalides refusées.

### 5.3 TNS-303 — Rejoindre équipe avec code

Priorité : P0

Responsable possible : Ioanes

Description : permettre à un joueur de rejoindre une équipe à partir d'un code.

À faire :

- créer endpoint POST /api/teams/join ;

- recevoir un code d'invitation ;

- vérifier que le code existe ;

- vérifier que l'utilisateur n'est pas déjà membre ;

- ajouter l'utilisateur comme MEMBER ;

- retourner l'équipe rejointe.

Critères d'acceptation :

- code valide accepté ;

- code invalide refusé ;

- doublon membre évité ;

- utilisateur ajouté avec rôle MEMBER ;

- réponse claire côté front.

### 5.4 TNS-304 — Créer TeamMemberGuard et TeamRoleGuard

Priorité : P0

Responsable possible : Ioanes

Description : protéger les ressources liées aux équipes.

À faire :

- créer TeamMemberGuard ;

- vérifier que le user connecté appartient à l'équipe ;

- créer TeamRoleGuard ;

- vérifier le rôle CAPTAIN pour les actions sensibles ;

- appliquer les guards sur les routes utiles.

Critères d'acceptation :

- non-membre refusé ;

- membre simple refusé sur action capitaine ;

- capitaine autorisé ;

- erreurs propres ;

- logique réutilisable pour le chat.

### 5.5 TNS-305 — Page équipe front

Priorité : P0

Responsable possible : Clément

Description : créer l'interface permettant de consulter une équipe.

À faire :

- créer page /teams/:id ;

- afficher nom, tag et code d'invitation si autorisé ;

- afficher les membres ;

- afficher les rôles ;

- afficher les actions selon rôle ;

- gérer loading/error/empty.

Critères d'acceptation :

- nom équipe visible ;

- membres visibles ;

- rôle utilisateur visible ;

- actions adaptées au rôle ;

- responsive minimal.

### 5.6 TNS-306 — Créer modèle ChatMessage

Priorité : P0

Responsable possible : Ioanes

Description : stocker les messages du chat d'équipe.

À faire :

- créer modèle ChatMessage ;

- relier message à Team et User ;

- stocker content, createdAt, editedAt si nécessaire ;

- limiter la longueur du contenu ;

- prévoir suppression logique plus tard si besoin.

Critères d'acceptation :

- table messages créée ;

- relation équipe/utilisateur ;

- message vide refusé ;

- contenu limité ;

- date de création enregistrée.

### 5.7 TNS-307 — API messages équipe

Priorité : P0

Responsable possible : Ioanes

Description : permettre de récupérer et envoyer des messages via REST en complément de Socket.io.

À faire :

- créer GET /api/teams/:teamId/messages ;

- créer POST /api/teams/:teamId/messages ;

- appliquer TeamMemberGuard ;

- valider le contenu ;

- retourner les messages récents ;

- limiter le nombre de messages retournés.

Critères d'acceptation :

- membre requis ;

- non-membre refusé ;

- historique récupérable ;

- message vide refusé ;

- messages triés par date.

### 5.8 TNS-308 — Socket.io chat

Priorité : P0

Responsable possible : Ioanes / Clément

Description : ajouter le temps réel au chat d'équipe.

À faire :

- créer ChatGateway ;

- authentifier la connexion socket avec le token ;

- permettre de rejoindre room team:{teamId} ;

- vérifier que l'utilisateur est membre ;

- recevoir un message ;

- sauvegarder le message ;

- diffuser le message aux membres de la room.

Critères d'acceptation :

- socket authentifié ;

- room par équipe ;

- non-membre refusé ;

- message broadcast aux membres ;

- userId issu du token ;

- message sauvegardé.

### 5.9 TNS-309 — Interface chat front

Priorité : P0

Responsable possible : Clément

Description : créer l'interface utilisateur du chat d'équipe.

À faire :

- afficher l'historique ;

- créer champ de saisie ;

- envoyer message ;

- recevoir messages en temps réel ;

- afficher auteur et date ;

- gérer erreurs ;

- rendre le chat utilisable sur mobile.

Critères d'acceptation :

- historique visible ;

- envoi message fonctionnel ;

- réception temps réel ;

- erreurs visibles ;

- interface responsive minimale.

### 5.10 TNS-310 — Seed équipes et messages

Priorité : P0

Responsable possible : Ioanes

Description : préparer une équipe et des messages pour la soutenance.

À faire :

- créer équipe démo ;

- ajouter compte démo comme membre ou capitaine ;

- ajouter plusieurs membres fictifs ;

- créer quelques messages ;

- relier l'équipe aux stats si possible.

Critères d'acceptation :

- équipe démo visible ;

- membres présents ;

- messages présents ;

- compte démo peut accéder au chat ;

- données non réelles.

## 6 Répartition possible

### 6.1 Ioanes

Tâches principales possibles :

- modèles Team, TeamMember et ChatMessage ;

- migrations ;

- endpoints équipes ;

- guards ;

- API messages ;

- ChatGateway ;

- authentification socket ;

- seed équipes/messages ;

- Swagger.

### 6.2 Clément

Tâches principales possibles :

- page équipes ;

- page équipe ;

- formulaire création équipe ;

- formulaire rejoindre équipe ;

- interface chat ;

- intégration Socket.io client ;

- responsive ;

- gestion erreurs UI.

### 6.3 Tâches communes

À faire ensemble :

- définir le format des événements Socket.io ;

- tester les permissions membre/non-membre ;

- valider le parcours équipe ;

- préparer les données de démo ;

- tester le chat sur deux sessions.

## 7 Dépendances

### 7.1 Dépendances internes

- Sprint 3 dépend de Sprint 1 pour l'utilisateur connecté.

- Sprint 3 dépend partiellement de Sprint 2 pour disposer de joueurs seedés.

- Le chat dépend des équipes et des permissions.

- La recette du Sprint 4 dépend d'une équipe et d'un chat présentables.

### 7.2 Dépendances techniques

- JwtAuthGuard fonctionnel ;

- base de données disponible ;

- Socket.io installé côté front et back ;

- CORS et WebSocket configurés ;

- compte démo présent.

## 8 Definition of Done du Sprint 3

Le Sprint 3 est terminé si :

- un utilisateur peut créer une équipe ;

- un utilisateur peut rejoindre une équipe via code ;

- les rôles CAPTAIN/MEMBER existent ;

- un non-membre ne peut pas accéder au chat ;

- un membre peut consulter l'équipe ;

- un membre peut envoyer un message ;

- les messages sont sauvegardés ;

- Socket.io fonctionne au minimum ;

- l'interface chat est utilisable ;

- les données seedées suffisent pour la soutenance.

## 9 Tests à réaliser pendant le Sprint 3

### 9.1 Tests API équipes

- POST /api/teams sans token ;

- POST /api/teams avec token ;

- création avec nom invalide ;

- rejoindre avec code valide ;

- rejoindre avec code invalide ;

- rejoindre deux fois la même équipe ;

- action capitaine avec membre simple ;

- accès non-membre refusé.

### 9.2 Tests chat

- récupérer historique comme membre ;

- récupérer historique comme non-membre ;

- envoyer message valide ;

- envoyer message vide ;

- envoyer message trop long ;

- réception temps réel dans la room ;

- refus d'un socket non authentifié ;

- refus d'un socket non membre.

### 9.3 Tests front

- page équipe affichée ;

- membres affichés ;

- création équipe depuis UI ;

- rejoindre équipe depuis UI ;

- chat visible ;

- message envoyé ;

- message reçu ;

- erreurs affichées ;

- responsive minimal.

## 10 Risques du Sprint 3

### 10.1 Risque : chat temps réel plus complexe que prévu

Impact : retard.

Solution : limiter le chat à historique, envoi, réception et permissions.

### 10.2 Risque : permissions mal vérifiées

Impact : fuite de messages d'équipe.

Solution : appliquer TeamMemberGuard côté REST et côté Socket.io.

### 10.3 Risque : front/back désynchronisés sur les événements socket

Impact : chat inutilisable.

Solution : documenter les événements et tester rapidement à deux sessions.

### 10.4 Risque : vouloir ajouter trop de social

Impact : dépassement du scope.

Solution : reporter amis, MP, notifications et feed social en bonus.

### 10.5 Risque : absence de données d'équipe en démo

Impact : soutenance moins convaincante.

Solution : seed équipe, membres et messages dès ce sprint.

## 11 Checklist de fin Sprint 3

- Modèle Team créé.

- Modèle TeamMember créé.

- Modèle ChatMessage créé.

- Migrations exécutées.

- Création équipe fonctionnelle.

- Rejoindre équipe fonctionnel.

- Rôles CAPTAIN/MEMBER actifs.

- TeamMemberGuard actif.

- TeamRoleGuard actif.

- Page équipe prête.

- Liste membres visible.

- API messages prête.

- Socket.io configuré.

- Room team:{teamId} utilisée.

- Interface chat prête.

- Seed équipe/messages prêt.

- Swagger mis à jour.

## 12 Passage au Sprint 4

Le passage au Sprint 4 est possible quand :

- le parcours login → dashboard → leaderboard → équipe → chat fonctionne ;

- le compte démo appartient à une équipe ;

- le chat contient quelques messages ;

- les permissions de base sont correctes ;

- les bugs bloquants sont identifiés ;

- le MVP est prêt à être stabilisé.

## 13 Conclusion

Le Sprint 3 ajoute la dimension sociale de Track'N Share.

Avec les équipes, les rôles et le chat temps réel, le MVP devient plus complet et plus proche de l'objectif initial : suivre, comparer et partager ses performances gaming dans un cadre communautaire.

Une fois ce sprint terminé, le projet peut passer à la phase de polish, tests, recette et préparation de soutenance.
