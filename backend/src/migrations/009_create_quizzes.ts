import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('quizzes', (table) => {
        table.bigIncrements('id').primary();
        table
            .bigInteger('section_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('sections')
            .onDelete('CASCADE');
        table.string('title', 255).notNullable();
        table.integer('passing_score').notNullable().defaultTo(50);
        table.timestamps(true, true);

        table.unique(['section_id']);
    });

    await knex.schema.createTable('questions', (table) => {
        table.bigIncrements('id').primary();
        table
            .bigInteger('quiz_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('quizzes')
            .onDelete('CASCADE');
        table.text('question_text').notNullable();
        table.json('options').notNullable(); // Stored as JSON array
        table.string('correct_answer', 255).notNullable();
        table.integer('order_index').notNullable();
        table.timestamps(true, true);
    });

    await knex.schema.createTable('quiz_results', (table) => {
        table.bigIncrements('id').primary();
        table
            .bigInteger('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table
            .bigInteger('quiz_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('quizzes')
            .onDelete('CASCADE');
        table.integer('score').notNullable();
        table.boolean('passed').notNullable().defaultTo(false);
        table.timestamps(true, true);

        table.unique(['user_id', 'quiz_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('quiz_results');
    await knex.schema.dropTableIfExists('questions');
    await knex.schema.dropTableIfExists('quizzes');
}
