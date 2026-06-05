# RÈGLES MÉTIER

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit les règles métier du projet Track'N Share.

Une règle métier définit une contrainte, un comportement ou une condition que l'application doit respecter, indépendamment de la technologie utilisée. Ces règles servent de référence pour le développement front-end, back-end, base de données, tests, user stories et validation du MVP.

Les règles sont organisées par domaine fonctionnel : utilisateurs, authentification, profils, jeux, statistiques, score, leaderboards, saisons, équipes, chat, confidentialité, sécurité, PWA, données de démonstration et administration.

## 1 Conventions du document

Chaque règle métier est identifiée par un code unique :

- RM-USER : règles liées aux utilisateurs ;

- RM-AUTH : règles liées à l'authentification ;

- RM-PROFILE : règles liées aux profils ;

- RM-GAME : règles liées aux jeux et comptes de jeu ;

- RM-STATS : règles liées aux statistiques ;

- RM-SCORE : règles liées au score ;

- RM-LB : règles liées aux leaderboards ;

- RM-SEASON : règles liées aux saisons ;

- RM-TEAM : règles liées aux équipes ;

- RM-CHAT : règles liées au chat ;

- RM-SOCIAL : règles sociales bonus ;

- RM-PRIVACY : règles de confidentialité ;

- RM-SEC : règles de sécurité ;

- RM-PWA : règles PWA ;

- RM-DEMO : règles liées à la démonstration ;

- RM-ADMIN : règles d'administration et modération.

Niveaux de priorité :

- P0 : obligatoire pour le MVP.

- P1 : important mais peut être réalisé après le MVP.

- P2 : évolution future.

## 2 Règles métier — Utilisateurs

RM-USER-001 — Un utilisateur possède un identifiant unique

Priorité : P0

Règle : Chaque utilisateur doit posséder un identifiant unique généré par le système.

Justification : Permettre d'associer correctement les profils, statistiques, équipes, messages et paramètres à un utilisateur précis.

RM-USER-002 — Un utilisateur possède un email unique

Priorité : P0

Règle : Deux utilisateurs ne peuvent pas avoir le même email.

Justification : Éviter les doublons et sécuriser l'authentification.

RM-USER-003 — Un utilisateur possède un pseudo

Priorité : P0

Règle : Chaque utilisateur doit posséder un pseudo visible dans l'application.

Justification : Identifier les joueurs dans les profils, leaderboards, équipes et chats.

RM-USER-004 — Le pseudo ne doit pas être vide

Priorité : P0

Règle : Un pseudo vide ou composé uniquement d'espaces doit être refusé.

Justification : Garantir l'affichage correct de l'utilisateur.

RM-USER-005 — Le pseudo peut être unique

Priorité : P1

Règle : Selon le choix fonctionnel retenu, un pseudo peut être unique pour éviter les confusions.

Justification : Faciliter la recherche et les profils publics.

RM-USER-006 — Un utilisateur peut modifier ses informations personnelles autorisées

Priorité : P0

Règle : Un utilisateur connecté peut modifier son pseudo, sa bio, son avatar ou ses paramètres selon les fonctionnalités disponibles.

Justification : Permettre la personnalisation du profil.

RM-USER-007 — Un utilisateur ne peut modifier que son propre compte

Priorité : P0

Règle : Un utilisateur standard ne peut pas modifier les informations d'un autre utilisateur.

Justification : Protéger les données et éviter les actions non autorisées.

RM-USER-008 — Un utilisateur peut avoir un rôle applicatif

Priorité : P1

Règle : Un utilisateur peut avoir un rôle tel que joueur, administrateur ou modérateur.

Justification : Différencier les droits d'accès selon les responsabilités.

RM-USER-009 — Un compte désactivé ne peut plus se connecter

Priorité : P2

Règle : Si un compte est désactivé par un administrateur, il ne doit plus pouvoir accéder à l'application.

Justification : Permettre la modération avancée.

RM-USER-010 — Un utilisateur peut demander la suppression de son compte

Priorité : P1

Règle : Un utilisateur doit pouvoir supprimer ou demander la suppression de son compte si cette fonctionnalité est activée.

Justification : Respecter les principes de contrôle des données personnelles.

## 3 Règles métier — Authentification

RM-AUTH-001 — Le mot de passe est obligatoire à l'inscription

Priorité : P0

Règle : Un compte ne peut pas être créé sans mot de passe.

Justification : Sécuriser l'accès au compte.

RM-AUTH-002 — Le mot de passe ne doit jamais être stocké en clair

Priorité : P0

Règle : Le mot de passe doit être hashé avant stockage.

Justification : Protéger les comptes utilisateurs en cas de fuite de base de données.

RM-AUTH-003 — Un mot de passe doit respecter une complexité minimale

Priorité : P0

Règle : Le mot de passe doit respecter une longueur minimale et éventuellement contenir plusieurs types de caractères.

Justification : Réduire les risques liés aux mots de passe faibles.

RM-AUTH-004 — Une connexion valide crée une session ou un token

Priorité : P0

Règle : Lorsqu'un utilisateur fournit des identifiants valides, le système doit créer un mécanisme d'authentification utilisable pour les requêtes suivantes.

Justification : Permettre l'accès aux pages privées.

RM-AUTH-005 — Une connexion invalide est refusée

Priorité : P0

Règle : Si les identifiants sont incorrects, l'accès doit être refusé.

