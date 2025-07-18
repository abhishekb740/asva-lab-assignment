#!/bin/sh

set -e

echo "Entrypoint: Running database migrations..."
node /app/scripts/migrate.js

echo "Entrypoint: Migrations complete. Starting server..."
exec "$@"
