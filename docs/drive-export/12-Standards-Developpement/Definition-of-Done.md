# DEFINITION OF DONE

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit la Definition of Done du projet Track'N Share.

La Definition of Done correspond à l'ensemble des critères qu'une tâche, une user story, une fonctionnalité ou une correction doit respecter avant d'être considérée comme réellement terminée.

Elle sert à éviter qu'une tâche soit déplacée trop tôt en "Terminé" dans le Kanban GitHub Project alors qu'elle n'est pas encore testée, documentée, sécurisée ou intégrée correctement.

## 1 Principe général

### 1.1 Définition

Une tâche est considérée comme terminée uniquement si elle est :

- développée ;

- lisible ;

- testée ou vérifiée ;

- intégrée dans le projet ;

- sécurisée ;

- documentée si nécessaire ;

- relue ou validée ;

- compatible avec le MVP ;

- présentable en soutenance.

### 1.2 Objectif pour Track'N Share

La Definition of Done doit garantir que chaque fonctionnalité apporte une valeur réelle au projet sans casser l'existant.

Elle s'applique notamment aux fonctionnalités suivantes :

- authentification ;

- profils joueurs ;

- dashboard ;

- statistiques ;

- leaderboards ;

- équipes ;

- invitations ;

- chat ;

- saisons ;

- PWA ;

- Docker ;

- documentation ;

- sécurité ;

- tests ;

- mode démo.

### 1.3 Règle principale

Une tâche ne doit pas passer en "Terminé" simplement parce que le code a été écrit.

Elle passe en "Terminé" seulement si elle respecte tous les critères pertinents de ce document.

## 2 États recommandés du Kanban

### 2.1 Backlog

La tâche est identifiée mais pas encore planifiée précisément.

### 2.2 À faire

La tâche est prête à être développée.

Elle doit avoir :

- un titre clair ;

- une description suffisante ;

- une priorité ;

- un responsable si possible ;

- des critères d'acceptation.

### 2.3 En cours

La tâche est en développement.

Une branche Git peut être associée.

### 2.4 En review

Le développement est terminé mais la tâche doit être relue.

Cela peut inclure :

- revue de code ;

- revue fonctionnelle ;

- vérification sécurité ;

- vérification documentation.

### 2.5 Test

La tâche est à vérifier manuellement ou automatiquement.

### 2.6 Terminé

La tâche respecte la Definition of Done.

## 3 Critères généraux pour toute tâche

Une tâche peut être considérée comme terminée si :

- l'objectif de la tâche est atteint ;

- le comportement attendu est visible ou vérifiable ;

- le code compile ;

- le code respecte les conventions de code ;

- le code respecte les conventions Git ;

- les erreurs évidentes sont gérées ;

- aucun secret n'est ajouté ;

- aucune fonctionnalité existante critique n'est cassée ;

- la tâche est reliée au Kanban ou à une issue ;

- les critères d'acceptation sont validés.

## 4 Critères de code

### 4.1 Lisibilité

Le code doit être compréhensible.

Critères :

- noms de variables clairs ;

- fonctions courtes autant que possible ;

- responsabilités séparées ;

- pas de duplication excessive ;

- logique métier centralisée ;

- commentaires utiles si règle métier complexe.

### 4.2 TypeScript

Critères :

- types définis ;

- pas de any inutile ;

- interfaces ou types métier si nécessaire ;

- props React typées ;

- DTO back-end typés ;

- réponses API typées côté front si possible.

### 4.3 Formatage

Critères :

- Prettier appliqué si configuré ;

- ESLint sans erreur bloquante ;

- imports inutiles supprimés ;

- console.log inutiles supprimés ;

- code mort supprimé.

### 4.4 Cohérence

Critères :

- fichier placé dans le bon dossier ;

- nommage conforme ;

- architecture respectée ;

- conventions API respectées ;

- séparation front/back respectée.

## 5 Critères front-end

Une tâche front-end est terminée si :

- le composant ou la page s'affiche correctement ;

- les props sont typées ;

- les états loading, error et empty sont prévus si nécessaires ;

- l'appel API est centralisé dans un service ;

- les erreurs API sont affichées proprement ;

- la navigation fonctionne ;

- le responsive est correct au minimum sur desktop et mobile ;

- aucune donnée sensible n'est affichée ;

- aucun secret n'est présent dans le bundle front ;

- le logout nettoie l'état utilisateur si la tâche touche l'authentification ;

- les comportements PWA ne cachent pas de données privées.

Exemples :

- une page dashboard doit afficher les statistiques ou un état vide clair ;

- une page leaderboard doit gérer pagination, loading et erreur ;

- une page équipe doit empêcher l'affichage privé aux non-membres côté UI, même si la vraie sécurité reste côté back-end.

