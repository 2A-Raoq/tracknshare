# CAS DE TESTS FONCTIONNELS

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit les cas de tests fonctionnels prévus pour valider le MVP de Track'N Share.

Les cas de tests fonctionnels permettent de vérifier le comportement de l'application du point de vue utilisateur. Ils ne se concentrent pas uniquement sur le code ou les endpoints, mais sur les parcours réels : créer un compte, se connecter, consulter ses statistiques, rejoindre une équipe, utiliser le chat, voir le leaderboard et présenter le mode démo.

Ce document peut être utilisé pendant le développement, avant chaque merge important, puis comme support de recette avant la soutenance.

## 1 Méthode de lecture des cas de tests

Chaque cas de test contient :

- un identifiant ;

- une priorité ;

- un objectif ;

- des préconditions ;

- des étapes ;

- un résultat attendu ;

- des remarques si nécessaire.

Priorités :

- P0 : indispensable pour le MVP et la soutenance ;

- P1 : important mais contournable ;

- P2 : amélioration ou évolution future.

## 2 Parcours visiteur

### 2.1 CF-VIS-001 — Accéder à la landing page

Priorité : P0

Objectif : vérifier qu'un visiteur peut accéder à la page d'accueil.

Préconditions :

- application lancée ;

- front-end accessible.

Étapes :

1. Ouvrir l'URL du front-end.

2. Observer la page affichée.

3. Vérifier la présence des boutons de connexion et d'inscription.

Résultat attendu :

- la page d'accueil s'affiche ;

- le nom Track'N Share est visible ;

- les actions principales sont accessibles ;

- aucune erreur console bloquante n'apparaît.

### 2.2 CF-VIS-002 — Accéder à une page privée sans être connecté

Priorité : P0

Objectif : vérifier qu'un visiteur non connecté ne peut pas accéder aux pages privées.

Préconditions :

- utilisateur déconnecté.

Étapes :

1. Tenter d'accéder au dashboard.

2. Tenter d'accéder à une page équipe privée.

3. Tenter d'accéder à une page paramètres.

Résultat attendu :

- l'utilisateur est redirigé vers la page de connexion ;

- aucune donnée privée n'est affichée ;

- le comportement est clair pour l'utilisateur.

### 2.3 CF-VIS-003 — Consulter un leaderboard public si activé

Priorité : P1

Objectif : vérifier que le leaderboard public est accessible si la fonctionnalité est prévue.

Préconditions :

- leaderboard public activé ;

- données seedées disponibles.

Étapes :

1. Accéder à la page leaderboard depuis la landing page.

2. Consulter les joueurs affichés.

3. Changer de page ou filtre si disponible.

Résultat attendu :

- le leaderboard s'affiche ;

- les informations publiques sont visibles ;

- aucune donnée privée comme email ou token n'est affichée.

## 3 Parcours inscription

### 3.1 CF-AUTH-001 — Inscription avec données valides

Priorité : P0

Objectif : vérifier qu'un nouvel utilisateur peut créer un compte.

Préconditions :

- utilisateur non connecté ;

- email non utilisé.

Étapes :

1. Ouvrir la page d'inscription.

2. Renseigner un email valide.

3. Renseigner un pseudo valide.

4. Renseigner un mot de passe valide.

5. Confirmer l'inscription.

Résultat attendu :

- le compte est créé ;

- l'utilisateur reçoit un retour positif ;

- l'utilisateur est redirigé vers login ou dashboard selon choix fonctionnel ;

- aucun passwordHash n'est visible côté front.

### 3.2 CF-AUTH-002 — Inscription avec email invalide

Priorité : P0

Objectif : vérifier la validation du champ email.

Étapes :

1. Ouvrir la page d'inscription.

2. Saisir un email invalide.

3. Remplir les autres champs correctement.

4. Valider.

Résultat attendu :

- l'inscription est refusée ;

- un message indique que l'email est invalide ;

- aucun compte n'est créé.

### 3.3 CF-AUTH-003 — Inscription avec mot de passe invalide

Priorité : P0

