# Use Node.js base image
FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 8050

# Start the application
CMD ["npm", "start"]