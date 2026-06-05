# RESSOURCES SÉCURITÉ ET RGPD

Projet Track'N Share

Version : 1.0

Date de vérification : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document centralise les ressources utiles pour traiter les sujets de sécurité applicative, protection des données personnelles, conformité RGPD et bonnes pratiques de développement sécurisé dans Track'N Share.

Il complète les documents Politique-confidentialite, Conformite-RGPD, Protection-attaques, Gestion-secrets-env, Politique-securite, Standards-securite-dev, Tests-securite et Recette-soutenance.

L'objectif est de fournir à l'équipe une bibliothèque de références fiables à consulter pendant le développement, les tests, la préparation de la soutenance et les futures évolutions du projet.

## 1 Vue d'ensemble

### 1.1 Pourquoi ce document est important

Track'N Share manipule plusieurs types de données et fonctionnalités sensibles :

- comptes utilisateurs ;

- emails ;

- mots de passe hashés ;

- profils joueurs ;

- statistiques de jeu ;

- équipes ;

- messages de chat ;

- tokens JWT ;

- variables d'environnement ;

- intégrations Steam/Epic futures ;

- logs applicatifs ;

- données de démonstration.

Ces éléments nécessitent une approche sérieuse sur :

- la sécurité applicative ;

- les droits d'accès ;

- la confidentialité ;

- la minimisation des données ;

- la gestion des secrets ;

- la protection contre les attaques courantes ;

- la conformité RGPD.

### 1.2 Objectif MVP

Pour le MVP, l'objectif n'est pas d'atteindre un niveau de sécurité bancaire ou un audit complet, mais de montrer une démarche propre et cohérente :

- routes privées protégées ;

- permissions back-end ;

- secrets non exposés ;

- données personnelles minimisées ;

- erreurs non verbeuses ;

- logs sans secrets ;

- données de démo fictives ;

- documentation RGPD claire.

## 2 Ressources RGPD officielles

### 2.1 CNIL — Guide RGPD du développeur

Nom : Guide RGPD du développeur

Lien : https://www.cnil.fr/fr/guide-rgpd-du-developpeur

Usage dans Track'N Share : référence principale pour intégrer la protection des données dès le développement.

Utilisation concrète :

- minimisation des données ;

- sécurité dès la conception ;

- gestion des comptes utilisateurs ;

- droits des utilisateurs ;

- stockage et suppression des données ;

- journalisation responsable ;

- développement privacy by design.

Priorité : P0

Notes : source française de référence, très utile pour justifier la conformité RGPD dans la documentation projet.

### 2.2 CNIL — RGPD : de quoi parle-t-on ?

Nom : RGPD : de quoi parle-t-on ?

Lien : https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on

Usage dans Track'N Share : comprendre les principes généraux du RGPD.

Utilisation concrète :

- expliquer ce qu'est une donnée personnelle ;

- comprendre les obligations générales ;

- vulgariser le RGPD dans la documentation.

Priorité : P0

### 2.3 CNIL — Les bases légales

Nom : Les bases légales

Lien : https://www.cnil.fr/fr/les-bases-legales

Usage dans Track'N Share : identifier la base juridique des traitements.

Application possible :

- création de compte : exécution du service ;

- sécurité applicative : intérêt légitime ;

- données de contact : exécution du service ou consentement selon usage ;

- cookies non essentiels : consentement si ajoutés plus tard.

Priorité : P1

### 2.4 CNIL — Sécurité des données personnelles

Nom : Sécurité des données personnelles

Lien : https://www.cnil.fr/fr/securite-des-donnees-personnelles

Usage dans Track'N Share : bonnes pratiques de sécurité pour protéger les données.

Utilisation concrète :

- contrôle des accès ;

- mots de passe ;

- journalisation ;

- sauvegardes ;

- chiffrement ;

- gestion des incidents ;

- protection des postes de travail.

Priorité : P0

### 2.5 CNIL — Cookies et traceurs

