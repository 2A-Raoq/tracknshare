# Track'N Share — MVP Scope

## Objectif du fichier

Ce fichier définit ce qui appartient au MVP Track'N Share, ce qui est important mais secondaire, et ce qui doit être reporté.

## Objectif du MVP

Le MVP doit permettre de démontrer une plateforme gaming complète mais maîtrisée :

- un utilisateur peut créer un compte et se connecter ;
- il peut consulter un dashboard ;
- il peut afficher des statistiques mockées ;
- un score est calculé côté back-end ;
- un leaderboard solo est visible ;
- une équipe peut être créée ou rejointe ;
- un chat d'équipe fonctionne ;
- le projet peut être lancé localement avec Docker ;
- la soutenance peut se faire sans dépendre de Steam ou Epic.

## P0 — Indispensable

Les éléments P0 doivent être réalisés avant tout bonus.

### Authentification

- inscription ;
- connexion ;
- déconnexion ;
- hash du mot de passe ;
- JWT ;
- routes privées ;
- endpoint utilisateur courant ;
- compte démo.

### Utilisateur et profil minimal

- id ;
- email ;
- username ;
- rôle ;
- données publiques minimales ;
- dashboard accessible uniquement connecté.

### Statistiques

- MockProvider ;
- modèle Game ;
- modèle PlayerStats ;
- modèle Season ;
- stats utilisateur ;
- synchronisation mockée ;
- calcul K/D ;
- calcul winrate ;
- calcul score ;
- dashboard joueur.

### Score

Formule MVP recommandée :

```txt
Score = (K/D ratio × 50) + (Winrate × 40) + (Nombre de parties × 0.5)
```

Règles :
- calcul côté back-end ;
- division par zéro gérée ;
- minimum de parties pour apparaître dans certains classements si nécessaire ;
- formule centralisée et testable.

### Leaderboard solo

- endpoint leaderboard ;
- tri par score décroissant ;
- rang calculé ;
- affichage joueur, score, K/D, winrate, parties ;
- données seedées visibles.

### Équipes

- création d'équipe ;
- code d'invitation ;
- rejoindre une équipe ;
- membres ;
- rôles MVP : `CAPTAIN`, `MEMBER` ;
- page équipe ;
- garde d'accès membre.

### Chat d'équipe

- historique messages ;
- envoi message ;
- réception temps réel via Socket.io ;
- rooms par équipe ;
- non-membre refusé ;
- token jamais loggé ;
- messages seedés pour démo.

### Sécurité minimale

- DTO validés ;
- guards NestJS ;
- permissions côté back-end ;
- pas de secrets dans le front ;
- pas de passwordHash retourné ;
- logs sans données sensibles ;
- `.env` non commité ;
- `.env.example` maintenu.

### Démo

- compte démo ;
- plusieurs utilisateurs fictifs ;
- stats fictives ;
- leaderboard rempli ;
- équipe démo ;
- chat non vide ;
- captures de secours.

## P1 — Important mais après P0

À faire seulement si les P0 sont stables.

- refresh token ;
- rate limiting ;
- requestId ;
- tests unitaires critiques ;
- PWA installable ;
- page offline simple ;
- archivage saisons complet ;
- cache Redis ;
- CI GitHub Actions ;
- notifications internes ;
- mode sombre ;
- graphiques simples ;
- comparaison joueur contre joueur.

## P2 — Bonus / évolutions futures

À ne pas prioriser avant la soutenance MVP.

- SteamProvider réel ;
- EpicProvider réel ;
- messagerie privée complète ;
- amis ;
- badges avancés ;
- tournois ;
- feed social ;
- matchmaking avancé ;
- modération complète ;
- chiffrement de bout en bout ;
- 2FA ;
- monitoring avancé ;
- production réelle ;
- E2E automatisés ;
- multi-jeux avancé.

## Règle de décision

Avant de commencer une tâche, se poser les questions suivantes :

1. Est-ce nécessaire au MVP ?
2. Est-ce une tâche P0 ?
3. Est-ce que cela risque de casser le parcours de démo ?
4. Est-ce que cela ajoute une dépendance externe inutile ?
5. Est-ce que cela respecte les règles de sécurité ?

Si la réponse indique un risque ou une fonctionnalité bonus, proposer de reporter en P1/P2.

## Parcours de démo cible

Le parcours de démo doit rester simple :

1. Lancer le projet avec Docker.
2. Ouvrir l'application web.
3. Se connecter avec le compte démo.
4. Afficher le dashboard joueur.
5. Synchroniser ou afficher les stats mockées.
6. Consulter le leaderboard.
7. Ouvrir une équipe.
8. Envoyer un message dans le chat.
9. Montrer Swagger ou les endpoints principaux.
10. Expliquer la sécurité et le MockProvider.

## Critères de réussite du MVP

Le MVP est acceptable si :

- il se lance facilement ;
- il est démontrable sans API externe réelle ;
- les données visibles sont crédibles ;
- le parcours principal ne bloque pas ;
- les routes privées sont protégées ;
- le chat d'équipe est sécurisé ;
- le projet ne contient pas de secret ;
- la documentation utile est présente.
