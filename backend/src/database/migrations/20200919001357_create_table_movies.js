const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('movies', (table) => {
      table.increments('id').primary();
      table.text('tmdb_id').unique().notNullable();
      table.text('title').notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('movies')));

exports.down = async (knex) => knex.schema.dropTable('movies');
