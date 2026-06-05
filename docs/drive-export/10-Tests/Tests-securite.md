# TESTS SÉCURITÉ

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit les tests de sécurité à réaliser pour le MVP Track'N Share.

Il permet de vérifier que les protections essentielles sont en place avant la soutenance : authentification JWT, permissions, rôles, accès aux ressources, validation des entrées, rate limiting, absence de secrets, logs propres, Socket.io sécurisé, PWA sans fuite de données et mode démo maîtrisé.

Ces tests ne remplacent pas un audit de sécurité complet, mais ils couvrent les risques les plus importants pour un projet MVP.

## 1 Vue d'ensemble

### 1.1 Objectifs des tests sécurité

Les tests sécurité doivent vérifier que :

- les routes privées ne sont pas accessibles sans authentification ;

- les tokens invalides ou expirés sont refusés ;

- un utilisateur ne peut pas accéder aux ressources d'un autre ;

- les rôles d'équipe sont respectés ;

- le chat est réservé aux membres ;

- les entrées utilisateur sont validées ;

- les réponses API ne contiennent pas de secrets ;

- les logs ne contiennent pas de données sensibles ;

- le front-end n'expose pas de clés privées ;

- le mode démo ne crée pas de faille évidente ;

- Docker et les variables d'environnement ne révèlent pas de secrets.

### 1.2 Périmètre MVP

Les tests sécurité MVP couvrent :

- authentification ;

- autorisation ;

- ownership ;

- rôles et permissions ;

- équipes ;

- chat Socket.io ;

- API REST ;

- validation DTO ;

- rate limiting ;

- logs ;

- secrets ;

- PWA ;

- Docker ;

- providers externes ;

- RGPD minimal.

### 1.3 Hors périmètre MVP

Ne sont pas obligatoires pour le MVP :

- pentest complet ;

- scan automatique avancé ;

- fuzzing massif ;

- test de charge sécurité ;

- audit cryptographique ;

- bug bounty ;

- WAF ;

- SOC ou monitoring avancé.

## 2 Priorités de test

### 2.1 P0 — Tests bloquants

Les tests P0 doivent obligatoirement passer avant soutenance.

Exemples :

- route privée sans token refusée ;

- token invalide refusé ;

- passwordHash absent des réponses ;

- chat inaccessible aux non-membres ;

- action capitaine refusée au membre simple ;

- aucun secret dans le front ;

- aucun secret dans Swagger ;

- aucune clé Steam/Epic exposée ;

- données privées nettoyées après logout.

### 2.2 P1 — Tests importants

Exemples :

- rate limiting login ;

- rate limiting chat ;

- XSS basique ;

- upload sécurisé si activé ;

- requestId dans les erreurs ;

- logs sans tokens ;

- PWA offline sans fuite de données.

### 2.3 P2 — Tests futurs

Exemples :

- scan dépendances CI ;

- tests E2E sécurité automatisés ;

- analyse statique avancée ;

- tests de charge ;

- refresh token rotation ;

- 2FA ;

- secrets manager.

## 3 Environnement de test sécurité

### 3.1 Configuration recommandée

Configuration MVP :

NODE_ENV=development

DEMO_MODE=true

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

SWAGGER_ENABLED=true

LOG_LEVEL=info

RATE_LIMIT_ENABLED=true

### 3.2 Données nécessaires

Prévoir :

- un compte utilisateur A ;

- un compte utilisateur B ;

- un compte capitaine d'équipe ;

- un compte membre simple ;

- un utilisateur non-membre ;

- une équipe avec chat ;

- une équipe différente ;

- des statistiques mockées ;

- des messages de chat ;

- une route privée à tester ;

- éventuellement un compte admin si routes admin développées.

### 3.3 Outils recommandés

Outils possibles :

- Swagger ;

- Postman ;

- Insomnia ;

- cURL ;

- console navigateur ;

- DevTools Network ;

- docker compose logs ;

- tests Jest/Supertest en évolution.

## 4 Tests authentification JWT

### 4.1 SEC-AUTH-001 — Route privée sans token

Priorité : P0

Objectif : vérifier qu'une route privée refuse un utilisateur non authentifié.

Endpoint exemple :

GET /api/users/me

Étapes :

1. Appeler l'endpoint sans header Authorization.

2. Observer la réponse.

Résultat attendu :

- statut 401 ;

- success false ;

