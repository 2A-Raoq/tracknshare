# SPÉCIFICATIONS FONCTIONNELLES

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit les spécifications fonctionnelles du projet Track'N Share. Il sert de référence pour comprendre ce que l'application doit permettre de faire, quels utilisateurs sont concernés, quelles règles doivent être respectées et quels comportements sont attendus sur chaque module.

Les spécifications fonctionnelles ne décrivent pas uniquement la technique. Elles décrivent surtout le comportement attendu de l'application du point de vue utilisateur et métier.

## 1 Présentation fonctionnelle générale

### 1.1 Concept

Track'N Share est une plateforme web et mobile sous forme de Progressive Web App destinée aux joueurs de jeux vidéo.

L'application permet aux utilisateurs de :

- créer un compte ;

- gérer un profil joueur ;

- lier ou simuler un compte de jeu ;

- récupérer ou consulter des statistiques de parties ;

- calculer un score basé sur les performances ;

- participer à des leaderboards solo ;

- créer ou rejoindre une équipe ;

- consulter les statistiques collectives d'une équipe ;

- participer à un leaderboard d'équipe ;

- discuter dans un chat d'équipe ;

- suivre un historique de saisons de trois mois ;

- installer l'application comme une PWA.

### 1.2 Objectif fonctionnel principal

L'objectif principal est de fournir une plateforme simple, lisible et compétitive permettant à un joueur de suivre sa progression, comparer ses résultats et partager ses performances avec d'autres joueurs ou avec son équipe.

### 1.3 Objectif du MVP

Le MVP doit permettre de démontrer un parcours complet :

1. Un utilisateur arrive sur la landing page.

2. Il crée un compte ou se connecte.

3. Il accède à son dashboard.

4. Il lie ou simule un compte de jeu.

5. Il consulte ses statistiques.

6. Il voit son score et son rang.

7. Il consulte un leaderboard.

8. Il crée ou rejoint une équipe.

9. Il consulte les statistiques de son équipe.

10. Il utilise le chat d'équipe.

11. Il consulte la saison en cours ou les archives.

12. Il peut utiliser l'application sur mobile / PWA.

## 2 Périmètre fonctionnel

### 2.1 Fonctionnalités incluses dans le MVP

Les fonctionnalités suivantes doivent être considérées comme prioritaires :

- Landing page.

- Inscription.

- Connexion.

- Déconnexion.

- Protection des routes privées.

- Profil utilisateur.

- Modification du profil.

- Liste des jeux disponibles.

- Liaison ou simulation d'un compte de jeu.

- Récupération ou génération de statistiques.

- Dashboard joueur.

- Calcul du K/D ratio.

- Calcul du winrate.

- Calcul du score.

- Leaderboard solo.

- Saisons de trois mois.

- Historique des saisons.

- Création d'équipe.

- Rejoindre une équipe avec un code.

- Gestion minimale des rôles d'équipe.

- Statistiques d'équipe.

- Leaderboard d'équipe.

- Chat d'équipe en temps réel.

- PWA installable.

- Mode démo avec données seedées.

- Sécurité fonctionnelle de base.

### 2.2 Fonctionnalités bonus

Les fonctionnalités suivantes sont utiles mais non indispensables au MVP :

- Mot de passe oublié.

- Amis.

- Messages privés.

- Notifications internes.

- Badges et achievements.

- Objectifs personnels.

- Graphiques de progression.

- Comparaison joueur contre joueur.

- Recherche globale.

- Profil public avancé.

- Paramètres de confidentialité avancés.

- Suppression de compte.

- Signalement d'un profil ou message.

- Page offline améliorée.

### 2.3 Évolutions futures

Les fonctionnalités suivantes sont à considérer comme des perspectives :

- Matchmaking interne.

- Tournois.

- Feed social complet.

- Notifications push PWA.

- Chiffrement de bout en bout.

- Administration complète.

- Modération avancée.

- Export complet des données personnelles.

- Cartes de performance exportables.

- Recommandations de coéquipiers.

## 3 Acteurs fonctionnels

### 3.1 Visiteur non connecté

Le visiteur peut :

- consulter la landing page ;

- comprendre le concept ;

- accéder à l'inscription ;

- accéder à la connexion ;

- lancer le mode démo si disponible ;

- consulter certaines pages publiques si elles sont activées.

Il ne peut pas :

