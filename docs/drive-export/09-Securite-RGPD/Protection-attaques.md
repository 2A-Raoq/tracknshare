# PROTECTION CONTRE LES ATTAQUES

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit les principales attaques pouvant viser Track'N Share et les mesures de protection prévues pour le MVP.

Track'N Share est une PWA avec une API REST NestJS, une authentification JWT, Socket.io pour le temps réel, une base PostgreSQL, Redis pour le cache / sessions / leaderboards, des intégrations externes Steam / Epic/EOS et des fonctionnalités sociales comme les équipes et le chat. Ces éléments créent plusieurs surfaces d'attaque qu'il faut anticiper dès la conception.

Le document reste volontairement défensif : il sert à protéger l'application, pas à fournir des techniques d'exploitation.

Sources officielles et références utilisées

- OWASP Top 10:2021 : https://owasp.org/Top10/2021/

- OWASP API Security Top 10 2023 : https://owasp.org/API-Security/editions/2023/en/0x11-t10/

- OWASP Cheat Sheet Series : https://cheatsheetseries.owasp.org/

- OWASP Cross Site Scripting Prevention Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

- OWASP SQL Injection Prevention Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

- OWASP Authentication Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

- OWASP Password Storage Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

- OWASP CSRF Prevention Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

- OWASP File Upload Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html

- OWASP HTTP Headers Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html

## 1 Vue d'ensemble

### 1.1 Objectif de sécurité

L'objectif est de réduire les risques sur :

- les comptes utilisateurs ;

- les mots de passe ;

- les tokens JWT ;

- les profils ;

- les statistiques ;

- les leaderboards ;

- les équipes ;

- les invitations ;

- les chats d'équipe ;

- les fichiers uploadés ;

- les APIs externes ;

- la base de données ;

- Redis ;

- la PWA et son cache ;

- les secrets d'environnement.

### 1.2 Surfaces d'attaque principales

Surfaces principales :

- front-end React/PWA ;

- API REST NestJS ;

- endpoints d'authentification ;

- endpoints de statistiques et synchronisation ;

- endpoints d'équipe et invitations ;

- Socket.io ;

- PostgreSQL ;

- Redis ;

- stockage d'avatars ;

- intégrations Steam / Epic / EOS ;

- Swagger ;

- routes d'administration ;

- routes de mode démo ;

- pipelines de déploiement et variables d'environnement.

### 1.3 Principe général

La sécurité ne doit jamais reposer uniquement sur le front-end.

Le front-end peut améliorer l'expérience utilisateur en masquant des boutons ou routes, mais toutes les vérifications importantes doivent être réalisées côté back-end : authentification, autorisation, propriété des ressources, rôles d'équipe, validation des données et rate limiting.

## 2 Référentiel OWASP adapté à Track'N Share

### 2.1 OWASP Top 10 web

Risques OWASP Top 10 particulièrement pertinents :

- Broken Access Control ;

- Cryptographic Failures ;

- Injection ;

- Insecure Design ;

- Security Misconfiguration ;

- Vulnerable and Outdated Components ;

- Identification and Authentication Failures ;

- Software and Data Integrity Failures ;

- Security Logging and Monitoring Failures ;

- Server-Side Request Forgery.

### 2.2 OWASP API Security Top 10

Risques API particulièrement pertinents :

- Broken Object Level Authorization ;

- Broken Authentication ;

- Broken Object Property Level Authorization ;

- Unrestricted Resource Consumption ;

- Broken Function Level Authorization ;

- Unrestricted Access to Sensitive Business Flows ;

- Server-Side Request Forgery ;

- Security Misconfiguration ;

- Improper Inventory Management ;

- Unsafe Consumption of APIs.

### 2.3 Application au projet

Track'N Share doit se concentrer en priorité sur :

- contrôle d'accès objet par objet ;

- permissions d'équipe ;

- protection des chats ;

- validation des entrées ;

- limitation des abus ;

- stockage sécurisé des mots de passe ;

- protection des tokens ;

