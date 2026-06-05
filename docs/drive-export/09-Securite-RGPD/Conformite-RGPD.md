# CONFORMITÉ RGPD

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit la démarche de conformité RGPD prévue pour Track'N Share.

Il a pour but de transformer les obligations principales du RGPD en actions concrètes adaptées au projet : cartographie des traitements, registre, bases légales, minimisation, droits des utilisateurs, durées de conservation, sécurité, gestion des sous-traitants, transferts hors UE, analyse d'impact et réaction en cas de violation de données.

Ce document est conçu pour un projet étudiant / MVP. Avant une mise en production réelle, il devra être relu, complété et validé par une personne compétente en droit, protection des données ou conformité RGPD.

Sources officielles utilisées

Ce document s'appuie sur des sources officielles :

- RGPD — Règlement UE 2016/679 : https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra

- RGPD article 5 — principes relatifs au traitement : https://eur-lex.europa.eu/eli/reg/2016/679/art_5/oj/fra

- RGPD article 6 — licéité du traitement : https://eur-lex.europa.eu/eli/reg/2016/679/art_6/oj/fra

- RGPD article 12 à 22 — droits des personnes : https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra

- RGPD article 25 — protection des données dès la conception et par défaut : https://eur-lex.europa.eu/eli/reg/2016/679/art_25/oj/fra

- RGPD article 30 — registre des activités de traitement : https://eur-lex.europa.eu/eli/reg/2016/679/art_30/oj/fra

- RGPD article 32 — sécurité du traitement : https://eur-lex.europa.eu/eli/reg/2016/679/art_32/oj/fra

- CNIL — Cartographier vos traitements de données personnelles : https://www.cnil.fr/fr/cartographier-vos-traitements-de-donnees-personnelles

- CNIL — Le registre des activités de traitement : https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement

- CNIL — Documenter la conformité : https://www.cnil.fr/fr/documenter-la-conformite

- CNIL — Analyse d'impact relative à la protection des données : https://www.cnil.fr/fr/RGPD-analyse-impact-protection-des-donnees-aipd

- CNIL — Information des personnes et transparence : https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence

- CNIL — Durées de conservation : https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees

## 1 Résumé exécutif

Track'N Share traite des données personnelles liées aux comptes utilisateurs, profils joueurs, statistiques de jeu, équipes, messages de chat et données techniques de sécurité.

La conformité RGPD du projet repose sur les axes suivants :

- informer clairement les utilisateurs ;

- collecter uniquement les données nécessaires ;

- justifier chaque traitement par une base légale ;

- documenter les traitements dans un registre ;

- protéger les données par des mesures techniques ;

- permettre l'exercice des droits utilisateurs ;

- limiter les durées de conservation ;

- sécuriser les APIs externes ;

- prévoir suppression ou anonymisation des comptes ;

- tenir une documentation de conformité à jour.

Pour le MVP, l'objectif n'est pas d'avoir une conformité juridique parfaite de production, mais de démontrer une démarche sérieuse, structurée et cohérente avec les exigences RGPD.

## 2 Données personnelles concernées

### 2.1 Définition

Une donnée personnelle est toute information permettant d'identifier directement ou indirectement une personne physique.

Dans Track'N Share, les données personnelles peuvent inclure :

- email ;

- pseudo ;

- identifiant utilisateur ;

- avatar ;

- bio ;

- statistiques rattachées à un joueur ;

- identifiants de comptes externes ;

- messages de chat ;

- adresse IP ;

- logs de connexion ;

- rôles et appartenance à une équipe.

### 2.2 Données sensibles

Track'N Share ne prévoit pas de traiter des données sensibles au sens RGPD comme :

- données de santé ;

- données biométriques ;

- opinions politiques ;

- religion ;

- orientation sexuelle ;

- données génétiques.

Cette absence doit être conservée autant que possible afin de limiter les risques.

## 3 Principes RGPD appliqués au projet

### 3.1 Licéité, loyauté et transparence

Les utilisateurs doivent comprendre quelles données sont collectées, pourquoi elles le sont et comment elles sont utilisées.

