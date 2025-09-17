# ---- base: used for building (needs dev deps) ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# add tools required for build
RUN apk add --no-cache python3 make g++ bash

# copy root manifests and common config (locks important)
COPY package.json package-lock.json nx.json tsconfig.base.json ./
# install full deps (dev + prod) for building all workspaces
RUN npm ci

# copy entire repo (nx needs workspace sources & libs)
COPY . .

# ---- builders: build each workspace into /usr/src/app/dist ----
FROM base AS api-gateway-builder
RUN npx nx build api-gateway

FROM base AS product-service-builder
RUN npx nx build product-service

FROM base AS order-service-builder
RUN npx nx build order-service

FROM base AS frontend-builder
RUN npx nx build frontend

# ---- production: api-gateway ----
FROM node:20-alpine AS api-gateway-production
WORKDIR /usr/src/app
ENV NODE_ENV=production

# copy root manifests and lockfile to install production deps only
COPY package.json package-lock.json nx.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# copy only the built app (assumes builder output at dist/api-gateway)
COPY --from=api-gateway-builder /usr/src/app/dist/api-gateway ./dist
# copy any runtime assets the app expects (adjust if different)
#COPY --from=api-gateway-builder /usr/src/app/env ./env 2>/dev/null || true

# create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000
CMD ["node", "dist/main.js"]

# ---- production: product-service ----
FROM node:20-alpine AS product-service-production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json package-lock.json nx.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=product-service-builder /usr/src/app/dist/product-service ./dist
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs
EXPOSE 3001
CMD ["node", "dist/main.js"]

# ---- production: order-service ----
FROM node:20-alpine AS order-service-production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json package-lock.json nx.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=order-service-builder /usr/src/app/dist/order-service ./dist
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs
EXPOSE 3002
CMD ["node", "dist/main.js"]

# ---- production: frontend (Next) ----
FROM node:20-alpine AS frontend-production
WORKDIR /usr/src/app
ENV NODE_ENV=production

# copy frontend package fields from root (Next runtime needs package.json)
# if you have a separate package.json inside frontend folder, copy that instead:
COPY package.json package-lock.json nx.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# copy built frontend output from builder (adjust path if Nx outputs elsewhere)
COPY --from=frontend-builder /usr/src/app/frontend/.next ./.next
#COPY --from=frontend-builder /usr/src/app/frontend/.next ./.next
COPY --from=frontend-builder /usr/src/app/frontend/public ./public
# next may require next.config.js or other runtime files from frontend
#RUN  ls -la /usr/src/app/
#COPY --from=frontend-builder /usr/src/app/frontend/next.config.mjs ./next.config.mjs 2>/dev/null || true


RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs
EXPOSE 4000
CMD ["npm", "run", "next:start"]

