# DOCUMENTATION SOCKET.IO

Projet Track'N Share

Version : 1.0

Date : 06/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit l'utilisation de Socket.io dans le projet Track'N Share.

Socket.io est utilisé pour gérer les fonctionnalités temps réel de l'application, principalement le chat d'équipe. Il pourra aussi être utilisé pour les notifications instantanées, le statut en ligne/hors ligne, les messages privés et certains événements de progression.

Ce document complète la documentation REST API. Les routes REST servent à récupérer, créer ou modifier des données de manière classique, tandis que Socket.io permet de pousser des événements en direct aux utilisateurs connectés.

## 1 Vue d'ensemble

### 1.1 Rôle de Socket.io

Socket.io permet une communication bidirectionnelle en temps réel entre le front-end React/PWA et le back-end NestJS.

Dans Track'N Share, Socket.io sert principalement à :

- envoyer et recevoir des messages dans le chat d'équipe ;

- diffuser les nouveaux messages aux membres connectés ;

- gérer les rooms d'équipe ;

- afficher le statut en ligne/hors ligne en bonus ;

- envoyer des notifications instantanées en bonus ;

- préparer les futurs messages privés temps réel.

### 1.2 Fonctionnalités concernées

MVP :

- connexion socket authentifiée ;

- rejoindre une room d'équipe ;

- quitter une room d'équipe ;

- envoyer un message dans le chat d'équipe ;

- recevoir un message d'équipe ;

- gérer les erreurs d'accès ;

- charger l'historique via REST.

Bonus :

- messages privés ;

- statut en ligne/hors ligne ;

- typing indicator ;

- notifications instantanées ;

- badge de messages non lus ;

- reconnexion automatique améliorée ;

- modération temps réel.

### 1.3 Architecture générale

Flux général :

Front-end React/PWA

→ Socket.io Client

→ Socket.io Gateway NestJS

→ AuthService

→ TeamsService

→ MessageService

→ Base de données PostgreSQL

→ Redis si cache, pub/sub ou scaling

→ Broadcast vers les membres connectés

## 2 Stack technique

### 2.1 Côté front-end

Technologies :

- React ;

- TypeScript ;

- socket.io-client ;

- Valtio pour stocker l'état temps réel si nécessaire ;

- PWA.

Rôle :

- établir la connexion socket ;

- envoyer les événements utilisateur ;

- écouter les événements serveur ;

- mettre à jour l'interface du chat ;

- gérer les erreurs et reconnexions.

### 2.2 Côté back-end

Technologies :

- NestJS ;

- TypeScript ;

- @nestjs/websockets ;

- @nestjs/platform-socket.io ;

- socket.io ;

- Guards ou middleware d'authentification ;

- MessageService ;

- TeamsService ;

- AuthService.

Rôle :

- authentifier la connexion ;

- vérifier les permissions ;

- gérer les rooms ;

- recevoir les événements ;

- sauvegarder les messages ;

- diffuser les événements aux bons utilisateurs.

### 2.3 Base de données

Les messages doivent être sauvegardés en base durable.

Recommandation :

- PostgreSQL pour stocker les conversations et messages ;

- Redis pour cache, sessions, présence en ligne ou pub/sub si besoin ;

- Redis-JSON possible selon la contrainte projet, mais les messages doivent rester structurés et sécurisés.

## 3 Connexion Socket.io

### 3.1 URL de connexion

En local :

ws://localhost:3000

ou avec Socket.io client :

http://localhost:3000

En production :

https://api.tracknshare.example.com

### 3.2 Namespace recommandé

Pour organiser les événements, il est possible d'utiliser un namespace :

/chat

Exemple :

const socket = io("http://localhost:3000/chat", {

auth: {

token: accessToken

}

});

Pour le MVP, un seul namespace /chat est suffisant pour le chat d'équipe.

### 3.3 Authentification à la connexion

La connexion Socket.io doit être authentifiée.