- sécurisation des intégrations externes ;

- absence de secrets dans le front-end ;

- logs utiles sans données sensibles.

## 3 Contrôle d'accès cassé

### 3.1 Description

Le contrôle d'accès cassé apparaît lorsqu'un utilisateur peut accéder à une ressource ou action qui ne lui appartient pas ou pour laquelle il n'a pas le bon rôle.

Exemples dans Track'N Share :

- consulter les statistiques privées d'un autre joueur ;

- modifier le profil d'un autre utilisateur ;

- accéder au chat d'une équipe dont on n'est pas membre ;

- supprimer une équipe en tant que simple membre ;

- accéder à une route admin avec un compte standard ;

- consulter une notification appartenant à un autre utilisateur.

### 3.2 Mesures de protection

Mesures back-end :

- JwtAuthGuard sur toutes les routes privées ;

- ResourceOwnerGuard pour les ressources personnelles ;

- TeamMemberGuard pour les routes d'équipe ;

- TeamRoleGuard pour capitaine / co-capitaine ;

- RolesGuard pour admin / modérateur ;

- vérification de la propriété des ressources en base ;

- ne jamais se fier au userId envoyé dans le body ;

- récupérer l'utilisateur depuis le JWT validé.

### 3.3 Règles Track'N Share

- un utilisateur ne modifie que son propre profil ;

- un utilisateur ne synchronise que ses propres comptes de jeu ;

- un membre ne lit que le chat de ses équipes ;

- un capitaine ne gère que son équipe ;

- une route admin exige un rôle ADMIN ;

- les permissions Socket.io sont vérifiées avant joinTeamRoom et sendTeamMessage.

## 4 Authentification et attaques sur les comptes

### 4.1 Risques

Risques principaux :

- bruteforce de mot de passe ;

- credential stuffing ;

- token JWT volé ;

- token expiré mais encore accepté ;

- refresh token mal stocké ;

- mot de passe faible ;

- message d'erreur trop précis ;

- session non nettoyée après logout.

### 4.2 Mesures de protection

Inscription et connexion :

- hash des mots de passe avec Argon2 ou bcrypt ;

- politique de mot de passe minimale ;

- message d'erreur générique sur login ;

- rate limiting sur POST /auth/login ;

- rate limiting sur POST /auth/register ;

- pas de hash retourné côté front ;

- pas de mot de passe dans les logs.

JWT :

- JWT signé avec un secret fort ;

- JWT_SECRET en variable d'environnement ;

- access token de durée limitée ;

- refresh token sécurisé si activé ;

- rotation des refresh tokens en évolution ;

- logout nettoyant l'état front ;

- rejet des tokens expirés.

### 4.3 Mesures front-end

- ne jamais stocker de mot de passe côté front ;

- éviter de stocker des tokens sensibles dans localStorage en production ;

- nettoyer le store utilisateur à la déconnexion ;

- rediriger vers login sur 401 ;

- invalider les données privées affichées après logout.

## 5 Injection SQL / NoSQL / commande

### 5.1 Risques

Les injections apparaissent lorsqu'une entrée utilisateur est utilisée de manière non contrôlée dans une requête, une commande ou une expression.

Exemples de zones à risque :

- recherche de joueurs ou équipes ;

- filtres de leaderboards ;

- paramètres d'URL ;

- body des endpoints REST ;

- noms d'équipe ;

- contenu de profil ;

- code d'invitation ;

- synchronisation de données externes.

### 5.2 Mesures de protection

- utiliser un ORM ou query builder avec requêtes paramétrées ;

- ne jamais construire une requête SQL par concaténation de chaînes ;

- valider tous les DTO avec class-validator ;

- transformer les types attendus avec class-transformer ;

- limiter les champs de tri autorisés ;

- imposer des limites de pagination ;

- refuser les champs inattendus ;

- nettoyer les données externes avant insertion ;

- éviter d'exécuter toute commande système basée sur une entrée utilisateur.

### 5.3 Cas PostgreSQL

