import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.bigIncrements('id').primary();
        table.string('email', 255).notNullable().unique();
        table.string('password_hash', 255).notNullable();
        table.string('name', 255).notNullable();
        table.timestamps(true, true);

        table.index('email');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('users');
}