- aucune donnée utilisateur ;

- message clair.

### 4.2 SEC-AUTH-002 — Route privée avec token invalide

Priorité : P0

Objectif : vérifier qu'un token invalide est refusé.

Étapes :

1. Appeler une route privée avec Authorization: Bearer fake-token.

2. Observer la réponse.

Résultat attendu :

- statut 401 ;

- code AUTH_TOKEN_INVALID ou équivalent ;

- aucune donnée privée.

### 4.3 SEC-AUTH-003 — Route privée avec token expiré

Priorité : P0

Objectif : vérifier qu'un token expiré ne donne pas accès à l'API.

Étapes :

1. Utiliser un token expiré ou simuler son expiration.

2. Appeler une route privée.

Résultat attendu :

- statut 401 ;

- message session expirée ou token expiré ;

- le front redirige vers login.

### 4.4 SEC-AUTH-004 — Token JWT sans données sensibles

Priorité : P0

Objectif : vérifier que le JWT ne contient pas de données inutiles ou sensibles.

À vérifier dans le payload :

- sub ;

- role éventuellement ;

- iat/exp.

Ne doit pas contenir :

- password ;

- passwordHash ;

- JWT_SECRET ;

- clé API ;

- profil complet ;

- données privées inutiles.

### 4.5 SEC-AUTH-005 — Déconnexion nettoie les données front

Priorité : P0

Objectif : vérifier que le logout supprime les données privées côté client.

Étapes :

1. Se connecter.

2. Accéder au dashboard.

3. Se déconnecter.

4. Cliquer sur retour navigateur.

Résultat attendu :

- dashboard inaccessible ;

- données privées non visibles ;

- token supprimé ou session invalidée selon stratégie.

## 5 Tests mots de passe

### 5.1 SEC-PASS-001 — Mot de passe non retourné

Priorité : P0

Objectif : vérifier que les réponses API ne retournent jamais le mot de passe.

Endpoints à tester :

- /api/auth/register ;

- /api/auth/login ;

- /api/users/me.

Résultat attendu :

- aucun champ password ;

- aucun champ passwordHash.

### 5.2 SEC-PASS-002 — PasswordHash absent

Priorité : P0

Objectif : vérifier que le hash du mot de passe n'est jamais exposé.

Résultat attendu :

- passwordHash absent des réponses ;

- passwordHash absent du front ;

- passwordHash absent de Swagger examples.

### 5.3 SEC-PASS-003 — Erreur login générique

Priorité : P0

Objectif : éviter l'énumération de comptes.

Étapes :

1. Login avec email inexistant.

2. Login avec email existant mais mauvais mot de passe.

Résultat attendu :

- message générique dans les deux cas ;

- pas d'indication explicite sur l'existence du compte.

## 6 Tests ownership utilisateur

### 6.1 SEC-OWN-001 — Modifier son propre profil

Priorité : P0

Objectif : vérifier qu'un utilisateur peut modifier ses données autorisées.

Résultat attendu :

- utilisateur A peut modifier son profil ;

- validation appliquée ;

- champs sensibles non modifiables.

### 6.2 SEC-OWN-002 — Modifier le profil d'un autre utilisateur

Priorité : P0

Objectif : vérifier qu'un utilisateur ne peut pas modifier un autre profil.

Étapes :

1. Se connecter comme utilisateur A.

2. Tenter de modifier le profil de l'utilisateur B via endpoint ou URL.

Résultat attendu :

- statut 403 ou 404 selon stratégie ;

- aucune modification sur B ;

- événement éventuellement loggé.

### 6.3 SEC-OWN-003 — Consulter des stats d'un autre utilisateur privé

Priorité : P0 si stats privées

Objectif : vérifier que les statistiques privées ne sont pas exposées.

Résultat attendu :

- accès refusé si ressource privée ;

- données publiques limitées si profil public.

## 7 Tests rôles et permissions d'équipe

### 7.1 SEC-TEAM-001 — Capitaine autorisé

Priorité : P0

Objectif : vérifier qu'un capitaine peut effectuer les actions réservées.

Actions possibles :

- régénérer un code invitation ;

- supprimer ou modifier l'équipe ;

- exclure un membre si fonctionnalité prévue.

Résultat attendu :

- action autorisée au capitaine ;

- action loggée si sensible.

### 7.2 SEC-TEAM-002 — Membre simple refusé sur action capitaine

