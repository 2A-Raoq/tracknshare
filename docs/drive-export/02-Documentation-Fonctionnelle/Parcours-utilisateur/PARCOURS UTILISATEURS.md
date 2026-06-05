# PARCOURS UTILISATEURS

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document présente les parcours utilisateurs possibles de la plateforme Track'N Share.

Il sert à comprendre comment les différents types d'utilisateurs interagissent avec l'application, depuis leur arrivée sur la landing page jusqu'à la consultation de statistiques, la création d'équipes, l'utilisation du chat, la participation aux leaderboards et l'installation de la PWA.

Les parcours sont organisés par niveau de priorité :

- MVP : indispensable pour la première version démontrable ;

- Bonus : fonctionnalité utile si le temps le permet ;

- Évolution : fonctionnalité avancée à prévoir pour une version future.

## 1 Rappel du projet

Track'N Share est une plateforme web et mobile sous forme de Progressive Web App permettant aux joueurs de suivre, partager et comparer leurs performances sur différents jeux vidéo.

La plateforme permet notamment :

- la création d'un compte utilisateur ;

- la connexion à un profil joueur ;

- la liaison ou simulation d'un compte de jeu ;

- l'affichage de statistiques gaming ;

- le calcul d'un score ;

- la participation à des leaderboards ;

- la création ou l'intégration d'une équipe ;

- la consultation de statistiques d'équipe ;

- l'utilisation d'un chat d'équipe ;

- la gestion de saisons de trois mois ;

- l'installation de l'application en PWA.

## 2 Acteurs du projet

### 2.1 Visiteur non connecté

Le visiteur est une personne qui arrive sur la plateforme sans compte ou sans être connectée.

Il peut :

- consulter la landing page ;

- comprendre le concept du projet ;

- accéder aux pages publiques si elles existent ;

- consulter un profil public ou un leaderboard public si autorisé ;

- créer un compte ;

- se connecter ;

- essayer le mode démo si disponible.

### 2.2 Joueur connecté

Le joueur connecté est l'utilisateur principal de l'application.

Il peut :

- consulter son dashboard ;

- gérer son profil ;

- lier ou simuler un compte de jeu ;

- consulter ses statistiques ;

- rafraîchir ses données ;

- consulter son score ;

- apparaître dans les leaderboards ;

- rejoindre ou créer une équipe ;

- discuter dans un chat d'équipe ;

- consulter les saisons passées ;

- gérer ses paramètres.

### 2.3 Capitaine d'équipe

Le capitaine est le créateur ou responsable d'une équipe.

Il peut :

- modifier les informations de l'équipe ;

- générer ou partager un code d'invitation ;

- gérer les membres ;

- promouvoir un membre en co-capitaine ;

- exclure certains membres ;

- supprimer l'équipe ;

- consulter les statistiques globales de l'équipe ;

- utiliser le chat d'équipe.

### 2.4 Co-capitaine

Le co-capitaine assiste le capitaine dans la gestion de l'équipe.

Il peut :

- inviter des joueurs ;

- gérer certains membres selon les permissions ;

- consulter les statistiques d'équipe ;

- participer au chat.

### 2.5 Membre d'équipe

Le membre appartient à une équipe mais n'a pas les pleins droits de gestion.

Il peut :

- consulter la page de l'équipe ;

- voir les membres ;

- consulter les statistiques collectives ;

- participer au chat ;

- quitter l'équipe.

### 2.6 Administrateur ou modérateur

L'administrateur est un rôle avancé, principalement prévu en bonus ou évolution.

Il peut :

- consulter les signalements ;

- modérer les profils ou messages ;

- désactiver un compte ;

- gérer les jeux disponibles ;

- consulter des logs non sensibles.

### 2.7 Utilisateur de démonstration

L'utilisateur de démonstration est un compte prévu pour la soutenance.

Il permet :

- d'accéder rapidement à un dashboard rempli ;

- de consulter des statistiques réalistes ;

- de visualiser des leaderboards complets ;

- de montrer une équipe existante ;

- de tester le chat d'équipe ;

- de sécuriser la démonstration sans dépendre d'une API externe.

## 3 Parcours principaux du MVP

### 3.1 Parcours 1 — Découverte de la plateforme

Priorité : MVP

Acteur : Visiteur non connecté

Objectif : Comprendre le concept de Track'N Share et accéder aux actions principales.

Préconditions :

- L'utilisateur n'est pas connecté.

- L'application est accessible.

Étapes nominales :

1. Le visiteur arrive sur la landing page.

2. Il lit le slogan et la présentation du projet.

3. Il découvre les fonctionnalités principales : statistiques, leaderboards, équipes, saisons et PWA.

4. Il clique sur un bouton d'action : Créer un compte, Se connecter ou Essayer la démo.

5. Il est redirigé vers la page correspondante.

Variantes :

- Le visiteur consulte un leaderboard public si cette fonctionnalité est activée.

- Le visiteur consulte un profil public partagé.

- Le visiteur installe la PWA avant même de créer un compte si le navigateur le permet.

Cas d'erreur :

- Si l'API est indisponible, la landing page doit rester accessible.

- Si le visiteur tente d'accéder à une page privée, il est redirigé vers la connexion.

Critères d'acceptation :

- La landing page explique clairement le projet.

- Les boutons principaux sont visibles.

- Le visiteur peut accéder à l'inscription ou à la connexion.

- Les pages privées sont protégées.

### 3.2 Parcours 2 — Création de compte

Priorité : MVP

Acteur : Visiteur non connecté

Objectif : Créer un compte joueur.

Préconditions :

- L'utilisateur n'a pas encore de compte.

Étapes nominales :

1. Le visiteur clique sur Créer un compte.

2. Il arrive sur la page d'inscription.

3. Il renseigne son pseudo, son email et son mot de passe.

4. Il valide le formulaire.

5. Le front vérifie les champs obligatoires.

6. Le back vérifie les données reçues.

7. Le mot de passe est hashé.

8. Le compte est créé.

