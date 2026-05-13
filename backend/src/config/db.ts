import knex from 'knex';
import { env } from './env';

const db = knex({
    client: 'mysql2',
    connection: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        ...(env.DB_SSL ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    pool: {
        min: 0,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
    },
    migrations: {
        directory: '../migrations',
        extension: 'ts',
    },
    seeds: {
        directory: '../seeds',
        extension: 'ts',
    },
});

export default db;
