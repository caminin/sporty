# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install su-exec for privilege dropping in entrypoint
RUN apk add --no-cache su-exec

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy exercises data (seed pour initialisation volume vide)
COPY --chown=nextjs:nodejs app/exercises/default-seed.json ./app/exercises/default-seed.json

# Entrypoint: chown /data pour permettre l'écriture par nextjs (volume Docker)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# L'entrypoint s'exécute en root, chown /data, puis lance node en tant que nextjs
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "server.js"]