# RISQUES ET SOLUTIONS

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Rôles principaux :

- Chef de projet : Ioanes

- Chef front-end : Clément

- Chef back-end : Ioanes

- Chef mobile / PWA : Clément

Objectif du document

Ce document recense les principaux risques liés au projet Track'N Share et propose, pour chacun, des solutions concrètes afin de limiter leur probabilité ou leur impact.

Track'N Share est une plateforme web et mobile sous forme de PWA permettant aux joueurs de suivre, partager et comparer leurs performances gaming. Le projet implique plusieurs dimensions sensibles : récupération de données via APIs externes, stockage en base, authentification, statistiques, leaderboards, équipes, chat en temps réel, PWA et sécurité des données utilisateurs.

L'objectif de ce document est donc de prévoir les difficultés possibles avant le développement, d'anticiper les blocages et de sécuriser la réalisation du MVP.

## 1 Méthode d'analyse des risques

Chaque risque est analysé selon quatre critères :

- Catégorie : domaine concerné par le risque.

- Description : explication du problème possible.

- Impact : conséquence sur le projet si le risque se produit.

- Probabilité : faible, moyenne ou élevée.

- Solution : actions prévues pour limiter ou corriger le risque.

Échelle utilisée :

Probabilité :

- Faible : le risque est peu probable.

- Moyenne : le risque peut arriver si aucune attention particulière n'est portée.

- Élevée : le risque a de fortes chances de se produire.

Impact :

- Faible : gêne limitée, sans remise en cause du projet.

- Moyen : ralentissement ou modification nécessaire.

- Élevé : risque de blocage important ou de fonctionnalité non livrable.

## 2 Synthèse des risques principaux

Les risques les plus importants du projet sont :

1. Complexité ou indisponibilité des APIs externes de jeux.

2. Périmètre fonctionnel trop large.

3. Mauvais choix ou mauvaise structuration de la base de données.

4. Sécurité insuffisante sur les comptes, tokens et messages.

5. PWA pensée trop tard dans le développement.

6. Fonctionnalités temps réel plus complexes que prévu.

7. Démonstration finale avec trop peu de données.

8. Mauvaise répartition du travail entre les deux développeurs.

9. Retard sur le MVP à cause des fonctionnalités bonus.

10. Risques liés à la confidentialité et au RGPD.

## 3 Risques liés aux APIs externes

### 3.1 API Steam, Epic Games ou jeux indisponible

Catégorie : Technique / APIs externes

Probabilité : Élevée

Impact : Élevé

Description :

Le projet prévoit de récupérer des statistiques depuis Steam, Epic Games ou des APIs spécifiques à certains jeux. Ces APIs peuvent être limitées, difficiles à utiliser, indisponibles, mal documentées ou nécessiter des autorisations particulières.

Impact possible :

- Impossible de récupérer les statistiques réelles.

- Dashboard vide.

- Leaderboards impossibles à alimenter.

- Démonstration finale fragilisée.

- Retard important sur le développement.

Solutions :

- Prévoir dès le début une API mockée.

- Créer des données seedées pour les joueurs, équipes, jeux et saisons.

- Ne commencer qu'avec une seule API réelle si elle est simple à exploiter.

- Prévoir un fallback en cas d'échec de l'API externe.

- Ne pas dépendre uniquement d'une API externe pour la soutenance.

- Documenter clairement que l'API mockée sert à sécuriser le MVP.

Solution prioritaire :

Mettre en place une route back-end du type GET /mock/game-stats/:userId retournant des statistiques fictives mais réalistes.

### 3.2 Limites de quota ou restrictions d'API

Catégorie : Technique / APIs externes

Probabilité : Moyenne

Impact : Moyen à élevé

Description :

Certaines APIs imposent des quotas, des limites de fréquence ou des restrictions d'accès. Une synchronisation trop fréquente des statistiques peut entraîner un blocage temporaire.

Impact possible :

- Synchronisation impossible.

- Stats non mises à jour.

- Expérience utilisateur dégradée.

- Risque d'erreurs visibles pendant la démonstration.

Solutions :

- Mettre en cache les résultats déjà récupérés.

- Limiter la fréquence de synchronisation.

- Ajouter une synchronisation manuelle côté utilisateur.

- Prévoir des tâches planifiées côté back-end.

