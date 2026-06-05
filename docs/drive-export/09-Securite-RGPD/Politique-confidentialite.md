# POLITIQUE DE CONFIDENTIALITÉ

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document présente la politique de confidentialité prévue pour Track'N Share.

Il décrit les données personnelles collectées, les raisons de leur collecte, les bases légales envisagées, les durées de conservation, les droits des utilisateurs, les mesures de sécurité et la gestion des données issues d'intégrations externes comme Steam ou Epic/EOS.

Cette politique est rédigée pour un projet étudiant / MVP. Avant une mise en production réelle, elle devra être relue et adaptée par une personne compétente en droit ou conformité RGPD.

Sources officielles consultées

Ce document s'appuie sur les principes de transparence et d'information des personnes prévus par le RGPD, notamment l'article 13 du RGPD, ainsi que sur les recommandations de la CNIL concernant l'information des personnes, la transparence et les durées de conservation des données.

Sources :

- RGPD, article 13 — informations à fournir lorsque les données sont collectées auprès de la personne concernée : https://eur-lex.europa.eu/eli/reg/2016/679/art_13/oj/fra

- CNIL — Conformité RGPD : comment informer les personnes et assurer la transparence ? https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence

- CNIL — Les durées de conservation des données : https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees

## 1 Présentation de Track'N Share

Track'N Share est une application web progressive destinée aux joueurs souhaitant centraliser, suivre et partager leurs statistiques de jeu.

L'application permet notamment de :

- créer un compte utilisateur ;

- gérer un profil joueur ;

- lier un compte de jeu réel ou fictif ;

- synchroniser ou simuler des statistiques ;

- consulter un dashboard personnel ;

- consulter des leaderboards ;

- créer ou rejoindre une équipe ;

- participer à un chat d'équipe ;

- consulter l'historique des saisons ;

- utiliser un mode démo.

## 2 Responsable du traitement

Pour le cadre du projet étudiant, le responsable du traitement est l'équipe projet Track'N Share.

Responsables projet :

- Ioanes ;

- Clément.

Contact projet / confidentialité :

À compléter avec une adresse email de contact.

Exemple :

contact@tracknshare.example

Dans une version réellement déployée publiquement, cette section devra être remplacée par les informations légales complètes de l'organisme responsable : nom, adresse, email de contact, représentant légal si applicable et contact DPO si nécessaire.

## 3 Champ d'application

Cette politique s'applique aux utilisateurs de Track'N Share, notamment :

- visiteurs ;

- utilisateurs inscrits ;

- joueurs connectés ;

- membres d'équipe ;

- capitaines d'équipe ;

- administrateurs ou modérateurs si ces rôles sont activés ;

- utilisateurs du mode démo.

Elle couvre :

- les données collectées directement par Track'N Share ;

- les données générées par l'utilisation de l'application ;

- les données éventuellement récupérées depuis des APIs externes ;

- les données techniques nécessaires au bon fonctionnement et à la sécurité.

## 4 Principes généraux de confidentialité

Track'N Share applique les principes suivants :

Minimisation des données

Ne collecter que les données nécessaires au fonctionnement de l'application.

Transparence

Informer clairement l'utilisateur sur les données utilisées et leurs finalités.

Sécurité

Protéger les données contre l'accès non autorisé, la perte ou la modification abusive.

Contrôle utilisateur

Permettre à l'utilisateur de consulter, modifier ou supprimer certaines données le concernant.

Limitation de conservation

Ne pas conserver les données personnelles plus longtemps que nécessaire.

Respect de la confidentialité

Ne pas afficher publiquement des informations sensibles comme l'email, le mot de passe, les tokens ou les secrets techniques.

## 5 Données collectées

### 5.1 Données de compte

Lors de l'inscription ou de la connexion, Track'N Share peut collecter :

- identifiant utilisateur interne ;

- email ;

- pseudo ;

- mot de passe hashé ;

- rôle applicatif ;

- date de création du compte ;

- date de dernière connexion ;

- statut du compte : actif, désactivé, supprimé ou anonymisé.

Précision importante :

Le mot de passe n'est jamais stocké en clair. Seul un hash de mot de passe est conservé.

