const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) => knex.schema.dropTable('genres');

exports.down = async (knex) =>
  knex.schema
    .createTable('genres', (table) => {
      table.increments('id').primary();
      table.text('name').unique().notNullable();
      table.text('short_name').unique().notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('genres')));