PostgreSQL ne doit être accessible que depuis le back-end.

Règles :

- pas d'accès direct depuis le front ;

- identifiants BDD en variables d'environnement ;

- utilisateur BDD avec privilèges minimaux ;

- migrations contrôlées ;

- sauvegardes sécurisées ;

- logs sans requêtes contenant des données sensibles.

## 6 Cross-Site Scripting ou XSS

### 6.1 Risques

Une faille XSS permettrait d'injecter du contenu actif dans l'interface utilisateur.

Zones à risque :

- bio du profil ;

- pseudo ;

- nom ou description d'équipe ;

- messages de chat ;

- notifications ;

- commentaires futurs ;

- contenus importés depuis APIs externes.

### 6.2 Mesures de protection

Front-end :

- ne pas utiliser d'injection HTML directe ;

- échapper le contenu utilisateur ;

- utiliser le rendu React standard ;

- éviter dangerouslySetInnerHTML ;

- mettre en place une Content Security Policy si possible ;

- nettoyer les contenus riches si un éditeur HTML est ajouté.

Back-end :

- valider les longueurs ;

- refuser certains contenus non attendus ;

- stocker les messages comme texte, pas comme HTML ;

- limiter le Markdown ou le désactiver pour le MVP ;

- ne pas renvoyer de contenu externe non contrôlé sans validation.

### 6.3 Règle MVP

Pour le MVP, les champs utilisateur doivent être traités comme du texte brut.

Les messages de chat, bios et descriptions d'équipe ne doivent pas autoriser de HTML.

## 7 Cross-Site Request Forgery ou CSRF

### 7.1 Risques

Le CSRF concerne surtout les applications utilisant des cookies automatiquement envoyés par le navigateur.

Si Track'N Share stocke des tokens en cookie HttpOnly, il faut protéger les endpoints sensibles contre les requêtes déclenchées depuis un autre site.

### 7.2 Mesures de protection

Si cookies utilisés :

- SameSite=Lax ou Strict selon besoin ;

- Secure en production ;

- HttpOnly pour tokens sensibles ;

- vérification Origin / Referer ;

- token CSRF si nécessaire ;

- méthodes HTTP adaptées ;

- CORS strict.

Si Authorization Bearer header utilisé :

- risque CSRF réduit ;

- attention accrue au risque XSS ;

- ne pas exposer le token dans logs ou URL.

## 8 Server-Side Request Forgery ou SSRF

### 8.1 Risques

Le SSRF peut apparaître si le back-end appelle une URL fournie ou contrôlée par l'utilisateur.

Zones potentielles :

- import d'avatar par URL ;

- récupération d'image externe ;

- intégrations Steam / Epic ;

- webhooks futurs ;

- synchronisation externe configurée dynamiquement.

### 8.2 Mesures de protection

- ne pas accepter d'URL arbitraire pour les appels serveur ;

- utiliser une liste blanche de domaines externes autorisés ;

- bloquer les IP privées, localhost et métadonnées cloud ;

- imposer HTTPS ;

- définir timeout court ;

- limiter la taille des réponses ;

- ne pas suivre les redirections dangereuses ;

- ne pas exposer les réponses brutes d'une API externe.

### 8.3 Application Track'N Share

Les appels Steam et Epic doivent utiliser des base URLs configurées côté serveur, jamais fournies par l'utilisateur.

Exemples :

- STEAM_API_BASE_URL ;

- STEAM_PARTNER_API_BASE_URL ;

- EPIC_API_BASE_URL si l'intégration est activée.

## 9 Attaques sur les APIs REST

### 9.1 Risques API

Risques principaux :

- accès objet non autorisé ;

- manque de validation ;

- surcharge par trop de requêtes ;

- pagination absente ;

- endpoints admin exposés ;

- mauvaise gestion des erreurs ;

- fuite d'informations dans les réponses ;

- inventaire d'API incomplet.

### 9.2 Mesures de protection

- authentification sur routes privées ;

- autorisation par ressource ;