Actions Track'N Share :

- rédiger une politique de confidentialité ;

- afficher une information claire à l'inscription ;

- indiquer les données visibles publiquement ;

- expliquer le fonctionnement des leaderboards ;

- signaler si des données sont mockées ou réelles.

### 3.2 Limitation des finalités

Les données doivent être collectées pour des objectifs précis.

Finalités Track'N Share :

- gestion du compte ;

- authentification ;

- profil joueur ;

- suivi des statistiques ;

- leaderboards ;

- équipes ;

- chat ;

- sécurité ;

- mode démo.

Les données ne doivent pas être réutilisées pour une finalité incompatible sans information ou base légale appropriée.

### 3.3 Minimisation des données

Track'N Share doit collecter uniquement ce qui est nécessaire.

Exemples :

- email nécessaire pour le compte ;

- pseudo nécessaire pour l'identité publique ;

- mot de passe hashé nécessaire pour l'authentification ;

- pas de nom civil obligatoire ;

- pas d'adresse postale ;

- pas de date de naissance si non nécessaire ;

- pas de données bancaires ;

- pas de tokens externes stockés sans nécessité.

### 3.4 Exactitude

Les données doivent être aussi exactes que possible.

Actions :

- permettre à l'utilisateur de modifier son profil ;

- stocker la date de dernière synchronisation ;

- éviter d'afficher des stats périmées sans indication ;

- conserver les anciennes données en cas d'échec API sans les présenter comme fraîchement synchronisées.

### 3.5 Limitation de conservation

Les données ne doivent pas être conservées indéfiniment sans raison.

Actions :

- définir des durées recommandées ;

- supprimer ou anonymiser les comptes supprimés ;

- limiter la conservation des logs ;

- archiver les saisons sans données sensibles inutiles.

### 3.6 Intégrité et confidentialité

Les données doivent être protégées contre les accès non autorisés.

Actions :

- hash des mots de passe ;

- JWT ;

- contrôle des rôles ;

- protection du chat d'équipe ;

- secrets en variables d'environnement ;

- validation des entrées ;

- rate limiting ;

- logs sans secrets.

### 3.7 Responsabilité ou accountability

L'équipe doit être capable de démontrer sa démarche de conformité.

Actions :

- tenir une documentation projet ;

- maintenir un registre des traitements ;

- documenter la politique de confidentialité ;

- documenter les mesures de sécurité ;

- documenter les plans de suppression / anonymisation ;

- garder les décisions d'architecture liées aux données.

## 4 Responsable du traitement et rôles

### 4.1 Responsable du traitement

Dans le cadre du projet étudiant, le responsable du traitement est l'équipe projet Track'N Share.

Responsables projet :

- Ioanes ;

- Clément.

Contact RGPD :

À compléter.

Exemple :

privacy@tracknshare.example

### 4.2 Sous-traitants potentiels

Selon l'hébergement final, Track'N Share pourrait utiliser :

- hébergeur web ;

- hébergeur PostgreSQL ;

- service Redis ;

- stockage d'avatars ;

- service email ;

- monitoring ;

- APIs Steam / Epic / EOS ;

- service de déploiement.

Pour le MVP local, ces sous-traitants peuvent être limités ou absents. Pour une production réelle, ils devront être listés précisément.

### 4.3 DPO / référent RGPD

Pour un projet étudiant, la désignation formelle d'un DPO n'est pas nécessaire dans le cadre du MVP.

Cependant, il est recommandé de désigner un référent interne pour :

- maintenir la documentation ;

- suivre les demandes utilisateurs ;

- vérifier les nouvelles fonctionnalités ;

- tenir à jour le registre.

## 5 Registre des traitements

### 5.1 Pourquoi un registre

La CNIL indique que le registre permet de recenser les traitements de données, de comprendre à quoi servent les données, qui y accède, combien de temps elles sont conservées et comment elles sont sécurisées.

Pour Track'N Share, le registre permet de démontrer que les traitements ont été identifiés.

### 5.2 Traitements identifiés