- Afficher clairement la date de dernière synchronisation.

- Gérer proprement les erreurs API.

### 3.3 Données externes incomplètes ou incohérentes

Catégorie : Données / APIs externes

Probabilité : Moyenne

Impact : Moyen

Description :

Les APIs peuvent ne pas fournir toutes les statistiques nécessaires au calcul du score : kills, deaths, victoires, défaites, temps de jeu ou historique de matchs.

Impact possible :

- Calcul de score impossible ou approximatif.

- Comparaisons moins fiables.

- Leaderboards incomplets.

Solutions :

- Définir un modèle de statistiques minimal.

- Adapter la formule de score aux données réellement disponibles.

- Prévoir des valeurs par défaut lorsque certaines données manquent.

- Indiquer dans l'interface si certaines statistiques sont indisponibles.

- Utiliser des données simulées complètes pour la démonstration.

## 4 Risques liés au périmètre du projet

### 4.1 Projet trop ambitieux

Catégorie : Gestion de projet / Scope

Probabilité : Élevée

Impact : Élevé

Description :

Track'N Share contient beaucoup de fonctionnalités : profils, équipes, leaderboards, chat, messages privés, amis, badges, matchmaking, notifications, PWA, sécurité, modération, graphiques et plus encore. Vouloir tout développer dès le début peut empêcher de terminer le MVP.

Impact possible :

- MVP incomplet.

- Fonctionnalités principales non terminées.

- Code instable.

- Retard important.

- Démonstration confuse.

Solutions :

- Séparer clairement MVP, bonus réalistes et évolutions futures.

- Prioriser les fonctionnalités indispensables.

- Commencer par auth, profil, stats, score, leaderboards, équipes, saisons, chat et PWA.

- Ajouter les bonus seulement après validation du MVP.

- Tenir une roadmap simple par phases.

- Faire des points réguliers sur l'avancement.

Décision recommandée :

Toutes les fonctionnalités sociales avancées doivent rester en bonus tant que le MVP n'est pas terminé.

### 4.2 Fonctionnalités bonus développées trop tôt

Catégorie : Gestion de projet / Priorisation

Probabilité : Moyenne

Impact : Moyen à élevé

Description :

Des fonctionnalités comme les badges, tournois, feed social, matchmaking avancé ou notifications push peuvent être attirantes, mais elles risquent de prendre du temps au détriment du coeur du projet.

Impact possible :

- Retard sur les fonctions essentielles.

- MVP moins stable.

- Effort dispersé.

- Démonstration moins claire.

Solutions :

- Bloquer les bonus jusqu'à la fin des modules prioritaires.

- Créer une liste de bonus classés par importance.

- Ajouter seulement les bonus visuels ou simples si le planning le permet.

- Garder les bonus avancés pour les évolutions futures.

## 5 Risques liés à la base de données

### 5.1 Redis-JSON mal adapté comme base principale

Catégorie : Architecture / Base de données

Probabilité : Moyenne

Impact : Élevé

Description :

Redis-JSON peut fonctionner pour stocker des documents, mais le projet contient beaucoup de relations : utilisateurs, équipes, membres, invitations, amis, messages, saisons, statistiques et leaderboards. Une base relationnelle comme PostgreSQL est plus naturelle pour ce type de données.

Impact possible :

- Données difficiles à organiser.

- Requêtes complexes.

- Risque de duplication.

- Maintenance compliquée.

- Difficultés pour gérer les relations entre entités.

Solutions :

- Utiliser PostgreSQL pour les données principales si possible.

- Utiliser Redis pour le cache, les sessions, les leaderboards rapides, Socket.io et les données temporaires.

- Si Redis-JSON est imposé, définir une convention stricte de clés.

- Documenter le modèle de données avant développement.

- Prévoir des fonctions de lecture/écriture centralisées.

Recommandation :

Architecture idéale : PostgreSQL pour les données principales, Redis pour le cache et le temps réel.

### 5.2 Mauvaise structuration des clés Redis

Catégorie : Base de données / Maintenabilité

Probabilité : Moyenne

Impact : Moyen

Description :

Si Redis-JSON est utilisé sans convention de nommage, les données peuvent vite devenir difficiles à retrouver ou maintenir.

Impact possible :