Justification : Protéger les comptes utilisateurs.

RM-AUTH-006 — Les erreurs de connexion ne doivent pas exposer trop d'informations

Priorité : P0

Règle : Le message d'erreur ne doit pas préciser de manière dangereuse si l'email ou le mot de passe est incorrect.

Justification : Limiter l'énumération de comptes.

RM-AUTH-007 — Les routes privées nécessitent une authentification

Priorité : P0

Règle : Les pages privées et endpoints privés doivent être accessibles uniquement aux utilisateurs authentifiés.

Justification : Protéger les données personnelles et fonctionnelles.

RM-AUTH-008 — La déconnexion invalide l'accès utilisateur

Priorité : P0

Règle : Après déconnexion, l'utilisateur ne doit plus pouvoir accéder aux pages privées sans se reconnecter.

Justification : Garantir une fermeture de session correcte.

RM-AUTH-009 — Une session expirée doit être gérée proprement

Priorité : P0

Règle : Si une session expire, l'utilisateur doit être redirigé vers la connexion ou invité à se reconnecter.

Justification : Éviter les états incohérents et protéger les données.

RM-AUTH-010 — Les tentatives de connexion peuvent être limitées

Priorité : P0

Règle : Le système peut limiter les tentatives répétées de connexion.

Justification : Réduire les attaques par bruteforce.

## 4 Règles métier — Profil utilisateur

RM-PROFILE-001 — Un profil est créé avec chaque utilisateur

Priorité : P0

Règle : Lorsqu'un utilisateur crée un compte, un profil associé doit être créé ou disponible.

Justification : Permettre l'affichage du joueur dans l'application.

RM-PROFILE-002 — Le profil affiche les informations principales du joueur

Priorité : P0

Règle : Le profil doit afficher au minimum le pseudo et les statistiques principales disponibles.

Justification : Permettre aux joueurs de se présenter et de consulter leurs performances.

RM-PROFILE-003 — La bio peut être limitée en longueur

Priorité : P1

Règle : La biographie d'un utilisateur doit avoir une limite de caractères.

Justification : Éviter les abus et préserver la lisibilité de l'interface.

RM-PROFILE-004 — L'avatar doit respecter un format autorisé

Priorité : P1

Règle : Si l'upload d'avatar est disponible, seuls certains formats doivent être acceptés, comme PNG, JPG ou WebP.

Justification : Garantir la compatibilité et la sécurité.

RM-PROFILE-005 — Les données privées du profil doivent respecter la visibilité choisie

Priorité : P1

Règle : Si le profil est privé, les informations sensibles ne doivent pas être visibles publiquement.

Justification : Respecter la confidentialité utilisateur.

RM-PROFILE-006 — Un profil public ne doit afficher que les données autorisées

Priorité : P1

Règle : Même sur un profil public, seules les informations choisies comme visibles doivent être affichées.

Justification : Donner à l'utilisateur le contrôle de ses données.

RM-PROFILE-007 — Un utilisateur connecté voit toujours ses propres données

Priorité : P0

Règle : Le propriétaire d'un profil doit pouvoir voir ses propres informations, même si elles sont masquées publiquement.

Justification : Permettre la gestion personnelle du profil.

## 5 Règles métier — Jeux et comptes de jeu

RM-GAME-001 — Un jeu possède un identifiant unique

Priorité : P0

Règle : Chaque jeu suivi par la plateforme doit posséder un identifiant unique.

Justification : Associer correctement les statistiques et leaderboards à un jeu.

RM-GAME-002 — Un jeu possède un nom

Priorité : P0

Règle : Chaque jeu doit avoir un nom lisible par l'utilisateur.

Justification : Permettre l'affichage dans les pages jeux et leaderboards.

RM-GAME-003 — Un jeu peut être solo ou en équipe

Priorité : P0

Règle : Chaque jeu peut être catégorisé comme jeu solo, jeu d'équipe ou les deux.

Justification : Déterminer le type de leaderboard applicable.

RM-GAME-004 — Un utilisateur peut lier un compte de jeu

Priorité : P0

Règle : Un utilisateur connecté peut associer un compte de jeu à son profil.

Justification : Permettre la récupération ou simulation de statistiques.

RM-GAME-005 — Un compte de jeu appartient à un seul utilisateur

Priorité : P0

Règle : Un compte de jeu lié doit être associé à l'utilisateur qui l'a ajouté.

Justification : Éviter les conflits de propriété.

RM-GAME-006 — Les tokens externes ne doivent pas être exposés

Priorité : P0

Règle : Si un compte externe nécessite un token, ce token ne doit jamais être visible côté front-end.

Justification : Protéger les comptes externes.

RM-GAME-007 — L'application doit fonctionner avec une API mockée

Priorité : P0

Règle : Le projet doit prévoir un mode permettant de simuler les statistiques si les APIs externes ne sont pas disponibles.

Justification : Sécuriser le MVP et la soutenance.

RM-GAME-008 — Un utilisateur peut délier un compte de jeu

Priorité : P1

Règle : Un utilisateur peut supprimer le lien entre son profil et un compte de jeu.

Justification : Donner le contrôle à l'utilisateur sur ses connexions externes.

RM-GAME-009 — La date de dernière synchronisation doit être conservée

Priorité : P1

Règle : Le système doit enregistrer la date de dernière récupération ou simulation des statistiques.

Justification : Informer l'utilisateur de la fraîcheur de ses données.