Le front peut envoyer le token dans :

- socket.handshake.auth.token ;

- ou dans un cookie sécurisé si la stratégie cookie est retenue.

Exemple côté client :

const socket = io(API_URL + "/chat", {

auth: {

token: accessToken

},

transports: ["websocket"]

});

Règles :

- un utilisateur non authentifié ne doit pas pouvoir rejoindre une room privée ;

- le back-end doit vérifier le token ;

- le socket doit être associé à un userId ;

- les données sensibles ne doivent pas être envoyées dans les logs.

## 4 Rooms Socket.io

### 4.1 Définition

Une room Socket.io est un salon virtuel permettant d'envoyer un événement uniquement à certains clients connectés.

Dans Track'N Share, chaque équipe peut avoir sa room de chat.

### 4.2 Convention de nommage des rooms

Room d'équipe :

team:{teamId}

Exemple :

team:team_123

Room utilisateur en bonus :

user:{userId}

Exemple :

user:user_123

Room de conversation privée en bonus :

conversation:{conversationId}

### 4.3 Règles d'accès aux rooms

Room d'équipe :

- seul un membre actif de l'équipe peut rejoindre la room ;

- le capitaine, co-capitaine et membre ont accès ;

- un utilisateur qui a quitté l'équipe ne doit plus accéder à la room ;

- un visiteur non connecté n'a jamais accès ;

- le back-end vérifie l'appartenance via TeamsService.

Room utilisateur :

- seul l'utilisateur concerné doit rejoindre sa room personnelle.

Room privée :

- seuls les participants de la conversation peuvent rejoindre la room.

## 5 Événements client vers serveur

5.1 joinTeamRoom

Priorité : P0

Direction : client → serveur

Description : permet à un membre de rejoindre la room Socket.io d'une équipe.

Payload :

{

"teamId": "team_123"

}

Règles :

- l'utilisateur doit être authentifié ;

- l'utilisateur doit être membre actif de l'équipe ;

- si l'utilisateur n'est pas membre, l'accès est refusé ;

- si l'équipe n'existe pas, une erreur est retournée.

Réponse / événement serveur possible : teamRoomJoined

Payload de succès :

{

"teamId": "team_123",

"room": "team:team_123",

"joinedAt": "2026-05-06T12:00:00.000Z"

}

Erreurs possibles :

- SOCKET_UNAUTHORIZED ;

- TEAM_NOT_FOUND ;

- CHAT_NOT_TEAM_MEMBER.

5.2 leaveTeamRoom

Priorité : P0

Direction : client → serveur

Description : permet à un utilisateur de quitter la room d'une équipe.

Payload :

{

"teamId": "team_123"

}

Réponse possible : teamRoomLeft

Payload :

{

"teamId": "team_123",

"room": "team:team_123"

}

5.3 sendTeamMessage

Priorité : P0

Direction : client → serveur

Description : envoie un message dans le chat d'équipe.

Payload :

{

"teamId": "team_123",

"content": "On joue ce soir ?"

}

Règles :

- l'utilisateur doit être authentifié ;

- l'utilisateur doit être membre actif de l'équipe ;

- le message ne doit pas être vide ;

- le message doit respecter une longueur maximale ;

- le message doit être sauvegardé en base ;

- le message est ensuite diffusé aux membres connectés de l'équipe.

Réponse serveur directe possible : teamMessageSent

Payload :

{

"tempId": "client_temp_123",

"messageId": "msg_123",

"teamId": "team_123",

"createdAt": "2026-05-06T12:05:00.000Z"

}

Broadcast serveur : teamMessageReceived

5.4 typingStart

Priorité : P2

Direction : client → serveur

Description : indique qu'un utilisateur commence à écrire dans un chat d'équipe.

Payload :

{

"teamId": "team_123"

}

Broadcast : userTyping

Règles :

- événement bonus ;

- ne pas sauvegarder en base ;