9. L'utilisateur est redirigé vers la connexion ou directement vers le dashboard.

Variantes :

- Une vérification d'email peut être ajoutée en bonus.

- L'utilisateur peut accepter une politique de confidentialité.

Cas d'erreur :

- Email déjà utilisé.

- Pseudo déjà utilisé.

- Mot de passe trop faible.

- Format d'email invalide.

- Erreur serveur.

Critères d'acceptation :

- Un compte peut être créé avec des données valides.

- Le mot de passe n'est jamais stocké en clair.

- Les erreurs sont affichées clairement.

- L'utilisateur ne peut pas créer deux comptes avec le même email.

### 3.3 Parcours 3 — Connexion utilisateur

Priorité : MVP

Acteur : Joueur

Objectif : Accéder à son espace personnel.

Préconditions :

- L'utilisateur possède un compte.

Étapes nominales :

1. L'utilisateur clique sur Se connecter.

2. Il renseigne son email ou pseudo et son mot de passe.

3. Le formulaire est envoyé au back-end.

4. Le back vérifie les identifiants.

5. Une session ou un token sécurisé est généré.

6. L'utilisateur est redirigé vers le dashboard.

Variantes :

- L'utilisateur peut cocher Se souvenir de moi si cette option existe.

- Une double authentification peut être prévue en évolution.

Cas d'erreur :

- Identifiants incorrects.

- Compte inexistant.

- Compte désactivé.

- Trop de tentatives de connexion.

Critères d'acceptation :

- Un utilisateur valide peut se connecter.

- Un utilisateur invalide reçoit une erreur claire.

- Les routes privées deviennent accessibles après connexion.

- Les tentatives abusives peuvent être limitées.

### 3.4 Parcours 4 — Déconnexion utilisateur

Priorité : MVP

Acteur : Joueur connecté

Objectif : Fermer sa session de manière sécurisée.

Préconditions :

- L'utilisateur est connecté.

Étapes nominales :

1. L'utilisateur ouvre le menu utilisateur.

2. Il clique sur Déconnexion.

3. Le front appelle l'endpoint de déconnexion si nécessaire.

4. La session ou le token est invalidé.

5. Le store utilisateur est vidé.

6. Le cache sensible est nettoyé.

7. L'utilisateur est redirigé vers la landing page ou la page login.

Cas d'erreur :

- Si l'API ne répond pas, le front supprime au minimum l'état local de connexion.

Critères d'acceptation :

- L'utilisateur n'a plus accès aux pages privées après déconnexion.

- Les données sensibles ne restent pas visibles.

- Le cache PWA ne permet pas de consulter des données privées après logout.

### 3.5 Parcours 5 — Consultation du dashboard

Priorité : MVP

Acteur : Joueur connecté

Objectif : Voir rapidement ses performances principales.

Préconditions :

- L'utilisateur est connecté.

- L'utilisateur possède des statistiques réelles ou simulées.

Étapes nominales :

1. L'utilisateur se connecte.

2. Il arrive sur le dashboard.

3. Il consulte son score global.

4. Il consulte son K/D ratio.

5. Il consulte son winrate.

6. Il consulte son nombre de parties jouées.

7. Il voit son rang actuel.

8. Il voit la saison en cours.

9. Il accède rapidement aux leaderboards, à son profil ou à son équipe.

Variantes :

- Si l'utilisateur n'a pas encore de stats, le dashboard affiche un état vide avec une action Lier un compte de jeu.

- Si les données sont anciennes, un bouton Rafraîchir les statistiques est proposé.

Cas d'erreur :

- API stats indisponible.

- Données incomplètes.

- Saison non initialisée.

Critères d'acceptation :

- Le dashboard est lisible.

- Les statistiques principales sont affichées.

- Les états vides sont gérés.

- Le dashboard reste utilisable sur mobile.

### 3.6 Parcours 6 — Modification du profil

Priorité : MVP

Acteur : Joueur connecté

Objectif : Personnaliser son profil.

Préconditions :

- L'utilisateur est connecté.

Étapes nominales :

1. L'utilisateur accède à Paramètres ou Profil.

2. Il clique sur Modifier le profil.

3. Il modifie son pseudo, avatar, bannière ou bio.

4. Il enregistre les modifications.

5. Le back vérifie que l'utilisateur modifie bien son propre profil.

6. Les nouvelles informations sont sauvegardées.

7. Le profil est mis à jour.

Variantes :

- L'utilisateur change la visibilité de son profil.

- L'utilisateur choisit de masquer certaines statistiques.

Cas d'erreur :

- Pseudo déjà utilisé.

- Bio trop longue.

- Fichier avatar invalide.

- Utilisateur non autorisé.

Critères d'acceptation :

- L'utilisateur peut modifier ses informations autorisées.

- Il ne peut pas modifier le profil d'un autre utilisateur.

- Les données affichées sont mises à jour.

### 3.7 Parcours 7 — Liaison ou simulation d'un compte de jeu

Priorité : MVP

Acteur : Joueur connecté

Objectif : Permettre la récupération de statistiques.

Préconditions :

- L'utilisateur est connecté.

Étapes nominales :

1. L'utilisateur accède à la page Jeux ou Paramètres.

2. Il choisit une plateforme ou un jeu.

3. Il clique sur Lier un compte ou Utiliser des données de démonstration.

4. Le système récupère ou simule les données du compte.

5. Les statistiques sont sauvegardées en base.

6. L'utilisateur est redirigé vers le dashboard ou la page de statistiques.

Variantes :

- L'utilisateur choisit Steam si l'API est disponible.

- L'utilisateur utilise une API mockée.

- L'utilisateur entre un identifiant externe.

- L'utilisateur ajoute des statistiques manuellement en bonus.

Cas d'erreur :

- API externe indisponible.

- Compte de jeu introuvable.

- Données insuffisantes.

- Token expiré.

Critères d'acceptation :

- L'utilisateur peut associer ou simuler un compte de jeu.

- Les statistiques minimales sont disponibles.

