import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('subjects', (table) => {
        table.bigIncrements('id').primary();
        table.string('title', 255).notNullable();
        table.string('slug', 255).notNullable().unique();
        table.text('description').nullable();
        table.boolean('is_published').notNullable().defaultTo(false);
        table.timestamps(true, true);

        table.index('slug');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('subjects');
}