### 5.2 Données de profil

Track'N Share peut collecter ou stocker :

- pseudo public ;

- avatar ;

- bannière éventuelle ;

- biographie ;

- préférences de visibilité ;

- paramètres de confidentialité ;

- identifiant de profil.

Ces données servent à afficher le profil joueur dans l'application.

### 5.3 Données de comptes de jeu liés

Si l'utilisateur lie un compte externe ou un compte mocké, Track'N Share peut stocker :

- plateforme : MOCK, STEAM, EPIC/EOS ou autre provider futur ;

- identifiant externe ;

- pseudo externe ;

- URL de profil externe si disponible ;

- avatar externe si disponible ;

- date de liaison ;

- date de dernière synchronisation ;

- métadonnées techniques non sensibles.

Exemples :

- SteamID ;

- pseudo Steam ;

- avatar Steam ;

- Product User ID EOS si une intégration Epic/EOS est réellement activée.

### 5.4 Données de statistiques de jeu

Track'N Share peut stocker :

- victoires ;

- défaites ;

- kills ;

- deaths ;

- nombre de parties jouées ;

- K/D ratio ;

- winrate ;

- score calculé ;

- rang dans un leaderboard ;

- éligibilité au leaderboard ;

- jeu concerné ;

- saison concernée ;

- source de la donnée : mock, API externe, calcul interne ;

- date de dernière mise à jour.

Les statistiques peuvent être :

- simulées pour le mode démo ;

- calculées par Track'N Share ;

- importées depuis une source externe si l'intégration est disponible.

### 5.5 Données d'équipe

Pour les fonctionnalités d'équipe, Track'N Share peut stocker :

- nom de l'équipe ;

- tag de l'équipe ;

- description ;

- avatar ou bannière d'équipe ;

- code d'invitation ;

- identifiant du capitaine ;

- liste des membres ;

- rôles des membres : capitaine, co-capitaine, membre ;

- date d'entrée dans l'équipe ;

- historique éventuel de composition d'équipe pour les saisons archivées.

### 5.6 Données de chat

Pour le chat d'équipe, Track'N Share peut stocker :

- identifiant du message ;

- identifiant de la conversation ;

- identifiant de l'auteur ;

- contenu du message ;

- date d'envoi ;

- date de modification éventuelle ;

- date de suppression ou masquage éventuel.

Les messages d'équipe sont destinés aux membres de l'équipe concernée.

### 5.7 Données de notifications

Si le module de notifications est activé, Track'N Share peut stocker :

- type de notification ;

- titre ;

- contenu court ;

- statut lu / non lu ;

- date de création ;

- utilisateur destinataire ;

- lien de redirection interne.

### 5.8 Données techniques

Pour la sécurité, le diagnostic et le bon fonctionnement, Track'N Share peut traiter :

- adresse IP ;

- user-agent ;

- logs techniques ;

- horodatage des requêtes ;

- erreurs applicatives ;

- informations de rate limiting ;

- identifiants de session ou tokens d'accès ;

- événements de connexion / déconnexion ;

- informations de disponibilité des APIs externes.

### 5.9 Données du mode démo

Le mode démo utilise des données fictives :

- joueurs fictifs ;

- équipes fictives ;

- statistiques fictives ;

- messages fictifs ;

- saisons fictives ;

- leaderboards fictifs.

Ces données ne doivent pas être confondues avec de vraies données personnelles.

## 6 Données non collectées ou interdites

Track'N Share ne doit pas collecter ou exposer inutilement :

- mot de passe en clair ;

- hash de mot de passe dans les réponses API ;

- secrets techniques ;

- clés API Steam ou Epic ;

- refresh tokens en clair ;

- tokens externes non chiffrés ;

- données bancaires ;

- documents d'identité ;

- données de santé ;

- données biométriques ;

- informations personnelles non nécessaires au projet.

## 7 Finalités du traitement

Les données sont utilisées pour les finalités suivantes.

### 7.1 Création et gestion du compte

Données concernées :

- email ;

- pseudo ;

- mot de passe hashé ;

- rôle ;

- dates de compte.

Objectif :

- créer un compte ;

