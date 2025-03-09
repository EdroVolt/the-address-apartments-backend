FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/main.js"]
