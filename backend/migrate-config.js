require('dotenv').config();

const DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`;

module.exports = {
  migrationsTable: 'pgmigrations',
  dir: 'migrations',
  databaseUrl: DATABASE_URL,
  decamelize: true,
  ssl: process.env.NODE_ENV === 'production',
};