Nom : Cookies et autres traceurs

Lien : https://www.cnil.fr/fr/cookies-et-autres-traceurs

Usage dans Track'N Share : à consulter si l'application ajoute des cookies non essentiels ou des outils analytics.

Position MVP :

- éviter les cookies non nécessaires ;

- ne pas ajouter d'analytics sans besoin ;

- documenter tout traceur ajouté.

Priorité : P1

### 2.6 Texte officiel RGPD — EUR-Lex

Nom : Règlement UE 2016/679 — RGPD

Lien : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679

Usage dans Track'N Share : source juridique officielle du règlement.

Utilisation concrète :

- principes relatifs au traitement ;

- droits des personnes ;

- sécurité du traitement ;

- responsabilité du responsable de traitement ;

- durée de conservation ;

- minimisation.

Priorité : P0 pour documentation, P1 pour lecture détaillée.

## 3 Principes RGPD à appliquer au projet

### 3.1 Minimisation des données

Principe : ne collecter que les données nécessaires.

Application Track'N Share :

- email ;

- pseudo ;

- mot de passe hashé ;

- statistiques de jeu ;

- équipe ;

- messages de chat.

À éviter pour le MVP :

- nom civil ;

- adresse ;

- téléphone ;

- date de naissance ;

- données sensibles ;

- géolocalisation ;

- informations inutiles.

### 3.2 Finalité claire

Chaque donnée doit avoir une finalité.

Exemples :

- email : identification et connexion ;

- pseudo : affichage public ;

- mot de passe hashé : authentification ;

- statistiques : dashboard et leaderboards ;

- messages : chat d'équipe ;

- logs : diagnostic et sécurité.

### 3.3 Durée de conservation

La durée de conservation doit être raisonnable.

Exemples :

- compte utilisateur : tant que le compte existe ;

- logs techniques : durée courte ;

- messages de chat : durée à définir ;

- archives de saisons : conservation possible mais anonymisation si compte supprimé ;

- données de démo : renouvelables et fictives.

### 3.4 Droits utilisateurs

Droits à prévoir dans une version complète :

- droit d'accès ;

- droit de rectification ;

- droit à l'effacement ;

- droit à la limitation ;

- droit d'opposition selon cas ;

- droit à la portabilité si applicable.

Pour le MVP, documenter au minimum :

- possibilité de demander suppression ;

- possibilité de modifier son profil ;

- anonymisation des données dans les archives si nécessaire.

### 3.5 Privacy by design

La protection des données doit être pensée dès le développement.

Application :

- DTO stricts ;

- champs sensibles exclus des réponses ;

- logs nettoyés ;

- PWA prudente ;

- permissions back-end ;

- suppression/anonymisation prévue.

## 4 Ressources OWASP

### 4.1 OWASP Top 10

Nom : OWASP Top 10

Lien : https://owasp.org/Top10/

Usage dans Track'N Share : référence des principaux risques web.

Risques particulièrement pertinents :

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

Priorité : P0

### 4.2 OWASP Cheat Sheet Series

Nom : OWASP Cheat Sheet Series

Lien : https://cheatsheetseries.owasp.org/

Usage dans Track'N Share : guides pratiques par sujet.

Cheat sheets utiles :

- Authentication Cheat Sheet ;

- Authorization Cheat Sheet ;

- Input Validation Cheat Sheet ;

- REST Security Cheat Sheet ;

- JSON Web Token for Java Cheat Sheet, principes transposables ;

- Password Storage Cheat Sheet ;

- Logging Cheat Sheet ;

- Secrets Management Cheat Sheet ;

- Cross Site Scripting Prevention Cheat Sheet.

Priorité : P0

### 4.3 OWASP API Security Top 10

Nom : OWASP API Security Top 10

Lien : https://owasp.org/API-Security/editions/2023/en/0x00-header/

Usage dans Track'N Share : sécurité des endpoints REST.

Risques pertinents :

- Broken Object Level Authorization ;