Priorité : P0

Objectif : vérifier qu'un membre simple ne peut pas faire une action capitaine.

Résultat attendu :

- statut 403 ;

- code TEAM_ROLE_REQUIRED ou TEAM_CAPTAIN_REQUIRED ;

- aucune modification effectuée.

### 7.3 SEC-TEAM-003 — Non-membre refusé sur page équipe privée

Priorité : P0

Objectif : vérifier qu'un utilisateur extérieur ne voit pas les données privées d'une équipe.

Résultat attendu :

- accès refusé ;

- aucune donnée de chat ;

- aucune donnée privée de membres.

### 7.4 SEC-TEAM-004 — Rejoindre une équipe avec code invalide

Priorité : P0

Objectif : vérifier que les codes faux ne permettent pas d'entrer.

Résultat attendu :

- statut 400 ou 404 ;

- utilisateur non ajouté ;

- tentative éventuellement rate limitée.

## 8 Tests chat et Socket.io

### 8.1 SEC-CHAT-001 — Lire messages comme membre

Priorité : P0

Objectif : vérifier qu'un membre peut lire les messages de son équipe.

Résultat attendu :

- accès autorisé ;

- messages de la bonne équipe uniquement.

### 8.2 SEC-CHAT-002 — Lire messages comme non-membre

Priorité : P0

Objectif : vérifier que le chat est privé.

Résultat attendu :

- statut 403 ;

- aucun message retourné.

### 8.3 SEC-CHAT-003 — Rejoindre room Socket.io comme non-membre

Priorité : P0

Objectif : vérifier qu'un non-membre ne peut pas rejoindre team:{teamId}.

Résultat attendu :

- join refusé ;

- aucun événement de la room reçu ;

- log de refus possible sans token.

### 8.4 SEC-CHAT-004 — Envoyer message comme non-membre

Priorité : P0

Objectif : vérifier qu'un utilisateur extérieur ne peut pas envoyer un message dans une équipe.

Résultat attendu :

- message refusé ;

- aucun message sauvegardé ;

- aucun broadcast.

### 8.5 SEC-CHAT-005 — Payload avec userId falsifié

Priorité : P0

Objectif : vérifier que le serveur n'utilise pas le userId fourni par le client.

Payload exemple :

{

"teamId": "team_123",

"userId": "autre_user",

"content": "Message frauduleux"

}

Résultat attendu :

- senderId déterminé depuis le token ;

- userId client ignoré ou refusé ;

- aucune usurpation possible.

### 8.6 SEC-CHAT-006 — Message trop long

Priorité : P1

Objectif : vérifier la limite de taille des messages.

Résultat attendu :

- message refusé ;

- statut 400 ou erreur socket contrôlée ;

- aucun enregistrement.

### 8.7 SEC-CHAT-007 — Spam chat

Priorité : P1

Objectif : vérifier le rate limiting du chat.

Résultat attendu :

- après dépassement, messages refusés ;

- statut ou erreur RATE_LIMITED ;

- aucun crash.

## 9 Tests validation DTO

### 9.1 SEC-DTO-001 — Payload avec champs inconnus

Priorité : P1

Objectif : vérifier que les champs non prévus ne sont pas enregistrés.

Exemple :

{

"username": "Player",

"role": "ADMIN"

}

Résultat attendu :

- champ role ignoré ou requête refusée ;

- utilisateur ne devient pas admin.

### 9.2 SEC-DTO-002 — Mauvais types de données

Priorité : P0

Objectif : vérifier que l'API refuse les types invalides.

Exemples :

- username numérique ;

- teamId tableau ;

- content objet ;

- limit texte.

Résultat attendu :

- statut 400 ;

- pas de crash ;

- message contrôlé.

### 9.3 SEC-DTO-003 — Injection dans champs texte

Priorité : P1

Objectif : vérifier que les champs texte dangereux sont traités correctement.

Exemples :

- pseudo avec balise HTML ;

- bio avec script ;

- message chat avec HTML.

Résultat attendu :

- contenu refusé ou échappé ;

- aucun script exécuté côté front.

## 10 Tests XSS

### 10.1 SEC-XSS-001 — XSS dans bio profil

Priorité : P1

Objectif : vérifier que la bio n'exécute pas de HTML/JS.

Payload exemple :

<script>alert('xss')</script>

Résultat attendu :

- contenu échappé ou refusé ;