- accéder au dashboard ;

- consulter des données privées ;

- créer une équipe ;

- rejoindre une équipe ;

- envoyer des messages ;

- modifier un profil.

### 3.2 Joueur connecté

Le joueur connecté peut :

- consulter son dashboard ;

- modifier son profil ;

- lier ou simuler un compte de jeu ;

- rafraîchir ses statistiques ;

- consulter les leaderboards ;

- créer une équipe ;

- rejoindre une équipe ;

- consulter son historique de saisons ;

- utiliser le chat d'équipe si membre ;

- modifier ses paramètres.

### 3.3 Capitaine d'équipe

Le capitaine est le responsable principal d'une équipe.

Il peut :

- modifier l'équipe ;

- générer ou régénérer un code d'invitation ;

- gérer les membres ;

- promouvoir un membre ;

- exclure un membre selon les règles ;

- supprimer l'équipe si la fonctionnalité est activée ;

- accéder au chat d'équipe.

### 3.4 Co-capitaine

Le co-capitaine peut :

- inviter des membres si autorisé ;

- aider à gérer certains membres ;

- consulter les statistiques d'équipe ;

- participer au chat.

Il ne peut pas :

- supprimer l'équipe ;

- exclure le capitaine ;

- modifier les paramètres critiques sans autorisation.

### 3.5 Membre d'équipe

Le membre peut :

- consulter l'équipe ;

- voir les membres ;

- consulter les statistiques collectives ;

- participer au chat ;

- quitter l'équipe.

Il ne peut pas :

- modifier l'équipe ;

- exclure un membre ;

- gérer les rôles ;

- supprimer l'équipe.

### 3.6 Administrateur ou modérateur

Ce rôle est prévu pour une version avancée.

Il peut potentiellement :

- consulter les signalements ;

- masquer un message ;

- désactiver un compte ;

- gérer les jeux ;

- modérer les contenus.

## 4 Module Landing page

### 4.1 Description

La landing page est la première page visible par un visiteur. Elle doit présenter clairement Track'N Share et inciter l'utilisateur à s'inscrire, se connecter ou tester la démonstration.

### 4.2 Fonctionnalités attendues

La landing page doit afficher :

- le nom Track'N Share ;

- un slogan clair ;

- une courte description du projet ;

- les fonctionnalités principales ;

- un bouton Créer un compte ;

- un bouton Se connecter ;

- un bouton Essayer la démo si le mode démo est disponible.

### 4.3 Règles fonctionnelles

- La page doit être accessible sans connexion.

- Elle doit rester disponible même si l'API back-end rencontre une erreur.

- Elle doit être lisible sur mobile.

- Elle ne doit afficher aucune donnée privée.

### 4.4 États possibles

État normal :

- Le contenu est chargé et les boutons sont visibles.

État erreur :

- Si certaines données dynamiques ne chargent pas, la landing page reste utilisable.

## 5 Module Authentification

### 5.1 Description

Le module d'authentification permet à un utilisateur de créer un compte, se connecter, se déconnecter et accéder aux fonctionnalités privées.

### 5.2 Inscription

L'utilisateur doit pouvoir créer un compte avec :

- un email ;

- un pseudo ;

- un mot de passe.

Champs obligatoires :

- email ;

- pseudo ;

- mot de passe.

Règles fonctionnelles :

- L'email doit être unique.

- Le pseudo doit être unique ou au minimum non vide selon le choix retenu.

- Le mot de passe doit respecter une complexité minimale.

- Les erreurs doivent être compréhensibles.

- Le mot de passe ne doit jamais être affiché ni stocké en clair.

Messages d'erreur possibles :

- Email invalide.

- Email déjà utilisé.

- Pseudo déjà utilisé.

- Mot de passe trop court.

- Erreur serveur.

Critères d'acceptation :

- Un compte valide peut être créé.

- Un compte invalide est refusé.

- L'utilisateur reçoit un retour visuel clair.

### 5.3 Connexion

L'utilisateur doit pouvoir se connecter avec :

- son email ou pseudo ;

- son mot de passe.

Règles fonctionnelles :

- Les identifiants sont vérifiés côté serveur.

- Une session ou un token est créé en cas de succès.

- L'utilisateur est redirigé vers le dashboard.

- Les identifiants invalides sont refusés.

- Les tentatives abusives peuvent être limitées.

