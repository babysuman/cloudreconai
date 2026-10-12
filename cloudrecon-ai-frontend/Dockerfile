# ---- Stage 1: Build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .
# VITE_API_URL is baked in at build time; override via build-arg in docker-compose
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Stage 2: Serve with nginx + HTTPS ----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

RUN printf 'server {\n\
  listen 80;\n\
  return 301 https://$host$request_uri;\n\
}\n\
server {\n\
