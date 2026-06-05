# POLITIQUE DE SÉCURITÉ

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit la politique de sécurité globale du projet Track'N Share.

Il rassemble les règles, principes, responsabilités et mesures techniques à respecter pour protéger l'application, les utilisateurs, les données personnelles, les statistiques, les équipes, le chat, les APIs externes, les secrets et l'infrastructure.

Cette politique sert de référence pour le développement, la soutenance, les tests et une éventuelle mise en production future.

Elle complète les documents suivants :

- Politique-confidentialite ;

- Conformite-RGPD ;

- Protection-attaques ;

- Gestion-secrets-env ;

- Authentification-JWT ;

- Roles-permissions ;

- Gestion-rate-limiting ;

- Plan-secours-APIs.

## 1 Résumé exécutif

Track'N Share est une application web progressive permettant à des joueurs de suivre leurs statistiques, consulter des leaderboards, rejoindre des équipes et échanger dans un chat d'équipe.

La sécurité du projet repose sur plusieurs axes :

- authentification robuste ;

- autorisation stricte côté back-end ;

- protection des données personnelles ;

- sécurisation des messages d'équipe ;

- validation des entrées ;

- limitation des abus ;

- gestion propre des secrets ;

- sécurisation des APIs externes ;

- séparation des environnements ;

- logs utiles mais non sensibles ;

- mode démo sûr ;

- documentation et tests.

Pour le MVP, l'objectif est d'obtenir une sécurité raisonnable, cohérente et démontrable, sans surcomplexifier le développement.

## 2 Périmètre de la politique

### 2.1 Composants concernés

Cette politique couvre :

- front-end React / TypeScript ;

- PWA et service worker ;

- back-end NestJS ;

- API REST ;

- Socket.io ;

- PostgreSQL ;

- Redis ;

- authentification JWT ;

- rôles et permissions ;

- APIs externes Steam / Epic / EOS ;

- MockProvider ;

- Docker / Docker Compose ;

- variables d'environnement ;

- GitHub ;

- Swagger ;

- routes de démonstration ;

- logs et monitoring.

### 2.2 Données concernées

Données protégées :

- email ;

- mot de passe hashé ;

- identifiants utilisateurs ;

- profils ;

- statistiques ;

- comptes de jeu liés ;

- équipes ;

- messages de chat ;

- notifications ;

- tokens JWT ;

- refresh tokens si activés ;

- clés API ;

- logs techniques ;

- données de sessions ;

- données archivées de saisons.

### 2.3 Environnements concernés

- développement local ;

- test ;

- soutenance / démo ;

- pré-production éventuelle ;

- production future.

## 3 Objectifs de sécurité

### 3.1 Confidentialité

Les données doivent être accessibles uniquement aux personnes ou systèmes autorisés.

Exemples :

- un email n'est pas affiché publiquement ;

- un chat d'équipe est visible uniquement par les membres ;

- un token JWT n'est jamais affiché ;

- une clé API Steam n'est jamais envoyée au front-end.

### 3.2 Intégrité

Les données ne doivent pas être modifiées sans autorisation.

Exemples :

- un joueur ne peut pas modifier son score manuellement ;

- un membre ne peut pas supprimer une équipe ;

- un non-membre ne peut pas écrire dans un chat d'équipe ;

- une saison archivée ne doit pas être modifiée par une synchronisation future.

### 3.3 Disponibilité

L'application doit rester utilisable malgré certains incidents.

Exemples :

- si Steam échoue, les anciennes données restent visibles ;

- si Epic n'est pas configuré, le MockProvider reste disponible ;

- si Socket.io échoue, un fallback REST peut exister ;

- si une API externe est lente, un timeout évite de bloquer l'application.

### 3.4 Traçabilité

Les actions sensibles doivent pouvoir être suivies sans exposer de données sensibles.

Exemples :

- échecs de connexion ;

- erreurs 403 ;

- rate limits ;

- actions admin ;

- archivage manuel ;

- suppression d'équipe ;

- erreurs de synchronisation externe.

## 4 Rôles et responsabilités sécurité

### 4.1 Équipe projet

L'équipe projet est responsable de :

- documenter les choix de sécurité ;

- appliquer les bonnes pratiques ;

- ne pas exposer les secrets ;

- tester les routes sensibles ;