Les traitements principaux sont :

1. Gestion des comptes utilisateurs.

2. Authentification et sessions.

3. Gestion des profils joueurs.

4. Liaison des comptes de jeu externes ou mockés.

5. Synchronisation et calcul des statistiques.

6. Leaderboards et saisons.

7. Gestion des équipes.

8. Chat d'équipe.

9. Notifications.

10. Logs techniques et sécurité.

11. Mode démo et données seedées.

12. Administration et modération si activées.

### 5.3 Modèle de registre simplifié

| Traitement | Données | Finalité | Base légale | Durée | Destinataires | Sécurité |

|---|---|---|---|---|---|---|

| Comptes | email, pseudo, passwordHash | créer et gérer le compte | exécution du service | durée du compte | utilisateur, back-end | hash, JWT, accès restreint |

| Profils | avatar, bio, visibilité | afficher le profil | exécution du service | durée du compte | utilisateurs selon visibilité | paramètres confidentialité |

| Stats | wins, losses, kills, score | dashboard et leaderboards | exécution du service | saison + archives | utilisateur, leaderboard | contrôle accès, anonymisation |

| Équipes | nom, membres, rôles | collaboration équipe | exécution du service | durée équipe | membres, public selon visibilité | rôles équipe |

| Chat | messages, auteur, date | communication équipe | exécution du service | durée conversation | membres équipe | accès restreint |

| Logs | IP, horodatage, erreurs | sécurité et diagnostic | intérêt légitime | 3 à 12 mois | admins techniques | logs sans secrets |

## 6 Bases légales

### 6.1 Exécution du service

Base utilisée lorsque le traitement est nécessaire pour fournir une fonctionnalité demandée par l'utilisateur.

Exemples :

- créer un compte ;

- se connecter ;

- afficher le dashboard ;

- synchroniser des stats ;

- rejoindre une équipe ;

- envoyer un message dans le chat.

### 6.2 Intérêt légitime

Base utilisée pour protéger l'application, maintenir un historique cohérent et assurer la sécurité.

Exemples :

- logs de sécurité ;

- rate limiting ;

- détection d'abus ;

- archivage des leaderboards ;

- conservation temporaire de traces techniques.

### 6.3 Consentement

Le consentement peut être nécessaire pour certaines fonctionnalités facultatives.

Exemples potentiels :

- cookies non essentiels ;

- liaison à certaines APIs externes si cela implique un accès spécifique ;

- affichage public de données facultatives ;

- communications marketing si ajoutées plus tard.

Pour le MVP, il est recommandé d'éviter les traitements reposant fortement sur le consentement afin de simplifier la conformité.

## 7 Information des utilisateurs

### 7.1 Moments d'information

L'utilisateur doit être informé :

- à l'inscription ;

- lors de la liaison d'un compte externe ;

- dans les paramètres de confidentialité ;

- avant une suppression de compte ;

- lorsque des données sont affichées publiquement ;

- lors de l'utilisation du mode démo.

### 7.2 Supports d'information

Supports prévus :

- politique de confidentialité ;

- mentions courtes dans les formulaires ;

- page paramètres ;

- messages d'aide sur les données publiques ;

- documentation projet.

### 7.3 Exemple de mention courte à l'inscription

En créant un compte, vous acceptez que Track'N Share utilise votre email, pseudo et mot de passe hashé pour créer votre compte, sécuriser votre connexion et vous donner accès aux fonctionnalités de suivi de statistiques. Vous pouvez consulter la politique de confidentialité pour plus d'informations.

## 8 Droits des utilisateurs

### 8.1 Droits prévus

Les utilisateurs doivent pouvoir exercer :

- droit d'accès ;

- droit de rectification ;

- droit d'effacement ;

- droit à la limitation ;

- droit d'opposition lorsque applicable ;

- droit à la portabilité lorsque applicable ;

- droit de retrait du consentement si un traitement repose sur cette base.

### 8.2 Application dans Track'N Share

Droit d'accès :

- consulter son profil ;

- consulter ses stats ;

- consulter ses comptes liés.

