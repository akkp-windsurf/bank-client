# Multi-stage build for React frontend
FROM node:18-alpine AS base

# Install security updates and image optimization dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init gifsicle optipng pngquant libjpeg-turbo-utils && \
    rm -rf /var/cache/apk/*

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Development stage
FROM base AS development

# Install all dependencies including dev dependencies
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy source code
COPY . .

# Change ownership to app user
RUN chown -R reactjs:nodejs /app
USER reactjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start development server
CMD ["dumb-init", "yarn", "start"]

# Build stage
FROM base AS builder

# Install all dependencies
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy source code
COPY . .

# Build the application with legacy OpenSSL provider for Node.js 18 compatibility
RUN NODE_OPTIONS="--openssl-legacy-provider" yarn build

# Production stage with Nginx
FROM nginx:1.25-alpine AS production

# Install security updates
RUN apk update && apk upgrade && \
    rm -rf /var/cache/apk/*

# Create nginx user for security
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R nginx-app:nginx-app /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html

# Switch to non-root user
USER nginx-app

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