- DTO stricts ;

- validation globale NestJS ;

- pagination obligatoire sur listes ;

- limite de taille des payloads ;

- rate limiting ;

- versioning API ;

- Swagger protégé ou désactivé en production si nécessaire ;

- réponses d'erreur standardisées ;

- pas de stack trace côté client.

### 9.3 Routes sensibles à renforcer

- POST /auth/login ;

- POST /auth/register ;

- POST /stats/sync ;

- POST /teams/join ;

- POST /teams/:id/messages ;

- POST /teams/:id/invitations ;

- POST /demo/seed ;

- routes /admin ;

- endpoints de suppression ;

- endpoints d'upload.

## 10 Attaques Socket.io et temps réel

### 10.1 Risques

- connexion socket sans authentification ;

- rejoindre une room d'équipe sans être membre ;

- spam de messages ;

- flooding de typing events ;

- usurpation d'identité dans le payload ;

- broadcast à la mauvaise room ;

- fuite de messages à des non-membres.

### 10.2 Mesures de protection

- authentifier le socket au handshake ;

- stocker userId dans socket.data depuis le token validé ;

- ne jamais accepter senderId depuis le client ;

- vérifier TeamMemberGuard avant joinTeamRoom ;

- vérifier l'appartenance avant sendTeamMessage ;

- rate limiting par userId + teamId ;

- rooms nommées proprement : team:{teamId} ;

- ne diffuser qu'à la room autorisée ;

- logs sans contenu complet des messages.

### 10.3 Critères de test

- un non-membre ne peut pas rejoindre team:{teamId} ;

- un non-membre ne peut pas envoyer de message ;

- un membre reçoit les messages de son équipe ;

- un utilisateur d'une autre équipe ne reçoit rien ;

- le spam de messages est bloqué.

## 11 Uploads d'avatars et fichiers

### 11.1 Risques

- upload d'un fichier malveillant ;

- fichier trop volumineux ;

- extension trompeuse ;

- exécution de fichier uploadé ;

- écrasement d'un fichier existant ;

- fuite de chemins serveur ;

- stockage public non contrôlé.

### 11.2 Mesures de protection

- autoriser uniquement PNG, JPG, WebP ;

- vérifier le type MIME et le contenu réel ;

- limiter la taille ;

- renommer les fichiers ;

- stocker hors dossier exécutable ;

- ne jamais exécuter un fichier uploadé ;

- générer des URLs publiques contrôlées ;

- supprimer les métadonnées inutiles si nécessaire ;

- prévoir un avatar par défaut ;

- refuser les fichiers trop grands ou invalides.

### 11.3 Règle MVP

Pour le MVP, il est acceptable de commencer avec des avatars par URL contrôlée ou avatars générés, puis d'ajouter l'upload sécurisé plus tard.

## 12 Attaques sur les équipes, invitations et leaderboards

### 12.1 Risques équipes

- brute force de codes d'invitation ;

- spam d'invitations ;

- création massive d'équipes ;

- promotion non autorisée ;

- exclusion abusive ;

- capitaine quittant l'équipe sans transfert ;

- accès à une équipe privée.

### 12.2 Mesures équipes

- codes d'invitation suffisamment aléatoires ;

- expiration ou régénération contrôlée ;

- rate limiting sur /teams/join ;

- vérification du rôle pour chaque action ;

- TeamRoleGuard pour capitaine / co-capitaine ;

- logs sur actions sensibles ;

- empêcher un capitaine de quitter sans transfert si nécessaire.

### 12.3 Risques leaderboards

- manipulation de stats ;

- score calculé côté front ;

- entrée dans le leaderboard sans minimum de parties ;

- recalcul abusif ;

- affichage de données privées.

### 12.4 Mesures leaderboards

- calcul du score côté back-end ;

- stats importées via provider contrôlé ;

- minimum de parties pour être classé ;

- snapshots de saison figés ;

- recalculs protégés par rôle ou système ;

- cache Redis en lecture ;

