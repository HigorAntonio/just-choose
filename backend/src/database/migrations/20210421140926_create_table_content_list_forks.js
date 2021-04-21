const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('content_list_forks', (table) => {
      table.increments('id').primary();
      table
        .integer('original_list_id')
        .references('content_lists.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('forked_list_id')
        .references('content_lists.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('content_list_forks')));

exports.down = async (knex) => knex.schema.dropTable('content_list_forks');
