#FROM node:18-alpine
#WORKDIR /usr/src/app
#COPY package*.json ./
#RUN npm i
#COPY . .
#RUN npm run build --workspace=product-service
#EXPOSE 3001
#CMD ["node", "dist/apps/product-service/main.js"]


# Build stage
# FROM node:18-alpine AS builder
# WORKDIR /usr/src/app
#
# # Install deps
# COPY package*.json nx.json tsconfig.base.json ./
# RUN npm ci
#
# # Copy only product-service source and configs
# COPY ./product-service /usr/src/app/product-service
# COPY tsconfig.json jest.config.ts ./
#
# # Build the service
# RUN npm run build --workspace=product-service
#
# # Runtime stage
# FROM node:18-alpine AS runner
# WORKDIR /usr/src/app
#
# COPY --from=builder /usr/src/app/dist/apps/product-service ./dist
#
# EXPOSE 3001
# CMD ["node", "dist/main.js"]


# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy root files
COPY package*.json nx.json tsconfig.base.json ./
COPY product-service ./product-service

# Install dependencies
RUN npm install

# Build only product-service
RUN npx nx build product-service

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy build artifacts from builder
COPY --from=builder /usr/src/app/dist/product-service ./dist

EXPOSE 3001
CMD ["node", "dist/main.js"]

