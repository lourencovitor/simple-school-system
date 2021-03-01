import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('teachers', (table) => {
    table.increments('id');
    table.uuid('secure_id');
    table
      .integer('user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users');
    table.string('matter');
    table.string('formation');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropSchema('teachers');
}
