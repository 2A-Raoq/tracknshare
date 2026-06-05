# SPRINT 4 — POLISH ET SOUTENANCE

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit le Sprint 4 du projet Track'N Share.

Le Sprint 4 correspond à la phase de stabilisation du MVP, de correction des bugs, d'amélioration de l'expérience utilisateur, de vérification sécurité, de finalisation de la documentation et de préparation de la soutenance.

Ce sprint ne doit pas chercher à ajouter de grosses fonctionnalités. Son objectif principal est de rendre le parcours existant fiable, démontrable et compréhensible par un jury.

## 1 Objectif du Sprint 4

### 1.1 Objectif principal

Stabiliser le MVP Track'N Share afin de disposer d'une application présentable en soutenance.

À la fin du sprint, l'équipe doit pouvoir démontrer le parcours suivant sans blocage :

- lancement du projet via Docker ;

- connexion avec un compte démo ;

- consultation du dashboard ;

- synchronisation ou affichage de statistiques mockées ;

- consultation du leaderboard ;

- consultation ou création d'une équipe ;

- utilisation du chat d'équipe ;

- déconnexion ;

- présentation de la sécurité et de la documentation.

### 1.2 Objectifs secondaires

Le Sprint 4 doit aussi permettre de :

- corriger les bugs P0 ;

- finaliser les données seedées ;

- vérifier Swagger ;

- vérifier le README ;

- exécuter les plans de tests ;

- préparer la recette soutenance ;

- améliorer le responsive minimal ;

- vérifier l'absence de secrets ;

- préparer des captures de secours ;

- documenter les limites connues du MVP.

## 2 Périmètre du Sprint 4

### 2.1 Inclus

Le Sprint 4 inclut :

- exécution du Plan-tests-MVP ;

- exécution des Tests-API ;

- exécution des Tests-securite ;

- exécution de la Recette-soutenance ;

- correction des bugs bloquants ;

- amélioration des messages d'erreur ;

- vérification responsive ;

- finalisation du seed démo ;

- finalisation Swagger ;

- finalisation README ;

- vérification Docker ;

- nettoyage logs ;

- captures de secours ;

- préparation du scénario oral.

### 2.2 Non inclus

Le Sprint 4 ne doit pas inclure :

- intégration Steam réelle complète ;

- intégration Epic réelle complète ;

- refonte graphique totale ;

- messagerie privée complète ;

- système d'amis complet ;

- tournois ;

- matchmaking avancé ;

- monitoring production avancé ;

- tests E2E complets si le temps manque ;

- nouvelles fonctionnalités qui risquent de casser le MVP.

## 3 Durée recommandée

Durée indicative : 3 à 5 jours de travail selon disponibilité.

Ce sprint doit être réservé à la qualité finale. Il vaut mieux présenter moins de fonctionnalités mais parfaitement démontrables qu'un grand nombre de fonctionnalités instables.

## 4 Livrables attendus

Livrables principaux :

- bugs P0 corrigés ;

- tests MVP exécutés ;

- tests API exécutés ;

- tests sécurité exécutés ;

- recette soutenance validée ;

- données démo finalisées ;

- compte démo opérationnel ;

- Docker vérifié sur environnement propre ;

- Swagger propre ;

- README à jour ;

- .env.example complet ;

- captures de secours préparées ;

- scénario de présentation prêt ;

- milestone M4 validable.

## 5 Tâches du Sprint 4

### 5.1 TNS-401 — Exécuter Plan-tests-MVP

Priorité : P0

Responsable possible : Ioanes / Clément

Description : vérifier que les fonctionnalités essentielles du MVP fonctionnent correctement.

À faire :

- tester inscription ;

- tester connexion ;

- tester dashboard ;

- tester statistiques ;

- tester leaderboard ;

- tester création ou consultation équipe ;

- tester chat ;

- tester logout ;

- noter les anomalies.

Critères d'acceptation :

- tests P0 réalisés ;

- anomalies listées ;

- bugs bloquants corrigés ou documentés ;

- parcours principal utilisable.

### 5.2 TNS-402 — Exécuter Tests-API

Priorité : P0

Responsable possible : Ioanes

Description : vérifier les endpoints principaux du back-end.

À faire :

- tester routes auth ;

- tester routes users ;

- tester routes stats ;

- tester sync mock ;

- tester leaderboard ;

- tester teams ;

- tester messages ;

- vérifier codes HTTP ;

- vérifier Swagger.

Critères d'acceptation :

- endpoints P0 répondent ;

- routes privées protégées ;

- erreurs propres ;

- Swagger cohérent ;

- aucun passwordHash retourné.

### 5.3 TNS-403 — Exécuter Tests-securite

Priorité : P0

Responsable possible : Ioanes / Clément

Description : vérifier les protections minimales de l'application.

À faire :

- vérifier absence de secrets dans Git ;

- vérifier .env.example sans vraie clé ;

- vérifier routes privées ;

- vérifier refus non-membre sur chat ;

