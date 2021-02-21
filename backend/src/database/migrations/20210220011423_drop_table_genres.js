const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) => knex.schema.dropTable('genres');

exports.down = async (knex) =>
  knex.schema
    .createTable('genres', (table) => {
      table.increments('id').primary();
      table.string('name', 50).unique().notNullable();
      table.string('short_name', 10).unique().notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('genres')));
