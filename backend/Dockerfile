
# Use Node.js 20 Alpine (lightweight)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the development server
CMD ["npm", "run", "dev"]