Objectif : vérifier la validation du mot de passe.

Cas à tester :

- mot de passe trop court ;

- mot de passe vide ;

- confirmation différente si champ de confirmation prévu.

Résultat attendu :

- l'inscription est refusée ;

- un message clair est affiché ;

- aucune donnée invalide n'est enregistrée.

### 3.4 CF-AUTH-004 — Inscription avec email déjà utilisé

Priorité : P0

Objectif : vérifier que l'unicité email est respectée.

Préconditions :

- un compte existe déjà avec l'email testé.

Étapes :

1. Ouvrir la page d'inscription.

2. Utiliser un email déjà existant.

3. Valider.

Résultat attendu :

- l'inscription est refusée ;

- le message reste clair ;

- aucun doublon n'est créé.

## 4 Parcours connexion et session

### 4.1 CF-AUTH-005 — Connexion avec identifiants valides

Priorité : P0

Objectif : vérifier qu'un utilisateur peut se connecter.

Préconditions :

- compte utilisateur existant ;

- mot de passe connu.

Étapes :

1. Ouvrir la page de connexion.

2. Renseigner email et mot de passe valides.

3. Valider.

Résultat attendu :

- l'utilisateur est connecté ;

- il est redirigé vers le dashboard ;

- son pseudo ou avatar est affiché ;

- les routes privées deviennent accessibles.

### 4.2 CF-AUTH-006 — Connexion avec mauvais mot de passe

Priorité : P0

Objectif : vérifier le refus des identifiants invalides.

Étapes :

1. Ouvrir la page de connexion.

2. Renseigner un email existant.

3. Renseigner un mauvais mot de passe.

4. Valider.

Résultat attendu :

- connexion refusée ;

- message générique ;

- aucune indication excessive sur l'existence du compte.

### 4.3 CF-AUTH-007 — Connexion avec champs vides

Priorité : P0

Objectif : vérifier la validation formulaire côté front et back.

Étapes :

1. Ouvrir la page login.

2. Laisser les champs vides.

3. Valider.

Résultat attendu :

- formulaire refusé ;

- messages de validation visibles ;

- aucune requête invalide inutile si validation front prévue.

### 4.4 CF-AUTH-008 — Déconnexion

Priorité : P0

Objectif : vérifier que l'utilisateur peut se déconnecter.

Préconditions :

- utilisateur connecté.

Étapes :

1. Cliquer sur déconnexion.

2. Vérifier la redirection.

3. Tenter de revenir au dashboard.

Résultat attendu :

- session front nettoyée ;

- token supprimé ou invalidé selon stratégie ;

- dashboard inaccessible ;

- données privées non visibles après logout.

### 4.5 CF-AUTH-009 — Session expirée

Priorité : P1

Objectif : vérifier le comportement en cas de token expiré.

Préconditions :

- token expiré ou simulé.

Étapes :

1. Accéder à une route privée avec token expiré.

2. Observer le comportement front.

Résultat attendu :

- API retourne 401 ;

- front affiche une session expirée ou redirige vers login ;

- les données privées sont nettoyées.

## 5 Parcours profil joueur

### 5.1 CF-PROF-001 — Consulter son profil

Priorité : P0

Objectif : vérifier que l'utilisateur connecté peut consulter son profil.

Préconditions :

- utilisateur connecté.

Étapes :

1. Aller sur la page profil.

2. Vérifier les informations affichées.

Résultat attendu :

- pseudo affiché ;

- avatar ou placeholder affiché ;

- statistiques résumées si prévues ;

- email non affiché publiquement.

### 5.2 CF-PROF-002 — Modifier son profil

Priorité : P1

Objectif : vérifier que l'utilisateur peut modifier les champs autorisés.

Préconditions :

- utilisateur connecté.

Étapes :

1. Ouvrir les paramètres profil.

2. Modifier la bio ou le pseudo si autorisé.

3. Enregistrer.

Résultat attendu :

- modification acceptée ;

- données mises à jour à l'écran ;

- validation appliquée ;

- champs non autorisés ignorés ou refusés.