- pas de modification manuelle des scores par les joueurs.

## 13 APIs externes et consommation sûre

### 13.1 Risques

- clé API exposée ;

- timeout externe ;

- réponse malformée ;

- données externes non fiables ;

- surcollecte ;

- dépendance bloquante ;

- SSRF si URL externe non contrôlée ;

- rate limit Steam / Epic.

### 13.2 Mesures de protection

- appels externes uniquement côté back-end ;

- clés API dans .env ;

- pas de clés dans React ;

- timeouts courts ;

- retry limité ;

- validation du format de réponse ;

- mapping explicite des données externes ;

- fallback mock ou cache ;

- conservation des anciennes données en cas d'échec ;

- logs sans clé API ni token.

### 13.3 Règles provider

Chaque provider doit passer par une couche d'abstraction :

- SteamProvider ;

- EpicProvider ;

- MockProvider.

Le controller ne doit pas appeler directement une API externe.

## 14 PWA, cache et stockage local

### 14.1 Risques PWA

- données privées accessibles hors ligne après logout ;

- cache de réponses API privées ;

- stockage local de tokens ;

- service worker trop permissif ;

- anciennes données sensibles visibles sur mobile partagé.

### 14.2 Mesures de protection

- stratégie Network First pour données utilisateur ;

- ne pas cacher les réponses privées sans nécessité ;

- vider le store à la déconnexion ;

- nettoyer cache sensible au logout ;

- ne pas stocker de refresh token dans localStorage ;

- protéger les routes privées même en mode PWA ;

- afficher une page offline neutre sans données confidentielles.

## 15 Sécurité Redis et cache

### 15.1 Risques

- Redis exposé publiquement ;

- absence d'authentification ;

- stockage de secrets en clair ;

- clés sans expiration ;

- données sensibles persistées par erreur ;

- confusion entre cache et source de vérité.

### 15.2 Mesures de protection

- Redis accessible uniquement depuis le back-end ;

- mot de passe Redis si environnement partagé ;

- pas d'exposition publique ;

- préfixes de clés clairs ;

- TTL sur données temporaires ;

- ne pas stocker de secrets ou tokens en clair ;

- utiliser Redis pour cache, sessions, rate limiting et locks ;

- PostgreSQL reste source de vérité pour les données principales.

## 16 Configuration, dépendances et supply chain

### 16.1 Risques

- dépendances vulnérables ;

- packages abandonnés ;

- secrets commités ;

- scripts non contrôlés ;

- images Docker obsolètes ;

- environnement de production en mode debug ;

- routes démo ouvertes en production.

### 16.2 Mesures de protection

- maintenir les dépendances à jour ;

- utiliser npm audit ou équivalent ;

- verrouiller les versions via lockfile ;

- scanner les images Docker si possible ;

- utiliser .env.example sans secrets ;

- vérifier .gitignore ;

- désactiver debug en production ;

- désactiver /demo/seed en production ;

- séparer les environnements dev, test et prod.

## 17 Headers de sécurité et configuration HTTP

### 17.1 Headers recommandés

- Content-Security-Policy ;

- Strict-Transport-Security en production HTTPS ;

- X-Content-Type-Options ;

- X-Frame-Options ou frame-ancestors via CSP ;

- Referrer-Policy ;

- Permissions-Policy ;

- Cache-Control adapté aux données privées.

### 17.2 NestJS

Utiliser Helmet ou configuration équivalente pour poser des headers de sécurité raisonnables.

### 17.3 CORS

Règles :

- autoriser uniquement les origines connues ;

- ne pas utiliser une wildcard avec credentials ;

- configurer séparément dev et production ;

- limiter les headers et méthodes si possible.

## 18 Journalisation et monitoring sécurité

### 18.1 Objectif

Les logs doivent permettre de détecter les problèmes sans exposer de données sensibles.

### 18.2 À logger

- erreurs techniques ;

- endpoint ;

- statut HTTP ;

- temps de réponse ;

- userId interne si nécessaire ;

