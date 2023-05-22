# Stage 1: Building the Vue application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run the built application
FROM node:18-alpine as prod

WORKDIR /app

COPY --from=build /app/dist .

RUN npm install -g serve

EXPOSE 3600
ENV VUE_APP_PORT=3600

CMD ["serve", "-s", "."]