Droit de rectification :

- modifier son pseudo ;

- modifier sa bio ;

- modifier son avatar ;

- corriger certains paramètres.

Droit d'effacement :

- demander la suppression du compte ;

- délier un compte externe ;

- anonymiser l'historique si nécessaire.

Droit à la portabilité :

- exporter profil, stats, équipes et comptes liés dans un format simple comme JSON ou CSV en évolution future.

### 8.3 Procédure de réponse

Pour le MVP, procédure simple :

1. L'utilisateur contacte l'équipe projet.

2. L'équipe vérifie que la demande concerne bien le compte de l'utilisateur.

3. L'équipe identifie les données concernées.

4. L'équipe répond ou agit dans un délai raisonnable.

5. L'action est documentée.

Pour une production réelle, cette procédure devra être alignée avec les délais et exigences légales applicables.

## 9 Minimisation par fonctionnalité

### 9.1 Inscription

Données nécessaires :

- email ;

- pseudo ;

- mot de passe.

Données non nécessaires :

- nom réel ;

- prénom ;

- adresse postale ;

- téléphone ;

- date de naissance, sauf obligation future.

### 9.2 Profil

Données nécessaires :

- pseudo ;

- visibilité.

Données facultatives :

- avatar ;

- bio ;

- bannière.

### 9.3 Statistiques

Données nécessaires :

- jeu ;

- saison ;

- scores et métriques utiles.

Données non nécessaires :

- données de jeu non utilisées ;

- historique externe complet si inutile ;

- informations personnelles liées au compte externe non nécessaires.

### 9.4 Chat

Données nécessaires :

- auteur ;

- contenu ;

- date ;

- conversation.

Données à éviter :

- contenu sensible ;

- logs complets de messages ;

- exposition aux non-membres.

## 10 Protection des données dès la conception

### 10.1 Principe

La protection des données dès la conception et par défaut signifie que la confidentialité doit être pensée dès l'architecture du projet, pas ajoutée à la fin.

### 10.2 Mesures Track'N Share

Mesures prévues :

- profil privé ou public ;

- emails non affichés publiquement ;

- mots de passe hashés ;

- APIs externes côté back-end ;

- secrets en .env ;

- droits d'équipe vérifiés côté back-end ;

- chat limité aux membres ;

- données mockées séparées des données réelles ;

- minimisation du payload JWT ;

- validation des DTO ;

- suppression ou anonymisation possible.

### 10.3 Paramètres par défaut recommandés

Par défaut :

- email non public ;

- profil public limité ;

- stats détaillées configurables ;

- chat privé aux membres ;

- pas de liaison externe automatique ;

- pas de cookies non essentiels ;

- logs sans données sensibles.

## 11 Durées de conservation

### 11.1 Principes

Les durées doivent être adaptées à la finalité du traitement.

### 11.2 Durées recommandées MVP

| Donnée | Durée recommandée |

|---|---|

| Compte actif | durée de vie du compte |

| Email | durée de vie du compte |

| Password hash | durée de vie du compte |

| Profil | durée de vie du compte |

| Compte externe lié | jusqu'à suppression de la liaison |

| Stats saison active | durée de la saison active |

| Stats archivées | durée utile à l'historique, avec anonymisation possible |

| Messages chat | durée de vie de l'équipe ou politique définie |

| Notifications | 6 à 12 mois |

| Logs sécurité | 3 à 12 mois |

| Rate limiting | quelques minutes à quelques jours |

| Données mockées | réinitialisables à tout moment |

### 11.3 Actions à prévoir

- créer une procédure de suppression de compte ;

- créer une procédure d'anonymisation ;

- nettoyer les notifications anciennes ;

- purger les logs techniques ;

- documenter les exceptions.

## 12 Suppression et anonymisation

### 12.1 Suppression de compte

Lorsqu'un utilisateur supprime son compte, Track'N Share doit :

- supprimer ou anonymiser l'email ;

- supprimer ou anonymiser le profil ;

- délier les comptes externes ;

- invalider les sessions ;

- supprimer les tokens ;