- limiter la fréquence pour éviter le spam.

5.5 typingStop

Priorité : P2

Direction : client → serveur

Description : indique qu'un utilisateur arrête d'écrire.

Payload :

{

"teamId": "team_123"

}

Broadcast : userStoppedTyping

5.6 markTeamMessagesRead

Priorité : P1

Direction : client → serveur

Description : marque les messages d'une équipe comme lus pour l'utilisateur connecté.

Payload :

{

"teamId": "team_123",

"lastReadMessageId": "msg_123"

}

Règles :

- utile pour badges de messages non lus ;

- peut aussi être fait via REST.

## 6 Événements serveur vers client

6.1 connected

Priorité : P0

Direction : serveur → client

Description : confirme la connexion socket.

Payload :

{

"socketId": "abc123",

"userId": "user_123",

"connectedAt": "2026-05-06T12:00:00.000Z"

}

6.2 teamRoomJoined

Priorité : P0

Direction : serveur → client

Description : confirme que l'utilisateur a rejoint une room d'équipe.

Payload :

{

"teamId": "team_123",

"room": "team:team_123"

}

6.3 teamRoomLeft

Priorité : P0

Direction : serveur → client

Description : confirme que l'utilisateur a quitté une room d'équipe.

Payload :

{

"teamId": "team_123",

"room": "team:team_123"

}

6.4 teamMessageReceived

Priorité : P0

Direction : serveur → client

Description : événement diffusé aux membres connectés lorsqu'un message est envoyé dans une équipe.

Payload :

{

"id": "msg_123",

"teamId": "team_123",

"conversationId": "conv_123",

"sender": {

"id": "user_123",

"username": "ClementTNS",

"avatarUrl": "https://cdn.example.com/avatar.png"

},

"content": "On joue ce soir ?",

"createdAt": "2026-05-06T12:05:00.000Z"

}

Règles :

- ne diffuser qu'aux membres connectés dans la room ;

- ne pas diffuser à des utilisateurs externes ;

- si les messages sont chiffrés, ne pas exposer d'informations inutiles.

6.5 teamMessageSent

Priorité : P0

Direction : serveur → client émetteur

Description : confirme à l'émetteur que le message a été accepté et sauvegardé.

Payload :

{

"tempId": "client_temp_123",

"messageId": "msg_123",

"status": "SENT",

"createdAt": "2026-05-06T12:05:00.000Z"

}

6.6 teamMessageDeleted

Priorité : P1

Direction : serveur → clients de la room

Description : informe les membres qu'un message a été supprimé ou masqué.

Payload :

{

"teamId": "team_123",

"messageId": "msg_123",

"deletedAt": "2026-05-06T12:10:00.000Z"

}

6.7 userTyping

Priorité : P2

Direction : serveur → clients de la room

Description : indique qu'un utilisateur est en train d'écrire.

Payload :

{

"teamId": "team_123",

"userId": "user_123",

"username": "ClementTNS"

}

6.8 userStoppedTyping

Priorité : P2

Direction : serveur → clients de la room

Description : indique qu'un utilisateur a arrêté d'écrire.

6.9 notificationReceived

Priorité : P1

Direction : serveur → client utilisateur

Description : envoie une notification instantanée à un utilisateur.

Payload :

{

"id": "notif_123",

"type": "TEAM_INVITATION",

"title": "Nouvelle invitation d'équipe",

"createdAt": "2026-05-06T12:15:00.000Z",

"targetUrl": "/teams/invitations"

}

6.10 presenceUpdated

Priorité : P1

Direction : serveur → clients autorisés

Description : informe qu'un utilisateur est en ligne ou hors ligne.

Payload :

{

"userId": "user_123",

"status": "ONLINE",

"updatedAt": "2026-05-06T12:00:00.000Z"

}

## 7 Événements d'erreur

7.1 socketError

Direction : serveur → client

Description : événement générique d'erreur Socket.io.

Payload :

