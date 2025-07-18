// backend/scripts/migrate.js
const path = require('path');
const migrationConfig = require('../migrate-config');

async function runMigration() {
    console.log("Running database migration..........");

    try {
        const { runner } = await import('node-pg-migrate');

        const config = {
            ...migrationConfig,
            direction: 'up',
            count: Infinity,
            verbose: true,
            createSchema: true,
            createMigrationsSchema: true
        };

        await runner(config);

        console.log("Migration completed successfully!");

    } catch (err) {
        console.error('Error running migrations:', err);
        process.exit(1);
    }
}

runMigration();