### 5.3 CF-PROF-003 — Modifier le profil d'un autre utilisateur

Priorité : P0

Objectif : vérifier la protection ownership.

Préconditions :

- deux comptes utilisateurs existent.

Étapes :

1. Se connecter avec utilisateur A.

2. Tenter de modifier les données de l'utilisateur B par URL ou requête.

Résultat attendu :

- accès refusé ;

- aucune modification sur le compte B ;

- API retourne 403 ou 404 selon stratégie.

## 6 Parcours dashboard et statistiques

### 6.1 CF-DASH-001 — Afficher le dashboard joueur

Priorité : P0

Objectif : vérifier que le dashboard se charge correctement.

Préconditions :

- utilisateur connecté ;

- données stats disponibles.

Étapes :

1. Se connecter.

2. Aller sur le dashboard.

3. Observer les cartes statistiques.

Résultat attendu :

- dashboard affiché ;

- score visible ;

- statistiques principales visibles ;

- état loading géré ;

- aucune erreur bloquante.

### 6.2 CF-DASH-002 — Dashboard sans données

Priorité : P1

Objectif : vérifier l'état vide.

Préconditions :

- utilisateur sans statistiques.

Étapes :

1. Se connecter avec un utilisateur sans stats.

2. Accéder au dashboard.

Résultat attendu :

- message d'état vide clair ;

- proposition de synchroniser ou connecter un compte ;

- aucune erreur d'affichage.

### 6.3 CF-STATS-001 — Synchroniser des statistiques mockées

Priorité : P0

Objectif : vérifier que la synchronisation mock fonctionne.

Préconditions :

- MockProvider activé ;

- utilisateur connecté.

Étapes :

1. Cliquer sur synchroniser les statistiques.

2. Attendre la réponse.

3. Vérifier le dashboard.

Résultat attendu :

- synchronisation réussie ;

- statistiques mises à jour ;

- lastSyncAt mis à jour ;

- aucun appel Steam/Epic obligatoire.

### 6.4 CF-STATS-002 — Calculs affichés cohérents

Priorité : P0

Objectif : vérifier les valeurs calculées.

Étapes :

1. Consulter les stats d'un joueur seedé.

2. Vérifier K/D, winrate, matchesPlayed et score.

Résultat attendu :

- valeurs cohérentes ;

- division par zéro gérée ;

- score calculé côté back-end ;

- front ne modifie pas le score.

### 6.5 CF-STATS-003 — Provider indisponible

Priorité : P1

Objectif : vérifier le fallback en cas d'échec provider.

Préconditions :

- provider réel désactivé ou simulé en échec.

Étapes :

1. Déclencher une synchronisation.

2. Observer le message utilisateur.

Résultat attendu :

- erreur contrôlée ;

- cache ou MockProvider utilisé si disponible ;

- anciennes données conservées ;

- message clair.

## 7 Parcours leaderboards

### 7.1 CF-LB-001 — Consulter le leaderboard solo

Priorité : P0

Objectif : vérifier que le classement solo est consultable.

Préconditions :

- données seedées ;

- plusieurs joueurs avec scores.

Étapes :

1. Accéder à la page leaderboard.

2. Observer la liste.

Résultat attendu :

- joueurs affichés ;

- score affiché ;

- rang affiché ;

- tri décroissant par score.

### 7.2 CF-LB-002 — Voir sa position dans le leaderboard

Priorité : P0

Objectif : vérifier que l'utilisateur peut identifier son classement.

Préconditions :

- utilisateur connecté ;

- utilisateur présent dans le leaderboard.

Étapes :

1. Aller sur leaderboard.

2. Chercher le joueur connecté ou utiliser section "mon rang" si prévue.

Résultat attendu :

- rang utilisateur visible ;

- score cohérent ;

- indication claire si non classé.

### 7.3 CF-LB-003 — Joueur non éligible

Priorité : P0

Objectif : vérifier la règle d'éligibilité.

Préconditions :

- joueur avec moins que le minimum de parties.

Étapes :

1. Consulter son dashboard ou leaderboard.