- Bugs difficiles à comprendre.

- Données orphelines.

- Suppression ou mise à jour compliquée.

- Risque de conflit entre clés.

Solutions :

- Définir une convention de clés avant le développement.

- Utiliser des préfixes explicites : user:{id}, team:{id}, stats:{userId}:{gameId}:{seasonId}.

- Documenter chaque type de clé.

- Prévoir une stratégie d'expiration pour les données temporaires.

- Ne pas stocker de secrets en clair.

### 5.3 Perte ou incohérence des statistiques

Catégorie : Données / Fiabilité

Probabilité : Moyenne

Impact : Élevé

Description :

Les statistiques sont au coeur du projet. Une mauvaise synchronisation ou une perte de données peut rendre les classements faux.

Impact possible :

- Leaderboards incorrects.

- Historique de saison incomplet.

- Perte de confiance des utilisateurs.

- Démonstration moins crédible.

Solutions :

- Sauvegarder les statistiques par saison.

- Archiver les classements à la fin de chaque saison.

- Garder une date de récupération des données.

- Éviter d'écraser les anciennes statistiques sans sauvegarde.

- Ajouter des données seedées pour pouvoir tester la cohérence.

## 6 Risques liés à la sécurité

### 6.1 Mauvaise gestion des mots de passe

Catégorie : Sécurité / Authentification

Probabilité : Faible à moyenne

Impact : Élevé

Description :

Les mots de passe utilisateurs sont des données très sensibles. Une mauvaise gestion peut entraîner une faille majeure.

Impact possible :

- Fuite de comptes utilisateurs.

- Perte de crédibilité du projet.

- Non-respect des bonnes pratiques de sécurité.

Solutions :

- Ne jamais stocker les mots de passe en clair.

- Utiliser Argon2 ou bcrypt.

- Ne jamais logger les mots de passe.

- Ne jamais renvoyer le hash côté front.

- Ajouter une validation forte des DTO côté back-end.

### 6.2 Stockage non sécurisé des tokens

Catégorie : Sécurité / APIs externes

Probabilité : Moyenne

Impact : Élevé

Description :

Si des tokens Steam, Epic Games ou autres sont stockés, ils ne doivent pas être exposés côté front ni stockés en clair.

Impact possible :

- Vol de tokens.

- Accès non autorisé à des comptes liés.

- Fuite de données externes.

Solutions :

- Chiffrer les tokens en base.

- Stocker uniquement les informations nécessaires.

- Ne jamais exposer les tokens dans le front-end.

- Ne jamais écrire les tokens dans les logs.

- Prévoir l'expiration et la révocation.

- Utiliser des variables d'environnement pour les clés de chiffrement.

### 6.3 XSS ou injection côté front-end

Catégorie : Sécurité front-end

Probabilité : Moyenne

Impact : Moyen à élevé

Description :

L'application affichera des pseudos, bios, messages et noms d'équipes. Ces contenus peuvent être utilisés pour injecter du code malveillant si l'affichage n'est pas sécurisé.

Impact possible :

- Exécution de scripts malveillants.

- Vol de session.

- Altération de l'interface.

- Faille de sécurité visible.

Solutions :

- Échapper les contenus utilisateurs.

- Éviter l'injection HTML directe.

- Ne pas utiliser dangereusement innerHTML.

- Valider les champs côté back-end.

- Ajouter une Content Security Policy si possible.

### 6.4 Permissions insuffisamment vérifiées

Catégorie : Sécurité / Autorisation

Probabilité : Moyenne

Impact : Élevé

Description :

Le front-end peut masquer certains boutons, mais la sécurité réelle doit être assurée côté back-end. Un utilisateur ne doit pas pouvoir modifier les données d'un autre, accéder à un chat privé ou exclure un capitaine sans autorisation.

Impact possible :

- Modification non autorisée de profils.

- Accès à des messages privés.

- Gestion abusive des équipes.

- Suppression ou modification de données critiques.

Solutions :

- Mettre en place des guards NestJS.

- Vérifier les permissions dans chaque service sensible.

- Appliquer une gestion stricte des rôles.

- Tester les cas d'accès interdits.

- Ne jamais se limiter aux vérifications côté front-end.

### 6.5 Logs contenant des données sensibles

Catégorie : Sécurité / Monitoring

