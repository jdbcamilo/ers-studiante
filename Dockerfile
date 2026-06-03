# Use pre-built PHP image with ALL Laravel extensions already installed
FROM serversideup/php:8.4-fpm-nginx AS base

# Switch to root for setup
USER root

# Install Node.js 20 + SQLite
RUN apt-get update \
    && apt-get install -y --no-install-recommends nodejs npm sqlite3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# Install Composer dependencies first (caching)
COPY --chown=www-data:www-data composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# Install Node dependencies and build frontend
COPY --chown=www-data:www-data package.json package-lock.json ./
RUN npm ci

# Copy all application code
COPY --chown=www-data:www-data . .

# Generate wayfinder routes (needed for Vite build)
RUN composer dump-autoload --optimize --no-dev \
    && php artisan wayfinder:generate 2>/dev/null || true

# Build frontend assets
RUN npm run build

# Clean up node_modules (not needed at runtime)
RUN rm -rf node_modules

# Create required directories
RUN mkdir -p storage/framework/{sessions,views,cache} storage/logs database bootstrap/cache \
    && touch database/database.sqlite \
    && chown -R www-data:www-data storage bootstrap/cache database

# Cache Laravel config
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# Copy startup script to the correct location for serversideup images
COPY docker-entrypoint.sh /etc/entrypoint.d/99-init-app.sh
RUN chmod +x /etc/entrypoint.d/99-init-app.sh

# Switch back to www-data
USER www-data

# The serversideup image handles Nginx + PHP-FPM automatically
# Railway sets PORT env var, the image respects it via NGINX_LISTEN_PORT
ENV NGINX_LISTEN_PORT=${PORT:-8080}
