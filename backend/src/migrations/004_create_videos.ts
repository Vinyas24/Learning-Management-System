import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('videos', (table) => {
        table.bigIncrements('id').primary();
        table
            .bigInteger('section_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('sections')
            .onDelete('CASCADE');
        table.string('title', 255).notNullable();
        table.text('description').nullable();
        table.string('youtube_url', 500).notNullable();
        table.integer('order_index').notNullable();
        table.integer('duration_seconds').nullable();
        table.timestamps(true, true);

        table.unique(['section_id', 'order_index']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('videos');
}
