# FROM node:18-alpine
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build --workspace=order-service
# EXPOSE 3002
# CMD ["node", "dist/apps/order-service/main.js"]
#

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy root files
COPY package*.json nx.json tsconfig.base.json ./
COPY order-service ./order-service

# Install dependencies
RUN npm install

# Build only order-service
RUN npx nx build order-service

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy build artifacts from builder
COPY --from=builder /usr/src/app/dist/order-service ./dist

EXPOSE 3002
CMD ["node", "dist/main.js"]

