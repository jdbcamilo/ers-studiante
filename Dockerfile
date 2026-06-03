# ============================================================
# Stage 1: Install PHP deps + generate wayfinder routes
# ============================================================
FROM php:8.3-cli-alpine AS php-deps

RUN apk add --no-cache sqlite-dev oniguruma-dev libxml2-dev icu-dev
RUN docker-php-ext-install pdo_sqlite mbstring intl xml ctype tokenizer

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --prefer-dist --no-interaction

COPY . .
RUN composer dump-autoload --optimize --no-dev

# Generate wayfinder routes and actions (needed for Vite build)
RUN php artisan wayfinder:generate 2>/dev/null || true


# ============================================================
# Stage 2: Build frontend assets (Vite + React)
# ============================================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Copy all source needed for build
COPY resources/ resources/
COPY vite.config.ts tsconfig.json components.json ./
COPY public/ public/

# Copy generated wayfinder/routes/actions from PHP stage
COPY --from=php-deps /app/resources/js/wayfinder resources/js/wayfinder/
COPY --from=php-deps /app/resources/js/actions resources/js/actions/
COPY --from=php-deps /app/resources/js/routes resources/js/routes/

# Build production assets
RUN npm run build


# ============================================================
# Stage 3: PHP + Nginx production image
# ============================================================
FROM php:8.3-fpm-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    sqlite \
    sqlite-dev \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    icu-dev \
    linux-headers \
    bash

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_sqlite \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl \
    xml \
    ctype \
    tokenizer

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy PHP deps from stage 1
COPY --from=php-deps /app/vendor vendor/

# Copy all application code
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize --no-dev

# Copy generated routes/actions/wayfinder
COPY --from=php-deps /app/resources/js/wayfinder resources/js/wayfinder/
COPY --from=php-deps /app/resources/js/actions resources/js/actions/
COPY --from=php-deps /app/resources/js/routes resources/js/routes/

# Copy built frontend assets from Stage 2
COPY --from=frontend /app/public/build public/build

# Create required directories
RUN mkdir -p \
    storage/framework/sessions \
    storage/framework/views \
    storage/framework/cache \
    storage/logs \
    database \
    bootstrap/cache

# Set proper permissions
RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache \
    database

RUN chmod -R 775 \
    storage \
    bootstrap/cache \
    database

# Copy Nginx config
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Copy supervisor config
COPY docker/supervisord.conf /etc/supervisord.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port (Railway uses PORT env var)
EXPOSE 8080

# Start via entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