Probabilité : Moyenne

Impact : Moyen à élevé

Description :

Les logs peuvent contenir accidentellement des emails, mots de passe, tokens ou messages privés.

Impact possible :

- Fuite de données sensibles.

- Non-respect des bonnes pratiques.

- Difficulté à nettoyer les environnements.

Solutions :

- Ne pas logger les mots de passe, tokens ou contenus de messages privés.

- Logger uniquement les erreurs techniques, statuts HTTP, dates, endpoints et identifiants internes non sensibles.

- Prévoir une politique simple de logs.

- Vérifier les logs avant démonstration.

## 7 Risques liés à la confidentialité et au RGPD

### 7.1 Données personnelles mal protégées

Catégorie : Confidentialité / RGPD

Probabilité : Moyenne

Impact : Élevé

Description :

Le projet manipule des emails, pseudos, avatars, comptes de jeux, messages, amis, équipes et statistiques. Même pour un projet étudiant, ces données doivent être traitées correctement.

Impact possible :

- Non-respect des principes de protection des données.

- Mauvaise image du projet.

- Risque de fuite d'informations privées.

Solutions :

- Prévoir une politique de confidentialité simple.

- Permettre la suppression du compte.

- Permettre la modification des informations personnelles.

- Ajouter des paramètres de visibilité du profil.

- Masquer certaines statistiques si l'utilisateur le souhaite.

- Ne stocker que les données nécessaires au fonctionnement du projet.

### 7.2 Messages privés ou chats stockés en clair

Catégorie : Confidentialité / Messagerie

Probabilité : Moyenne

Impact : Élevé

Description :

Les messages privés et chats d'équipe peuvent contenir des informations personnelles. Les stocker en clair augmente le risque en cas de fuite de base.

Impact possible :

- Exposition de conversations.

- Perte de confiance des utilisateurs.

- Mauvaise prise en compte de la confidentialité.

Solutions :

- Chiffrer les messages en base si possible.

- Utiliser un chiffrement applicatif côté serveur avec AES-GCM.

- Stocker la clé de chiffrement dans les variables d'environnement.

- Utiliser un IV unique par message.

- Présenter le chiffrement de bout en bout comme évolution future.

## 8 Risques liés à la PWA

### 8.1 PWA pensée trop tard

Catégorie : Front-end / PWA

Probabilité : Moyenne

Impact : Moyen

Description :

Si la PWA est ajoutée seulement à la fin du projet, elle risque d'être incomplète ou mal intégrée.

Impact possible :

- Installation impossible ou instable.

- Service worker mal configuré.

- Interface mobile peu adaptée.

- Démonstration mobile peu convaincante.

Solutions :

- Prévoir la PWA dès l'initialisation.

- Ajouter rapidement le manifest.

- Préparer les icônes nécessaires.

- Penser mobile-first dès les premières pages.

- Ajouter une page offline simple.

- Tester régulièrement sur mobile ou navigateur compatible.

### 8.2 Cache PWA contenant des données sensibles

Catégorie : Sécurité / PWA

Probabilité : Moyenne

Impact : Élevé

Description :

La PWA peut mettre en cache des ressources pour améliorer les performances. Si elle cache des données sensibles, celles-ci peuvent rester accessibles après déconnexion ou hors ligne.

Impact possible :

- Accès non autorisé à des données privées.

- Messages ou statistiques visibles après déconnexion.

- Risque de confidentialité.

Solutions :

- Ne pas mettre en cache les messages privés en clair.

- Utiliser une stratégie network first pour les données utilisateur.

- Invalider le cache lors de la déconnexion.

- Limiter le mode offline aux pages non sensibles.

- Tester les scénarios de déconnexion.

## 9 Risques liés au temps réel

### 9.1 Chat Socket.io plus complexe que prévu

Catégorie : Temps réel / Back-end

Probabilité : Moyenne

Impact : Moyen à élevé

Description :

Le chat d'équipe et les messages privés nécessitent une gestion des rooms, permissions, événements, reconnexions et historique.

Impact possible :

- Messages non reçus.

- Utilisateurs dans de mauvaises rooms.

- Accès non autorisé à un chat.

- Retard sur le développement.

Solutions :

- Commencer par un chat d'équipe simple.

- Utiliser une room par équipe.

