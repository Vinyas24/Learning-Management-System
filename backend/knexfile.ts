import { env } from './src/config/env';

module.exports = {
    client: 'mysql2',
    connection: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        ...(env.DB_SSL ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    migrations: {
        directory: './src/migrations',
        extension: 'ts',
    },
    seeds: {
        directory: './src/seeds',
        extension: 'ts',
    },
};