- Broken Authentication ;

- Broken Object Property Level Authorization ;

- Unrestricted Resource Consumption ;

- Broken Function Level Authorization ;

- Server Side Request Forgery ;

- Security Misconfiguration.

Application :

- ResourceOwnerGuard ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- DTO stricts ;

- pagination ;

- rate limiting ;

- pas de secrets dans les réponses.

Priorité : P0

### 4.4 OWASP ASVS

Nom : OWASP Application Security Verification Standard

Lien : https://owasp.org/www-project-application-security-verification-standard/

Usage dans Track'N Share : référentiel avancé pour vérifier la sécurité applicative.

Priorité : P2

Notes : utile en production future, pas obligatoire pour le MVP.

## 5 Ressources authentification et JWT

### 5.1 RFC 7519 — JSON Web Token

Nom : JSON Web Token RFC 7519

Lien : https://datatracker.ietf.org/doc/html/rfc7519

Usage dans Track'N Share : comprendre la structure standard JWT.

Application :

- access token ;

- payload minimal ;

- expiration ;

- identification utilisateur.

Priorité : P0

### 5.2 RFC 8725 — JWT Best Current Practices

Nom : JSON Web Token Best Current Practices

Lien : https://datatracker.ietf.org/doc/html/rfc8725

Usage dans Track'N Share : bonnes pratiques de sécurité JWT.

Application :

- éviter les mauvaises configurations ;

- vérifier les algorithmes ;

- limiter le contenu du token ;

- ne pas utiliser un token sans validation stricte.

Priorité : P1

### 5.3 Password Storage — OWASP

Nom : OWASP Password Storage Cheat Sheet

Lien : https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

Usage dans Track'N Share : stockage sécurisé des mots de passe.

Application :

- Argon2 ou bcrypt ;

- salage ;

- pas de mot de passe en clair ;

- passwordHash jamais retourné ;

- politique de rotation si fuite.

Priorité : P0

### 5.4 Authentication — OWASP

Nom : OWASP Authentication Cheat Sheet

Lien : https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

Usage dans Track'N Share : bonnes pratiques de connexion, erreurs, brute force, sessions.

Application :

- message login générique ;

- rate limiting ;

- gestion token ;

- logout ;

- blocage ou ralentissement des tentatives abusives.

Priorité : P0

## 6 Ressources autorisation et contrôle d'accès

### 6.1 Authorization — OWASP

Nom : OWASP Authorization Cheat Sheet

Lien : https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html

Usage dans Track'N Share : gestion des permissions.

Application :

- vérifier les accès côté back-end ;

- éviter de se fier uniquement au front ;

- appliquer le moindre privilège ;

- vérifier l'appartenance à une équipe ;

- vérifier la propriété des ressources.

Priorité : P0

### 6.2 NestJS Guards

Nom : NestJS Guards

Lien : https://docs.nestjs.com/guards

Usage dans Track'N Share : implémentation technique des protections.

Guards recommandés :

- JwtAuthGuard ;

- RolesGuard ;

- ResourceOwnerGuard ;

- TeamMemberGuard ;

- TeamRoleGuard.

Priorité : P0

### 6.3 Broken Access Control — OWASP

Nom : OWASP Top 10 — Broken Access Control

Lien : https://owasp.org/Top10/A01_2021-Broken_Access_Control/

Usage dans Track'N Share : comprendre le risque principal d'accès non autorisé.

Application :

- un non-membre ne lit pas le chat ;

- un membre simple ne supprime pas une équipe ;

- un utilisateur ne modifie pas le profil d'un autre ;

- un joueur ne devient pas admin via payload.

Priorité : P0

## 7 Ressources validation des entrées et XSS

### 7.1 Input Validation — OWASP

Nom : OWASP Input Validation Cheat Sheet

Lien : https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

Usage dans Track'N Share : validation des données utilisateur.

Application :

- DTO ;

- ValidationPipe ;

- longueurs maximales ;