- vérifier absence de données sensibles dans les logs ;

- vérifier compte démo non admin ;

- vérifier CORS en dev.

Critères d'acceptation :

- routes privées protégées ;

- non-membre refusé ;

- passwordHash absent ;

- secrets absents ;

- logs propres ;

- compte démo non administrateur.

### 5.4 TNS-404 — Finaliser Recette-soutenance

Priorité : P0

Responsable possible : Clément

Description : préparer le scénario de démonstration final.

À faire :

- définir l'ordre de présentation ;

- préparer le compte démo ;

- préparer les données visibles ;

- préparer captures de secours ;

- prévoir un plan B si Docker ou internet pose problème ;

- préparer les points à expliquer oralement.

Critères d'acceptation :

- scénario de démo prêt ;

- captures de secours prêtes ;

- checklist finale passée ;

- plan de secours connu ;

- durée de présentation maîtrisée.

### 5.5 TNS-405 — Améliorer responsive minimal

Priorité : P1

Responsable possible : Clément

Description : rendre les écrans principaux exploitables sur mobile.

À faire :

- vérifier login/register ;

- vérifier dashboard ;

- vérifier leaderboard ;

- vérifier page équipe ;

- vérifier chat ;

- ajuster cartes, tableaux et boutons ;

- éviter les débordements horizontaux.

Critères d'acceptation :

- login lisible mobile ;

- dashboard lisible mobile ;

- leaderboard utilisable ;

- chat utilisable ;

- navigation compréhensible.

### 5.6 TNS-406 — Nettoyer logs et erreurs

Priorité : P0

Responsable possible : Ioanes

Description : rendre les erreurs et les logs propres pour la soutenance.

À faire :

- supprimer console.log inutiles ;

- vérifier absence de tokens dans les logs ;

- vérifier absence de mots de passe dans les logs ;

- uniformiser les messages d'erreur API ;

- afficher des erreurs compréhensibles côté front ;

- éviter les stack traces visibles utilisateur.

Critères d'acceptation :

- pas de JWT loggé ;

- pas de password loggé ;

- erreurs API propres ;

- front affiche des messages lisibles ;

- logs utiles mais non sensibles.

### 5.7 TNS-407 — Finaliser README

Priorité : P0

Responsable possible : Ioanes / Clément

Description : mettre à jour la documentation de lancement du projet.

À faire :

- documenter les prérequis ;

- documenter l'installation ;

- documenter Docker ;

- documenter .env ;

- documenter les commandes front/back ;

- documenter Swagger ;

- expliquer le mode démo ;

- mentionner les limites connues.

Critères d'acceptation :

- installation expliquée ;

- Docker expliqué ;

- variables env expliquées ;

- compte démo documenté prudemment ;

- commandes utiles listées ;

- nouveau développeur peut lancer le projet.

### 5.8 TNS-408 — Finaliser seed démo

Priorité : P0

Responsable possible : Ioanes

Description : garantir que l'application n'est pas vide pendant la présentation.

À faire :

- vérifier compte démo ;

- ajouter plusieurs joueurs ;

- ajouter stats variées ;

- ajouter leaderboard rempli ;

- ajouter équipe démo ;

- ajouter membres ;

- ajouter messages ;

- vérifier cohérence des données.

Critères d'acceptation :

- dashboard compte démo rempli ;

- leaderboard crédible ;

- équipe visible ;

- chat non vide ;

- données cohérentes et fictives.

### 5.9 TNS-409 — Vérifier Docker sur machine propre

Priorité : P0

Responsable possible : Ioanes / Clément

Description : s'assurer que le projet démarre dans un environnement propre.

À faire :

- cloner le repository ;

- copier .env.example vers .env ;

- lancer docker compose up -d --build ;

- vérifier front ;

- vérifier back ;

- vérifier PostgreSQL ;

- vérifier Redis ;

- tester Swagger.

Critères d'acceptation :

- projet démarre ;

- front accessible ;

- back accessible ;

- API health OK ;

- Swagger OK ;

- pas d'étape manquante dans le README.

### 5.10 TNS-410 — Préparer support oral et captures de secours

Priorité : P0

Responsable possible : Ioanes / Clément

Description : préparer les éléments nécessaires en cas de problème pendant la soutenance.

À faire :

- préparer captures dashboard ;

- préparer captures leaderboard ;

- préparer captures équipe/chat ;

- préparer schéma architecture ;

- préparer explication MockProvider ;

- préparer explication sécurité ;

- préparer limites et évolutions futures.

Critères d'acceptation :

- captures disponibles ;

- scénario clair ;

- plan B prêt ;

- chaque membre sait quoi présenter.

## 6 Répartition possible

### 6.1 Ioanes

Tâches principales possibles :

- tests API ;

- corrections back-end ;

- nettoyage logs ;

- vérification sécurité ;

- seed démo ;

- Docker ;

- Swagger ;

- README partie back/Docker ;

- explication architecture et sécurité.

