import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('classes', (table) => {
    table.increments('id');
    table.uuid('secure_id');
    table
      .integer('teacher_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('teachers');
    table.string('name');
    table.date('start_date');
    table.date('end_date');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropSchema('classes');
}