2. Vérifier son statut.

Résultat attendu :

- joueur non classé ou marqué non éligible ;

- explication claire ;

- leaderboard non faussé.

### 7.4 CF-LB-004 — Leaderboard avec filtre jeu ou saison

Priorité : P1

Objectif : vérifier les filtres si disponibles.

Étapes :

1. Choisir un jeu.

2. Choisir une saison.

3. Observer le classement.

Résultat attendu :

- données filtrées correctement ;

- état vide si aucun résultat ;

- URL ou état UI cohérent.

## 8 Parcours équipes

### 8.1 CF-TEAM-001 — Créer une équipe

Priorité : P0

Objectif : vérifier qu'un utilisateur connecté peut créer une équipe.

Préconditions :

- utilisateur connecté ;

- utilisateur autorisé à créer une équipe.

Étapes :

1. Aller sur la page équipes.

2. Cliquer sur créer une équipe.

3. Saisir nom et tag valides.

4. Valider.

Résultat attendu :

- équipe créée ;

- utilisateur devient CAPTAIN ;

- page équipe accessible ;

- équipe visible dans le profil.

### 8.2 CF-TEAM-002 — Créer une équipe avec données invalides

Priorité : P0

Cas à tester :

- nom vide ;

- nom trop court ;

- tag trop long ;

- tag déjà utilisé si unicité prévue.

Résultat attendu :

- création refusée ;

- message d'erreur clair ;

- aucune équipe invalide créée.

### 8.3 CF-TEAM-003 — Rejoindre une équipe avec code valide

Priorité : P0

Objectif : vérifier le parcours de rejoindre une équipe.

Préconditions :

- équipe existante ;

- code invitation valide ;

- utilisateur connecté non membre.

Étapes :

1. Ouvrir l'écran rejoindre équipe.

2. Saisir le code valide.

3. Valider.

Résultat attendu :

- utilisateur ajouté à l'équipe ;

- rôle MEMBER attribué ;

- accès page équipe ;

- accès chat autorisé.

### 8.4 CF-TEAM-004 — Rejoindre avec code invalide

Priorité : P0

Objectif : vérifier le refus d'un code invalide.

Étapes :

1. Saisir un code faux.

2. Valider.

Résultat attendu :

- utilisateur non ajouté ;

- message d'erreur clair ;

- tentative éventuellement comptabilisée pour rate limiting.

### 8.5 CF-TEAM-005 — Quitter une équipe

Priorité : P1

Objectif : vérifier qu'un membre peut quitter une équipe si règle autorisée.

Préconditions :

- utilisateur membre d'une équipe.

Étapes :

1. Aller sur page équipe.

2. Cliquer sur quitter.

3. Confirmer.

Résultat attendu :

- utilisateur retiré ;

- accès chat supprimé ;

- équipe non visible dans son espace ;

- si capitaine, règle spécifique appliquée.

### 8.6 CF-TEAM-006 — Action capitaine par membre simple

Priorité : P0

Objectif : vérifier les permissions de rôle équipe.

Préconditions :

- un capitaine ;

- un membre simple.

Étapes :

1. Se connecter comme membre simple.

2. Tenter de régénérer le code invitation ou supprimer l'équipe.

Résultat attendu :

- action refusée ;

- API retourne 403 ;

- aucune modification effectuée.

## 9 Parcours invitations d'équipe

### 9.1 CF-INV-001 — Afficher le code invitation

Priorité : P0 si code invitation MVP

Objectif : vérifier que le capitaine peut afficher ou générer un code d'équipe.

Préconditions :

- utilisateur CAPTAIN ;

- équipe existante.

Étapes :

1. Ouvrir la page équipe.

2. Accéder à la section invitation.

Résultat attendu :

- code visible au capitaine ;

- code non visible aux utilisateurs non autorisés si règle prévue.

### 9.2 CF-INV-002 — Régénérer un code invitation

Priorité : P1

Objectif : vérifier qu'un capitaine peut régénérer le code.

Étapes :

1. Cliquer sur régénérer.

2. Confirmer.

Résultat attendu :

