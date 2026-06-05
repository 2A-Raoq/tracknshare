# **1. Vision du projet reformulée**

**Track ‘N Share** est une plateforme web de suivi et de comparaison de performances gaming.

Les joueurs peuvent connecter leurs comptes de jeux, récupérer automatiquement leurs statistiques, comparer leurs performances avec leurs amis ou leurs équipes, et apparaître dans des classements solo ou par équipe.

Le projet combine :

- gestion utilisateur ;

- connexion à des comptes externes ;

- récupération de statistiques via API ;

- système de points ;

- leaderboards ;

- équipes ;

- historique trimestriel ;

- messagerie temps réel ;

- gamification.

C’est une très bonne base parce que ça touche à la fois au **front**, au **back**, à la **BDD**, au **temps réel**, à l’authentification, aux API externes et à la gestion de données.

# **2. Le point le plus important : définir un MVP réaliste**

Vous avez énormément de features. Pour éviter de vous perdre, je vous conseille de découper en trois niveaux.

## **MVP obligatoire**

Ce sont les fonctionnalités qui doivent absolument exister pour que le projet ait du sens.

### **Compte utilisateur**

- inscription ;

- connexion ;

- déconnexion ;

- modification du profil ;

- avatar, pseudo, bio ;

- profil public d’un joueur.

### **Liaison d’un compte de jeu**

Pour commencer, je vous conseille de ne gérer **qu’une seule API externe** au début.

Par exemple :

- Steam API ;

- ou une API fictive/mockée si l’API officielle est trop complexe ;

- ou un jeu précis avec une API simple.

L’utilisateur doit pouvoir :

- lier son compte ;

- voir ses statistiques récupérées ;

- rafraîchir ses données.

### **Statistiques joueur**

Afficher au minimum :

- victoires ;

- défaites ;

- winrate ;

- kills ;

- deaths ;

- K/D ratio ;

- score global ;

- évolution sur la période en cours.

### **Système de points**

Il faut que votre système soit clair, compréhensible et documenté.

Exemple simple :

Score = (K/D ratio × 100) + (Winrate × 100) + Bonus d’activité

Ou plus propre :

Score = (K/D × 50) + (Winrate × 40) + (Nombre de parties × 0.5)

Il faut éviter qu’un joueur qui fait seulement 2 bonnes parties soit premier devant quelqu’un qui joue régulièrement. Vous pouvez donc ajouter une notion de **minimum de parties jouées** pour être classé.

Exemple :

Un joueur doit avoir au moins 10 parties sur la période pour apparaître dans le leaderboard.

### **Leaderboard solo**

Un classement simple :

- par jeu ;

- par score ;

- sur une période donnée ;

- avec pseudo, avatar, score, K/D, winrate, rang.

### **Équipes**

Au minimum :

- créer une équipe ;

- rejoindre une équipe via un code d’invitation ;

- voir les membres ;

- quitter une équipe ;

- afficher les stats globales de l’équipe.

### **Leaderboard d’équipe**

Pour les jeux multijoueurs :

- score moyen de l’équipe ;

- total victoires/défaites ;

- K/D moyen ;

- classement entre équipes.

### **Historique trimestriel**

Tous les trois mois :

- sauvegarder les stats de la période ;

- figer le classement ;

- afficher les anciennes saisons.

Je vous conseille d’appeler ça des **saisons** plutôt que des “récaps trimestriels”. C’est plus gaming.

Exemple :

Saison 1 — Janvier à Mars 2026

Saison 2 — Avril à Juin 2026

Saison 3 — Juillet à Septembre 2026

# **3. Ce qui manque actuellement dans votre réflexion**

## **3.1 Une vraie notion de “saison”**

Votre idée de récap tous les 3 mois est très bonne, mais il faut la formaliser.

Je proposerais :

- une saison dure 3 mois ;

- chaque saison possède son propre leaderboard ;

- à la fin d’une saison, les scores sont archivés ;

- une nouvelle saison démarre à zéro ou avec un soft reset ;

- les anciens résultats restent consultables.

Ça donne une vraie logique compétitive.

Exemple de pages :

- Leaderboard actuel ;

- Archives des saisons ;

- Profil joueur avec historique par saison ;

- Profil équipe avec historique par saison.

## **3.2 Une stratégie si les API externes ne marchent pas**

C’est un gros point de risque.

Les API Steam, Epic, Riot, Ubisoft, etc. peuvent être :

- limitées ;

- incomplètes ;

- difficiles à utiliser ;

- soumises à authentification ;

- parfois indisponibles ;

