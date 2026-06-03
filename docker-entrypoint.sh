#!/bin/bash
set -e

echo "🚀 Starting ERS-Studiante..."

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Create SQLite database if it doesn't exist
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "📦 Creating SQLite database..."
    touch /var/www/html/database/database.sqlite
fi

# Cache configuration
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
echo "🗄️ Running migrations..."
php artisan migrate --force --no-interaction

# Seed if empty
QUESTIONNAIRE_COUNT=$(php artisan tinker --execute="echo \App\Models\Questionnaire::count();" 2>/dev/null || echo "0")
if [ "$QUESTIONNAIRE_COUNT" = "0" ] || [ -z "$QUESTIONNAIRE_COUNT" ]; then
    echo "🌱 Seeding database..."
    php artisan db:seed --force --no-interaction
fi

php artisan storage:link 2>/dev/null || true

echo "✅ ERS-Studiante is ready!"