- L'application reste fonctionnelle même sans API externe réelle.

### 3.8 Parcours 8 — Rafraîchissement des statistiques

Priorité : MVP

Acteur : Joueur connecté

Objectif : Mettre à jour les statistiques du joueur.

Préconditions :

- L'utilisateur a lié ou simulé un compte de jeu.

Étapes nominales :

1. L'utilisateur accède au dashboard.

2. Il clique sur Rafraîchir les statistiques.

3. Le back lance une récupération ou simulation des nouvelles statistiques.

4. Les anciennes données sont conservées si nécessaire.

5. Les nouvelles statistiques sont sauvegardées.

6. Le score est recalculé.

7. Le dashboard et les leaderboards sont mis à jour.

Variantes :

- Une tâche planifiée met à jour automatiquement les statistiques.

- L'utilisateur voit la date de dernière synchronisation.

Cas d'erreur :

- API externe indisponible.

- Limite de quota atteinte.

- Données reçues invalides.

Critères d'acceptation :

- Le rafraîchissement met à jour les stats.

- Le score est recalculé.

- Une erreur lisible s'affiche en cas d'échec.

- L'utilisateur ne perd pas ses anciennes données.

### 3.9 Parcours 9 — Consultation du leaderboard solo

Priorité : MVP

Acteur : Joueur connecté ou visiteur selon visibilité

Objectif : Comparer les joueurs par score.

Préconditions :

- Des joueurs possèdent des statistiques.

- Une saison est active.

Étapes nominales :

1. L'utilisateur accède à la page Leaderboard.

2. Il sélectionne un jeu.

3. Il sélectionne une saison si le filtre existe.

4. Le système affiche le classement.

5. L'utilisateur voit rang, joueur, score, K/D, winrate et parties jouées.

6. Il peut ouvrir le profil d'un joueur.

Variantes :

- L'utilisateur filtre le classement par amis.

- L'utilisateur consulte un leaderboard global.

- L'utilisateur consulte une ancienne saison.

Cas d'erreur :

- Aucun joueur classé.

- L'utilisateur n'a pas assez de parties pour apparaître.

- Données indisponibles.

Critères d'acceptation :

- Les joueurs sont triés par score.

- Les joueurs avec moins de 10 parties peuvent être exclus.

- Le classement est lisible sur mobile.

### 3.10 Parcours 10 — Création d'une équipe

Priorité : MVP

Acteur : Joueur connecté

Objectif : Créer une équipe et devenir capitaine.

Préconditions :

- L'utilisateur est connecté.

Étapes nominales :

1. L'utilisateur accède à Mes équipes.

2. Il clique sur Créer une équipe.

3. Il renseigne le nom, le tag, la description et éventuellement un avatar.

4. Il valide le formulaire.

5. Le back crée l'équipe.

6. L'utilisateur devient capitaine.

7. Un code d'invitation est généré.

8. L'utilisateur est redirigé vers la page de l'équipe.

Variantes :

- L'utilisateur choisit une équipe publique ou privée.

- L'utilisateur invite directement un ami en bonus.

Cas d'erreur :

- Nom d'équipe déjà utilisé.

- Tag invalide.

- Nombre maximum d'équipes atteint.

- Données invalides.

Critères d'acceptation :

- Une équipe peut être créée.

- Le créateur devient capitaine.

- Un code d'invitation est disponible.

- La page équipe affiche les informations principales.

### 3.11 Parcours 11 — Rejoindre une équipe avec un code

Priorité : MVP

Acteur : Joueur connecté

Objectif : Intégrer une équipe existante.

Préconditions :

- L'utilisateur est connecté.

- Une équipe possède un code d'invitation valide.

Étapes nominales :

1. L'utilisateur accède à Mes équipes.

2. Il clique sur Rejoindre une équipe.

3. Il saisit le code d'invitation.

4. Le back vérifie le code.

5. Le back vérifie que l'utilisateur n'est pas déjà membre.

6. L'utilisateur rejoint l'équipe.

7. Il est redirigé vers la page de l'équipe.

Variantes :

- Pour une équipe privée, l'utilisateur passe en statut Invité en attente de validation.

- Le capitaine valide ensuite l'entrée.

Cas d'erreur :

- Code invalide.

- Code expiré.

- Équipe complète.

- Utilisateur déjà membre.

- Utilisateur bloqué par l'équipe.

Critères d'acceptation :

- Un code valide permet de rejoindre l'équipe.

- Un code invalide affiche une erreur claire.

- Les règles de confidentialité de l'équipe sont respectées.

### 3.12 Parcours 12 — Consultation d'une page équipe

Priorité : MVP

Acteur : Membre d'équipe

Objectif : Voir les informations et performances collectives.

Préconditions :

- L'utilisateur est membre de l'équipe.

Étapes nominales :

1. L'utilisateur accède à Mes équipes.

2. Il sélectionne une équipe.

3. Il consulte le nom, tag, description et avatar de l'équipe.

4. Il consulte les membres.

5. Il voit les rôles des membres.

6. Il consulte les statistiques globales.

7. Il accède au chat d'équipe.

Données affichées :

- score moyen ;

- score total ;

- K/D moyen ;

- winrate moyen ;

- meilleur joueur ;

- position dans le leaderboard ;

- saison active.

Cas d'erreur :

- Utilisateur non membre.

- Équipe supprimée.

- Statistiques indisponibles.

Critères d'acceptation :

- Les membres voient la page équipe.

- Les non-membres ne voient pas les données privées si l'équipe est privée.

- Les statistiques collectives sont correctes.

### 3.13 Parcours 13 — Gestion des membres d'équipe

Priorité : MVP

Acteur : Capitaine ou co-capitaine

Objectif : Gérer les rôles et membres de l'équipe.

Préconditions :

- L'utilisateur est capitaine ou co-capitaine.

Étapes nominales :

1. L'utilisateur ouvre la page équipe.

2. Il accède à la liste des membres.

3. Il sélectionne un membre.

4. Il choisit une action : promouvoir, rétrograder, exclure ou inviter.