- différentes selon les jeux.

Donc prévoyez dès le départ un **mode fallback**.

Exemples :

### **Option 1 — API réelle**

Vous utilisez une vraie API de jeu pour une partie du projet.

### **Option 2 — API mockée**

Vous créez une fausse API qui simule des données de jeu.

Exemple :

GET /mock/game-stats/:userId

Elle retourne :

{

"wins": 42,

"losses": 18,

"kills": 340,

"deaths": 210,

"matchesPlayed": 60

}

Ça vous permet de garantir que votre app fonctionne même si l’API externe est compliquée.

### **Option 3 — Import manuel**

L’utilisateur peut ajouter ses stats manuellement.

Ça peut être une feature bonus, mais aussi un bon filet de sécurité.

## **3.3 La modération et la sécurité**

Comme vous avez des profils, des messages privés, des équipes et potentiellement un fil d’actualité, il faut penser à la modération.

À prévoir :

- signaler un utilisateur ;

- signaler un message ;

- bloquer un utilisateur ;

- rendre un profil privé ;

- masquer ses statistiques ;

- permissions selon les rôles ;

- protection contre le spam d’invitations.

Même si vous ne codez pas tout, il faut au moins le mentionner dans votre dossier.

## **3.4 Une vraie gestion des rôles**

Vous avez parlé de capitaine, co-capitaine et membre. C’est une très bonne idée.

Je proposerais :

| **Rôle** | **Permissions** |
| --- | --- |
| Capitaine | Modifier l’équipe, inviter, exclure, supprimer l’équipe |
| Co-capitaine | Inviter, gérer les membres |
| Membre | Voir l’équipe, participer au chat |
| Invité | En attente d’acceptation |

Ça montre que vous avez pensé à la logique métier.

## **3.5 Un dashboard clair**

Votre site doit avoir une page centrale vraiment utile.

Exemple de dashboard utilisateur :

- score actuel ;

- rang actuel ;

- évolution depuis la semaine dernière ;

- K/D ;

- winrate ;

- équipe active ;

- derniers matchs ;

- badges débloqués ;

- prochains objectifs.

Exemple de dashboard équipe :

- classement de l’équipe ;

- score moyen ;

- meilleur joueur ;

- progression de la saison ;

- derniers records battus ;

- messages récents.

# **4. Features intéressantes à ajouter**

Voici des idées que je trouve cohérentes avec votre projet.

## **4.1 Système de rivalité**

Permettre à un joueur ou une équipe de désigner un rival.

Exemples :

- “Comparer avec ce joueur” ;

- “Défier cette équipe” ;

- “Suivre l’écart de points avec ce rival”.

Ça peut donner une dimension compétitive sympa.

## **4.2 Objectifs personnels**

Chaque joueur peut se fixer des objectifs.

Exemples :

- atteindre 2.0 de K/D ;

- dépasser 60 % de winrate ;

- gagner 10 parties cette semaine ;

- entrer dans le top 100 ;

- battre son record de score.

Vous pouvez afficher une barre de progression.

Exemple :

Objectif : atteindre 2.0 K/D

Progression actuelle : 1.73 / 2.0

## **4.3 Comparaison joueur contre joueur**

Très bonne feature pour le front.

Page “Face-à-face” :

Clément vs Ioanes

Avec comparaison :

| **Stat** | **Clément** | **Ioanes** |
| --- | --- | --- |
| Score | 1840 | 1710 |
| K/D | 1.8 | 1.5 |
| Winrate | 62 % | 58 % |
| Parties jouées | 120 | 98 |
| Rang | #12 | #18 |

Vous pouvez ajouter un message du type :

Clément domine en K/D, mais Ioanes a une meilleure régularité sur les 30 derniers jours.

## **4.4 Progression graphique**

Indispensable pour rendre le projet visuellement fort.

Graphiques possibles :

- évolution du score ;

- évolution du K/D ;

- évolution du winrate ;

- progression dans le leaderboard ;

- comparaison entre saisons.

Librairies possibles côté React :

- Recharts ;

- Chart.js ;

- Tremor ;

- Nivo.

## **4.5 Système de badges**

Très bonne idée, mais à garder en bonus.

Exemples de badges :

| **Badge** | **Condition** |
| --- | --- |
| First Blood | Première partie enregistrée |
| Team Founder | Première équipe créée |
| Hot Streak | 5 victoires d’affilée |
| MVP | Meilleur score de son équipe sur une saison |
| Veteran | 100 parties enregistrées |
| Clutch Player | Winrate supérieur à 70 % sur une période |

