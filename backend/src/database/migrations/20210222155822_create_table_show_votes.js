const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('show_votes', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .references('users.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('show_id')
        .references('shows.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('poll_id')
        .references('polls.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('show_votes')));

exports.down = async (knex) => knex.schema.dropTable('show_votes');
