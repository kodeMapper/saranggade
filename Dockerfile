FROM ghcr.io/puppeteer/puppeteer:23.0.0

# Switch to root user to install dependencies if needed
USER root

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (ignoring scripts to avoid potential errors)
RUN npm ci --ignore-scripts

# Copy the rest of the application code
COPY . .

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Expose the port the app runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "backend/server.js"]
