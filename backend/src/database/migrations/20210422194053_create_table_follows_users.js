const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('follows_users', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .references('users.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('follows_id')
        .references('users.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('follows_users')));

exports.down = async (knex) => knex.schema.dropTable('follows_users');
