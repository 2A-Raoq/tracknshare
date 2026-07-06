# Modèle d'attestation entreprise — à faire signer par Guillaume Jos

> **Usage.** Copier le texte ci-dessous dans un document en-tête Roofline (Word/Docs),
> le faire relire et adapter par Guillaume (c'est LUI qui atteste : il doit être
> à l'aise avec chaque phrase), imprimer, signer, scanner → annexe du dossier CDAN.
> Les passages `[entre crochets]` sont à compléter/vérifier. Rien n'est survendu :
> chaque affirmation correspond à ce qui existe dans les dépôts et en production.

---

**ATTESTATION DE MISSIONS EN ENTREPRISE**

Je soussigné **Guillaume JOS**, développeur senior au sein de l'agence
**Roofline** (agence web 360°, 16 rue de la République, 81000 Albi), atteste
que **Clément FABRE**, alternant développeur au sein de notre équipe depuis
**[date de début d'alternance]**, en préparation du titre professionnel
Concepteur Développeur d'Applications Numériques (RNCP 36463), a réalisé dans
le cadre de son alternance, sous mon tutorat, les missions suivantes :

**1. Conception et développement du plugin WordPress « Rapport Maintenance »**

Outil interne développé pour automatiser le suivi de la maintenance mensuelle
des sites de nos clients. Une première version rudimentaire (fichier PHP unique,
sans tests ni gestion de versions) avait été ébauchée en collaboration avec
Jordan NICKOL, développeur de l'équipe. Clément a ensuite **repris et refondu
seul cet outil** : architecture modulaire, mise en place d'une suite de tests
automatisés (PHPUnit, ~90 tests, démarche TDD), collecte automatique des mises
à jour effectuées sur les sites, checklists paramétrées par forfait de
maintenance, export de rapports au format CSV et exposition d'une API
sécurisée par jeton.

Ce plugin est aujourd'hui **déployé sur les sites de nos clients sous contrat
de maintenance ([17] clients à ce jour)**.

**2. Conception et développement du tableau de bord de maintenance
(« rapport-maintenance-interface »)**

Application web (PHP 8.3 / Laravel) née d'un besoin exprimé par la direction de
l'agence : centraliser les rapports de maintenance de l'ensemble des clients.
Clément a conçu et développé cette application de bout en bout : agrégation des
rapports produits par le plugin (via API et webhook, avec contrôle d'intégrité),
intégration de l'API Google Search Console (OAuth2) pour enrichir les rapports
de données de référencement, envoi automatisé et programmé des rapports mensuels
aux clients par e-mail (SMTP OVH), supervision des tâches planifiées, et mise
en place d'un **déploiement continu (GitHub Actions) vers notre hébergement
OVH**, où l'application est **exploitée en production** par l'agence.

**3. Autres missions**

Clément a par ailleurs participé à la réalisation de sites WordPress pour nos
clients, à des automatisations de processus internes (Make, Automa), au
développement d'un module Prestashop, ainsi qu'à des interventions ponctuelles
sur des projets menés par les autres développeurs de l'équipe.

**Appréciation**

Au cours de ces missions, Clément a fait preuve d'autonomie dans la conception
et la réalisation, d'une démarche de qualité logicielle (tests automatisés,
gestion de versions, documentation), et d'une bonne communication avec l'équipe
et la direction. Les livrables décrits ci-dessus sont utilisés quotidiennement
par l'agence ; les retours de nos clients sur les rapports mensuels sont
positifs.

Les dépôts de code publiés par Clément sur son compte GitHub personnel
(`clement-fbe/rapport-maintenance` et `clement-fbe/rapport-maintenance-interface`)
correspondent au travail réalisé au sein de l'agence, re-publié avec notre
accord à des fins de présentation au jury.

Fait à Albi, le [date]

Pour faire valoir ce que de droit,

**Guillaume JOS**
Développeur senior — Roofline
[Signature + tampon de l'agence]

---

> **Notes pour Clément (à supprimer avant impression) :**
> - Vérifier avec Guillaume : la date de début d'alternance, le nombre exact de
>   clients, et qu'il valide la mention de re-publication des dépôts (elle
>   désamorce la question piège du jury sur l'historique git).
> - Si la gérante préfère signer elle-même (ou co-signer), c'est encore mieux :
>   elle est la commanditaire de l'interface (compétence C2.10 « présenter aux
>   décideurs »).
> - Joindre en annexe à côté : capture du dashboard en production (connecté,
>   données clients masquées) + un exemple de mail mensuel anonymisé.