- maintenir le mode démo sûr ;

- vérifier les permissions ;

- relire les documents avant soutenance.

### 4.2 Développeur back-end

Responsabilités :

- sécuriser l'API ;

- implémenter JWT ;

- hasher les mots de passe ;

- valider les DTO ;

- gérer les permissions ;

- protéger Socket.io ;

- sécuriser les providers externes ;

- limiter les abus ;

- ne jamais logger les secrets.

### 4.3 Développeur front-end

Responsabilités :

- ne pas exposer de secrets ;

- nettoyer l'état à la déconnexion ;

- gérer les erreurs 401 / 403 / 429 ;

- éviter les injections HTML ;

- afficher correctement les états de confidentialité ;

- ne pas mettre en cache des données privées sans contrôle ;

- ne jamais considérer l'affichage conditionnel comme une vraie sécurité.

### 4.4 Administrateur / mainteneur

Responsabilités :

- gérer les variables d'environnement ;

- protéger les accès GitHub ;

- configurer Docker / hébergement ;

- désactiver les routes de seed en production ;

- surveiller les erreurs critiques ;

- faire tourner les secrets en cas de fuite.

## 5 Principes de sécurité applicables

### 5.1 Moindre privilège

Chaque utilisateur, service ou composant doit avoir uniquement les droits nécessaires.

Applications :

- rôle PLAYER par défaut ;

- rôle ADMIN réservé ;

- permissions d'équipe limitées ;

- utilisateur PostgreSQL non superadmin en production ;

- Redis non accessible publiquement ;

- APIs externes appelées uniquement côté back-end.

### 5.2 Défense en profondeur

Plusieurs protections doivent se compléter.

Exemple pour le chat :

- bouton caché côté front pour non-membre ;

- route REST protégée ;

- vérification TeamMemberGuard ;

- Socket.io handshake authentifié ;

- vérification avant joinTeamRoom ;

- room dédiée par équipe.

### 5.3 Sécurité par défaut

La configuration par défaut doit être sûre.

Exemples :

- Steam/Epic désactivés si clés absentes ;

- mode mock par défaut en développement ;

- email non public ;

- chat privé ;

- Swagger protégé ou désactivable en production ;

- routes de démo désactivables.

### 5.4 Ne jamais faire confiance au client

Le front-end peut être modifié par un utilisateur.

Le back-end doit donc revérifier :

- identité ;

- rôle ;

- propriété ;

- appartenance à l'équipe ;

- validité du payload ;

- limites d'usage.

## 6 Politique d'authentification

### 6.1 Comptes utilisateurs

Règles :

- inscription avec email, pseudo et mot de passe ;

- email unique ;

- pseudo unique si règle retenue ;

- mot de passe jamais stocké en clair ;

- mot de passe hashé avec Argon2 ou bcrypt ;

- réponse API sans passwordHash ;

- message de login générique en cas d'échec.

### 6.2 JWT

Règles :

- access token signé ;

- secret JWT fort ;

- durée de vie limitée ;

- payload minimal ;

- token envoyé via Authorization Bearer ou stratégie cookie sécurisée ;

- token expiré refusé ;

- déconnexion nettoyant l'état local.

### 6.3 Refresh token

Priorité : P1.

Si activé :

- refresh token plus long que l'access token ;

- stockage sécurisé ;

- idéalement cookie HttpOnly ;

- hash en base si stocké ;

- révocation au logout ;

- rotation en évolution.

### 6.4 Mot de passe oublié

Priorité : P1.

Si activé :

- token de reset court ;

- message générique ;

- pas de révélation de l'existence du compte ;

- rate limiting ;

- invalidation après usage.

## 7 Politique d'autorisation

### 7.1 Rôles applicatifs

Rôles :

- PLAYER ;

- MODERATOR ;

- ADMIN ;

- SYSTEM pour les tâches internes.

Règles :

- un utilisateur standard est PLAYER ;

- une route admin exige ADMIN ;

- le rôle SYSTEM n'est pas un compte utilisateur classique ;

- les actions sensibles doivent vérifier le rôle en base si nécessaire.

### 7.2 Rôles d'équipe

Rôles :

- CAPTAIN ;

- CO_CAPTAIN ;

- MEMBER ;

- INVITED.

Règles :

