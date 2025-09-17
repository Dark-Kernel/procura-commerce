# FROM node:18-alpine
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build --workspace=api-gateway
# EXPOSE 3000
# CMD ["node", "dist/apps/api-gateway/main.js"]


# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy root files
COPY package*.json nx.json tsconfig.base.json ./
COPY api-gateway ./api-gateway

# Install dependencies
RUN npm install

# Build only api-gateway
RUN npx nx build api-gateway

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy build artifacts from builder
COPY --from=builder /usr/src/app/dist/api-gateway ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]

