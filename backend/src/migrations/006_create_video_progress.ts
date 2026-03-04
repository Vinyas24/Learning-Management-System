import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('video_progress', (table) => {
        table.bigIncrements('id').primary();
        table
            .bigInteger('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table
            .bigInteger('video_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('videos')
            .onDelete('CASCADE');
        table.integer('last_position_seconds').notNullable().defaultTo(0);
        table.boolean('is_completed').notNullable().defaultTo(false);
        table.timestamp('completed_at').nullable();
        table.timestamps(true, true);

        table.unique(['user_id', 'video_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('video_progress');
}