- le créateur d'équipe devient CAPTAIN ;

- un membre accède au chat ;

- un co-capitaine peut avoir certains droits de gestion ;

- seul le capitaine peut supprimer l'équipe ;

- un non-membre ne voit pas les zones privées.

### 7.3 Guards recommandés

- JwtAuthGuard ;

- RolesGuard ;

- ResourceOwnerGuard ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- AdminGuard si besoin.

## 8 Politique de protection des données

### 8.1 Données personnelles

Track'N Share doit limiter la collecte aux données utiles :

- compte ;

- profil ;

- statistiques ;

- équipe ;

- chat ;

- logs techniques ;

- données de comptes externes si utilisateur choisit de les lier.

### 8.2 Données interdites ou non nécessaires

Ne pas collecter :

- données bancaires ;

- données de santé ;

- pièces d'identité ;

- adresse postale ;

- téléphone si non nécessaire ;

- données sensibles au sens RGPD ;

- tokens externes non protégés.

### 8.3 Données publiques

Peuvent être publiques selon paramètres :

- pseudo ;

- avatar ;

- score ;

- rang ;

- statistiques publiques ;

- équipe publique.

Ne doivent jamais être publiques :

- email ;

- passwordHash ;

- tokens ;

- secrets ;

- messages privés ou d'équipe ;

- logs techniques.

### 8.4 Suppression et anonymisation

Un compte supprimé doit être supprimé ou anonymisé.

Recommandation :

- remplacer l'identité par "Utilisateur supprimé" dans les archives ;

- supprimer l'email ;

- délier les comptes externes ;

- anonymiser les messages si nécessaire ;

- conserver uniquement les statistiques agrégées utiles à l'historique.

## 9 Politique API REST

### 9.1 Validation des entrées

Toutes les entrées doivent être validées.

Règles :

- DTO NestJS ;

- class-validator ;

- whitelisting des propriétés ;

- limitation des tailles ;

- pagination sur listes ;

- champs de tri autorisés explicitement ;

- refus des types invalides ;

- messages d'erreur standardisés.

### 9.2 Erreurs API

Les erreurs doivent être claires mais ne pas révéler d'informations sensibles.

Règles :

- pas de stack trace côté client ;

- pas de détail interne de base de données ;

- message login générique ;

- format standard des erreurs ;

- logs techniques côté serveur uniquement.

### 9.3 Routes sensibles

Routes à protéger fortement :

- /auth/login ;

- /auth/register ;

- /stats/sync ;

- /teams/join ;

- /teams/:id/messages ;

- /team-invitations ;

- /admin ;

- /demo/seed ;

- uploads ;

- endpoints de suppression.

## 10 Politique Socket.io

### 10.1 Connexion

Règles :

- connexion socket authentifiée ;

- token vérifié au handshake ;

- userId récupéré depuis le token ;

- socket.data.user rempli côté serveur ;

- socket sans token refusé.

### 10.2 Rooms

Règles :

- room d'équipe : team:{teamId} ;

- room utilisateur : user:{userId} si notifications ;

- accès vérifié avant join ;

- aucune room privée accessible à un non-membre.

### 10.3 Messages

Règles :

- senderId jamais pris depuis le client ;

- contenu non vide ;

- longueur maximale ;

- rate limiting ;

- sauvegarde en base avant broadcast ;

- diffusion uniquement aux membres de la room.

## 11 Politique de rate limiting

### 11.1 Objectifs

Le rate limiting protège :

- authentification ;

- synchronisation stats ;

- chat ;

- invitations ;

- recherche ;

- APIs externes ;

- routes admin.

### 11.2 Limites MVP recommandées

- login : 5 tentatives par minute par IP ;

- register : 3 comptes par heure par IP ;

- stats sync : 1 synchronisation toutes les 2 à 5 minutes par utilisateur et jeu ;

- chat : 20 messages par minute par utilisateur et équipe ;

- join team : 10 tentatives par heure ;

- invite regen : 5 par jour par équipe ;

- admin recalcul : très limité et journalisé.

### 11.3 Redis

Redis est recommandé pour :

- compteurs de rate limiting ;

- locks ;

- cache ;

- sessions en évolution ;

- Socket.io adapter en scaling.

## 12 Politique de gestion des secrets

### 12.1 Règles obligatoires