## 6 Règles métier — Statistiques

RM-STATS-001 — Les statistiques sont associées à un utilisateur

Priorité : P0

Règle : Chaque ensemble de statistiques doit être lié à un utilisateur.

Justification : Permettre le suivi individuel des performances.

RM-STATS-002 — Les statistiques sont associées à un jeu

Priorité : P0

Règle : Les statistiques doivent être liées à un jeu précis.

Justification : Éviter de mélanger les performances de différents jeux.

RM-STATS-003 — Les statistiques sont associées à une saison

Priorité : P0

Règle : Les statistiques doivent être rattachées à une saison.

Justification : Permettre l'historique trimestriel et les leaderboards saisonniers.

RM-STATS-004 — Les statistiques minimales contiennent victoires, défaites, kills, deaths et parties jouées

Priorité : P0

Règle : Le modèle minimum de statistiques doit permettre de calculer K/D, winrate et score.

Justification : Alimenter le dashboard et les classements.

RM-STATS-005 — Le nombre de parties jouées ne peut pas être négatif

Priorité : P0

Règle : Les statistiques numériques ne doivent pas accepter de valeurs négatives.

Justification : Garantir la cohérence des données.

RM-STATS-006 — Le K/D ratio est calculé avec kills et deaths

Priorité : P0

Règle : Le K/D ratio correspond au nombre de kills divisé par le nombre de deaths.

Justification : Mesurer la performance individuelle.

RM-STATS-007 — Le système doit gérer deaths = 0

Priorité : P0

Règle : Si le nombre de deaths est égal à 0, le système doit éviter une division par zéro.

Justification : Éviter les erreurs et garantir un affichage correct.

RM-STATS-008 — Le winrate est calculé avec victoires et défaites

Priorité : P0

Règle : Le winrate correspond à victoires / (victoires + défaites) x 100.

Justification : Mesurer le taux de victoire.

RM-STATS-009 — Le système doit gérer l'absence de parties

Priorité : P0

Règle : Si un utilisateur n'a aucune partie, les ratios doivent afficher 0 ou N/A selon la règle retenue.

Justification : Éviter les erreurs et les écrans vides cassés.

RM-STATS-010 — Une synchronisation ratée ne doit pas supprimer les anciennes statistiques

Priorité : P0

Règle : Si une API externe échoue, les anciennes statistiques doivent rester disponibles.

Justification : Garantir la continuité de l'expérience utilisateur.

RM-STATS-011 — Les statistiques peuvent être rafraîchies manuellement

Priorité : P0

Règle : L'utilisateur doit pouvoir demander une mise à jour de ses statistiques.

Justification : Donner un contrôle simple à l'utilisateur.

RM-STATS-012 — Les statistiques peuvent être générées pour la démo

Priorité : P0

Règle : Le système doit pouvoir générer des statistiques fictives réalistes.

Justification : Remplir l'application pendant la soutenance.

## 7 Règles métier — Score

RM-SCORE-001 — Chaque joueur peut avoir un score par jeu et par saison

Priorité : P0

Règle : Le score doit être calculé pour un utilisateur, un jeu et une saison donnés.

Justification : Permettre des classements précis.

RM-SCORE-002 — Le score est recalculé après chaque mise à jour des statistiques

Priorité : P0

Règle : Dès que les statistiques changent, le score doit être recalculé.

Justification : Garantir un leaderboard à jour.

RM-SCORE-003 — La formule MVP du score est définie

Priorité : P0

Règle : Pour le MVP, la formule proposée est : Score = (K/D ratio x 50) + (Winrate x 40) + (Nombre de parties x 0,5).

Justification : Fournir un calcul simple et compréhensible.

RM-SCORE-004 — La formule de score doit être documentée

Priorité : P0

Règle : L'utilisateur doit pouvoir comprendre les grandes règles du calcul de score.

Justification : Rendre le classement transparent.

RM-SCORE-005 — Un joueur doit avoir un minimum de parties pour être classé

Priorité : P0

Règle : Un joueur doit avoir au moins 10 parties sur la saison pour apparaître dans le leaderboard principal.

Justification : Éviter les classements injustes.

RM-SCORE-006 — Un joueur non éligible peut voir son score sans être classé

Priorité : P1

Règle : Un joueur avec moins de 10 parties peut voir son score, mais doit être indiqué comme non éligible au classement.

Justification : Informer l'utilisateur sans fausser le leaderboard.

RM-SCORE-007 — Le score ne doit pas être modifiable manuellement par un utilisateur standard

Priorité : P0

Règle : Un utilisateur ne peut pas modifier son score directement.

Justification : Préserver l'intégrité des classements.

RM-SCORE-008 — Le score d'équipe peut être basé sur la moyenne ou le total des scores des membres

Priorité : P0

Règle : Le score d'équipe doit être calculé à partir des scores individuels des membres selon une règle définie.

Justification : Permettre les classements d'équipe.

## 8 Règles métier — Leaderboards

RM-LB-001 — Le leaderboard solo classe les joueurs par score décroissant

Priorité : P0

Règle : Les joueurs doivent être triés du score le plus élevé au score le plus faible.

Justification : Afficher un classement compétitif clair.

RM-LB-002 — Le leaderboard est lié à un jeu

Priorité : P0

Règle : Un leaderboard doit pouvoir être filtré ou associé à un jeu précis.

Justification : Comparer les joueurs dans un contexte cohérent.