- aucun script exécuté.

### 10.2 SEC-XSS-002 — XSS dans message chat

Priorité : P1

Objectif : vérifier que le chat affiche le contenu comme texte.

Résultat attendu :

- le script ne s'exécute pas ;

- le message est refusé ou affiché en texte neutre.

### 10.3 SEC-XSS-003 — XSS dans nom d'équipe

Priorité : P1

Objectif : vérifier que le nom d'équipe est sécurisé.

Résultat attendu :

- HTML non exécuté ;

- affichage propre.

## 11 Tests rate limiting

### 11.1 SEC-RATE-001 — Brute force login

Priorité : P1

Objectif : vérifier que trop de tentatives login sont limitées.

Étapes :

1. Envoyer plusieurs login invalides rapidement.

2. Observer la réponse après dépassement.

Résultat attendu :

- statut 429 ;

- code RATE_LIMITED ;

- aucune fuite d'information.

### 11.2 SEC-RATE-002 — Tentatives code invitation

Priorité : P1

Objectif : limiter le bruteforce de codes d'équipe.

Résultat attendu :

- trop de codes invalides → 429 ou blocage temporaire ;

- utilisateur non ajouté.

### 11.3 SEC-RATE-003 — Synchronisation stats répétée

Priorité : P1

Objectif : éviter le spam de synchronisation.

Résultat attendu :

- sync limitée ;

- provider protégé ;

- données existantes conservées.

## 12 Tests secrets et variables d'environnement

### 12.1 SEC-SECRET-001 — Aucun .env dans le dépôt

Priorité : P0

Objectif : vérifier qu'aucun fichier .env réel n'est commité.

Résultat attendu :

- .env absent du dépôt ;

- .env.example présent ;

- aucune vraie valeur dans .env.example.

### 12.2 SEC-SECRET-002 — Aucun secret côté front

Priorité : P0

Objectif : vérifier que le build front ne contient aucun secret.

À chercher :

- JWT_SECRET ;

- DATABASE_URL ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- REDIS_URL ;

- SMTP_PASSWORD.

Résultat attendu :

- aucun secret dans le bundle ;

- uniquement des variables VITE_* publiques non sensibles.

### 12.3 SEC-SECRET-003 — Swagger sans secrets

Priorité : P0

Objectif : vérifier que Swagger ne contient aucun secret réel.

Résultat attendu :

- exemples fictifs ;

- pas de token réel ;

- pas de clé API ;

- pas de mot de passe réel.

### 12.4 SEC-SECRET-004 — Logs sans secrets

Priorité : P0

Objectif : vérifier que les logs ne contiennent pas de secrets.

À vérifier :

- docker compose logs backend ;

- logs auth ;

- logs providers ;

- logs erreurs.

Résultat attendu :

- aucun JWT ;

- aucun password ;

- aucune clé API ;

- aucun header Authorization complet.

## 13 Tests sécurité des réponses API

### 13.1 SEC-RESP-001 — Pas de stack trace client

Priorité : P0

Objectif : vérifier que les erreurs ne révèlent pas les détails internes.

Étapes :

1. Provoquer une erreur API.

2. Observer la réponse.

Résultat attendu :

- pas de stack trace ;

- pas de chemin serveur ;

- pas de requête SQL ;

- message contrôlé.

### 13.2 SEC-RESP-002 — Pas de données sensibles utilisateur

Priorité : P0

Objectif : vérifier que les réponses utilisateur sont filtrées.

Résultat attendu :

- email non public si profil public ;

- passwordHash absent ;

- token absent sauf endpoint login ;

- champs internes absents.

### 13.3 SEC-RESP-003 — Ressource introuvable sans fuite

Priorité : P1

Objectif : vérifier qu'une ressource inaccessible ne révèle pas trop d'information.

Résultat attendu :

- 404 ou 403 selon stratégie ;

- pas d'information excessive sur l'existence de données privées.

## 14 Tests providers externes

### 14.1 SEC-PROV-001 — Steam désactivé sans clé

Priorité : P0 pour MVP

Objectif : vérifier que le projet fonctionne sans clé Steam.

Résultat attendu :

- SteamProvider désactivé ;

- MockProvider utilisé ;

- aucune erreur bloquante.

### 14.2 SEC-PROV-002 — Clé Steam jamais exposée

Priorité : P0 si clé utilisée

Objectif : vérifier que la clé reste côté back-end.