- nouveau code généré ;

- ancien code invalide ;

- action limitée si rate limiting prévu.

### 9.3 CF-INV-003 — Ancien code après régénération

Priorité : P1

Objectif : vérifier que l'ancien code ne fonctionne plus.

Étapes :

1. Régénérer le code.

2. Se connecter avec un autre utilisateur.

3. Tenter de rejoindre avec l'ancien code.

Résultat attendu :

- accès refusé ;

- message clair.

## 10 Parcours chat d'équipe

### 10.1 CF-CHAT-001 — Consulter l'historique du chat

Priorité : P0

Objectif : vérifier qu'un membre peut consulter les messages de son équipe.

Préconditions :

- utilisateur membre ;

- messages existants.

Étapes :

1. Ouvrir la page équipe.

2. Aller dans l'onglet chat.

Résultat attendu :

- messages affichés ;

- auteur et date visibles ;

- contenu lisible ;

- pagination ou chargement géré si nécessaire.

### 10.2 CF-CHAT-002 — Envoyer un message

Priorité : P0

Objectif : vérifier qu'un membre peut envoyer un message.

Préconditions :

- utilisateur membre ;

- socket connecté.

Étapes :

1. Saisir un message valide.

2. Envoyer.

3. Observer le chat.

Résultat attendu :

- message affiché ;

- message sauvegardé ;

- autres membres connectés le reçoivent ;

- senderId correspond à l'utilisateur connecté.

### 10.3 CF-CHAT-003 — Envoyer un message vide

Priorité : P0

Objectif : vérifier la validation du message.

Étapes :

1. Saisir un message vide ou espaces uniquement.

2. Envoyer.

Résultat attendu :

- message refusé ;

- aucune sauvegarde ;

- aucun broadcast ;

- message d'erreur discret.

### 10.4 CF-CHAT-004 — Non-membre accédant au chat

Priorité : P0

Objectif : vérifier que le chat reste privé.

Préconditions :

- utilisateur non membre ;

- équipe existante.

Étapes :

1. Tenter d'ouvrir l'URL du chat.

2. Tenter de rejoindre la room Socket.io.

3. Tenter d'appeler l'endpoint messages.

Résultat attendu :

- accès refusé ;

- aucun message visible ;

- room non rejointe ;

- API retourne 403.

### 10.5 CF-CHAT-005 — Message trop long

Priorité : P1

Objectif : vérifier la limite de taille.

Étapes :

1. Saisir un message dépassant la limite.

2. Envoyer.

Résultat attendu :

- message refusé ;

- erreur claire ;

- aucune sauvegarde.

### 10.6 CF-CHAT-006 — XSS dans le chat

Priorité : P1

Objectif : vérifier que le chat n'exécute pas de contenu HTML/JS.

Étapes :

1. Envoyer un message contenant une balise HTML ou script.

2. Observer l'affichage.

Résultat attendu :

- le contenu est échappé ou refusé ;

- aucun script n'est exécuté.

## 11 Parcours saisons et archives

### 11.1 CF-SEAS-001 — Consulter la saison active

Priorité : P1

Objectif : vérifier que la saison active est visible.

Préconditions :

- saison active seedée.

Étapes :

1. Accéder au dashboard ou leaderboard.

2. Observer la saison affichée.

Résultat attendu :

- saison active visible ;

- dates cohérentes ;

- données liées à cette saison.

### 11.2 CF-SEAS-002 — Consulter une archive de saison

Priorité : P1

Objectif : vérifier que les archives sont consultables si la fonctionnalité est développée.

Étapes :

1. Accéder aux saisons archivées.

2. Choisir une saison passée.

3. Observer le leaderboard snapshot.

Résultat attendu :

- archive accessible ;

- données figées ;

- données utilisateur supprimé anonymisées si applicable.

## 12 Parcours notifications

### 12.1 CF-NOTIF-001 — Consulter ses notifications

Priorité : P2 ou P1 si développé

Objectif : vérifier que l'utilisateur peut consulter ses notifications.

Préconditions :

- notifications seedées.