5. Le back vérifie ses permissions.

6. L'action est appliquée.

7. La liste des membres est mise à jour.

Variantes :

- Le capitaine régénère le code d'invitation.

- Le capitaine modifie la visibilité de l'équipe.

- Le capitaine accepte ou refuse une demande d'entrée.

Cas d'erreur :

- Un membre tente de faire une action réservée au capitaine.

- Un co-capitaine tente d'exclure le capitaine.

- Le membre ciblé n'existe plus.

Critères d'acceptation :

- Les permissions sont vérifiées côté back-end.

- Les rôles sont respectés.

- Les actions interdites sont bloquées.

### 3.14 Parcours 14 — Chat d'équipe

Priorité : MVP

Acteur : Membre d'équipe

Objectif : Communiquer avec les membres de son équipe en temps réel.

Préconditions :

- L'utilisateur est connecté.

- L'utilisateur est membre de l'équipe.

- Socket.io est disponible.

Étapes nominales :

1. L'utilisateur ouvre la page de son équipe.

2. Il clique sur Chat.

3. Le front rejoint la room Socket.io de l'équipe.

4. L'historique des messages est chargé.

5. L'utilisateur écrit un message.

6. Le message est envoyé au serveur.

7. Le serveur vérifie que l'utilisateur est membre de l'équipe.

8. Le message est sauvegardé.

9. Le message est diffusé aux autres membres connectés.

10. Les membres voient le message en temps réel.

Variantes :

- L'utilisateur supprime son message en bonus.

- Le système affiche un statut lu/non lu en bonus.

- Le système affiche les utilisateurs en ligne en bonus.

Cas d'erreur :

- Utilisateur non membre.

- Message trop long.

- Connexion Socket.io perdue.

- Serveur indisponible.

Critères d'acceptation :

- Les membres peuvent échanger en temps réel.

- Un non-membre ne peut pas accéder au chat.

- L'historique est visible après rechargement.

### 3.15 Parcours 15 — Consultation des saisons

Priorité : MVP

Acteur : Joueur connecté

Objectif : Consulter l'historique des performances par période.

Préconditions :

- Au moins une saison existe.

Étapes nominales :

1. L'utilisateur accède à la page Saisons.

2. Il voit la saison en cours.

3. Il voit les anciennes saisons disponibles.

4. Il sélectionne une saison.

5. Il consulte ses statistiques de cette saison.

6. Il consulte le leaderboard figé de cette saison si disponible.

Variantes :

- L'utilisateur compare deux saisons.

- L'utilisateur consulte l'historique de son équipe.

Cas d'erreur :

- Aucune saison archivée.

- Données de saison incomplètes.

Critères d'acceptation :

- Les saisons sont lisibles.

- Les statistiques anciennes ne sont pas écrasées.

- Les leaderboards archivés restent consultables.

### 3.16 Parcours 16 — Installation de la PWA

Priorité : MVP

Acteur : Visiteur ou joueur connecté

Objectif : Installer Track'N Share comme application.

Préconditions :

- Le navigateur supporte l'installation PWA.

- Le manifest et le service worker sont configurés.

Étapes nominales :

1. L'utilisateur visite le site.

2. Le navigateur détecte la PWA.

3. L'utilisateur clique sur Installer l'application.

4. L'application est ajoutée à l'écran d'accueil ou au système.

5. L'utilisateur ouvre Track'N Share en mode standalone.

6. L'interface reste responsive et utilisable.

Variantes :

- Un prompt d'installation personnalisé est affiché en bonus.

- L'utilisateur installe l'application depuis le menu du navigateur.

Cas d'erreur :

- Navigateur non compatible.

- Manifest invalide.

- Icônes manquantes.

Critères d'acceptation :

- L'application peut être installée.

- Le mode standalone fonctionne.

- L'interface est adaptée au mobile.

## 4 Parcours secondaires et bonus

### 4.1 Parcours 17 — Mot de passe oublié

Priorité : Bonus

Acteur : Visiteur non connecté

Objectif : Récupérer l'accès à son compte.

Étapes nominales :

1. L'utilisateur clique sur Mot de passe oublié.

2. Il renseigne son email.

3. Le système envoie un lien de réinitialisation.

4. L'utilisateur ouvre le lien.

5. Il définit un nouveau mot de passe.

6. Il peut se reconnecter.

Cas d'erreur :

- Email inconnu.

- Lien expiré.

- Nouveau mot de passe trop faible.

Critères d'acceptation :

- La procédure ne révèle pas si un email existe ou non de manière dangereuse.

- Le nouveau mot de passe est hashé.

### 4.2 Parcours 18 — Suppression de compte

Priorité : Bonus / RGPD

Acteur : Joueur connecté

Objectif : Supprimer son compte et ses données personnelles.

Étapes nominales :

1. L'utilisateur accède aux paramètres.

2. Il clique sur Supprimer mon compte.

3. Une confirmation forte est demandée.

4. Le système supprime ou anonymise les données concernées.

5. L'utilisateur est déconnecté.

Variantes :

- Les messages peuvent être anonymisés plutôt que supprimés.

- Les statistiques peuvent être conservées anonymement pour les leaderboards archivés.

Critères d'acceptation :

- L'utilisateur peut demander la suppression de son compte.

- Les données personnelles sont supprimées ou anonymisées.

### 4.3 Parcours 19 — Export des données personnelles

Priorité : Bonus / RGPD

Acteur : Joueur connecté

Objectif : Télécharger une copie de ses données.

Étapes nominales :

1. L'utilisateur accède aux paramètres.

2. Il clique sur Exporter mes données.

3. Le système prépare un fichier contenant ses données principales.

4. L'utilisateur télécharge le fichier.

Données possibles :

- profil ;

- comptes de jeux liés ;

- statistiques ;

- équipes ;

- messages selon politique retenue.

Critères d'acceptation :

- L'utilisateur peut récupérer ses données personnelles dans un format lisible.