Résultat attendu :

- clé absente du front ;

- clé absente Swagger ;

- clé absente logs.

### 14.3 SEC-PROV-003 — Epic secret jamais exposé

Priorité : P0 si Epic utilisé

Résultat attendu :

- EPIC_CLIENT_SECRET côté back uniquement ;

- jamais retourné ;

- jamais loggé.

### 14.4 SEC-PROV-004 — Provider timeout contrôlé

Priorité : P1

Objectif : vérifier qu'un provider externe lent ne bloque pas l'application.

Résultat attendu :

- timeout ;

- fallback cache/mock ;

- erreur contrôlée ;

- aucune donnée supprimée.

## 15 Tests Docker et déploiement local

### 15.1 SEC-DOCKER-001 — Dockerfile sans secret

Priorité : P0

Objectif : vérifier qu'aucun secret n'est écrit dans les Dockerfiles.

Résultat attendu :

- pas de JWT_SECRET ;

- pas de DATABASE_URL réelle ;

- pas de clé API ;

- pas de mot de passe.

### 15.2 SEC-DOCKER-002 — docker-compose sans secret réel

Priorité : P0

Objectif : vérifier que docker-compose n'expose pas de secrets réels.

Résultat attendu :

- variables via .env ;

- pas de vraie clé ;

- pas de secret en dur.

### 15.3 SEC-DOCKER-003 — PostgreSQL/Redis non publics en production

Priorité : P1

Objectif : vérifier la règle de sécurité production future.

Résultat attendu :

- en production, DB et Redis non exposés publiquement ;

- accès uniquement via réseau interne.

## 16 Tests PWA et stockage client

### 16.1 SEC-PWA-001 — Données privées après logout

Priorité : P0

Objectif : vérifier que les données privées ne restent pas affichées après déconnexion.

Résultat attendu :

- store nettoyé ;

- pages privées bloquées ;

- retour navigateur sécurisé.

### 16.2 SEC-PWA-002 — Token dans localStorage/sessionStorage

Priorité : P1

Objectif : vérifier où est stocké le token et si cela correspond au choix de sécurité.

Résultat attendu :

- stockage conforme à la stratégie ;

- pas de token loggé ;

- expiration gérée.

### 16.3 SEC-PWA-003 — Cache PWA sans données sensibles

Priorité : P1

Objectif : vérifier que le service worker ne cache pas de réponses privées dangereuses.

Résultat attendu :

- assets statiques cacheables ;

- données privées non persistées de façon risquée ;

- page offline neutre.

## 17 Tests RGPD minimum

### 17.1 SEC-RGPD-001 — Minimisation des données

Priorité : P1

Objectif : vérifier que l'inscription ne demande pas de données inutiles.

Résultat attendu :

- email, pseudo, mot de passe suffisent ;

- pas de données sensibles inutiles.

### 17.2 SEC-RGPD-002 — Suppression ou anonymisation compte

Priorité : P1 si fonctionnalité développée

Objectif : vérifier qu'un utilisateur peut supprimer ou demander suppression de son compte.

Résultat attendu :

- compte supprimé ou anonymisé selon stratégie ;

- données privées traitées ;

- archives préservées uniquement si anonymisées.

### 17.3 SEC-RGPD-003 — Données de démo fictives

Priorité : P0

Objectif : vérifier que les données seedées ne sont pas réelles.

Résultat attendu :

- emails fictifs ;

- pseudos fictifs ;

- aucune vraie identité ;

- aucune vraie clé externe.

## 18 Tests admin

### 18.1 SEC-ADMIN-001 — Route admin refusée à PLAYER

Priorité : P0 si routes admin développées

Objectif : vérifier qu'un joueur standard ne peut pas accéder aux routes admin.

Résultat attendu :

- statut 403 ;

- code ADMIN_REQUIRED ;

- aucune donnée admin retournée.

### 18.2 SEC-ADMIN-002 — Action admin loggée

Priorité : P1

Objectif : vérifier que les actions sensibles sont tracées.

Résultat attendu :

- action enregistrée dans les logs ;

- aucun secret dans le log ;

- userId admin présent si utile.

## 19 Tests mode démo sécurité

### 19.1 SEC-DEMO-001 — Mode démo sans routes dangereuses publiques

Priorité : P0

Objectif : vérifier que le mode démo ne rend pas publiques des routes sensibles.

