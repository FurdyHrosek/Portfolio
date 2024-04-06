# Use Node.js 14 as the base image
FROM node:14 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for dependencies installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create necessary directories
RUN mkdir -p dist/html dist/css dist/js

# Use Webpack to build the project
RUN npm run build


# Use an official Nginx image as the base
FROM nginx:alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Copy only the necessary files from the build stage
COPY --from=build /app/assets/images /usr/share/nginx/html/dist/images
COPY --from=build /app/dist/js /usr/share/nginx/html/dist/js
COPY --from=build /app/index.html /usr/share/nginx/html/index.html

# Expose port 80 to the outside world
EXPOSE 80

# Add volume to allow hot-reloading
VOLUME /app
