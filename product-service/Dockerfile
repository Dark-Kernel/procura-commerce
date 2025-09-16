FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --workspace=product-service
EXPOSE 3001
CMD ["node", "dist/apps/product-service/main.js"]