- Vérifier côté serveur que l'utilisateur est membre de l'équipe.

- Stocker les messages en base.

- Ajouter les messages privés seulement en bonus.

- Tester les cas de connexion, déconnexion et refresh.

### 9.2 Notifications temps réel trop ambitieuses

Catégorie : Temps réel / Fonctionnalités bonus

Probabilité : Moyenne

Impact : Moyen

Description :

Les notifications temps réel peuvent concerner les invitations, messages, records, badges et changements de rang. Cela peut vite devenir complexe.

Impact possible :

- Retard sur le MVP.

- Nombreux bugs d'état.

- Interface surchargée.

Solutions :

- Garder les notifications en bonus.

- Commencer par les notifications simples liées au chat ou aux invitations.

- Prévoir une table ou collection Notification seulement si nécessaire.

- Ne pas intégrer les notifications push avant stabilisation du MVP.

## 10 Risques liés au système de score et aux leaderboards

### 10.1 Score déséquilibré ou injuste

Catégorie : Métier / Game design

Probabilité : Moyenne

Impact : Moyen

Description :

Un score basé uniquement sur le K/D ou le winrate peut favoriser les joueurs qui ont fait très peu de parties mais avec de bons résultats.

Impact possible :

- Leaderboard peu crédible.

- Classement injuste.

- Mauvaise expérience utilisateur.

Solutions :

- Ajouter un nombre minimum de parties pour être classé.

- Inclure l'activité dans la formule.

- Documenter la formule de score.

- Tester la formule avec des données fictives.

- Ajuster les coefficients si nécessaire.

Règle recommandée :

Un joueur doit avoir joué au moins 10 parties sur la saison pour apparaître dans le leaderboard.

### 10.2 Leaderboards trop lourds à calculer

Catégorie : Performance / Données

Probabilité : Moyenne

Impact : Moyen

Description :

Les leaderboards peuvent devenir coûteux à recalculer si beaucoup de joueurs, jeux et saisons sont présents.

Impact possible :

- Temps de réponse élevé.

- Dashboard lent.

- Expérience utilisateur dégradée.

Solutions :

- Recalculer les scores lors de la synchronisation des statistiques.

- Mettre en cache les leaderboards.

- Utiliser Redis pour les classements rapides si possible.

- Paginer les résultats.

- Limiter le nombre d'entrées affichées par défaut.

## 11 Risques liés aux équipes

### 11.1 Mauvaise gestion des rôles d'équipe

Catégorie : Fonctionnel / Autorisations

Probabilité : Moyenne

Impact : Moyen à élevé

Description :

Les équipes nécessitent des rôles : capitaine, co-capitaine, membre, invité. Une mauvaise gestion peut permettre des actions non autorisées.

Impact possible :

- Un membre peut exclure un capitaine.

- Un utilisateur peut modifier une équipe sans droit.

- Une invitation peut être utilisée abusivement.

Solutions :

- Définir clairement les permissions de chaque rôle.

- Vérifier les permissions côté back-end.

- Tester les cas interdits.

- Limiter les actions critiques au capitaine.

- Gérer proprement le statut invité.

### 11.2 Abus des invitations d'équipe

Catégorie : Sécurité / Anti-abus

Probabilité : Moyenne

Impact : Moyen

Description :

Les codes d'invitation peuvent être partagés publiquement ou utilisés de manière abusive.

Impact possible :

- Arrivée d'utilisateurs non désirés dans une équipe.

- Spam d'invitations.

- Mauvaise expérience utilisateur.

Solutions :

- Générer des codes suffisamment longs et aléatoires.

- Prévoir une expiration des invitations.

- Permettre au capitaine de régénérer un code.

- Limiter le nombre d'invitations envoyées.

- Ajouter une validation du capitaine pour les équipes privées.

## 12 Risques liés à l'interface utilisateur

### 12.1 Interface trop complexe

Catégorie : UX/UI

Probabilité : Moyenne

Impact : Moyen

Description :

Avec beaucoup de statistiques, leaderboards, équipes et fonctionnalités sociales, l'interface peut devenir difficile à comprendre.

Impact possible :

- Utilisateur perdu.

- Démonstration moins fluide.

- Application perçue comme confuse.

Solutions :

- Créer un dashboard clair.