RM-LB-003 — Le leaderboard est lié à une saison

Priorité : P0

Règle : Les classements doivent être associés à une saison.

Justification : Permettre l'historique et les compétitions temporaires.

RM-LB-004 — Les joueurs non éligibles ne sont pas affichés dans le classement principal

Priorité : P0

Règle : Un joueur qui ne respecte pas le minimum de parties ne doit pas apparaître dans le leaderboard principal.

Justification : Garantir un classement juste.

RM-LB-005 — Le leaderboard doit afficher le rang

Priorité : P0

Règle : Chaque joueur ou équipe classé doit avoir un rang visible.

Justification : Faciliter la lecture du classement.

RM-LB-006 — Le leaderboard doit afficher les indicateurs principaux

Priorité : P0

Règle : Le leaderboard solo doit afficher au minimum pseudo, score, K/D, winrate et parties jouées.

Justification : Donner du contexte au classement.

RM-LB-007 — Le leaderboard d'équipe classe les équipes selon leur score collectif

Priorité : P0

Règle : Les équipes doivent être classées selon le score moyen ou total défini.

Justification : Comparer les performances collectives.

RM-LB-008 — Les données privées doivent être masquées dans les leaderboards publics

Priorité : P1

Règle : Si un joueur ou une équipe a des paramètres privés, le leaderboard ne doit pas afficher de données interdites.

Justification : Respecter la confidentialité.

RM-LB-009 — Les anciens leaderboards doivent rester consultables après archivage

Priorité : P0

Règle : Une fois une saison terminée, son classement doit pouvoir être consulté.

Justification : Maintenir l'historique de compétition.

## 9 Règles métier — Saisons

RM-SEASON-001 — Une saison dure trois mois

Priorité : P0

Règle : Une saison correspond à une période trimestrielle.

Justification : Structurer la compétition dans le temps.

RM-SEASON-002 — Une saison possède une date de début et une date de fin

Priorité : P0

Règle : Chaque saison doit être bornée dans le temps.

Justification : Déterminer quelles statistiques lui appartiennent.

RM-SEASON-003 — Une seule saison peut être active à la fois

Priorité : P0

Règle : Le système ne doit pas avoir deux saisons actives simultanément.

Justification : Éviter les ambiguïtés de classement.

RM-SEASON-004 — Les statistiques doivent être rattachées à la saison active

Priorité : P0

Règle : Lorsqu'une statistique est synchronisée, elle doit être associée à la saison courante.

Justification : Garantir un suivi saisonnier cohérent.

RM-SEASON-005 — Une saison terminée doit être archivée

Priorité : P0

Règle : À la fin d'une saison, les statistiques et classements doivent être figés ou archivés.

Justification : Préserver l'historique.

RM-SEASON-006 — Les statistiques archivées ne doivent pas être écrasées par la saison suivante

Priorité : P0

Règle : Le démarrage d'une nouvelle saison ne doit pas supprimer les données des saisons précédentes.

Justification : Permettre la comparaison dans le temps.

RM-SEASON-007 — L'utilisateur peut consulter les anciennes saisons

Priorité : P0

Règle : Les saisons archivées doivent rester accessibles en lecture.

Justification : Suivre l'évolution des performances.

RM-SEASON-008 — La saison active doit être visible dans le dashboard ou les leaderboards

Priorité : P0

Règle : L'utilisateur doit savoir sur quelle saison il consulte ses données.

Justification : Donner du contexte à l'affichage.

## 10 Règles métier — Équipes

RM-TEAM-001 — Un utilisateur connecté peut créer une équipe

Priorité : P0

Règle : La création d'équipe est réservée aux utilisateurs authentifiés.

Justification : Associer une équipe à un créateur identifié.

RM-TEAM-002 — Une équipe possède un identifiant unique

Priorité : P0

Règle : Chaque équipe doit avoir un identifiant unique.

Justification : Gérer membres, statistiques, chat et invitations.

RM-TEAM-003 — Une équipe possède un nom

Priorité : P0

Règle : Une équipe ne peut pas être créée sans nom.

Justification : Permettre l'affichage et la recherche.

RM-TEAM-004 — Une équipe peut avoir un tag

Priorité : P0

Règle : Une équipe peut avoir un tag court affiché dans les classements.

Justification : Renforcer l'identité de l'équipe.

RM-TEAM-005 — Le créateur devient capitaine

Priorité : P0

Règle : L'utilisateur qui crée l'équipe reçoit automatiquement le rôle de capitaine.

Justification : Garantir une responsabilité initiale.

RM-TEAM-006 — Une équipe possède un code d'invitation

Priorité : P0

Règle : Une équipe doit pouvoir générer un code permettant à d'autres joueurs de la rejoindre.

Justification : Simplifier l'ajout de membres.

RM-TEAM-007 — Un code d'invitation doit être unique ou suffisamment aléatoire

Priorité : P0

Règle : Le code d'invitation ne doit pas être facilement devinable.

Justification : Éviter les accès non désirés.

RM-TEAM-008 — Un utilisateur peut rejoindre une équipe avec un code valide

Priorité : P0

Règle : Si le code est valide, l'utilisateur peut rejoindre l'équipe selon les règles de visibilité.

Justification : Permettre l'intégration rapide.

RM-TEAM-009 — Un code invalide doit être refusé

Priorité : P0

