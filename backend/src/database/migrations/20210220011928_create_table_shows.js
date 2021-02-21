const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('shows', (table) => {
      table.increments('id').primary();
      table.integer('tmdb_id').unique().notNullable();
      table.text('original_name').notNullable();
      table.text('name').notNullable();
      table.text('poster_path').notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('shows')));

exports.down = async (knex) => knex.schema.dropTable('shows');