À vérifier :

- seed demo non accessible publiquement ;

- reset database non accessible publiquement ;

- routes admin protégées.

Résultat attendu :

- aucune route destructive accessible sans autorisation.

### 19.2 SEC-DEMO-002 — Compte démo sans rôle admin

Priorité : P0

Objectif : vérifier que le compte démo public n'a pas de privilèges dangereux.

Résultat attendu :

- rôle PLAYER ou équivalent ;

- pas ADMIN ;

- pas accès aux routes sensibles.

### 19.3 SEC-DEMO-003 — Données démo non sensibles

Priorité : P0

Objectif : vérifier que les données de démonstration ne contiennent rien de réel.

Résultat attendu :

- données fictives ;

- pas de vrais emails ;

- pas de vrais tokens ;

- pas de données personnelles réelles.

## 20 Matrice synthétique des tests sécurité

| Domaine | Tests P0 | Tests P1 | Tests P2 |

|---|---|---|---|

| Auth | 401, token invalide, token expiré | refresh token | 2FA |

| Password | pas de password/passwordHash | politique avancée | reset password sécurisé |

| Ownership | profil/stats utilisateur | ressources privées avancées | audit complet |

| Teams | capitaine/membre/non-membre | rate limit invitations | modération |

| Chat | non-membre refusé, userId token | XSS, spam | présence sécurisée |

| DTO | types invalides | champs inconnus | fuzzing |

| Secrets | pas de .env, pas de secret front/logs | scan CI | secrets manager |

| Providers | mock sans clé, clé non exposée | timeout/fallback | intégration réelle complète |

| Docker | pas de secret en dur | ports prod | scan image |

| PWA | logout sécurisé | cache/token | audit storage |

| RGPD | données démo fictives | suppression compte | export complet |

## 21 Checklist sécurité avant soutenance

- Route privée sans token refusée.

- Token invalide refusé.

- Token expiré refusé.

- Login invalide générique.

- Aucun passwordHash dans les réponses.

- Utilisateur A ne modifie pas utilisateur B.

- Non-membre ne lit pas chat équipe.

- Non-membre ne rejoint pas room Socket.io.

- Membre simple ne fait pas action capitaine.

- Message vide ou trop long refusé.

- Aucun secret dans front.

- Aucun secret dans Swagger.

- Aucun secret dans Dockerfile.

- Aucun .env dans Git.

- Logs sans JWT ni clés API.

- MockProvider fonctionne sans Steam/Epic.

- Compte démo non admin.

- Données démo fictives.

- Logout nettoie les données privées.

## 22 Gestion des anomalies sécurité

### 22.1 Critique

Exemples :

- route privée accessible sans token ;

- non-membre peut lire le chat ;

- passwordHash exposé ;

- clé API exposée ;

- compte démo admin ;

- reset database accessible publiquement.

Action : correction obligatoire avant soutenance.

### 22.2 Majeure

Exemples :

- rate limiting absent sur login ;

- message d'erreur trop détaillé ;

- logs trop verbeux ;

- XSS possible sur champ secondaire.

Action : correction fortement recommandée.

### 22.3 Mineure

Exemples :

- message d'erreur perfectible ;

- absence de requestId ;

- documentation Swagger incomplète.

Action : correction si temps disponible.

## 23 Critères d'acceptation sécurité MVP

La sécurité MVP est considérée acceptable si :

- les routes privées sont protégées ;

- les tokens invalides sont refusés ;

- les permissions utilisateur sont respectées ;

- les permissions d'équipe sont respectées ;

- le chat est privé ;

- les DTO valident les entrées ;

- les secrets ne sont pas exposés ;

- les logs ne contiennent pas de tokens ;

- le mode démo ne donne pas de privilèges dangereux ;

- les données démo sont fictives ;

- les erreurs ne révèlent pas de détails techniques ;

- la PWA ne conserve pas de données privées visibles après logout.

## 24 Conclusion

Les tests de sécurité de Track'N Share doivent garantir que le MVP reste fiable et présentable.

Les priorités sont claires : authentification JWT, permissions back-end, protection du chat, absence de secrets, validation des entrées, logs propres et mode démo sécurisé.

Ces tests doivent être réalisés avant la soutenance et à chaque évolution importante du projet. Les tests P0 sont bloquants : s'ils échouent, la fonctionnalité concernée ne doit pas être considérée prête.
