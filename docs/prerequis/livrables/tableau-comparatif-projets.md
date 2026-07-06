# Tableau comparatif des deux projets supports (Partie 1 §3 du dossier)

> À insérer en Partie 1 pour annoncer la double source de preuves. Chaque
> compétence de la Partie 2 s'appuie ensuite sur le contexte le plus probant.

| | 🏢 **Chaîne maintenance Roofline** | 🎓 **Track'N Share** |
|---|---|---|
| **Contexte** | Alternance — agence web Roofline (Albi), besoin exprimé par la gérante | Projet de formation Ynov B3, binôme avec Ioanes (back-end) |
| **Mon rôle** | Conception et développement **de bout en bout** des 2 logiciels (reprise d'une ébauche v1 co-écrite avec Jordan Nickol) | **Front-end web + PWA + application mobile en intégralité**, co-conception du contrat d'API |
| **Livrables** | Plugin WordPress (PHP, ~5 600 lignes) + dashboard Laravel 13 (~16 000 lignes) | Monorepo : web React 18/Vite (PWA), mobile Expo/React Native, package de types partagés ; API NestJS (binôme) |
| **État** | **En production** sur l'hébergement OVH de l'agence — **17 clients** en maintenance | Démonstrable de bout en bout (Docker + seed + comptes démo), CI verte |
| **Échanges de données** | CSV normalisé + API REST v1 + webhook (SHA-256), API Google Search Console (OAuth2), SMTP OVH, crons | API REST + Socket.io consommés par 2 clients (web + mobile), export RGPD, provider Steam |
| **Qualité** | 91 tests PHPUnit/WP_Mock (TDD), audit + roadmap estimée, monitoring cron | 76 tests (46 unit API + 8 e2e + 22 front) **bloquants en CI**, lint zéro-warning, TypeScript strict, audit RGAA 100/100 |
| **DevOps** | CI/CD GitHub Actions → **déploiement continu rsync/SSH vers OVH** | CI GitHub Actions bloquante (lint+build+tests+e2e sur Postgres/Redis provisionnés), Docker multi-tiers |
| **Ce que ce projet prouve le mieux** | BC02 (pilotage, CI/CD prod, délais), BC04 (échange inter-logiciels), C2.2 (réingénierie), C2.10 (décideur) | BC01 (sécurité outillée, RGAA), BC03 (tests, multi-plateforme), C1.3 (architecture), RGPD |
| **Limites assumées** | Historique git re-publié (v1 non versionnée), SQLite (pas MySQL), CI sans tests | Stats mockées (MockProvider assumé pour la démo), pas de refresh token |
