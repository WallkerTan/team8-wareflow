# ---------- Stage 1: build ----------
FROM node:22-alpine AS build
WORKDIR /app

# Copy trước manifest để tận dụng cache layer cho npm ci
COPY package*.json ./
RUN npm ci

COPY . .

# Vite build với biến môi trường runtime
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Copy static assets từ stage build
COPY --from=build /app/dist/ ./

# Config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
