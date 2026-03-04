import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('sections', (table) => {
        table.bigIncrements('id').primary();
        table
            .bigInteger('subject_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('subjects')
            .onDelete('CASCADE');
        table.string('title', 255).notNullable();
        table.integer('order_index').notNullable();
        table.timestamps(true, true);

        table.unique(['subject_id', 'order_index']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('sections');
}