{

"code": "CHAT_NOT_TEAM_MEMBER",

"message": "Vous n'êtes pas membre de cette équipe.",

"context": {

"teamId": "team_123"

}

}

### 7.2 Codes d'erreur recommandés

SOCKET_UNAUTHORIZED

L'utilisateur n'est pas authentifié ou le token est invalide.

SOCKET_TOKEN_EXPIRED

Le token est expiré.

TEAM_NOT_FOUND

L'équipe demandée est introuvable.

CHAT_NOT_TEAM_MEMBER

L'utilisateur n'est pas membre de l'équipe.

MESSAGE_EMPTY

Le contenu du message est vide.

MESSAGE_TOO_LONG

Le message dépasse la longueur maximale.

MESSAGE_SAVE_FAILED

Le message n'a pas pu être sauvegardé.

ROOM_JOIN_FAILED

Impossible de rejoindre la room.

RATE_LIMITED

Trop d'événements envoyés en peu de temps.

## 8 Flux principal : chat d'équipe

### 8.1 Chargement initial du chat

Le chargement de l'historique doit rester en REST.

Flux recommandé :

1. L'utilisateur ouvre /teams/:id/chat.

2. Le front appelle GET /teams/:id/messages.

3. Le back vérifie que l'utilisateur est membre.

4. Le back retourne les derniers messages paginés.

5. Le front connecte Socket.io ou réutilise une connexion active.

6. Le front émet joinTeamRoom avec teamId.

7. Le serveur vérifie l'appartenance à l'équipe.

8. Le serveur ajoute le socket à team:{teamId}.

9. Le chat reçoit les nouveaux messages en direct.

### 8.2 Envoi d'un message

Flux recommandé :

1. L'utilisateur saisit un message.

2. Le front valide que le message n'est pas vide.

3. Le front émet sendTeamMessage.

4. Le back vérifie le token.

5. Le back vérifie que l'utilisateur est membre de l'équipe.

6. Le back valide la longueur du message.

7. Le back sauvegarde le message en base.

8. Le back émet teamMessageSent à l'émetteur.

9. Le back diffuse teamMessageReceived à la room team:{teamId}.

10. Les clients affichent le message.

### 8.3 Fallback REST

Si Socket.io est indisponible :

- le front peut envoyer un message via POST /teams/:id/messages ;

- le front peut rafraîchir périodiquement GET /teams/:id/messages ;

- cette solution est moins fluide mais sécurise la démonstration.

## 9 Authentification et autorisation

### 9.1 Authentification socket

À la connexion, le serveur doit :

- récupérer le token ;

- vérifier la signature ;

- vérifier l'expiration ;

- récupérer le userId ;

- associer userId au socket.

Exemple de données attachées au socket côté serveur :

socket.data.user = {

id: "user_123",

username: "ClementTNS",

role: "PLAYER"

};

### 9.2 Autorisation par équipe

Avant joinTeamRoom ou sendTeamMessage, le serveur doit vérifier :

- teamId existe ;

- userId est membre actif ;

- l'utilisateur n'a pas quitté l'équipe ;

- l'équipe n'est pas supprimée ;

- le rôle de l'utilisateur permet l'action.

### 9.3 Ne jamais faire confiance au front-end

Le front peut masquer le bouton ou la page, mais le back-end doit toujours refaire les contrôles.

## 10 Sécurité Socket.io

### 10.1 Données sensibles

Ne jamais envoyer dans les événements :

- mot de passe ;

- hash de mot de passe ;

- tokens externes ;

- refresh token ;

- email si non nécessaire ;

- secrets ;

- clés API.

### 10.2 Validation des payloads

Chaque payload reçu doit être validé.

Exemples :

- teamId non vide ;

- content non vide ;

- content inférieur à la limite ;

- userId non pris depuis le payload mais depuis le token ;

- type d'événement conforme.

### 10.3 Rate limiting

Événements à limiter :