### 4.4 Parcours 20 — Consultation d'un profil public

Priorité : Bonus

Acteur : Visiteur ou joueur connecté

Objectif : Voir le profil public d'un joueur.

Étapes nominales :

1. L'utilisateur ouvre une URL du type /players/:username.

2. Le système vérifie la visibilité du profil.

3. Les informations publiques sont affichées.

4. L'utilisateur consulte les stats principales, badges et historique public.

Cas d'erreur :

- Profil privé.

- Joueur inexistant.

- Statistiques masquées.

Critères d'acceptation :

- Les préférences de confidentialité sont respectées.

### 4.5 Parcours 21 — Comparaison joueur contre joueur

Priorité : Bonus réaliste

Acteur : Joueur connecté

Objectif : Comparer deux joueurs côte à côte.

Étapes nominales :

1. L'utilisateur accède à /compare.

2. Il sélectionne un premier joueur.

3. Il sélectionne un deuxième joueur.

4. Il choisit éventuellement un jeu et une saison.

5. Le système affiche un tableau comparatif.

6. L'utilisateur compare score, K/D, winrate, parties et rang.

Variantes :

- Le système affiche un commentaire automatique du type : joueur A domine en K/D, joueur B est plus régulier.

Cas d'erreur :

- Joueur introuvable.

- Pas de statistiques communes.

- Profil privé.

Critères d'acceptation :

- La comparaison est claire et visuelle.

- Les données privées ne sont pas exposées.

### 4.6 Parcours 22 — Ajout d'ami

Priorité : Bonus

Acteur : Joueur connecté

Objectif : Ajouter un autre joueur à sa liste d'amis.

Étapes nominales :

1. L'utilisateur consulte un profil joueur.

2. Il clique sur Ajouter en ami.

3. Une demande d'ami est envoyée.

4. L'autre joueur reçoit une notification.

5. Il accepte ou refuse.

6. Si la demande est acceptée, les deux joueurs deviennent amis.

Cas d'erreur :

- Demande déjà envoyée.

- Utilisateur bloqué.

- Profil introuvable.

Critères d'acceptation :

- Les demandes d'amis ne sont pas dupliquées.

- Un utilisateur bloqué ne peut pas envoyer de demande.

### 4.7 Parcours 23 — Suppression d'ami

Priorité : Bonus

Acteur : Joueur connecté

Objectif : Retirer un joueur de sa liste d'amis.

Étapes nominales :

1. L'utilisateur accède à sa liste d'amis.

2. Il sélectionne un ami.

3. Il clique sur Supprimer.

4. Le système demande confirmation.

5. La relation d'amitié est supprimée.

Critères d'acceptation :

- L'ami disparaît de la liste.

- Les deux côtés de la relation sont mis à jour.

### 4.8 Parcours 24 — Messages privés

Priorité : Bonus

Acteur : Joueur connecté

Objectif : Envoyer un message privé à un autre joueur.

Étapes nominales :

1. L'utilisateur ouvre la page Messages.

2. Il sélectionne un ami ou un joueur autorisé.

3. Il écrit un message.

4. Le message est envoyé.

5. Le destinataire le reçoit en temps réel ou lors de sa prochaine connexion.

6. L'historique de conversation est conservé.

Cas d'erreur :

- Utilisateur bloqué.

- Destinataire introuvable.

- Message trop long.

- Conversation interdite par confidentialité.

Critères d'acceptation :

- Les messages sont accessibles uniquement aux participants.

- Les messages sont traités comme des données sensibles.

### 4.9 Parcours 25 — Notifications internes

Priorité : Bonus

Acteur : Joueur connecté

Objectif : Être informé d'un événement important.

Événements possibles :

- invitation d'équipe ;

- demande d'ami ;

- nouveau message ;

- changement de rang ;

- nouveau badge ;

- fin de saison.

Étapes nominales :

1. Un événement est déclenché.

2. Le système crée une notification.

3. L'utilisateur voit un badge ou une liste de notifications.

4. Il clique sur la notification.

5. Il est redirigé vers la page concernée.

Critères d'acceptation :

- Les notifications sont visibles.

- L'utilisateur peut les marquer comme lues.

### 4.10 Parcours 26 — Badges et achievements

Priorité : Bonus

Acteur : Joueur connecté

Objectif : Débloquer des récompenses selon son activité.

Étapes nominales :

1. L'utilisateur réalise une action : première partie, création d'équipe, série de victoires, etc.

2. Le système vérifie les conditions d'achievement.

3. Un badge est débloqué.

4. L'utilisateur reçoit une notification.

5. Le badge apparaît sur son profil.

Exemples de badges :

- First Blood : première partie enregistrée ;

- Team Founder : première équipe créée ;

- Hot Streak : cinq victoires d'affilée ;

- MVP : meilleur joueur de son équipe ;

- Veteran : cent parties enregistrées.

Critères d'acceptation :

- Un badge est attribué une seule fois.

- Les conditions sont documentées.

### 4.11 Parcours 27 — Objectifs personnels

Priorité : Bonus

Acteur : Joueur connecté

Objectif : Définir et suivre ses propres objectifs.

Étapes nominales :

1. L'utilisateur accède à Objectifs.

2. Il crée un objectif : atteindre 2.0 K/D, dépasser 60 % de winrate, entrer dans le top 100.

3. Le système calcule la progression.

4. L'objectif est affiché sur le dashboard.

5. L'utilisateur voit son avancement.

Critères d'acceptation :

- Un objectif peut être créé, suivi et terminé.

- La progression est compréhensible.

### 4.12 Parcours 28 — Recherche de joueurs, équipes ou jeux

Priorité : Bonus

Acteur : Joueur connecté ou visiteur selon visibilité

Objectif : Trouver rapidement un contenu.

Étapes nominales :

1. L'utilisateur ouvre la recherche.

2. Il saisit un pseudo, nom d'équipe ou jeu.

3. Le système affiche les résultats.

4. L'utilisateur filtre par jeu, rang, équipe ouverte ou statut.