- aucun secret dans GitHub ;

- aucun secret dans le front-end ;

- aucun secret dans Swagger ;

- aucun secret dans les logs ;

- .env local non commité ;

- .env.example sans vraie valeur ;

- variables différentes par environnement ;

- rotation en cas de fuite.

### 12.2 Secrets critiques

- JWT_SECRET ;

- DATABASE_URL ;

- REDIS_URL ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- SMTP_PASSWORD ;

- ENCRYPTION_KEY ;

- DEPLOY_TOKEN.

### 12.3 Variables front publiques

Avec Vite, seules les variables VITE_ sont exposées au front.

Règle :

Toute variable VITE_ doit être considérée comme publique.

## 13 Politique PWA et cache

### 13.1 Risques

La PWA peut conserver des données localement.

Risques :

- données privées visibles après logout ;

- cache de réponses privées ;

- token stocké trop longtemps ;

- page offline affichant des données sensibles.

### 13.2 Règles

- ne pas cacher les réponses privées sans contrôle ;

- stratégie Network First pour données utilisateur ;

- nettoyage du store au logout ;

- nettoyage du cache sensible si nécessaire ;

- pas de refresh token dans localStorage ;

- page offline neutre.

## 14 Politique d'uploads

### 14.1 Périmètre

Uploads possibles :

- avatar utilisateur ;

- avatar équipe ;

- bannière profil ou équipe en évolution.

### 14.2 Règles

- autoriser uniquement PNG, JPG, WebP ;

- taille maximale ;

- vérification MIME ;

- renommage du fichier ;

- stockage non exécutable ;

- pas de chemin serveur exposé ;

- avatar par défaut ;

- suppression possible lors de la suppression du compte.

### 14.3 Recommandation MVP

Si l'upload sécurisé n'est pas prêt, utiliser :

- avatars par défaut ;

- avatars générés ;

- URLs contrôlées ;

- pas d'upload libre.

## 15 Politique d'intégrations externes

### 15.1 Principes

Les APIs externes ne doivent pas compromettre la stabilité ni la sécurité de Track'N Share.

Règles :

- appels côté back-end uniquement ;

- clés en .env ;

- timeout court ;

- retry limité ;

- validation des réponses ;

- mapping explicite ;

- fallback mock ou cache ;

- aucune dépendance obligatoire pour la soutenance.

### 15.2 Steam

- clé API côté serveur ;

- GetPlayerSummaries possible ;

- stats dépendantes du jeu ;

- profils privés gérés ;

- anciennes données conservées en cas d'échec.

### 15.3 Epic / EOS

- intégration future ;

- configuration développeur nécessaire ;

- pas d'API universelle de stats ;

- provider désactivé si configuration incomplète.

### 15.4 MockProvider

- provider obligatoire pour le MVP ;

- données fictives cohérentes ;

- mode soutenance sécurisé ;

- fallback en cas d'API réelle indisponible.

## 16 Politique base de données

### 16.1 PostgreSQL

Règles :

- accès uniquement depuis le back-end ;

- credentials en variables d'environnement ;

- migrations contrôlées ;

- utilisateur avec privilèges minimaux en production ;

- backups sécurisés ;

- pas de données de production dans les environnements de test sans anonymisation.

### 16.2 Données archivées

Les saisons archivées doivent être figées.

Règles :

- snapshots non modifiés par les futures syncs ;

- données personnelles minimisées ;

- anonymisation si utilisateur supprimé ;

- cohérence historique préservée.

## 17 Politique Redis

Règles :

- Redis non exposé publiquement ;

- mot de passe si environnement partagé ;

- TTL sur clés temporaires ;

- pas de secrets en clair ;

- préfixes de clés ;

- PostgreSQL reste source de vérité ;

- Redis utilisé pour cache, rate limiting, locks et leaderboards rapides.

## 18 Politique de logs et monitoring

### 18.1 À logger

- erreurs techniques ;

- statut HTTP ;

- temps de réponse ;

- userId interne si utile ;

- rate limits ;

- erreurs providers ;

- actions admin ;

- accès refusés ;

- incidents de sécurité.

### 18.2 À ne pas logger

- mots de passe ;

- passwordHash ;

- JWT ;

- refresh token ;

- clés API ;

- secrets ;