## **4.6 Notifications**

À intégrer si vous avez le temps.

Types de notifications :

- invitation d’ami ;

- invitation d’équipe ;

- nouveau message ;

- record personnel battu ;

- changement de rang ;

- fin de saison ;

- nouveau badge débloqué.

Même sans push mobile, vous pouvez faire un système simple de notifications internes.

## **4.7 Système de recherche**

Très utile pour donner un côté plateforme complète.

Recherche de :

- joueurs ;

- équipes ;

- jeux ;

- classements ;

- amis.

Avec filtres :

- jeu ;

- rang ;

- pays ;

- statut en ligne ;

- équipe ouverte ou fermée ;

- K/D minimum ;

- winrate minimum.

## **4.8 Page publique de partage**

Très bonne feature pour le côté “Share” du nom.

Chaque joueur pourrait avoir une URL publique :

/players/clement

Chaque équipe aussi :

/teams/tracknshare

Ces pages pourraient afficher :

- stats principales ;

- badges ;

- classement actuel ;

- historique des saisons ;

- jeux connectés.

## **4.9 Cartes de performance partageables**

Feature originale et visuelle.

L’utilisateur peut générer une carte de performance :

Clément — Saison 2

Top 4 %

K/D : 1.82

Winrate : 64 %

Rang : #128

Ça pourrait être une image exportable ou juste une carte HTML stylée.

## **4.10 Système de “matchmaking” interne**

Vous avez noté “système matchmaking”, mais ce n’est pas encore bien défini.

Vous pourriez faire un matchmaking pour trouver :

- des joueurs du même niveau ;

- des équipes qui cherchent des membres ;

- des joueurs avec les mêmes jeux ;

- des joueurs avec les mêmes horaires ;

- des joueurs complémentaires.

Exemple :

Cette équipe cherche un joueur avec :

- K/D supérieur à 1.2

- Disponibilité le soir

- Rôle : support

- Jeu : Valorant

Même sans lancer de vraies parties, ça peut devenir un système de recommandation de coéquipiers.

# **5. Features à éviter au début**

Certaines idées sont très bien, mais probablement trop grosses pour le MVP.

Je mettrais en bonus tardif :

- application mobile ;

- tournois internes complets ;

- calendrier avancé ;

- feed social complet ;

- commentaires sur toutes les performances ;

- bibliothèque de replays ;

- rapports annuels générés automatiquement ;

- système de modération complet ;

- connexion à plusieurs APIs de jeux dès le départ.

Vous pouvez les mentionner comme **évolutions futures**, mais ne pas forcément les coder.

# **6. Recommandations techniques**

## **6.1 Attention à Redis-JSON comme base principale**

Redis-JSON est intéressant, mais pour un projet avec :

- utilisateurs ;

- équipes ;

- messages ;

- historiques ;

- relations d’amitié ;

- invitations ;

- classements ;

- saisons ;

une base relationnelle comme **PostgreSQL** serait souvent plus adaptée.

Architecture recommandée :

PostgreSQL : données principales

Redis : cache, sessions, leaderboards rapides, Socket.io, files d’attente

Mais si votre consigne impose Redis-JSON, vous pouvez quand même l’utiliser. Il faudra juste bien structurer vos documents.

Exemple :

user:{id}

team:{id}

game:{id}

stats:{userId}:{gameId}:{seasonId}

leaderboard:{gameId}:{seasonId}

messages:{conversationId}

## **6.2 Prévoir des tâches planifiées**

Vous aurez besoin de jobs côté back-end.

Exemples :

- rafraîchir les stats des joueurs ;

- archiver les saisons ;

- recalculer les leaderboards ;

- supprimer les notifications expirées ;

- nettoyer les invitations anciennes.

Avec NestJS, vous pouvez utiliser :

@nestjs/schedule

## **6.3 Prévoir une architecture propre**

Exemple de modules NestJS :

AuthModule

UsersModule

ProfilesModule

GamesModule

StatsModule

LeaderboardModule

TeamsModule

FriendsModule

MessagesModule

NotificationsModule

SeasonsModule

AchievementsModule

Côté front :

/pages

/components

/features/auth

/features/profile

/features/teams

/features/leaderboard

/features/chat

/features/stats

/stores

/services

/types

# **7. Modèle de données à prévoir**

Voici les entités principales.

## **User**

id

email

username

passwordHash

avatar

banner

bio

createdAt

lastLoginAt

privacyStatus

## **GameAccount**

id

userId

platform

externalUsername

externalId

accessToken?