5. Il ouvre le résultat souhaité.

Critères d'acceptation :

- La recherche retourne des résultats pertinents.

- Les profils privés ne révèlent pas d'informations interdites.

### 4.13 Parcours 29 — Matchmaking interne / recommandation

Priorité : Évolution

Acteur : Joueur connecté

Objectif : Trouver des joueurs ou équipes compatibles.

Étapes nominales :

1. L'utilisateur accède à Matchmaking ou Recommandations.

2. Il choisit un jeu.

3. Il renseigne ses préférences : niveau, rôle, langue, disponibilité.

4. Le système recherche des joueurs ou équipes compatibles.

5. L'utilisateur consulte les recommandations.

6. Il envoie une invitation ou une demande de contact.

Critères possibles :

- jeu ;

- niveau ;

- K/D ;

- winrate ;

- rôle préféré ;

- disponibilité ;

- langue ;

- plateforme.

Critères d'acceptation :

- Les recommandations utilisent des critères compréhensibles.

- L'utilisateur peut contacter ou rejoindre une équipe proposée.

### 4.14 Parcours 30 — Génération d'une carte de performance partageable

Priorité : Bonus

Acteur : Joueur connecté

Objectif : Générer un visuel partageable de ses performances.

Étapes nominales :

1. L'utilisateur ouvre son profil ou son dashboard.

2. Il clique sur Partager ma performance.

3. Il choisit une saison ou un jeu.

4. Le système génère une carte visuelle.

5. L'utilisateur peut copier le lien ou exporter l'image.

Données possibles :

- pseudo ;

- saison ;

- top % ;

- K/D ;

- winrate ;

- rang ;

- score.

Critères d'acceptation :

- La carte affiche uniquement des données autorisées.

- Le rendu est visuel et partageable.

### 4.15 Parcours 31 — Consultation des graphiques de progression

Priorité : Bonus réaliste

Acteur : Joueur connecté

Objectif : Visualiser l'évolution des performances.

Étapes nominales :

1. L'utilisateur ouvre le dashboard ou son profil.

2. Il accède à la section Graphiques.

3. Il choisit une statistique : score, K/D, winrate, rang.

4. Il choisit une période ou une saison.

5. Le graphique s'affiche.

Critères d'acceptation :

- Les graphiques sont lisibles.

- Les données correspondent à la période choisie.

- L'affichage fonctionne sur mobile.

### 4.16 Parcours 32 — Quitter une équipe

Priorité : MVP / Bonus selon règles retenues

Acteur : Membre d'équipe

Objectif : Sortir d'une équipe.

Étapes nominales :

1. L'utilisateur ouvre la page équipe.

2. Il clique sur Quitter l'équipe.

3. Le système demande confirmation.

4. L'utilisateur confirme.

5. Il est retiré de la liste des membres.

6. Il perd l'accès au chat privé de l'équipe.

Variantes :

- Si l'utilisateur est capitaine, il doit transférer le rôle ou supprimer l'équipe.

Cas d'erreur :

- Capitaine seul dans l'équipe.

- Équipe inexistante.

Critères d'acceptation :

- Un membre peut quitter une équipe.

- Il ne voit plus les données privées après départ.

### 4.17 Parcours 33 — Suppression d'une équipe

Priorité : Bonus / Administration d'équipe

Acteur : Capitaine

Objectif : Supprimer une équipe.

Étapes nominales :

1. Le capitaine ouvre les paramètres de l'équipe.

2. Il clique sur Supprimer l'équipe.

3. Une confirmation forte est demandée.

4. Le back vérifie que l'utilisateur est capitaine.

5. L'équipe est supprimée ou archivée.

6. Les membres perdent l'accès au chat.

Critères d'acceptation :

- Seul le capitaine peut supprimer l'équipe.

- Les données historiques utiles peuvent être archivées.

### 4.18 Parcours 34 — Consultation du leaderboard d'équipe

Priorité : MVP / Bonus selon planning

Acteur : Joueur connecté

Objectif : Comparer les équipes entre elles.

Étapes nominales :

1. L'utilisateur accède au leaderboard d'équipe.

2. Il sélectionne un jeu et une saison.

3. Le système affiche les équipes classées.

4. L'utilisateur voit score moyen, K/D moyen, winrate, membres et rang.

5. Il peut ouvrir la page publique ou privée d'une équipe selon visibilité.

Critères d'acceptation :

- Les équipes sont classées correctement.

- Les équipes privées ne révèlent pas d'informations interdites.

## 5 Parcours sécurité, confidentialité et modération

### 5.1 Parcours 35 — Blocage d'un utilisateur

Priorité : Bonus

Acteur : Joueur connecté

Objectif : Empêcher un utilisateur d'interagir avec soi.

Étapes nominales :

1. L'utilisateur ouvre le profil d'un autre joueur.

2. Il clique sur Bloquer.

3. Il confirme l'action.

4. Le joueur bloqué ne peut plus envoyer de message privé ni demande d'ami.

5. Les interactions sont limitées selon les règles définies.

Critères d'acceptation :

- Un utilisateur bloqué ne peut plus contacter l'utilisateur qui l'a bloqué.

### 5.2 Parcours 36 — Signalement d'un profil ou message

Priorité : Bonus / Modération

Acteur : Joueur connecté

Objectif : Signaler un contenu problématique.

Étapes nominales :

1. L'utilisateur clique sur Signaler un profil ou un message.

2. Il choisit une raison : spam, insulte, contenu inapproprié, triche présumée.

3. Il ajoute éventuellement un commentaire.

4. Le signalement est envoyé.

5. Un modérateur peut le consulter.

Critères d'acceptation :

- Le signalement est enregistré.

- Les données nécessaires au traitement sont disponibles.

### 5.3 Parcours 37 — Modération d'un signalement

Priorité : Évolution

Acteur : Administrateur / modérateur

Objectif : Traiter les signalements.

Étapes nominales :

1. Le modérateur accède à l'espace admin.

2. Il consulte les signalements ouverts.

