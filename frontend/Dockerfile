# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
# Copy root files
COPY package*.json nx.json tsconfig.base.json ./
COPY frontend ./frontend
# Install dependencies
RUN npm install
# Build only frontend
RUN npx nx build frontend
# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app
# Install production dependencies
COPY package*.json ./
RUN npm install --only=production
# Copy build artifacts from builder
# Copy Next.js static files
COPY --from=builder /usr/src/app/frontend/.next ./.next
COPY --from=builder /usr/src/app/frontend/public ./public
EXPOSE 4000
CMD ["npm", "start"]