- Afficher en priorité les statistiques principales.

- Utiliser des cartes simples.

- Prévoir une navigation mobile simple.

- Reporter les fonctionnalités secondaires dans des pages dédiées.

### 12.2 Tableaux de leaderboards peu adaptés au mobile

Catégorie : UX/UI / Responsive

Probabilité : Moyenne

Impact : Moyen

Description :

Les leaderboards contiennent plusieurs colonnes : rang, joueur, score, K/D, winrate, parties, saison. Sur mobile, ces tableaux peuvent devenir illisibles.

Impact possible :

- Mauvaise expérience mobile.

- PWA moins convaincante.

- Difficulté à présenter le projet sur téléphone.

Solutions :

- Prévoir des cartes de classement sur mobile.

- Rendre les tableaux scrollables horizontalement.

- Afficher moins de colonnes sur petit écran.

- Tester régulièrement les pages sur mobile.

## 13 Risques liés à la démonstration finale

### 13.1 Application vide pendant la soutenance

Catégorie : Démonstration / Données

Probabilité : Élevée

Impact : Élevé

Description :

Une application de statistiques est peu impressionnante si elle ne contient pas assez de joueurs, équipes, jeux, saisons et messages.

Impact possible :

- Démonstration peu convaincante.

- Fonctionnalités difficiles à comprendre.

- Leaderboards vides.

- Graphiques inexistants.

Solutions :

- Préparer un mode démo.

- Seeder plusieurs utilisateurs fictifs.

- Créer plusieurs équipes.

- Ajouter plusieurs jeux.

- Générer plusieurs saisons.

- Préparer des leaderboards remplis.

- Ajouter des messages dans un chat d'équipe.

- Prévoir un compte de démonstration prêt à l'emploi.

### 13.2 Dépendance à Internet ou à une API le jour de la soutenance

Catégorie : Démonstration / Fiabilité

Probabilité : Moyenne

Impact : Élevé

Description :

Si la démonstration dépend d'une API externe ou d'une connexion instable, elle peut échouer.

Impact possible :

- Impossibilité de montrer les statistiques.

- Erreurs visibles.

- Perte de temps pendant la présentation.

Solutions :

- Utiliser des données locales ou seedées pour la démo.

- Prévoir un fallback en cas d'échec d'API.

- Tester la démonstration hors ligne partielle si possible.

- Préparer des captures ou un scénario alternatif.

- Ne pas faire dépendre la soutenance d'une API externe non maîtrisée.

## 14 Risques liés à l'organisation de l'équipe

### 14.1 Mauvaise répartition des tâches

Catégorie : Organisation / Équipe

Probabilité : Moyenne

Impact : Moyen

Description :

L'équipe est composée de deux développeurs. Si la répartition n'est pas claire, certaines tâches peuvent être oubliées ou faites en double.

Impact possible :

- Perte de temps.

- Retards.

- Conflits de responsabilités.

- Fonctionnalités incomplètes.

Solutions :

- Maintenir une répartition claire : Ioanes côté projet/back, Clément côté front/PWA.

- Utiliser un fichier de répartition des tâches.

- Faire des points réguliers.

- Définir les priorités de chaque sprint ou semaine.

- Documenter les décisions techniques.

### 14.2 Intégration front/back tardive

Catégorie : Organisation / Technique

Probabilité : Moyenne

Impact : Élevé

Description :

Si le front-end et le back-end sont développés séparément trop longtemps, l'intégration peut révéler beaucoup de problèmes à la fin.

Impact possible :

- Endpoints incompatibles.

- Mauvais formats de données.

- Retard important.

- Bugs difficiles à corriger rapidement.

Solutions :

- Définir tôt les contrats API.

- Utiliser Swagger si possible.

- Créer des types partagés ou une documentation claire.

- Intégrer progressivement les pages front avec les endpoints back.

- Utiliser des données mockées côté front en attendant le back.

## 15 Risques liés à l'environnement technique

### 15.1 Mauvaise configuration Docker

Catégorie : DevOps / Environnement

Probabilité : Moyenne

Impact : Moyen

Description :

Docker et Docker Compose doivent permettre de lancer le front, le back, la base et Redis. Une mauvaise configuration peut ralentir toute l'équipe.

Impact possible :

- Environnement difficile à lancer.

