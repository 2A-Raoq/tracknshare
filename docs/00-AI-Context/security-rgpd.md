# Track'N Share — Security & RGPD

## Objectif du fichier

Ce fichier résume les règles de sécurité et de confidentialité à respecter pendant le développement du MVP.

Claude Code doit appliquer ces règles par défaut.

## Données sensibles du projet

Track'N Share manipule ou manipulera :

- emails ;
- mots de passe ;
- profils utilisateurs ;
- avatars ;
- comptes de jeux liés ;
- statistiques de jeu ;
- équipes ;
- messages de chat ;
- tokens d'APIs externes futurs ;
- logs techniques.

## Règles générales

- Ne jamais commiter `.env`.
- Maintenir `.env.example`.
- Ne jamais exposer de secret côté front.
- Ne jamais mettre de clé API dans `VITE_*`.
- Ne jamais retourner `passwordHash`.
- Ne jamais logger de mot de passe.
- Ne jamais logger de JWT.
- Ne jamais logger de clé Steam/Epic.
- Ne jamais logger le contenu complet des messages.
- Toujours valider les entrées côté back-end.
- Toujours vérifier les permissions côté back-end.

## Front-end

### À faire

- protéger les routes privées ;
- nettoyer l'état utilisateur au logout ;
- afficher les erreurs proprement ;
- éviter l'injection HTML ;
- traiter les données utilisateur comme non fiables ;
- utiliser les variables `VITE_*` uniquement pour des informations publiques.

### À éviter

- stocker un mot de passe ;
- exposer une clé API ;
- faire un appel direct à Steam/Epic ;
- considérer un rôle front comme sécurité réelle ;
- cacher des messages privés dans le service worker ;
- afficher des stack traces utilisateur.

## Back-end

### À faire

- utiliser DTO + validation ;
- activer un ValidationPipe global ;
- hasher les mots de passe avec Argon2 ou bcrypt ;
- utiliser JwtAuthGuard pour les routes privées ;
- utiliser TeamMemberGuard pour les ressources d'équipe ;
- utiliser TeamRoleGuard pour les actions capitaine ;
- configurer CORS précisément ;
- ajouter Helmet si possible ;
- limiter la taille des payloads ;
- gérer les erreurs centralement ;
- garder les logs propres.

### À éviter

- controller avec logique métier lourde ;
- permissions uniquement côté front ;
- endpoints sans validation ;
- erreurs trop verbeuses ;
- fuite d'informations sur les comptes ;
- secrets hardcodés.

## Authentification

### MVP

- JWT access token ;
- payload minimal ;
- routes privées protégées ;
- mot de passe hashé ;
- aucun `passwordHash` dans les réponses.

Payload recommandé :

```json
{
  "sub": "user_123",
  "role": "PLAYER"
}
```

### Évolution future

- refresh token ;
- cookie HttpOnly ;
- rotation de refresh tokens ;
- révocation logout ;
- 2FA.

## Mots de passe

Règles :

- hash Argon2 recommandé ;
- bcrypt accepté ;
- jamais de SHA256 simple ;
- jamais en clair ;
- jamais dans les logs ;
- jamais retourné au front.

## Permissions

### Règles prioritaires

- un utilisateur ne peut modifier que son profil ;
- un joueur ne peut pas accéder aux données privées d'un autre ;
- un non-membre ne peut pas lire le chat d'équipe ;
- un membre simple ne peut pas gérer les invitations sensibles ;
- un capitaine peut gérer son équipe ;
- les routes admin futures doivent être protégées par rôle.

### Guards recommandés

```txt
JwtAuthGuard
RolesGuard
ResourceOwnerGuard
TeamMemberGuard
TeamRoleGuard
```

## Chat d'équipe

Règles :

- socket authentifié ;
- userId issu du token ;
- room par équipe ;
- non-membre refusé ;
- contenu vide refusé ;
- longueur maximale ;
- contenu complet non loggé ;
- messages sauvegardés côté back ;
- fallback REST possible.

## PWA et cache

Règles :

- cache des assets statiques autorisé ;
- prudence sur les données privées ;
- pas de messages privés sensibles dans le cache ;
- nettoyage au logout ;
- page offline neutre ;
- pas de secret dans le service worker.

## Providers externes

Règles :

- Steam/Epic uniquement côté back-end ;
- aucune clé API côté React ;
- tokens externes chiffrés si stockés ;
- permissions minimales ;
- expiration et révocation prévues ;
- erreurs provider gérées ;
- MockProvider obligatoire pour le MVP.

## Base de données

Règles :

- PostgreSQL source de vérité ;
- accès uniquement via back-end ;
- migrations versionnées ;
- seeds fictifs uniquement ;
- pas de données réelles dans le repo ;
- éviter les suppressions destructives ;
- indexer les requêtes fréquentes.

## Redis

Utilisation possible :

- cache ;
- rate limiting ;
- locks ;
- présence future ;
- leaderboard rapide futur.

Règles :

- Redis non exposé publiquement ;
- TTL sur données temporaires ;
- pas de secret en clair ;
- fallback si Redis indisponible.

## RGPD MVP

Même pour un projet étudiant, prévoir :

- politique de confidentialité ;
- données collectées clairement listées ;
- modification du profil ;
- suppression du compte en évolution ;
- export des données en évolution ;
- visibilité profil public/privé en évolution ;
- minimisation des données ;
- données de démo fictives.

## Données personnelles possibles

- email ;
- pseudo ;
- avatar ;
- comptes liés ;
- stats de jeu ;
- équipes ;
- messages ;
- activité.

## Logs

### À éviter

- mot de passe ;
- hash ;
- JWT ;
- refresh token ;
- clé API ;
- email si pas nécessaire ;
- contenu complet d'un message ;
- données privées complètes.

### Acceptable

- requestId ;
- endpoint ;
- statut HTTP ;
- temps de réponse ;
- id interne non sensible ;
- erreur technique résumée ;
- événement de sécurité.

## Checklist sécurité avant soutenance

- `.env` absent du repo ;
- `.env.example` présent ;
- aucun secret dans `VITE_*` ;
- routes privées protégées ;
- DTO actifs ;
- passwordHash jamais retourné ;
- JWT jamais loggé ;
- non-membre refusé sur chat ;
- compte démo non admin ;
- Swagger sans vrai secret ;
- données seedées fictives ;
- logs propres.
