# Build stage
FROM node:20-slim as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Use node to serve the app
FROM node:20-slim

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files
COPY --from=build /app/dist .

EXPOSE 3050

# Start serve - listen on all interfaces
CMD ["serve", "-s", ".", "-l", "tcp://0.0.0.0:3050"] 