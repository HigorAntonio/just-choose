const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('games', (table) => {
      table.increments('id').primary();
      table.text('rawg_id').unique().notNullable();
      table.text('name').notNullable();
      table.text('background_image').notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('games')));

exports.down = async (knex) => knex.schema.dropTable('games');