- types stricts ;

- champs inconnus refusés ou ignorés ;

- validation chat, équipe, profil.

Priorité : P0

### 7.2 Cross Site Scripting Prevention — OWASP

Nom : OWASP XSS Prevention Cheat Sheet

Lien : https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

Usage dans Track'N Share : prévention XSS dans profil, chat, nom équipe, bio.

Application :

- ne pas utiliser dangerouslySetInnerHTML ;

- afficher les contenus utilisateur comme texte ;

- limiter les champs ;

- refuser ou échapper le HTML ;

- tester chat et bio.

Priorité : P1

### 7.3 NestJS Validation

Nom : NestJS Validation

Lien : https://docs.nestjs.com/techniques/validation

Usage dans Track'N Share : DTO et ValidationPipe.

Application :

- RegisterDto ;

- LoginDto ;

- CreateTeamDto ;

- SendTeamMessageDto ;

- SyncStatsDto.

Priorité : P0

## 8 Ressources sécurité API

### 8.1 OWASP REST Security Cheat Sheet

Nom : REST Security Cheat Sheet

Lien : https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html

Usage dans Track'N Share : sécurisation des endpoints REST.

Application :

- HTTPS en production ;

- authentification Bearer ;

- statuts HTTP cohérents ;

- validation ;

- rate limiting ;

- absence de détails techniques ;

- gestion CORS.

Priorité : P0

### 8.2 MDN HTTP

Nom : MDN HTTP

Lien : https://developer.mozilla.org/en-US/docs/Web/HTTP

Usage dans Track'N Share : méthodes HTTP, codes de statut, headers.

Application :

- 401 vs 403 ;

- 400 validation ;

- 404 ressource ;

- 409 conflit ;

- 429 rate limit.

Priorité : P0

### 8.3 MDN CORS

Nom : MDN CORS

Lien : https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS

Usage dans Track'N Share : configuration front/back.

Application :

- autoriser localhost front en dev ;

- domaine officiel en production future ;

- pas de wildcard avec credentials ;

- CORS documenté dans variables d'environnement.

Priorité : P0

## 9 Ressources gestion des secrets

### 9.1 OWASP Secrets Management

Nom : OWASP Secrets Management Cheat Sheet

Lien : https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

Usage dans Track'N Share : gestion des variables sensibles.

Secrets concernés :

- JWT_SECRET ;

- DATABASE_URL ;

- REDIS_URL ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- SMTP_PASSWORD ;

- tokens externes.

Priorité : P0

### 9.2 GitHub Secrets

Nom : GitHub Actions — Secrets

Lien : https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions

Usage dans Track'N Share : CI/CD future.

Application :

- stocker secrets CI/CD ;

- ne pas écrire les secrets dans ci.yml ;

- séparer secrets test/staging/prod.

Priorité : P1

### 9.3 Docker Secrets

Nom : Docker Secrets

Lien : https://docs.docker.com/engine/swarm/secrets/

Usage dans Track'N Share : production future si Docker Swarm ou approche équivalente.

Priorité : P2

Notes : pour le MVP, .env local suffit, mais jamais commité.

## 10 Ressources logs et monitoring sécurité

### 10.1 OWASP Logging Cheat Sheet

Nom : OWASP Logging Cheat Sheet

Lien : https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html

Usage dans Track'N Share : définir quoi logger et quoi exclure.

À logger :

- login réussi/échoué ;

- accès refusé ;

- erreurs provider ;

- rate limit ;

- actions sensibles ;

- erreurs critiques.

À ne jamais logger :

- mot de passe ;

- passwordHash ;

- JWT ;

- refresh token ;

- clés API ;

- header Authorization ;

- DATABASE_URL complète ;

- contenu complet des messages privés.

Priorité : P0

### 10.2 Sentry Documentation

Nom : Sentry Documentation

Lien : https://docs.sentry.io/

Usage dans Track'N Share : monitoring erreurs future production.