- IP si utile à la sécurité ;

- événements de login échoués ;

- erreurs d'autorisation ;

- rate limits ;

- erreurs provider externe ;

- actions admin sensibles.

### 18.3 À ne pas logger

- mots de passe ;

- hash de mot de passe ;

- tokens JWT ;

- refresh tokens ;

- clés API ;

- secrets ;

- contenu complet des messages ;

- données personnelles inutiles.

### 18.4 Alertes utiles

- nombreux échecs login ;

- nombreux 403 ;

- nombreux 429 ;

- accès admin inhabituel ;

- erreur provider répétée ;

- tentative d'accès au chat par non-membre ;

- upload refusé répété.

## 19 Gestion des erreurs

### 19.1 Risques

- fuite de stack trace ;

- fuite d'informations internes ;

- messages d'erreur révélant une ressource ;

- différences de messages permettant d'énumérer des comptes ;

- erreurs non gérées qui cassent la démonstration.

### 19.2 Mesures

- filtre d'exception global NestJS ;

- messages standardisés ;

- pas de stack trace côté client ;

- messages login génériques ;

- codes d'erreur métier documentés ;

- journalisation technique côté serveur ;

- fallback pour APIs externes.

## 20 Administration et modération

### 20.1 Risques

- route admin accessible à un joueur ;

- action admin non tracée ;

- désactivation abusive ;

- suppression accidentelle ;

- accès aux données privées sans nécessité.

### 20.2 Mesures

- RolesGuard ADMIN ;

- authentification obligatoire ;

- journaliser actions sensibles ;

- confirmations côté front ;

- limiter les données affichées aux admins ;

- protéger Swagger et routes admin ;

- désactiver outils de debug en production.

## 21 Plan de tests sécurité MVP

### 21.1 Tests authentification

- login correct ;

- login incorrect ;

- rate limit login ;

- token absent ;

- token expiré ;

- route privée sans token ;

- logout nettoie l'état front.

### 21.2 Tests autorisation

- modifier son propre profil ;

- tentative de modifier un autre profil refusée ;

- accès chat par membre autorisé ;

- accès chat par non-membre refusé ;

- route admin refusée à un PLAYER ;

- suppression équipe refusée à un MEMBER.

### 21.3 Tests entrées utilisateur

- pseudo trop long refusé ;

- bio trop longue refusée ;

- message vide refusé ;

- message trop long refusé ;

- code invitation invalide refusé ;

- champs inattendus ignorés ou refusés.

### 21.4 Tests Socket.io

- connexion sans token refusée ;

- joinTeamRoom par non-membre refusé ;

- sendTeamMessage par non-membre refusé ;

- spam message limité ;

- broadcast uniquement à la bonne room.

### 21.5 Tests upload

- mauvais type refusé ;

- fichier trop lourd refusé ;

- fichier renommé ;

- aucun fichier exécutable accessible.

### 21.6 Tests PWA

- données privées non visibles après logout ;

- cache nettoyé si nécessaire ;

- page offline neutre ;

- routes privées protégées après refresh.

## 22 Matrice risques / protections

| Risque | Impact | Probabilité | Protection prioritaire |

|---|---|---|---|

| Accès au chat par non-membre | Élevé | Moyen | TeamMemberGuard + vérification Socket.io |

| Brute force login | Élevé | Moyen | Rate limiting + messages génériques |

| XSS dans chat ou bio | Élevé | Moyen | Texte brut + échappement + CSP |

| Injection SQL | Élevé | Moyen | ORM + requêtes paramétrées + DTO stricts |

| Token volé | Élevé | Moyen | durée courte + stockage prudent + HTTPS |

| Clé API exposée | Élevé | Moyen | .env + jamais côté front + rotation |

| Upload malveillant | Élevé | Faible/Moyen | types autorisés + taille + stockage sûr |

| API externe indisponible | Moyen | Élevé | fallback mock/cache + timeout |

| Swagger exposé | Moyen | Moyen | protection ou désactivation prod |

