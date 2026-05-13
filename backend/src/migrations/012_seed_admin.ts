import type { Knex } from 'knex';
import { hashPassword } from '../utils/password';

const ADMIN_EMAIL = 'admin@learnflow.com';
const ADMIN_NAME = 'Platform Admin';
const ADMIN_PASSWORD = 'Admin@1234'; // Change via env in production

export async function up(knex: Knex): Promise<void> {
    const existing = await knex('users').where({ email: ADMIN_EMAIL }).first();
    if (!existing) {
        const password_hash = await hashPassword(ADMIN_PASSWORD);
        await knex('users').insert({
            email: ADMIN_EMAIL,
            password_hash,
            name: ADMIN_NAME,
            role: 'admin',
        });
    } else if (existing.role !== 'admin') {
        // Ensure existing account is promoted to admin
        await knex('users').where({ email: ADMIN_EMAIL }).update({ role: 'admin' });
    }
}

export async function down(knex: Knex): Promise<void> {
    // Do not delete admin on rollback — too destructive
}