Critères d'acceptation :

- Un utilisateur valide accède au dashboard.

- Un utilisateur invalide reste sur la page login avec une erreur.

- Les routes privées sont inaccessibles sans connexion.

### 5.4 Déconnexion

L'utilisateur doit pouvoir se déconnecter depuis le menu utilisateur.

Règles fonctionnelles :

- La session est supprimée ou invalidée.

- Le front vide les données utilisateur locales.

- Les données sensibles du cache sont nettoyées si nécessaire.

- L'utilisateur est redirigé vers la landing page ou la connexion.

Critères d'acceptation :

- Après déconnexion, le dashboard n'est plus accessible.

- Les données privées ne restent pas visibles.

### 5.5 Routes protégées

Les pages suivantes doivent être protégées :

- dashboard ;

- profil personnel ;

- paramètres ;

- création d'équipe ;

- chat d'équipe ;

- messages privés ;

- gestion de compte ;

- pages admin.

Règles fonctionnelles :

- Un utilisateur non connecté est redirigé vers /login.

- Le front peut masquer les pages, mais le back-end doit aussi refuser l'accès.

## 6 Module Profil utilisateur

### 6.1 Description

Le profil utilisateur regroupe les informations personnelles visibles et les statistiques principales du joueur.

### 6.2 Données affichées

Le profil peut afficher :

- pseudo ;

- avatar ;

- bannière ;

- bio ;

- date de création ;

- jeux liés ;

- score actuel ;

- rang actuel ;

- K/D ratio ;

- winrate ;

- nombre de parties ;

- équipe active ;

- badges en bonus ;

- historique de saison.

### 6.3 Modification du profil

L'utilisateur doit pouvoir modifier :

- pseudo ;

- bio ;

- avatar ;

- bannière ;

- paramètres de visibilité si disponibles.

Règles fonctionnelles :

- Un utilisateur ne peut modifier que son propre profil.

- Le pseudo ne doit pas être vide.

- La bio peut être limitée en longueur.

- Les images doivent respecter les formats autorisés.

Critères d'acceptation :

- Les modifications sont enregistrées.

- Les nouvelles informations apparaissent immédiatement.

- Les erreurs de validation sont affichées.

### 6.4 Profil public et privé

Fonctionnalité bonus.

Règles fonctionnelles :

- Un profil public peut être consulté par d'autres utilisateurs.

- Un profil privé masque les informations sensibles.

- Certaines statistiques peuvent être masquées selon les préférences.

## 7 Module Jeux et comptes liés

### 7.1 Description

Ce module permet de gérer les jeux suivis par la plateforme et les comptes de jeu associés à un utilisateur.

### 7.2 Liste des jeux

L'application doit proposer une page listant les jeux disponibles.

Chaque jeu peut contenir :

- nom ;

- plateforme ;

- type de jeu ;

- jeu solo ou équipe ;

- disponibilité de l'API ;

- accès au leaderboard.

Règles fonctionnelles :

- Un utilisateur connecté peut consulter les jeux.

- Chaque jeu peut mener vers un leaderboard ou une page de statistiques.

### 7.3 Liaison de compte de jeu

L'utilisateur doit pouvoir lier un compte de jeu réel ou simulé.

Données possibles :

- plateforme ;

- identifiant externe ;

- pseudo externe ;

- date de liaison ;

- date de dernière synchronisation.

Règles fonctionnelles :

- Un utilisateur ne peut lier que ses propres comptes.

- Les tokens éventuels ne doivent pas être visibles côté front.

- Une API mockée doit être disponible pour le MVP.

### 7.4 API mockée

L'API mockée permet de générer des statistiques réalistes.

Données minimales retournées :

- victoires ;

- défaites ;

- kills ;

- deaths ;

- parties jouées.

Objectif :

- éviter que le projet dépende d'une API externe pendant la démonstration ;

- garantir que le dashboard et les leaderboards soient toujours alimentés.

## 8 Module Statistiques joueur

### 8.1 Description

Le module statistiques permet d'afficher et exploiter les performances d'un joueur.

### 8.2 Statistiques minimales

Les statistiques minimales sont :

- victoires ;

- défaites ;

- kills ;

- deaths ;

- parties jouées ;

- K/D ratio ;

- winrate ;

- score ;

- rang ;

- saison.

### 8.3 Calcul du K/D ratio

Formule :