## 6 Critères back-end

Une tâche back-end est terminée si :

- le module est placé au bon endroit ;

- le controller reste simple ;

- la logique métier est dans un service ;

- les DTO valident les entrées ;

- les routes privées sont protégées par JWT ;

- les permissions sont vérifiées côté back-end ;

- les réponses API respectent le format standard ;

- les erreurs sont standardisées ;

- les statuts HTTP sont cohérents ;

- les logs utiles existent sans secret ;

- les données sensibles ne sont jamais retournées ;

- Swagger est mis à jour si applicable.

Exemples :

- une route de création d'équipe doit vérifier l'utilisateur connecté ;

- une route de chat doit vérifier l'appartenance à l'équipe ;

- une route admin doit vérifier le rôle ADMIN ;

- une synchronisation stats doit gérer le fallback si le provider échoue.

## 7 Critères API

Une tâche API est terminée si :

- la route respecte les conventions API ;

- la méthode HTTP est adaptée ;

- le nom de route est cohérent ;

- le body est validé par DTO ;

- les query params sont validés ;

- la pagination est prévue pour les listes ;

- les filtres et tris sont whitelistés ;

- la réponse succès est standardisée ;

- la réponse erreur est standardisée ;

- les codes d'erreur métier sont cohérents ;

- l'endpoint est documenté dans Swagger ;

- l'endpoint est ajouté à la documentation Drive si nécessaire.

## 8 Critères sécurité

Une tâche ne peut pas être terminée si elle introduit une faille évidente.

Critères obligatoires :

- aucun secret dans le code ;

- aucun secret dans Git ;

- aucun secret côté front-end ;

- aucune clé Steam/Epic exposée ;

- mots de passe jamais stockés en clair ;

- passwordHash jamais retourné ;

- JWT_SECRET jamais loggé ;

- données utilisateur protégées ;

- permissions vérifiées côté back-end ;

- erreurs sans stack trace côté client ;

- logs sans tokens ni mots de passe.

Pour les routes sensibles :

- rate limiting si nécessaire ;

- vérification de propriétaire ;

- vérification de rôle ;

- vérification de membre d'équipe ;

- validation stricte des entrées.

## 9 Critères données et base de données

Une tâche liée à la base de données est terminée si :

- le modèle est cohérent avec la documentation ;

- une migration existe si le schéma change ;

- la migration est testée ;

- les contraintes importantes sont prévues ;

- les relations sont correctes ;

- les suppressions sont prudentes ;

- les données seedées restent fictives ;

- les champs sensibles ne sont pas exposés ;

- les index importants sont prévus pour les requêtes fréquentes.

Exemples :

- email unique ;

- team tag unique si règle retenue ;

- relation user/team claire ;

- relation stats/season claire ;

- index sur leaderboard si nécessaire.

## 10 Critères Redis et cache

Une tâche utilisant Redis est terminée si :

- les clés ont un préfixe clair ;

- les données temporaires ont un TTL ;

- Redis n'est pas utilisé comme source de vérité principale ;

- aucun secret n'est stocké en clair ;

- le comportement en cas d'indisponibilité est prévu ;

- les locks sont libérés correctement ;

- le cache ne provoque pas de données obsolètes critiques.

## 11 Critères Socket.io

Une tâche Socket.io est terminée si :

- le socket est authentifié ;

- le userId vient du token, pas du client ;

- l'accès aux rooms est vérifié ;

- le nommage des événements est cohérent ;

- les payloads sont validés ;

- le rate limiting est prévu pour les messages ;

- le broadcast cible la bonne room ;

- les erreurs sont gérées ;

- les logs ne contiennent pas le contenu complet des messages.

Exemples :

- un non-membre ne peut pas rejoindre team:{teamId} ;

- un non-membre ne peut pas envoyer de message ;

- un membre reçoit uniquement les messages de son équipe.

## 12 Critères providers externes

Une tâche liée à Steam, Epic/EOS ou MockProvider est terminée si :

- l'appel externe passe par un provider dédié ;

- aucune clé API n'est exposée côté front ;

- les variables d'environnement sont documentées ;

- un timeout est prévu ;

- le mapping vers le modèle interne est défini ;

- le fallback est prévu ;

- les profils privés ou données indisponibles sont gérés ;

- les erreurs sont loggées sans secret ;

- le mode démo reste fonctionnel sans API externe.

## 13 Critères Docker et DevOps

Une tâche DevOps est terminée si :

- Docker démarre correctement ;

- les variables d'environnement nécessaires sont documentées ;

- .env.example est mis à jour ;

- aucun secret n'est dans Dockerfile ou docker-compose ;

- PostgreSQL et Redis démarrent ;