Règle : Si le code n'existe pas ou n'est plus valide, l'accès doit être refusé.

Justification : Protéger les équipes.

RM-TEAM-010 — Un utilisateur ne doit pas rejoindre deux fois la même équipe

Priorité : P0

Règle : Un utilisateur déjà membre ne peut pas être ajouté une seconde fois à la même équipe.

Justification : Éviter les doublons.

RM-TEAM-011 — Les rôles d'équipe déterminent les permissions

Priorité : P0

Règle : Les actions possibles dans l'équipe dépendent du rôle : capitaine, co-capitaine, membre ou invité.

Justification : Organiser la gouvernance d'équipe.

RM-TEAM-012 — Un membre ne peut pas modifier les paramètres d'équipe

Priorité : P0

Règle : Un membre standard ne peut pas modifier le nom, tag, description ou paramètres de l'équipe.

Justification : Protéger la structure d'équipe.

RM-TEAM-013 — Un membre ne peut pas exclure le capitaine

Priorité : P0

Règle : Aucun membre standard ou co-capitaine ne peut exclure le capitaine.

Justification : Préserver la hiérarchie de l'équipe.

RM-TEAM-014 — Le capitaine peut promouvoir un membre

Priorité : P1

Règle : Le capitaine peut donner le rôle de co-capitaine à un membre.

Justification : Partager la gestion de l'équipe.

RM-TEAM-015 — Le capitaine peut exclure un membre

Priorité : P1

Règle : Le capitaine peut retirer un membre de l'équipe.

Justification : Permettre la gestion de l'équipe.

RM-TEAM-016 — Un membre peut quitter une équipe

Priorité : P0

Règle : Tout membre peut quitter une équipe, sauf cas spécifique du capitaine seul.

Justification : Donner de la liberté à l'utilisateur.

RM-TEAM-017 — Quitter une équipe retire l'accès au chat de cette équipe

Priorité : P0

Règle : Lorsqu'un utilisateur quitte une équipe, il ne doit plus accéder aux conversations privées de l'équipe.

Justification : Protéger les échanges internes.

RM-TEAM-018 — Les statistiques d'équipe sont calculées à partir des statistiques des membres

Priorité : P0

Règle : Le score, K/D et winrate d'équipe doivent être calculés à partir des données des membres.

Justification : Mesurer la performance collective.

RM-TEAM-019 — Une équipe privée ne doit pas exposer toutes ses données publiquement

Priorité : P1

Règle : Si une équipe est privée, certaines informations doivent être masquées aux non-membres.

Justification : Respecter la confidentialité collective.

## 11 Règles métier — Chat

RM-CHAT-001 — Le chat d'équipe est réservé aux membres de l'équipe

Priorité : P0

Règle : Seuls les membres d'une équipe peuvent accéder à son chat.

Justification : Protéger les conversations internes.

RM-CHAT-002 — Un message doit avoir un auteur

Priorité : P0

Règle : Chaque message envoyé doit être associé à un utilisateur.

Justification : Identifier l'origine des messages.

RM-CHAT-003 — Un message doit être associé à une conversation ou une équipe

Priorité : P0

Règle : Un message ne peut pas exister sans contexte de conversation.

Justification : Organiser l'historique.

RM-CHAT-004 — Un message vide ne doit pas être envoyé

Priorité : P0

Règle : Le système doit refuser les messages vides ou composés uniquement d'espaces.

Justification : Préserver la qualité du chat.

RM-CHAT-005 — Un message peut avoir une longueur maximale

Priorité : P0

Règle : Le contenu d'un message doit être limité en nombre de caractères.

Justification : Éviter les abus et problèmes d'affichage.

RM-CHAT-006 — Les messages doivent être affichés avec une date

Priorité : P0

Règle : Chaque message doit avoir une date ou heure d'envoi visible ou disponible.

Justification : Comprendre l'ordre des échanges.

RM-CHAT-007 — L'historique du chat doit être conservé

Priorité : P0

Règle : Les messages doivent rester disponibles après rechargement de la page.

Justification : Permettre le suivi des conversations.

RM-CHAT-008 — Les messages doivent être diffusés en temps réel aux membres connectés

Priorité : P0

Règle : Lorsqu'un membre envoie un message, les autres membres connectés doivent le recevoir sans recharger la page.

Justification : Offrir une expérience fluide.

RM-CHAT-009 — Le serveur vérifie les permissions avant diffusion

Priorité : P0

Règle : Avant de diffuser un message, le serveur doit vérifier que l'utilisateur est autorisé à écrire dans cette conversation.

Justification : Éviter les accès non autorisés.

RM-CHAT-010 — Les messages peuvent être supprimés ou masqués par un utilisateur autorisé

Priorité : P1

Règle : L'auteur ou un modérateur peut supprimer ou masquer un message selon les règles retenues.

Justification : Corriger les erreurs ou modérer les contenus.

RM-CHAT-011 — Les messages privés sont visibles uniquement par leurs participants

Priorité : P1

Règle : Si les messages privés existent, seuls les participants de la conversation doivent y accéder.

Justification : Protéger la confidentialité.

## 12 Règles métier — Social

RM-SOCIAL-001 — Un utilisateur peut envoyer une demande d'ami

Priorité : P1

Règle : Un utilisateur connecté peut demander un autre joueur en ami.

Justification : Favoriser la dimension communautaire.

RM-SOCIAL-002 — Une demande d'ami peut être acceptée ou refusée