K/D ratio = kills / deaths

Règles fonctionnelles :

- Si deaths = 0, le système doit éviter une erreur de division.

- Une règle d'affichage doit être définie : afficher kills, ou une valeur maximale, ou N/A.

### 8.4 Calcul du winrate

Formule :

Winrate = victoires / (victoires + défaites) x 100

Règles fonctionnelles :

- Si aucune partie n'est jouée, le winrate peut être affiché à 0 % ou N/A.

- Le winrate doit être affiché en pourcentage.

### 8.5 Rafraîchissement des statistiques

L'utilisateur doit pouvoir rafraîchir ses statistiques.

Règles fonctionnelles :

- Le rafraîchissement récupère ou simule de nouvelles données.

- Les statistiques sont sauvegardées.

- Le score est recalculé.

- La date de dernière synchronisation est mise à jour.

- Les anciennes données ne doivent pas être perdues en cas d'échec.

### 8.6 État vide

Si un utilisateur n'a aucune statistique :

- le dashboard ne doit pas paraître cassé ;

- un message doit expliquer la situation ;

- une action doit être proposée : lier un compte ou utiliser la démo.

## 9 Module Dashboard

### 9.1 Description

Le dashboard est la page centrale de l'utilisateur connecté.

### 9.2 Informations affichées

Le dashboard doit afficher :

- score actuel ;

- rang actuel ;

- K/D ratio ;

- winrate ;

- parties jouées ;

- saison en cours ;

- équipe active ;

- date de dernière synchronisation ;

- accès rapide au leaderboard ;

- accès rapide aux équipes ;

- accès rapide au profil.

### 9.3 Règles fonctionnelles

- Le dashboard est accessible uniquement connecté.

- Les données affichées correspondent à l'utilisateur connecté.

- Les données doivent être lisibles sur mobile.

- Si les données ne sont pas disponibles, un état vide est affiché.

### 9.4 Critères d'acceptation

- Le dashboard charge sans erreur pour un utilisateur connecté.

- Les statistiques principales sont visibles.

- Les boutons principaux mènent vers les bonnes pages.

- L'affichage est responsive.

## 10 Module Score

### 10.1 Description

Le score permet de classer les joueurs et équipes de manière compréhensible.

### 10.2 Formule MVP proposée

Score = (K/D ratio x 50) + (Winrate x 40) + (Nombre de parties x 0,5)

### 10.3 Règles fonctionnelles

- Le score est recalculé après chaque synchronisation de statistiques.

- Le score est associé à un joueur, un jeu et une saison.

- Le score doit être stocké pour permettre les classements.

- La formule doit être documentée pour l'utilisateur.

### 10.4 Règle anti-abus

Un joueur doit avoir au moins 10 parties jouées pendant la saison pour apparaître dans le leaderboard principal.

Objectif :

- éviter qu'un joueur avec très peu de parties et de bonnes statistiques soit classé injustement devant des joueurs réguliers.

### 10.5 Critères d'acceptation

- Le score est calculé de manière cohérente.

- Le score change après mise à jour des statistiques.

- Les joueurs non éligibles sont exclus ou signalés comme non classés.

## 11 Module Leaderboards

### 11.1 Description

Les leaderboards permettent de comparer les joueurs et les équipes.

### 11.2 Leaderboard solo

Le leaderboard solo affiche les joueurs classés par score.

Colonnes recommandées :

- rang ;

- avatar ;

- pseudo ;

- score ;

- K/D ratio ;

- winrate ;

- parties jouées ;

- saison.

Filtres :

- jeu ;

- saison ;

- type de classement.

Règles fonctionnelles :

- Les joueurs sont triés par score décroissant.

- Les joueurs avec moins de 10 parties peuvent être exclus.

- Le classement doit être paginé ou limité si nécessaire.

- Les profils privés doivent être respectés.

### 11.3 Leaderboard d'équipe

Le leaderboard d'équipe affiche les équipes classées selon leurs performances collectives.

Colonnes recommandées :

- rang ;

- nom d'équipe ;

- tag ;

- nombre de membres ;

- score moyen ;

- score total ;

- K/D moyen ;

- winrate moyen ;

- saison.

Règles fonctionnelles :

- Les équipes sont triées par score moyen ou total selon la règle retenue.

- Les équipes privées peuvent masquer certaines données.

- Le classement est filtrable par jeu et saison.

