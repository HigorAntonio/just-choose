const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('local_users', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .references('users.id')
        .notNullable()
        .unique()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('name', 50).unique().notNullable();
      table.string('email', 50).unique().notNullable();
      table.string('password', 50).notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('local_users')));

exports.down = async (knex) => knex.schema.dropTable('local_users');