- permettre la connexion ;

- sécuriser l'accès ;

- gérer la session utilisateur.

Base légale envisagée :

- exécution d'un service demandé par l'utilisateur ;

- intérêt légitime pour la sécurité.

### 7.2 Affichage du profil joueur

Données concernées :

- pseudo ;

- avatar ;

- bio ;

- visibilité ;

- statistiques publiques si activées.

Objectif :

- afficher une identité joueur ;

- permettre aux autres utilisateurs de reconnaître un joueur ;

- personnaliser l'expérience.

Base légale envisagée :

- exécution du service ;

- consentement ou choix utilisateur pour certains éléments facultatifs.

### 7.3 Synchronisation et suivi des statistiques

Données concernées :

- compte de jeu lié ;

- statistiques ;

- score ;

- jeu ;

- saison ;

- source de synchronisation.

Objectif :

- afficher les performances ;

- calculer les scores ;

- alimenter les leaderboards ;

- permettre le suivi saisonnier.

Base légale envisagée :

- exécution du service demandé par l'utilisateur.

### 7.4 Leaderboards et saisons

Données concernées :

- pseudo ;

- score ;

- rang ;

- statistiques principales ;

- saison.

Objectif :

- afficher les classements ;

- permettre la compétition ;

- conserver un historique saisonnier.

Base légale envisagée :

- exécution du service ;

- intérêt légitime à maintenir un historique cohérent des saisons.

### 7.5 Équipes et chat

Données concernées :

- équipe ;

- membres ;

- rôles ;

- messages ;

- historique du chat.

Objectif :

- permettre le fonctionnement des équipes ;

- permettre la communication entre membres ;

- gérer les droits et accès aux conversations.

Base légale envisagée :

- exécution du service.

### 7.6 Sécurité et prévention des abus

Données concernées :

- IP ;

- logs ;

- événements de connexion ;

- rate limiting ;

- erreurs ;

- informations de session.

Objectif :

- protéger les comptes ;

- limiter le bruteforce ;

- limiter le spam ;

- protéger les APIs externes ;

- diagnostiquer les incidents.

Base légale envisagée :

- intérêt légitime à sécuriser l'application.

### 7.7 Mode démo

Données concernées :

- données fictives ;

- compte démo ;

- statistiques mockées.

Objectif :

- permettre la démonstration du projet ;

- tester l'application sans dépendance à des APIs externes.

Base légale envisagée :

- intérêt légitime pédagogique et technique ;

- absence de données personnelles réelles si les données restent fictives.

## 8 Bases légales récapitulatives

| Finalité | Base légale envisagée |

|---|---|

| Création du compte | Exécution du service |

| Connexion et session | Exécution du service |

| Sécurité du compte | Intérêt légitime |

| Profil utilisateur | Exécution du service / choix utilisateur |

| Liaison d'un compte de jeu | Exécution du service |

| Synchronisation des statistiques | Exécution du service |

| Leaderboards | Exécution du service / intérêt légitime |

| Saisons archivées | Intérêt légitime / continuité du service |

| Chat d'équipe | Exécution du service |

| Notifications | Exécution du service |

| Rate limiting et logs | Intérêt légitime sécurité |

| Mode démo | Intérêt légitime pédagogique |

## 9 Caractère obligatoire ou facultatif des données

Données obligatoires :

- email ;

- pseudo ;

- mot de passe ;

- identifiant utilisateur ;

- données minimales nécessaires à l'authentification.

Données nécessaires selon fonctionnalité :

- compte de jeu lié ;

- statistiques ;

- équipe ;

- messages de chat ;

- code d'invitation.

Données facultatives :

- avatar ;

- bannière ;

- bio ;

- profil externe ;

- préférences de confidentialité ;

- informations de présentation.

Conséquence en cas de non-fourniture :

- sans compte, l'utilisateur ne peut pas accéder au dashboard ;

- sans compte de jeu lié ou mocké, certaines statistiques peuvent ne pas être disponibles ;

- sans équipe, l'utilisateur ne peut pas utiliser le chat d'équipe ;

- sans données facultatives, l'application reste utilisable avec un profil moins personnalisé.

