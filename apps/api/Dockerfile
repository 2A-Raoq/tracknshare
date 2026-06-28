# syntax=docker/dockerfile:1

# ============================================================
#  Track'N Share — API NestJS (build multi-stage, monorepo pnpm)
#  Contexte de build attendu : racine du dépôt
#    docker build -f apps/api/Dockerfile .
# ============================================================

# ---------- Stage 1 : build ----------
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# Manifests d'abord pour profiter du cache de couches Docker
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

# Code source puis build de l'API
COPY . .
RUN pnpm --filter api build

# Génère un dossier autonome (deps de prod uniquement + dist).
# --legacy requis depuis pnpm v10 pour déployer sans inject-workspace-packages.
RUN pnpm --filter api --prod --legacy deploy /app/out

# ---------- Stage 2 : runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Récupère le livrable autonome (node_modules de prod + package.json).
COPY --from=builder /app/out ./
# pnpm deploy respecte .gitignore et exclut donc dist : on l'ajoute explicitement.
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 3000

# Healthcheck HTTP via l'endpoint /api/health (vérifie le serveur ; renvoie
# 200 si l'app répond — le détail DB/Redis est dans le corps de la réponse).
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health',r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist/main.js"]