- anonymiser les messages ou l'auteur ;

- conserver éventuellement des stats agrégées anonymisées pour les archives.

### 12.2 Anonymisation des leaderboards

Pour préserver l'historique des saisons, il est possible de conserver certaines statistiques agrégées sans identité directe.

Exemple :

- pseudo remplacé par "Utilisateur supprimé" ;

- avatar supprimé ;

- identifiant utilisateur dissocié ;

- score conservé dans snapshot archivé si nécessaire.

### 12.3 Suppression des comptes externes

L'utilisateur doit pouvoir délier un compte externe.

Conséquences :

- suppression de externalId si nécessaire ;

- suppression des métadonnées externes ;

- arrêt des synchronisations ;

- conservation possible des anciennes stats internes selon règle d'historique.

## 13 Sécurité du traitement

### 13.1 Mesures techniques

Mesures prévues :

- hash des mots de passe ;

- JWT sécurisé ;

- refresh token sécurisé si activé ;

- validation des entrées ;

- rate limiting ;

- CORS maîtrisé ;

- Helmet ou headers de sécurité ;

- gestion propre des erreurs ;

- pas de secrets dans les logs ;

- variables d'environnement ;

- restrictions d'accès aux données.

### 13.2 Mesures organisationnelles

Mesures prévues :

- documentation sécurité ;

- politique de gestion des secrets ;

- revue des droits ;

- limitation des accès admin ;

- procédures de suppression/anonymisation ;

- vérification avant mise en production.

### 13.3 Mesures spécifiques au chat

- chat réservé aux membres ;

- vérification côté back-end ;

- room Socket.io par équipe ;

- non-membres refusés ;

- messages supprimables ou masquables ;

- logs sans contenu sensible.

## 14 Gestion des secrets

### 14.1 Secrets concernés

- JWT_SECRET ;

- DATABASE_URL ;

- REDIS_URL ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- clés de chiffrement ;

- identifiants SMTP ;

- tokens de déploiement.

### 14.2 Règles

- stocker les secrets dans .env ;

- ne jamais commit de vraies valeurs ;

- prévoir .env.example ;

- ne pas exposer au front-end ;

- ne pas afficher dans Swagger ;

- ne pas logger ;

- faire une rotation en cas de fuite.

## 15 APIs externes et RGPD

### 15.1 Steam

Données possibles :

- SteamID ;

- pseudo ;

- avatar ;

- profil ;

- jeux visibles ;

- stats si disponibles.

Règles RGPD :

- informer l'utilisateur ;

- ne récupérer que les données nécessaires ;

- stocker seulement ce qui est utile ;

- prévoir suppression/déliaison ;

- gérer les profils privés.

### 15.2 Epic/EOS

Données possibles :

- identifiant Epic / Product User ID ;

- display name ;

- avatar ;

- stats si produit compatible.

Règles :

- ne pas surcollecter ;

- ne pas promettre de données universelles ;

- ne pas stocker de tokens sensibles sans protection.

### 15.3 MockProvider

Les données mockées doivent être fictives.

Règles :

- ne pas utiliser de vrais emails ;

- ne pas utiliser de vraies identités sans accord ;

- marquer les données comme démo si affichées.

## 16 Transferts hors Union européenne

### 16.1 Risque

Certains services externes ou hébergeurs peuvent traiter des données hors UE.

Exemples :

- hébergeur cloud ;

- Steam / Valve ;

- Epic Games ;

- monitoring ;

- email transactionnel.

### 16.2 Actions à prévoir avant production

- identifier les sous-traitants ;

- vérifier leur localisation ;

- vérifier les garanties contractuelles ;

- documenter les transferts ;

- informer les utilisateurs ;

- éviter les transferts inutiles.

## 17 Analyse d'impact relative à la protection des données

### 17.1 Principe

La CNIL indique que l'AIPD est un outil permettant de construire un traitement conforme et respectueux de la vie privée, obligatoire pour les traitements susceptibles d'engendrer un risque élevé pour les droits et libertés des personnes.

### 17.2 Évaluation pour Track'N Share MVP