Priorité : P1

Règle : Le destinataire d'une demande d'ami doit pouvoir l'accepter ou la refuser.

Justification : Donner le contrôle à l'utilisateur.

RM-SOCIAL-003 — Une relation d'amitié ne doit pas être dupliquée

Priorité : P1

Règle : Deux utilisateurs ne peuvent pas avoir plusieurs relations d'amitié identiques.

Justification : Éviter les incohérences.

RM-SOCIAL-004 — Un utilisateur peut supprimer un ami

Priorité : P1

Règle : Un utilisateur peut retirer un joueur de sa liste d'amis.

Justification : Gérer ses relations.

RM-SOCIAL-005 — Un utilisateur bloqué ne peut pas envoyer de demande d'ami

Priorité : P1

Règle : Un utilisateur bloqué ne doit plus pouvoir interagir socialement avec l'utilisateur qui l'a bloqué.

Justification : Protéger l'utilisateur contre les interactions indésirables.

RM-SOCIAL-006 — Le statut en ligne peut être affiché

Priorité : P1

Règle : Le système peut afficher un statut en ligne/hors ligne pour les amis ou coéquipiers.

Justification : Faciliter la communication.

## 13 Règles métier — Gamification

RM-GAM-001 — Un badge possède une condition de déblocage

Priorité : P1

Règle : Chaque badge doit être associé à une condition claire.

Justification : Rendre la gamification compréhensible.

RM-GAM-002 — Un badge ne doit être attribué qu'une seule fois par utilisateur

Priorité : P1

Règle : Un utilisateur ne peut pas débloquer plusieurs fois le même badge.

Justification : Éviter les doublons.

RM-GAM-003 — Un badge débloqué peut apparaître sur le profil

Priorité : P1

Règle : Les badges obtenus peuvent être affichés sur le profil utilisateur.

Justification : Valoriser la progression.

RM-GAM-004 — Un objectif personnel appartient à un utilisateur

Priorité : P1

Règle : Un objectif est lié à l'utilisateur qui l'a créé.

Justification : Personnaliser la progression.

RM-GAM-005 — Un objectif doit avoir une condition mesurable

Priorité : P1

Règle : Un objectif doit être basé sur une donnée suivie : score, K/D, winrate, rang ou parties jouées.

Justification : Permettre le calcul de progression.

RM-GAM-006 — Un objectif peut être terminé

Priorité : P1

Règle : Lorsqu'un objectif atteint sa condition, il peut passer en statut terminé.

Justification : Suivre l'accomplissement.

## 14 Règles métier — Notifications

RM-NOTIF-001 — Une notification est liée à un utilisateur

Priorité : P1

Règle : Chaque notification doit être destinée à un utilisateur précis.

Justification : Éviter les notifications globales non ciblées.

RM-NOTIF-002 — Une notification possède un statut lu ou non lu

Priorité : P1

Règle : Une notification doit pouvoir être marquée comme lue.

Justification : Permettre à l'utilisateur de gérer ses alertes.

RM-NOTIF-003 — Une notification peut rediriger vers une page concernée

Priorité : P1

Règle : Une notification doit pouvoir contenir un lien ou une référence vers l'élément concerné.

Justification : Améliorer l'expérience utilisateur.

RM-NOTIF-004 — Une invitation d'équipe peut générer une notification

Priorité : P1

Règle : Lorsqu'un joueur reçoit une invitation, une notification peut être créée.

Justification : Informer rapidement l'utilisateur.

RM-NOTIF-005 — Un nouveau message peut générer une notification

Priorité : P1

Règle : Un message non lu peut créer une notification.

Justification : Éviter de manquer les échanges.

RM-NOTIF-006 — Les notifications push nécessitent l'accord utilisateur

Priorité : P2

Règle : Les notifications push PWA ne doivent être envoyées qu'après autorisation.

Justification : Respecter les règles navigateur et l'expérience utilisateur.

## 15 Règles métier — Recherche

RM-SEARCH-001 — La recherche peut porter sur les joueurs

Priorité : P1

Règle : L'utilisateur peut rechercher un joueur par pseudo.

Justification : Trouver rapidement un profil.

RM-SEARCH-002 — La recherche peut porter sur les équipes

Priorité : P1

Règle : L'utilisateur peut rechercher une équipe par nom ou tag.

Justification : Faciliter la découverte d'équipes.

RM-SEARCH-003 — La recherche peut porter sur les jeux

Priorité : P1

Règle : L'utilisateur peut rechercher un jeu disponible.

Justification : Accéder rapidement aux stats et leaderboards.

RM-SEARCH-004 — Les résultats doivent respecter la confidentialité

Priorité : P1

Règle : Une recherche ne doit pas exposer des informations masquées par un profil ou une équipe privée.

Justification : Respecter les paramètres de visibilité.

RM-SEARCH-005 — Le matchmaking avancé utilise des critères compréhensibles

Priorité : P2

Règle : Les recommandations doivent être basées sur des critères lisibles : jeu, niveau, stats, rôle, disponibilité.

Justification : Rendre les suggestions explicables.

## 16 Règles métier — Confidentialité et RGPD

RM-PRIVACY-001 — Les données personnelles doivent être limitées au nécessaire

Priorité : P0

Règle : L'application ne doit collecter que les données utiles au fonctionnement du projet.

Justification : Réduire les risques de confidentialité.