3. Il ouvre un signalement.

4. Il consulte le contexte nécessaire.

5. Il choisit une action : ignorer, avertir, masquer, supprimer, bannir.

6. Le statut du signalement est mis à jour.

Critères d'acceptation :

- Seuls les administrateurs peuvent accéder à cet espace.

- Les actions sont tracées sans exposer de données sensibles inutilement.

### 5.4 Parcours 38 — Profil privé ou statistiques masquées

Priorité : Bonus / Confidentialité

Acteur : Joueur connecté

Objectif : Contrôler la visibilité de ses données.

Étapes nominales :

1. L'utilisateur ouvre les paramètres de confidentialité.

2. Il choisit profil public ou privé.

3. Il choisit quelles statistiques sont visibles.

4. Il sauvegarde.

5. Le système applique les règles sur les profils, recherche et comparaisons.

Critères d'acceptation :

- Les préférences de confidentialité sont respectées partout.

- Les pages publiques ne contiennent pas de données masquées.

## 6 Parcours PWA et hors-ligne

### 6.1 Parcours 39 — Consultation en connexion instable

Priorité : Bonus PWA

Acteur : Joueur connecté

Objectif : Maintenir une expérience minimale si le réseau est instable.

Étapes nominales :

1. L'utilisateur ouvre l'application en connexion instable.

2. Les assets déjà chargés restent disponibles.

3. Les données sensibles sont demandées au réseau en priorité.

4. Si le réseau échoue, une erreur claire ou une page offline est affichée.

Critères d'acceptation :

- L'application ne plante pas.

- Les données sensibles ne sont pas exposées hors ligne sans protection.

### 6.2 Parcours 40 — Page offline

Priorité : Bonus PWA

Acteur : Utilisateur PWA

Objectif : Afficher une page utile si l'utilisateur est hors ligne.

Étapes nominales :

1. L'utilisateur ouvre l'application sans connexion.

2. Le service worker intercepte la requête.

3. Une page offline est affichée.

4. L'utilisateur comprend que certaines données ne sont pas disponibles.

Critères d'acceptation :

- Une page offline claire existe.

- Les pages privées ne sont pas exposées si l'utilisateur est déconnecté.

## 7 Parcours de démonstration

### 7.1 Parcours 41 — Utilisation du mode démo

Priorité : MVP pour soutenance

Acteur : Visiteur ou jury

Objectif : Montrer rapidement l'application avec des données remplies.

Préconditions :

- Des données seedées existent.

- Un compte démo est disponible.

Étapes nominales :

1. Le visiteur arrive sur la landing page.

2. Il clique sur Essayer la démo.

3. Le système connecte un compte démo ou affiche un parcours guidé.

4. Le dashboard affiche des statistiques réalistes.

5. Le visiteur consulte un leaderboard rempli.

6. Il ouvre une équipe existante.

7. Il consulte le chat d'équipe.

8. Il consulte une ancienne saison.

9. Il observe l'interface mobile/PWA.

Critères d'acceptation :

- La démo fonctionne sans API externe.

- Les données sont réalistes.

- Le parcours est fluide et compréhensible.

### 7.2 Parcours 42 — Scénario complet de soutenance

Priorité : MVP pour soutenance

Acteur : Équipe projet

Objectif : Présenter les fonctionnalités principales dans un ordre logique.

Étapes recommandées :

1. Présenter la landing page.

2. Se connecter avec un compte démo.

3. Afficher le dashboard.

4. Montrer les statistiques joueur.

5. Expliquer le calcul du score.

6. Ouvrir le leaderboard solo.

7. Comparer deux joueurs si la fonctionnalité existe.

8. Ouvrir une équipe.

9. Montrer les statistiques d'équipe.

10. Montrer le chat en temps réel.

11. Ouvrir les archives de saison.

12. Montrer le responsive mobile.

13. Montrer l'installation PWA ou le mode standalone.

14. Conclure sur la sécurité, les risques et les évolutions futures.

Critères d'acceptation :

- Le scénario dure un temps maîtrisé.

- Aucun écran critique n'est vide.

- Les fonctionnalités MVP sont démontrées clairement.

## 8 Parcours d'erreur importants

### 8.1 Parcours 43 — API externe indisponible

Priorité : MVP

Acteur : Joueur connecté

Objectif : Gérer proprement l'échec de récupération de statistiques.

Étapes :

1. L'utilisateur tente de synchroniser ses statistiques.

2. L'API externe ne répond pas.

3. Le back retourne une erreur contrôlée.

4. Le front affiche un message clair.

5. Les anciennes statistiques restent visibles.

6. L'utilisateur peut réessayer plus tard ou utiliser des données mockées.

Critères d'acceptation :

- L'application ne plante pas.

- Les anciennes données ne sont pas perdues.

- Un fallback existe pour la démonstration.

### 8.2 Parcours 44 — Utilisateur non autorisé

Priorité : MVP

Acteur : Utilisateur connecté ou non connecté

Objectif : Bloquer l'accès à une ressource privée.

Étapes :

1. L'utilisateur tente d'accéder à une page ou ressource interdite.

2. Le back vérifie les permissions.

3. L'accès est refusé.

4. Le front affiche une erreur ou redirige.

Exemples :

- accéder au chat d'une équipe dont on n'est pas membre ;

- modifier le profil d'un autre joueur ;

- exclure un capitaine sans permission ;

- consulter des messages privés d'autrui.

Critères d'acceptation :

- Les contrôles sont faits côté back-end.

- L'utilisateur ne reçoit pas de données privées.

### 8.3 Parcours 45 — Données vides ou première utilisation

Priorité : MVP

Acteur : Nouveau joueur connecté

Objectif : Accompagner un utilisateur qui n'a pas encore de données.

Étapes :

1. Le joueur se connecte pour la première fois.

2. Le dashboard ne trouve aucune statistique.

3. L'interface affiche un état vide clair.

4. Une action principale est proposée : lier un compte de jeu ou utiliser la démo.

5. Après liaison ou simulation, les données apparaissent.

