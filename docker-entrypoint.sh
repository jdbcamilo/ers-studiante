#!/bin/bash
set -e

echo "🚀 Starting ERS-Studiante deployment..."

# Use Railway's PORT or default to 8080
export PORT=${PORT:-8080}

# Update Nginx to use the correct port
sed -i "s/listen 8080/listen ${PORT}/" /etc/nginx/http.d/default.conf

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Create SQLite database if it doesn't exist
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "📦 Creating SQLite database..."
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
    chmod 775 /var/www/html/database/database.sqlite
fi

# Cache configuration for production
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
echo "🗄️ Running migrations..."
php artisan migrate --force --no-interaction

# Run seeders (only if the questionnaires table is empty)
QUESTIONNAIRE_COUNT=$(php artisan tinker --execute="echo \App\Models\Questionnaire::count();" 2>/dev/null || echo "0")
if [ "$QUESTIONNAIRE_COUNT" = "0" ] || [ -z "$QUESTIONNAIRE_COUNT" ]; then
    echo "🌱 Seeding database with clinical questionnaires..."
    php artisan db:seed --force --no-interaction
fi

# Ensure storage link exists
php artisan storage:link 2>/dev/null || true

echo "✅ ERS-Studiante is ready!"
echo "🌐 Listening on port ${PORT}"

# Start Supervisor (manages PHP-FPM + Nginx)
exec /usr/bin/supervisord -c /etc/supervisord.conf
