FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies first (leverages Docker layer caching)
COPY package*.json ./
RUN npm ci --only=production=false

# Copy source and build TypeScript
COPY . .
RUN npm run build

# Production stage — only include built artifacts and production deps
FROM node:18-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output from build stage
COPY --from=base /app/dist ./dist

EXPOSE 5000

# Run the compiled JavaScript entry point
CMD ["node", "dist/index.js"]
