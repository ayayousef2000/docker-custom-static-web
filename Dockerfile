# ---- Stage 1: Build Environment ----
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 py3-pip

RUN pip3 install mkdocs --break-system-packages

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# ---- Stage 2: Production Environment ----
FROM nginx:1.25-alpine

COPY --from=builder /app/site /usr/share/nginx/html

EXPOSE 80