const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('movie_genres', (table) => {
      table.increments('id').primary();
      table
        .integer('movie_id')
        .references('movies.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('genre_id')
        .references('genres.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('movie_genres')));

exports.down = async (knex) => knex.schema.dropTable('movie_genres');