À première vue, le MVP Track'N Share ne semble pas nécessiter automatiquement une AIPD si :

- il ne traite pas de données sensibles ;

- il ne réalise pas de surveillance systématique à grande échelle ;

- il ne prend pas de décisions ayant des effets juridiques importants ;

- il ne cible pas spécifiquement des mineurs ;

- il reste dans un cadre étudiant/démo.

Cependant, une AIPD ou mini-AIPD simplifiée peut être utile comme bonne pratique si :

- l'application devient publique ;

- le volume d'utilisateurs augmente fortement ;

- des mineurs sont ciblés ;

- des intégrations externes réelles sont activées ;

- un historique détaillé de performances est conservé longtemps ;

- les données sont rendues publiques de manière large.

### 17.3 Mini-AIPD recommandée

Pour le projet, il est recommandé de documenter :

- les traitements ;

- les risques ;

- les mesures de réduction ;

- les décisions d'architecture ;

- les choix de minimisation ;

- les durées de conservation.

## 18 Violation de données

### 18.1 Définition

Une violation de données peut être :

- accès non autorisé ;

- fuite de données ;

- perte de données ;

- modification non autorisée ;

- suppression accidentelle ;

- exposition de secrets.

### 18.2 Exemples dans Track'N Share

- mot de passe hashé exposé ;

- clé API Steam commitée ;

- messages de chat visibles par un non-membre ;

- endpoint admin non protégé ;

- base de données exposée ;

- token JWT compromis.

### 18.3 Procédure interne recommandée

1. Identifier l'incident.

2. Bloquer l'accès ou corriger la faille.

3. Évaluer les données concernées.

4. Évaluer les risques pour les utilisateurs.

5. Changer les secrets compromis.

6. Informer les personnes ou autorités compétentes si nécessaire dans un contexte production.

7. Documenter l'incident et les mesures prises.

## 19 Gestion des mineurs

Track'N Share est lié au jeu vidéo, donc peut intéresser des utilisateurs mineurs.

Pour le MVP :

- ne pas cibler spécifiquement les enfants ;

- ne pas collecter d'âge si non nécessaire ;

- limiter les données collectées ;

- éviter les fonctionnalités de profilage excessif ;

- prévoir une revue juridique avant publication réelle.

## 20 Cookies et traceurs

### 20.1 Cookies techniques

Peuvent être utilisés pour :

- session ;

- sécurité ;

- refresh token sécurisé ;

- préférences strictement nécessaires.

### 20.2 Cookies non essentiels

Si des cookies analytiques ou marketing sont ajoutés plus tard :

- information préalable ;

- consentement si nécessaire ;

- possibilité de refus ;

- documentation des finalités.

### 20.3 PWA et cache

Le cache PWA doit être configuré pour éviter que des données privées restent accessibles après déconnexion.

## 21 Documentation de conformité à conserver

Documents déjà prévus dans le projet :

- Politique-confidentialite ;

- Conformite-RGPD ;

- Politique-securite ;

- Gestion-secrets-env ;

- Protection-attaques ;

- Authentification-JWT ;

- Roles-permissions ;

- Plan-secours-APIs ;

- Gestion-rate-limiting ;

- Mapping-donnees-externes.

Documents complémentaires recommandés :

- registre des traitements sous forme de tableau ;

- procédure de suppression/anonymisation ;

- procédure de violation de données ;

- liste des sous-traitants ;

- checklist pré-production.

## 22 Plan d'action RGPD MVP

Phase 1 — Documentation

- rédiger politique de confidentialité ;

- rédiger conformité RGPD ;

- documenter sécurité ;

- documenter secrets ;

- documenter roles/permissions.

Phase 2 — Implémentation technique

- hash mot de passe ;

- JWT ;

- guards ;

- validation DTO ;

- rate limiting ;

- variables d'environnement ;

- logs sans secrets.

Phase 3 — Contrôle utilisateur

- page paramètres ;

- modification profil ;

- suppression/déliaison compte externe ;

- visibilité profil ;

- suppression ou anonymisation compte.

