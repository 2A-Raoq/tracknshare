# syntax=docker/dockerfile:1

# ============================================================
#  Track'N Share — Web React/Vite (build multi-stage)
#  Contexte de build attendu : racine du dépôt
#    docker build -f apps/web/Dockerfile .
#
#  Les URLs API/Socket sont injectées au build via VITE_* ;
#  par défaut le bundle pointe vers http://localhost:3000
#  (l'API publiée sur l'hôte), ce qui convient à la démo locale.
# ============================================================

# ---------- Stage 1 : build ----------
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# Manifests d'abord (cache de couches)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

# URLs injectées au build (valeur par défaut = API publiée sur l'hôte).
# Surchargeables via --build-arg. Ne PAS laisser vide : '' écraserait le
# fallback du code (?? ne rattrape pas la chaîne vide).
ARG VITE_API_URL=http://localhost:3000/api
ARG VITE_SOCKET_URL=http://localhost:3000
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

COPY . .
RUN pnpm --filter web build

# ---------- Stage 2 : runtime (Nginx statique) ----------
FROM nginx:1.27-alpine AS runner
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