| Données privées en cache PWA | Élevé | Moyen | Network first + nettoyage logout |

| Recalcul leaderboard abusif | Moyen | Moyen | rôle admin/système + lock Redis |

| Redis exposé | Élevé | Faible/Moyen | réseau privé + auth + pas de secrets |

## 23 Priorisation MVP

P0 indispensable :

- AuthGuard JWT ;

- hash mot de passe ;

- validation DTO ;

- ResourceOwnerGuard ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- rate limit login ;

- rate limit stats sync ;

- rate limit chat ;

- messages de chat en texte brut ;

- secrets en .env ;

- CORS contrôlé ;

- logs sans secrets ;

- API externe côté back-end ;

- fallback mock ;

- protection PWA logout.

P1 important :

- Helmet / headers sécurité ;

- CSP ;

- refresh token sécurisé ;

- upload sécurisé ;

- audit logs admin ;

- locks Redis ;

- monitoring erreurs ;

- protection Swagger.

P2 évolution :

- chiffrement applicatif des messages ;

- rotation refresh token avancée ;

- détection d'anomalies ;

- scan dépendances CI ;

- WAF ou protection edge ;

- 2FA ;

- chiffrement de bout en bout.

## 24 Checklist sécurité MVP

- Les mots de passe sont hashés.

- Aucun secret n'est dans le front-end.

- Aucun secret n'est commité dans GitHub.

- Les routes privées exigent un JWT valide.

- Les routes admin exigent le rôle ADMIN.

- Les utilisateurs ne peuvent modifier que leurs ressources.

- Les membres seuls accèdent au chat d'équipe.

- Socket.io vérifie le token et les permissions.

- Les DTO sont validés strictement.

- Les messages de chat vides ou trop longs sont refusés.

- Le login est rate limité.

- La synchronisation des stats est rate limitée.

- Les invitations sont rate limitées.

- Les APIs externes sont appelées côté back-end.

- Les anciennes stats restent disponibles si une API externe échoue.

- Les uploads sont limités ou désactivés au MVP.

- Les données privées ne restent pas visibles après logout PWA.

- Les logs ne contiennent ni tokens, ni mots de passe, ni clés API.

- Les erreurs ne renvoient pas de stack trace au client.

- Swagger est protégé ou désactivé en production.

## 25 Critères d'acceptation

Le dispositif de protection contre les attaques est considéré satisfaisant pour le MVP si :

- un utilisateur non connecté ne peut pas accéder aux routes privées ;

- un utilisateur connecté ne peut pas accéder aux ressources d'un autre utilisateur ;

- un non-membre ne peut pas rejoindre le chat d'une équipe ;

- un membre ne peut pas effectuer une action réservée au capitaine ;

- une route admin refuse un joueur standard ;

- les entrées utilisateur sont validées ;

- le front n'expose aucune clé API ;

- les mots de passe ne sont pas stockés en clair ;

- les tokens expirés sont refusés ;

- les erreurs sont contrôlées ;

- les actions sensibles sont limitées ou journalisées ;

- les données privées ne sont pas cachées durablement par la PWA ;

- les APIs externes ont un fallback ;

- les logs restent exploitables sans exposer de données sensibles.

## 26 Conclusion

Track'N Share manipule des données utilisateur, des statistiques, des comptes liés, des équipes et des messages. La protection contre les attaques doit donc être intégrée dès le début du développement.

La priorité du MVP est de sécuriser les éléments les plus critiques : authentification, autorisation, validation des données, chat d'équipe, APIs externes, rate limiting, secrets et cache PWA.

Les protections avancées comme le chiffrement applicatif des messages, la rotation avancée des tokens, l'analyse d'anomalies, le scan de dépendances automatisé et le chiffrement de bout en bout peuvent être planifiées après stabilisation du socle principal.

Une sécurité correcte pour Track'N Share repose sur une règle simple : toutes les décisions sensibles doivent être vérifiées côté back-end, documentées, testées et surveillées.