- contenu complet des messages ;

- emails en clair si non nécessaire.

### 18.3 Alertes recommandées

- trop d'échecs login ;

- nombreux 403 ;

- nombreux 429 ;

- provider externe indisponible ;

- accès admin inhabituel ;

- fuite de secret détectée ;

- tentative d'accès chat par non-membre.

## 19 Politique DevOps et déploiement

### 19.1 Docker

Règles :

- ne pas inclure .env dans l'image ;

- secrets fournis au runtime ;

- images à jour ;

- ports exposés uniquement si nécessaires ;

- base et Redis non exposés publiquement ;

- Docker Compose adapté à chaque environnement.

### 19.2 GitHub

Règles :

- branch protection si possible ;

- revue de PR ;

- pas de secrets dans issues ou commits ;

- dépendances à jour ;

- lockfile maintenu ;

- secret scanning si disponible.

### 19.3 CI/CD

Si activé :

- secrets dans GitHub Actions Secrets ;

- permissions minimales ;

- pas d'echo de secrets ;

- staging et production séparés ;

- tests avant déploiement.

## 20 Politique Swagger

Swagger est utile pour la documentation et la soutenance.

Règles :

- pas de secrets dans les exemples ;

- sécurité Bearer documentée ;

- routes sensibles identifiées ;

- Swagger protégé ou désactivé en production si nécessaire ;

- routes de debug ou seed non exposées publiquement.

## 21 Politique mode démo

### 21.1 Objectif

Le mode démo doit permettre de présenter Track'N Share sans dépendre d'APIs externes réelles.

### 21.2 Règles

- données fictives ;

- compte démo dédié ;

- MockProvider activé ;

- Steam/Epic désactivés si non nécessaires ;

- données marquées comme démo si besoin ;

- route /demo/seed désactivable ;

- pas de vraies données personnelles dans les seeds.

### 21.3 Soutenance

Configuration recommandée :

- DEMO_MODE=true ;

- EXTERNAL_API_MODE=mock ;

- MOCK_PROVIDER_ENABLED=true ;

- DEMO_SEED_ENABLED=true ;

- Steam/Epic désactivés ;

- base seedée ;

- compte démo testé.

## 22 Politique de réponse aux incidents

### 22.1 Définition d'un incident

Un incident peut être :

- fuite de secret ;

- accès non autorisé ;

- exposition de données ;

- base de données compromise ;

- chat visible par non-membre ;

- token compromis ;

- route admin ouverte ;

- API externe utilisée abusivement.

### 22.2 Procédure générale

1. Identifier l'incident.

2. Limiter l'impact immédiatement.

3. Corriger la faille.

4. Changer les secrets si nécessaire.

5. Vérifier les logs.

6. Évaluer les données concernées.

7. Informer les personnes concernées si contexte production.

8. Documenter l'incident.

9. Ajouter un test pour éviter la régression.

### 22.3 Fuite de secret

Actions prioritaires :

- révoquer le secret ;

- générer une nouvelle valeur ;

- mettre à jour l'environnement ;

- redémarrer les services ;

- vérifier les accès ;

- nettoyer le dépôt ou les logs ;

- documenter l'incident.

## 23 Politique de tests sécurité

### 23.1 Tests P0

À tester impérativement :

- routes privées sans token ;

- route admin avec PLAYER ;

- modification du profil d'un autre utilisateur ;

- accès chat par non-membre ;

- sendTeamMessage par non-membre ;

- login rate limiting ;

- stats sync rate limiting ;

- validation message vide ;

- token expiré ;

- logout PWA.

### 23.2 Tests P1

À tester ensuite :

- upload invalide ;

- Swagger sans secrets ;

- provider externe en échec ;

- fallback mock ;

- suppression / anonymisation de compte ;

- logs sans tokens ;

- régénération code invitation limitée.

### 23.3 Tests avant soutenance

Checklist :

- compte démo fonctionne ;

- aucun secret dans le front ;

- aucun secret dans GitHub ;

- base seedée ;

- chat limité aux membres ;

- dashboard affiche données mock ;

- API externe non nécessaire ;

- erreurs contrôlées ;

- Swagger accessible si voulu.

## 24 Politique de conservation et purge

Règles générales :

- conserver les données uniquement le temps nécessaire ;

