# Use an official Node.js runtime as a parent image
FROM node:18-alpine as build

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

FROM node:18-alpine as prod

WORKDIR /app

COPY --from=build /app/dist .

# Expose the port the application will listen on
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:prod"]