### 11.4 États possibles

État avec données :

- Le classement est visible.

État vide :

- Aucun joueur ou équipe n'est classé.

État non éligible :

- L'utilisateur n'a pas assez de parties pour apparaître.

État erreur :

- Les données n'ont pas pu être chargées.

## 12 Module Saisons

### 12.1 Description

Les saisons remplacent les simples récapitulatifs trimestriels. Elles structurent la compétition dans le temps.

### 12.2 Fonctionnement

Une saison dure trois mois.

Exemples :

- Saison 1 : janvier à mars ;

- Saison 2 : avril à juin ;

- Saison 3 : juillet à septembre ;

- Saison 4 : octobre à décembre.

### 12.3 Données d'une saison

Une saison contient :

- identifiant ;

- nom ;

- date de début ;

- date de fin ;

- statut : planifiée, active, terminée, archivée.

### 12.4 Règles fonctionnelles

- Les statistiques sont associées à une saison.

- Une seule saison est active à la fois.

- À la fin d'une saison, les statistiques et leaderboards doivent être archivés.

- Une nouvelle saison peut démarrer après archivage.

- Les anciennes saisons restent consultables.

### 12.5 Critères d'acceptation

- L'utilisateur voit la saison en cours.

- L'utilisateur peut consulter les saisons passées.

- Les données historiques ne sont pas écrasées.

## 13 Module Équipes

### 13.1 Description

Les équipes permettent aux joueurs de se regrouper, de suivre des performances collectives et de participer à un leaderboard d'équipe.

### 13.2 Création d'équipe

Un utilisateur connecté peut créer une équipe avec :

- nom ;

- tag ;

- description ;

- avatar en bonus ;

- visibilité publique ou privée en bonus.

Règles fonctionnelles :

- Le créateur devient capitaine.

- Un code d'invitation est généré.

- Le nom ou tag peut être unique selon la règle retenue.

### 13.3 Rejoindre une équipe

Un utilisateur peut rejoindre une équipe via un code d'invitation.

Règles fonctionnelles :

- Le code doit exister et être valide.

- L'utilisateur ne doit pas déjà être membre.

- Si l'équipe est privée, une validation du capitaine peut être nécessaire.

- Un code expiré ou invalide affiche une erreur.

### 13.4 Rôles d'équipe

Rôles prévus :

- Capitaine ;

- Co-capitaine ;

- Membre ;

- Invité.

Permissions :

- Capitaine : modifier l'équipe, inviter, exclure, promouvoir, supprimer.

- Co-capitaine : inviter et gérer certains membres selon règles.

- Membre : consulter, participer au chat, quitter l'équipe.

- Invité : attente de validation.

### 13.5 Page équipe

La page équipe affiche :

- nom ;

- tag ;

- description ;

- avatar ;

- liste des membres ;

- rôles ;

- score moyen ;

- K/D moyen ;

- winrate moyen ;

- meilleur joueur ;

- classement d'équipe ;

- accès au chat.

### 13.6 Quitter une équipe

Un membre peut quitter une équipe.

Règles fonctionnelles :

- Une confirmation est demandée.

- Le membre perd l'accès au chat privé.

- Si le capitaine veut quitter, il doit transférer son rôle ou supprimer l'équipe selon la règle retenue.

### 13.7 Critères d'acceptation

- Un utilisateur peut créer une équipe.

- Un utilisateur peut rejoindre une équipe avec un code valide.

- Les rôles sont affichés.

- Les permissions sont respectées côté back-end.

- Les statistiques d'équipe sont visibles.

## 14 Module Chat d'équipe

### 14.1 Description

Le chat d'équipe permet aux membres d'une équipe de communiquer en temps réel.

### 14.2 Fonctionnalités MVP

Le chat doit permettre de :

- ouvrir la conversation d'équipe ;

- charger l'historique ;

- envoyer un message ;

- recevoir les messages en temps réel ;

- afficher l'auteur et la date ;

- protéger l'accès aux membres uniquement.

### 14.3 Règles fonctionnelles

- Seuls les membres d'une équipe peuvent accéder à son chat.

- Un message vide ne doit pas être envoyé.

- Un message peut avoir une longueur maximale.

- Les messages sont liés à une équipe ou conversation.

- Le serveur doit vérifier les permissions avant diffusion.

### 14.4 États possibles