Critères d'acceptation :

- L'utilisateur comprend quoi faire.

- Aucun écran ne semble cassé.

### 8.4 Parcours 46 — Connexion expirée

Priorité : MVP

Acteur : Joueur connecté

Objectif : Gérer l'expiration de session.

Étapes :

1. L'utilisateur revient sur l'application après un délai.

2. Sa session est expirée.

3. Une requête privée échoue avec un statut non autorisé.

4. Le front vide l'état utilisateur.

5. L'utilisateur est redirigé vers la connexion.

6. Après reconnexion, il peut continuer.

Critères d'acceptation :

- L'expiration est gérée proprement.

- Les données privées ne restent pas accessibles.

## 9 Priorisation globale des parcours

### 9.1 Parcours indispensables MVP

Les parcours suivants sont à développer en priorité :

- découverte de la plateforme ;

- création de compte ;

- connexion ;

- déconnexion ;

- consultation du dashboard ;

- modification du profil ;

- liaison ou simulation d'un compte de jeu ;

- rafraîchissement des statistiques ;

- consultation du leaderboard solo ;

- création d'équipe ;

- rejoindre une équipe avec un code ;

- consultation d'une page équipe ;

- gestion minimale des membres ;

- chat d'équipe ;

- consultation des saisons ;

- installation PWA ;

- mode démo ;

- gestion des erreurs API ;

- gestion des accès non autorisés ;

- état vide première utilisation.

### 9.2 Parcours bonus réalistes

Les parcours suivants sont intéressants après stabilisation du MVP :

- mot de passe oublié ;

- suppression de compte ;

- profil public ;

- comparaison joueur contre joueur ;

- amis ;

- messages privés ;

- notifications ;

- badges ;

- objectifs personnels ;

- recherche ;

- graphiques de progression ;

- leaderboard d'équipe avancé ;

- page offline.

### 9.3 Parcours évolutions futures

Les parcours suivants peuvent être présentés comme évolutions :

- matchmaking interne ;

- cartes de performance exportables ;

- modération complète ;

- espace administrateur ;

- export complet des données ;

- chiffrement de bout en bout ;

- notifications push PWA ;

- tournois ;

- feed social complet.

## 10 Tableau récapitulatif des parcours

| ID | Parcours | Acteur principal | Priorité |

|---|---|---|---|

| P01 | Découverte de la plateforme | Visiteur | MVP |

| P02 | Création de compte | Visiteur | MVP |

| P03 | Connexion | Joueur | MVP |

| P04 | Déconnexion | Joueur | MVP |

| P05 | Consultation dashboard | Joueur | MVP |

| P06 | Modification profil | Joueur | MVP |

| P07 | Liaison ou simulation compte jeu | Joueur | MVP |

| P08 | Rafraîchissement statistiques | Joueur | MVP |

| P09 | Leaderboard solo | Joueur | MVP |

| P10 | Création équipe | Joueur | MVP |

| P11 | Rejoindre équipe par code | Joueur | MVP |

| P12 | Page équipe | Membre | MVP |

| P13 | Gestion membres équipe | Capitaine | MVP |

| P14 | Chat équipe | Membre | MVP |

| P15 | Saisons | Joueur | MVP |

| P16 | Installation PWA | Utilisateur | MVP |

| P17 | Mot de passe oublié | Visiteur | Bonus |

| P18 | Suppression compte | Joueur | Bonus |

| P19 | Export données | Joueur | Bonus |

| P20 | Profil public | Visiteur/Joueur | Bonus |

| P21 | Comparaison joueur vs joueur | Joueur | Bonus |

| P22 | Ajout ami | Joueur | Bonus |

| P23 | Suppression ami | Joueur | Bonus |

| P24 | Messages privés | Joueur | Bonus |

| P25 | Notifications internes | Joueur | Bonus |

| P26 | Badges et achievements | Joueur | Bonus |

| P27 | Objectifs personnels | Joueur | Bonus |

| P28 | Recherche | Joueur | Bonus |

| P29 | Matchmaking interne | Joueur | Évolution |

| P30 | Carte de performance | Joueur | Bonus |

| P31 | Graphiques de progression | Joueur | Bonus |

| P32 | Quitter équipe | Membre | MVP/Bonus |

| P33 | Supprimer équipe | Capitaine | Bonus |

| P34 | Leaderboard équipe | Joueur | MVP/Bonus |

| P35 | Blocage utilisateur | Joueur | Bonus |

| P36 | Signalement | Joueur | Bonus |

| P37 | Modération signalement | Admin | Évolution |

| P38 | Confidentialité profil | Joueur | Bonus |

| P39 | Connexion instable | Utilisateur | Bonus |

| P40 | Page offline | Utilisateur | Bonus |

| P41 | Mode démo | Visiteur/Jury | MVP |

| P42 | Scénario soutenance | Équipe projet | MVP |

| P43 | API externe indisponible | Joueur | MVP |

| P44 | Utilisateur non autorisé | Utilisateur | MVP |

| P45 | Première utilisation sans données | Joueur | MVP |

| P46 | Connexion expirée | Joueur | MVP |

## 11 Conclusion

Les parcours utilisateurs de Track'N Share couvrent trois grands axes :

1. Le suivi individuel des performances : inscription, connexion, profil, statistiques, score et leaderboards.

2. L'expérience collective : équipes, rôles, invitations, statistiques d'équipe et chat.

3. L'expérience produit complète : PWA, saisons, sécurité, confidentialité, démo et évolutions sociales.

Pour garantir un projet réaliste, les parcours MVP doivent être développés avant les parcours bonus. Les fonctionnalités avancées comme le matchmaking, la modération complète, les tournois ou le chiffrement de bout en bout peuvent être présentées comme évolutions futures.

La priorité est de livrer une expérience simple, cohérente et démontrable : un joueur crée un compte, consulte ses statistiques, voit son score, apparaît dans un leaderboard, rejoint ou crée une équipe, discute avec son équipe et consulte son historique par saison.