Phase 4 — Sécurité avancée

- refresh token sécurisé ;

- cookies HttpOnly si retenus ;

- procédure violation ;

- audit logs admin ;

- purge logs ;

- export utilisateur.

Phase 5 — Pré-production

- vérifier sous-traitants ;

- vérifier transferts ;

- config CORS ;

- config HTTPS ;

- désactiver routes démo sensibles ;

- relire juridiquement.

## 23 Checklist conformité RGPD MVP

| Point | Statut attendu |

|---|---|

| Politique de confidentialité rédigée | Oui |

| Données collectées identifiées | Oui |

| Finalités documentées | Oui |

| Bases légales identifiées | Oui |

| Registre simplifié préparé | Oui |

| Mot de passe hashé | Oui |

| Email non public | Oui |

| JWT routes privées | Oui |

| Permissions back-end | Oui |

| Chat limité aux membres | Oui |

| Secrets hors GitHub | Oui |

| Variables .env documentées | Oui |

| Données mockées séparées | Oui |

| Suppression/anonymisation prévue | Oui |

| Durées de conservation définies | Oui |

| Logs sans secrets | Oui |

| Rate limiting | Oui |

| APIs externes côté serveur | Oui |

| Export utilisateur prévu en évolution | À prévoir |

| Procédure violation prévue | À prévoir |

| Liste sous-traitants production | À compléter |

| Revue juridique production | À faire avant lancement public |

## 24 Risques RGPD et solutions

### 24.1 Risque : surcollecte de données

Impact : non-respect du principe de minimisation.

Solution : ne collecter que les champs nécessaires au service.

### 24.2 Risque : données publiques trop larges

Impact : exposition de données joueur.

Solution : paramètres de visibilité et affichage limité par défaut.

### 24.3 Risque : suppression de compte incomplète

Impact : conservation injustifiée de données personnelles.

Solution : procédure de suppression/anonymisation.

### 24.4 Risque : messages de chat exposés

Impact : atteinte à la confidentialité.

Solution : TeamMemberGuard, rooms Socket.io privées, tests d'accès.

### 24.5 Risque : données externes non maîtrisées

Impact : récupération excessive ou non fiable.

Solution : mapping externe, minimisation, fallback, information utilisateur.

### 24.6 Risque : secrets exposés

Impact : fuite de données ou abus API.

Solution : .env, .gitignore, rotation, document Gestion-secrets-env.

### 24.7 Risque : logs trop détaillés

Impact : exposition indirecte de données personnelles.

Solution : logs minimisés et durée de conservation limitée.

## 25 Critères d'acceptation

La conformité RGPD du MVP est considérée comme correctement préparée si :

- les données collectées sont identifiées ;

- les finalités sont documentées ;

- les bases légales sont définies ;

- une politique de confidentialité existe ;

- un registre simplifié est présent ;

- les droits utilisateurs sont pris en compte ;

- une suppression ou anonymisation du compte est prévue ;

- les mots de passe sont hashés ;

- les secrets ne sont pas exposés ;

- les routes privées sont protégées ;

- les rôles et permissions sont vérifiés côté back-end ;

- les messages d'équipe ne sont accessibles qu'aux membres ;

- les logs sont limités ;

- les données mockées sont séparées des données réelles ;

- les intégrations externes sont documentées ;

- une revue juridique est prévue avant production.

## 26 Conclusion

La conformité RGPD de Track'N Share doit être vue comme une démarche continue.

Pour le MVP, les priorités sont :

- transparence ;

- minimisation ;

- sécurité ;

- contrôle utilisateur ;

- documentation ;

- suppression/anonymisation ;

- séparation des données mockées et réelles.

Le projet ne doit pas chercher à collecter plus que nécessaire. Il doit surtout démontrer une approche sérieuse : données identifiées, finalités claires, sécurité technique, droits utilisateurs et documentation de conformité.

Avant une mise en production publique, une validation juridique complète sera nécessaire, notamment sur les sous-traitants, transferts hors UE, mineurs, cookies, durées de conservation et modalités d'exercice des droits.
