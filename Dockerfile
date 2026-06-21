FROM node:20-slim

# Install git for auto-commit functionality
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (ignoring scripts to avoid potential errors)
RUN npm ci --ignore-scripts

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "backend/server.js"]
