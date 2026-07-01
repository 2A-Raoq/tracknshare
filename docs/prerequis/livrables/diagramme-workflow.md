# Diagramme de workflow documentaire & de développement — Track'N Share

> **Livrable RNCP — BC02-3** « Formaliser la circulation des documents (diagramme de workflow) ».
> Date : 2026-07-01. Diagrammes en Mermaid (rendus par GitHub / VS Code).

## 1. Circulation des documents du projet

```mermaid
flowchart TD
    A[Besoins / cahier des charges<br/>docs/drive-export/01-Gestion-Projet] --> B[Spécifications fonctionnelles<br/>02-Documentation-Fonctionnelle]
    B --> C[Architecture & modèle de données<br/>04-Architecture-Technique + 06-Diagrammes-UML]
    C --> D[Contrat d'API<br/>00-AI-Context/api-contract.md]
    D --> E[Développement<br/>apps/api · apps/web · apps/mobile]
    E --> F[Documentation technique<br/>Swagger + 07-API-Documentation]
    E --> G[Tests & recette<br/>plan-de-tests.md · 10-Tests]
    G --> H[PV de réception<br/>pv-reception.md]
    F --> I[Dossier de validation RNCP<br/>docs/prerequis]
    G --> I
    H --> I
    C --> I
```

## 2. Workflow de développement (feature → production)

```mermaid
flowchart LR
    A[Backlog priorisé<br/>P0/P1/P2] --> B[Branche de feature]
    B --> C[Développement + tests locaux]
    C --> D[Pull Request]
    D --> E{CI GitHub Actions}
    E -->|lint + build + tests OK| F[Revue de code]
    E -->|échec| C
    F --> G[Fusion sur main]
    G --> H[Build images Docker]
    H --> I[docker compose up<br/>api + web + postgres + redis]
    I --> J[Recette / démo]
```

## 3. Flux de données applicatif (échange d'informations)

```mermaid
flowchart LR
    subgraph Clients
      W[Web React/Vite]
      M[Mobile Expo/RN]
    end
    W -- REST JSON / JWT --> API[(API NestJS)]
    M -- REST JSON / JWT --> API
    W -- Socket.io --> API
    M -- Socket.io --> API
    API --> PG[(PostgreSQL)]
    API --> R[(Redis cache)]
    API -- sync stats --> STEAM[Steam API]
```

## 4. Lecture

Ces diagrammes formalisent trois circulations complémentaires : **documentaire**
(du besoin au dossier de validation), **de développement** (de la feature à la
mise en exploitation via la CI), et **de données** (entre clients, API et
services externes) — couvrant les exigences BC02-3 et éclairant BC04.
