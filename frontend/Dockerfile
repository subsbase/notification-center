# Stage 1: Building the Vue application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run the built application
FROM node:18-alpine as prod

LABEL org.opencontainers.image.source=https://github.com/subsbase/notification-center
LABEL org.opencontainers.image.description="A notification center solves the problem of managing and organizing multiple notifications from various features and services within a platform. Without a notification center, users would have to constantly check different parts of the platform for updates, messages, or reminders, which can be confusing and time-consuming. Moreover, important notifications may be missed, leading to missed opportunities or other critical information."
LABEL org.opencontainers.image.licenses=LGPL-3.0-or-later

WORKDIR /app

COPY --from=build /app/dist .

RUN npm install -g serve

EXPOSE 3600
ENV VUE_APP_PORT=3600

CMD ["serve", "-s", "."]