## 10 Destinataires des données

Les données peuvent être accessibles uniquement aux catégories suivantes, selon les besoins :

Utilisateur lui-même

Accès à son compte, profil, statistiques, notifications et paramètres.

Autres utilisateurs

Accès uniquement aux informations publiques ou visibles : pseudo, avatar, score, rang, statistiques publiques, équipe publique.

Membres d'une même équipe

Accès aux informations d'équipe et aux messages du chat d'équipe.

Administrateurs ou modérateurs

Accès limité aux données nécessaires à la maintenance, à la sécurité ou à la modération, si ces rôles sont activés.

Back-end Track'N Share

Traitement technique des données pour fournir le service.

Prestataires techniques éventuels

Hébergement, base de données, stockage, monitoring, email transactionnel ou autre service nécessaire au fonctionnement.

APIs externes

Steam, Epic/EOS ou autres providers peuvent être appelés uniquement pour récupérer des données nécessaires à la synchronisation ou à la liaison de compte, lorsque l'utilisateur utilise cette fonctionnalité.

## 11 Données visibles publiquement

Selon les paramètres de confidentialité retenus, peuvent être publics :

- pseudo ;

- avatar ;

- profil public ;

- équipe publique ;

- score ;

- rang leaderboard ;

- statistiques publiques ;

- historique de saisons publiques.

Ne doivent jamais être publics :

- email ;

- mot de passe ;

- hash du mot de passe ;

- tokens ;

- clés API ;

- messages de chat privés ;

- données de session ;

- logs techniques détaillés.

## 12 Intégrations externes

### 12.1 Steam

Si l'utilisateur lie un compte Steam, Track'N Share peut traiter :

- SteamID ;

- pseudo Steam ;

- avatar Steam ;

- URL du profil ;

- jeux possédés si disponibles ;

- certaines statistiques si disponibles.

Limites :

- les données dépendent de la visibilité du profil Steam ;

- toutes les statistiques ne sont pas disponibles ;

- certaines méthodes nécessitent une clé API ;

- les appels sensibles doivent passer par le back-end.

### 12.2 Epic Games / EOS

Si une intégration Epic/EOS est activée, Track'N Share peut traiter :

- identifiant Epic ou Product User ID ;

- display name ;

- avatar si disponible ;

- stats ou leaderboards uniquement si un produit compatible les expose.

Limites :

- Epic/EOS n'est pas présenté comme une API universelle équivalente à Steam ;

- la disponibilité dépend de la configuration du produit et des permissions.

### 12.3 API mockée

L'API mockée génère des données fictives pour :

- tests ;

- développement ;

- soutenance ;

- mode démo.

Ces données doivent être identifiées comme fictives lorsqu'elles sont affichées en contexte démo.

## 13 Cookies, stockage local et PWA

### 13.1 Cookies

Track'N Share peut utiliser des cookies techniques si nécessaire pour :

- maintenir une session ;

- stocker un refresh token sécurisé ;

- sécuriser l'authentification.

Si des cookies non strictement nécessaires sont ajoutés plus tard, un mécanisme de consentement devra être prévu.

### 13.2 LocalStorage / sessionStorage

Le front-end peut utiliser localStorage ou sessionStorage pour certaines informations techniques.

Règles :

- ne pas stocker de données sensibles inutilement ;

- nettoyer les données à la déconnexion ;

- éviter d'y stocker des refresh tokens en production ;

- vider l'état utilisateur lors d'une session expirée.

### 13.3 Cache PWA

En tant que PWA, Track'N Share peut mettre en cache certaines ressources :

- fichiers statiques ;

- pages publiques ;

- ressources d'interface.

Règle :

Les données privées doivent être gérées avec prudence et ne pas rester consultables après déconnexion.

## 14 Durées de conservation

Les durées ci-dessous sont des recommandations projet. Elles doivent être validées avant une production réelle.

| Type de donnée | Durée recommandée |

|---|---|

| Compte utilisateur actif | Tant que le compte existe |

| Email et pseudo | Tant que le compte existe |

| Mot de passe hashé | Tant que le compte existe |

| Profil public | Tant que le compte existe |