Étapes :

1. Se connecter.

2. Ouvrir le centre de notifications.

Résultat attendu :

- notifications visibles ;

- seules les notifications de l'utilisateur connecté sont visibles.

### 12.2 CF-NOTIF-002 — Marquer une notification comme lue

Priorité : P2

Objectif : vérifier le changement d'état.

Résultat attendu :

- notification marquée lue ;

- compteur mis à jour.

## 13 Parcours PWA et navigation

### 13.1 CF-PWA-001 — Rafraîchir une page privée

Priorité : P0

Objectif : vérifier que le refresh ne casse pas la navigation.

Préconditions :

- utilisateur connecté sur dashboard.

Étapes :

1. Rafraîchir la page.

2. Observer le comportement.

Résultat attendu :

- page rechargée correctement si session valide ;

- redirection login si session invalide ;

- pas d'écran bloqué.

### 13.2 CF-PWA-002 — Déconnexion et retour arrière navigateur

Priorité : P0

Objectif : vérifier que les données privées ne restent pas visibles après logout.

Étapes :

1. Se connecter.

2. Aller sur dashboard.

3. Se déconnecter.

4. Cliquer sur retour navigateur.

Résultat attendu :

- données privées non visibles ;

- redirection login ou état déconnecté.

### 13.3 CF-PWA-003 — Mode offline simple

Priorité : P1

Objectif : vérifier le comportement offline si PWA activée.

Étapes :

1. Charger l'application.

2. Couper le réseau.

3. Naviguer ou rafraîchir.

Résultat attendu :

- page offline neutre ou message clair ;

- aucune donnée sensible exposée indûment.

## 14 Parcours mode démo

### 14.1 CF-DEMO-001 — Connexion au compte démo

Priorité : P0

Objectif : vérifier que le compte démo fonctionne.

Préconditions :

- seed démo exécuté.

Étapes :

1. Ouvrir login.

2. Saisir les identifiants du compte démo.

3. Se connecter.

Résultat attendu :

- connexion réussie ;

- dashboard rempli ;

- parcours soutenance possible.

### 14.2 CF-DEMO-002 — Présenter le dashboard démo

Priorité : P0

Objectif : vérifier que la démo est convaincante.

Résultat attendu :

- stats visibles ;

- score visible ;

- leaderboard accessible ;

- équipe et chat disponibles.

### 14.3 CF-DEMO-003 — Fonctionnement sans Steam/Epic

Priorité : P0

Objectif : vérifier que la démo ne dépend pas des APIs externes.

Préconditions :

- STEAM_PROVIDER_ENABLED=false ;

- EPIC_PROVIDER_ENABLED=false ;

- MOCK_PROVIDER_ENABLED=true.

Étapes :

1. Lancer l'application.

2. Se connecter au compte démo.

3. Synchroniser les stats ou consulter les stats.

Résultat attendu :

- stats disponibles ;

- aucune clé externe nécessaire ;

- aucun blocage de démo.

## 15 Parcours erreurs et états vides

### 15.1 CF-ERR-001 — Erreur API contrôlée

Priorité : P0

Objectif : vérifier que le front affiche une erreur claire en cas d'échec API.

Étapes :

1. Simuler une erreur API.

2. Observer l'affichage.

Résultat attendu :

- message compréhensible ;

- pas de stack trace visible ;

- possibilité de réessayer si pertinent.

### 15.2 CF-ERR-002 — Liste vide

Priorité : P1

Objectif : vérifier les états vides.

Pages concernées :

- leaderboard ;

- équipe ;

- chat ;

- notifications ;

- comptes de jeu.

Résultat attendu :

- message clair ;

- aucune erreur graphique ;

- action suggérée si utile.

### 15.3 CF-ERR-003 — Erreur 403

Priorité : P0

Objectif : vérifier l'affichage d'un accès interdit.

Étapes :

1. Tenter une action non autorisée.

2. Observer l'interface.

Résultat attendu :

- message accès refusé ;

- pas de donnée privée affichée ;

- comportement cohérent.