État normal :

- L'historique est chargé et l'utilisateur peut écrire.

État vide :

- Aucun message n'a encore été envoyé.

État erreur :

- Le chat ne peut pas être chargé.

État non autorisé :

- L'utilisateur n'est pas membre de l'équipe.

### 14.5 Critères d'acceptation

- Deux membres connectés voient les messages en temps réel.

- L'historique reste disponible après refresh.

- Un non-membre ne peut pas accéder au chat.

## 15 Module Social

### 15.1 Description

Le module social est principalement bonus. Il permet de renforcer la dimension communautaire.

### 15.2 Amis

Fonctionnalités possibles :

- envoyer une demande d'ami ;

- accepter une demande ;

- refuser une demande ;

- supprimer un ami ;

- consulter une liste d'amis ;

- voir le statut en ligne.

### 15.3 Messages privés

Fonctionnalités possibles :

- créer une conversation privée ;

- envoyer un message ;

- recevoir un message en temps réel ;

- charger l'historique ;

- bloquer un utilisateur.

### 15.4 Règles fonctionnelles

- Un utilisateur bloqué ne peut plus envoyer de message privé.

- Les conversations privées sont visibles uniquement par leurs participants.

- Les messages privés sont considérés comme sensibles.

## 16 Module Gamification

### 16.1 Description

La gamification vise à rendre la plateforme plus motivante.

### 16.2 Badges

Exemples de badges :

- First Blood : première partie enregistrée ;

- Team Founder : première équipe créée ;

- Hot Streak : cinq victoires d'affilée ;

- MVP : meilleur joueur d'une équipe ;

- Veteran : cent parties enregistrées.

Règles fonctionnelles :

- Un badge est débloqué lorsqu'une condition est remplie.

- Un badge ne doit pas être débloqué plusieurs fois.

- Les badges peuvent apparaître sur le profil.

### 16.3 Objectifs personnels

Un joueur peut définir un objectif :

- atteindre un K/D donné ;

- dépasser un winrate donné ;

- atteindre un score ;

- entrer dans un top leaderboard.

Règles fonctionnelles :

- La progression est calculée à partir des statistiques.

- L'objectif peut être terminé automatiquement ou manuellement selon la règle.

## 17 Module Notifications

### 17.1 Description

Les notifications permettent d'informer l'utilisateur d'événements importants.

### 17.2 Types de notifications possibles

- invitation d'équipe ;

- nouveau message ;

- demande d'ami ;

- badge débloqué ;

- objectif atteint ;

- changement de rang ;

- fin de saison.

### 17.3 Règles fonctionnelles

- Une notification est liée à un utilisateur.

- Une notification peut être lue ou non lue.

- Une notification doit rediriger vers la page concernée.

- Les notifications push sont une évolution future.

## 18 Module Recherche

### 18.1 Description

La recherche permet de trouver rapidement des joueurs, équipes ou jeux.

### 18.2 Recherche joueurs

Critères possibles :

- pseudo ;

- jeu ;

- rang ;

- K/D minimum ;

- winrate minimum.

### 18.3 Recherche équipes

Critères possibles :

- nom ;

- tag ;

- jeu ;

- statut ouverte ou privée ;

- niveau moyen.

### 18.4 Règles fonctionnelles

- Les résultats doivent respecter la confidentialité.

- Les profils privés ne doivent pas révéler d'informations masquées.

- Les résultats doivent être lisibles sur mobile.

## 19 Module PWA

### 19.1 Description

Track'N Share doit être utilisable comme une Progressive Web App.

### 19.2 Fonctionnalités PWA attendues

- manifest valide ;

- icônes adaptées ;

- installation possible ;

- mode standalone ;

- responsive mobile ;

- service worker ;

- page offline simple.

### 19.3 Règles fonctionnelles

- L'application doit être utilisable sur mobile.

- Les données privées ne doivent pas rester accessibles après déconnexion.

- Le cache ne doit pas exposer de messages ou données sensibles.

- Les pages principales doivent rester lisibles sur petit écran.

## 20 Module Sécurité et confidentialité

### 20.1 Description

La sécurité est transversale à l'ensemble de l'application.

### 20.2 Données sensibles

Données considérées sensibles :

- email ;

- mot de passe ;

- tokens externes ;

- messages privés ;

- chats d'équipe ;

- données de compte de jeu ;

