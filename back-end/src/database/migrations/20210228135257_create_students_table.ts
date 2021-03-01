import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('students', (table) => {
    table.increments('id');
    table.uuid('secure_id');
    table
      .integer('user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users');
    table.integer('age');
    table.string('interest_area');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropSchema('students');
}
