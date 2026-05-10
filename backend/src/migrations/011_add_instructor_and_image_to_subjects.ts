import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const hasInstructorId = await knex.schema.hasColumn('subjects', 'instructor_id');
    const hasImageUrl = await knex.schema.hasColumn('subjects', 'image_url');

    await knex.schema.alterTable('subjects', (table) => {
        if (!hasInstructorId) {
            table.bigInteger('instructor_id').unsigned().nullable();
            table.foreign('instructor_id').references('id').inTable('users').onDelete('SET NULL');
        }
        if (!hasImageUrl) {
            table.string('image_url', 512).nullable();
        }
    });
}

export async function down(knex: Knex): Promise<void> {
    const hasInstructorId = await knex.schema.hasColumn('subjects', 'instructor_id');
    const hasImageUrl = await knex.schema.hasColumn('subjects', 'image_url');

    await knex.schema.alterTable('subjects', (table) => {
        if (hasInstructorId) {
            table.dropForeign(['instructor_id']);
            table.dropColumn('instructor_id');
        }
        if (hasImageUrl) {
            table.dropColumn('image_url');
        }
    });
}
