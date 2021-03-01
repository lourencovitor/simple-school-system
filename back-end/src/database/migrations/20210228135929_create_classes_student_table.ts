import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('classes_student', (table) => {
    table.increments('id');
    table.uuid('secure_id');
    table
      .integer('class_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('classes');
    table
      .integer('student_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('students');
    table.boolean('status');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropSchema('classes_student');
}
