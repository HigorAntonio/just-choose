const { onUpdateTrigger } = require('../triggers');

exports.up = async knex => knex.schema.createTable('poll_movies', table => {
  table.increments('id').primary();
  table.integer('poll_id')
    .references('polls.id')
    .notNullable()
    .onUpdate('CASCADE')
    .onDelete('CASCADE');
  table.integer('movie_id')
    .references('movies.id')
    .notNullable()
    .onUpdate('CASCADE')
    .onDelete('CASCADE');

  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
  table.timestamp('deleted_at');
}).then(() => knex.raw(onUpdateTrigger('poll_movies')));

exports.down = async knex => knex.schema.dropTable('poll_movies');