### 6.2 Clément

Tâches principales possibles :

- tests front ;

- responsive ;

- polish UI ;

- recette soutenance ;

- captures de secours ;

- README partie front ;

- parcours de démonstration ;

- explication UX/PWA.

### 6.3 Tâches communes

À faire ensemble :

- exécuter le scénario complet ;

- valider les priorités de correction ;

- décider ce qui est reporté ;

- préparer la présentation orale ;

- vérifier que chaque fonctionnalité démontrée est stable.

## 7 Dépendances

### 7.1 Dépendances internes

- Sprint 4 dépend de tous les sprints précédents.

- La recette dépend du compte démo, des stats, du leaderboard, de l'équipe et du chat.

- Le README dépend de la configuration finale.

- Les captures dépendent de l'interface stabilisée.

### 7.2 Dépendances techniques

- Docker fonctionnel ;

- base seedable ;

- Swagger accessible ;

- front et back synchronisés ;

- environnement de présentation préparé.

## 8 Definition of Done du Sprint 4

Le Sprint 4 est terminé si :

- tous les tests P0 passent ;

- les bugs bloquants sont corrigés ;

- Docker démarre correctement ;

- le compte démo fonctionne ;

- dashboard, leaderboard, équipe et chat sont présentables ;

- Swagger est propre ;

- README est à jour ;

- aucun secret n'est visible ;

- les données de démo sont prêtes ;

- le scénario de soutenance est prêt ;

- les limites connues sont documentées.

## 9 Tests à réaliser pendant le Sprint 4

### 9.1 Tests parcours complet

- lancer Docker ;

- ouvrir le front ;

- se connecter avec le compte démo ;

- consulter dashboard ;

- synchroniser stats mockées ;

- consulter leaderboard ;

- ouvrir équipe ;

- envoyer message chat ;

- vérifier réception ;

- se déconnecter.

### 9.2 Tests régression

- vérifier inscription ;

- vérifier login ;

- vérifier logout ;

- vérifier routes privées ;

- vérifier stats ;

- vérifier leaderboard ;

- vérifier équipes ;

- vérifier chat ;

- vérifier erreurs principales.

### 9.3 Tests sécurité minimum

- .env absent de Git ;

- .env.example sans secret ;

- passwordHash absent ;

- JWT non loggé ;

- routes privées protégées ;

- chat inaccessible aux non-membres ;

- compte démo non admin.

### 9.4 Tests soutenance

- scénario chronométré ;

- captures disponibles ;

- plan B prêt ;

- README validé ;

- Swagger accessible ;

- explication du MockProvider prête ;

- limites du MVP assumées.

## 10 Risques du Sprint 4

### 10.1 Risque : ajouter trop de fonctionnalités en fin de projet

Impact : régressions et perte de stabilité.

Solution : geler le scope et corriger uniquement les bugs prioritaires.

### 10.2 Risque : Docker ne démarre pas le jour de la soutenance

Impact : démonstration compromise.

Solution : tester sur machine propre et préparer captures de secours.

### 10.3 Risque : données de démo insuffisantes

Impact : application peu convaincante.

Solution : finaliser seed joueurs, stats, leaderboard, équipe et chat.

### 10.4 Risque : bugs visibles pendant le parcours principal

Impact : perte de crédibilité.

Solution : répéter le scénario plusieurs fois et corriger les bugs P0.

### 10.5 Risque : documentation non alignée avec le code

Impact : incohérence pendant l'évaluation.

Solution : relire README, Swagger, roadmap et recette avant livraison.

## 11 Checklist de fin Sprint 4

- Plan-tests-MVP exécuté.

- Tests-API exécutés.

- Tests-securite exécutés.

- Recette-soutenance exécutée.

- Bugs P0 corrigés.

- Docker vérifié.

- Compte démo vérifié.

- Seed démo finalisé.

- Dashboard présentable.

- Leaderboard présentable.

- Équipe présentable.

- Chat présentable.

- Swagger propre.

- README à jour.

- .env.example complet.

- Logs nettoyés.

- Responsive minimal vérifié.

- Captures de secours prêtes.

- Scénario oral prêt.

- Limites connues documentées.

## 12 Livraison finale

La livraison finale doit contenir :

- code source propre ;

- README ;

- .env.example ;

- Docker Compose ;

- migrations ;

- seed démo ;

- Swagger ;

- documentation Drive à jour ;

- scénario de soutenance ;

- captures ou support de secours si nécessaire.

## 13 Conclusion

Le Sprint 4 transforme le MVP Track'N Share en projet présentable.

Son rôle n'est pas d'ajouter de nouvelles fonctionnalités ambitieuses, mais de fiabiliser le parcours principal, sécuriser la démonstration et préparer l'équipe à expliquer clairement ses choix techniques, fonctionnels et de sécurité.

Un Sprint 4 réussi permet de présenter une application cohérente, stable et professionnelle autour de l'authentification, des statistiques, des leaderboards, des équipes et du chat.