| Comptes de jeu liés | Tant que l'utilisateur conserve la liaison |

| Statistiques de saison active | Pendant la saison active |

| Statistiques archivées | Durée nécessaire à l'historique du service, avec anonymisation possible |

| Messages d'équipe | Tant que l'équipe ou la conversation existe, ou selon politique définie |

| Notifications | 6 à 12 mois recommandés |

| Logs techniques | 3 à 12 mois selon besoin de sécurité |

| Données de rate limiting | Quelques minutes à quelques jours selon clé |

| Données de compte supprimé | Suppression ou anonymisation dans un délai raisonnable |

| Données mockées | Réinitialisables à tout moment |

## 15 Suppression et anonymisation

### 15.1 Suppression de compte

Un utilisateur doit pouvoir demander la suppression de son compte.

La suppression peut entraîner :

- suppression ou anonymisation du profil ;

- suppression de l'email ;

- suppression ou anonymisation des comptes liés ;

- invalidation des sessions ;

- anonymisation des statistiques historiques si elles sont conservées pour les leaderboards ;

- conservation minimale des traces nécessaires à la sécurité pendant une durée limitée.

### 15.2 Données historiques

Les leaderboards et saisons archivées peuvent nécessiter une cohérence historique.

Solution recommandée :

- remplacer l'identité par "Utilisateur supprimé" ;

- supprimer l'avatar ;

- conserver uniquement les statistiques agrégées nécessaires ;

- ne plus permettre d'identifier directement la personne.

### 15.3 Messages d'équipe

En cas de suppression de compte, les messages peuvent être :

- supprimés ;

- anonymisés ;

- conservés sans auteur identifiable selon la politique retenue.

Recommandation MVP :

Anonymiser l'auteur et masquer les informations personnelles.

## 16 Droits des utilisateurs

Conformément aux principes RGPD, les utilisateurs peuvent disposer des droits suivants :

- droit d'accès ;

- droit de rectification ;

- droit d'effacement ;

- droit à la limitation du traitement ;

- droit d'opposition lorsque applicable ;

- droit à la portabilité lorsque applicable ;

- droit de retirer un consentement lorsque le traitement repose sur le consentement.

Exemples dans Track'N Share :

- consulter ses données de profil ;

- modifier son pseudo ou sa bio ;

- supprimer un compte de jeu lié ;

- demander la suppression du compte ;

- demander une exportation simple de ses données ;

- modifier la visibilité du profil.

## 17 Modalités d'exercice des droits

Pour exercer ses droits, l'utilisateur peut contacter l'équipe projet :

Email de contact : à compléter.

Exemple :

privacy@tracknshare.example

La demande devra préciser :

- l'identité du demandeur ;

- le compte concerné ;

- le droit exercé ;

- les informations nécessaires pour traiter la demande.

Dans une version de production réelle, les délais de réponse et procédures devront respecter le cadre légal applicable.

## 18 Sécurité des données

### 18.1 Authentification

Track'N Share prévoit :

- mot de passe hashé avec Argon2 ou bcrypt ;

- JWT pour les routes privées ;

- expiration des tokens ;

- protection des routes sensibles ;

- déconnexion nettoyant l'état local.

### 18.2 Autorisations

Track'N Share prévoit :

- rôles applicatifs ;

- rôles d'équipe ;

- guards NestJS ;

- vérification des permissions côté back-end ;

- interdiction d'accès au chat pour les non-membres.

### 18.3 Protection technique

Mesures prévues :

- validation des données entrantes ;

- rate limiting ;

- CORS contrôlé ;

- Helmet ou headers de sécurité ;

- logs sans secrets ;

- gestion sécurisée des erreurs ;

- limitation des données retournées par l'API.

### 18.4 Secrets et variables d'environnement

Les secrets doivent être stockés dans des variables d'environnement :

- JWT_SECRET ;

- DATABASE_URL ;

- REDIS_URL ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- clés de chiffrement éventuelles.

Ils ne doivent pas être :

- commités dans GitHub ;

- exposés au front-end ;

- affichés dans Swagger ;

- présents dans les logs.

## 19 Transferts hors Union européenne