- le back-end se connecte à PostgreSQL ;

- le back-end se connecte à Redis si nécessaire ;

- les ports sont documentés ;

- les commandes utiles sont testées ;

- la documentation de déploiement est mise à jour.

## 14 Critères tests

### 14.1 Tests automatiques

Quand des tests automatiques existent, la tâche est terminée si :

- les tests existants passent ;

- les tests liés à la nouvelle fonctionnalité sont ajoutés si pertinent ;

- les tests critiques sont maintenus ;

- les mocks sont cohérents ;

- les tests ne dépendent pas d'APIs externes instables.

### 14.2 Vérification manuelle MVP

Même sans tests automatisés complets, une vérification manuelle doit être faite.

Exemples :

- inscription ;

- login ;

- dashboard ;

- sync mock ;

- leaderboard ;

- équipe ;

- chat ;

- logout ;

- erreur 401 / 403.

### 14.3 Tests de non-régression

Une tâche ne doit pas casser :

- login ;

- dashboard ;

- accès API ;

- Docker ;

- base de données ;

- mode démo ;

- soutenance.

## 15 Critères documentation

Une tâche est terminée seulement si la documentation est mise à jour quand nécessaire.

Documents à mettre à jour selon le changement :

- Endpoints-REST-API ;

- Documentation-Socket-io ;

- Authentification-JWT ;

- Roles-permissions ;

- Regles-metier ;

- Variables-environnement ;

- Configuration-Docker ;

- Procedure-deploiement ;

- Monitoring-logs ;

- Politique-securite ;

- Conventions-API ;

- Architecture-dossiers.

Exemples :

- nouvelle variable env → Variables-environnement ;

- nouveau endpoint → Endpoints-REST-API ;

- nouvelle règle de score → Regles-metier ;

- changement Docker → Configuration-Docker ;

- nouveau rôle → Roles-permissions.

## 16 Critères Git et revue

Une tâche est terminée si :

- la branche est nommée correctement ;

- les commits sont clairs ;

- la pull request a une description ;

- la PR est relue si changement important ;

- les commentaires de review sont traités ;

- la branche est à jour avec main ;

- les conflits sont résolus ;

- la CI est verte si disponible ;

- la tâche Kanban est mise à jour.

## 17 Critères UX/UI

Une tâche front visible par l'utilisateur est terminée si :

- l'interface est compréhensible ;

- les textes sont clairs ;

- les erreurs sont affichées proprement ;

- les boutons importants sont visibles ;

- les états vides sont prévus ;

- les loaders sont présents si chargement ;

- l'affichage reste correct sur mobile ;

- le comportement correspond aux parcours utilisateurs ;

- la maquette Figma est respectée si disponible.

## 18 Critères accessibilité minimum

Pour le MVP, appliquer au moins :

- boutons avec texte compréhensible ;

- labels sur les champs de formulaire ;

- contrastes lisibles ;

- navigation clavier de base ;

- erreurs de formulaire visibles ;

- images importantes avec texte alternatif si nécessaire.

## 19 Critères performance minimum

Une tâche est terminée si elle ne provoque pas de lenteur évidente.

Critères :

- pagination sur les listes longues ;

- pas d'appels API inutiles en boucle ;

- pas de recalcul lourd côté front sans nécessité ;

- cache utilisé avec prudence ;

- requêtes base raisonnables ;

- Socket.io ne spamme pas les événements.

## 20 Critères mode démo

Le mode démo est central pour la soutenance.

Une tâche importante est terminée si elle reste compatible avec :

- DEMO_MODE=true ;

- MockProvider ;

- données seedées ;

- compte démo ;

- absence de Steam/Epic obligatoire ;

- lancement Docker local.

Exemples :

- le dashboard doit fonctionner avec des stats mockées ;

- le leaderboard doit afficher des joueurs fictifs ;

- le chat doit avoir des messages démo ;

- les APIs externes ne doivent pas bloquer la présentation.

## 21 Definition of Done par type de tâche

### 21.1 Fonctionnalité front-end

Terminé si :

- page ou composant fonctionnel ;

- responsive minimum ;

- états loading/error/empty ;

- intégration API ;

- erreurs gérées ;

- aucune donnée sensible affichée ;

- vérification manuelle faite.

### 21.2 Fonctionnalité back-end

Terminé si :

- endpoint ou service fonctionnel ;

- DTO ;

- guards ;

- erreurs ;

- format de réponse ;

- Swagger ;

- logs propres ;

- vérification manuelle ou test.

### 21.3 Fonctionnalité full-stack

Terminé si :

- back-end fonctionnel ;

- front-end intégré ;

- contrats API cohérents ;

- erreurs affichées ;