- préférences de confidentialité.

### 20.3 Règles fonctionnelles de sécurité

- Les mots de passe sont hashés.

- Les tokens ne sont pas exposés côté front.

- Les permissions sont vérifiées côté back-end.

- Les données utilisateur sont validées.

- Les logs ne doivent pas contenir de données sensibles.

- Les messages peuvent être chiffrés en base si la fonctionnalité est retenue.

### 20.4 Confidentialité utilisateur

L'utilisateur peut, en bonus :

- rendre son profil privé ;

- masquer certaines statistiques ;

- supprimer son compte ;

- exporter ses données.

## 21 Module Mode démo

### 21.1 Description

Le mode démo permet de présenter le projet sans dépendre d'une API externe.

### 21.2 Données nécessaires

Le mode démo doit inclure :

- plusieurs joueurs fictifs ;

- plusieurs équipes ;

- plusieurs jeux ;

- plusieurs saisons ;

- statistiques réalistes ;

- leaderboards remplis ;

- messages dans un chat d'équipe ;

- un compte de démonstration prêt.

### 21.3 Règles fonctionnelles

- Le mode démo doit être accessible rapidement.

- Les données doivent être suffisamment réalistes.

- Le scénario de soutenance doit fonctionner même sans API externe réelle.

## 22 Pages de l'application

### 22.1 Pages MVP

- / : landing page ;

- /register : inscription ;

- /login : connexion ;

- /dashboard : dashboard ;

- /profile/:id : profil ;

- /settings : paramètres ;

- /games : liste des jeux ;

- /games/:id/leaderboard : leaderboard d'un jeu ;

- /leaderboard : leaderboard global ;

- /teams : mes équipes ;

- /teams/create : création d'équipe ;

- /teams/:id : page équipe ;

- /teams/:id/chat : chat équipe ;

- /seasons : saisons et archives.

### 22.2 Pages bonus

- /friends : amis ;

- /messages : messages privés ;

- /compare : comparaison joueur ;

- /notifications : notifications ;

- /achievements : badges ;

- /search : recherche ;

- /admin : administration.

## 23 États d'erreur généraux

### 23.1 API indisponible

Comportement attendu :

- afficher un message clair ;

- conserver les anciennes données si elles existent ;

- permettre de réessayer ;

- ne pas faire planter l'application.

### 23.2 Utilisateur non autorisé

Comportement attendu :

- refuser l'accès ;

- rediriger ou afficher une erreur ;

- ne pas retourner de données privées.

### 23.3 Données vides

Comportement attendu :

- afficher un état vide compréhensible ;

- proposer une action : lier un compte, créer une équipe, utiliser la démo.

### 23.4 Erreur formulaire

Comportement attendu :

- afficher les champs invalides ;

- conserver les données déjà saisies si possible ;

- permettre une correction rapide.

## 24 Critères d'acceptation globaux du MVP

Le MVP est considéré comme fonctionnel si :

- un utilisateur peut créer un compte ;

- un utilisateur peut se connecter ;

- un utilisateur peut se déconnecter ;

- un utilisateur peut consulter son dashboard ;

- un utilisateur peut voir ses statistiques principales ;

- un score est calculé ;

- un leaderboard solo est visible ;

- une saison active existe ;

- un utilisateur peut créer une équipe ;

- un utilisateur peut rejoindre une équipe ;

- une équipe affiche ses statistiques ;

- un leaderboard d'équipe est disponible ou préparé ;

- les membres d'une équipe peuvent utiliser un chat ;

- les routes privées sont protégées ;

- l'application est responsive ;

- la PWA est installable ;

- un mode démo permet de présenter le projet sans API externe.

## 25 Conclusion

Les spécifications fonctionnelles de Track'N Share définissent une application complète centrée sur la performance gaming, la comparaison et l'expérience d'équipe.

Le coeur fonctionnel du projet repose sur :

- l'authentification ;

- le profil joueur ;

- les statistiques ;

- le score ;

- les leaderboards ;

- les saisons ;

- les équipes ;

- le chat ;

- la PWA ;

- les données de démonstration.

Pour garantir une réalisation réaliste, les fonctionnalités MVP doivent être développées avant les bonus. Les fonctionnalités sociales avancées, les badges, les objectifs, le matchmaking et l'administration complète doivent être ajoutés seulement après stabilisation du socle principal.
