import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.uuid('secure_id');
    table.string('name');
    table.string('email');
    table.string('password');
    table.string('rg');
    table.string('cpf');
    table.date('dateOfBirth');
    table.string('phoneNumber');
    table.enum('gender', ['M', 'F', 'O']);

    table.unique(['email', 'rg', 'cpf']);

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropSchema('users');
}