- sendTeamMessage ;

- typingStart ;

- typingStop ;

- joinTeamRoom ;

- notifications si émission côté client.

Objectif :

- limiter le spam ;

- éviter la surcharge serveur ;

- protéger les chats.

### 10.4 Logs

Les logs Socket.io doivent éviter de contenir :

- contenu complet des messages privés ;

- tokens ;

- emails ;

- secrets.

Logs acceptables :

- socket connecté ;

- userId interne ;

- room rejointe ;

- erreur technique ;

- code d'erreur ;

- timestamp.

## 11 Stockage des messages

### 11.1 Table messages recommandée

Champs :

- id ;

- conversationId ;

- senderId ;

- content ou contentEncrypted ;

- iv si chiffrement ;

- createdAt ;

- editedAt ;

- deletedAt ;

- readAt si modèle simple.

### 11.2 Table conversations recommandée

Champs :

- id ;

- type : TEAM ou PRIVATE ;

- teamId si conversation d'équipe ;

- createdAt ;

- updatedAt.

### 11.3 Chiffrement

Pour un niveau de sécurité plus avancé, les messages peuvent être chiffrés avant stockage.

Niveau MVP acceptable :

- messages stockés en base avec accès protégé ;

- validation et permissions strictes.

Niveau recommandé bonus :

- chiffrement applicatif avec AES-GCM ;

- IV unique par message ;

- clé dans les variables d'environnement ;

- pas de contenu sensible dans les logs.

## 12 Présence en ligne

### 12.1 Objectif

Le statut en ligne permet d'indiquer si un ami ou coéquipier est connecté.

Priorité : P1

### 12.2 Fonctionnement possible

À la connexion :

- le socket est associé au userId ;

- le serveur stocke userId → socketIds ;

- si au moins un socket est actif, l'utilisateur est ONLINE.

À la déconnexion :

- le socket est retiré ;

- si aucun socket actif ne reste, l'utilisateur passe OFFLINE.

### 12.3 Stockage Redis possible

Clé possible :

presence:user:{userId}

Valeur :

{

"status": "ONLINE",

"lastSeenAt": "2026-05-06T12:00:00.000Z"

}

## 13 Notifications temps réel

### 13.1 Objectif

Les notifications Socket.io permettent d'informer immédiatement un utilisateur.

Exemples :

- invitation d'équipe ;

- nouveau message ;

- badge débloqué ;

- changement de rang ;

- fin de saison.

### 13.2 Room personnelle

Chaque utilisateur connecté peut rejoindre :

user:{userId}

Cela permet d'envoyer une notification à un seul utilisateur.

### 13.3 Règles

- une notification importante doit aussi être sauvegardée en base ;

- Socket.io sert à l'affichage instantané ;

- si l'utilisateur est hors ligne, il récupérera la notification via REST plus tard.

## 14 Messages privés

### 14.1 Priorité

Priorité : P1

Les messages privés ne sont pas indispensables au MVP si le chat d'équipe est déjà fonctionnel.

### 14.2 Rooms privées

Room possible :

conversation:{conversationId}

Règles :

- seuls les participants peuvent rejoindre ;

- un utilisateur bloqué ne peut pas envoyer de message ;

- les messages privés sont des données sensibles.

### 14.3 Événements possibles

Client → serveur :

- joinPrivateConversation ;

- leavePrivateConversation ;

- sendPrivateMessage.

Serveur → client :

- privateMessageReceived ;

- privateMessageSent ;

- privateConversationUpdated.

## 15 Reconnexion

### 15.1 Comportement attendu

Socket.io gère déjà une partie de la reconnexion.

Le front doit :

- afficher un statut de connexion si nécessaire ;

- réessayer automatiquement ;

- rejoindre à nouveau les rooms nécessaires après reconnexion ;

- éviter d'envoyer plusieurs fois le même message.

### 15.2 Messages temporaires côté front

