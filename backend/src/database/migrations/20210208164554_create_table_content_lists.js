const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('content_lists', (table) => {
      table.increments('id').primary();
      table.string('title', 50).notNullable();
      table.text('description');
      table.text('thumbnail');

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('content_lists')));

exports.down = async (knex) => knex.schema.dropTable('content_lists');
