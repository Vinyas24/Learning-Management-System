import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // 1. Alter Users Table safely
    const hasXp = await knex.schema.hasColumn('users', 'xp');
    if (!hasXp) {
        await knex.schema.alterTable('users', (table) => {
            table.integer('xp').notNullable().defaultTo(0);
            table.integer('current_streak').notNullable().defaultTo(0);
            table.integer('longest_streak').notNullable().defaultTo(0);
            table.date('last_active_date').nullable();
        });
    }

    // 2. Create Certificates Table safely
    const hasCertificates = await knex.schema.hasTable('certificates');
    if (!hasCertificates) {
        await knex.schema.createTable('certificates', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable()
                .references('id').inTable('users').onDelete('CASCADE');
            table.integer('subject_id').unsigned().notNullable()
                .references('id').inTable('subjects').onDelete('CASCADE');
            table.uuid('certificate_hash').notNullable().unique();
            table.timestamp('issued_at').notNullable().defaultTo(knex.fn.now());

            table.unique(['user_id', 'subject_id']);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('certificates');
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('xp');
        table.dropColumn('current_streak');
        table.dropColumn('longest_streak');
        table.dropColumn('last_active_date');
    });
}