RM-PRIVACY-002 — L'email ne doit pas être affiché publiquement

Priorité : P0

Règle : L'adresse email d'un utilisateur ne doit jamais être affichée sur un profil public ou leaderboard.

Justification : Protéger les données personnelles.

RM-PRIVACY-003 — Les messages sont des données sensibles

Priorité : P0

Règle : Les chats d'équipe et messages privés doivent être considérés comme sensibles.

Justification : Protéger les échanges utilisateurs.

RM-PRIVACY-004 — Un utilisateur peut contrôler la visibilité de son profil

Priorité : P1

Règle : L'utilisateur peut choisir de rendre son profil public ou privé si la fonctionnalité est activée.

Justification : Donner le contrôle à l'utilisateur.

RM-PRIVACY-005 — Un utilisateur peut masquer certaines statistiques

Priorité : P1

Règle : L'utilisateur peut choisir de ne pas afficher certaines statistiques publiquement.

Justification : Respecter la préférence utilisateur.

RM-PRIVACY-006 — La suppression de compte doit supprimer ou anonymiser les données personnelles

Priorité : P1

Règle : Lorsqu'un compte est supprimé, les données personnelles doivent être supprimées ou anonymisées.

Justification : Respecter les principes RGPD.

RM-PRIVACY-007 — Les données historiques peuvent être anonymisées

Priorité : P1

Règle : Les anciennes statistiques peuvent être conservées anonymement si elles sont nécessaires aux archives.

Justification : Préserver les leaderboards sans exposer l'identité.

RM-PRIVACY-008 — Un utilisateur peut exporter ses données

Priorité : P2

Règle : L'utilisateur peut demander un export de ses données personnelles si la fonctionnalité est activée.

Justification : Respecter le droit d'accès aux données.

## 17 Règles métier — Sécurité

RM-SEC-001 — Les permissions doivent être vérifiées côté back-end

Priorité : P0

Règle : Les contrôles d'autorisation ne doivent pas reposer uniquement sur le front-end.

Justification : Empêcher les contournements.

RM-SEC-002 — Les entrées utilisateur doivent être validées

Priorité : P0

Règle : Les données envoyées par l'utilisateur doivent être validées avant traitement.

Justification : Éviter les données invalides ou malveillantes.

RM-SEC-003 — Les contenus affichés doivent être protégés contre les injections

Priorité : P0

Règle : Les pseudos, bios, messages et noms d'équipes doivent être affichés sans permettre l'exécution de code malveillant.

Justification : Réduire les risques XSS.

RM-SEC-004 — Les secrets ne doivent pas être stockés dans le code source

Priorité : P0

Règle : Les clés API, secrets JWT et clés de chiffrement doivent être stockés dans des variables d'environnement.

Justification : Éviter les fuites de secrets.

RM-SEC-005 — Les logs ne doivent pas contenir de données sensibles

Priorité : P0

Règle : Les mots de passe, tokens et contenus privés ne doivent pas apparaître dans les logs.

Justification : Éviter les fuites indirectes.

RM-SEC-006 — Les tokens externes doivent être chiffrés si stockés

Priorité : P1

Règle : Les tokens d'API externes doivent être chiffrés avant stockage.

Justification : Protéger les accès aux comptes liés.

RM-SEC-007 — Les messages peuvent être chiffrés en base

Priorité : P1

Règle : Les messages peuvent être chiffrés côté serveur avant stockage.

Justification : Limiter l'impact d'une fuite de base.

RM-SEC-008 — Les actions critiques nécessitent une confirmation

Priorité : P0

Règle : Les actions comme supprimer un compte, supprimer une équipe ou quitter une équipe doivent demander confirmation.

Justification : Éviter les erreurs utilisateur.

## 18 Règles métier — PWA

RM-PWA-001 — L'application doit être installable

Priorité : P0

Règle : Track'N Share doit pouvoir être installé comme PWA si le navigateur le permet.

Justification : Offrir une expérience mobile proche d'une application native.

RM-PWA-002 — L'application doit disposer d'un manifest valide

Priorité : P0

Règle : Le manifest doit contenir le nom, les icônes, le mode d'affichage et l'URL de démarrage.

Justification : Permettre l'installation.

RM-PWA-003 — L'application doit être responsive

Priorité : P0

Règle : Les pages principales doivent être utilisables sur mobile.

Justification : Le projet vise une expérience web/mobile.

RM-PWA-004 — Les données sensibles ne doivent pas rester accessibles après déconnexion

Priorité : P0

Règle : Après logout, le cache ou l'état local ne doit pas permettre de lire des données privées.

Justification : Protéger l'utilisateur sur appareil partagé.

RM-PWA-005 — Une page offline peut être affichée en cas d'absence de réseau

Priorité : P1

Règle : Si l'utilisateur est hors ligne, une page ou un message clair peut être affiché.

Justification : Améliorer l'expérience utilisateur.

RM-PWA-006 — Les données utilisateur doivent privilégier une stratégie network-first

Priorité : P1

Règle : Les données sensibles doivent être récupérées depuis le réseau en priorité plutôt que servies depuis un cache persistant.

Justification : Éviter l'exposition de données obsolètes ou privées.

## 19 Règles métier — Mode démo et données seedées

RM-DEMO-001 — Le projet doit disposer de données de démonstration

Priorité : P0

Règle : Le système doit pouvoir charger des joueurs, équipes, jeux, saisons, statistiques et messages fictifs.