- test manuel complet ;

- documentation mise à jour.

### 21.4 Documentation

Terminé si :

- contenu rédigé ;

- contenu cohérent avec le projet ;

- document rangé dans le bon dossier ;

- liens utiles présents ;

- pas de contradiction avec les autres documents ;

- relu rapidement.

### 21.5 Bug fix

Terminé si :

- bug reproduit ou compris ;

- cause identifiée ;

- correction appliquée ;

- non-régression vérifiée ;

- test ajouté si pertinent ;

- PR claire.

### 21.6 Tâche DevOps

Terminé si :

- commande testée ;

- environnement lancé ;

- variables documentées ;

- pas de secret ;

- README ou docs mis à jour.

## 22 Critères spécifiques MVP Track'N Share

Pour le MVP, une fonctionnalité critique est terminée si elle contribue à au moins un objectif suivant :

- authentification fonctionnelle ;

- dashboard joueur exploitable ;

- stats mockées cohérentes ;

- leaderboard consultable ;

- équipe créée ou rejointe ;

- chat d'équipe fonctionnel ;

- mode démo stable ;

- sécurité minimale respectée ;

- documentation alignée.

## 23 Checklist rapide Definition of Done

Avant de passer une tâche en Terminé, vérifier :

- Objectif atteint.

- Code compilable.

- Conventions respectées.

- Pas de secret.

- Erreurs gérées.

- Permissions vérifiées si nécessaire.

- Validation des entrées si nécessaire.

- Tests ou vérification manuelle faits.

- Documentation mise à jour si nécessaire.

- PR relue si changement important.

- Mode démo non cassé.

- Kanban mis à jour.

## 24 Exemples pratiques

### 24.1 Exemple : login JWT

Terminé si :

- endpoint login créé ;

- DTO LoginDto ;

- mot de passe vérifié avec hash ;

- JWT généré ;

- réponse sans passwordHash ;

- erreur générique en cas d'échec ;

- rate limit prévu ;

- front connecté ;

- logout nettoie l'état ;

- Swagger mis à jour.

### 24.2 Exemple : leaderboard solo

Terminé si :

- endpoint GET leaderboard ;

- score calculé côté back ;

- pagination ;

- tri décroissant ;

- minimum de parties appliqué ;

- front affiche le classement ;

- état vide prévu ;

- données mockées disponibles ;

- documentation mise à jour.

### 24.3 Exemple : chat d'équipe

Terminé si :

- socket authentifié ;

- TeamMemberGuard appliqué ;

- room team:{teamId} ;

- message sauvegardé ;

- broadcast aux membres seulement ;

- non-membre refusé ;

- rate limit message ;

- front affiche les messages ;

- logs sans contenu sensible.

### 24.4 Exemple : Docker

Terminé si :

- docker compose démarre ;

- PostgreSQL démarre ;

- Redis démarre ;

- backend connecté ;

- frontend accessible ;

- .env.example à jour ;

- aucune vraie clé dans Docker ;

- documentation mise à jour.

## 25 Risques et solutions

### 25.1 Risque : tâche marquée terminée trop tôt

Impact : bugs ou travail incomplet.

Solution : utiliser la checklist Definition of Done.

### 25.2 Risque : documentation oubliée

Impact : documentation obsolète.

Solution : ajouter la doc dans les critères avant merge.

### 25.3 Risque : sécurité vérifiée trop tard

Impact : failles difficiles à corriger.

Solution : vérifier JWT, guards, secrets et logs dès chaque tâche.

### 25.4 Risque : mode démo cassé

Impact : soutenance compromise.

Solution : vérifier MockProvider et compte démo avant Terminé.

### 25.5 Risque : PR trop grosse

Impact : revue difficile.

Solution : découper les tâches et appliquer la DoD à chaque partie.

## 26 Critères d'acceptation de ce document

Ce document est considéré utile si :

- il permet de savoir quand une tâche est terminée ;

- il couvre front-end, back-end, sécurité, tests et documentation ;

- il s'applique au Kanban GitHub Project ;

- il est adapté au MVP Track'N Share ;

- il évite de déplacer trop tôt des tâches en Terminé ;

- il reste simple à utiliser par Ioanes et Clément.

## 27 Conclusion

La Definition of Done de Track'N Share est un outil de qualité projet.

Elle permet de garantir qu'une tâche n'est pas seulement codée, mais réellement prête à être intégrée, testée, documentée et présentée.

Pour le MVP, les priorités sont simples : code lisible, sécurité minimale, validation, intégration front/back, mode démo stable, documentation à jour et main toujours présentable.

En appliquant cette Definition of Done, Ioanes et Clément pourront avancer plus sereinement et garder un projet propre jusqu'à la soutenance.