refreshToken?

linkedAt

## **Game**

id

name

type

platform

isTeamBased

## **PlayerStats**

id

userId

gameId

seasonId

wins

losses

kills

deaths

matchesPlayed

kdRatio

winrate

score

fetchedAt

## **Team**

id

name

tag

description

avatar

ownerId

inviteCode

createdAt

## **TeamMember**

id

teamId

userId

role

joinedAt

## **Season**

id

name

startDate

endDate

status

## **Message**

id

senderId

conversationId

content

createdAt

readAt

## **Achievement**

id

name

description

condition

icon

## **UserAchievement**

id

userId

achievementId

unlockedAt

# **8. Pages importantes à prévoir**

Je vous conseille cette structure de pages.

/ Landing page

/register Inscription

/login Connexion

/dashboard Dashboard utilisateur

/profile/:id Profil public

/settings Paramètres du compte

/games Liste des jeux disponibles

/games/:id/leaderboard Leaderboard d’un jeu

/teams Mes équipes

/teams/create Créer une équipe

/teams/:id Page équipe

/teams/:id/chat Chat d’équipe

/friends Amis

/messages Messages privés

/seasons Archives des saisons

/compare Comparaison joueur vs joueur

/admin Administration/modération

Pour le MVP, vous pouvez réduire à :

/login

/register

/dashboard

/profile/:id

/leaderboard

/teams

/teams/:id

/settings

# **9. Idées pour rendre le projet plus professionnel**

## **Ajouter une landing page claire**

Avec :

- nom du projet ;

- slogan ;

- capture fictive du dashboard ;

- présentation des fonctionnalités ;

- bouton “Commencer”.

Exemple de slogan :

Track your stats. Climb the ranks. Share your progress.

Ou en français :

Suivez vos stats, comparez vos performances, dominez les classements.

## **Ajouter un mode démo**

Très utile pour une soutenance.

Un bouton :

Essayer la démo

Qui connecte un utilisateur fictif avec des données déjà remplies.

Ça vous évite d’avoir un moment gênant si une API externe ne répond pas pendant la présentation.

## **Ajouter des données seedées**

Préparez :

- 50 faux joueurs ;

- 10 équipes ;

- 3 jeux ;

- plusieurs saisons ;

- des stats variées ;

- un leaderboard rempli.

Pour une soutenance, c’est beaucoup plus impressionnant qu’une app vide.

## **Ajouter une documentation API**

Avec Swagger sur NestJS.

Exemple :

/api/docs

Ça montre que votre back-end est propre et professionnel.

## **Ajouter des tests**

Même quelques tests suffisent à valoriser le projet.

Exemples :

- test du calcul du score ;

- test de création d’équipe ;

- test d’invitation ;

- test d’authentification ;

- test du classement.

# **10. Proposition de roadmap**

## **Phase 1 — Base projet**

- Initialisation front React + TypeScript ;

- Initialisation back NestJS ;

- Docker ;

- Auth ;

- création utilisateur ;

- structure BDD.

## **Phase 2 — Profils et jeux**

- profil utilisateur ;

- liaison compte de jeu ;

- récupération ou simulation de stats ;

- affichage des stats.

## **Phase 3 — Score et leaderboard**

- calcul du score ;

- classement solo ;

- filtres par jeu ;

- saisons.

## **Phase 4 — Équipes**

- création d’équipe ;

- invitation via code ;

- rôles ;

- stats d’équipe ;

- leaderboard équipe.

## **Phase 5 — Social**

- amis ;

- messages privés ;

- chat d’équipe avec Socket.io ;

- notifications simples.

## **Phase 6 — Bonus**

- badges ;

- graphiques ;

- objectifs personnels ;

- comparaisons avancées ;

- mode sombre ;

- admin/modération.

# **11. Mon conseil final**

Votre projet est très bon, mais il faut éviter de vouloir tout faire.

Je vous conseille de présenter le projet comme ça :

## **Fonctionnalités prioritaires**

- authentification ;

- profils joueurs ;

- connexion ou simulation de stats de jeu ;

- score ;

- leaderboard solo ;

- création d’équipe ;

- leaderboard équipe ;

- historique par saison ;

- chat d’équipe.

## **Fonctionnalités bonus**

- amis ;

- messages privés ;

- badges ;

- objectifs ;

- notifications ;

- graphiques ;

- matchmaking ;

- modération ;

- tournois.

Avec ça, vous aurez un projet cohérent, démontrable, et assez complet pour montrer vos compétences front, back, BDD, temps réel et architecture logicielle.
