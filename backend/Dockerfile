FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json .

COPY --from=development /app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS prod

LABEL org.opencontainers.image.source=https://github.com/subsbase/notification-center
LABEL org.opencontainers.image.description="A notification center solves the problem of managing and organizing multiple notifications from various features and services within a platform. Without a notification center, users would have to constantly check different parts of the platform for updates, messages, or reminders, which can be confusing and time-consuming. Moreover, important notifications may be missed, leading to missed opportunities or other critical information."
LABEL org.opencontainers.image.licenses=LGPL-3.0-or-later

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV PORT=8080
EXPOSE 8080

CMD [ "node", "dist/main.js" ]