Priorité : P2

Notes : utile après MVP, pas obligatoire pour la soutenance.

## 11 Ressources Docker et environnement sécurisé

### 11.1 Docker Security

Nom : Docker Security

Lien : https://docs.docker.com/engine/security/

Usage dans Track'N Share : durcir l'environnement Docker futur.

Application :

- ne pas mettre de secrets dans les images ;

- limiter les permissions ;

- isoler les services ;

- éviter d'exposer PostgreSQL/Redis publiquement en production.

Priorité : P1

### 11.2 Docker Compose Documentation

Nom : Docker Compose Documentation

Lien : https://docs.docker.com/compose/

Usage dans Track'N Share : environnement local et soutenance.

Application :

- services backend/frontend/postgres/redis ;

- variables via .env ;

- healthchecks ;

- volumes ;

- réseaux internes.

Priorité : P0

## 12 Ressources PWA et sécurité navigateur

### 12.1 MDN Web Storage API

Nom : Web Storage API

Lien : https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

Usage dans Track'N Share : comprendre localStorage/sessionStorage.

Application :

- stockage token si retenu ;

- nettoyage au logout ;

- éviter de stocker des données sensibles inutiles.

Priorité : P1

### 12.2 MDN Service Worker API

Nom : Service Worker API

Lien : https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

Usage dans Track'N Share : PWA, cache, offline.

Application :

- cache assets ;

- éviter cache données privées ;

- page offline neutre ;

- nettoyage après logout.

Priorité : P1

### 12.3 MDN Content Security Policy

Nom : Content Security Policy

Lien : https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

Usage dans Track'N Share : durcissement front-end futur.

Priorité : P2

Notes : utile après MVP pour réduire le risque XSS.

## 13 Ressources dépendances et vulnérabilités

13.1 npm audit

Nom : npm audit

Lien : https://docs.npmjs.com/cli/v10/commands/npm-audit

Usage dans Track'N Share : vérifier les vulnérabilités des dépendances.

Priorité : P1

13.2 pnpm audit

Nom : pnpm audit

Lien : https://pnpm.io/cli/audit

Usage dans Track'N Share : audit si pnpm est utilisé.

Priorité : P1

### 13.3 GitHub Dependabot

Nom : Dependabot

Lien : https://docs.github.com/en/code-security/dependabot

Usage dans Track'N Share : alertes de dépendances futures.

Priorité : P2

## 14 Ressources sécurité des providers externes

### 14.1 Steam Web API Overview

Nom : Steam Web API Overview

Lien : https://partner.steamgames.com/doc/webapi_overview

Usage sécurité : comprendre l'usage des clés Steam et endpoints.

Règles Track'N Share :

- clé côté back uniquement ;

- jamais dans React ;

- jamais dans Swagger ;

- jamais dans logs ;

- fallback MockProvider.

Priorité : P1

### 14.2 Epic Online Services SDK

Nom : Epic Online Services SDK

Lien : https://onlineservices.epicgames.com/en-US/sdk

Usage sécurité : comprendre l'environnement Epic/EOS et les credentials.

Règles Track'N Share :

- EPIC_CLIENT_SECRET côté back uniquement ;

- permissions minimales ;

- fallback ;

- Epic non obligatoire pour MVP.

Priorité : P2

## 15 Ressources tests sécurité

### 15.1 Tests sécurité internes

Documents internes :

- Tests-securite ;

- Tests-API ;

- Recette-soutenance ;

- Standards-securite-dev ;

- Protection-attaques.

Tests prioritaires :

- route privée sans token ;

- token invalide ;

- token expiré ;

- non-membre chat ;

- membre simple action capitaine ;

- passwordHash absent ;

- secrets absents ;

- logs propres ;

- données démo fictives.

### 15.2 OWASP Web Security Testing Guide

Nom : OWASP Web Security Testing Guide

Lien : https://owasp.org/www-project-web-security-testing-guide/

