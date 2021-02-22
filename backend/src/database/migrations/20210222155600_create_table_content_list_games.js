const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('content_list_games', (table) => {
      table.increments('id').primary();
      table
        .integer('content_list_id')
        .references('content_lists.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('game_id')
        .references('games.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('content_list_games')));

exports.down = async (knex) => knex.schema.dropTable('content_list_games');
