FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