- purger les logs anciens ;

- supprimer ou anonymiser les comptes supprimés ;

- supprimer les notifications anciennes ;

- conserver les archives saisonnières sous forme minimisée ;

- ne pas conserver de tokens obsolètes.

## 25 Politique de mise en production

Avant toute production réelle, vérifier :

- HTTPS activé ;

- CORS strict ;

- secrets forts ;

- .env non inclus dans l'image ;

- DEMO_SEED_ENABLED=false ;

- routes debug désactivées ;

- Swagger protégé ou désactivé ;

- logs sans secrets ;

- backups sécurisés ;

- sous-traitants identifiés ;

- politique de confidentialité publiée ;

- conformité RGPD relue ;

- procédure incident prête ;

- dépendances à jour ;

- tests sécurité passés.

## 26 Matrice synthétique des risques

| Risque | Impact | Mesure principale | Priorité |

|---|---|---|---|

| Mot de passe compromis | Élevé | Hash Argon2/bcrypt + rate limit | P0 |

| Token volé | Élevé | durée limitée + stockage prudent + HTTPS | P0 |

| Accès chat non autorisé | Élevé | TeamMemberGuard + Socket.io auth | P0 |

| Score manipulé | Élevé | calcul back-end + provider contrôlé | P0 |

| Secret GitHub exposé | Élevé | .env ignoré + rotation | P0 |

| XSS dans chat | Élevé | texte brut + échappement | P0 |

| Injection SQL | Élevé | ORM + DTO + requêtes paramétrées | P0 |

| API externe down | Moyen | fallback mock/cache | P0 |

| Upload malveillant | Élevé | types et tailles limités | P1 |

| Swagger public | Moyen | protection production | P1 |

| Données privées cache PWA | Élevé | nettoyage logout + Network First | P0 |

| Route admin accessible | Élevé | RolesGuard ADMIN | P0 |

## 27 Checklist sécurité MVP

- Les mots de passe sont hashés.

- Les routes privées utilisent JWT.

- Les routes admin utilisent RolesGuard.

- Les ressources utilisateur sont protégées par ownership.

- Les équipes sont protégées par rôles d'équipe.

- Le chat est réservé aux membres.

- Socket.io vérifie JWT et appartenance équipe.

- Les entrées utilisateur sont validées.

- Les messages sont en texte brut.

- Le login est rate limité.

- La synchronisation stats est rate limitée.

- Les providers externes ont un fallback.

- Les secrets sont dans .env et non dans GitHub.

- Le front ne contient aucune clé API privée.

- Les variables VITE_ sont uniquement publiques.

- Les logs masquent les tokens et secrets.

- Le cache PWA ne conserve pas de données privées après logout.

- Les routes demo sont désactivables.

- Swagger ne contient aucun secret.

- Les erreurs ne révèlent pas de stack trace.

- Les données mockées sont clairement séparées des données réelles.

## 28 Critères d'acceptation

La politique de sécurité est considérée appliquée pour le MVP si :

- les risques principaux sont identifiés ;

- les documents sécurité sont rédigés ;

- l'authentification est sécurisée ;

- les autorisations sont vérifiées côté back-end ;

- les secrets ne sont pas exposés ;

- les données personnelles sont minimisées ;

- le chat d'équipe est privé ;

- les APIs externes ne bloquent pas l'application ;

- le mode démo fonctionne sans données réelles ;

- les erreurs et logs sont maîtrisés ;

- les tests P0 de sécurité sont prévus ;

- une procédure d'incident existe ;

- une checklist pré-production est disponible.

## 29 Conclusion

La politique de sécurité de Track'N Share a pour but de garantir un socle fiable, cohérent et démontrable.

Le projet manipule des comptes, profils, statistiques, équipes, messages, données externes et secrets. Il doit donc appliquer une sécurité dès la conception : authentification, autorisation, validation, minimisation, secrets, logs, rate limiting et fallback.

Pour le MVP, la priorité est de sécuriser les éléments essentiels sans bloquer l'avancement : JWT, rôles, permissions, chat d'équipe, données personnelles, secrets, APIs externes et mode démo.

Avant une production réelle, cette politique devra être complétée par des tests plus poussés, une revue juridique, une configuration d'hébergement sécurisée, une gestion avancée des incidents et une surveillance active.
