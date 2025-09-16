FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --workspace=order-service
EXPOSE 3002
CMD ["node", "dist/apps/order-service/main.js"]

