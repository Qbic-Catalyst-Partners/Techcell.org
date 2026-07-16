# Use official Node.js image as the base image
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Use nginx as the base image for serving Angular app
FROM nginx:alpine

# Copy built Angular app from the previous stage to the nginx html directory
COPY --from=builder /dist/tech-cell/browser /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