Selon les services utilisés, certaines données peuvent être traitées par des prestataires situés hors de l'Union européenne ou par des services externes.

Exemples possibles :

- hébergeur cloud ;

- services Steam / Valve ;

- services Epic Games / EOS ;

- outil de monitoring ;

- service d'email transactionnel.

Dans une version de production, il faudra identifier précisément :

- les sous-traitants ;

- leur localisation ;

- les garanties applicables ;

- les clauses contractuelles ou mécanismes de transfert utilisés.

## 20 Sous-traitants et services tiers

Sous-traitants ou services techniques possibles :

- hébergeur de l'application ;

- hébergeur de base de données ;

- service Redis managé ;

- service d'email ;

- stockage d'avatars ;

- outils de logs et monitoring ;

- APIs de jeux externes.

Pour le projet étudiant, cette liste peut rester indicative.

Pour une production réelle, chaque sous-traitant devra être listé précisément.

## 21 Mineurs

Track'N Share est une application liée au jeu vidéo et peut intéresser des utilisateurs mineurs.

Pour le MVP étudiant, il est recommandé de :

- ne pas cibler spécifiquement les enfants ;

- limiter les données collectées ;

- éviter les données sensibles ;

- prévoir une validation juridique avant une mise en production ouverte au public.

## 22 Décisions automatisées

Track'N Share calcule automatiquement :

- K/D ratio ;

- winrate ;

- score ;

- rang ;

- éligibilité au leaderboard.

Ces calculs servent à classer les performances dans l'application.

Ils ne produisent pas d'effet juridique ou significatif comparable à une décision administrative, financière ou professionnelle.

## 23 Mise à jour de la politique

Cette politique pourra être mise à jour si :

- de nouvelles fonctionnalités sont ajoutées ;

- de nouvelles APIs externes sont intégrées ;

- de nouveaux sous-traitants sont utilisés ;

- les durées de conservation changent ;

- les règles de sécurité évoluent ;

- le projet passe d'un MVP étudiant à un service réellement déployé.

La date de dernière mise à jour doit être indiquée en haut du document.

## 24 Version courte affichable aux utilisateurs

Track'N Share collecte les données nécessaires pour créer un compte, afficher un profil joueur, suivre des statistiques, calculer des scores, gérer les équipes et permettre le chat d'équipe.

Les mots de passe sont hashés et ne sont jamais stockés en clair.

Certaines données peuvent être visibles publiquement, comme le pseudo, l'avatar, le score ou le rang, selon les paramètres de confidentialité.

Les données issues de Steam ou Epic/EOS ne sont utilisées que si l'utilisateur choisit de lier un compte externe et si l'intégration est disponible.

L'utilisateur peut demander l'accès, la modification ou la suppression de ses données via le contact indiqué dans cette politique.

## 25 Checklist de conformité pour le MVP

- Informer l'utilisateur des données collectées.

- Ne pas stocker le mot de passe en clair.

- Ne pas exposer l'email publiquement.

- Prévoir des paramètres de visibilité du profil.

- Protéger les routes privées par JWT.

- Vérifier les rôles et permissions côté back-end.

- Ne pas exposer les secrets dans le front-end.

- Prévoir la suppression ou l'anonymisation du compte.

- Afficher la date de dernière synchronisation des stats.

- Conserver les archives de saison sans données sensibles inutiles.

- Identifier clairement les données mockées du mode démo.

- Prévoir une documentation RGPD plus complète avant production.

## 26 Conclusion

La politique de confidentialité de Track'N Share doit être claire, transparente et adaptée aux fonctionnalités du projet.

Le point central est de collecter uniquement les données nécessaires : compte, profil, comptes de jeu liés, statistiques, équipes, messages et données techniques de sécurité.

Pour le MVP, l'application doit surtout garantir :

- la sécurité des comptes ;

- l'absence de mots de passe en clair ;

- la protection des messages d'équipe ;

- la maîtrise des données publiques ;

- la possibilité de supprimer ou anonymiser un compte ;

- la séparation entre données réelles et données mockées.

Avant toute mise en production réelle, cette politique devra être relue, complétée et validée dans un cadre juridique adapté.