Pour améliorer l'UX, le front peut créer un tempId pour un message avant confirmation serveur.

Exemple :

{

"tempId": "client_temp_123",

"teamId": "team_123",

"content": "On joue ce soir ?"

}

Le serveur retourne ensuite :

{

"tempId": "client_temp_123",

"messageId": "msg_123"

}

Cela permet de remplacer le message temporaire par le message officiel.

## 16 Scaling et Redis adapter

### 16.1 Problème

Si le back-end tourne sur plusieurs instances, chaque instance Socket.io ne connaît pas automatiquement les sockets connectés aux autres instances.

### 16.2 Solution

Utiliser un adapter Redis Socket.io.

Rôle :

- synchroniser les rooms entre instances ;

- permettre le broadcast multi-instance ;

- améliorer la scalabilité.

### 16.3 Priorité

Pour le MVP local ou soutenance : P2.

Pour une production réelle : recommandé.

## 17 Exemple de structure NestJS

Modules possibles :

ChatModule

- ChatGateway

- ChatService

- MessagesService

- ConversationsService

AuthModule

- AuthService

- JwtService

TeamsModule

- TeamsService

- TeamMembersService

NotificationsModule

- NotificationsGateway

- NotificationsService

Exemple logique :

ChatGateway reçoit sendTeamMessage.

ChatGateway vérifie socket.data.user.

ChatGateway appelle TeamsService pour vérifier l'accès.

ChatGateway appelle MessagesService pour sauvegarder.

ChatGateway diffuse teamMessageReceived à la room.

## 18 Exemple de structure front-end

Dossiers possibles :

/features/chat

chat.socket.ts

chat.service.ts

chat.store.ts

ChatPage.tsx

ChatMessage.tsx

ChatInput.tsx

/features/notifications

notifications.socket.ts

notifications.store.ts

/services/socket.ts

/types/socket-events.ts

## 19 Types TypeScript recommandés

TeamMessagePayload :

{

teamId: string;

content: string;

tempId?: string;

}

TeamMessageReceivedPayload :

{

id: string;

teamId: string;

conversationId: string;

sender: {

id: string;

username: string;

avatarUrl?: string;

};

content: string;

createdAt: string;

}

SocketErrorPayload :

{

code: string;

message: string;

context?: Record<string, unknown>;

}

PresencePayload :

{

userId: string;

status: "ONLINE" | "OFFLINE";

updatedAt: string;

}

## 20 Tests à prévoir

### 20.1 Tests back-end

Tester :

- connexion socket avec token valide ;

- refus d'une connexion sans token ;

- joinTeamRoom par membre ;

- refus joinTeamRoom par non-membre ;

- sendTeamMessage par membre ;

- refus message vide ;

- refus message trop long ;

- broadcast aux membres ;

- absence de broadcast aux non-membres.

### 20.2 Tests front-end

Tester :

- connexion socket ;

- affichage d'un message reçu ;

- état de déconnexion ;

- message temporaire ;

- erreur d'envoi ;

- reconnexion.

### 20.3 Tests manuels MVP

Scénario :

1. Connecter deux utilisateurs membres de la même équipe.

2. Ouvrir le chat d'équipe sur deux navigateurs.

3. Envoyer un message depuis le premier utilisateur.

4. Vérifier l'affichage instantané chez le second.

5. Vérifier que le message reste après refresh.

6. Connecter un utilisateur non membre.

7. Vérifier qu'il ne peut pas rejoindre la room.

## 21 Priorisation MVP

Indispensable :

- connexion socket authentifiée ;

- room par équipe ;

- joinTeamRoom ;

- leaveTeamRoom ;

- sendTeamMessage ;

- teamMessageReceived ;

- sauvegarde des messages ;

- historique REST ;

- vérification des permissions ;

- gestion des erreurs principales.

À faire après MVP :

- messages privés ;

- typing indicator ;

- présence en ligne ;

- notifications temps réel ;

- suppression temps réel de message ;

