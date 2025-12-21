# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Runtime stage with Nginx
FROM nginx:alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 101 -S www && \
    adduser -S www-data -u 101 -G www

# Create necessary directories with proper permissions
RUN mkdir -p /var/log/nginx && \
    chown -R www-data:www /var/log/nginx && \
    chown -R www-data:www /var/cache/nginx && \
    chown -R www-data:www /var/run && \
    chown -R www-data:www /etc/nginx && \
    chown -R www-data:www /usr/share/nginx/html

# Switch to non-root user
USER www-data

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
