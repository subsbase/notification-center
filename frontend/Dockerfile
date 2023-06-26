# Stage 1: Build the project
FROM node:18 AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Create a lightweight image to serve the built files
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

LABEL org.opencontainers.image.source=https://github.com/subsbase/notification-center
LABEL org.opencontainers.image.description="A notification center solves the problem of managing and organizing multiple notifications from various features and services within a platform. Without a notification center, users would have to constantly check different parts of the platform for updates, messages, or reminders, which can be confusing and time-consuming. Moreover, important notifications may be missed, leading to missed opportunities or other critical information."
LABEL org.opencontainers.image.licenses=LGPL-3.0-or-later

EXPOSE 3600
RUN npm install -g vite
CMD ["vite", "preview", "--port", "3600", "--host", "0.0.0.0"]