- Redis adapter ;

- chiffrement avancé.

## 22 Risques et solutions

### 22.1 Risque : accès au chat par un non-membre

Impact : fuite de conversations privées.

Solution : vérifier l'appartenance côté back-end avant joinTeamRoom et sendTeamMessage.

### 22.2 Risque : spam de messages

Impact : surcharge et mauvaise expérience utilisateur.

Solution : rate limiting sur sendTeamMessage et limite de longueur.

### 22.3 Risque : message non sauvegardé mais diffusé

Impact : message visible puis perdu après refresh.

Solution : sauvegarder le message avant broadcast, ou gérer clairement l'échec.

### 22.4 Risque : reconnexion sans rejoindre les rooms

Impact : l'utilisateur ne reçoit plus les messages.

Solution : côté front, rejoindre à nouveau les rooms après reconnect.

### 22.5 Risque : données sensibles dans les logs

Impact : fuite de données.

Solution : ne pas logger le contenu complet des messages ni les tokens.

### 22.6 Risque : Socket.io indisponible pendant la soutenance

Impact : chat temps réel inutilisable.

Solution : prévoir un fallback REST simple pour envoyer et recharger les messages.

## 23 Tableau récapitulatif des événements

| Événement | Direction | Priorité | Description |

|---|---|---|---|

| joinTeamRoom | Client → Serveur | P0 | Rejoindre la room d'une équipe |

| leaveTeamRoom | Client → Serveur | P0 | Quitter la room d'une équipe |

| sendTeamMessage | Client → Serveur | P0 | Envoyer un message d'équipe |

| connected | Serveur → Client | P0 | Confirmer la connexion socket |

| teamRoomJoined | Serveur → Client | P0 | Confirmer l'entrée dans une room |

| teamRoomLeft | Serveur → Client | P0 | Confirmer la sortie d'une room |

| teamMessageSent | Serveur → Client | P0 | Confirmer l'envoi à l'émetteur |

| teamMessageReceived | Serveur → Client | P0 | Diffuser un message aux membres |

| socketError | Serveur → Client | P0 | Retourner une erreur socket |

| teamMessageDeleted | Serveur → Client | P1 | Informer la suppression d'un message |

| notificationReceived | Serveur → Client | P1 | Envoyer une notification temps réel |

| presenceUpdated | Serveur → Client | P1 | Mettre à jour le statut en ligne |

| typingStart | Client → Serveur | P2 | Début de saisie |

| typingStop | Client → Serveur | P2 | Fin de saisie |

| userTyping | Serveur → Client | P2 | Un utilisateur écrit |

| userStoppedTyping | Serveur → Client | P2 | Un utilisateur arrête d'écrire |

## 24 Critères d'acceptation

La documentation et l'implémentation Socket.io sont considérées correctes si :

- un utilisateur connecté peut établir une connexion socket ;

- un utilisateur non connecté est refusé ;

- un membre d'équipe peut rejoindre la room de son équipe ;

- un non-membre ne peut pas rejoindre la room ;

- un membre peut envoyer un message ;

- un message vide est refusé ;

- un message envoyé est sauvegardé ;

- les autres membres connectés reçoivent le message en temps réel ;

- l'historique reste disponible après refresh via REST ;

- les erreurs sont renvoyées proprement ;

- les données sensibles ne sont pas exposées ;

- le système prévoit un fallback REST si nécessaire.

## 25 Conclusion

Socket.io est une brique importante de Track'N Share car il permet de rendre l'application plus vivante et collaborative.

Pour le MVP, l'objectif principal est de réussir le chat d'équipe : connexion authentifiée, rooms par équipe, vérification des permissions, envoi de messages, sauvegarde en base et diffusion temps réel.

Les fonctionnalités comme les messages privés, les notifications instantanées, le statut en ligne, les typing indicators et le scaling multi-instance peuvent être ajoutées progressivement après validation du chat d'équipe.