Justification : Éviter une application vide pendant la soutenance.

RM-DEMO-002 — Le mode démo ne doit pas dépendre d'une API externe

Priorité : P0

Règle : La démonstration doit pouvoir fonctionner avec des données locales ou mockées.

Justification : Réduire les risques le jour de la présentation.

RM-DEMO-003 — Les leaderboards de démonstration doivent être remplis

Priorité : P0

Règle : Le mode démo doit inclure suffisamment de joueurs et équipes pour afficher des classements crédibles.

Justification : Montrer l'intérêt de la plateforme.

RM-DEMO-004 — Le compte démo doit avoir une équipe

Priorité : P0

Règle : Le compte utilisé pendant la démonstration doit appartenir à une équipe.

Justification : Permettre de montrer les fonctionnalités d'équipe et le chat.

RM-DEMO-005 — Le chat de démonstration doit contenir des messages

Priorité : P0

Règle : Une équipe de démonstration doit avoir un historique de chat.

Justification : Éviter un écran vide pendant la démonstration.

RM-DEMO-006 — Les données de démonstration doivent rester réalistes

Priorité : P0

Règle : Les statistiques fictives doivent être cohérentes et crédibles.

Justification : Rendre la présentation professionnelle.

## 20 Règles métier — Administration et modération

RM-ADMIN-001 — Seuls les administrateurs peuvent accéder à l'espace admin

Priorité : P2

Règle : Les pages d'administration doivent être réservées aux utilisateurs autorisés.

Justification : Protéger les fonctions sensibles.

RM-ADMIN-002 — Un utilisateur peut signaler un profil

Priorité : P1

Règle : Un joueur connecté peut signaler un profil problématique.

Justification : Préparer la modération communautaire.

RM-ADMIN-003 — Un utilisateur peut signaler un message

Priorité : P1

Règle : Un joueur connecté peut signaler un message problématique.

Justification : Gérer les abus dans les discussions.

RM-ADMIN-004 — Un signalement possède un statut

Priorité : P2

Règle : Un signalement peut être en attente, traité, rejeté ou résolu.

Justification : Suivre le traitement des problèmes.

RM-ADMIN-005 — Un administrateur peut désactiver un compte

Priorité : P2

Règle : Un administrateur peut empêcher un utilisateur problématique de se connecter.

Justification : Gérer les abus graves.

RM-ADMIN-006 — Un administrateur peut gérer les jeux disponibles

Priorité : P2

Règle : Un administrateur peut ajouter, modifier ou désactiver un jeu.

Justification : Maintenir le catalogue de jeux.

## 21 Règles métier prioritaires du MVP

Les règles suivantes sont indispensables pour le MVP :

- Création de compte avec email unique.

- Mot de passe hashé.

- Connexion et déconnexion.

- Routes privées protégées.

- Profil utilisateur consultable et modifiable.

- Liste de jeux disponible.

- Liaison ou simulation d'un compte de jeu.

- Statistiques minimales : victoires, défaites, kills, deaths, parties.

- Calcul du K/D ratio.

- Calcul du winrate.

- Calcul du score.

- Minimum de 10 parties pour apparaître dans le leaderboard.

- Leaderboard solo par jeu et saison.

- Saisons de trois mois.

- Archivage des saisons.

- Création d'équipe.

- Code d'invitation d'équipe.

- Rôles d'équipe.

- Statistiques d'équipe.

- Chat d'équipe réservé aux membres.

- Messages en temps réel.

- PWA installable.

- Données seedées et mode démo.

- Protection des données sensibles.

## 22 Tableau récapitulatif des domaines

| Domaine | Priorité MVP | Objectif |

|---|---|---|

| Utilisateurs | P0 | Identifier chaque joueur |

| Authentification | P0 | Sécuriser l'accès |

| Profil | P0 | Afficher l'identité et les performances |

| Jeux | P0 | Associer les stats à un jeu |

| Statistiques | P0 | Mesurer les performances |

| Score | P0 | Classer les joueurs |

| Leaderboards | P0 | Comparer joueurs et équipes |

| Saisons | P0 | Structurer les classements dans le temps |

| Équipes | P0 | Permettre le jeu collectif |

| Chat | P0 | Communiquer en équipe |

| Social | P1 | Ajouter une dimension communautaire |

| Gamification | P1 | Motiver les utilisateurs |

| Notifications | P1 | Informer les utilisateurs |

| Recherche | P1 | Trouver joueurs, jeux et équipes |

| Confidentialité | P0/P1 | Protéger les données |

| Sécurité | P0 | Protéger l'application |

| PWA | P0 | Offrir une expérience mobile |

| Démo | P0 | Sécuriser la soutenance |

| Admin | P2 | Gérer la plateforme |

## 23 Conclusion

Les règles métier de Track'N Share définissent les comportements essentiels que l'application doit respecter.

Le coeur métier repose sur :

- un utilisateur identifié ;

- des statistiques fiables ;

- un score transparent ;

- des leaderboards saisonniers ;

- des équipes avec rôles ;

- un chat sécurisé ;

- une PWA mobile ;

- un mode démo fiable.

Pour garantir un développement réaliste, les règles P0 doivent être traitées en priorité. Les règles P1 améliorent l'expérience utilisateur et peuvent être ajoutées après stabilisation du MVP. Les règles P2 sont des évolutions futures à présenter comme perspectives d'amélioration.