## 16 Parcours complet de recette fonctionnelle

### 16.1 CF-REC-001 — Parcours utilisateur principal

Priorité : P0

Objectif : valider le parcours principal du MVP.

Étapes :

1. Lancer Docker.

2. Se connecter au compte démo.

3. Consulter le dashboard.

4. Synchroniser ou consulter les statistiques.

5. Consulter le leaderboard.

6. Ouvrir la page équipe.

7. Lire le chat.

8. Envoyer un message.

9. Se déconnecter.

Résultat attendu :

- parcours complet sans bug bloquant ;

- données cohérentes ;

- aucune erreur critique ;

- application présentable.

### 16.2 CF-REC-002 — Parcours sécurité fonctionnelle

Priorité : P0

Objectif : vérifier les refus d'accès essentiels.

Étapes :

1. Accéder au dashboard sans token.

2. Accéder au chat comme non-membre.

3. Tenter une action capitaine comme membre simple.

4. Vérifier que les données sensibles ne sont pas visibles.

Résultat attendu :

- refus corrects ;

- messages clairs ;

- aucune fuite de données.

## 17 Matrice de couverture fonctionnelle

| Domaine | Cas P0 couverts | Cas P1/P2 prévus |

|---|---|---|

| Visiteur | landing, pages privées refusées | leaderboard public |

| Auth | inscription, login, logout, session | token expiré avancé |

| Profil | consultation, ownership | modification avancée |

| Dashboard | affichage, stats, sync mock | état vide enrichi |

| Stats | K/D, winrate, score | provider réel |

| Leaderboard | tri, rang, éligibilité | filtres, pagination |

| Équipes | créer, rejoindre, permissions | quitter, gestion avancée |

| Invitations | code valide/invalide | régénération |

| Chat | lire, envoyer, refuser non-membre | XSS, rate limiting |

| PWA | refresh, logout | offline |

| Démo | compte, mock, data | multi-comptes |

| Sécurité | 401, 403, secrets | tests avancés |

## 18 Critères d'acceptation fonctionnels MVP

Le MVP est fonctionnellement acceptable si :

- un visiteur accède à la landing page ;

- un utilisateur peut s'inscrire ;

- un utilisateur peut se connecter ;

- un utilisateur peut se déconnecter ;

- les pages privées sont protégées ;

- le dashboard affiche des statistiques ;

- le score est cohérent ;

- le leaderboard est affiché et trié ;

- un utilisateur peut rejoindre ou consulter une équipe ;

- le chat d'équipe fonctionne pour les membres ;

- le chat refuse les non-membres ;

- le mode démo fonctionne sans Steam/Epic ;

- les erreurs importantes sont gérées proprement ;

- aucune donnée sensible n'est affichée.

## 19 Gestion des anomalies fonctionnelles

### 19.1 Anomalie bloquante

Exemples :

- impossible de se connecter ;

- dashboard inaccessible ;

- Docker ne démarre pas ;

- chat inutilisable ;

- non-membre peut lire le chat ;

- score incohérent partout.

Action : correction obligatoire avant soutenance.

### 19.2 Anomalie majeure

Exemples :

- affichage responsive cassé sur une page ;

- message d'erreur peu clair ;

- filtre leaderboard non fonctionnel ;

- état vide absent.

Action : correction si temps disponible, sinon contournement documenté.

### 19.3 Anomalie mineure

Exemples :

- faute de texte ;

- espacement UI ;

- libellé améliorable ;

- micro-décalage visuel.

Action : correction si temps disponible.

## 20 Conclusion

Les cas de tests fonctionnels permettent de vérifier que Track'N Share répond bien aux besoins utilisateur du MVP.

Ils couvrent les principaux parcours : inscription, connexion, dashboard, statistiques, leaderboards, équipes, invitations, chat, PWA, mode démo et erreurs.

Ces cas doivent être utilisés comme support de validation pendant le développement et comme base de recette avant la soutenance.

Le plus important est de garantir que le parcours principal soit fluide, que les données de démonstration soient cohérentes et que les accès sensibles soient correctement refusés.