Usage dans Track'N Share : référence avancée de tests sécurité.

Priorité : P2

Notes : utile pour aller plus loin après MVP.

## 16 Checklist sécurité développeur

### 16.1 Avant commit

- Aucun .env commité.

- Aucun secret dans le diff.

- Aucun console.log de token.

- Aucun passwordHash retourné.

- DTO présents sur les routes avec body.

- Guards présents sur routes privées.

- Permissions vérifiées côté back-end.

- Erreurs sans stack trace client.

- Logs sans données sensibles.

### 16.2 Avant pull request

- Tests manuels sécurité effectués.

- Routes privées testées sans token.

- Rôles testés si nécessaires.

- Accès équipe/chat testés.

- Swagger sans secret.

- Variables .env.example à jour.

- Documentation mise à jour si changement sécurité.

### 16.3 Avant soutenance

- Compte démo non admin.

- Données démo fictives.

- MockProvider activé.

- Steam/Epic désactivés si non testés.

- Aucun secret visible dans front.

- Aucun secret visible dans Swagger.

- Aucun secret visible dans logs.

- Chat réservé aux membres.

- Logout nettoie les données privées.

## 17 Priorités sécurité MVP

### 17.1 P0 — Obligatoire

- JWT sur routes privées ;

- mots de passe hashés ;

- passwordHash jamais retourné ;

- guards permissions ;

- DTO validation ;

- aucun secret dans Git ;

- aucun secret côté front ;

- aucun secret dans logs ;

- chat réservé aux membres ;

- compte démo non admin ;

- données de démo fictives.

### 17.2 P1 — Important

- rate limiting login ;

- rate limiting chat ;

- XSS basique ;

- requestId ;

- audit dépendances ;

- headers sécurité ;

- suppression/anonymisation compte ;

- PWA cache sécurisé.

### 17.3 P2 — Futur

- 2FA ;

- refresh token rotation ;

- secrets manager ;

- scan CI avancé ;

- monitoring sécurité ;

- CSP complète ;

- audit sécurité externe ;

- tests de charge sécurité.

## 18 Liens avec les documents internes

Ce document est lié à :

- Politique-confidentialite ;

- Conformite-RGPD ;

- Protection-attaques ;

- Gestion-secrets-env ;

- Politique-securite ;

- Authentification-JWT ;

- Roles-permissions ;

- Documentation-Socket-io ;

- Endpoints-REST-API ;

- Standards-securite-dev ;

- Definition-of-Done ;

- Tests-securite ;

- Recette-soutenance ;

- Variables-environnement ;

- CI-CD-pipeline.

## 19 Sources prioritaires à consulter pendant le développement

Pour le développement quotidien :

- CNIL Guide RGPD développeur ;

- OWASP Cheat Sheet Series ;

- OWASP API Security Top 10 ;

- NestJS Guards ;

- NestJS Validation ;

- JWT RFC 7519 ;

- OWASP Password Storage ;

- OWASP Authorization ;

- OWASP Logging ;

- Docker Compose Documentation.

## 20 Règles de mise à jour

Ce document doit être mis à jour si :

- une nouvelle donnée personnelle est collectée ;

- une nouvelle route sensible est ajoutée ;

- un nouveau provider externe est activé ;

- une nouvelle variable sensible est ajoutée ;

- une décision RGPD change ;

- une nouvelle mesure sécurité est adoptée ;

- le projet passe en production réelle.

## 21 Conclusion

Les ressources sécurité et RGPD permettent à Track'N Share de s'appuyer sur des sources fiables pour construire un MVP propre et défendable en soutenance.

La priorité est de respecter les fondamentaux : minimisation des données, mots de passe hashés, JWT, permissions back-end, validation DTO, secrets protégés, logs propres, chat privé et données de démo fictives.

Ce document doit être utilisé comme bibliothèque de référence tout au long du développement afin de garder une cohérence entre les choix techniques, la documentation RGPD, les tests sécurité et la recette finale.