- Différences entre machines.

- Perte de temps en configuration.

Solutions :

- Créer un docker-compose simple dès le début.

- Documenter les commandes d'installation.

- Utiliser des fichiers .env.example.

- Tester l'installation sur les deux machines.

- Garder une configuration minimale au départ.

### 15.2 Secrets exposés dans GitHub

Catégorie : Sécurité / DevOps

Probabilité : Faible à moyenne

Impact : Élevé

Description :

Les clés API, secrets JWT, identifiants BDD ou clés de chiffrement ne doivent jamais être poussés dans le repository.

Impact possible :

- Fuite de secrets.

- Accès non autorisé aux services.

- Obligation de régénérer les clés.

Solutions :

- Utiliser un fichier .env ignoré par Git.

- Fournir uniquement un .env.example.

- Vérifier le .gitignore.

- Ne jamais partager de clés dans le code ou la documentation publique.

- Régénérer immédiatement un secret exposé par erreur.

## 16 Matrice synthétique des risques

| Risque | Probabilité | Impact | Priorité | Solution principale |

|---|---|---|---|---|

| APIs externes indisponibles | Élevée | Élevé | Critique | API mockée + données seedées |

| Scope trop large | Élevée | Élevé | Critique | Prioriser le MVP |

| Redis-JSON mal structuré | Moyenne | Élevé | Haute | Convention de clés ou PostgreSQL |

| Sécurité auth insuffisante | Moyenne | Élevé | Haute | Hash, guards, cookies sécurisés |

| Tokens exposés | Moyenne | Élevé | Haute | Chiffrement + variables d'environnement |

| Chat temps réel complexe | Moyenne | Moyen | Moyenne | Chat d'équipe simple d'abord |

| PWA ajoutée trop tard | Moyenne | Moyen | Moyenne | PWA dès l'initialisation |

| Cache PWA sensible | Moyenne | Élevé | Haute | Network first + nettoyage à la déconnexion |

| Leaderboard injuste | Moyenne | Moyen | Moyenne | Minimum de parties + formule documentée |

| App vide en soutenance | Élevée | Élevé | Critique | Mode démo + seeds |

| Intégration front/back tardive | Moyenne | Élevé | Haute | Contrats API tôt + intégration progressive |

| Secrets dans GitHub | Faible à moyenne | Élevé | Haute | .env + .gitignore + .env.example |

## 17 Plan d'action prioritaire

Actions à réaliser dès le début :

1. Définir précisément le MVP.

2. Créer une API mockée pour les statistiques.

3. Préparer des données seedées.

4. Définir le modèle de données.

5. Choisir clairement la stratégie BDD.

6. Mettre en place l'authentification sécurisée.

7. Ajouter Docker et un .env.example.

8. Prévoir la PWA dès le front initial.

9. Définir les rôles d'équipe.

10. Créer un scénario de démonstration.

Actions à réaliser pendant le développement :

1. Tester régulièrement l'intégration front/back.

2. Vérifier les permissions côté back-end.

3. Tester les cas d'erreur API.

4. Alimenter la base avec des données réalistes.

5. Vérifier le responsive mobile.

6. Contrôler les logs.

7. Tester le chat en temps réel.

8. Stabiliser le MVP avant les bonus.

Actions à réaliser avant la soutenance :

1. Préparer un compte démo.

2. Préparer plusieurs joueurs et équipes fictifs.

3. Vérifier les leaderboards.

4. Vérifier la PWA installable.

5. Tester le scénario complet de démonstration.

6. Prévoir une solution de secours si l'API externe ne fonctionne pas.

7. Vérifier que les données sensibles ne sont pas exposées.

## 18 Conclusion

Les principaux risques du projet Track'N Share concernent la complexité des APIs externes, le périmètre très large, la gestion des données, la sécurité et la démonstration finale.

La meilleure stratégie consiste à construire un MVP solide, simple et démontrable : authentification, profil, statistiques simulées ou récupérées, score, leaderboards, équipes, saisons, chat d'équipe, sécurité de base et PWA.

Les fonctionnalités bonus doivent être ajoutées seulement après stabilisation du socle principal. L'API mockée, les données seedées, la documentation technique, les tests d'intégration et le mode démo sont les éléments les plus importants pour réduire les risques du projet.
